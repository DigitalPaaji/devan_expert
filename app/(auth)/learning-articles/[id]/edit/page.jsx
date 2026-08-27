"use client";

import { base_url, img_url } from "@/components/utils";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import {
  FaCalendarAlt,
  FaEye,
  FaTags,
  FaCameraRetro,
  FaTrash,
  FaPlus,
  FaArrowLeft,
  FaSave,
  FaPen,
  FaImage,
} from "react-icons/fa";

import {
  FiFileText,
  FiFolder,
  FiX,
  FiEdit3,
} from "react-icons/fi";

import { MdOutlineArticle } from "react-icons/md";
import { RiChatDeleteLine } from "react-icons/ri";
import { toast } from "react-toastify";

const ArticleViewPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New thumbnail image
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Tag input
  const [tagInput, setTagInput] = useState("");

  /*
   * Fetch article
   */
  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${base_url}/article/get-article/${id}`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data.success) {
        setArticle(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch article:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  /*
   * Image URL
   */
  const getImageUrl = (url) => {
    if (!url) return "";

    if (url.startsWith("http")) {
      return url;
    }

    return `${img_url}${url}`;
  };

  /*
   * Input change
   */
  const inputChange = (event) => {
    const { name, value } = event.target;

    setArticle((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
   * New thumbnail image
   */
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setNewImage(file);

    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
  };

  /*
   * Remove selected new image
   */
  const removeNewImage = () => {
    setNewImage(null);
    setImagePreview("");

    const input = document.getElementById("article-image");

    if (input) {
      input.value = "";
    }
  };

  /*
   * Add tag
   */
  const addTag = () => {
    const value = tagInput.trim();

    if (!value) return;

    const normalizedTag = value.replace(/^#/, "");

    const currentTags = Array.isArray(article.tags)
      ? article.tags
      : [];

    const alreadyExists = currentTags.some(
      (tag) =>
        String(tag).toLowerCase() ===
        normalizedTag.toLowerCase()
    );

    if (alreadyExists) {
      setTagInput("");
      return;
    }

    setArticle((previous) => ({
      ...previous,
      tags: [...(previous.tags || []), normalizedTag],
    }));

    setTagInput("");
  };

  /*
   * Enter key for tag
   */
  const handleTagKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTag();
    }
  };

  /*
   * Remove tag
   */
  const removeTag = (indexToRemove) => {
    setArticle((previous) => ({
      ...previous,
      tags: (previous.tags || []).filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  /*
   * Save article
   */
  const handelSaveArticle = async () => {
    if (!article) return;

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("title", article.title || "");
      formData.append(
        "shortDescription",
        article.shortDescription || ""
      );
      formData.append("category", article.category || "");
      formData.append("status", article.status || "");

      /*
       * Send tags as JSON.
       *
       * If your backend expects tags[] instead,
       * change this to:
       *
       * article.tags.forEach(tag => {
       *   formData.append("tags[]", tag);
       * });
       */
      formData.append(
        "tags",
        JSON.stringify(article.tags || [])
      );

      /*
       * IMPORTANT:
       * Only send newImage when user selected one.
       */
      if (newImage) {
        formData.append("thumbnail", newImage);
      }

    
      
      const response = await axios.put(
        `${base_url}/article/update-article/${id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.success) {
        toast.success(response.data.message);

        setNewImage(null);
        setImagePreview("");
       setArticle(response.data.article)
        
      } else {
        toast.error(
          response.data?.message ||
            "Failed to update article"
        );
      }
    } catch (error) {
      console.error(
        "Failed to update article:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Something went wrong while saving article"
      );
    } finally {
      setSaving(false);
    }
  };

 

 const  handelDeletArticle= async()=>{
  try {
    const response = await axios.delete(`${base_url}/article/delete/${id}`,{
      withCredentials:true
    })
    const data = await response.data;
    if(data.success){
      toast.success(data.message)
       router.back()
    }
else{
   toast.error(data.message);
}
  } catch (error) {
     toast.error(
          error?.response.data?.message ||
            "Failed to update article"
        );
  }
 }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-4 border-black border-t-transparent animate-spin" />

          <p className="text-sm font-medium text-black">
            Loading article...
          </p>
        </div>
      </div>
    );
  }

  /*
   * Article not found
   */
  if (!article) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <MdOutlineArticle className="text-7xl text-black mb-5" />

        <h2 className="text-2xl font-bold text-black">
          Article not found
        </h2>

        <button
          onClick={() => router.back()}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition"
        >
          <FaArrowLeft />
          Go Back
        </button>
      </div>
    );
  }

  const currentImage =
    imagePreview || getImageUrl(article.thumbnail);

  return (
    <div className="h-screen overflow-auto bg-white text-black  dark:bg-black dark:text-white">
      {/* ================= HEADER ================= */}
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur dark:bg-black/95  dark:border-gray-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-black transition hover:bg-black hover:text-white   dark:border-gray-700 dark:text-white dark:hover:bg-white dark:hover:text-black"
            >
              <FaArrowLeft />
            </button>

            <div>
              <h1 className="text-lg font-bold md:text-xl">
                Edit Article
              </h1>

              <p className="hidden text-xs text-gray-500 sm:block ">
                Manage article information
              </p>
            </div>
          </div>

          <button
            onClick={handelSaveArticle}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-black dark:bg-white px-4 py-2.5 text-sm font-semibold text-white dark:text-black transition hover:bg-gray-800 dark:hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white dark:border-black border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <FaSave />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* =====================================================
              LEFT
          ====================================================== */}
          <div className="space-y-8">
            {/* ================= THUMBNAIL ================= */}
            <section className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white  dark:bg-black ">
              <div className="border-b border-gray-200 dark:border-gray-800 px-5 py-4 md:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold">
                      Article Image
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                      Upload a new thumbnail image
                    </p>
                  </div>

                  <FaImage className="text-xl text-gray-400 dark:text-gray-600" />
                </div>
              </div>

              <div className="p-4 md:p-6">
                <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                  {currentImage ? (
                    <img
                      src={currentImage}
                      alt={article.title || "Article"}
                      className="h-[250px] w-full object-cover md:h-[400px]"
                    />
                  ) : (
                    <div className="flex h-[250px] items-center justify-center md:h-[400px]">
                      <div className="text-center">
                        <FaImage className="mx-auto mb-3 text-5xl text-gray-300" />

                        <p className="text-sm text-gray-500">
                          No article image
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Upload overlay */}
                  <label
                    htmlFor="article-image"
                    className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/0 opacity-0 transition duration-300 group-hover:bg-black/50 group-hover:opacity-100"
                  >
                    <div className="flex flex-col items-center text-white">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-xl">
                        <FaCameraRetro className="text-xl" />
                      </div>

                      <span className="mt-3 text-sm font-semibold">
                        Change Image
                      </span>
                    </div>
                  </label>

                  <input
                    id="article-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {/* Status */}
                  <div className="absolute right-4 top-4">
                    <span className="rounded-full bg-black px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                      {article.status}
                    </span>
                  </div>
                </div>

                {/* New image information */}
                {newImage && (
                  <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-black dark:border-white bg-gray-50 dark:bg-gray-950 p-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-black dark:text-white">
                        New image selected
                      </p>

                      <p className="truncate text-xs text-gray-500">
                        {newImage.name}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={removeNewImage}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black dark:bg-white text-white dark:text-black transition hover:bg-gray-800 dark:hover:bg-gray-200"
                    >
                      <FiX />
                    </button>
                  </div>
                )}

                <p className="mt-3 text-xs text-gray-400">
                  Recommended: JPG, JPEG, PNG or WEBP
                </p>
              </div>
            </section>

            {/* ================= BASIC INFORMATION ================= */}
            <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
              <div className="border-b border-gray-200 px-5 py-4 md:px-6">
                <h2 className="text-base font-bold">
                  Basic Information
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Update the main article details
                </p>
              </div>

              <div className="space-y-6 p-5 md:p-6">
                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Article Title
                  </label>

                  <div className="relative">
                    <FiFileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600" />

                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={article.title || ""}
                      onChange={inputChange}
                      placeholder="Enter article title"
                      className="h-12 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black pl-11 pr-4 text-sm text-black dark:text-white outline-none transition placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-black dark:focus:border-white  focus:ring-2 focus:ring-black/10  dark:focus:ring-white/10"
                    />
                  </div>
                </div>

                {/* Category + Status */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* Category */}
                  <div>
                    <label
                      htmlFor="category"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Category
                    </label>
<select
                    name="category"
                        id="category"
                        value={article.category || ""}
                        onChange={inputChange}
                      className="h-12 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black px-4 text-sm text-black dark:text-white outline-none transition focus:border-black  dark:focus:border-white  focus:ring-2 focus:ring-black/10  dark:focus:ring-white/10"
                    >

                      {["Sterilization Basics","Steam Sterilization","ETO Sterilization","Plasma Sterilization","CSSD Management",
"Infection Control","Standards & Guidelines","Case Studies"].map((item,index)=> <option value={item} key={index}>
                       {item}
                      </option>
)}
                     
                     

                    
                    </select>


                  </div>

                  {/* Status */}
                  <div>
                    <label
                      htmlFor="status"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Publication Status
                    </label>

                    <select
                      name="status"
                      id="status"
                      value={article.status || "DRAFT"}
                      onChange={inputChange}
                      disabled={article.status==="REJECTED"}
                      className="h-12 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black px-4 text-sm text-black dark:text-white outline-none transition focus:border-black  dark:focus:border-white  focus:ring-2 focus:ring-black/10  dark:focus:ring-white/10"
                    >
                      <option value="PUBLISHED">
                        Published
                      </option>
                       <option value="REJECTED" disabled>
                        REJECTED
                      </option>
                      <option value="DRAFT">
                        Draft
                      </option>

                    
                    </select>
                  </div>
                </div>

                {/* Short description */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="shortDescription"
                      className="text-sm font-semibold"
                    >
                      Short Description
                    </label>

                    <span className="text-xs text-gray-400 dark:text-gray-600">
                      {(article.shortDescription || "").length}/300
                    </span>
                  </div>

                  <textarea
                    name="shortDescription"
                    id="shortDescription"
                    value={article.shortDescription || ""}
                    onChange={inputChange}
                    maxLength={300}
                    rows={5}
                    placeholder="Write a short summary of this article..."
                    className="w-full resize-none rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black px-4 py-3 text-sm leading-6 text-black dark:text-white outline-none transition placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-black  dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
                  />
                </div>
              </div>
            </section>

            {/* ================= TAGS ================= */}
            <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
              <div className="border-b border-gray-200 dark:border-gray-800 px-5 py-4 md:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white dark:text-black">
                    <FaTags />
                  </div>

                  <div>
                    <h2 className="text-base font-bold">
                      Article Tags
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                      Add or remove tags for this article
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 md:p-6">
                {/* Add tag */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(event) =>
                      setTagInput(event.target.value)
                    }
                    onKeyDown={handleTagKeyDown}
                    placeholder="Enter tag and press Enter"
                    className="h-11 flex-1 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black px-4 text-sm text-black dark:text-white outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
                  />

                  <button
                    type="button"
                    onClick={addTag}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-black  dark:bg-white px-5 text-sm font-semibold text-white dark:text-black transition hover:bg-gray-800 dark:hover:bg-gray-200"
                  >
                    <FaPlus />
                    Add Tag
                  </button>
                </div>

                {/* Tags */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {article.tags?.length > 0 ? (
                    article.tags.map((tag, index) => (
                      <div
                        key={`${tag}-${index}`}
                        className="group flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 px-3 py-2"
                      >
                        <span className="text-sm font-medium text-black dark:text-white">
                          #{tag}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="text-gray-400 dark:text-gray-600 transition hover:text-black dark:hover:text-white"
                        >
                          <FiX />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="w-full rounded-xl border border-dashed border-gray-300 dark:border-gray-700 px-4 py-8 text-center">
                      <FaTags className="mx-auto mb-2 text-2xl text-gray-300 dark:text-gray-700" />

                      <p className="text-sm text-gray-500 ">
                        No tags added yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* ================= SAVE BUTTON ================= */}
            <div className="flex justify-between border-t border-gray-200 dark:border-gray-800 pt-6">

<button
                onClick={handelDeletArticle}
               
                className="inline-flex items-center gap-2 rounded-xl bg-red-700 px-7 py-3 text-sm font-bold text-white transition hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                
                  <>
                    <RiChatDeleteLine  />
                    Delete Article
                  </>
              
              </button>

              <button
                onClick={handelSaveArticle}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-black dark:bg-white px-7 py-3 text-sm font-bold text-white dark:text-black transition hover:bg-gray-800 dark:hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white dark:border-black border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Save Article
                  </>
                )}
              </button>
            </div>
          </div>

      
          <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
            {/* Article info */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
              <div className="border-b border-gray-200 dark:border-gray-800 px-5 py-4">
                <h2 className="text-base font-bold">
                  Article Information
                </h2>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-gray-900">
                {/* Date */}
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-900">
                    <FaCalendarAlt />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Created
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {article.createdAt
                        ? new Date(
                            article.createdAt
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </p>
                  </div>
                </div>

                {/* Views */}
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-900" >
                    <FaEye />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Views
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {article.views || 0}
                    </p>
                  </div>
                </div>

                {/* Category */}
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-900">
                    <FiFolder />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">
                      Category
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold">
                      {article.category || "No category"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= CONTENT EDIT ================= */}
            <div className="rounded-2xl border border-black dark:border-white bg-black dark:bg-white p-5 text-white dark:text-black">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white dark:bg-black text-black dark:text-white">
                <FiEdit3 className="text-xl" />
              </div>

              <h2 className="mt-5 text-lg font-bold">
                Article Content
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-300 dark:text-gray-700">
                Edit your article sections, rich text content,
                section colors and images from the dedicated
                content editor.
              </p>

              <Link
                href={`/learning-articles/${id}/desc`}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white dark:bg-black px-4 py-3 text-sm font-bold text-black dark:text-white transition hover:bg-gray-200 dark:hover:bg-gray-800" 
              >
                <FaPen />
                Edit Content
              </Link>
            </div>

            {/* ================= CONTENT COUNT ================= */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Content Sections
                  </p>

                  <p className="mt-1 text-3xl font-bold">
                    {article.content?.length || 0}
                  </p>
                </div>

                <MdOutlineArticle className="text-4xl text-gray-300 dark:text-gray-700" />
              </div>

              <Link
                href={`/learning-articles/${id}/desc`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4 hover:no-underline"
              >
                Manage sections
                <span>→</span>
              </Link>
            </div>
          </aside>
        </div>

      
        <section className="mt-10 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
          <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-6">
            <div>
              <h2 className="text-lg font-bold">
                Content Preview
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Preview only. Use Edit Content to modify sections.
              </p>
            </div>

            <Link
              href={`/learning-articles/${id}/desc`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-black dark:border-white px-4 py-2 text-sm font-semibold transition "
            >
              <FiEdit3 />
              Edit Content
            </Link>
          </div>

          <div className="space-y-12 p-5 md:p-8">
            {article.content?.length > 0 ? (
              article.content.map((section, index) => (
                <article
                  key={section._id || index}
                  className="border-b border-gray-100 dark:border-gray-900 pb-10 last:border-0 last:pb-0"
                >
                  {/* Section title */}
                  <div className="mb-6 flex items-center gap-4">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white dark:text-black"
                      style={{
                        backgroundColor:
                          section.color || "#000000",
                      }}
                    >
                      {index + 1}
                    </div>

                    <h3 className="text-xl font-bold md:text-2xl">
                      {section.title}
                    </h3>
                  </div>

                  <div
                    className={`grid grid-cols-1 gap-8 ${
                      section.image
                        ? "lg:grid-cols-2"
                        : "grid-cols-1"
                    }`}
                  >
                    {/* Description */}
                    <div
                      className="prose prose-sm max-w-none leading-7 text-gray-700 dark:text-gray-300"
                      dangerouslySetInnerHTML={{
                        __html: section.des || "",
                      }}
                    />

                    {/* Section image */}
                    {section.image && (
                      <div className="overflow-hidden rounded-xl border border-gray-200 dark:bg-gray-800">
                        <img
                          src={getImageUrl(section.image)}
                          alt={
                            section.title ||
                            "Article section"
                          }
                          className="h-auto max-h-[450px] w-full object-cover transition duration-500 hover:scale-105"
                        />
                      </div>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <div className="py-16 text-center">
                <MdOutlineArticle className="mx-auto mb-4 text-5xl text-gray-300 dark:text-gray-700" />

                <h3 className="text-lg font-bold">
                  No content sections
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Add content from the content editor.
                </p>

                <Link
                  href={`/learning-articles/${id}/desc`}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-black dark:bg-white px-5 py-3 text-sm font-semibold text-white dark:text-black"
                >
                  <FaPlus />
                  Add Content
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ArticleViewPage;