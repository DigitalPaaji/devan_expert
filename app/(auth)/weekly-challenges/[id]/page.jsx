"use client";

import { base_url, img_url } from "@/components/utils";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiAward,
  FiCalendar,
  FiCheck,
  FiClock,
  FiFile,
  FiFileText,
  FiImage,
  FiLoader,
  FiSave,
  FiSend,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import { toast } from "react-toastify";

const Page = () => {
  const params = useParams();
  const id = params?.id;

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);

  const [selectedBestAnswer, setSelectedBestAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectingBest, setSelectingBest] = useState(false);
  const [announcing, setAnnouncing] = useState(false);

  const [error, setError] = useState("");

  // ==============================
  // FETCH QUESTION
  // ==============================

  const fetchQues = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${base_url}/challenges/get/${id}`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data.success) {
        setQuestion(data.question);
        setAnswers(data.answers || []);

        setCorrectAnswer(
          data.question.correctAnswer || ""
        );

        setSelectedBestAnswer(
          data.question.bestAnswerId || null
        );
      }
    } catch (error) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Unable to load weekly challenge"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchQues();
    }
  }, [id]);

  // ==============================
  // SAVE CORRECT ANSWER
  // ==============================

  const handleSaveCorrectAnswer = async () => {
    if (!correctAnswer.trim()) {
      toast.warn("Please enter the correct answer.");
      return;
    }

    try {
      setSaving(true);

      await axios.patch(
        `${base_url}/challenges/correct-answer/${id}`,
        {
          correctAnswer: correctAnswer.trim(),
        },
        {
          withCredentials: true,
        }
      );

      setQuestion((prev) =>
        prev
          ? {
              ...prev,
              correctAnswer: correctAnswer.trim(),
            }
          : prev
      );

      toast.success("Correct answer saved successfully.");
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to save correct answer"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==============================
  // SELECT BEST ANSWER
  // ==============================

  const handleBestAnswer = async (answerId) => {
    if (question?.status !== "SUBMISSION_CLOSED") {
      return;
    }

    try {
      setSelectingBest(true);

      await axios.patch(
        `${base_url}/challenges/best-answer/${id}`,
        {
          answerId,
        },
        {
          withCredentials: true,
        }
      );

      setSelectedBestAnswer(answerId);

      setQuestion((prev) =>
        prev
          ? {
              ...prev,
              bestAnswerId: answerId,
            }
          : prev
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to select best answer"
      );
    } finally {
      setSelectingBest(false);
    }
  };

  // ==============================
  // ANNOUNCE RESULT
  // ==============================

  const handleAnnounceResult = async () => {
    if (!selectedBestAnswer) {
      toast.warn("Please select a best answer first.");
      return;
    }

    if (!correctAnswer.trim()) {
      toast.warn("Please enter the correct answer first.");
      return;
    }

    try {
      setAnnouncing(true);

      await axios.patch(
        `${base_url}/challenges/announce-result/${id}`,
        {},
        {
          withCredentials: true,
        }
      );

      setQuestion((prev) =>
        prev
          ? {
              ...prev,
              status: "RESULT_ANNOUNCED",
              resultAnnouncedAt:
                new Date().toISOString(),
            }
          : prev
      );

      toast.success("Challenge result announced successfully.");
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to announce result"
      );
    } finally {
      setAnnouncing(false);
    }
  };

  // ==============================
  // DATE FORMAT
  // ==============================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  

 
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-zinc-900 dark:bg-[#09090b] dark:text-white">
        <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
          <FiLoader className="animate-spin text-xl" />
          Loading challenge...
        </div>
      </div>
    );
  }

  // ==============================
  // ERROR
  // ==============================

  if (error || !question) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 text-zinc-900 dark:bg-[#09090b] dark:text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-500/10 dark:text-red-400">
            <FiX size={24} />
          </div>

          <h2 className="text-lg font-semibold">
            Unable to load challenge
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            {error || "Challenge not found"}
          </p>

          <button
            onClick={fetchQues}
            className="mt-5 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==============================
  // STATUS
  // ==============================

  const isSubmissionClosed =
    question.status === "SUBMISSION_CLOSED";

  const isResultAnnounced =
    question.status === "RESULT_ANNOUNCED";

  // ==============================
  // REFERENCE FILES
  // ==============================

  const referenceFiles = Array.isArray(
    question.referenceImages
  )
    ? question.referenceImages
    : question.referenceImages
      ? [question.referenceImages]
      : [];

  // ==============================
  // UI
  // ==============================

  return (
    <main className="h-screen overflow-auto bg-zinc-50 text-zinc-900 transition-colors dark:bg-[#09090b] dark:text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              onClick={() => window.history.back()}
              className="mb-4 flex items-center gap-2 text-sm text-zinc-500 transition hover:text-zinc-900 dark:hover:text-white"
            >
              <FiArrowLeft />
              Back
            </button>

            <h1 className="text-2xl font-semibold tracking-tight">
              Weekly Challenge
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Review submissions and manage the challenge result.
            </p>
          </div>

          {/* STATUS */}

          <div
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
              question.status === "ACTIVE"
                ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                : question.status ===
                    "SUBMISSION_CLOSED"
                  ? "border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400"
                  : question.status ===
                      "RESULT_ANNOUNCED"
                    ? "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400"
                    : "border-zinc-200 bg-zinc-100 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />

            {question.status}
          </div>
        </div>

        {/* ================= MAIN GRID ================= */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">

          {/* ==================================================
              LEFT
          ================================================== */}

          <section className="space-y-6">

            {/* ================= QUESTION ================= */}

            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 dark:bg-white/5 dark:text-zinc-300">
                  <MdOutlineQuestionAnswer size={22} />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Challenge Question
                  </h2>

                  <p className="text-xs text-zinc-500">
                    Weekly challenge prompt
                  </p>
                </div>

              </div>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-[#111113]">

                <p className="text-[15px] leading-7 text-zinc-700 dark:text-zinc-200">
                  {question.question}
                </p>

              </div>

              {/* ================= REFERENCE ================= */}

              {question?.referenceImages && (
                <div className="mt-6">

                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    <FiFileText />
                    Reference Materials
                  </div>

                  <div className="space-y-4">
                    {/* {referenceFiles.map((file, index) =>
                      renderReferenceFile(file, index)
                    )} */}

<Link href={`${img_url}${question.referenceImages}`} target="_blank">Reference Materials</Link>

                  </div>

                </div>
              )}
            </div>

            {/* ================= CORRECT ANSWER ================= */}

            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <FiCheck size={20} />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Correct Answer
                  </h2>

                  <p className="text-xs text-zinc-500">
                    Define the official correct answer.
                  </p>
                </div>

              </div>

              <textarea
                value={correctAnswer}
                onChange={(e) =>
                  setCorrectAnswer(e.target.value)
                }
                disabled={isResultAnnounced}
                placeholder="Enter the correct answer..."
                rows={5}
                className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-[#111113] dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-zinc-600"
              />

              {!isResultAnnounced && (
                <div className="mt-4 flex justify-end">

                  <button
                    onClick={handleSaveCorrectAnswer}
                    disabled={
                      saving ||
                      !correctAnswer.trim()
                    }
                    className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  >
                    {saving ? (
                      <FiLoader className="animate-spin" />
                    ) : (
                      <FiSave />
                    )}

                    {saving
                      ? "Saving..."
                      : "Save Answer"}
                  </button>

                </div>
              )}
            </div>

            {/* ================= SUBMITTED ANSWERS ================= */}

            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">

              <div className="mb-6 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                    <FiUsers size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Submitted Answers
                    </h2>

                    <p className="text-xs text-zinc-500">
                      Review participant submissions.
                    </p>
                  </div>

                </div>

                <span className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                  {answers.length} submissions
                </span>

              </div>

              {/* NO ANSWERS */}

              {answers.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-200 py-12 text-center dark:border-zinc-800">

                  <MdOutlineQuestionAnswer
                    className="mx-auto mb-3 text-zinc-300 dark:text-zinc-700"
                    size={32}
                  />

                  <p className="text-sm text-zinc-500">
                    No answers submitted yet.
                  </p>

                </div>
              ) : (

                <div className="space-y-3">

                  {answers.map((answer, index) => {

                    const isBest =
                      selectedBestAnswer ===
                      answer._id;

                    return (
                      <div
                        key={answer._id}
                        className={`rounded-xl border p-4 transition ${
                          isBest
                            ? "border-amber-300 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/5"
                            : "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-[#111113]"
                        }`}
                      >

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                          <div className="flex min-w-0 gap-3">

                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-200 text-xs font-semibold text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                              {index + 1}
                            </div>

                            <p className="text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                              {answer.answer}
                            </p>

                          </div>

                          {/* BEST ANSWER */}

                          {isSubmissionClosed && (
                            <button
                              onClick={() =>
                                handleBestAnswer(
                                  answer._id
                                )
                              }
                              disabled={selectingBest}
                              className={`flex shrink-0 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition ${
                                isBest
                                  ? "bg-amber-500 text-black"
                                  : "border border-zinc-200 bg-white text-zinc-500 hover:border-amber-300 hover:text-amber-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-amber-500/50 dark:hover:text-amber-400"
                              } disabled:cursor-not-allowed disabled:opacity-50`}
                            >

                              {selectingBest ? (
                                <FiLoader className="animate-spin" />
                              ) : (
                                <FiAward />
                              )}

                              {isBest
                                ? "Best Answer"
                                : "Mark Best"}

                            </button>
                          )}

                        </div>

                        {isBest && (
                          <div className="mt-3 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
                            <FiCheck />
                            Selected as the best answer
                          </div>
                        )}

                      </div>
                    );
                  })}

                </div>

              )}

            </div>

          </section>

          {/* ==================================================
              RIGHT
          ================================================== */}

          <aside className="space-y-6">

            {/* ================= DETAILS ================= */}

            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">

              <h2 className="mb-5 font-semibold">
                Challenge Details
              </h2>

              <div className="space-y-4">

                {/* START DATE */}

                <div className="rounded-xl bg-zinc-50 p-4 dark:bg-[#111113]">

                  <div className="flex items-center gap-3">

                    <FiCalendar className="text-zinc-500" />

                    <div>
                      <p className="text-xs text-zinc-500">
                        Start Date
                      </p>

                      <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
                        {formatDate(
                          question.startDate
                        )}
                      </p>
                    </div>

                  </div>

                </div>

                {/* DEADLINE */}

                <div className="rounded-xl bg-zinc-50 p-4 dark:bg-[#111113]">

                  <div className="flex items-center gap-3">

                    <FiClock className="text-zinc-500" />

                    <div>
                      <p className="text-xs text-zinc-500">
                        Submission Deadline
                      </p>

                      <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
                        {formatDate(
                          question.submissionDeadline
                        )}
                      </p>
                    </div>

                  </div>

                </div>

                {/* SUBMISSIONS */}

                <div className="rounded-xl bg-zinc-50 p-4 dark:bg-[#111113]">

                  <div className="flex items-center gap-3">

                    <FiUsers className="text-zinc-500" />

                    <div>
                      <p className="text-xs text-zinc-500">
                        Total Submissions
                      </p>

                      <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
                        {answers.length}
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* ================= BEST ANSWER ================= */}

            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                  <FiAward size={20} />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Best Answer
                  </h2>

                  <p className="text-xs text-zinc-500">
                    Choose the winning submission.
                  </p>
                </div>

              </div>

              {!isSubmissionClosed ? (

                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-[#111113]">

                  <p className="text-sm text-zinc-500">
                    Best answer selection will become
                    available after submissions are closed.
                  </p>

                </div>

              ) : selectedBestAnswer ? (

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/5">

                  <div className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400">
                    <FiAward />
                    Best answer selected
                  </div>

                  <p className="mt-2 text-xs leading-5 text-zinc-500">
                    You can now submit the challenge result.
                  </p>

                </div>

              ) : (

                <div className="rounded-xl border border-dashed border-zinc-200 p-4 text-center dark:border-zinc-800">

                  <p className="text-sm text-zinc-500">
                    Select a best answer from the
                    submissions.
                  </p>

                </div>

              )}

            </div>

            {/* ================= RESULT ================= */}

            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">

              <h2 className="mb-4 font-semibold">
                Challenge Result
              </h2>

              {isResultAnnounced ? (

                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/20 dark:bg-blue-500/5">

                  <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                    <FiCheck />
                    Result Announced
                  </div>

                  <p className="mt-2 text-xs text-zinc-500">
                    The challenge result has already
                    been published.
                  </p>

                </div>

              ) : (

                <>
                  <button
                    onClick={handleAnnounceResult}
                    disabled={
                      !isSubmissionClosed ||
                      !selectedBestAnswer ||
                      !correctAnswer.trim() ||
                      announcing
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  >

                    {announcing ? (
                      <FiLoader className="animate-spin" />
                    ) : (
                      <FiSend />
                    )}

                    {announcing
                      ? "Submitting..."
                      : "Submit & Announce Result"}

                  </button>

                  <p className="mt-3 text-center text-[11px] leading-5 text-zinc-500">
                    Submissions must be closed, a best
                    answer selected, and the correct answer
                    entered.
                  </p>
                </>

              )}

            </div>

          </aside>

        </div>
      </div>
    </main>
  );
};




export default Page;