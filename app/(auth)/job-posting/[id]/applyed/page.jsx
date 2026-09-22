"use client";

import { base_url, img_url } from "@/components/utils";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiCalendar,
  FiDownload,
  FiFileText,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

const Page = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [jobData, setJobData] = useState([]);

  const fetchJobPosted = async () => {
    try {npm run dev
      setLoading(true);

      const response = await axios.get(
        `${base_url}/job/posted/${id}`,
        {
          withCredentials: true,
        }
      );

      const data = response?.data;

      if (data?.success) {
        setJobData(data?.jobs?.applydUser || []);
      } else {
        setJobData([]);
      }
    } catch (error) {
      console.error("Fetch job error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch applicants"
      );

      setJobData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchJobPosted();
    }
  }, [id]);



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6 text-gray-900 dark:bg-[#0b0d10] dark:text-white">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse">
            <div className="h-8 w-48 rounded-lg bg-gray-200 dark:bg-[#1a1e24]" />

            <div className="mt-6 grid gap-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-32 rounded-2xl border border-gray-200 bg-white dark:border-[#242932] dark:bg-[#12151a]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0b0d10] dark:text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur-xl dark:border-[#242932] dark:bg-[#0b0d10]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white transition hover:bg-gray-100 dark:border-[#242932] dark:bg-[#12151a] dark:hover:bg-[#191d23]"
            >
              <FiArrowLeft size={18} />
            </button>

            <div>
              <h1 className="text-xl font-bold">
                Applicants
              </h1>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Job ID: {id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <FiUsers size={17} />

            <span className="text-sm font-semibold">
              {jobData.length}
            </span>

            <span className="hidden text-sm sm:block">
              Applicants
            </span>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Page title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            Job Applicants
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View applicants and their submitted resumes.
          </p>
        </div>

        {/* Empty */}
        {jobData.length === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white dark:border-[#242932] dark:bg-[#12151a]">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-[#1b2027] dark:text-gray-400">
              <FiUsers size={28} />
            </div>

            <h3 className="mt-4 text-lg font-semibold">
              No applicants yet
            </h3>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              No one has applied for this job yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobData.map((application, index) => {
              const user = application?.user;

              return (
                <ApplicantCard
                  key={application?._id || index}
                  application={application}
                  user={user}
                  index={index}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

const ApplicantCard = ({
  application,
  user,
  index,

}) => {
  const resumeUrl = `${img_url}${application?.resume}`;

  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm dark:border-[#242932] dark:bg-[#12151a] dark:hover:border-blue-500/30 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* User */}
        <div className="flex min-w-0 items-start gap-4">
          {/* Avatar */}
          {user?.image ? (
            <img
              src={`${img_url}${user.image}`}
              alt={user?.fullname || "User"}
              className="h-14 w-14 shrink-0 rounded-full border border-gray-200 object-cover dark:border-[#303640]"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-[#1b2027] dark:text-gray-400">
              <FiUser size={22} />
            </div>
          )}

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold">
                {user?.fullname || "Unknown User"}
              </h3>

              <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-600 dark:bg-green-500/10 dark:text-green-400">
                Applicant #{index + 1}
              </span>
            </div>

            {/* Email */}
            {user?.email && (
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <FiMail size={14} />

                <span className="break-all">
                  {user.email}
                </span>
              </div>
            )}

            {/* Phone */}
            {user?.phone && (
              <div className="mt-1.5 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <FiPhone size={14} />

                <span>{user.phone}</span>
              </div>
            )}

            {/* Location */}
            {user?.address && (
              <div className="mt-1.5 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <FiMapPin size={14} />

                <span>{user.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Resume */}
        <div className="flex flex-col gap-3 sm:flex-row lg:items-center">
          {application?.resume ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-[#303640] dark:bg-[#0d1014] dark:text-gray-300 dark:hover:bg-[#191d23]"
            >
              <FiFileText
                size={17}
                className="text-red-500"
              />

              View Resume
            </a>
          ) : (
            <span className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm text-gray-500 dark:bg-[#1a1e24] dark:text-gray-500">
              <FiFileText size={17} />

              No Resume
            </span>
          )}

        
        </div>
      </div>


      <div className="mt-5 border-t border-gray-100 pt-4 dark:border-[#242932]">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <FiCalendar size={14} />

            <span>
              Applied{" "}
              {application?.createdAt
                ? formatDate(application.createdAt)
                : "Recently"}
            </span>
          </div>

          {user?.gender && (
            <div className="flex items-center gap-2">
              <FiUser size={14} />

              <span className="capitalize">
                {user.gender}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default Page;