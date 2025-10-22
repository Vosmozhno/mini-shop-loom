"use client";

import { usePathname } from 'next/navigation';
import Header from "@/components/Header";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <>
      <Header />
      <main className={!isHomePage ? "max-w-8xl mx-auto px-4 pt-24" : ""}>
        {children}
      </main>
    </>
  );
}