import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const UserReviews = ({ reviews, onAddReview }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');

  const sortedAndFilteredReviews = reviews?.filter(review => filterRating === 'all' || review?.rating === parseInt(filterRating))?.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'highest':
          return b?.rating - a?.rating;
        case 'lowest':
          return a?.rating - b?.rating;
        default:
          return 0;
      }
    });

  const averageRating = reviews?.reduce((sum, review) => sum + review?.rating, 0) / reviews?.length;
  const ratingDistribution = [5, 4, 3, 2, 1]?.map(rating => ({
    rating,
    count: reviews?.filter(review => review?.rating === rating)?.length,
    percentage: (reviews?.filter(review => review?.rating === rating)?.length / reviews?.length) * 100
  }));

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating, size = 16) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5]?.map((star) => (
          <Icon
            key={star}
            name="Star"
            size={size}
            className={`${
              star <= rating 
                ? 'text-warning fill-current' :'text-muted-foreground'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-heading font-bold text-foreground flex items-center">
          <Icon name="MessageSquare" size={24} className="text-primary mr-3" />
          Ulasan & Rating
        </h3>
        
        <Button
          variant="default"
          size="sm"
          iconName="Plus"
          iconPosition="left"
          onClick={() => setShowReviewForm(true)}
        >
          Tulis Ulasan
        </Button>
      </div>
      {/* Rating Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Overall Rating */}
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start space-x-4 mb-4">
            <div className="text-4xl font-bold text-warning">
              {averageRating?.toFixed(1)}
            </div>
            <div>
              {renderStars(Math.round(averageRating), 20)}
              <p className="text-sm text-muted-foreground mt-1">
                {reviews?.length} ulasan
              </p>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {ratingDistribution?.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center space-x-3">
              <span className="text-sm font-medium w-8">{rating}</span>
              <Icon name="Star" size={14} className="text-warning fill-current" />
              <div className="flex-1 bg-muted rounded-full h-2">
                <div
                  className="bg-warning h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-8">{count}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-foreground">Urutkan:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e?.target?.value)}
            className="px-3 py-1 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="highest">Rating Tertinggi</option>
            <option value="lowest">Rating Terendah</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-foreground">Filter:</span>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e?.target?.value)}
            className="px-3 py-1 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Semua Rating</option>
            <option value="5">5 Bintang</option>
            <option value="4">4 Bintang</option>
            <option value="3">3 Bintang</option>
            <option value="2">2 Bintang</option>
            <option value="1">1 Bintang</option>
          </select>
        </div>
      </div>
      {/* Reviews List */}
      <div className="space-y-6">
        {sortedAndFilteredReviews?.map((review, index) => (
          <div key={index} className="border border-border rounded-lg p-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Image
                  src={review?.avatar}
                  alt={review?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground">{review?.name}</h4>
                    <p className="text-sm text-muted-foreground">{formatDate(review?.date)}</p>
                  </div>
                  {renderStars(review?.rating)}
                </div>

                <p className="text-muted-foreground mb-3 leading-relaxed">
                  {review?.comment}
                </p>

                {/* Review Images */}
                {review?.images && review?.images?.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                    {review?.images?.map((image, imgIndex) => (
                      <div key={imgIndex} className="relative h-20 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={image}
                          alt={`Foto dari ${review?.name}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Review Tags */}
                {review?.tags && review?.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {review?.tags?.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Helpful Actions */}
                <div className="flex items-center space-x-4 text-sm">
                  <button className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors">
                    <Icon name="ThumbsUp" size={14} />
                    <span>Membantu ({review?.helpful || 0})</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors">
                    <Icon name="MessageCircle" size={14} />
                    <span>Balas</span>
                  </button>
                </div>

                {/* Recipe Modifications */}
                {review?.modifications && (
                  <div className="mt-3 p-3 bg-accent/5 rounded-lg border border-accent/20">
                    <h5 className="font-medium text-accent mb-2 flex items-center">
                      <Icon name="Edit" size={16} className="mr-2" />
                      Modifikasi Resep
                    </h5>
                    <p className="text-sm text-muted-foreground">{review?.modifications}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Load More */}
      {reviews?.length > 5 && (
        <div className="text-center mt-6">
          <Button variant="outline" iconName="ChevronDown" iconPosition="left">
            Muat Lebih Banyak Ulasan
          </Button>
        </div>
      )}
      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-foreground">Tulis Ulasan</h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowReviewForm(false)}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Rating
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5]?.map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="text-muted-foreground hover:text-warning transition-colors"
                    >
                      <Icon name="Star" size={24} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Ulasan Anda
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Bagikan pengalaman Anda dengan resep ini..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Foto (Opsional)
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  <Icon name="Camera" size={24} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Klik untuk menambah foto</p>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => setShowReviewForm(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  fullWidth
                  onClick={(e) => {
                    e?.preventDefault();
                    onAddReview();
                    setShowReviewForm(false);
                  }}
                >
                  Kirim Ulasan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserReviews;