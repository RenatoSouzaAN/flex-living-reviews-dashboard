'use client'

import { NormalizedReview } from "@/app/api/reviews/hostaway/route"
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, use } from "react"

// Helper to convert "2B N1 A..." to "2b-n1-a..."
const slugify = (text: string) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with dashes
        .replace(/(^-|-$)+/g, '');   // Remove leading/trailing dashes
};

// Helper to convert "2b-n1-a..." back to "2B N1 A..." (approximate for fallback)
const unslugify = (slug: string) => {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export default function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params); // Unwrap params
    const [reviews, setReviews] = useState<NormalizedReview[]>([]);
    const [listingName, setListingName] = useState<string>("");

    useEffect(() => {
        async function fetchReviews() {
            const hostawayRes = await fetch('/api/reviews/hostaway');
            const hostawayData = await hostawayRes.json();

            const googleRes = await fetch('/api/reviews/google?placeId=ChIJPVqlfGyuEmsRHPcnCX1X1OE');
            const googleData = await googleRes.json();

            const allReviews = [...hostawayData, ...(Array.isArray(googleData) ? googleData : [])];

            const saved = localStorage.getItem('hiddenReviews');
            const hiddenIds = saved ? JSON.parse(saved) : [];

            const filteredReviews = allReviews.filter((review: NormalizedReview) => {
                const reviewSlug = slugify(review.listingName);
                const urlSlug = id; 
                const isHidden = hiddenIds.includes(review.id);
                
                return reviewSlug === urlSlug && !isHidden;
            });
            
            setReviews(filteredReviews);
            
            if (filteredReviews.length > 0) {
                setListingName(filteredReviews[0].listingName);
            }
        }

        fetchReviews();
    }, [id]);

    return (
        <div className="min-h-screen font-sans text-[#5C5C5A]" style={{ backgroundColor: "#FFFDF7" }}>
            <nav className="border-b border-gray-200 bg-white py-4 px-6 flex justify-between items-center sticky top-0 z-10">
                <Link href="/" className="font-bold text-2xl tracking-tight" style={{ color: "#284E4C" }}>The Flex</Link>
                <div className="hidden md:flex gap-6 text-sm font-medium">
                    <a href="#" className="hover:text-[#284E4C]">Locations</a>
                    <a href="#" className="hover:text-[#284E4C]">Corporate</a>
                    <a href="#" className="hover:text-[#284E4C]">Landlords</a>
                    <a href="#" className="hover:text-[#284E4C]">Blog</a>
                </div>
                <button className="px-5 py-2 rounded-lg text-white font-medium text-sm transition-colors hover:opacity-90" style={{ backgroundColor: "#284E4C" }}>
                    Book Now
                </button>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-xl overflow-hidden h-[400px] mb-8">
                    <div className="md:col-span-2 bg-gray-200 h-full relative group">
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">Main Bedroom Image</div>
                    </div>
                    <div className="hidden md:grid grid-rows-2 gap-2 h-full">
                        <div className="bg-gray-200 h-full flex items-center justify-center text-gray-400 text-sm">Living Room</div>
                        <div className="bg-gray-200 h-full flex items-center justify-center text-gray-400 text-sm">Kitchen</div>
                    </div>
                    <div className="hidden md:grid grid-rows-2 gap-2 h-full">
                        <div className="bg-gray-200 h-full flex items-center justify-center text-gray-400 text-sm">Bathroom</div>
                        <div className="bg-gray-200 h-full flex items-center justify-center text-gray-400 text-sm">View</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-2" style={{ color: "#284E4C" }}>
                                {listingName || unslugify(id)}
                            </h1>
                            <p className="text-lg text-gray-500">London • 2 Guests • 1 Bedroom • 1 Bath</p>
                        </div>

                        <hr className="border-gray-200" />

                        <div className="prose max-w-none text-gray-600">
                            <h3 className="text-xl font-semibold mb-3" style={{ color: "#284E4C" }}>About this home</h3>
                            <p>
                                Experience the best of London living in this stylish and modern apartment.
                                Perfectly located for exploring the city, with easy access to transport links.
                                Features high-speed WiFi, a fully equipped kitchen, and premium linens.
                            </p>
                        </div>

                        <hr className="border-gray-200" />

                        <section>
                            <h2 className="text-2xl font-bold mb-6" style={{ color: "#284E4C" }}>
                                Guest Reviews
                            </h2>

                            {reviews.length === 0 ? (
                                <div className="p-8 bg-gray-50 rounded-xl text-center text-gray-500">
                                    No reviews available for this property.
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {reviews.map((review) => (
                                        <div
                                            key={review.id}
                                            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-[#284E4C] text-white flex items-center justify-center font-bold text-lg">
                                                        {review.guestName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">{review.guestName}</h3>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(review.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 bg-[#FFF9E9] px-2 py-1 rounded text-[#284E4C] font-bold text-sm">
                                                    <span>★</span>
                                                    <span>{review.rating}</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                                            {review.source === "Google Reviews" && (
                                                <div className="mt-4 flex items-center gap-1 text-xs text-gray-400">
                                                    <Image src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" width={16} height={16} />
                                                    Posted on Google
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    <div className="hidden lg:block">
                        <div className="sticky top-24 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                            <div className="flex justify-between items-baseline mb-6">
                                <span className="text-2xl font-bold" style={{ color: "#284E4C" }}>£150</span>
                                <span className="text-gray-500">/ night</span>
                            </div>
                            <div className="space-y-4">
                                <div className="border border-gray-300 rounded-lg p-3">
                                    <div className="text-xs text-gray-500 uppercase font-bold">Dates</div>
                                    <div className="text-sm">Add dates</div>
                                </div>
                                <div className="border border-gray-300 rounded-lg p-3">
                                    <div className="text-xs text-gray-500 uppercase font-bold">Guests</div>
                                    <div className="text-sm">1 guest</div>
                                </div>
                                <button className="w-full py-3 rounded-lg text-white font-bold text-lg transition-opacity hover:opacity-90" style={{ backgroundColor: "#284E4C" }}>
                                    Check Availability
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}