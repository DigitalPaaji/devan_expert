"use client";

import { base_url, img_url } from "@/components/utils";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiCalendar,
  FiFileText,
  FiImage,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSave,
  FiTrash2,
  FiUser,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";
import Loading from "@/components/Loading";
import RichEditor2 from "@/components/RichEditor2";

const Page = () => {
  const { id } = useParams();
  const route = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    venue: "",
    date: "",
    status: "DRAFT",
    organizer: {
      name: "",
      email: "",
      phone: "",
    },
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  // -----------------------------------------
  // Classes
  // -----------------------------------------

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-white dark:focus:ring-white";

  const inputClassWithIcon =
    "w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-white dark:focus:ring-white";

  const inputClassSelect =
    "w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-black focus:ring-1 focus:ring-black dark:border-white/10 dark:bg-black dark:text-white dark:focus:border-white dark:focus:ring-white";

  const labelClass =
    "mb-2 block text-sm font-medium text-gray-800 dark:text-gray-200";

  const sectionClass =
    "rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03] sm:p-7";

  // -----------------------------------------
  // Fetch Event
  // -----------------------------------------

  const fetchEvent = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${base_url}/event/get/${id}`,
        {
          withCredentials: true,
        }
      );

      const data = response?.data;

      if (data?.success && data?.event) {
        const event = data.event;

        setFormData({
          title: event.title || "",
          description: event.description || "",
          venue: event.venue || "",
          date: event.date
            ? formatDateForInput(event.date)
            : "",
          status: event.status || "DRAFT",

          organizer: {
            name: event.organizer?.name || "",
            email: event.organizer?.email || "",
            phone: event.organizer?.phone || "",
          },
rejectionReason:event.rejectionReason,
          image: event.image || null,
        });

        if (event.image) {
          setImagePreview(`${img_url}${event.image}`);
        }
      } else {
        toast.error(data?.message || "Event not found");
        route.back();
      }
    } catch (error) {
      console.error("Fetch event error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to fetch event"
      );

      route.back();
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // Convert API date to datetime-local format
  // -----------------------------------------

  const formatDateForInput = (date) => {
    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return "";
    }

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  // -----------------------------------------
  // Handle normal input
  // -----------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------------------
  // Organizer input
  // -----------------------------------------

  const handleOrganizerChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      organizer: {
        ...prev.organizer,
        [name]: value,
      },
    }));
  };

  // -----------------------------------------
  // Image Change
  // -----------------------------------------

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setRemoveExistingImage(false);

    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
  };

  // -----------------------------------------
  // Remove Image
  // -----------------------------------------

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));

    setImagePreview(null);
    setRemoveExistingImage(true);
  };

  // -----------------------------------------
  // Submit
  // -----------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Event title is required");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Event description is required");
      return;
    }

    if (!formData.venue.trim()) {
      toast.error("Venue is required");
      return;
    }

    if (!formData.date) {
      toast.error("Event date is required");
      return;
    }

    if (!formData.organizer.name.trim()) {
      toast.error("Organizer name is required");
      return;
    }

    try {
      setSaving(true);

      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("venue", formData.venue);
      data.append("date", formData.date);
      data.append("status", formData.status);

      data.append(
        "organizer",
        JSON.stringify(formData.organizer)
      );

      data.append(
        "removeExistingImage",
        String(removeExistingImage)
      );

      // Only append if a NEW file was selected
      if (formData.image instanceof File) {
        data.append("image", formData.image);
      }

      const response = await axios.put(
        `${base_url}/event/update/${id}`,
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = response?.data;

      if (result?.success) {
        toast.success(
          result?.message || "Event updated successfully"
        );

        route.push(`/events/${id}/view`);
      } else {
        toast.error(
          result?.message || "Unable to update event"
        );
      }
    } catch (error) {
      console.error("Update event error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to update event"
      );
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------------------
  // Loading
  // -----------------------------------------

  if (loading) {
    return <Loading />;
  }

  // -----------------------------------------
  // Page
  // -----------------------------------------

  return (
    <div className="h-screen overflow-auto bg-gray-50 px-3 py-5 text-black dark:bg-black dark:text-white sm:px-6 sm:py-8">

      <div className="mx-auto max-w-5xl">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() => route.back()}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.07]"
            >
              <FiArrowLeft size={18} />
            </button>

            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                Edit Event
              </h1>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Update your event information
              </p>
            </div>

          </div>

          {/* Status */}
          <div className="flex items-center gap-2">

            {formData.status === "PUBLISHED" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-200">
                <FiCheckCircle size={14} />
                Published
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-400">
                <FiAlertCircle size={14} />
                {formData.status}
              </span>
            )}

          </div>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="space-y-6">

            {/* =====================================
                EVENT INFORMATION
            ====================================== */}

            <section className={sectionClass}>

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-white/[0.06] dark:text-gray-300">
                  <FiFileText size={19} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Event Information
                  </h2>

                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Basic details about your event
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* Title */}

                <div className="md:col-span-2">

                  <label className={labelClass}>
                    Event Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter event title"
                    className={inputClass}
                  />

                </div>

                {/* Description */}

                <div className="md:col-span-2">

                  <label className={labelClass}>
                    Description
                  </label>

                          <RichEditor2 content={formData.description}  setContent={(info)=>setFormData((prev) => ({...prev,
      description: info,
    }))}/>

                  

                </div>

                {/* Venue */}

                <div>

                  <label className={labelClass}>
                    Venue
                  </label>

                  <div className="relative">

                    <FiMapPin
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={17}
                    />

                    <input
                      type="text"
                      name="venue"
                      value={formData.venue}
                      onChange={handleChange}
                      placeholder="Event venue"
                      className={inputClassWithIcon}
                    />

                  </div>

                </div>

                {/* Date */}

                <div>

                  <label className={labelClass}>
                    Event Date & Time
                  </label>

                  <div className="relative">

                    <FiCalendar
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={17}
                    />

                    <input
                      type="datetime-local"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className={inputClassWithIcon}
                    />

                  </div>

                </div>

             

                <div>

                  <label className={labelClass}>
                    Event Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={inputClassSelect}
                    disabled={formData.status=="CANCELLED"}
                  >
                    <option value="DRAFT">
                      Draft
                    </option>

                    <option value="PUBLISHED">
                      Published
                    </option>

                    <option value="CANCELLED" disabled>
                      Cancelled
                    </option>

                    <option value="COMPLETED">
                      Completed
                    </option>
                  </select>

                </div>
                {
                  formData.status=="CANCELLED"
                  &&
                  <div>

                  <label className={labelClass}>
                    Event Cancelled Resone
                  </label>

                <textarea name="" disabled value={formData.rejectionReason} id="" className={inputClass}></textarea>

                </div>
                }

              </div>

            </section>

            {/* =====================================
                ORGANIZER
            ====================================== */}

            <section className={sectionClass}>

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-white/[0.06] dark:text-gray-300">
                  <FiUser size={19} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Organizer Details
                  </h2>

                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Contact details of the event organizer
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                {/* Name */}

                <div>

                  <label className={labelClass}>
                    Organizer Name
                  </label>

                  <div className="relative">

                    <FiUser
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={17}
                    />

                    <input
                      type="text"
                      name="name"
                      value={formData.organizer.name}
                      onChange={handleOrganizerChange}
                      placeholder="Organizer name"
                      className={inputClassWithIcon}
                    />

                  </div>

                </div>

                {/* Email */}

                <div>

                  <label className={labelClass}>
                    Email
                  </label>

                  <div className="relative">

                    <FiMail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={17}
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.organizer.email}
                      onChange={handleOrganizerChange}
                      placeholder="Email address"
                      className={inputClassWithIcon}
                    />

                  </div>

                </div>

                {/* Phone */}

                <div>

                  <label className={labelClass}>
                    Phone
                  </label>

                  <div className="relative">

                    <FiPhone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={17}
                    />

                    <input
                      type="text"
                      name="phone"
                      value={formData.organizer.phone}
                      onChange={handleOrganizerChange}
                      placeholder="Phone number"
                      className={inputClassWithIcon}
                    />

                  </div>

                </div>

              </div>

            </section>

            {/* =====================================
                EVENT IMAGE
            ====================================== */}

            <section className={sectionClass}>

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-white/[0.06] dark:text-gray-300">
                  <FiImage size={19} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Event Image
                  </h2>

                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Change the event cover image
                  </p>
                </div>

              </div>

              {imagePreview ? (

                <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10">

                  <img
                    src={imagePreview}
                    alt={formData.title}
                    className="h-72 w-full object-cover sm:h-96"
                  />

                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">

                    <span className="text-xs text-white">
                      Event Cover Image
                    </span>

                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-white backdrop-blur transition hover:bg-white/20"
                    >
                      <FiTrash2 size={14} />
                      Remove
                    </button>

                  </div>

                </div>

              ) : (

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-5 py-12 transition hover:border-black dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-white/40">

                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm dark:bg-white/[0.06] dark:text-gray-400">
                    <FiImage size={24} />
                  </div>

                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Upload Event Image
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    PNG, JPG or WEBP • Max 5MB
                  </p>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                </label>

              )}

              {/* Upload New Image */}

              {imagePreview && (
                <label className="mt-4 flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.07]">

                  <FiImage size={16} />

                  Change Image

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                </label>
              )}

            </section>

            {/* =====================================
                WARNING
            ====================================== */}

            {formData.status === "CANCELLED" && (
              <div className="flex gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">

                <FiAlertCircle
                  className="mt-0.5 shrink-0 text-gray-500 dark:text-gray-400"
                  size={19}
                />

                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Event is cancelled
                  </p>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                   Contact Devan support team
                  </p>
                </div>

              </div>
            )}

          </div>

          {/* =====================================
              FOOTER ACTIONS
          ====================================== */}

          <div className="sticky bottom-0 mt-6 flex flex-col-reverse gap-3 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur dark:border-white/10 dark:bg-black/95 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() => route.back()}
              disabled={saving}
              className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/[0.06]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >

              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black" />
                  Updating...
                </>
              ) : (
                <>
                  <FiSave size={17} />
                  Update Event
                </>
              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default Page;