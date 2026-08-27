"use client";

import { base_url } from "@/components/utils";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiEdit2,
  FiMapPin,
  FiTrash2,
  FiUsers,
  FiEye,
  FiDollarSign,
  FiGlobe,
} from "react-icons/fi";
import { LuEye } from "react-icons/lu";
import { toast } from "react-toastify";

const Page = () => {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [jobData, setJobData] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchJob = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${base_url}/job/get/${id}?type=view`,
        {
          withCredentials: true,
        }
      );

      const data = response?.data;

      if (data?.success) {
        setJobData(data.data);
      } else {
        setJobData(null);
      }
    } catch (error) {
      console.error("Fetch job error:", error);
      setJobData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);

  // ----------------------------------
  // Delete Job
  // ----------------------------------
  const handleDelete = async () => {
    if (!jobData?._id) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${jobData.title}"?`
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);

      const response = await axios.delete(
        `${base_url}/job/delete/${jobData._id}`,
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        router.push("/job-posting");
      }
    } catch (error) {


      toast.error(
        error?.response?.data?.message ||
          "Unable to delete job"
      );
    } finally {
      setDeleting(false);
    }
  };

  // ----------------------------------
  // Loading
  // ----------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-6">

        <div className="max-w-7xl mx-auto animate-pulse">

          <div className="h-10 w-40 bg-gray-200 dark:bg-gray-800 rounded-lg mb-8" />

          <div className="h-40 bg-gray-100 dark:bg-gray-900 rounded-2xl mb-6" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-100 dark:bg-gray-900 rounded-2xl" />
              <div className="h-64 bg-gray-100 dark:bg-gray-900 rounded-2xl" />
            </div>

            <div className="h-80 bg-gray-100 dark:bg-gray-900 rounded-2xl" />

          </div>
        </div>
      </div>
    );
  }

  

  
  if (!jobData) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center p-6">

        <div className="text-center">

          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center justify-center">
            <FiBriefcase size={28} />
          </div>

          <h2 className="text-2xl font-bold mb-2">
            Job Not Found
          </h2>

          <p className="text-gray-500 dark:text-gray-400 mb-6">
            This job may have been deleted or you don't have access to it.
          </p>

          <button
            onClick={() => router.back()}
            className="
              inline-flex items-center gap-2
              px-5 py-3
              rounded-xl
              bg-black text-white
              dark:bg-white dark:text-black
              font-semibold
              hover:opacity-80
              transition
            "
          >
            <FiArrowLeft />
            Go Back
          </button>

        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatSalary = () => {
    if (
      jobData.salary?.min == null &&
      jobData.salary?.max == null
    ) {
      return "Not specified";
    }

    const currency =
      jobData.salary?.currency === "INR"
        ? "₹"
        : jobData.salary?.currency || "";

    const min = jobData.salary?.min ?? 0;
    const max = jobData.salary?.max ?? 0;

    return `${currency}${min.toLocaleString(
      "en-IN"
    )} - ${currency}${max.toLocaleString("en-IN")}`;
  };

  return (
    <div className="h-screen overflow-auto bg-white dark:bg-black text-black dark:text-white">

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

        {/* =========================
            TOP BAR
        ========================== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

          <button
            onClick={() => router.back()}
            className="
              inline-flex items-center gap-2
              text-sm font-medium
              text-gray-600 dark:text-gray-400
              hover:text-black dark:hover:text-white
              transition
              w-fit
            "
          >
            <FiArrowLeft size={18} />
            Back to Jobs
          </button>

          <div className="flex items-center gap-2">

            {/* Edit */}
            <Link
            href={`/job-posting/${jobData._id}/edit`}
          
              className="
                inline-flex items-center gap-2
                px-4 py-2.5
                rounded-xl
                border border-gray-200 dark:border-gray-800
                bg-white dark:bg-black
                hover:bg-black hover:text-white
                dark:hover:bg-white dark:hover:text-black
                transition
                font-medium
              "
            >
              <FiEdit2 size={16} />
              Edit
            </Link>

            {/* Delete */}
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="
                inline-flex items-center gap-2
                px-4 py-2.5
                rounded-xl
                bg-black text-white
                dark:bg-white dark:text-black
                hover:opacity-70
                transition
                font-medium
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              <FiTrash2 size={16} />
              {deleting ? "Deleting..." : "Delete"}
            </button>

          </div>
        </div>

        {/* =========================
            JOB HEADER
        ========================== */}
        <div
          className="
            rounded-2xl
            border border-gray-200 dark:border-gray-800
            bg-white dark:bg-black
            p-5 sm:p-7
            mb-6
          "
        >

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

            <div>

              <div className="flex flex-wrap items-center gap-2 mb-4">

                <span
                  className="
                    px-3 py-1
                    rounded-full
                    text-xs font-semibold
                    border border-gray-300 dark:border-gray-700
                    bg-gray-100 dark:bg-gray-900
                  "
                >
                  {jobData.category}
                </span>

                <span
                  className="
                    px-3 py-1
                    rounded-full
                    text-xs font-semibold
                    bg-black text-white
                    dark:bg-white dark:text-black
                  "
                >
                  {jobData.status}
                </span>

              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                {jobData.title}
              </h1>

              <p className="text-gray-500 dark:text-gray-400 mt-3">
                {jobData.slug}
              </p>

            </div>

            {/* Stats */}
            <div className="flex gap-3">

              <div
                className="
                  min-w-[90px]
                  p-3
                  rounded-xl
                  border border-gray-200 dark:border-gray-800
                  text-center
                "
              >
                <FiEye
                  className="mx-auto mb-1"
                  size={17}
                />

                <p className="font-bold">
                  {jobData.views ?? 0}
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Views
                </p>
              </div>

              <div
                className="
                  min-w-[90px]
                  p-3
                  rounded-xl
                  border border-gray-200 dark:border-gray-800
                  text-center
                "
              >
                <FiUsers
                  className="mx-auto mb-1"
                  size={17}
                />

                <p className="font-bold">
                  {jobData.applicationsCount ?? 0}
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Applications
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* =========================
            MAIN CONTENT
        ========================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* Description */}
            <section
              className="
                rounded-2xl
                border border-gray-200 dark:border-gray-800
                p-5 sm:p-6
              "
            >

              <h2 className="text-lg font-bold mb-4">
                Job Description
              </h2>

              <p className="text-gray-600 dark:text-gray-300 leading-7 whitespace-pre-line">
                {jobData.description || "No description available."}
              </p>

            </section>

            {/* Responsibilities */}
            <section
              className="
                rounded-2xl
                border border-gray-200 dark:border-gray-800
                p-5 sm:p-6
              "
            >

              <h2 className="text-lg font-bold mb-4">
                Responsibilities
              </h2>

              {jobData.responsibilities?.length > 0 ? (
                <ul className="space-y-3">

                  {jobData.responsibilities.map(
                    (item, index) => (
                      <li
                        key={index}
                        className="flex gap-3 text-gray-600 dark:text-gray-300"
                      >
                        <FiCheckCircle
                          className="mt-1 shrink-0"
                          size={17}
                        />

                        <span>{item}</span>
                      </li>
                    )
                  )}

                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No responsibilities added.
                </p>
              )}

            </section>

            {/* Qualifications */}
            <section
              className="
                rounded-2xl
                border border-gray-200 dark:border-gray-800
                p-5 sm:p-6
              "
            >

              <h2 className="text-lg font-bold mb-4">
                Qualifications
              </h2>

              {jobData.qualifications?.length > 0 ? (
                <ul className="space-y-3">

                  {jobData.qualifications.map(
                    (item, index) => (
                      <li
                        key={index}
                        className="flex gap-3 text-gray-600 dark:text-gray-300"
                      >
                        <FiCheckCircle
                          className="mt-1 shrink-0"
                          size={17}
                        />

                        <span>{item}</span>
                      </li>
                    )
                  )}

                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No qualifications added.
                </p>
              )}

            </section>

            {/* Skills */}
            <section
              className="
                rounded-2xl
                border border-gray-200 dark:border-gray-800
                p-5 sm:p-6
              "
            >

              <h2 className="text-lg font-bold mb-4">
                Skills
              </h2>

              <div className="flex flex-wrap gap-2">

                {jobData.skills?.filter(Boolean).length > 0 ? (
                  jobData.skills
                    .filter(Boolean)
                    .map((skill, index) => (
                      <span
                        key={index}
                        className="
                          px-3 py-2
                          rounded-lg
                          text-sm
                          border border-gray-200 dark:border-gray-800
                          bg-gray-50 dark:bg-gray-950
                        "
                      >
                        {skill}
                      </span>
                    ))
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">
                    No skills added.
                  </span>
                )}

              </div>

            </section>

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">

            {/* Job Information */}
            <section
              className="
                rounded-2xl
                border border-gray-200 dark:border-gray-800
                p-5
              "
            >

              <h2 className="text-lg font-bold mb-5">
                Job Information
              </h2>

              <div className="space-y-5">

                {/* Job Type */}
                <div className="flex gap-3">
                  <FiBriefcase className="mt-1 shrink-0" />

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Job Type
                    </p>

                    <p className="font-semibold mt-1">
                      {jobData.jobType}
                    </p>
                  </div>
                </div>

                {/* Work Mode */}
                <div className="flex gap-3">
                  <FiGlobe className="mt-1 shrink-0" />

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Work Mode
                    </p>

                    <p className="font-semibold mt-1">
                      {jobData.workMode}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex gap-3">
                  <FiMapPin className="mt-1 shrink-0" />

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Location
                    </p>

                    <p className="font-semibold mt-1">
                      {jobData.location?.city},{" "}
                      {jobData.location?.state}
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {jobData.location?.country}
                    </p>
                  </div>
                </div>

                {/* Experience */}
                <div className="flex gap-3">
                  <FiClock className="mt-1 shrink-0" />

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Experience
                    </p>

                    <p className="font-semibold mt-1">
                      {jobData.experience?.min ?? 0} -{" "}
                      {jobData.experience?.max ?? 0} years
                    </p>
                  </div>
                </div>

                {/* Openings */}
                <div className="flex gap-3">
                  <FiUsers className="mt-1 shrink-0" />

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Openings
                    </p>

                    <p className="font-semibold mt-1">
                      {jobData.openings}
                    </p>
                  </div>
                </div>

              </div>

            </section>

            {/* Salary */}
            <section
              className="
                rounded-2xl
                border border-gray-200 dark:border-gray-800
                p-5
              "
            >

              <div className="flex items-center gap-3 mb-5">

                <div
                  className="
                    w-10 h-10
                    rounded-xl
                    border border-gray-200 dark:border-gray-800
                    flex items-center justify-center
                  "
                >
                  <FiDollarSign size={19} />
                </div>

                <div>
                  <h2 className="font-bold">
                    Salary
                  </h2>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Compensation details
                  </p>
                </div>

              </div>

              <p className="text-xl font-bold">
                {formatSalary()}
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {jobData.salary?.period}
              </p>

              {jobData.salary?.isNegotiable && (
                <div className="mt-4">

                  <span
                    className="
                      inline-flex items-center gap-2
                      px-3 py-1.5
                      rounded-full
                      text-xs font-semibold
                      border border-gray-300 dark:border-gray-700
                    "
                  >
                    <FiCheckCircle size={14} />
                    Negotiable
                  </span>

                </div>
              )}

            </section>

            {/* Application */}
            <section
              className="
                rounded-2xl
                border border-gray-200 dark:border-gray-800
                p-5
              "
            >

              <h2 className="font-bold mb-5">
                Application Details
              </h2>

              <div className="space-y-4">

                <div className="flex items-center justify-between gap-4">

                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <FiCalendar size={16} />
                    Deadline
                  </div>

                  <span className="font-semibold">
                    {formatDate(
                      jobData.applicationDeadline
                    )}
                  </span>

                </div>

                <div className="flex items-center justify-between gap-4">

                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <FiUsers size={16} />
                    Applications
                  </div>
   <div className="flex items-center gap-2">

                  <span className="font-semibold">
                    {jobData.applicationsCount ?? 0}
                  </span>
                   <LuEye onClick={()=>router.push(`/job-posting/${id}/applyed`)} className="cursor-pointer"  />
   </div>

                </div>

              </div>

            </section>

            {/* Created / Updated */}
            <section
              className="
                rounded-2xl
                border border-gray-200 dark:border-gray-800
                p-5
              "
            >

              <h2 className="font-bold mb-4">
                Record Information
              </h2>

              <div className="space-y-3 text-sm">

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">
                    Created
                  </span>

                  <span>
                    {formatDate(jobData.createdAt)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400">
                    Updated
                  </span>

                  <span>
                    {formatDate(jobData.updatedAt)}
                  </span>
                </div>

              </div>

            </section>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Page;