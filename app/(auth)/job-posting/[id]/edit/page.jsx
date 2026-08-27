"use client"
import { base_url } from '@/components/utils'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
  FiBriefcase,
  FiMapPin,
  FiDollarSign,
  FiUsers,
  FiCalendar,
  FiFileText,
  FiPlus,
  FiTrash2,
  FiCheck,
  FiChevronRight,
  FiChevronLeft,
  FiAward,
  FiSettings,
} from "react-icons/fi";
import { toast } from "react-toastify";

import { VscLoading } from "react-icons/vsc";
import Loading from '@/components/Loading'




const page = () => {
const {id} = useParams()
const route = useRouter()
  const [step, setStep] = useState(1);
  const [loading,setLoading]=useState(true)
const [formData, setFormData]=useState()

const  fetchJob = async()=>{
    try {
        setLoading(true)
        const response = await axios.get(`${base_url}/job/get/${id}?type=edit`,{
            withCredentials:true
        });
        const data = await response.data;
       

if(data.success){
setFormData(data.data)
}
else{
setFormData(null)
}


    } catch (error) {
      setFormData(null)
  
    }finally{
        setLoading(false)
    }
}

useEffect(()=>{
    fetchJob()
},[])

const steps = [
    {
      id: 1,
      title: "Basic Details",
      icon: FiBriefcase,
    },
    {
      id: 2,
      title: "Job Details",
      icon: FiFileText,
    },
    {
      id: 3,
      title: "Experience & Skills",
      icon: FiAward,
    },
    {
      id: 4,
      title: "Location & Salary",
      icon: FiMapPin,
    },
    {
      id: 5,
      title: "Review & Publish",
      icon: FiCheck,
    },
  ];

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateNestedField = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const updateArrayField = (field, index, value) => {
    setFormData((prev) => {
      const updated = [...prev[field]];
      updated[index] = value;

      return {
        ...prev,
        [field]: updated,
      };
    });
  };

  const addArrayField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayField = (field, index) => {
    setFormData((prev) => {
      const updated = prev[field].filter((_, i) => i !== index);

      return {
        ...prev,
        [field]: updated.length ? updated : [""],
      };
    });
  };

  const nextStep = () => {


if(step==1){
if(!formData.title.trim() || !formData.category || !formData.description){
toast.warn("fill required field")

    return
}


}

    if (step < steps.length) {
      setStep((prev) => prev + 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const previousStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleSubmit = async () => {
   
setLoading(true)
try {
    const response = await axios.put(`${base_url}/job/update/${id}`,formData,{
        withCredentials:true
    });
const data = await response.data;
if(data.success){
    toast.success(data.message)
route.push(`/job-posting/${id}/view`)
  
}else{
    toast.error(data.message)
}



} catch (error) {
    toast.error(error?.response?.data?.message)
    
}finally{
    setLoading(false)
}

  };


  if(loading){
    return <Loading />
  }
const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-white dark:focus:ring-white";
  const inputClassSelect =
    "w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-4 py-3 text-sm text-black dark:text-white outline-none transition  focus:border-black focus:ring-1 focus:ring-black  dark:focus:ring-white";

  const labelClass =
    "mb-2 block text-sm font-medium text-gray-800 dark:text-gray-200";

  const sectionClass =
    "rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03] sm:p-7";

  return (
    <div>
<div className="h-screen overflow-auto bg-gray-50 px-4 py-6 text-black dark:bg-[#080808] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white dark:bg-white dark:text-black">
              <FiBriefcase size={21} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Edit Job
              </h1>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Edit and publish  job .
              </p>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/[0.03]">
          <div className="overflow-x-auto">
            <div className="flex min-w-[650px]">
              {steps.map((item, index) => {
                const Icon = item.icon;
                const active = step === item.id;
                const completed = step > item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (completed || active) {
                        setStep(item.id);
                      }
                    }}
                    className={`relative flex flex-1 items-center gap-3 px-5 py-4 text-left transition ${
                      active
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : completed
                        ? "text-black dark:text-white"
                        : "text-gray-400 dark:text-gray-200"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                        active
                          ? "border-white/30 bg-white/10 dark:border-black/20 dark:bg-black/10"
                          : completed
                          ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                          : "border-gray-200 dark:border-white/10"
                      }`}
                    >
                      {completed ? (
                        <FiCheck size={16} />
                      ) : (
                        <Icon size={16} />
                      )}
                    </span>

                    <div className="hidden sm:block">
                      <p className="text-[11px] font-medium uppercase tracking-wider opacity-60">
                        Step {item.id}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold">
                        {item.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div >

          {/* STEP 1 */}
          {step === 1 && (
            <div className={sectionClass}>
              <div className="mb-7 border-b border-gray-100 pb-5 dark:border-white/10">
                <h2 className="text-xl font-bold">
                  Basic Job Details
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Start with the basic information about this position.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">

                <div className="md:col-span-2">
                  <label className={labelClass}>
                    Job Title *
                  </label>

                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      updateField("title", e.target.value)
                    }
                    placeholder="e.g. CSSD Technician"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Job Category *
                  </label>

                  <select
                    value={formData.category}
                    onChange={(e) =>
                      updateField("category", e.target.value)
                    }
                    className={`${inputClassSelect}` }
                  >
                    <option value="" >Select category</option>
                    <option value="CSSD Technician">
                      CSSD Technician
                    </option>
                    <option value="CSSD Supervisor">
                      CSSD Supervisor
                    </option>
                    <option value="CSSD Manager">
                      CSSD Manager
                    </option>
                    <option value="Infection Control Professional">
                      Infection Control Professional
                    </option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>
                    Number of Openings
                  </label>

                  <div className="relative">
                    <FiUsers
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={17}
                    />

                    <input
                      type="number"
                      min="1"
                      value={formData.openings}
                      onChange={(e) =>
                        updateField(
                          "openings",
                          Number(e.target.value)
                        )
                      }
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>
                    Job Description *
                  </label>

                  <textarea
                    rows={7}
                    value={formData.description}
                    onChange={(e) =>
                      updateField("description", e.target.value)
                    }
                    placeholder="Describe the role, company expectations and what the candidate will be doing..."
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5">

              {/* Responsibilities */}
              <div className={sectionClass}>
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">
                      Responsibilities
                    </h2>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Add the main responsibilities for this position.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      addArrayField("responsibilities")
                    }
                    className="flex shrink-0 items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-80 dark:bg-white dark:text-black"
                  >
                    <FiPlus />
                    <span className="hidden sm:inline">
                      Add
                    </span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.responsibilities.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          value={item}
                          onChange={(e) =>
                            updateArrayField(
                              "responsibilities",
                              index,
                              e.target.value
                            )
                          }
                          placeholder={`Responsibility ${index + 1}`}
                          className={inputClass}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeArrayField(
                              "responsibilities",
                              index
                            )
                          }
                          className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:border-red-500 hover:text-red-500 dark:border-white/10"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Qualifications */}
              <div className={sectionClass}>
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">
                      Qualifications
                    </h2>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Define the qualifications candidates should have.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      addArrayField("qualifications")
                    }
                    className="flex shrink-0 items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-black"
                  >
                    <FiPlus />
                    <span className="hidden sm:inline">
                      Add
                    </span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.qualifications.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          value={item}
                          onChange={(e) =>
                            updateArrayField(
                              "qualifications",
                              index,
                              e.target.value
                            )
                          }
                          placeholder={`Qualification ${index + 1}`}
                          className={inputClass}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeArrayField(
                              "qualifications",
                              index
                            )
                          }
                          className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-red-500 hover:text-red-500 dark:border-white/10"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-5">

              <div className={sectionClass}>
                <h2 className="mb-1 text-xl font-bold">
                  Experience & Skills
                </h2>

                <p className="mb-7 text-sm text-gray-500 dark:text-gray-400">
                  Define the experience and skills required.
                </p>

                <div className="grid gap-5 md:grid-cols-2">

                  <div>
                    <label className={labelClass}>
                      Minimum Experience
                    </label>

                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.experience.min}
                      onChange={(e) =>
                        updateNestedField(
                          "experience",
                          "min",
                          e.target.value
                        )
                      }
                      className={inputClass}
                    />

                    <p className="mt-2 text-xs text-gray-400">
                      Years of experience
                    </p>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Maximum Experience
                    </label>

                    <input
                      type="number"
                      min="0"
                      placeholder="5"
                      value={formData.experience.max}
                      onChange={(e) =>
                        updateNestedField(
                          "experience",
                          "max",
                          e.target.value
                        )
                      }
                      className={inputClass}
                    />

                    <p className="mt-2 text-xs text-gray-400">
                      Years of experience
                    </p>
                  </div>
                </div>
              </div>

              <div className={sectionClass}>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">
                      Skills
                    </h2>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Add skills required for the position.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => addArrayField("skills")}
                    className="flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-black"
                  >
                    <FiPlus />
                    <span className="hidden sm:inline">
                      Add Skill
                    </span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.skills.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        value={item}
                        onChange={(e) =>
                          updateArrayField(
                            "skills",
                            index,
                            e.target.value
                          )
                        }
                        placeholder={`Skill ${index + 1}`}
                        className={inputClass}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeArrayField(
                            "skills",
                            index
                          )
                        }
                        className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-red-500 hover:text-red-500 dark:border-white/10"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className={sectionClass}>
                <h2 className="mb-5 text-xl font-bold">
                  Job Type & Work Mode
                </h2>

                <div className="grid gap-5 md:grid-cols-2">

                  <div>
                    <label className={labelClass}>
                      Job Type
                    </label>

                    <select
                      value={formData.jobType}
                      onChange={(e) =>
                        updateField(
                          "jobType",
                          e.target.value
                        )
                      }
                      className={inputClassSelect}
                    >
                      <option value="FULL_TIME">
                        Full Time
                      </option>
                      <option value="PART_TIME">
                        Part Time
                      </option>
                      <option value="CONTRACT">
                        Contract
                      </option>
                      <option value="INTERNSHIP">
                        Internship
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Work Mode
                    </label>

                    <select
                      value={formData.workMode}
                      onChange={(e) =>
                        updateField(
                          "workMode",
                          e.target.value
                        )
                      }
                      className={inputClassSelect}
                    >
                      <option value="ONSITE">
                        Onsite
                      </option>
                      <option value="REMOTE">
                        Remote
                      </option>
                      <option value="HYBRID">
                        Hybrid
                      </option>
                    </select>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-5">

              <div className={sectionClass}>
                <div className="mb-6">
                  <div className="mb-2 flex items-center gap-2">
                    <FiMapPin />
                    <h2 className="text-xl font-bold">
                      Location
                    </h2>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Where will this job be located?
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-3">

                  <div>
                    <label className={labelClass}>
                      City
                    </label>

                    <input
                      type="text"
                      value={formData.location.city}
                      onChange={(e) =>
                        updateNestedField(
                          "location",
                          "city",
                          e.target.value
                        )
                      }
                      placeholder="Delhi"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      State
                    </label>

                    <input
                      type="text"
                      value={formData.location.state}
                      onChange={(e) =>
                        updateNestedField(
                          "location",
                          "state",
                          e.target.value
                        )
                      }
                      placeholder="Delhi"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Country
                    </label>

                    <input
                      type="text"
                      value={formData.location.country}
                      onChange={(e) =>
                        updateNestedField(
                          "location",
                          "country",
                          e.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </div>

                </div>
              </div>

              <div className={sectionClass}>
                <div className="mb-6 flex items-center gap-2">
                  <FiDollarSign />
                  <div>
                    <h2 className="text-xl font-bold">
                      Salary
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Configure the salary range.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

                  <div>
                    <label className={labelClass}>
                      Minimum
                    </label>

                    <input
                      type="number"
                      value={formData.salary.min}
                      onChange={(e) =>
                        updateNestedField(
                          "salary",
                          "min",
                          e.target.value
                        )
                      }
                      placeholder="250000"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Maximum
                    </label>

                    <input
                      type="number"
                      value={formData.salary.max}
                      onChange={(e) =>
                        updateNestedField(
                          "salary",
                          "max",
                          e.target.value
                        )
                      }
                      placeholder="500000"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Currency
                    </label>

                    <select
                      value={formData.salary.currency}
                      onChange={(e) =>
                        updateNestedField(
                          "salary",
                          "currency",
                          e.target.value
                        )
                      }
                      className={inputClassSelect}
                    >
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Period
                    </label>

                    <select
                      value={formData.salary.period}
                      onChange={(e) =>
                        updateNestedField(
                          "salary",
                          "period",
                          e.target.value
                        )
                      }
                      className={inputClassSelect}
                    >
                      <option value="YEARLY">
                        Yearly
                      </option>
                      <option value="MONTHLY">
                        Monthly
                      </option>
                    </select>
                  </div>

                </div>

                <label className="mt-5 flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.salary.isNegotiable}
                    onChange={(e) =>
                      updateNestedField(
                        "salary",
                        "isNegotiable",
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 rounded border-gray-300 accent-black dark:accent-white"
                  />

                  <span className="text-sm font-medium">
                    Salary is negotiable
                  </span>
                </label>
              </div>

              <div className={sectionClass}>
                <div className="grid gap-5 md:grid-cols-2">

                  <div>
                    <label className={labelClass}>
                      <span className="flex items-center gap-2">
                        <FiCalendar />
                        Application Deadline
                      </span>
                    </label>

                    <input
                      type="date"
                      value={formData.applicationDeadline}
                      onChange={(e) =>
                        updateField(
                          "applicationDeadline",
                          e.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Job Status
                    </label>

                    <select
                      value={formData.status}
                      onChange={(e) =>
                        updateField(
                          "status",
                          e.target.value
                        )
                      }
                      className={inputClassSelect}
                    >
                      <option value="DRAFT">
                        Draft
                      </option>

                      <option value="PUBLISHED">
                        Published
                      </option>

                      <option value="CLOSED">
                        Closed
                      </option>
                    </select>
                  </div>

                </div>

                <label className="mt-6 flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      updateField(
                        "isFeatured",
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 rounded border-gray-300 accent-black dark:accent-white"
                  />

                  <span className="text-sm font-medium">
                    Feature this job
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <div className="space-y-5">

              <div className={sectionClass}>
                <div className="mb-7 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black">
                    <FiCheck size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">
                      Review Job
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Review all information before creating the job.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  <div className="rounded-xl border border-gray-200 p-4 dark:border-white/10">
                    <p className="text-xs text-gray-500">
                      Job Title
                    </p>
                    <p className="mt-1 font-semibold">
                      {formData.title || "Not provided"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-4 dark:border-white/10">
                    <p className="text-xs text-gray-500">
                      Category
                    </p>
                    <p className="mt-1 font-semibold">
                      {formData.category || "Not provided"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-4 dark:border-white/10">
                    <p className="text-xs text-gray-500">
                      Job Type
                    </p>
                    <p className="mt-1 font-semibold">
                      {formData.jobType}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-4 dark:border-white/10">
                    <p className="text-xs text-gray-500">
                      Work Mode
                    </p>
                    <p className="mt-1 font-semibold">
                      {formData.workMode}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-4 dark:border-white/10">
                    <p className="text-xs text-gray-500">
                      Location
                    </p>
                    <p className="mt-1 font-semibold">
                      {formData.location.city || "Not provided"}
                      {formData.location.state
                        ? `, ${formData.location.state}`
                        : ""}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-4 dark:border-white/10">
                    <p className="text-xs text-gray-500">
                      Openings
                    </p>
                    <p className="mt-1 font-semibold">
                      {formData.openings}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-4 dark:border-white/10 sm:col-span-2">
                    <p className="text-xs text-gray-500">
                      Description
                    </p>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                      {formData.description ||
                        "No description provided"}
                    </p>
                  </div>

                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-100 p-5 dark:border-white/10 dark:bg-white/[0.03]">
                <div className="flex gap-3">
                  <FiSettings
                    className="mt-0.5 shrink-0"
                    size={18}
                  />

                  <div>
                    <p className="text-sm font-semibold">
                      Publishing status
                    </p>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      This job will be created as{" "}
                      <strong className="text-black dark:text-white">
                        {formData.status}
                      </strong>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Navigation */}
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">

            <button
              type="button"
              onClick={previousStep}
              disabled={step === 1}
              className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${
                step === 1
                  ? "cursor-not-allowed text-gray-300 dark:text-gray-700"
                  : "border border-gray-200 hover:bg-gray-100 dark:border-white/10 dark:hover:bg-white/10"
              }`}
            >
              <FiChevronLeft />
              Previous
            </button>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              {step} / {steps.length}
            </div>

            {step < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:opacity-80 dark:bg-white dark:text-black"
              >
                Continue
                <FiChevronRight />
              </button>
            ) : (
              <button
                onClick={()=>handleSubmit()}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:opacity-80 dark:bg-white dark:text-black"
              >
                {loading ?<>
                <VscLoading  className=" animate-spin text-xl"/>
                </>  : <>
                
                <FiCheck />
                Edit Job
                </>}
                
              </button>
            )}

          </div>
        </div>
      </div>
    </div>


    </div>
  )
}

export default page