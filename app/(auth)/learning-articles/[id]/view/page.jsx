"use client"
import { base_url, img_url } from '@/components/utils';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { 
  FaCalendarAlt, 
  FaEye, 
  FaFolderOpen, 
  FaTags, 
  FaPenNib 
} from 'react-icons/fa';
import { MdOutlineArticle } from 'react-icons/md';

const ArticleViewPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${base_url}/article/get-article/${id}`, {
        withCredentials: true
      });
      const data = await response.data;
      if (data.success) {
        setArticle(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch article:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  // Helper to resolve image paths (handles relative and absolute URLs)
  const getImageUrl = (url) => {
    return `${img_url}${url}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <MdOutlineArticle className="text-6xl text-gray-400 dark:text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Article not found</h2>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-auto p-4 md:p-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      {/* Main Panel Wrapper */}
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
        
        {/* Top Header Section / Thumbnail */}
        {article.thumbnail && (
          <div className="w-full h-64 md:h-96 overflow-hidden relative">
            <img 
              src={getImageUrl(article.thumbnail)} 
              alt={article.title} 
              className="w-full h-full object-cover"
            />
            {/* Status Badge overlay */}
            <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-white/20">
              {article.status}
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 md:p-10">
          
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              <FaFolderOpen className="text-blue-500" />
              <span>{article.category || 'Uncategorized'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FaCalendarAlt className="text-gray-400" />
              <span>{new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FaEye className="text-gray-400" />
              <span>{article.views} Views</span>
            </div>
          </div>

          {/* Title & Short Description */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            {article.title}
          </h1>
          
          {article.shortDescription && (
            <div className="text-lg text-gray-700 dark:text-gray-300 border-l-4 border-blue-500 pl-4 py-1 mb-10 italic bg-gray-50 dark:bg-gray-800/50 rounded-r-lg">
              {article.shortDescription}
            </div>
          )}

          <hr className="border-gray-200 dark:border-gray-700 mb-10" />

          {/* Dynamic Content Sections */}
          <div className="space-y-12">
            {article.content?.map((section, index) => (
              <div 
                key={section._id || index} 
                className="flex flex-col gap-6"
              >
                {/* Section Title with dynamic color indicator */}
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm text-white text-xs"
                    style={{ backgroundColor: section.color || '#3b82f6' }} // Fallback to blue if no color
                  >
                    {index + 1}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {section.title}
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  {/* Rich Text Editor Content */}
                  <div 
                    className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: section.des }}
                  />

                  {/* Section Image (if available) */}
                  {section.image && (
                    <div className="rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700">
                      <img 
                        src={getImageUrl(section.image)} 
                        alt={section.title}
                        className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer / Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-3 text-gray-800 dark:text-gray-200 font-semibold">
                <FaTags /> 
                <h3>Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-md border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default ArticleViewPage