"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <span className="auth-loading">...</span>;
  }

  if (session) {
    return (
      <div className="auth-group">
        <button
          onClick={() => router.push("/dashboard")}
          className="btn btn-secondary"
        >
          Dashboard
        </button>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="auth-signout"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => router.push("/login")}
      className="btn btn-primary"
    >
      Get Started
    </button>
  );
}
