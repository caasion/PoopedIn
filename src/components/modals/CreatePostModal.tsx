"use client";

import { useState, useRef } from "react";
import { useUser } from "@/context/UserContext";
import type { PostData } from "@/types";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: PostData) => void;
}

export default function CreatePostModal({
  isOpen,
  onClose,
  onPostCreated,
}: CreatePostModalProps) {
  const { currentUser, currentUserId } = useUser();
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!imageFile) {
      setError("A photo is required to drop a poop.");
      return;
    }
    if (!currentUserId) return;

    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("caption", caption);
      formData.append("userId", currentUserId);

      const res = await fetch("/api/posts", { method: "POST", body: formData });

      if (res.status === 422) {
        const data = await res.json();
        setError(data.error ?? "No poop detected. This is PoopedIn, not LinkedIn.");
        return;
      }
      if (!res.ok) throw new Error("Upload failed");

      const post: PostData = await res.json();
      onPostCreated(post);
      handleClose();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setCaption("");
    setImageFile(null);
    setImagePreview(null);
    setError("");
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Create a Poop</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-5">
            {/* User header */}
            {currentUser && (
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-11 h-11 rounded-full bg-gray-100"
                />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{currentUser.name}</p>
                  <p className="text-xs text-gray-500">Share with your network</p>
                </div>
              </div>
            )}

            {/* Caption */}
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's on your mind? Share your professional insights..."
              className="w-full text-sm text-gray-800 placeholder-gray-400 resize-none outline-none min-h-[80px] leading-relaxed"
              rows={3}
            />

            {/* Image upload area */}
            <div
              className={`mt-3 border-2 border-dashed rounded-lg overflow-hidden transition-colors cursor-pointer ${
                imagePreview
                  ? "border-[#0A66C2]"
                  : "border-gray-200 hover:border-[#0A66C2]"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-64 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-black/80 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <span className="text-4xl mb-2">📸</span>
                  <p className="text-sm font-medium text-gray-500">Add a photo</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Required — no photo, no poop
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {error && (
              <p className="mt-2 text-xs text-red-500">{error}</p>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 pb-5 flex items-center justify-between">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0A66C2] transition-colors font-medium"
            >
              <span>📷</span>
              <span>Photo</span>
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !imageFile}
              className="bg-[#0A66C2] text-white font-semibold px-5 py-2 rounded-full text-sm hover:bg-[#004182] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Verifying... 🔬" : "Drop a Poop"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
