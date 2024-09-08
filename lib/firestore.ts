import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit as firestoreLimit,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
}

export interface Shot {
  id: string;
  userId: string;
  userName: string;
  userHandle: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
  comments: Comment[];
  likes: string[]; // Array of user IDs who liked the shot
  dateCalled: string;
  deadline: string;
}

export async function addShot(shot: Omit<Shot, "id">): Promise<string> {
  const shotWithDefaults = {
    ...shot,
    likes: [],
    comments: [],
  };
  const docRef = await addDoc(collection(db, "shots"), shotWithDefaults);
  return docRef.id;
}

export async function getRecentShots(limitCount: number = 10): Promise<Shot[]> {
  const q = query(
    collection(db, "shots"),
    orderBy("timestamp", "desc"),
    firestoreLimit(limitCount)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      likes: data.likes || [],
      comments: data.comments || [],
    } as Shot;
  });
}

export async function likeShot(shotId: string, userId: string): Promise<void> {
  try {
    const shotRef = doc(db, "shots", shotId);
    await updateDoc(shotRef, {
      likes: arrayUnion(userId),
    });
  } catch (error) {
    console.error("Error liking shot:", error);
    throw new Error("Failed to like the shot. Please try again.");
  }
}

export async function unlikeShot(
  shotId: string,
  userId: string
): Promise<void> {
  try {
    const shotRef = doc(db, "shots", shotId);
    await updateDoc(shotRef, {
      likes: arrayRemove(userId),
    });
  } catch (error) {
    console.error("Error unliking shot:", error);
    throw new Error("Failed to unlike the shot. Please try again.");
  }
}

export async function addComment(
  shotId: string,
  comment: Omit<Comment, "id">
): Promise<string> {
  const shotRef = doc(db, "shots", shotId);
  const newComment = { ...comment, id: Date.now().toString() };
  await updateDoc(shotRef, {
    comments: arrayUnion(newComment),
  });
  return newComment.id;
}

export async function getShot(shotId: string): Promise<Shot | null> {
  const shotRef = doc(db, "shots", shotId);
  const shotDoc = await getDoc(shotRef);
  if (shotDoc.exists()) {
    const data = shotDoc.data();
    return {
      id: shotDoc.id,
      ...data,
      likes: data.likes || [],
      comments: data.comments || [],
    } as Shot;
  }
  return null;
}
