import { NormalizedReview } from "@/app/api/reviews/hostaway/route";

interface ReviewCardProps {
    review: NormalizedReview;
    isHidden: boolean;
    onToggleVisibility: () => void;
}

export default function ReviewCard({ review, isHidden, onToggleVisibility }: ReviewCardProps) {
    return (
        <div className={`p-6 rounded-xl border transition-all duration-200 ${
            isHidden 
                ? "bg-gray-50 border-gray-200 opacity-60" 
                : "bg-white border-gray-100 shadow-sm hover:shadow-md"
        }`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                        isHidden ? "bg-gray-300 text-gray-500" : "bg-[#284E4C] text-white"
                    }`}>
                        {review.guestName.charAt(0)}
                    </div>
                    <div>
                        <h3 className={`font-semibold ${isHidden ? "text-gray-500" : "text-gray-900"}`}>
                            {review.guestName}
                        </h3>
                        <p className="text-xs text-gray-500">
                            {new Date(review.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded font-bold text-sm ${
                        isHidden ? "bg-gray-200 text-gray-500" : "bg-[#FFF9E9] text-[#284E4C]"
                    }`}>
                        <span>★</span>
                        <span>{review.rating}</span>
                    </div>
                </div>
            </div>

            <p className={`mb-4 leading-relaxed ${isHidden ? "text-gray-400" : "text-gray-600"}`}>
                {review.comment}
            </p>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                    {review.source} • {review.listingName}
                </div>
                
                <button 
                    onClick={onToggleVisibility}
                    className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                        isHidden 
                            ? "bg-gray-200 text-gray-600 hover:bg-gray-300" 
                            : "bg-red-50 text-red-600 hover:bg-red-100"
                    }`}
                >
                    {isHidden ? "Show Review" : "Hide Review"}
                </button>
            </div>
        </div>
    );
}