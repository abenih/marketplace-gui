import { AdType } from "@/types/ad"; // Use the alias for imports

// Get the base API URL from the environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// This is an Async Server Component: it runs entirely on the server
// and can safely fetch data without client-side hooks.
async function getAds(): Promise<AdType[]> {
  try {
    // Note: We are fetching from the NestJS /ads endpoint
    const res = await fetch(`${API_BASE_URL}/ads`, {
      // Best practice for Next.js to cache the data for 60 seconds (or 0 for SSR)
      next: { revalidate: 60 }, 
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      // This will be caught by the outer try/catch
      throw new Error(`Failed to fetch data: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Data Fetching Error:', error);
    // Return an empty array on failure to prevent the app from crashing
    return []; 
  }
}

export default async function Home() {
  const ads = await getAds();

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Marketplace Listings
      </h1>
      
      {ads.length === 0 ? (
        <p className="text-center text-gray-500">No active ads found. Start the NestJS backend and create some ads!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Map over the fetched ad data */}
          {ads.map((ad) => (
            <div 
              key={ad._id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden transition duration-300 hover:shadow-xl hover:scale-[1.02]"
            >
              {/* Image Placeholder - Use actual imageUrl later */}
              <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${ad.product.imageUrl || 'https://via.placeholder.com/400x200?text=Product+Image'})` }}></div>
              
              <div className="p-6">
                <div className="text-sm font-semibold text-indigo-600 mb-1 uppercase">
                  {ad.product.category || 'Uncategorized'}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2 truncate" title={ad.product.name}>
                  {ad.product.name}
                </h2>
                <p className="text-2xl font-extrabold text-gray-900 mb-4">
                  ${ad.product.price.toFixed(2)}
                </p>
                <p className="text-gray-600 line-clamp-2 mb-4">
                  {ad.product.description}
                </p>
                <div className="text-xs text-gray-500">
                  Seller: <span className="font-medium text-gray-700">{ad.owner?.username || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}