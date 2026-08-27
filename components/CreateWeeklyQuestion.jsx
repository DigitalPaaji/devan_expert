"use client";

import axios from "axios";
import React, { useRef, useState } from "react";
import {
  FiArrowLeft,
  FiCheck,
  FiFile,
  FiImage,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { base_url } from "./utils";

const CreateWeeklyQuestion = ({ setShowCreate }) => {
  const fileInputRef = useRef(null);

  const [question, setQuestion] = useState({
    question: "",
    image: null,
  });

  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");

    // 10 MB limit
    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("File size must be less than 10 MB.");
      e.target.value = "";
      return;
    }

    setQuestion((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const removeFile = () => {
    setQuestion((prev) => ({
      ...prev,
      image: null,
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit =  async (e) => {
    e.preventDefault();

    if (!question.question.trim()) {
      toast.error("Please enter the weekly question.");
      return;
    }

try {
const formData = new FormData()

formData.append("question",question.question)
if(question.image){formData.append("image",question.image)}
const response = await axios.post(`${base_url}/challenges/create`,formData,{
    withCredentials:true
})

const data = await response.data;

if(data.success){
    toast.success(data.message)
    setShowCreate(false)
}
else{
    toast.error(data.message)

}







} catch (error) {
    toast.error(error?.response?.data?.message)
}

 
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";

    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Create Weekly Question
            </h2>

            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Add this week's question and optional supporting material.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreate(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900"
          >
            <FiX size={19} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 p-5">
          {/* Question */}
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-800 dark:text-neutral-200">
              Weekly Question
            </label>

            <textarea
              value={question.question}
              onChange={(e) =>
                setQuestion((prev) => ({
                  ...prev,
                  question: e.target.value,
                }))
              }
              placeholder="Enter the weekly challenge question..."
              rows={6}
              className="w-full resize-none rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-black focus:ring-2 focus:ring-black/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-white dark:focus:ring-white/10"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-800 dark:text-neutral-200">
              Supporting File
              <span className="ml-2 text-xs font-normal text-neutral-500 dark:text-neutral-500">
                Optional
              </span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />

            {!question.image ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-5 py-10 transition hover:border-black hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900/50 dark:hover:border-white dark:hover:bg-neutral-900"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-neutral-700 shadow-sm dark:bg-neutral-800 dark:text-neutral-300">
                  <FiUploadCloud size={24} />
                </div>

                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  Click to upload a file
                </p>

                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">
                  Images, videos, PDF, DOC, ZIP and other files
                </p>

                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">
                  Maximum file size: 10 MB
                </p>
              </button>
            ) : (
              <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                    {question.image.type?.startsWith("image/") ? (
                      <FiImage size={21} />
                    ) : (
                      <FiFile size={21} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-neutral-900 dark:text-white">
                      {question.image.name}
                    </p>

                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">
                      {formatFileSize(question.image.size)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-neutral-200 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                >
                  <FiX size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-neutral-300 bg-neutral-100 px-4 py-3 text-sm text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
              {error}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-neutral-200 pt-5 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="rounded-xl border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              <FiCheck size={17} />
              Create Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWeeklyQuestion;