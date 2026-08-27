"use client";

import { base_url, img_url } from "@/components/utils";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiBookOpen,
  FiAward,
  FiGlobe,
  FiSave,
  FiCamera,
  FiX,
  FiHash,
} from "react-icons/fi";
import { toast } from "react-toastify";
import Loading from "@/components/Loading";

const Page = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    designation: "",
    qualification: "",
    specialization: "",
    expertise:[ ],
    experienceYears: "",
    organization: "",
    registrationNo: "",
    department: "",
    about: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    linkedinUrl: "",
    dateOfBirth: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
const [expertise,setexpertise]=useState("")
  // ---------------------------------------
  // Fetch Profile
  // ---------------------------------------

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${base_url}/profile/get`,
        {
          withCredentials: true,
        }
      );

      const data = response?.data;

      if (data?.success) {
        const expert = data.expert;

        setProfile(expert);

        setFormData({
          fullname: expert?.fullname || "",
          email: expert?.email || "",
          phone: expert?.phone || "",
          designation: expert?.designation || "",
          qualification: expert?.qualification || "",
          specialization: expert?.specialization || "",
          expertise: expert?.expertise || [ ],
          experienceYears:
            expert?.experienceYears ?? "",
          organization: expert?.organization || "",
       
          department: expert?.department || "",
          about: expert?.about || "",
          gender: expert?.gender || "",
          address: expert?.address || "",
          city: expert?.city || "",
          state: expert?.state || "",
          linkedinUrl: expert?.linkedinUrl || "",
          dateOfBirth: expert?.dateOfBirth
            ? new Date(expert.dateOfBirth)
                .toISOString()
                .split("T")[0]
            : "",
          image: null,
        });

        if (expert?.image) {
          setImagePreview(
            expert.image.startsWith("http")
              ? expert.image
              : `${img_url}${expert.image}`
          );
        }
      } else {
        toast.error(
          data?.message || "Unable to fetch profile"
        );
      }
    } catch (error) {
      console.error("Profile error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to fetch profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ---------------------------------------
  // Handle Change
  // ---------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
const handelExpertise = (e)=>{
    if(e.key==="Enter"){
        e.preventDefault()
        if(!expertise.trim()) return;

    setFormData(prev=>({...prev,expertise:[...prev.expertise,expertise.trim()]}))
    setexpertise("")
    }



}



  // ---------------------------------------
  // Image Change
  // ---------------------------------------




  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  };

  // ---------------------------------------
  // Remove New Image
  // ---------------------------------------

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));

    setImagePreview(
      profile?.image
        ? profile.image.startsWith("http")
          ? profile.image
          : `${img_url}${profile.image}`
        : null
    );
  };

  // ---------------------------------------
  // Submit
  // ---------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullname.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter email");
      return;
    }

    try {
      setSaving(true);

      const data = new FormData();

      data.append("fullname", formData.fullname);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("designation", formData.designation);
      data.append(
        "qualification",
        formData.qualification
      );
      data.append(
        "specialization",
        formData.specialization
      );
      data.append("expertise", JSON.stringify(formData.expertise));
      data.append(
        "experienceYears",
        formData.experienceYears
      );
      data.append(
        "organization",
        formData.organization
      );
      data.append(
        "registrationNo",
        formData.registrationNo
      );
      data.append(
        "department",
        formData.department
      );
      data.append("about", formData.about);
      data.append("gender", formData.gender);
      data.append("address", formData.address);
      data.append("city", formData.city);
      data.append("state", formData.state);
      data.append(
        "linkedinUrl",
        formData.linkedinUrl
      );
      data.append(
        "dateOfBirth",
        formData.dateOfBirth
      );

      if (formData.image) {
        data.append("image", formData.image);
      }

      const response = await axios.put(
        `${base_url}/profile/update`,
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
          result?.message ||
            "Profile updated successfully"
        );

        setProfile(result?.expert || profile);

        if (result?.expert?.image) {
          setImagePreview(`${img_url}${result.expert.image}`);
        }

        setFormData((prev) => ({
          ...prev,
          image: null,
        }));
      } else {
        toast.error(
          result?.message || "Unable to update profile"
        );
      }
    } catch (error) {
      console.error("Update profile error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

const handelRemoveExpertise = (ind)=>{
    const filterExpertis = formData.expertise.filter((_,index)=>index !=ind);

    setFormData(prev=>({...prev,expertise:filterExpertis}))
}

  // ---------------------------------------
  // Loading
  // ---------------------------------------

  if (loading) {
    return <Loading />;
  }

  // ---------------------------------------
  // Classes
  // ---------------------------------------

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-white dark:focus:ring-white";

  const labelClass =
    "mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300";

  const sectionClass =
    "rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03] sm:p-7";

  return (
    <div className="h-screen overflow-auto bg-gray-50 p-4 text-black dark:bg-black dark:text-white sm:p-6">

      <div className="mx-auto max-w-6xl">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="mb-6">

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Profile
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Update your personal and professional information
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="space-y-6">

            {/* =====================================
                PROFILE IMAGE
            ====================================== */}

            <section className={sectionClass}>

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-white/[0.06] dark:text-gray-300">
                  <FiCamera size={19} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Profile Photo
                  </h2>

                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Upload your professional profile photo
                  </p>
                </div>

              </div>

              <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">

                <div className="relative">

                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-100 dark:border-white/10 dark:bg-white/[0.06]">

                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FiUser
                        size={40}
                        className="text-gray-400"
                      />
                    )}

                  </div>

                </div>

                <div>

                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.07]">

                    <FiCamera size={16} />
                    Change Photo

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                  </label>

                  {formData.image && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="ml-2 inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
                    >
                      <FiX size={15} />
                      Remove
                    </button>
                  )}

                  <p className="mt-2 text-xs text-gray-400">
                    JPG, PNG or WEBP. Maximum 5MB.
                  </p>

                </div>

              </div>

            </section>

            {/* =====================================
                PERSONAL INFORMATION
            ====================================== */}

            <section className={sectionClass}>

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-white/[0.06] dark:text-gray-300">
                  <FiUser size={19} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Personal Information
                  </h2>

                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Basic information about you
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* Full Name */}

                <div>
                  <label className={labelClass}>
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className={inputClass}
                  />
                </div>

           

              

                <div>
                  <label className={labelClass}>
                    Phone
                  </label>

                  <div className="relative">

                    <FiPhone
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className={`${inputClass} pl-11`}
                    />

                  </div>
                </div>

                {/* Gender */}

                <div>
                  <label className={labelClass}>
                    Gender
                  </label>

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full rounded-xl border border-gray-200 bg-white dark:bg-black px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black dark:border-white/10  dark:text-white dark:placeholder:text-gray-500 dark:focus:border-white dark:focus:ring-white`}
                    // className={`w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-white dark:focus:ring-white`}
                  >
                    <option value="">
                      Select gender
                    </option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                {/* DOB */}

                <div>
                  <label className={labelClass}>
                    Date of Birth
                  </label>

                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

              </div>

            </section>

            {/* =====================================
                PROFESSIONAL INFORMATION
            ====================================== */}

            <section className={sectionClass}>

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-white/[0.06] dark:text-gray-300">
                  <FiBriefcase size={19} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Professional Information
                  </h2>

                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Your professional details
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* Designation */}

                <div>
                  <label className={labelClass}>
                    Designation
                  </label>

                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="e.g. CSSD Manager"
                    className={inputClass}
                  />
                </div>

                {/* Organization */}

                <div>
                  <label className={labelClass}>
                    Organization
                  </label>

                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Organization name"
                    className={inputClass}
                  />
                </div>

                {/* Qualification */}

                <div>
                  <label className={labelClass}>
                    Qualification
                  </label>

                  <div className="relative">

                    <FiBookOpen
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      placeholder="Your qualification"
                      className={`${inputClass} pl-11`}
                    />

                  </div>
                </div>

                {/* Specialization */}

                <div>
                  <label className={labelClass}>
                    Specialization
                  </label>

                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="Your specialization"
                    className={inputClass}
                  />
                </div>

                {/* Experience */}

                <div>
                  <label className={labelClass}>
                    Experience (Years)
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    placeholder="Years of experience"
                    className={inputClass}
                  />
                </div>

              

                <div>
                  <label className={labelClass}>
                    Department
                  </label>

                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Department"
                    className={inputClass}
                  />
                </div>

                {/* Expertise */}

                <div>
                  <label className={labelClass}>
                    Expertise
                  </label>

                  <input
                    type="text"
                    name="expertise"
                    value={expertise}
                    onChange={(e)=>{setexpertise(e.target.value)}}
                    onKeyDown={(e)=>handelExpertise(e)}
                    

                    placeholder="CSSD, Infection Control, etc."
                    className={inputClass}
                  />
