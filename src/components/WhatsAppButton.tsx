"use client";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const phoneNumber = "9702664442";
  return (
    <a
      href={`https://wa.me/91${phoneNumber}?text=नमस्ते%20Youvarozgar%20-%20मुझे%20मदद%20चाहिए`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float group"
      aria-label="WhatsApp पर बात करें"
    >
      <MessageCircle size={36} fill="white" className="transition-transform group-hover:scale-110" />
    </a>
  );
}
