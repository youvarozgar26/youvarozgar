export default function AdminPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-black mb-8 border-b-4 border-blue-600 inline-block">एडमिन डैशबोर्ड</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card bg-blue-50">
          <h2 className="text-xl font-bold mb-4">नौकरी चाहने वाले</h2>
          <p className="text-gray-500 italic">डेटाबेस कनेक्ट करने के बाद यहाँ असली लिस्ट दिखेगी।</p>
        </div>
        <div className="card bg-orange-50">
          <h2 className="text-xl font-bold mb-4">एम्प्लॉयर की ज़रूरत</h2>
          <p className="text-gray-500 italic">डेटाबेस कनेक्ट करने के बाद यहाँ असली लिस्ट दिखेगी।</p>
        </div>
      </div>
    </div>
  );
}
