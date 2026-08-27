"use client";

import { base_url, img_url } from "@/components/utils";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiCalendar,
  FiTag,
  FiTrash2,
  FiEdit,
  FiBriefcase,
  FiImage,
  FiFileText,
  FiClock,
  FiHash,
} from "react-icons/fi";
import { toast } from "react-toastify";
import Loading from "@/components/Loading";

const Page = () => {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [newsData, setnewsData] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ----------------------------------
  // Fetch News
  // ----------------------------------

  const fetchnews = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${base_url}/news/get/${id}`,
        {
          withCredentials: true,
        }
      );

      const data = response?.data;

      if (data?.success) {
        setnewsData(data.news);
      } else {
        setnewsData(null);
      }
    } catch (error) {
      console.error("Fetch news error:", error);
      setnewsData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchnews();
    }
  }, [id]);

  // ----------------------------------
  // Delete News
  // ----------------------------------

  const handleDelete = async () => {
    if (!newsData?._id) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${newsData.title}"?`
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);

      const response = await axios.delete(
        `${base_url}/news/delete/${newsData._id}`,
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast.success("News deleted successfully");
        router.push("/news");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to delete news"
      );
    } finally {
      setDeleting(false);
    }
  };

  // ----------------------------------
  // Format Date
  // ----------------------------------

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // ----------------------------------
  // Format Time
  // ----------------------------------

  const formatTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ----------------------------------
  // Loading
  // ----------------------------------

  if (loading) {
    return <Loading />;
  }

  // ----------------------------------
  // Not Found
  // ----------------------------------

  if (!newsData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-6 text-black dark:bg-black dark:text-white">

        <div className="text-center">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-200 dark:border-gray-800">
            <FiBriefcase size={28} />
          </div>

          <h2 className="mb-2 text-2xl font-bold">
            News Not Found
          </h2>

          <p className="mb-6 text-gray-500 dark:text-gray-400">
            This news may have been deleted or you don't
            have access to it.
          </p>

          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:opacity-80 dark:bg-white dark:text-black"
          >
            <FiArrowLeft />
            Go Back
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="h-screen  overflow-auto bg-gray-50 p-3 text-black dark:bg-black dark:text-white sm:p-6">

      <div className="mx-auto max-w-7xl">

        {/* =========================================
            TOP HEADER
        ========================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          {/* Back */}

          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.07]"
          >
            <FiArrowLeft size={17} />
            Back
          </button>

          {/* Actions */}

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() =>
                router.push(`/news/${newsData._id}/edit`)
              }
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.07]"
            >
              <FiEdit size={16} />
              Edit
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              <FiTrash2 size={16} />

              {deleting
                ? "Deleting..."
                : "Delete"}
            </button>

          </div>

        </div>

        {/* =========================================
            NEWS HERO
        ========================================== */}

        <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/[0.03]">

          {/* Featured Image */}

          <div className="relative h-[260px] overflow-hidden sm:h-[380px] lg:h-[500px]">

            {newsData.featuredImage ? (
              <img
                src={`${img_url}${newsData.featuredImage}`}
                alt={newsData.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
                <FiImage
                  size={55}
                  className="text-gray-400 dark:text-gray-600"
                />
              </div>
            )}

            {/* Image Overlay */}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Category */}

            <div className="absolute left-5 top-5 sm:left-7 sm:top-7">

              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black shadow-lg">
                <FiTag size={13} />
                {newsData.category || "News"}
              </span>

            </div>

            {/* Hero Content */}

            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 lg:p-10">

              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-gray-300">
                News & Publication
              </p>

              <h1 className="max-w-5xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                {newsData.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-300">

                <span className="inline-flex items-center gap-2">
                  <FiCalendar size={15} />
                  {formatDate(
                    newsData.publicationDate
                  )}
                </span>

                <span className="inline-flex items-center gap-2">
                  <FiClock size={15} />
                  {formatTime(
                    newsData.publicationDate
                  )}
                </span>

              </div>

            </div>

          </div>

          {/* =========================================
              META INFORMATION
          ========================================== */}

          <div className="grid grid-cols-1 divide-y divide-gray-200 dark:divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">

            {/* Category */}

            <div className="flex items-center gap-4 p-5">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-white/[0.06] dark:text-gray-300">
                <FiTag size={19} />
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Category
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                  {newsData.category || "-"}
                </p>
              </div>

            </div>

            {/* Publication */}

            <div className="flex items-center gap-4 p-5">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-white/[0.06] dark:text-gray-300">
                <FiCalendar size={19} />
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Publication Date
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                  {formatDate(
                    newsData.publicationDate
                  )}
                </p>
              </div>

            </div>

            {/* Created */}

            <div className="flex items-center gap-4 p-5">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-white/[0.06] dark:text-gray-300">
                <FiClock size={19} />
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Created
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                  {formatDate(newsData.createdAt)}
                </p>
              </div>

            </div>

          </div>

        </article>

        {/* =========================================
            CONTENT
        ========================================== */}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* =====================================
              ARTICLE CONTENT
          ====================================== */}

          <div className="lg:col-span-2">

            <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03] sm:p-7 lg:p-9">

              {/* Section Header */}

              <div className="mb-7 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-white/[0.06] dark:text-gray-300">
                  <FiFileText size={19} />
                </div>

                <div>

                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    News Content
                  </h2>

                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Published article content
                  </p>

                </div>

              </div>

              {/* HTML Content */}

              <div
                className="
                  prose
                  prose-gray
                  max-w-none
                  text-gray-700
                  dark:prose-invert
                  dark:text-gray-300

                  prose-headings:text-gray-900
                  dark:prose-headings:text-white

                  prose-p:leading-8

                  prose-a:text-black
                  dark:prose-a:text-white

                  prose-img:rounded-xl
                  prose-img:border
                  prose-img:border-gray-200
                  dark:prose-img:border-white/10

                  prose-blockquote:border-gray-300
                  dark:prose-blockquote:border-gray-700

                  prose-strong:text-gray-900
                  dark:prose-strong:text-white
                "
                dangerouslySetInnerHTML={{
                  __html:
                    newsData.description ||
                    "<p>No content available.</p>",
                }}
              />

            </section>

          </div>

          {/* =====================================
              SIDEBAR
          ====================================== */}

          <aside>

            <div className="sticky top-6 space-y-6">

              {/* Publication Details */}

              <section className="rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/[0.03]">

                <div className="border-b border-gray-200 p-5 dark:border-white/10">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-white/[0.06] dark:text-gray-300">
                      <FiCalendar size={18} />
                    </div>

                    <div>
                      <h2 className="font-semibold text-gray-900 dark:text-white">
                        Publication
                      </h2>

                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        News information
                      </p>
                    </div>

                  </div>

                </div>

                <div className="space-y-5 p-5">

                  {/* Date */}

                  <div>

                    <p className="mb-1 text-xs text-gray-500 dark:text-gray-500">
                      Publication Date
                    </p>

                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatDate(
                        newsData.publicationDate
                      )}
                    </p>

                  </div>

                  {/* Time */}

                  <div>

                    <p className="mb-1 text-xs text-gray-500 dark:text-gray-500">
                      Publication Time
                    </p>

                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatTime(
                        newsData.publicationDate
                      )}
                    </p>

                  </div>

                  {/* Category */}

                  <div>

                    <p className="mb-1 text-xs text-gray-500 dark:text-gray-500">
                      Category
                    </p>

                    <span className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-300">
                      <FiTag size={13} />
                      {newsData.category}
                    </span>

                  </div>

                </div>

              </section>

              {/* Record Information */}

              <section className="rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/[0.03]">

                <div className="border-b border-gray-200 p-5 dark:border-white/10">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-white/[0.06] dark:text-gray-300">
                      <FiHash size={18} />
                    </div>

                    <div>
                      <h2 className="font-semibold text-gray-900 dark:text-white">
                        Record Details
                      </h2>

                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        System information
                      </p>
                    </div>

                  </div>

                </div>

                <div className="space-y-5 p-5">

                  {/* ID */}

                  <div>

                    <p className="mb-1 text-xs text-gray-500 dark:text-gray-500">
                      News ID
                    </p>

                    <p className="break-all font-mono text-xs text-gray-700 dark:text-gray-300">
                      {newsData._id}
                    </p>

                  </div>

                  {/* Slug */}

                  <div>

                    <p className="mb-1 text-xs text-gray-500 dark:text-gray-500">
                      Slug
                    </p>

                    <p className="break-all font-mono text-xs text-gray-700 dark:text-gray-300">
                      {newsData.slug}
                    </p>

                  </div>

                  {/* Updated */}

                  <div>

                    <p className="mb-1 text-xs text-gray-500 dark:text-gray-500">
                      Last Updated
                    </p>

                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {formatDate(newsData.updatedAt)}
                    </p>

                  </div>

                </div>

              </section>

              {/* Edit Button */}

              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/news/${newsData._id}/edit`
                  )
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                <FiEdit size={16} />
                Edit News
              </button>

            </div>

          </aside>

        </div>

        {/* =========================================
            FOOTER META
        ========================================== */}

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Created At
              </p>

              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                {new Date(
                  newsData.createdAt
                ).toLocaleString("en-IN")}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Updated At
              </p>

              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                {new Date(
                  newsData.updatedAt
                ).toLocaleString("en-IN")}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
              {newsData.rejected  ?  "Rejection Reason": "Publication Status"}
              </p> 

   {
    newsData.rejected ? <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
               {newsData.rejectionReason }
              </p> :<p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                Published
              </p>
   }

              {/* <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                Published
              </p> */}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Page;