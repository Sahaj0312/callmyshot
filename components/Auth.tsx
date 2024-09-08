import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithPopup, GoogleAuthProvider, AuthError } from "firebase/auth";
import { Button } from "@/components/ui/button";

export function Auth() {
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Detailed error:", error);
      setError(
        `Failed to sign in with Google: ${(error as AuthError).message}`
      );
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button
        onClick={signInWithGoogle}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        Sign in with Google
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
