"use client";

import { useState } from "react";

export default function OnboardingPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);

  async function createWorkspace() {
    setLoading(true);

    const res = await fetch("/api/tenants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    });

    setLoading(false);

    if (res.ok) {
      window.location.href = "/app/dashboard";
    } else {
      alert("Failed to create workspace");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md border rounded-xl p-6">
        <h1 className="text-xl font-semibold">Create your workspace</h1>
        <p className="text-sm text-muted-foreground mt-1">
          This will hold your organization’s knowledge base.
        </p>

        <div className="mt-4 space-y-3">
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Workspace name (e.g. Acme Corp)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Slug (e.g. acme)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>

        <button
          onClick={createWorkspace}
          disabled={loading}
          className="mt-5 w-full rounded-lg border px-4 py-2"
        >
          {loading ? "Creating..." : "Create Workspace"}
        </button>
      </div>
    </div>
  );
}
