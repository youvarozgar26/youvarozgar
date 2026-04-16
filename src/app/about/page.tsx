import { Target, Eye, ShieldCheck, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white">
      <section className="bg-blue-900 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-black mb-4">हमारे बारे में</h1>
        <p className="text-xl opacity-80 max-w-2xl mx-auto leading-relaxed">युवा रोजगार एक सरल और भरोसेमंद प्लेटफॉर्म है जहाँ नौकरी चाहने वाले और एम्प्लॉयर बिना किसी दलाल के सीधे जुड़ सकते हैं।</p>
      </section>
      <section className="py-16 px-6 max-w-4xl mx-auto space-y-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-blue-900">हमारी शुरुआत</h2>
          <p className="text-lg text-gray-600 leading-relaxed italic border-l-4 border-orange-500 pl-4">"मुंबई में नौकरी ढूंढने के दौरान होने वाली परेशानियों और फर्जी नौकरियों में पैसे गंवाने वाले लोगों को देखकर हमें प्रेरणा मिली।"</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card border-t-4 border-blue-600"><Target className="text-blue-600 mb-4" size={40}/><h3 className="font-bold text-xl mb-2">हमारा मिशन</h3><p className="text-gray-600">हर व्यक्ति को वास्तविक और सत्यापित नौकरी के अवसर प्रदान करना।</p></div>
          <div className="card border-t-4 border-orange-500"><Eye className="text-orange-500 mb-4" size={40}/><h3 className="font-bold text-xl mb-2">हमारा विजन</h3><p className="text-gray-600">"हर घर में रोज़गार हो, कोई बेरोज़गार न रहे।"</p></div>
        </div>
      </section>
    </div>
  );
}
