import Link from "next/link";
import Image from "next/image";
import { Search, Users, ShieldCheck, Phone, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="pb-10">
      <section className="relative h-[400px] flex items-center justify-center text-center text-white px-4">
        <div className="absolute inset-0 z-0">
          <Image src="https://images.unsplash.com/photo-1581578731548-c64695cc6958?q=80&w=2070&auto=format&fit=crop" alt="Hero" fill className="object-cover brightness-50" priority />
        </div>
        <div className="relative z-10 space-y-4">
          <h1 className="text-4xl md:text-6xl font-black leading-tight">नौकरी ढूंढना<br /><span className="text-orange-500">अब हुआ आसान!</span></h1>
          <p className="text-xl opacity-90">मुंबई और महाराष्ट्र में अपने आस-पास काम पाएं</p>
        </div>
      </section>

      <div className="bg-green-600 text-white py-4 text-center font-bold flex items-center justify-center gap-2">
        <ShieldCheck size={20} /> सत्यापित वर्कर और एम्प्लॉयर | सीधी बात
      </div>

      <section className="py-12 px-6 max-w-lg mx-auto space-y-6">
        <Link href="/naukri" className="btn-primary h-20"><Search size={28} /> मुझे नौकरी चाहिए</Link>
        <Link href="/worker" className="btn-accent h-20"><Users size={28} /> मुझे वर्कर चाहिए</Link>
      </section>

      <section className="bg-gray-50 py-12 px-4">
        <h2 className="text-2xl font-black text-center mb-8">काम के प्रकार</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {["लेबर", "ड्राइवर", "हेल्पर", "शॉप स्टाफ", "डिलीवरी बॉय", "वेटर", "मिस्त्री"].map((job) => (
            <div key={job} className="bg-white p-6 rounded-2xl text-center border border-gray-100 font-bold shadow-sm">{job}</div>
          ))}
        </div>
      </section>

      <section className="py-12 px-6 text-center">
        <h2 className="text-2xl font-black mb-8">लोग क्या कहते हैं?</h2>
        <div className="space-y-4 max-w-md mx-auto">
          <div className="bg-blue-50 p-6 rounded-2xl italic border-l-4 border-blue-600">"मुझे युवा रोजगार से बहुत जल्दी डिलीवरी का काम मिला। धन्यवाद!"<br/><span className="font-bold not-italic text-sm text-blue-800">— राहुल, मुंबई</span></div>
          <div className="bg-orange-50 p-6 rounded-2xl italic border-l-4 border-orange-500">"मेरी दुकान के लिए हेल्पर मिल गया, वो भी 2 दिन में।"<br/><span className="font-bold not-italic text-sm text-orange-800">— गुप्ता जी, ठाणे</span></div>
        </div>
      </section>

      <section className="py-12 px-6 text-center border-t border-gray-100">
        <p className="text-gray-500 font-bold mb-2 uppercase text-xs">कॉल करें</p>
        <a href="tel:+919702664442" className="text-3xl font-black text-blue-600">97026 64442</a>
      </section>
    </div>
  );
}
