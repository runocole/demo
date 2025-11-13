// src/components/RatingSection.tsx
import { Star } from "lucide-react";

interface RatingSectionProps {
  rating: number;
  reviews: number;
}

const RatingSection = ({ rating, reviews }: RatingSectionProps) => {
  const renderStars = (count: number, filled: number) => {
    return Array.from({ length: count }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < filled ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const ratingDistribution = [
    { stars: 5, percentage: 75, count: Math.round(reviews * 0.75) },
    { stars: 4, percentage: 15, count: Math.round(reviews * 0.15) },
    { stars: 3, percentage: 7, count: Math.round(reviews * 0.07) },
    { stars: 2, percentage: 2, count: Math.round(reviews * 0.02) },
    { stars: 1, percentage: 1, count: Math.round(reviews * 0.01) },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <div className="flex items-center gap-4 mb-6">
        <div className="text-4xl font-bold">{rating}</div>
        <div>
          <div className="flex gap-1 mb-1">
            {renderStars(5, Math.floor(rating))}
          </div>
          <div className="text-sm text-muted-foreground">
            Based on {reviews} reviews
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {ratingDistribution.map((dist) => (
          <div key={dist.stars} className="flex items-center gap-2">
            <div className="flex items-center gap-1 w-16">
              <span className="text-sm w-4">{dist.stars}</span>
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full"
                style={{ width: `${dist.percentage}%` }}
              ></div>
            </div>
            <span className="text-sm text-muted-foreground w-12 text-right">
              {dist.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingSection;