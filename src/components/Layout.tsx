import React,{useState,useEffect} from 'react';
import { ShoppingCart, UserCircle} from 'lucide-react';
import { Profile } from './Profile';

interface LayoutProps {
  children: React.ReactNode;
  cartItemsCount?: number;
  onCartClick?: () => void;
  onProfileClick?: () => void;
}

export function Layout({ children, cartItemsCount = 0, onCartClick}: LayoutProps) {
  const [showProfile, setShowProfile] = useState(false);
//sticky

useEffect(() => {
  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = ''; // Required for Chrome
  };

  const handlePopState = () => {
    const userConfirmed = window.confirm("Do you want to close?");
    if (!userConfirmed) {
      window.history.pushState(null, '', window.location.pathname); // Push state back to prevent going back
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  window.addEventListener('popstate', handlePopState);

  window.history.pushState(null, '', window.location.pathname); // Add initial state to history

  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    window.removeEventListener('popstate', handlePopState);
  };
}, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 bg-white shadow-md z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button className="text-2xl font-bold text-emerald-600" onClick={()=>setShowProfile(false)}>SAB KI MANDI</button>
          <div className='flex items-center gap-6'>
              <button 
                onClick={onCartClick}
                className="relative p-2 text-gray-600 hover:text-emerald-600 transition-colors"
              >
                <ShoppingCart size={24} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
              <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="relative p-2 text-gray-600 hover:text-emerald-600 transition-colors"
                >
                  <UserCircle size={24} />
              </button>
         </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {showProfile ? <Profile onClose={()=>setShowProfile(false)} key={showProfile ? "profile" : "content"} /> : children}

      </main>
    </div>
  );
}