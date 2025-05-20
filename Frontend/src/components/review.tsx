import React, { Component } from "react";

// Sample data structure for orders and reviews
interface Review {
  orderId: string;
  rating: number;
  review: string;
  reviewDate: string;
}

// Add hoveredRating to the state interface
interface State {
  reviews: Review[];
  hoveredRating: number | null;
}

class OrderReviewsPage extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      reviews: [], // Reviews state
      hoveredRating: null, // Initializing hoveredRating
    };
  }

  // Simulate fetching reviews (this would typically be an API call)
  componentDidMount() {
    const fetchedReviews: Review[] = [
      {
        orderId: "ORD12345",
        rating: 5,
        review: "Great service! The driver was very punctual and polite.",
        reviewDate: "2024-11-10",
      },
      {
        orderId: "ORD12346",
        rating: 4,
        review: "The ride was smooth, but the driver took a longer route.",
        reviewDate: "2024-11-08",
      },
      {
        orderId: "ORD12347",
        rating: 3,
        review: "The driver was good, but the car could have been cleaner.",
        reviewDate: "2024-11-05",
      },
    ];

    this.setState({ reviews: fetchedReviews });
  }

  // Handle the dynamic star rating hover effect
  handleStarHover = (index: number) => {
    this.setState({ hoveredRating: index });
  };

  handleStarLeave = () => {
    this.setState({ hoveredRating: null });
  };

  render() {
    const { reviews, hoveredRating } = this.state;

    return (
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Completed Orders Reviews
        </h2>

        {/* No Reviews Found */}
        {reviews.length === 0 ? (
          <div className="text-center p-6 border border-gray-300 bg-gray-50 text-gray-700 rounded-lg shadow-lg">
            <h3 className="font-semibold text-xl">No Reviews Available</h3>
            <p className="text-sm">
              There are no reviews left for your completed orders yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Loop through reviews and display each one */}
            {reviews.map((review) => (
              <div
                key={review.orderId}
                className="p-6 border border-gray-200 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Order ID: {review.orderId}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {review.reviewDate}
                  </span>
                </div>

                {/* Rating Stars */}
                <div className="flex mb-4" onMouseLeave={this.handleStarLeave}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={
                        (hoveredRating ?? review.rating) >= star
                          ? "#FFD700" // Gold for selected stars
                          : "#D1D5DB" // Light grey for unselected stars
                      }
                      className="w-7 h-7 cursor-pointer transition-colors duration-200 ease-in-out"
                      onMouseEnter={() => this.handleStarHover(star)}
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 text-base">{review.review}</p>
              </div>
            ))}
          </div>
        )}

        {/* Review Form (Interactive) */}
        <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Leave a New Review
          </h3>
          <form className="space-y-4">
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              rows={4}
              placeholder="Write your review here..."
            ></textarea>

            {/* Rating */}
            <div className="flex mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={
                    hoveredRating !== null && hoveredRating >= star
                      ? "#FFD700"
                      : "#D1D5DB"
                  }
                  className="w-8 h-8 cursor-pointer transition-colors duration-200 ease-in-out"
                  onMouseEnter={() => this.handleStarHover(star)}
                  onMouseLeave={this.handleStarLeave}
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default OrderReviewsPage;
