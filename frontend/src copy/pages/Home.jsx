function Home() {
  return (
    <div className="min-h-screen bg-[#f8f7ff]">

      {/* Hero */}
      <div className="bg-white border-b border-gray-100 px-6 py-20 text-center">
        <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
          Smart City · Real Time
        </span>
        <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Know your city <br />
          <span className="text-purple-700">before you leave home.</span>
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
          Construction, floods, blocked roads — all connected in one platform. For citizens. For the city.
        </p>
        <div className="flex justify-center gap-4">
          <a href="/chat" className="bg-purple-700 text-white px-7 py-3 rounded-lg font-medium hover:bg-purple-800 transition">
            Ask Pathbot
          </a>
          <a href="/map" className="bg-white border border-gray-200 text-gray-700 px-7 py-3 rounded-lg font-medium hover:bg-gray-50 transition">
            View Live Map
          </a>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-purple-700 text-white px-6 py-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">500M+</p>
            <p className="text-purple-200 text-sm mt-1">Urban commuters in India</p>
          </div>
          <div>
            <p className="text-2xl font-bold">7 Days</p>
            <p className="text-purple-200 text-sm mt-1">Avg civic complaint resolution</p>
          </div>
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-purple-200 text-sm mt-1">Real-time citizen platforms</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-xs font-semibold text-purple-600 uppercase tracking-widest text-center mb-2">What पथVique does</p>
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          One platform. Every layer of your city.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-xl">🤖</div>
            <h3 className="font-semibold text-gray-800 mb-2">Smart Chatbot</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Ask anything about your city's roads, floods or construction. Real answers, instantly.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-xl">🗺️</div>
            <h3 className="font-semibold text-gray-800 mb-2">Live Route Map</h3>
            <p className="text-gray-400 text-sm leading-relaxed">See disruptions before you hit them. Alternate routes updated in real time.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-xl">🔔</div>
            <h3 className="font-semibold text-gray-800 mb-2">Proactive Alerts</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Get notified before construction hits your route. No GPS needed.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-xl">📸</div>
            <h3 className="font-semibold text-gray-800 mb-2">Citizen Reporting</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Upload a photo. AI tags it, logs it, sends it straight to the right department.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-xl">⚠️</div>
            <h3 className="font-semibold text-gray-800 mb-2">Disaster Score</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Live risk scores for every zone — floods, accidents, construction density.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-xl">🏛️</div>
            <h3 className="font-semibold text-gray-800 mb-2">Gov Dashboard</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Authorities see everything mapped and categorised. A direct line to citizens.</p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 py-6 text-center text-gray-400 text-sm">
        पथVique · Urban Infrastructure, People Centred
      </div>

    </div>
  )
}

export default Home