"use client";
import Link from "next/link";
import { Home, Briefcase, Building2, Info, Phone } from "lucide-react";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center py-3 px-2 z-50 md:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <Link href="/" className="flex flex-col items-center gap-1 text-blue-600"><Home size={24} /><span className="text-[10px] font-bold">होम</span></Link>
      <Link href="/naukri" className="flex flex-col items-center gap-1 text-gray-400"><Briefcase size={24} /><span className="text-[10px] font-bold">नौकरी</span></Link>
      <Link href="/worker" className="flex flex-col items-center gap-1 text-gray-400"><Building2 size={24} /><span className="text-[10px] font-bold">वर्कर</span></Link>
      <Link href="/about" className="flex flex-col items-center gap-1 text-gray-400"><Info size={24} /><span className="text-[10px] font-bold">हमारे बारे</span></Link>
      <Link href="/contact" className="flex flex-col items-center gap-1 text-gray-400"><Phone size={24} /><span className="text-[10px] font-bold">संपर्क</span></Link>
    </nav>
  );
}
