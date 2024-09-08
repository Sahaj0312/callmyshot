"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, MessageCircle, Heart, Share2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Home, Bell, Mail, User, MoreHorizontal } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Auth } from "@/components/Auth";
import {
  addShot,
  getRecentShots,
  Shot,
  likeShot,
  unlikeShot,
  getShot,
  addComment,
} from "@/lib/firestore";

export default function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [shots, setShots] = useState<Shot[]>([]);
  const [newShotContent, setNewShotContent] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [selectedShot, setSelectedShot] = useState<Shot | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchRecentShots();
    }
  }, [user]);

  const fetchRecentShots = async () => {
    if (!user) return; // Ensure user is authenticated before fetching
    try {
      const recentShots = await getRecentShots();
      setShots(recentShots);
    } catch (error) {
      console.error("Error fetching recent shots:", error);
      // Optionally, set an error state and display it to the user
    }
  };

  const handleNewShot = async () => {
    if (!user || !newShotContent.trim()) return;

    try {
      const newShot: Omit<Shot, "id"> = {
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userHandle: `@${user.uid.slice(0, 8)}`,
        userAvatar: user.photoURL || "/placeholder.svg?height=40&width=40",
        content: newShotContent,
        timestamp: new Date(),
        comments: [],
        likes: [],
        dateCalled: new Date().toISOString().split("T")[0],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0], // 30 days from now
      };

      await addShot(newShot);
      setNewShotContent("");
      fetchRecentShots();
    } catch (error) {
      console.error("Error adding new shot:", error);
      // Optionally, set an error state and display it to the user
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleLike = async (shotId: string) => {
    if (!user) return;
    try {
      const shot = await getShot(shotId);
      if (shot) {
        if (shot.likes && shot.likes.includes(user.uid)) {
          await unlikeShot(shotId, user.uid);
        } else {
          await likeShot(shotId, user.uid);
        }
        await fetchRecentShots();
      }
    } catch (error) {
      console.error("Error liking/unliking shot:", error);
      // Optionally, show an error message to the user
    }
  };

  const handleComment = async (shotId: string) => {
    if (!user || !commentContent.trim()) return;
    try {
      const newComment = {
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        content: commentContent,
        timestamp: new Date(),
      };
      await addComment(shotId, newComment);
      setCommentContent("");
      await fetchRecentShots();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const openComments = async (shot: Shot) => {
    setSelectedShot(shot);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 hidden md:block">
        <div className="flex items-center mb-6">
          <Target className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-2" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            CallMyShot
          </span>
        </div>
        <nav className="space-y-2">
          <Link href="/" passHref>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start text-black dark:text-white"
          >
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-black dark:text-white"
          >
            <Mail className="mr-2 h-4 w-4" />
            Messages
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-black dark:text-white"
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </nav>
        <Button
          variant="ghost"
          className="w-full justify-start text-black dark:text-white mt-4"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
        <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
          New Shot
        </Button>
      </aside>

      {/* Main content */}
      <main className="flex-1 max-w-2xl mx-auto">
        <header className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Home
          </h1>
        </header>

        {/* Tabs */}
        <Tabs defaultValue="foryou" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="foryou" className="flex-1">
              For You
            </TabsTrigger>
            <TabsTrigger value="following" className="flex-1">
              Following
            </TabsTrigger>
          </TabsList>
          <TabsContent value="foryou">
            {/* New shot input */}
            <Card className="mb-4">
              <CardContent className="pt-4">
                <div className="flex space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={
                        user.photoURL || "/placeholder.svg?height=40&width=40"
                      }
                    />
                    <AvatarFallback>
                      {user.displayName?.[0] || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Input
                      placeholder="What's your next shot?"
                      className="mb-2"
                      value={newShotContent}
                      onChange={(e) => setNewShotContent(e.target.value)}
                    />
                    <Button onClick={handleNewShot}>Call Your Shot</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent shots */}
            {shots.map((shot) => (
              <Card
                key={shot.id}
                className="mb-4 bg-gray-50 dark:bg-gray-700 border-none shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex space-x-3">
                      <Avatar>
                        <AvatarImage src={shot.userAvatar} />
                        <AvatarFallback>{shot.userName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{shot.userName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {shot.userHandle}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-bold text-gray-900 dark:text-white mb-2">
                    &ldquo;{shot.content}&rdquo;
                  </p>
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="mr-4">Called: {shot.dateCalled}</span>
                    <span>Deadline: {shot.deadline}</span>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-gray-200 dark:border-gray-600 pt-2">
                  <div className="flex justify-between w-full text-gray-500 dark:text-gray-400">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openComments(shot)}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {shot.comments.length}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(shot.id)}
                    >
                      <Heart
                        className={`h-4 w-4 mr-2 ${
                          shot.likes && shot.likes.includes(user.uid)
                            ? "fill-red-500"
                            : ""
                        }`}
                      />
                      {shot.likes ? shot.likes.length : 0}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="following">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">
                  No shots from people you follow yet.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Comments Modal */}
      {selectedShot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Comments</h3>
            <div className="max-h-64 overflow-y-auto mb-4">
              {selectedShot.comments.map((comment) => (
                <div key={comment.id} className="mb-2">
                  <p className="font-semibold">{comment.userName}</p>
                  <p>{comment.content}</p>
                </div>
              ))}
            </div>
            <div className="flex">
              <Input
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Add a comment..."
                className="mr-2"
              />
              <Button onClick={() => handleComment(selectedShot.id)}>
                Post
              </Button>
            </div>
            <Button className="mt-4" onClick={() => setSelectedShot(null)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
