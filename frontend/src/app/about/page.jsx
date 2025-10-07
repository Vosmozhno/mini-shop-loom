"use client";

import { useEffect, useState } from "react";
import { getPageBySlug } from "@/lib/strapi";
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import Image from 'next/image';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export default function AboutPage() {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPageBySlug('about').then(data => {
      setPage(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <main className="p-6 text-center min-h-[70vh] flex items-center justify-center">Загрузка...</main>;
  }

  if (!page) {
    return (
      <main className="p-6 text-center">
        <h1 className="text-2xl font-bold">Страница не найдена</h1>
        <p>Не удалось загрузить контент. Попробуйте позже.</p>
      </main>
    );
  }

  const imageUrl = page.about_image?.url 
    ? `${STRAPI_URL}${page.about_image.url}` 
    : null;
  const imageAlt = page.about_image?.alternativeText || "Изображение о компании";

  return (
    <main className="min-h-[80vh] flex items-center justify-center p-6 sm:p-12">
      
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        
        {imageUrl && (
          <div className="w-full h-[70vh] relative rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              style={{ objectFit: 'cover' }}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}
        
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter text-white mb-8">
            {page.title}
          </h1>
          
          <div className="prose prose-invert prose-xl max-w-none">
            {page.content && <BlocksRenderer content={page.content} />}
          </div>
        </div>
        
      </div>
    </main>
  );
}