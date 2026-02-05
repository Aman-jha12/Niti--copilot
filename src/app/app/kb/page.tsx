"use client";

import { useState } from "react";

export default function KnowledgeBasePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function uploadFile() {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/kb/upload", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (res.ok) {
      alert("Uploaded successfully");
      setFile(null);
    } else {
      alert("Upload failed");
    }
  }

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-xl font-semibold">Knowledge Base</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Upload documents for your workspace.
      </p>

      <input
        type="file"
        accept=".pdf"
        className="mt-4"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={uploadFile}
        disabled={loading}
        className="mt-4 border rounded-lg px-4 py-2"
      >
        {loading ? "Uploading..." : "Upload PDF"}
      </button>
    </div>
  );
}
