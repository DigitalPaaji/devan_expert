"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiFileText,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
import { base_url, img_url } from "./utils";
import Link from "next/link";



const ArticlesCompo = ({setCreateArticle}) => {
  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchArticles = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${base_url}/article/get-all`, {
        withCredentials: true,
      });

      const data = response.data;

      if (data.success) {
        setAllArticles(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch articles:", error);
      setAllArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const filteredArticles = allArticles.filter((article) =>
    `${article.title} ${article.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";

      case "DRAFT":
        return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";

      case "REJECTED":
        return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";

      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400";
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 py-6 text-gray-900 transition-colors dark:bg-[#0b0f14] dark:text-gray-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white dark:bg-white dark:text-black">
                <FiFileText size={21} />
              </div>

              <div>
                <h1 className="text-xl font-semibold sm:text-2xl">
                  My Articles
                </h1>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage and monitor your articles
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={()=>setCreateArticle(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-black"
          >
            <FiPlus size={17} />
            Create Article
          </button>
        </div>

        {/* Search */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <FiSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-400 dark:border-gray-800 dark:bg-[#11161d] dark:focus:border-gray-600"
            />
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            {filteredArticles.length}{" "}
            {filteredArticles.length === 1 ? "article" : "articles"}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-[#11161d]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-[#0e1319]">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Article
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Category
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Views
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {loading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />

                          <div className="space-y-2">
                            <div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                            <div className="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                      </td>

                      <td className="px-6 py-4">
                        <div className="h-7 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                      </td>

                      <td className="px-6 py-4">
                        <div className="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                      </td>

                      <td className="px-6 py-4">
                        <div className="ml-auto h-8 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                      </td>
                    </tr>
                  ))
                ) : filteredArticles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                          <FiFileText
                            size={24}
                            className="text-gray-400"
                          />
                        </div>

                        <h3 className="font-medium">
                          No articles found
                        </h3>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {search
                            ? "Try a different search term."
                            : "You haven't created any articles yet."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredArticles.map((article) => (
                    <tr
                      key={article._id}
                      className="group transition hover:bg-gray-50 dark:hover:bg-[#151b23]"
                    >
                      {/* Article */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                            <img
                              src={`${img_url}${article.thumbnail}`}
                              alt={article.title}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                          </div>

                          <div className="min-w-0">
                            <h3 className="max-w-[300px] truncate text-sm font-semibold text-gray-900 dark:text-white">
                              {article.title}
                            </h3>

                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              ID: {article._id.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                          {article.category}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                            article.status
                          )}`}
                        >
                          {article.status}
                        </span>
                      </td>

                      {/* Views */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <FiEye
                            size={16}
                            className="text-gray-400"
                          />
                          {article.views.toLocaleString()}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                          href={`/learning-articles/${article._id}/edit`}
                           
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-black dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                          >
                            <FiEdit2 size={16} />
                          </Link>

                          <Link
                          href={`/learning-articles/${article._id}/view`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                          >
                            <FiEye size={16} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlesCompo;
