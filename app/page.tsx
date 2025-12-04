import Link from 'next/link'

export default function Home() {
  const properties = [
    {
      name: "2B N1 A - 29 Shoreditch Heights",
      slug: "2b-n1-a-29-shoreditch-heights",
      location: "London",
      imageColor: "bg-blue-100"
    },
    {
      name: "1B N1 B - 30 Shoreditch Heights",
      slug: "1b-n1-b-30-shoreditch-heights",
      location: "London",
      imageColor: "bg-green-100"
    },
    {
      name: "Art Gallery of New South Wales",
      slug: "art-gallery-of-new-south-wales",
      location: "Sydney",
      imageColor: "bg-purple-100"
    }
  ];

  return (
    <div className="min-h-screen font-sans text-[#5C5C5A]" style={{ backgroundColor: "#FFFDF7" }}>
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white py-4 px-6 flex justify-between items-center sticky top-0 z-10">
        <div className="font-bold text-2xl tracking-tight" style={{ color: "#284E4C" }}>The Flex</div>
        <div className="flex gap-4">
            <Link href="/dashboard" className="px-4 py-2 rounded-lg font-medium text-sm transition-colors hover:bg-gray-100 text-[#284E4C]">
                Manager Dashboard
            </Link>
            <button className="px-5 py-2 rounded-lg text-white font-medium text-sm transition-colors hover:opacity-90" style={{ backgroundColor: "#284E4C" }}>
                Book Now
            </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: "#284E4C" }}>
                Flexible Living, Made Easy
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                Discover fully furnished, move-in-ready apartments for holidays, business travellers, and extended stays.
            </p>
        </div>

        <h2 className="text-2xl font-bold mb-8" style={{ color: "#284E4C" }}>Featured Properties</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {properties.map((property) => (
                <Link 
                    key={property.slug} 
                    href={`/property/${property.slug}`}
                    className="group block bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                    <div className={`h-48 ${property.imageColor} relative flex items-center justify-center text-gray-400 font-medium`}>
                        Property Image
                    </div>
                    <div className="p-6">
                        <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">{property.location}</div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-[#284E4C] transition-colors" style={{ color: "#284E4C" }}>
                            {property.name}
                        </h3>
                        <p className="text-gray-500 text-sm mb-4">
                            Starting from £150/night
                        </p>
                        <div className="flex items-center text-[#284E4C] font-medium text-sm">
                            View Details 
                            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
      </main>
    </div>
  )
}
