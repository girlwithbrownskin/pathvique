function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center">
      <h1 className="text-lg font-bold text-purple-700 tracking-wide">पथVique</h1>
      <div className="flex gap-8 text-sm font-medium text-gray-500">
        <a href="/" className="hover:text-purple-700 transition">Home</a>
        <a href="/chat" className="hover:text-purple-700 transition">Chat</a>
        <a href="/map" className="hover:text-purple-700 transition">Map</a>
        <a href="/alerts" className="hover:text-purple-700 transition">Alerts</a>
        <a href="/report" className="hover:text-purple-700 transition">Report</a>
      </div>
      <a href="/chat" className="bg-purple-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-purple-800 transition">
        Ask Pathbot
      </a>
    </nav>
  )
}

export default Navbar