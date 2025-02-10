import React, { useState, useEffect, useId} from 'react';
import { MapPin } from 'lucide-react';
import Home from './Landing';
import {getDoc,addDoc, serverTimestamp,doc, setDoc} from 'firebase/firestore'
import {db} from '../firebase'

interface RegistrationProps {
  onComplete: (user: { name: string; phone: string; location: { latitude: number; longitude: number; }}) => void;
}

//Main Function
export function Registration({ onComplete }: RegistrationProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number; } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  //const [submitting, setSubmitting] = useState(false);
  const [id,setId]=useState('');
  const [checkingUser, setCheckingUser] = useState(true);
  
  //Automatic Location Detection
  useEffect(() => {
    if ('geolocation' in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLoading(false);
        },
        (error) => {
          setError('Unable to get location. Please enable location services.');
          setLoading(false);
          console.log(error);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, []);

  //console.log(id);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return;

      try {
        const userRef = doc(db, 'users', id);
        const userSnap = await getDoc(userRef);
        //console.log(id);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          console.log(userData.name)
          onComplete({
            name: userData.name,
            phone: userData.phone,
            location: userData.location,
          });
          return;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setCheckingUser(false);
      }
    };

    fetchUserData();
  }, [id, onComplete]);

  /*useEffect(() => {
    const fetchUserData = async () => {
      if (id) {
        try{
        const userRef = doc(db, 'users', id);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          console.log(userData.name)
          console.log(id);
          onComplete({
            name: userData.name,
            phone: userData.phone,
            location: userData.location,
          });
        }
      }catch(error){
        console.error("Error fetching user data:", error);
      }
    }
    };
    fetchUserData();
  }, [id]);*/


  if(id==''){
    return < Home onComplete={setId}/>;

  }

  if (checkingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  //Sanitized Phone Number
  const sanitizePhone = (phone: string) => {
    return phone.replace(/[^\d]/g, '');
  };
  
  //Correct Code:-
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!location || !name || !phone) return;
    try {
      const sanitizedPhone = sanitizePhone(phone);

      // Create/update user document
      await setDoc(doc(db, 'users', id), {
        name,
        phone: sanitizedPhone,
        location,
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp()
      });

    localStorage.setItem('currentUserId', id);
    onComplete({ name, phone, location });
    } catch (error) {
      console.error('Registration error:', error);
      setError('Failed to complete registration');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to SabKiMandi
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please complete your registration to continue
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
              />
            </div>
            <div>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="Phone Number"
              />
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <MapPin className="text-emerald-500" size={20} />
            {loading ? (
              <span>Detecting location...</span>
            ) : location ? (
              <span>Location detected</span>
            ) : (
              <span className="text-red-500">{error}</span>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={!location || !name || !phone}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-gray-400"
            >
              Continue Shopping
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}