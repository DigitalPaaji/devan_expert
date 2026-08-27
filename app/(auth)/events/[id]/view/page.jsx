"use client";

import { base_url, img_url } from "@/components/utils";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUser,
  FiMail,
  FiPhone,
  FiTrash2,
  FiEdit,
  FiBriefcase,
  FiImage,
  FiCheckCircle,
  FiXCircle,
  FiFileText,
} from "react-icons/fi";
import { toast } from "react-toastify";

const Page = () => {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [eventData, seteventData] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ----------------------------------
  // Fetch Event
  // ----------------------------------
  const fetchevent = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${base_url}/event/get/${id}`,
        {
          withCredentials: true,
        }
      );

      const data = response?.data;

      if (data?.success) {
        seteventData(data.event);
      } else {
        seteventData(null);
      }
    } catch (error) {
      console.error("Fetch event error:", error);
      seteventData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchevent();
    }
  }, [id]);

  // ----------------------------------
  // Delete Event
  // ----------------------------------
  const handleDelete = async () => {
    if (!eventData?._id) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${eventData.title}"?`
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);

      const response = await axios.delete(
        `${base_url}/event/delete/${eventData._id}`,
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast.success("Event deleted successfully");
        router.push("/events");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to delete event"
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
      weekday: "long",
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
    return (
      <div className="min-h-screen bg-white p-4 text-black dark:bg-black dark:text-white sm:p-6">
        <div className="mx-auto max-w-7xl animate-pulse">

          <div className="mb-8 h-10 w-40 rounded-lg bg-gray-200 dark:bg-gray-800" />

          <div className="mb-6 h-[400px] rounded-2xl bg-gray-100 dark:bg-gray-900" />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="h-52 rounded-2xl bg-gray-100 dark:bg-gray-900" />
              <div className="h-64 rounded-2xl bg-gray-100 dark:bg-gray-900" />
            </div>

            <div className="h-80 rounded-2xl bg-gray-100 dark:bg-gray-900" />
          </div>

        </div>
      </div>
    );
  }

  // ----------------------------------
  // Not Found
  // ----------------------------------
  if (!eventData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-6 text-black dark:bg-black dark:text-white">

        <div className="text-center">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-200 dark:border-gray-800">
            <FiBriefcase size={28} />
          </div>

          <h2 className="mb-2 text-2xl font-bold">
            Event Not Found
          </h2>

          <p className="mb-6 text-gray-500 dark:text-gray-400">
            This event may have been deleted or you don't have access to it.
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
    <div className="h-screen overflow-auto bg-gray-50 p-4 text-black dark:bg-black dark:text-white sm:p-6">

      <div className="mx-auto max-w-7xl">

        {/* =========================================
            TOP BAR
        ========================================== */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <button
            onClick={() => router.back()}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-900"
          >
            <FiArrowLeft size={17} />
            Back
          </button>

          <div className="flex items-center gap-3">

            <button
              onClick={() =>
                router.push(`/events/${eventData._id}/edit`)
              }
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-900"
            >
              <FiEdit size={16} />
              Edit
            </button>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              <FiTrash2 size={16} />
              {deleting ? "Deleting..." : "Delete"}
            </button>

          </div>
        </div>

        {/* =========================================
            EVENT HERO
        ========================================== */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">

          {/* Image */}
          <div className="relative h-[280px] w-full overflow-hidden sm:h-[400px] lg:h-[480px]">

            {eventData?.image ? (
              <img
                src={`${img_url}${eventData.image}`}
                alt={eventData.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
                <FiImage
                  size={50}
                  className="text-gray-400 dark:text-gray-600"
                />
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Status */}
            <div className="absolute right-5 top-5">
              {eventData.status === "PUBLISHED" ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-black shadow-lg">
                  <FiCheckCircle size={14} />
                  Published
                </span>
              ) : eventData.status === "CANCELLED" ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                  <FiXCircle size={14} />
                  Cancelled
                </span>
              ) : (
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-black shadow-lg">
                  {eventData.status}
                </span>
              )}
            </div>

            {/* Hero Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">

              <p className="mb-2 text-sm font-medium text-gray-300">
                EVENT
              </p>

              <h1 className="max-w-4xl text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                {eventData.title}
              </h1>

              <p className="mt-3 text-sm text-gray-300">
                Created on{" "}
                {new Date(eventData.createdAt).toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )}
              </p>

            </div>
          </div>

          {/* =========================================
              EVENT QUICK INFO
          ========================================== */}
          <div className="grid grid-cols-1 divide-y divide-gray-200 dark:divide-gray-800 sm:grid-cols-3 sm:divide-x sm:divide-y-0">

            {/* Date */}
            <div className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                <FiCalendar size={20} />
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Event Date
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                  {formatDate(eventData.date)}
                </p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                <FiClock size={20} />
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Start Time
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                  {formatTime(eventData.date)}
                </p>
              </div>
            </div>

            {/* Venue */}
            <div className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                <FiMapPin size={20} />
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Venue
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                  {eventData.venue || "-"}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* =========================================
            MAIN CONTENT
        ========================================== */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* LEFT */}
          <div className="space-y-6 lg:col-span-2">

            {/* Description */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950 sm:p-7">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                  <FiFileText size={19} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    About This Event
                  </h2>

                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Event description
                  </p>
                </div>

              </div>

              <div dangerouslySetInnerHTML={{__html:eventData.description}} className="whitespace-pre-wrap text-sm leading-7 text-gray-600 dark:text-gray-400">
                {/* {eventData.description || "No description available."} */}
              </div>

            </div>

            {/* Event Details */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950 sm:p-7">

              <div className="mb-6">
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Event Details
                </h2>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  Important information about this event
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                  <div className="mb-2 flex items-center gap-2 text-gray-500 dark:text-gray-500">
                    <FiCalendar size={16} />
                    <span className="text-xs">
                      Date
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatDate(eventData.date)}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                  <div className="mb-2 flex items-center gap-2 text-gray-500 dark:text-gray-500">
                    <FiClock size={16} />
                    <span className="text-xs">
                      Time
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatTime(eventData.date)}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800 sm:col-span-2">
                  <div className="mb-2 flex items-center gap-2 text-gray-500 dark:text-gray-500">
                    <FiMapPin size={16} />
                    <span className="text-xs">
                      Venue
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {eventData.venue || "-"}
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* RIGHT - ORGANIZER */}
          <div>

            <div className="sticky top-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">

              {/* Organizer Header */}
              <div className="border-b border-gray-200 p-5 dark:border-gray-800">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                    <FiUser size={19} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      Organizer
                    </h2>

                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Contact information
                    </p>
                  </div>

                </div>

              </div>

              {/* Organizer Info */}
              <div className="space-y-5 p-5">

                {/* Name */}
                <div className="flex gap-3">

                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400">
                    <FiUser size={16} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Name
                    </p>

                    <p className="mt-1 truncate text-sm font-medium text-gray-900 dark:text-white">
                      {eventData.organizer?.name || "-"}
                    </p>
                  </div>

                </div>

                {/* Email */}
                <div className="flex gap-3">

                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400">
                    <FiMail size={16} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Email
                    </p>

                    <a
                      href={`mailto:${eventData.organizer?.email}`}
                      className="mt-1 block truncate text-sm font-medium text-gray-900 hover:underline dark:text-white"
                    >
                      {eventData.organizer?.email || "-"}
                    </a>
                  </div>

                </div>

                {/* Phone */}
                <div className="flex gap-3">

                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400">
                    <FiPhone size={16} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Phone
                    </p>

                    <a
                      href={`tel:${eventData.organizer?.phone}`}
                      className="mt-1 block text-sm font-medium text-gray-900 hover:underline dark:text-white"
                    >
                      {eventData.organizer?.phone || "-"}
                    </a>
                  </div>

                </div>

              </div>

              {/* Organizer Actions */}
              <div className="border-t border-gray-200 p-5 dark:border-gray-800">

                <a
                  href={`mailto:${eventData.organizer?.email}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                  <FiMail size={16} />
                  Contact Organizer
                </a>

              </div>

            </div>

          </div>

        </div>

        {/* =========================================
            META INFORMATION
        ========================================== */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">

          <div className="grid grid-cols-1 gap-5 text-sm sm:grid-cols-3">

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Event ID
              </p>

              <p className="mt-1 break-all font-mono text-xs text-gray-700 dark:text-gray-300">
                {eventData._id}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Created At
              </p>

              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                {new Date(eventData.createdAt).toLocaleString("en-IN")}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Last Updated
              </p>

              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                {new Date(eventData.updatedAt).toLocaleString("en-IN")}
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Page;