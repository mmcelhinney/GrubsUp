export default function Footer() {
  return (
    <footer className="bg-gray-800/95 backdrop-blur-sm text-white mt-auto border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">🍽️ DinnersReady</h3>
            <p className="text-gray-400">
            “No more ‘What’s for dinner?’—just snap and cook.”.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/dashboard" className="hover:text-white">Dashboard</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
              <li><a href="/about" className="hover:text-white">About Us</a></li>
             
              
            </ul>
          </div>

        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 DinnersReady AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

