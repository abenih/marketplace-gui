'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AdType } from '@/types/ad'; // Reuse the AdType

export default function MyAdsPage() {
  const { isAuthenticated, accessToken, logout } = useAuth();
  const router = useRouter();
  const [ads, setAds] = useState<AdType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // --- Data Fetching Logic (Runs on mount/token change) ---
  useEffect(() => {
    // 1. Authentication Check
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.push('/login'); 
      return;
    }

    const fetchMyAds = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // The API endpoint is '/ads/my-ads' 
        const res = await fetch(`${API_BASE_URL}/ads/my-ads`, {
          method: 'GET',
          headers: {
            // 2. Send the JWT in the Authorization header
            'Authorization': `Bearer ${accessToken}`, 
            'Content-Type': 'application/json',
          },
        });

        if (res.status === 401 || res.status === 403) {
            // Token expired or invalid
            logout(); 
            return;
        }

        if (!res.ok) {
          throw new Error('Failed to fetch user ads.');
        }

        const data: AdType[] = await res.json();
        setAds(data);

      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching ads.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyAds();
  }, [isAuthenticated, accessToken, API_BASE_URL, router, logout]);

  // --- Placeholder for Edit/Delete Actions ---
  const handleDelete = (adId: string) => {
    alert(`Delete function for Ad ID: ${adId} will be implemented.`);
  };

  const handleEdit = (adId: string) => {
    alert(`Edit function for Ad ID: ${adId} will be implemented.`);
  };

  // --- Render Logic ---
  if (!isAuthenticated) return null; 

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Listings Dashboard</h1>
        <button onClick={logout} className="py-2 px-4 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition">
          Logout
        </button>
      </div>

      {loading && <p className="text-center text-indigo-600">Loading your ads...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      
      {!loading && ads.length === 0 && !error && (
        <p className="text-center text-gray-500">You have no ads listed yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ads.map((ad) => (
          <div key={ad._id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <div className="p-5">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{ad.product.name}</h2>
              <p className="text-gray-600 text-sm mb-3">Status: <span className={`font-medium ${ad.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>{ad.status.toUpperCase()}</span></p>
              <p className="text-2xl font-bold text-indigo-600 mb-4">${ad.product.price.toFixed(2)}</p>
              <p className="text-gray-500 mb-4 line-clamp-2">{ad.product.description}</p>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => handleEdit(ad._id)}
                  className="flex-1 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(ad._id)}
                  className="flex-1 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}