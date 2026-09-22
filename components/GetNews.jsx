"use client";

import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { base_url, img_url } from "./utils";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiPlus,
} from "react-icons/fi";
import { MdWorkOutline } from "react-icons/md";
import Link from "next/link";
import { FcApproval, FcCancel } from "react-icons/fc";

const GetNews = ({setShowCreate}) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${base_url}/news/get`, {
        withCredentials: true,
      });

      const data = response?.data;


      setJobs(data.news);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    if (!search.trim()) return jobs;

    const searchText = search.toLowerCase();

    return jobs.filter(
      (job) =>
        job?.title?.toLowerCase().includes(searchText) ||
        job?.category?.toLowerCase().includes(searchText)
    );
  }, [jobs, search]);

 


  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) return;

    try {
      // Change this endpoint according to your backend
      await axios.delete(`${base_url}/news/delete/${id}`, {
        withCredentials: true,
      });

      setJobs((prev) => prev.filter((job) => job._id !== id));
    } catch (error) {
      console.error("Delete event error:", error);
    }
  };



  return (
    <div className="w-full min-h-screen bg-white dark:bg-black text-black dark:text-white p-4 sm:p-6">


      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl border border-black dark:border-white flex items-center justify-center">
              <MdWorkOutline size={22} />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                News
              </h1>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Manage all your news postings
              </p>
            </div>
          </div>
        </div>

      
        <button
          type="button"
          onClick={()=>setShowCreate(true)}
          className="
            inline-flex items-center justify-center gap-2
            px-5 py-3 rounded-xl
            bg-black text-white
            dark:bg-white dark:text-black
            font-semibold
            hover:opacity-80
            transition
          "
        >
          <FiPlus size={18} />
          Add News
        </button>
      </div>

      
      <div className="mb-5">
        <div className="relative max-w-md">

          <FiSearch
            size={18}
            className="
              absolute left-4 top-1/2 -translate-y-1/2
              text-gray-500 dark:text-gray-400
            "
          />

          <input
            type="text"
            placeholder="Search event..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              h-12
              pl-11 pr-4
              rounded-xl
              border border-gray-200 dark:border-gray-800
              bg-white dark:bg-black
              text-black dark:text-white
              placeholder:text-gray-400
              outline-none
              focus:border-black dark:focus:border-white
              transition
            "
          />

        </div>
      </div>

     
      <div
        className="
          w-full
          overflow-hidden
          rounded-2xl
          border border-gray-200 dark:border-gray-800
          bg-white dark:bg-black
        "
      >
        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px] text-sm">

 
            <thead>
              <tr
                className="
                  border-b border-gray-200 dark:border-gray-800
                  bg-gray-50 dark:bg-gray-950
                "
              >
                <th className="px-5 py-4 text-left font-semibold">
                  #
                </th>
<th className="px-5 py-4 text-left font-semibold">
                  Image
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  Event Title
                </th>

                

                <th className="px-5 py-4 text-left font-semibold">
                  Publication Date
                </th>
 <th className="px-5 py-4 text-center font-semibold">
                  category
                </th>
                <th className="px-5 py-4 text-center font-semibold">
                  status
                </th>

               

                <th className="px-5 py-4 text-center font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

             <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    Loading jobs...
                  </td>
                </tr>
              ) : filteredJobs.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    No events found
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job, index) => (
                  <tr
                    key={job._id}
                    className="
                      border-b last:border-b-0
                      border-gray-100 dark:border-gray-900
                      hover:bg-gray-50 dark:hover:bg-gray-950
                      transition
                    "
                  >

              
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400">
                      {index + 1}
                    </td>

     <td>
<img src={`${img_url}${job.featuredImage}`} alt=""  className="h-24 "/>

     </td>


         
                    <td className="px-5 py-4">
                      <div className="font-semibold">
                        {job?.title || "Untitled Job"}
                      </div>

                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        ID: {job?._id}
                      </div>
                    </td>

  {/* <td className="px-5 py-4">

                      <span
                        className={`
                          inline-flex
                          items-center
                          px-3 py-1
                          rounded-full
                          text-xs
                          font-semibold
                          border
                          ${
                            job?.status === "PUBLISHED"
                              ? `
                                border-black
                                bg-black
                                text-white
                                dark:border-white
                                dark:bg-white
                                dark:text-black
                              `
                              : `
                                border-gray-300
                                text-gray-600
                                bg-gray-100
                                dark:border-gray-700
                                dark:bg-gray-900
                                dark:text-gray-300
                              `
                          }
                        `}
                      >
                        {job?.status || "UNKNOWN"}
                      </span>

                    </td> */}
                    <td className="px-5 py-4">
                      <span className="text-gray-700 dark:text-gray-300">
                          {job?.publicationDate
    ? new Date(job.publicationDate).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-"}
                      </span>
                    </td>

                 
                    

               
                    <td className="px-5 py-4 text-center">
  {job.category ||  "-"}
</td>
               
                    <td className="px-5 py-4 text-center text-3xl">
  {job.rejected ? <FcCancel  /> :<FcApproval /> }
</td>

                    

                  
                    <td className="px-5 py-4">

                      <div className="flex items-center justify-center gap-2">

                  
                        <Link
                         href={`/news/${job._id}/view`}
                          className="
                            w-9 h-9
                            flex items-center justify-center
                            rounded-lg
                            border border-gray-200 dark:border-gray-800
                            bg-white dark:bg-black
                            hover:bg-black hover:text-white
                            dark:hover:bg-white dark:hover:text-black
                            transition
                          "
                        >
                          <FiEye size={16} />
                        </Link>

                       
                        <Link
                        href={`/news/${job._id}/edit`}
                          
                          className="
                            w-9 h-9
                            flex items-center justify-center
                            rounded-lg
                            border border-gray-200 dark:border-gray-800
                            bg-white dark:bg-black
                            hover:bg-black hover:text-white
                            dark:hover:bg-white dark:hover:text-black
                            transition
                          "
                        >
                          <FiEdit2 size={16} />
                        </Link>

               
                        <button
                          type="button"
                          title="Delete Job"
                          onClick={() => handleDelete(job._id)}
                          className="
                            w-9 h-9
                            flex items-center justify-center
                            rounded-lg
                            border border-gray-200 dark:border-gray-800
                            bg-white dark:bg-black
                            hover:bg-black hover:text-white
                            dark:hover:bg-white dark:hover:text-black
                            transition
                          "
                        >
                          <FiTrash2 size={16} />
                        </button>

                      </div>

                    </td>

                  </tr>
                ))
              )}

            </tbody> 

          </table>

        </div>
      </div>

      {/* Footer */}
      {!loading && filteredJobs.length > 0 && (
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
          <span>
            Showing {filteredJobs.length} of {jobs.length} jobs
          </span>
        </div>
      )}

    </div>
  );
};

export default GetNews;