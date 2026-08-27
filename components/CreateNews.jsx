"use client";

import React, { useState } from "react";
import {
  FiX,
  FiImage,
  FiFileText,
  FiCalendar,
  FiTag,
  FiUploadCloud,
  FiSave,
  FiTrash2,
} from "react-icons/fi";
import { toast } from "react-toastify";
import RichEditor2 from "./RichEditor2";
import { base_url } from "./utils";
import axios from "axios";

const categorySelect = [
  "CSSD Technician",
  "CSSD Supervisor",
  "CSSD Manager",
  "Infection Control Professional",
];

const CreateNews = ({ setShowCreate }) => {
  const [newsData, setNewsData] = useState({
    title: "",
    description: "",
    publicationDate: "",
    category: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // -----------------------------------------
  // Handle Input
  // -----------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewsData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------------------
  // Image Upload
  // -----------------------------------------

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setNewsData((prev) => ({
      ...prev,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  };

  // -----------------------------------------
  // Remove Image
  // -----------------------------------------

  const removeImage = () => {
    setNewsData((prev) => ({
      ...prev,
      image: null,
    }));

    setImagePreview(null);
  };

  // -----------------------------------------
  // Submit
  // -----------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newsData.title.trim()) {
      toast.error("Please enter news title");
      return;
    }

    if (!newsData.description.trim()) {
      toast.error("Please enter description");
      return;
    }

    if (!newsData.publicationDate) {
      toast.error("Please select publication date");
      return;
    }

    if (!newsData.category) {
      toast.error("Please select category");
      return;
    }

    if (!newsData.image) {
      toast.error("Please select featured image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", newsData.title);
      formData.append("description", newsData.description);
      formData.append(
        "publicationDate",
        newsData.publicationDate
      );
      formData.append("category", newsData.category);
      formData.append("image", newsData.image);

      console.log("News FormData:", newsData);

      // API call here
      const response = await axios.post(
        `${base_url}/news/create`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

const data = await response.data;
if(data.success){
    toast.success("News created successfully");
    setShowCreate(false);
    
}else{
    toast.error(data.message);

}


    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to create news"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-3 backdrop-blur-sm sm:p-6">

      <div className="my-4 w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-gray-950 sm:my-8">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-white/10 sm:px-7">

          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Create News
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add a new article or news publication.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreate(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-black dark:text-gray-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
          >
            <FiX size={20} />
          </button>

        </div>

        {/* =====================================
            FORM
        ====================================== */}

        <form onSubmit={handleSubmit}>

          <div className="space-y-7 p-5 sm:p-7">

            {/* =====================================
                BASIC INFORMATION
            ====================================== */}

            <section>

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-white/[0.06] dark:text-gray-300">
                  <FiFileText size={19} />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    News Information
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Basic information about the news
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* Title */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    News Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={newsData.title}
                    onChange={handleChange}
                    placeholder="Enter news title"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-white dark:focus:ring-white"
                  />

                </div>

                {/* Description */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <RichEditor2   content = {newsData.description}
  setContent={(info)=>setNewsData(prev=>({...prev,description:info}))} />

                  {/* <textarea
                    name="description"
                    value={newsData.description}
                    onChange={handleChange}
                    rows={7}
                    placeholder="Write your news description..."
                    className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-white dark:focus:ring-white"
                  /> */}

                </div>

                {/* Publication Date */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Publication Date
                  </label>

                  <div className="relative">

                    <FiCalendar
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="date"
                      name="publicationDate"
                      value={newsData.publicationDate}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:border-white dark:focus:ring-white"
                    />

                  </div>

                </div>

                {/* Category */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>

                  <div className="relative">

                    <FiTag
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <select
                      name="category"
                      value={newsData.category}
                      onChange={handleChange}
                      className="w-full appearance-none rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black dark:border-white/10 dark:bg-black dark:text-white dark:focus:border-white"
                    >

                      <option value="">
                        Select category
                      </option>

                      {categorySelect.map((category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      ))}

                    </select>

                  </div>

                </div>

              </div>

            </section>

            {/* =====================================
                FEATURED IMAGE
            ====================================== */}

            <section className="border-t border-gray-200 pt-7 dark:border-white/10">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-white/[0.06] dark:text-gray-300">
                  <FiImage size={19} />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Featured Image
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Upload the main image for this news
                  </p>
                </div>

              </div>

              {imagePreview ? (

                <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10">

                  <img
                    src={imagePreview}
                    alt="Featured preview"
                    className="h-72 w-full object-cover sm:h-96"
                  />

                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">

                    <span className="text-xs text-white">
                      Featured Image
                    </span>

                    <button
                      type="button"
                      onClick={removeImage}
                      className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-white backdrop-blur transition hover:bg-white/20"
                    >
                      <FiTrash2 size={14} />
                      Remove
                    </button>

                  </div>

                </div>

              ) : (

                <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-5 py-12 transition hover:border-black hover:bg-gray-100 dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-white/40 dark:hover:bg-white/[0.04]">

                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm dark:bg-white/[0.06] dark:text-gray-400">
                    <FiUploadCloud size={25} />
                  </div>

                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Click to upload featured image
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

              {/* Change Image */}

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

          </div>

          {/* =====================================
              FOOTER
          ====================================== */}

          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4 dark:border-white/10 dark:bg-white/[0.02] sm:flex-row sm:justify-end sm:px-7">

            <button
              type="button"
              onClick={() => setShowCreate(false)}
              disabled={loading}
              className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/[0.06]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >

              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black" />
                  Creating...
                </>
              ) : (
                <>
                  <FiSave size={17} />
                  Create News
                </>
              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default CreateNews;