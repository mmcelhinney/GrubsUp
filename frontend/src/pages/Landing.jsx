import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Landing() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">
                Turn Your Fridge Into
                <span className="block text-primary-100">Delicious Recipes</span>
              </h1>
              <p className="text-xl mb-8 text-primary-100">
                Simply snap a photo of your fridge, and our AI will suggest amazing recipes
                based on what you have. No more wondering what to cook!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn bg-white text-primary-600 hover:bg-gray-100">
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100">
                      Get Started Free
                    </Link>
                    <Link to="/login" className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600">
                      Login
                    </Link>
                  </>
                )}
                <Link to="/dashboard" className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600">
                  Try as Guest
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform">
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <div className="bg-white rounded p-2 text-center text-gray-500 text-sm">
                    📸 Fridge Scan
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="bg-primary-50 rounded p-3 flex items-center justify-between">
                    <span className="text-gray-700">🥛 Milk</span>
                    <span className="text-xs text-gray-500">88%</span>
                  </div>
                  <div className="bg-primary-50 rounded p-3 flex items-center justify-between">
                    <span className="text-gray-700">🥚 Eggs</span>
                    <span className="text-xs text-gray-500">92%</span>
                  </div>
                  <div className="bg-primary-50 rounded p-3 flex items-center justify-between">
                    <span className="text-gray-700">🧈 Butter</span>
                    <span className="text-xs text-gray-500">75%</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-2">Suggested Recipes:</p>
                  <div className="space-y-2">
                    <div className="bg-white border border-gray-200 rounded p-2 text-sm">
                      🍳 Scrambled Eggs
                    </div>
                    <div className="bg-white border border-gray-200 rounded p-2 text-sm">
                      🥞 Pancakes
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
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
      <section className="py-20 bg-gray-50">
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

