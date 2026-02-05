"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm border rounded-xl p-6">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Login to NitiCopilot
        </p>

        <button
          onClick={() => signIn("github", { callbackUrl: "/app" })}
          className="mt-6 w-full rounded-lg border px-4 py-2"
        >
          Continue with GitHub
        </button>
      </div>
    </div>
  );
}
