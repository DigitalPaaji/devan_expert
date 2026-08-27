"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiFillDelete } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { FiPlus, FiSave, FiX } from "react-icons/fi";
import { FaYoutube } from "react-icons/fa";
import { toast } from "react-toastify";
import { base_url } from "@/components/utils";

const categories = [
  "Sterilization Basics",
  "Steam Sterilization",
  "ETO Sterilization",
  "Plasma Sterilization",
  "CSSD Management",
  "Infection Control",
  "Standards & Guidelines",
  "Case Studies",
];

const defaultEduInfo = {
  category: "Sterilization Basics",
  ytlink: "",
  status: "PUBLISHED",
};

const Page = () => {
  const [educationData, setEducationData] = useState([]);
  const [editCom, setEditCom] = useState(null);

  const [eduInfo, setEduInfo] = useState(defaultEduInfo);

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  // =====================================================
  // CREATE EDUCATION
  // =====================================================
  const handelSubmit = async (e) => {
    e.preventDefault();

    if (!eduInfo.ytlink.trim()) {
      toast.error("YouTube link is required");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${base_url}/education/create`,
        eduInfo,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data.success) {
        toast.success(data.message);

        setEducationData((prev) => [data.data, ...prev]);

        setEduInfo({
          ...defaultEduInfo,
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UPDATE EDUCATION
  // =====================================================
  const handelSubmitEdit = async (e) => {
    e.preventDefault();

    if (!editCom?.ytlink?.trim()) {
      toast.error("YouTube link is required");
      return;
    }

    try {
      setEditLoading(true);

      const response = await axios.put(
        `${base_url}/education/edit/${editCom._id}`,
        {
          category: editCom.category,
          ytlink: editCom.ytlink,
          status: editCom.status,
        },
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data.success) {
        toast.success(data.message);

        setEducationData((prev) =>
          prev.map((item) =>
            item._id === editCom._id
              ? data.data
              : item
          )
        );

        setEditCom(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setEditLoading(false);
    }
  };

  // =====================================================
  // FETCH EDUCATION
  // =====================================================
  const handelfetchData = async () => {
    try {
      setFetchLoading(true);

      const response = await axios.get(
        `${base_url}/education/get`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data.success) {
        setEducationData(data.data || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch education"
      );
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    handelfetchData();
  }, []);

  // =====================================================
  // DELETE EDUCATION
  // =====================================================
  const handelDelate = async (id) => {
    try {
      setDeleteLoading(id);

      const response = await axios.delete(
        `${base_url}/education/delete/${id}`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data.success) {
        setEducationData((prev) =>
          prev.filter((item) => item._id !== id)
        );

        if (editCom?._id === id) {
          setEditCom(null);
        }

        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete education"
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  // =====================================================
  // YOUTUBE EMBED URL
  // =====================================================
  const getYoutubeEmbedUrl = (url) => {
    try {
      const parsed = new URL(url);

      if (parsed.hostname.includes("youtu.be")) {
        return `https://www.youtube.com/embed/${parsed.pathname.slice(
          1
        )}`;
      }
      if(parsed.pathname.startsWith("/shorts")){
          const videoId = parsed.pathname.split("/")[2]
     
 if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
}
      if (parsed.hostname.includes("youtube.com")) {
        const videoId = parsed.searchParams.get("v");

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }

        if (parsed.pathname.startsWith("/embed/")) {
          return url;
        }
      }

      return url;
    } catch {
      return url;
    }
  };

  return (
    <div className="h-screen overflow-auto bg-gray-50 px-4 py-6 text-gray-900 transition-colors dark:bg-black dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}
        <div className="mb-8 flex flex-col gap-4 border-b border-gray-200 pb-6 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Education
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-white/40">
              Manage your educational YouTube content
            </p>
          </div>

          <div className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-500 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-white/60">
            <FaYoutube className="text-lg text-gray-900 dark:text-white" />

            <span>
              {educationData.length} Videos
            </span>
          </div>
        </div>

        {/* ================================================= */}
        {/* CREATE FORM */}
        {/* ================================================= */}
        <section className="mb-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-2xl sm:p-6">

          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-black">
              <FiPlus />
            </div>

            <div>
              <h2 className="font-medium text-gray-900 dark:text-white">
                Add Education
              </h2>

              <p className="text-xs text-gray-500 dark:text-white/40">
                Add a new educational YouTube video
              </p>
            </div>
          </div>

          <form
            onSubmit={handelSubmit}
            className="grid grid-cols-1 gap-5 lg:grid-cols-12"
          >

            {/* CATEGORY */}
            <div className="lg:col-span-4">
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-white/50">
                Category
              </label>

              <select
                required
                value={eduInfo.category}
                onChange={(e) =>
                  setEduInfo((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-gray-400 dark:border-white/10 dark:bg-black dark:text-white dark:focus:border-white/40"
              >
                {categories.map((item) => (
                  <option
                    value={item}
                    key={item}
                    className="bg-white text-gray-900 dark:bg-black dark:text-white"
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* YOUTUBE LINK */}
            <div className="lg:col-span-5">
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-white/50">
                YouTube Link
              </label>

              <input
                type="url"
                required
                placeholder="https://www.youtube.com/watch?v=..."
                value={eduInfo.ytlink}
                onChange={(e) =>
                  setEduInfo((prev) => ({
                    ...prev,
                    ytlink: e.target.value,
                  }))
                }
                className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 dark:border-white/10 dark:bg-black dark:text-white dark:placeholder:text-white/20 dark:focus:border-white/40"
              />
            </div>

            {/* STATUS */}
            <div className="lg:col-span-3">
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-white/50">
                Status
              </label>

              <select
                required
                value={eduInfo.status}
                onChange={(e) =>
                  setEduInfo((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
                className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-gray-400 dark:border-white/10 dark:bg-black dark:text-white dark:focus:border-white/40"
              >
                <option
                  value="PUBLISHED"
                  className="bg-white text-gray-900 dark:bg-black dark:text-white"
                >
                  Published
                </option>

                <option
                  value="DRAFT"
                  className="bg-white text-gray-900 dark:bg-black dark:text-white"
                >
                  Draft
                </option>
              </select>
            </div>

            {/* SAVE BUTTON */}
            <div className="lg:col-span-12">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-gray-900 px-5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/85"
              >
                <FiSave />

                {loading
                  ? "Saving..."
                  : "Save Education"}
              </button>
            </div>
          </form>
        </section>

        {/* ================================================= */}
        {/* LIST HEADER */}
        {/* ================================================= */}
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Education Videos
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-white/40">
            Your uploaded educational content
          </p>
        </div>

        {/* ================================================= */}
        {/* LOADING */}
        {/* ================================================= */}
        {fetchLoading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[380px] animate-pulse rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/[0.03]"
              />
            ))}
          </div>
        ) : educationData.length === 0 ? (

          /* ================================================= */
          /* EMPTY STATE */
          /* ================================================= */
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white text-center dark:border-white/10 dark:bg-white/[0.02]">
            <FaYoutube className="mb-4 text-4xl text-gray-300 dark:text-white/20" />

            <h3 className="text-sm font-medium text-gray-700 dark:text-white/70">
              No education videos
            </h3>

            <p className="mt-1 text-xs text-gray-400 dark:text-white/35">
              Add your first educational video above.
            </p>
          </div>

        ) : (

          /* ================================================= */
          /* EDUCATION CARDS */
          /* ================================================= */
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

            {educationData.map((item) => {
              const isEdit =
                item._id === editCom?._id;

              return (
                <div
                  key={item._id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-gray-300 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20 dark:hover:bg-white/[0.045]"
                >

                  {isEdit ? (

                    /* ================================================= */
                    /* EDIT FORM */
                    /* ================================================= */
                    <form
                      onSubmit={handelSubmitEdit}
                      className="p-5"
                    >

                      <div className="mb-5 flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            Edit Education
                          </h3>

                          <p className="mt-1 text-xs text-gray-400 dark:text-white/35">
                            Update video information
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setEditCom(null)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:border-white/10 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                          <FiX />
                        </button>
                      </div>

                      {/* CATEGORY */}
                      <div className="mb-4">
                        <label className="mb-2 block text-xs text-gray-500 dark:text-white/50">
                          Category
                        </label>

                        <select
                          required
                          value={editCom.category}
                          onChange={(e) =>
                            setEditCom((prev) => ({
                              ...prev,
                              category:
                                e.target.value,
                            }))
                          }
                          className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-gray-400 dark:border-white/10 dark:bg-black dark:text-white dark:focus:border-white/40"
                        >
                          {categories.map(
                            (item) => (
                              <option
                                value={item}
                                key={item}
                                className="bg-white text-gray-900 dark:bg-black dark:text-white"
                              >
                                {item}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      {/* YOUTUBE */}
                      <div className="mb-4">
                        <label className="mb-2 block text-xs text-gray-500 dark:text-white/50">
                          YouTube Link
                        </label>

                        <input
                          type="url"
                          required
                          value={editCom.ytlink}
                          onChange={(e) =>
                            setEditCom((prev) => ({
                              ...prev,
                              ytlink:
                                e.target.value,
                            }))
                          }
                          className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-400 dark:border-white/10 dark:bg-black dark:text-white dark:placeholder:text-white/20 dark:focus:border-white/40"
                        />
                      </div>

                      {/* STATUS */}
                      <div className="mb-5">
                        <label className="mb-2 block text-xs text-gray-500 dark:text-white/50">
                          Status
                        </label>

                        <select
                          required
                          value={editCom.status}
                          onChange={(e) =>
                            setEditCom((prev) => ({
                              ...prev,
                              status:
                                e.target.value,
                            }))
                          }
                          className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none dark:border-white/10 dark:bg-black dark:text-white"
                        >
                          <option value="PUBLISHED">
                            Published
                          </option>

                          <option value="DRAFT">
                            Draft
                          </option>
                        </select>
                      </div>

                      {/* EDIT BUTTONS */}
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={editLoading}
                          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/85"
                        >
                          <FiSave />

                          {editLoading
                            ? "Updating..."
                            : "Update"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setEditCom(null)
                          }
                          className="h-10 rounded-xl border border-gray-200 px-4 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>

                  ) : (

                    <>
                      {/* ================================================= */}
                      {/* VIDEO */}
                      {/* ================================================= */}
                      <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-black">
                        <iframe
                          className="h-full w-full"
                          src={getYoutubeEmbedUrl(
                            item.ytlink
                          )}
                          title={item.category}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />

                        {/* HOVER ACTIONS */}
                        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/70 opacity-0 transition duration-200 group-hover:opacity-100">

                          {/* EDIT */}
                          <button
                            type="button"
                            onClick={() =>
                              setEditCom(item)
                            }
                            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black transition hover:scale-105"
                          >
                            <CiEdit className="text-xl" />
                          </button>

                          {/* DELETE */}
                          <button
                            type="button"
                            disabled={
                              deleteLoading ===
                              item._id
                            }
                            onClick={() =>
                              handelDelate(
                                item._id
                              )
                            }
                            className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white ring-1 ring-white/30 transition hover:scale-105 hover:bg-white hover:text-black disabled:opacity-50"
                          >
                            <AiFillDelete className="text-lg" />
                          </button>
                        </div>
                      </div>

                      {/* ================================================= */}
                      {/* CARD CONTENT */}
                      {/* ================================================= */}
                      <div className="p-4">

                        <div className="mb-3 flex items-start justify-between gap-3">

                          <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-gray-900 dark:text-white">
                            {item.category}
                          </h3>

                          <span
                            className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                              item.status ===
                              "PUBLISHED"
                                ? "border-gray-200 bg-gray-900 text-white dark:border-white/20 dark:bg-white dark:text-black"
                                : "border-gray-200 bg-gray-100 text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-white/50"
                            }`}
                          >
                            {item.status}
                          </span>

                        </div>

                        <p className="truncate text-xs text-gray-400 dark:text-white/30">
                          {item.ytlink}
                        </p>

                        {/* BOTTOM */}
                        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-white/10">

                          <span className="text-[11px] text-gray-400 dark:text-white/30">
                            Added{" "}
                            {item.createdAt
                              ? new Date(
                                  item.createdAt
                                ).toLocaleDateString()
                              : ""}
                          </span>

                          <div className="flex gap-2">

                            {/* EDIT */}
                            <button
                              type="button"
                              onClick={() =>
                                setEditCom(item)
                              }
                              className="flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-xs text-gray-500 transition hover:bg-gray-900 hover:text-white dark:border-white/10 dark:text-white/50 dark:hover:bg-white dark:hover:text-black"
                            >
                              <CiEdit className="text-base" />
                              Edit
                            </button>

                            {/* DELETE */}
                            <button
                              type="button"
                              disabled={
                                deleteLoading ===
                                item._id
                              }
                              onClick={() =>
                                handelDelate(
                                  item._id
                                )
                              }
                              className="flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-xs text-gray-500 transition hover:bg-gray-900 hover:text-white dark:border-white/10 dark:text-white/50 dark:hover:bg-white dark:hover:text-black disabled:opacity-50"
                            >
                              <AiFillDelete />
                              Delete
                            </button>

                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;