"use client";

import axios from "axios";
import React, { useState } from "react";
import {
  FiCalendar,
  FiMapPin,
  FiUser,
  FiMail,
  FiPhone,
  FiFileText,
  FiImage,
  FiX,
  FiSave,
  FiChevronDown,
} from "react-icons/fi";
import { base_url } from "./utils";
import { toast } from "react-toastify";
import RichEditor2 from "./RichEditor2";

const EventCreate = ({ setShowCreate }) => {
  const [eventDetails, setEventDetails] = useState({
    title: "",
    description: "",
    venue: "",
    date: "",
    organizer: {
      name: "",
      email: "",
      phone: "",
    },
    status: "PUBLISHED",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEventDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOrganizerChange = (e) => {
    const { name, value } = e.target;

    setEventDetails((prev) => ({
      ...prev,
      organizer: {
        ...prev.organizer,
        [name]: value,
      },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setEventDetails((prev) => ({
      ...prev,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setEventDetails((prev) => ({
      ...prev,
      image: null,
    }));

    setImagePreview(null);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

  try {
    const formData= new FormData();

    formData.append("title",eventDetails.title)
    formData.append("description",eventDetails.description)
    formData.append("venue",eventDetails.venue)
    formData.append("date",eventDetails.date)
    formData.append("organizer", JSON.stringify(eventDetails.organizer))
    formData.append("status",eventDetails.status)
    if(eventDetails.image){
        
        formData.append("image",eventDetails.image)
 }


    const response = await axios.post(`${base_url}/event/create`,formData,{
        withCredentials:true
    })

     const data =await response.data;
     if(data.success){
toast.success(data.message)

setShowCreate(false)
}
else{
         toast.error(data.message)
         
        }
        
        
    } catch (error) {
      toast.error(error?.response?.data?.message)
    
  }

    // API call here
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-3 backdrop-blur-sm sm:p-6">
      <div className="my-4 w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950 sm:my-8">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800 sm:px-7">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Create Event
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add details and publish your event.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreate(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Form */}
          <div className="space-y-7 p-5 sm:p-7">

            {/* Event Information */}
            <section>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                  <FiFileText size={18} />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Event Information
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Basic information about your event
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* Title */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Event Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={eventDetails.title}
                    onChange={handleChange}
                    placeholder="Enter event title"
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-300 dark:focus:ring-gray-300/10"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <RichEditor2 content={eventDetails.description}  setContent={(info)=>setEventDetails((prev) => ({...prev,
      description: info,
    }))}/>

                  <textarea
                    name="description"
                    value={eventDetails.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe your event..."
                    required
                    className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-300"
                  />
                </div>

                {/* Venue */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Venue
                  </label>

                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      type="text"
                      name="venue"
                      value={eventDetails.venue}
                      onChange={handleChange}
                      placeholder="Event venue"
                      required
                      className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-gray-300"
                    />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Event Date & Time
                  </label>

                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      type="datetime-local"
                      name="date"
                      value={eventDetails.date}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-gray-300"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>

                  <div className="relative">
                    <select
                      name="status"
                      value={eventDetails.status}
                      onChange={handleChange}
                      className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-gray-300"
                    >
                      <option value="PUBLISHED">Published</option>
                      <option value="DRAFT">Draft</option>
                      {/* <option value="COMPLETED">Completed</option> */}
                    </select>

                    <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

              </div>
            </section>

            {/* Organizer */}
            <section className="border-t border-gray-200 pt-7 dark:border-gray-800">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                  <FiUser size={18} />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Organizer Details
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Contact information for the event organizer
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>

                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      type="text"
                      name="name"
                      value={eventDetails.organizer.name}
                      onChange={handleOrganizerChange}
                      placeholder="Organizer name"
                      required
                      className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-gray-300"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>

                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      type="email"
                      name="email"
                      value={eventDetails.organizer.email}
                      onChange={handleOrganizerChange}
                      placeholder="organizer@email.com"
                      required
                      className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-gray-300"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone
                  </label>

                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      type="tel"
                      name="phone"
                      value={eventDetails.organizer.phone}
                      onChange={handleOrganizerChange}
                      placeholder="Phone number"
                      required
                      className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-gray-300"
                    />
                  </div>
                </div>

              </div>
            </section>

            {/* Image */}
            <section className="border-t border-gray-200 pt-7 dark:border-gray-800">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                  <FiImage size={18} />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Event Image
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Upload a cover image for your event
                  </p>
                </div>
              </div>

              {!imagePreview ? (
                <label className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-5 py-10 transition hover:border-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:border-gray-500 dark:hover:bg-gray-900">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm dark:bg-gray-800 dark:text-gray-400">
                    <FiImage size={22} />
                  </div>

                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Click to upload image
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    PNG, JPG or WEBP
                  </p>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                  <img
                    src={imagePreview}
                    alt="Event preview"
                    className="h-64 w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg bg-black/70 text-white backdrop-blur transition hover:bg-black"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4 dark:border-gray-800 dark:bg-gray-900/50 sm:flex-row sm:justify-end sm:px-7">

            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              <FiSave size={17} />
              Create Event
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default EventCreate;