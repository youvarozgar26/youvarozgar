"use client";
import { useState } from "react";
import { User, Phone, Briefcase, MapPin, Loader2 } from "lucide-react";

export default function NaukriPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", job: "", city: "" });

  const onSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    const msg = `*New Job Seeker*\nName: ${form.name}\nPhone: ${form.phone}\nJob: ${form.job}\nCity: ${form.city}`;
    window.location.href = `https://wa.me/919702664442?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-black text-center mb-8">नौकरी के लिए रजिस्टर करें</h1>
      <form onSubmit={onSubmit} className="card space-y-6">
        <div><label className="font-bold flex items-center gap-2 mb-2"><User size={18}/> नाम</label><input required className="input-field" placeholder="नाम लिखें" onChange={e=>setForm({...form, name:e.target.value})} /></div>
        <div><label className="font-bold flex items-center gap-2 mb-2"><Phone size={18}/> मोबाइल नंबर</label><input required type="tel" pattern="[0-9]{10}" className="input-field" placeholder="10 अंकों का नंबर" onChange={e=>setForm({...form, phone:e.target.value})} /></div>
        <div><label className="font-bold flex items-center gap-2 mb-2"><Briefcase size={18}/> काम का प्रकार</label>
          <select required className="input-field bg-white" onChange={e=>setForm({...form, job:e.target.value})}>
            <option value="">चुनें</option>
            {["लेबर", "ड्राइवर", "हेल्पर", "शॉप स्टाफ", "डिलीवरी बॉय", "वेटर", "मिस्त्री"].map(j=><option key={j} value={j}>{j}</option>)}
          </select>
        </div>
        <div><label className="font-bold flex items-center gap-2 mb-2"><MapPin size={18}/> शहर</label>
          <select required className="input-field bg-white" onChange={e=>setForm({...form, city:e.target.value})}>
            <option value="">चुनें</option>
            {["मुंबई", "ठाणे", "पुणे", "नवी मुंबई", "नागपुर", "नाशिक", "अन्य"].map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? <Loader2 className="animate-spin" /> : "रजिस्टर करें"}</button>
      </form>
    </div>
  );
}
