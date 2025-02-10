import { useState,useEffect} from 'react';
import { Leaf, ArrowRight, Star, Truck, ShieldCheck, Citrus as Fruit } from 'lucide-react';
import { getAuth, signInWithPopup, GoogleAuthProvider,setPersistence, browserLocalPersistence } from 'firebase/auth';

interface GoogleAuth{
  onComplete: (Id: string)=>void;
}

export default function Home({onComplete}: GoogleAuth) {
  const [error,setError]=useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('currentUserId');
    if (storedUserId) {
      onComplete(storedUserId);
    }
  }, [onComplete]);

  const handleGoogleSignIn = async () => {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        if (user.email) {
          const userId = `user_${user.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
          localStorage.setItem('currentUserId', userId);
          onComplete(userId);
        }
      } catch (error) {
        console.error('Google Sign-In error:', error);
        setError('Failed to sign in with Google');
      }
    };

    const auth = getAuth();
    setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Have a nice Day");
  })
  .catch((error) => {
    console.error("Error enabling persistence", error);
  });
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="relative bg-gray-900 text-white">
        <div 
          className="absolute inset-0 z-0 bg-center bg-cover bg-blend-overlay bg-black/50"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
          }}
        />
        
        <div className="relative z-10">
          <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-green-400" />
              <span className="ml-2 text-2xl font-bold">SabKi Mandi</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a onClick={handleGoogleSignIn} href="#" className="hover:text-green-400">Home</a>
              <a onClick={handleGoogleSignIn} href="#" className="hover:text-green-400">Vegetables</a>
              <a onClick={handleGoogleSignIn} href="#" className="hover:text-green-400">Groceries</a>
            </div>
          </nav>

          <div className="container mx-auto px-6 py-24 md:py-32">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                WelCome to<br />Sabki Mandi
              </h1>
              <p className="text-xl mb-8 text-gray-300">
                Get farm-fresh vegetables, fruits, and groceries delivered to your doorstep. 100% organic and locally sourced.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center hover:bg-green-600 transition-colors"
                onClick={handleGoogleSignIn}
              >
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button 
                  onClick={handleGoogleSignIn}
                  className="flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                  Sign in with Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Fruit className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Organic</h3>
              <p className="text-gray-600">Fresh, certified organic produce sourced directly from local farmers.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Same Day Delivery</h3>
              <p className="text-gray-600">Free delivery within 24 hours to ensure maximum freshness.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">100% satisfaction guarantee or your money back.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-green-400">Vegetables</a></li>
                <li><a href="#" className="hover:text-green-400">Fresh Fruits</a></li>
                <li><a href="#" className="hover:text-green-400">Organic Groceries</a></li>
              </ul>
            </div>
            <div>
            <div className="grid items-center mb-4">
              <h3 className="ml-2 text-xl font-bold">Sab Ki Mandi</h3>
            </div>
              <p className="text-gray-400">Your trusted source for fresh, organic produce and groceries.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-green-400">Mob: 123456789</a></li>
                <li><a href="#" className="hover:text-green-400">Email: sabkimandi@gmail.com</a></li>
                <li><a href="#" className="hover:text-green-400">Insta: @sabkimandi</a></li>
                <li><a href="#" className="hover:text-green-400"></a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Sabki Mandi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
