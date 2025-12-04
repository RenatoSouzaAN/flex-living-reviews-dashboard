'use client'

import { NormalizedReview } from "@/app/api/reviews/hostaway/route"
import { useState, useEffect } from "react"
import ReviewCard from "@/components/ReviewCard"
import Link from "next/link";

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

export default function Dashboard() {
    const [reviews, setReviews] = useState<NormalizedReview[]>([]);
    const [hiddenReviews, setHiddenReviews] = useState<Set<number>>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('hiddenReviews');
            return new Set(saved ? JSON.parse(saved) : []);
        }
        return new Set();
    });
    
    const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
    const [propertyFilter, setPropertyFilter] = useState<string>('all');
    const [channelFilter, setChannelFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [sortOption, setSortOption] = useState<SortOption>('newest');

    useEffect(() => {
        async function fetchData() {
            const hostawayRes = await fetch('/api/reviews/hostaway');
            const hostawayData = await hostawayRes.json();
            
            const googleRes = await fetch('/api/reviews/google?placeId=ChIJPVqlfGyuEmsRHPcnCX1X1OE');
            const googleData = await googleRes.json();
            
            const combined = [...hostawayData, ...(Array.isArray(googleData) ? googleData : [])];
            setReviews(combined);
        }
        fetchData();
    }, []);

    const toggleVisibility = (id: number) => {
        const newHidden = new Set(hiddenReviews);
        if (newHidden.has(id)) {
            newHidden.delete(id);
        } else {
            newHidden.add(id);
        }
        setHiddenReviews(newHidden);
        localStorage.setItem('hiddenReviews', JSON.stringify(Array.from(newHidden)));
    };

    const uniqueProperties = Array.from(new Set(reviews.map(r => r.listingName)));
    const uniqueChannels = Array.from(new Set(reviews.map(r => r.source)));
    const uniqueCategories = ['Cleanliness', 'Communication', 'Location', 'Value']; 

    const filteredReviews = reviews
        .filter(review => {
            if (ratingFilter !== 'all' && review.rating < ratingFilter) return false;
            if (propertyFilter !== 'all' && review.listingName !== propertyFilter) return false;
            if (channelFilter !== 'all' && review.source !== channelFilter) return false;

            if (categoryFilter !== 'all') {
                const categoryKey = categoryFilter.toLowerCase();
                const categoryRating = review.categories?.[categoryKey];
                
                if (!categoryRating) return false;
                if (categoryRating >= 7) return false;
            }

            return true;
        })
        .sort((a, b) => {
            switch (sortOption) {
                case 'newest': return new Date(b.date).getTime() - new Date(a.date).getTime();
                case 'oldest': return new Date(a.date).getTime() - new Date(b.date).getTime();
                case 'highest': return b.rating - a.rating;
                case 'lowest': return a.rating - b.rating;
                default: return 0;
            }
        });

    const statsReviews = filteredReviews; 
    const propertyStats = statsReviews.reduce((acc, review) => {
        if (!acc[review.listingName]) {
            acc[review.listingName] = { 
                count: 0, 
                totalRating: 0,
                sentiment: { positive: 0, neutral: 0, negative: 0 },
                sources: { google: 0, hostaway: 0 }
            };
        }
        
        const stats = acc[review.listingName];
        stats.count += 1;
        stats.totalRating += review.rating;

        if (review.rating >= 8) stats.sentiment.positive += 1;
        else if (review.rating >= 5) stats.sentiment.neutral += 1;
        else stats.sentiment.negative += 1;

        if (review.source === 'Google Reviews') stats.sources.google += 1;
        else stats.sources.hostaway += 1;

        return acc;
    }, {} as Record<string, { 
        count: number; 
        totalRating: number; 
        sentiment: { positive: number; neutral: number; negative: number };
        sources: { google: number; hostaway: number };
    }>);

    return (
        <div className="min-h-screen font-sans text-[#5C5C5A]" style={{ backgroundColor: "#FFFDF7" }}>
            <nav className="border-b border-gray-200 bg-white py-4 px-6 flex justify-between items-center sticky top-0 z-10">
                <Link href="/" className="font-bold text-2xl tracking-tight" style={{ color: "#284E4C" }}>The Flex</Link>
                <div className="text-sm font-medium text-gray-500 gap-4 h-9 flex items-center">Manager View</div>
            </nav>

            <main className="max-w-7xl mx-auto px-8 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {Object.entries(propertyStats).map(([name, stats]) => (
                        <div key={name} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2 truncate" title={name}>{name}</h3>
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-3xl font-bold" style={{ color: "#284E4C" }}>
                                        {(stats.totalRating / stats.count).toFixed(1)}
                                    </span>
                                    <span className="text-sm text-gray-500">/ 10 average</span>
                                </div>
                                
                                <div className="flex h-2 rounded-full overflow-hidden mb-2 bg-gray-100">
                                    <div style={{ width: `${(stats.sentiment.positive / stats.count) * 100}%` }} className="bg-green-500" title="Positive (8-10)" />
                                    <div style={{ width: `${(stats.sentiment.neutral / stats.count) * 100}%` }} className="bg-yellow-400" title="Neutral (5-7)" />
                                    <div style={{ width: `${(stats.sentiment.negative / stats.count) * 100}%` }} className="bg-red-400" title="Negative (0-4)" />
                                </div>
                                <div className="flex justify-between text-[10px] text-gray-400 mb-4">
                                    <span>{stats.sentiment.positive} Pos</span>
                                    <span>{stats.sentiment.neutral} Neu</span>
                                    <span>{stats.sentiment.negative} Neg</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-50 text-xs text-gray-500">
                                <span>{stats.count} Total Reviews</span>
                                <div className="flex gap-2">
                                    {stats.sources.google > 0 && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span>{stats.sources.google} Ggl</span>}
                                    {stats.sources.hostaway > 0 && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span>{stats.sources.hostaway} Hst</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                    {Object.keys(propertyStats).length === 0 && (
                        <div className="col-span-full text-center text-gray-400 py-8">
                            No reviews match the current filters.
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-4 mb-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex flex-wrap gap-4 justify-between items-center">
                        <div className="flex flex-wrap gap-3">
                            <select 
                                value={ratingFilter}
                                onChange={(e) => setRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                                className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#284E4C] bg-white"
                            >
                                <option value="all">All Ratings</option>
                                <option value="10">10/10 Only</option>
                                <option value="8">8+ / 10</option>
                                <option value="5">5+ / 10</option>
                            </select>

                            <select 
                                value={propertyFilter}
                                onChange={(e) => setPropertyFilter(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#284E4C] bg-white max-w-[200px]"
                            >
                                <option value="all">All Properties</option>
                                {uniqueProperties.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>

                            <select 
                                value={channelFilter}
                                onChange={(e) => setChannelFilter(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#284E4C] bg-white"
                            >
                                <option value="all">All Channels</option>
                                {uniqueChannels.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>

                            <select 
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#284E4C] bg-white"
                                title="Filter reviews with issues (rating < 7) in this category"
                            >
                                <option value="all">All Categories</option>
                                {uniqueCategories.map(c => (
                                    <option key={c} value={c}>{c} Issues</option>
                                ))}
                            </select>
                        </div>

                        <select 
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value as SortOption)}
                            className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#284E4C] bg-white font-medium"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="highest">Highest Rated</option>
                            <option value="lowest">Lowest Rated</option>
                        </select>
                    </div>
                </div>

                <div className="grid gap-6">
                    {filteredReviews.map((review) => (
                        <ReviewCard 
                            key={review.id} 
                            review={review} 
                            isHidden={hiddenReviews.has(review.id)}
                            onToggleVisibility={() => toggleVisibility(review.id)}
                        />
                    ))}
                    {filteredReviews.length === 0 && (
                        <div className="text-center text-gray-500 py-12">
                            No reviews found matching your filters.
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}