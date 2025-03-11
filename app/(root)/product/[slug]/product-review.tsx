'use client';

import ProductReviewPopup from "./product-review-popup";
import ReviewStars from "@/components/ui/common/review/review-stars";
import Link from "next/link";
import { Review } from "@/types";
import { useEffect, useState } from "react";
import { getAllReviewsAction } from "@/lib/actions/review.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const ProductReview = ({
    userId,
    productId,
    productSlug,
  }: {
    userId: string;
    productId: string;
    productSlug: string;
  }) => {
    const { toast } = useToast();
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        const loadReviews = async () => {
          const res = await getAllReviewsAction({ productId });
          setReviews(res.data);
        };
      
        loadReviews();
    }, [productId]);

    const reload = async () => {
        try {
            const res = await getAllReviewsAction({ productId });
            setReviews([...res.data]);
          } catch (err) {
            console.log(err);
            toast({
              variant: 'destructive',
              description: 'Error in fetching reviews',
            });
          }
    };

    return (
      <div className='space-y-4'>
        {reviews.length === 0 && <div>No reviews yet</div>}
        {userId ? (
            <ProductReviewPopup userId={userId} productId={productId} onReviewSubmitted={reload} />
        ) : (
          <div>
            Please
            <Link
              className='text-primary px-2'
              href={`/api/auth/login?callbackUrl=/product/${productSlug}`}
            >
              sign in
            </Link>{' '}
            to write a review
          </div>
        )}
        <div className='flex flex-col gap-3'>
        {
            reviews.map((review) => (
                <Card key={review.id}>
                    <CardHeader>
                        <div className='flex-between'>
                        <CardTitle>{review.title}</CardTitle>
                        </div>
                        <CardDescription>{review.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='flex space-x-4 text-sm text-muted-foreground'>
                            <ReviewStars value={review.rating} />
                        <div className='flex items-center'>
                            <User className='mr-1 h-3 w-3' />
                            {review.user ? review.user.name : 'Deleted User'}
                        </div>
                        <div className='flex items-center'>
                            <Calendar className='mr-1 h-3 w-3' />
                            {formatDateTime(review.creationTime).dateTime}
                        </div>
                        </div>
                    </CardContent>
                </Card>
            ))
        }
        </div>
      </div>
    );
}
 
export default ProductReview;