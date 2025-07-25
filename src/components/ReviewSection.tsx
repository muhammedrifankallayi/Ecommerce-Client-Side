
import { useState } from 'react';
import { Review } from '@/services/reviewService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Heart, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReviewPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface ReviewSectionProps {
  productId: string;
  reviews: Review[];
  loading?: boolean;
  pagination?: ReviewPagination;
  onPageChange?: (page: number) => void;
}

const ReviewSection = ({ 
  productId, 
  reviews, 
  loading = false,
  pagination,
  onPageChange 
}: ReviewSectionProps) => {
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const { toast } = useToast();

  // Ensure reviews is always an array
  const safeReviews = Array.isArray(reviews) ? reviews : [];

  const handleLike = (reviewId: string) => {
    toast({
      title: "Success",
      description: "Review liked successfully",
    });
  };

  const handleReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    
    toast({
      title: "Success",
      description: "Reply added successfully",
    });
    setReplyText('');
    setExpandedReview(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : safeReviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {safeReviews.map((review) => {
              const images = Array.isArray(review.images) ? review.images : [];
              const replies = Array.isArray((review as any).replies) ? (review as any).replies : [];
              return (
                <Card key={review._id} className="w-full">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{(review.userId as any)?.name || 'User'}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                      </div>
                    </div>

                    <p className="mt-4">{review.comment}</p>

                    {images.length > 0 && (
                      <div className="mt-4 flex gap-2 overflow-x-auto">
                        {images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Review image ${index + 1}`}
                            className="h-24 w-24 rounded-lg object-cover"
                          />
                        ))}
                      </div>
                    )}

                    <div className="mt-4 flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleLike(review._id)}
                      >
                        <Heart className="h-4 w-4" />
                        <span>{review.isHelpful ?? 0}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => setExpandedReview(review._id)}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>{replies.length}</span>
                      </Button>
                    </div>

                    {replies.length > 0 && (
                      <div className="mt-4 space-y-3 pl-6 border-l-2">
                        {replies.map((reply: any) => (
                          <div key={reply._id} className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{reply.userName}</span>
                              <span className="text-sm text-gray-500">{formatDate(reply.createdAt)}</span>
                            </div>
                            <p className="text-sm">{reply.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {expandedReview === review._id && (
                      <div className="mt-4 space-y-2">
                        <Textarea
                          placeholder="Write a reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="w-full"
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setExpandedReview(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleReply(review._id)}
                          >
                            Reply
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {[...Array(pagination.pages)].map((_, i) => (
                <Button
                  key={i + 1}
                  variant={pagination.page === i + 1 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange?.(i + 1)}
                  disabled={loading}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewSection;
