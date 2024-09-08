"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Target,
  Users,
  Share2,
  ChevronRight,
  MoreHorizontal,
  MessageCircle,
  Repeat2,
  Heart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { Auth } from "@/components/Auth";
import { getRecentShots, Shot } from "@/lib/firestore";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [recentShots, setRecentShots] = useState<Shot[]>([]);

  useEffect(() => {
    fetchRecentShots();
  }, []);

  const fetchRecentShots = async () => {
    const shots = await getRecentShots(3);
    setRecentShots(shots);
  };

  const handleViewMoreShots = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      // Show auth modal or redirect to sign-in page
      // For simplicity, we'll just scroll to the auth section
      document
        .getElementById("auth-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <Link className="flex items-center justify-center" href="#">
          <Target className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
          <span className="font-bold text-xl text-gray-900 dark:text-white">
            CallMyShot
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            href="#features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            href="#how-it-works"
          >
            How It Works
          </Link>
          <Link
            className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            href="#recent-shots"
          >
            Recent Shots
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4 md:px-6">
          <div className="container mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-gray-900 dark:text-white">
                  Call Your Shot, Own Your Future.
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Make bold predictions, set ambitious goals, and share your
                  achievements with the world.
                </p>
              </div>
              <div className="space-x-4">
                {user ? (
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => router.push("/dashboard")}
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() =>
                      document
                        .getElementById("auth-section")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Get Started
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-800"
        >
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-gray-900 dark:text-white">
              Key Features
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-gray-50 dark:bg-gray-700 border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <Target className="h-12 w-12 mb-2 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Make Predictions
                  </h3>
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Set goals and make bold claims about future events or
                    achievements.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gray-50 dark:bg-gray-700 border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <Share2 className="h-12 w-12 mb-2 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Share Achievements
                  </h3>
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Get a unique, shareable link when you achieve your predicted
                    goal.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gray-50 dark:bg-gray-700 border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <Users className="h-12 w-12 mb-2 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Engage Community
                  </h3>
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Like, comment, and follow other users&apos; predictions and
                    achievements.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-900"
        >
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-gray-900 dark:text-white">
              How It Works
            </h2>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    1
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Make Your Prediction
                </h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Sign up and create a new prediction or goal with a specific
                  timeframe.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    2
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Work Towards It
                </h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Put in the effort to make your prediction come true.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    3
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Share Your Success
                </h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Mark your prediction as achieved and share your success with
                  the world.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="recent-shots"
          className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-800"
        >
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-gray-900 dark:text-white">
              Recently Called Shots
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentShots.map((shot) => (
                <Card
                  key={shot.id}
                  className="bg-gray-50 dark:bg-gray-700 border-none shadow-lg hover:shadow-xl transition-shadow"
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
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {shot.comments ? shot.comments.length : 0}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Heart className="h-4 w-4 mr-2" />
                        {shot.likes ? shot.likes.length : 0}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900"
                onClick={handleViewMoreShots}
              >
                View More Shots <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
        <section
          id="auth-section"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-900"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900 dark:text-white">
                  {user ? "Welcome!" : "Ready to Call Your Shot?"}
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  {user
                    ? `You're signed in as ${
                        user.displayName || user.email
                      }. Start making your predictions today!`
                    : "Join our community of goal-setters and achievers. Sign in to start making your predictions!"}
                </p>
              </div>
              {!user && <Auth />}
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2023 CallMyShot.com. All rights reserved.
            </p>
            <nav className="flex gap-4">
              <Link
                className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                href="#"
              >
                Terms of Service
              </Link>
              <Link
                className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                href="#"
              >
                Privacy Policy
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
