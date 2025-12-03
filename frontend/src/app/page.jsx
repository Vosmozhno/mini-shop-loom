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
      <main className="p-6 text-center flex flex-col items-center justify-center min-h-screen text-white bg-neutral-900">
        <h1 className="text-2xl font-bold mb-4">Добро пожаловать!</h1>
        <p className="mb-6 text-neutral-400">Не удалось загрузить контент.</p>
        <Link href="/catalog" className="underline hover:text-white transition-colors">
            Перейти в каталог
        </Link>
      </main>
    );
  }

  const imageUrl = page.hero_image?.url 
    ? `${STRAPI_URL}${page.hero_image.url}` 
    : null;

  return (
    <main className="bg-neutral-900 text-white">
      <section 
        className="relative flex items-center justify-center text-center bg-black bg-cover bg-center overflow-hidden"
        style={{ 
          minHeight: '100dvh',
          ...(imageUrl && { backgroundImage: `url(${imageUrl})` }) 
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 px-4 w-full max-w-4xl mx-auto pb-20 md:pb-0">
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-semibold uppercase tracking-widest mb-4 md:mb-6 leading-tight">
            {page.title}
          </h1>
          
          <div className="prose prose-invert prose-sm md:prose-lg max-w-2xl mx-auto mb-8 md:mb-12 text-neutral-200">
            {page.content && <BlocksRenderer content={page.content} />}
          </div>

          <Link 
            href="/catalog"
            className="inline-block px-8 py-3 md:px-12 md:py-4 border border-white bg-transparent text-white uppercase tracking-[0.2em] text-xs md:text-sm font-bold transition-all hover:bg-white hover:text-black active:scale-95"
          >
            Перейти в каталог
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 bg-neutral-100 text-black text-center py-4 md:py-8 px-4">
          <p className="text-sm sm:text-base md:text-xl font-semibold uppercase tracking-widest leading-relaxed">
            Есть только <span className="bg-black text-white px-2 py-0.5 mx-1 shadow-sm">Белый</span> и Чёрный. <br className="block sm:hidden"/> Остальное - оттенки.
          </p>
        </div>
      </section>
    </main>
  );
}