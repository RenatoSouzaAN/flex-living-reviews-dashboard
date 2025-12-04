import { NextResponse } from "next/server";

interface GoogleReview {
    authorAttribution?: {
        displayName?: string;
    };
    publishTime?: string;
    rating?: number;
    text?: {
        text?: string;
    };
    originalText?: {
        text?: string;
    };
}

export async function GET(request:Request) {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('placeId');
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const url = `https://places.googleapis.com/v1/places/${placeId}`;

    if (!placeId) {
        return NextResponse.json(
            { error: 'placeId is required' },
            { status: 400 }
        );
    }

    try {
        const response = await fetch(url, {
            headers: {
                'X-Goog-Api-Key': apiKey || '',
                'X-Goog-FieldMask': 'reviews'
            }
        });
        const data = await response.json();

        const normalizedReviews = (data.reviews || []).map((review: GoogleReview, index: number) => ({
            id: 9000 + index,
            listingName: "Art Gallery of New South Wales",
            guestName: review.authorAttribution?.displayName || "Anonymous",
            date: review.publishTime || new Date().toISOString(),
            rating: (review.rating || 0) * 2,
            comment: review.text?.text || review.originalText?.text || "",
            source: "Google Reviews",
            type: "guest-review",
            categories: {}
        }));

        return NextResponse.json(normalizedReviews);
    } catch (error) {
        console.error('Google API error:', error);
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
}