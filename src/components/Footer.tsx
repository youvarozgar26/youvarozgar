import Link from "next/link";
import Image from "next/image";
import { Phone, MessageCircle, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-24 md:pb-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-4">
          <div className="bg-white inline-block p-2 rounded-xl">
            <Image src="/logo.png" alt="Logo" width={140} height={40} className="h-8 w-auto object-contain" />
          </div>
          <p className="text-gray-400">मुंबई और महाराष्ट्र का अपना भरोसेमंद जॉब प्लेटफार्म।</p>
        </div>
        <div>
          <h3 className="font-bold text-xl mb-6 border-b border-gray-800 pb-2">ज़रूरी लिंक</h3>
          <div className="flex flex-col gap-3 text-gray-400">
            <Link href="/naukri">नौकरी खोजें</Link>
            <Link href="/worker">वर्कर खोजें</Link>
            <Link href="/about">हमारे बारे में</Link>
            <Link href="/contact">संपर्क करें</Link>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-xl mb-6 border-b border-gray-800 pb-2">संपर्क</h3>
          <div className="space-y-4 text-gray-400">
            <a href="tel:+919702664442" className="flex items-center gap-3">
              <Phone size={18} className="text-blue-500" /> +91 97026 64442
            </a>
            <a href="https://wa.me/919702664442" className="flex items-center gap-3">
              <MessageCircle size={18} className="text-green-500" /> WhatsApp करें
            </a>
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-orange-500" /> मुंबई, महाराष्ट्र
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
