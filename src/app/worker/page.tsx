"use client";
import { useState } from "react";
import { Building2, Phone, ClipboardList, Loader2 } from "lucide-react";

export default function WorkerPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ company: "", req: "", phone: "" });

  const onSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    const msg = `*Employer Requirement*\nCompany: ${form.company}\nNeeds: ${form.req}\nContact: ${form.phone}`;
    window.location.href = `https://wa.me/919702664442?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-black text-center mb-8">वर्कर की ज़रूरत बताएं</h1>
      <form onSubmit={onSubmit} className="card space-y-6">
        <div><label className="font-bold flex items-center gap-2 mb-2"><Building2 size={18}/> कंपनी/दुकान का नाम</label><input required className="input-field" placeholder="नाम लिखें" onChange={e=>setForm({...form, company:e.target.value})} /></div>
        <div><label className="font-bold flex items-center gap-2 mb-2"><ClipboardList size={18}/> क्या वर्कर चाहिए?</label><textarea required className="input-field h-32" placeholder="जैसे: 2 ड्राइवर चाहिए" onChange={e=>setForm({...form, req:e.target.value})}></textarea></div>
        <div><label className="font-bold flex items-center gap-2 mb-2"><Phone size={18}/> मोबाइल नंबर</label><input required type="tel" pattern="[0-9]{10}" className="input-field" placeholder="मोबाइल नंबर" onChange={e=>setForm({...form, phone:e.target.value})} /></div>
        <button type="submit" disabled={loading} className="btn-accent w-full">{loading ? <Loader2 className="animate-spin" /> : "सबमिट करें"}</button>
      </form>
    </div>
  );
}