<div className="mt-3 flex flex-wrap gap-2">
  {formData.expertise?.map((item, index) => (
    <span
      key={`${item}-${index}`}
      className="
        inline-flex items-center gap-2
        rounded-lg
        border border-gray-200
        bg-white
        px-3 py-2
        text-xs font-medium
        text-gray-800
        shadow-sm
        dark:border-white/10
        dark:bg-white/[0.04]
        dark:text-gray-200
      "
    >
      {item}

      <button
        type="button"
        onClick={() => handelRemoveExpertise(index)}
        className="
          flex h-5 w-5 items-center justify-center
          rounded-md
          text-gray-400
          transition-colors
          hover:bg-red-500
          hover:text-white
          dark:text-gray-500
          dark:hover:bg-red-500
          dark:hover:text-white
        "
      >
        <FiX size={12} />
      </button>
    </span>
  ))}
</div>
                  
                </div>

              </div>

            </section>

            {/* =====================================
                ABOUT
            ====================================== */}

            <section className={sectionClass}>

              <div className="mb-5">

                <h2 className="font-semibold text-gray-900 dark:text-white">
                  About
                </h2>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  Write a short professional introduction
                </p>

              </div>

              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows={6}
                placeholder="Tell us about yourself..."
                className={`${inputClass} resize-y leading-6`}
              />

            </section>

            {/* =====================================
                LOCATION
            ====================================== */}

            <section className={sectionClass}>

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-white/[0.06] dark:text-gray-300">
                  <FiMapPin size={19} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Location
                  </h2>

                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Your current location details
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <div className="md:col-span-2">

                  <label className={labelClass}>
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter address"
                    className={`${inputClass} resize-none`}
                  />

                </div>

                <div>

                  <label className={labelClass}>
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className={inputClass}
                  />

                </div>

                <div>

                  <label className={labelClass}>
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className={inputClass}
                  />

                </div>

              </div>

            </section>

            {/* =====================================
                SOCIAL
            ====================================== */}

            <section className={sectionClass}>

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-white/[0.06] dark:text-gray-300">
                  <FiGlobe size={19} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    Social Profile
                  </h2>

                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Add your professional social profile
                  </p>
                </div>

              </div>

              <div>

                <label className={labelClass}>
                  LinkedIn URL
                </label>

                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/your-profile"
                  className={inputClass}
                />

              </div>

            </section>

          </div>

          {/* =====================================
              SAVE BUTTON
          ====================================== */}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() => window.history.back()}
              disabled={saving}
              className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.07]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-7 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >

              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave size={17} />
                  Save Changes
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