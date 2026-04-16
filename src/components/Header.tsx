"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="bg-white sticky top-0 z-40 border-b border-gray-100 py-3 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={160} height={40} className="h-10 w-auto object-contain" priority />
        </Link>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600 md:hidden">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        <nav className="hidden md:flex gap-6 font-bold text-gray-700">
          <Link href="/naukri" className="hover:text-blue-600">नौकरी खोजें</Link>
          <Link href="/worker" className="hover:text-blue-600">वर्कर खोजें</Link>
          <Link href="/about" className="hover:text-blue-600">हमारे बारे में</Link>
          <Link href="/contact" className="hover:text-blue-600">संपर्क करें</Link>
        </nav>
      </div>
      {isOpen && (
        <nav className="bg-white border-t p-4 flex flex-col gap-4 font-bold md:hidden shadow-xl">
          <Link href="/" onClick={()=>setIsOpen(false)}>होम</Link>
          <Link href="/naukri" onClick={()=>setIsOpen(false)}>नौकरी खोजें</Link>
          <Link href="/worker" onClick={()=>setIsOpen(false)}>वर्कर खोजें</Link>
          <Link href="/about" onClick={()=>setIsOpen(false)}>हमारे बारे में</Link>
          <Link href="/contact" onClick={()=>setIsOpen(false)}>संपर्क करें</Link>
        </nav>
      )}
    </header>
  );
}
