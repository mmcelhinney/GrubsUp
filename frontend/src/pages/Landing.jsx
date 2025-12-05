import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Landing() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white py-20">
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">
                Turn Your Fridge Into
                <span className="block text-orange-300">Delicious Recipes</span>
              </h1>
              <p className="text-xl mb-8 text-gray-100 drop-shadow-md">
                Simply snap a photo of your fridge, and our AI will suggest amazing recipes
                based on what you have. No more wondering what to cook!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn bg-orange-500 text-white hover:bg-orange-600 shadow-lg">
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn bg-orange-500 text-white hover:bg-orange-600 shadow-lg">
                      Get Started Free
                    </Link>
                    <Link to="/login" className="btn bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-orange-600">
                      Login
                    </Link>
                  </>
                )}
                <Link to="/dashboard" className="btn bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-orange-600">
                  Try as Guest
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform">
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <div className="bg-white rounded p-2 text-center text-gray-600 text-sm font-medium">
                    📸 Fridge Scan
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="bg-orange-50 rounded p-3 flex items-center justify-between border border-orange-200">
                    <span className="text-gray-800 font-medium">🥛 Milk</span>
                    <span className="text-xs text-orange-600 font-semibold">88%</span>
                  </div>
                  <div className="bg-orange-50 rounded p-3 flex items-center justify-between border border-orange-200">
                    <span className="text-gray-800 font-medium">🥚 Eggs</span>
                    <span className="text-xs text-orange-600 font-semibold">92%</span>
                  </div>
                  <div className="bg-orange-50 rounded p-3 flex items-center justify-between border border-orange-200">
                    <span className="text-gray-800 font-medium">🧈 Butter</span>
                    <span className="text-xs text-orange-600 font-semibold">75%</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <p className="text-sm text-gray-700 font-semibold mb-2">Suggested Recipes:</p>
                  <div className="space-y-2">
                    <div className="bg-white border border-orange-200 rounded p-2 text-sm text-gray-700">
                      🍳 Scrambled Eggs
                    </div>
                    <div className="bg-white border border-orange-200 rounded p-2 text-sm text-gray-700">
                      🥞 Pancakes
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">📸</div>
              <h3 className="text-xl font-semibold mb-2">1. Snap a Photo</h3>
              <p className="text-gray-600">
                Take a picture of your fridge or upload an existing image
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">2. AI Detection</h3>
              <p className="text-gray-600">
                Our AI identifies all the ingredients in your fridge
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold mb-2">3. Get Recipes</h3>
              <p className="text-gray-600">
                Receive personalized recipe suggestions based on what you have
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white/90 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Cooking?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users discovering new recipes every day
          </p>
          {!isAuthenticated && (
            <Link to="/register" className="btn btn-primary text-lg px-8">
              Start Free Today
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

