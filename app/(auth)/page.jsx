"use client";

import { base_url } from "@/components/utils";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiUsers,
  FiFileText,
  FiBriefcase,
  FiCalendar,
  FiBarChart2,
  FiEye,
  FiNewspaper,
  FiLoader,
} from "react-icons/fi";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Bar, Line, Doughnut } from "react-chartjs-2";
import { BsNewspaper } from "react-icons/bs";
import { FaNewspaper } from "react-icons/fa";


// Register ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);


const Page = () => {

  const [weekQuestion, setWeekQuestion] = useState(null);

  const [dashboardData, setDashboardData] = useState(null);

  const [dashboardLoading, setDashboardLoading] = useState(true);


  // ==========================================
  // WEEKLY QUESTION
  // ==========================================

  const getThisWeekQuestion = async () => {
    try {

      const response = await axios.get(
        `${base_url}/challenges/myweeklyquestion`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data.success) {
        setWeekQuestion(data.data);
      } else {
        setWeekQuestion(null);
      }

    } catch (error) {

      setWeekQuestion(null);

    }
  };


  // ==========================================
  // DASHBOARD DATA
  // ==========================================

  const fetchDashboardData = async () => {

    try {

      setDashboardLoading(true);

      const response = await axios.get(
        `${base_url}/profile/dashboard`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      console.log(data);

      if (data.success) {
        setDashboardData(data.data);
      }

    } catch (error) {

      console.log(error);

    } finally {

      setDashboardLoading(false);

    }
  };


  useEffect(() => {

    getThisWeekQuestion();

    fetchDashboardData();

  }, []);




  const overview = dashboardData?.overview || {};

  const chart = dashboardData?.chart || [];

  const newsByCategory =
    dashboardData?.newsByCategory || [];



  const contentChartData = {

    labels: chart.map(
      (item) => item.monthName
    ),

    datasets: [

      {
        label: "Articles",

        data: chart.map(
          (item) => item.articles
        ),

        backgroundColor:
          "rgba(59, 130, 246, 0.75)",

        borderRadius: 6,
      },

      {
        label: "News",

        data: chart.map(
          (item) => item.news
        ),

        backgroundColor:
          "rgba(168, 85, 247, 0.75)",

        borderRadius: 6,
      },

      {
        label: "Jobs",

        data: chart.map(
          (item) => item.jobs
        ),

        backgroundColor:
          "rgba(16, 185, 129, 0.75)",

        borderRadius: 6,
      },

      {
        label: "Events",

        data: chart.map(
          (item) => item.events
        ),

        backgroundColor:
          "rgba(245, 158, 11, 0.75)",

        borderRadius: 6,
      },

    ],
  };


  

  const contentChartOptions = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {

        position: "bottom",

        labels: {

          usePointStyle: true,

          padding: 20,

          color: "#71717a",

        },

      },

    },

    scales: {

      x: {

        grid: {
          display: false,
        },

        ticks: {
          color: "#71717a",
        },

      },

      y: {

        beginAtZero: true,

        ticks: {

          precision: 0,

          color: "#71717a",

        },

        grid: {

          color:
            "rgba(113, 113, 122, 0.12)",

        },

      },

    },

  };


 
  const activityChartData = {

    labels: chart.map(
      (item) => item.monthName
    ),

    datasets: [

      {
        label: "Views",

        data: chart.map(
          (item) => item.views
        ),

        borderColor:
          "rgb(59, 130, 246)",

        backgroundColor:
          "rgba(59, 130, 246, 0.12)",

        fill: true,

        tension: 0.4,

        pointRadius: 4,

        pointHoverRadius: 6,
      },

      {
        label: "Applications",

        data: chart.map(
          (item) => item.applications
        ),

        borderColor:
          "rgb(16, 185, 129)",

        backgroundColor:
          "rgba(16, 185, 129, 0.10)",

        fill: true,

        tension: 0.4,

        pointRadius: 4,

        pointHoverRadius: 6,
      },

    ],

  };




  const activityChartOptions = {

    responsive: true,

    maintainAspectRatio: false,

    interaction: {

      mode: "index",

      intersect: false,

    },

    plugins: {

      legend: {

        position: "bottom",

        labels: {

          usePointStyle: true,

          padding: 20,

          color: "#71717a",

        },

      },

    },

    scales: {

      x: {

        grid: {
          display: false,
        },

        ticks: {
          color: "#71717a",
        },

      },

      y: {

        beginAtZero: true,

        ticks: {

          precision: 0,

          color: "#71717a",

        },

        grid: {

          color:
            "rgba(113, 113, 122, 0.12)",

        },

      },

    },

  };


  // ==========================================
  // NEWS CATEGORY DOUGHNUT
  // ==========================================

  const newsCategoryData = {

    labels: newsByCategory.map(
      (item) => item.category
    ),

    datasets: [

      {

        data: newsByCategory.map(
          (item) => item.count
        ),

        backgroundColor: [

          "rgba(59, 130, 246, 0.8)",

          "rgba(168, 85, 247, 0.8)",

          "rgba(16, 185, 129, 0.8)",

          "rgba(245, 158, 11, 0.8)",

        ],

        borderWidth: 0,

        hoverOffset: 5,

      },

    ],

  };


  const newsCategoryOptions = {

    responsive: true,

    maintainAspectRatio: false,

    cutout: "68%",

    plugins: {

      legend: {

        position: "bottom",

        labels: {

          usePointStyle: true,

          padding: 16,

          color: "#71717a",

          font: {
            size: 11,
          },

        },

      },

    },

  };


  // ==========================================
  // STAT CARD
  // ==========================================

  const StatCard = ({
    title,
    value,
    icon,
    iconClass,
  }) => {

    return (

      <div
        className="
        
          rounded-2xl
          border
          border-zinc-200
          bg-white
          p-4
          shadow-sm
          transition
          hover:-translate-y-0.5
          hover:shadow-md
          dark:border-zinc-800
          dark:bg-zinc-900
        "
      >

        <div className="flex items-start justify-between">

          <div>

            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {title}
            </p>

            <h3 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
              {value}
            </h3>

          </div>

          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
          >
            {icon}
          </div>

        </div>

      </div>

    );

  };


  return (

    <div className="w-full space-y-6 h-screen overflow-auto px-4">


      {weekQuestion?.question && (

        <div
          className={`flex flex-col gap-4 rounded-xl border p-4 transition sm:flex-row sm:items-center sm:justify-between ${
            weekQuestion.yours
              ? "border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10"
              : "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50"
          }`}
        >

          {/* LEFT */}

          <div className="flex min-w-0 items-center gap-3">

            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                weekQuestion.yours
                  ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                  : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >

              {weekQuestion.yours ? (
                <FiCheckCircle size={20} />
              ) : (
                <FiClock size={20} />
              )}

            </div>


            <div className="min-w-0">

              <div className="flex flex-wrap items-center gap-2">

                <h3
                  className={`text-sm font-semibold ${
                    weekQuestion.yours
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >

                  {weekQuestion.yours
                    ? "Your Active Weekly Challenge"
                    : "Active Weekly Challenge"}

                </h3>


                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    weekQuestion.yours
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                      : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >

                  {weekQuestion.question.status}

                </span>

              </div>


              <p className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">

                {weekQuestion.question.question}

              </p>

            </div>

          </div>


          {/* RIGHT */}

          <div className="flex items-center gap-3 sm:shrink-0">

            <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">

              <FiUsers size={14} />

              <span>

                {weekQuestion.answerCount || 0}{" "}

                {(weekQuestion.answerCount || 0) === 1
                  ? "Answer"
                  : "Answers"}

              </span>

            </div>


            {weekQuestion.yours && (

              <Link
                href={`/weekly-challenges/${weekQuestion.question._id}`}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-emerald-600
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-white
                  transition
                  hover:bg-emerald-700
                  dark:bg-emerald-500
                  dark:text-black
                  dark:hover:bg-emerald-400
                "
              >

                View

                <FiArrowRight size={14} />

              </Link>

            )}

          </div>

        </div>

      )}

      <div>

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-black">

            <FiBarChart2 size={19} />

          </div>

          <div>

            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              Dashboard Overview
            </h2>

            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Track your content and performance
            </p>

          </div>

        </div>

      </div>


      {/* ==========================================
          LOADING
      ========================================== */}

      {dashboardLoading ? (

        <div className="flex min-h-[250px] items-center justify-center rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">

          <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">

            <FiLoader
              size={18}
              className="animate-spin"
            />

            Loading dashboard...

          </div>

        </div>

      ) : (

        <>


          {/* ==========================================
              STAT CARDS
          ========================================== */}

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

            <StatCard
              title="Articles"
              value={overview.articles || 0}
              icon={<FiFileText size={19} />}
              iconClass="
                bg-blue-50
                text-blue-600
                dark:bg-blue-500/10
                dark:text-blue-400
              "
            />


            <StatCard
              title="News"
              value={overview.news || 0}
              icon={<BsNewspaper size={19} />}
              iconClass="
                bg-purple-50
                text-purple-600
                dark:bg-purple-500/10
                dark:text-purple-400
              "
            />


            <StatCard
              title="Jobs"
              value={overview.jobs || 0}
              icon={<FiBriefcase size={19} />}
              iconClass="
                bg-emerald-50
                text-emerald-600
                dark:bg-emerald-500/10
                dark:text-emerald-400
              "
            />


            <StatCard
              title="Events"
              value={overview.events || 0}
              icon={<FiCalendar size={19} />}
              iconClass="
                bg-amber-50
                text-amber-600
                dark:bg-amber-500/10
                dark:text-amber-400
              "
            />

          </div>


          {/* ==========================================
              SECONDARY STATS
          ========================================== */}

          <div className="grid grid-cols-2 gap-3">

            <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">

              <div className="flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">

                  <FiEye size={16} />

                </div>

                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Article Views
                </span>

              </div>


              <p className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">

                {overview.articleViews || 0}

              </p>

            </div>


            <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">

              <div className="flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">

                  <FiUsers size={16} />

                </div>

                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Job Applications
                </span>

              </div>


              <p className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">

                {overview.jobApplications || 0}

              </p>

            </div>

          </div>


          {/* ==========================================
              CHARTS
          ========================================== */}

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">


            {/* CONTENT CHART */}

            <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">

              <div className="mb-5">

                <div className="flex items-center gap-2">

                  <FiBarChart2
                    size={17}
                    className="text-zinc-500 dark:text-zinc-400"
                  />

                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Content Overview
                  </h3>

                </div>

                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Articles, news, jobs and events
                </p>

              </div>


              <div className="h-[300px]">

                {chart.length > 0 ? (

                  <Bar
                    data={contentChartData}
                    options={contentChartOptions}
                  />

                ) : (

                  <div className="flex h-full items-center justify-center text-sm text-zinc-400">

                    No chart data available

                  </div>

                )}

              </div>

            </div>


            {/* VIEWS CHART */}

            <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">

              <div className="mb-5">

                <div className="flex items-center gap-2">

                  <FiEye
                    size={17}
                    className="text-zinc-500 dark:text-zinc-400"
                  />

                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Views & Applications
                  </h3>

                </div>

                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Monthly performance
                </p>

              </div>


              <div className="h-[300px]">

                {chart.length > 0 ? (

                  <Line
                    data={activityChartData}
                    options={activityChartOptions}
                  />

                ) : (

                  <div className="flex h-full items-center justify-center text-sm text-zinc-400">

                    No activity data available

                  </div>

                )}

              </div>

            </div>

          </div>


          {/* ==========================================
              NEWS CATEGORY
          ========================================== */}

          <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">

            <div className="mb-5">

              <div className="flex items-center gap-2">

                <FaNewspaper
                  size={17}
                  className="text-zinc-500 dark:text-zinc-400"
                />

                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                  News by Category
                </h3>

              </div>

              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Distribution of your news
              </p>

            </div>


            <div className="mx-auto h-[280px] max-w-[420px]">

              {newsByCategory.length > 0 ? (

                <Doughnut
                  data={newsCategoryData}
                  options={newsCategoryOptions}
                />

              ) : (

                <div className="flex h-full items-center justify-center text-sm text-zinc-400">

                  No news category data

                </div>

              )}

            </div>

          </div>


        </>

      )}

    </div>
  );
};

export default Page;