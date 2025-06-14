
import { Star, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Review } from '@/types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface ReviewsListProps {
  reviews: Review[];
  isLoading?: boolean;
}

export const ReviewsList = ({ reviews, isLoading }: ReviewsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500">Nessuna recensione ancora</p>
        <p className="text-sm text-gray-400">Sii il primo a lasciare una recensione!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="border-green-100">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-green-600" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{review.clientName}</h4>
                  <span className="text-xs text-gray-500">
                    {format(new Date(review.date), 'PPP', { locale: it })}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {review.rating}/5
                  </span>
                </div>
                
                {review.comment && (
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
