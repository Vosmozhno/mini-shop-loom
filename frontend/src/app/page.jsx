"use client"; 

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPageBySlug } from "@/lib/strapi";
import { BlocksRenderer } from '@strapi/blocks-react-renderer';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export default function HomePage() {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPageBySlug('home').then(data => {
      setPage(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <main className="bg-neutral-900 min-h-screen" />;
  }
  if (!page) {
    return (
      <main className="p-6 text-center">
        <h1 className="text-2xl font-bold">Добро пожаловать!</h1>
        <p>Не удалось загрузить контент. Загляните в наш каталог.</p>
      </main>
    );
  }

  const imageUrl = page.hero_image?.url 
    ? `${STRAPI_URL}${page.hero_image.url}` 
    : null;

  return (
    <main className="bg-neutral-900 text-white">
      <section 
        className="relative flex items-center justify-center text-center p-6 bg-black bg-cover bg-center"

        style={{ 
          minHeight: 'calc(100vh)',
          ...(imageUrl && { backgroundImage: `url(${imageUrl})` }) 
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-semibold uppercase tracking-wider mb-4">
            {page.title}
          </h1>
          <div className="prose prose-invert prose-lg w-5xl text-lg mx-auto mb-8">
            {page.content && <BlocksRenderer content={page.content} />}
          </div>
          <Link 
            href="/catalog"
            className="inline-block px-10 py-3 border-2 border-white bg-transparent text-white uppercase tracking-widest text-sm font-semibold transition-colors hover:bg-white hover:text-black"
          >
            Перейти в каталог
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 bg-neutral-100 text-black text-center py-6 sm:py-8">
          <p className="text-lg sm:text-xl font-semibold uppercase tracking-widest">
            Есть только <span className="bg-black text-white px-2 py-1">Белый</span> и Чёрный. Остальное - оттенки.
          </p>
        </div>
      </section>
    </main>
  );
}