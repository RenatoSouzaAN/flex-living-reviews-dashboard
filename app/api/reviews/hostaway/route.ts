import path from "path";
import  {promises as fs} from "fs";
import { NextResponse } from "next/server";

interface HostawayReview {
    id: number;
    type: string;
    status: string;
    rating: number | null;
    publicReview: string;
    reviewCategory: { category: string; rating: number } [];
    submittedAt: string;
    guestName: string;
    listingName: string;
}

export interface NormalizedReview {
    id: number;
    listingName: string;
    guestName: string;
    date: string;
    rating: number;
    comment: string;
    source: string;
    type: string;
    categories: {[key: string]: number};
}

export async function GET() {
    try {
        const jsonDirectory = path.join(process.cwd(), 'data');
        const fileContents = await fs.readFile(jsonDirectory + '/reviews.json', 'utf8');
        const data = JSON.parse(fileContents);

        const reviews: HostawayReview[] = data.result;

        const normalizedReviews: NormalizedReview[] = reviews.map((review) => {
            let rating = review.rating;
            if (rating === null && review.reviewCategory.length > 0) {
                const sum = review.reviewCategory.reduce((acc, curr) => acc + curr.rating, 0);
                rating = parseFloat((sum / review.reviewCategory.length).toFixed(1));
            }

            const categories = review.reviewCategory.reduce((acc, curr) => {
                acc[curr.category] = curr.rating;
                return acc;
            }, {} as { [key: string]: number});

            return {
                id: review.id,
                listingName: review.listingName,
                guestName: review.guestName,
                date: review.submittedAt,
                rating: rating || 0,
                comment: review.publicReview,
                source: 'Hostaway',
                type: review.type,
                categories: categories
            };
        });

        return NextResponse.json(normalizedReviews);
    } catch (error) {
        console.error('Error reading reviews:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews'}, {status: 500});
    }
}