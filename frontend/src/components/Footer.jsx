export default function Footer() {
  return (
    <footer className="bg-gray-800/95 backdrop-blur-sm text-white mt-auto border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">🍽️ DinnersReady</h3>
            <p className="text-gray-400">
              AI-powered recipe suggestions based on what's in your fridge.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/dashboard" className="hover:text-white">Dashboard</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">About</h4>
            <p className="text-gray-400">
              Built with React, Express, and MySQL. Powered by AI.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 DinnersReady. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

