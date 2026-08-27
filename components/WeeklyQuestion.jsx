"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { base_url } from "./utils";
import {
  FiEye,
  FiFile,
  FiFileText,
  FiImage,
  FiLoader,
  FiTrash2,
  FiVideo,
  FiX,
} from "react-icons/fi";
import Link from "next/link";

const WeeklyQuestion = ({ setShowCreate }) => {
  const [question, setQuestion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchWeekQuestion = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${base_url}/challenges/get`, {
        withCredentials: true,
      });

      const data = response.data;

      if (data.success) {
        setQuestion(data.data || []);
      } else {
        setQuestion([]);
      }
    } catch (error) {
      console.error(error);
      setQuestion([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeekQuestion();
  }, []);

  const handleDelete = async (id) => {
    try {
      setDeleteLoading(id);

      // Change this endpoint according to your backend
      const response = await axios.delete(
        `${base_url}/challenges/delete/${id}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setQuestion((prev) => prev.filter((item) => item._id !== id));
        setDeleteId(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const getFileIcon = (file) => {
    if (!file) return <FiFile size={20} />;

    const extension = file.split(".").pop()?.toLowerCase();

    if (
      ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(extension)
    ) {
      return <FiImage size={20} />;
    }

    if (["mp4", "mov", "avi", "mkv", "webm"].includes(extension)) {
      return <FiVideo size={20} />;
    }

    if (["pdf"].includes(extension)) {
      return <FiFileText size={20} />;
    }

    return <FiFile size={20} />;
  };

  const getFileName = (file) => {
    if (!file) return "No file";

    return file.split("/").pop();
  };

  return (
    <div className="w-full p-5 h-screen overflow-auto">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            Weekly Questions
          </h2>

          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Manage your weekly challenge questions.
          </p>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          Create Question
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px]">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  #
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Question
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Reference File
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {/* Loading */}
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-5 py-16 text-center">
                    <div className="flex items-center justify-center gap-2 text-neutral-500 dark:text-neutral-400">
                      <FiLoader className="animate-spin" size={20} />
                      <span className="text-sm">
                        Loading questions...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : question.length === 0 ? (
                /* Empty */
                <tr>
                  <td colSpan="5" className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
                        <FiFileText size={22} />
                      </div>

                      <p className="font-medium text-neutral-800 dark:text-neutral-200">
                        No questions found
                      </p>

                      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-500">
                        Create your first weekly question.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                question.map((item, index) => (
                  <tr
                    key={item._id}
                    className="transition hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
                  >
                    {/* Number */}
                    <td className="px-5 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                      {index + 1}
                    </td>

                    {/* Question */}
                    <td className="max-w-md px-5 py-4">
                      <p className="line-clamp-2 text-sm font-medium text-neutral-900 dark:text-white">
                        {item.question}
                      </p>
                    </td>

                    {/* File */}
                    <td className="px-5 py-4">
                      {item.referenceImages ? (
                        <div className="flex max-w-[240px] items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400">
                            {getFileIcon(item.referenceImages)}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm text-neutral-800 dark:text-neutral-200">
                              {getFileName(item.referenceImages)}
                            </p>

                            <p className="text-xs text-neutral-500 dark:text-neutral-500">
                              Reference file
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-neutral-400">
                          No file
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                          item.status === "DRAFT"
                            ? "border-neutral-300 bg-neutral-100 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
                            : "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-right">
                      {item.status === "DRAFT" ? (
                        <button
                          onClick={() => setDeleteId(item._id)}
                          className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:border-black hover:bg-black hover:text-white dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
                        >
                          <FiTrash2 size={16} />
                          Delete
                        </button>
                      ) : (
                        <Link
                        href={`/weekly-challenges/${item._id}`}
                         
                          className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:border-black hover:bg-black hover:text-white dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
                        >
                          <FiEye size={16} />
                          View
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-950">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  Delete Question?
                </h3>

                <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                  Are you sure you want to delete this draft question?
                  This action cannot be undone.
                </p>
              </div>

              <button
                onClick={() => setDeleteId(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
              >
                Cancel
              </button>

              <button
                disabled={deleteLoading === deleteId}
                onClick={() => handleDelete(deleteId)}
                className="flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
              >
                {deleteLoading === deleteId ? (
                  <FiLoader className="animate-spin" size={16} />
                ) : (
                  <FiTrash2 size={16} />
                )}

                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyQuestion;