/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import { identiconTemplate } from "@/helpers";
import { useContractApprove } from "@/hooks/contract/useApprove";
import { useContractCall } from "@/hooks/contract/useContractRead";
import { useContractSend } from "@/hooks/contract/useContractWrite";

// Define the interface for the product and reviews
interface Review {
  user: string;
  rating: number;
  comment: string;
}

interface Product {
  name: string;
  price: number;
  owner: string;
  image: string;
  description: string;
  location: string;
  sold: boolean;
  reviews: Review[];
}

// Define the Product component
const Product = ({ id, setError, setLoading, clear }: any) => {
  const { address } = useAccount();
  const { data: rawProduct }: any = useContractCall("readProduct", [id], true);
  const { writeAsync: purchase } = useContractSend("buyProduct", [Number(id)]);
  const [product, setProduct] = useState<Product>({
    name: "",
    price: 0,
    owner: "",
    image: "",
    description: "",
    location: "",
    sold: false,
    reviews: []
  });
  const { writeAsync: approve } = useContractApprove(
    product?.price?.toString() || "0"
  );
  const { openConnectModal } = useConnectModal();
  const [userReview, setUserReview] = useState<Review>({
    user: "",
    rating: 0,
    comment: ""
  });
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareIcons, setShowShareIcons] = useState(false);
  const [showRatingInput, setShowRatingInput] = useState(false);

  const handleReviewChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setUserReview((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleReviewSubmit = () => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      reviews: [...prevProduct.reviews, userReview]
    }));
    saveReviewsToStorage([...product.reviews, userReview]);
    setUserReview({ user: "", rating: 0, comment: "" });
    setShowRatingInput(false); // Hide the rating input after submitting the review
  };

  const handleToggleFavorite = () => {
    setIsFavorite((prevIsFavorite) => !prevIsFavorite);
    saveLikedStateToStorage(!isFavorite); // Save the updated liked state to local storage
  };

  const handleDeleteReview = (index: number) => {
    // Check if the user who submitted the review is the one trying to delete it
    if (product.reviews[index].user === address) {
      setProduct((prevProduct) => {
        const newReviews = [...prevProduct.reviews];
        newReviews.splice(index, 1);
        saveReviewsToStorage(newReviews);
        return {
          ...prevProduct,
          reviews: newReviews
        };
      });
    }
  };

  const getReviewsFromStorage = useCallback((): Review[] => {
    const storedReviews = localStorage.getItem(`product_reviews_${id}`);
    return storedReviews ? JSON.parse(storedReviews) : [];
  }, [id]);

  const saveReviewsToStorage = (reviews: Review[]) => {
    localStorage.setItem(`product_reviews_${id}`, JSON.stringify(reviews));
  };

  const saveLikedStateToStorage = (isLiked: boolean) => {
    localStorage.setItem(`product_liked_${id}`, JSON.stringify(isLiked));
  };

  const getFormatProduct = useCallback(() => {
    if (!rawProduct) return null;
    setProduct({
      owner: rawProduct[0],
      name: rawProduct[1],
      image: rawProduct[2],
      description: rawProduct[3],
      location: rawProduct[4],
      price: Number(rawProduct[5]),
      sold: rawProduct[6].toString(),
      reviews: getReviewsFromStorage() // Get reviews from localStorage or assume initially there are no reviews
    });
  }, [rawProduct, getReviewsFromStorage]);

  useEffect(() => {
    getFormatProduct();
    // On component mount, check local storage for the liked state and update the state if it exists
    const likedState = localStorage.getItem(`product_liked_${id}`);
    setIsFavorite(likedState ? JSON.parse(likedState) : false);
  }, [getFormatProduct, id]);

  const handlePurchase = async () => {
    if (!approve || !purchase) {
      throw "Failed to purchase this product";
    }

    const approveTx = await approve();
    await approveTx.wait(1);
    setLoading("Purchasing...");

    const res = await purchase();
    await res.wait();
  };

  const purchaseProduct = async () => {
    setLoading("Approving ...");
    clear();

    try {
      if (!address && openConnectModal) {
        openConnectModal();
        return;
      }

      await toast.promise(handlePurchase(), {
        pending: "Purchasing product...",
        success: "Product purchased successfully",
        error: "Failed to purchase product"
      });
    } catch (e: any) {
      console.log({ e });
      setError(e?.reason || e?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(null);
    }
  };

  if (!product) return null;

  const productPriceFromWei = ethers.utils.formatEther(
    product.price.toString()
  );

  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        ) / product.reviews.length
      : 0;

  const handleShareToggle = () => {
    setShowShareIcons((prevShowShareIcons) => !prevShowShareIcons);
  };

  const handleShareProduct = async (platform: string) => {
    // ... (Previous code remains unchanged)
  };

  // JSX for the reviews section
  const reviewsSection = (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Reviews</h3>
      {product.reviews.map((review, index) => (
        <div key={index} className="border p-2 mb-2">
          <div className="flex items-center justify-between">
            <p className="font-medium">{review.user}</p>
            {review.user === address && (
              <button
                onClick={() => handleDeleteReview(index)}
                className="text-red-600"
              >
                Delete
              </button>
            )}
          </div>
          <p>Rating: {review.rating}/10</p>
          <p>{review.comment}</p>
        </div>
      ))}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Leave a Review</h3>
        <input
          type="text"
          name="user"
          placeholder="Your Name"
          value={userReview.user}
          onChange={handleReviewChange}
          className="border p-2 mb-2 text-black"
        />
        {showRatingInput && (
          <input
            type="number"
            name="rating"
            placeholder="Rating (1-10)"
            min="1"
            max="10"
            value={userReview.rating}
            onChange={handleReviewChange}
            className="border p-2 mb-2 text-black"
          />
        )}
        <textarea
          name="comment"
          placeholder="Your Comment"
          value={userReview.comment}
          onChange={handleReviewChange}
          className="border p-2 mb-2 text-black"
        />
        <button
          onClick={() => {
            setShowRatingInput(true);
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Rate Review
        </button>
        {showRatingInput && (
          <button
            onClick={handleReviewSubmit}
            className="bg-red-600 text-white px-4 py-2 rounded mt-2"
          >
            Submit Review
          </button>
        )}
      </div>
    </div>
  );

  // JSX for the share icons
  const shareIcons = showShareIcons && (
    <div className="mt-4 flex space-x-4">
      <button
        onClick={() => handleShareProduct("facebook")}
        className="text-white"
      >
        <img src="/facebook-icon.png" alt="Facebook" className="w-8 h-8" />
      </button>
      <button
        onClick={() => handleShareProduct("twitter")}
        className="text-white"
      >
        <img src="/twitter-icon.png" alt="Twitter" className="w-8 h-8" />
      </button>
      <button
        onClick={() => handleShareProduct("whatsapp")}
        className="text-white"
      >
        <img src="/whatsapp-icon.png" alt="WhatsApp" className="w-8 h-8" />
      </button>
    </div>
  );

  // JSX for the product component with updated "Love" button as a heart icon
  return (
    <div className="shadow-lg relative rounded-b-lg">
      <p className="group">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-white xl:aspect-w-7 xl:aspect-h-8 ">
          <span
            className={
              "absolute z-10 right-0 mt-4 bg-amber-400 text-white p-1 rounded-l-lg px-4"
            }
          >
            {product.sold} sold
          </span>
          <img
            src={product.image}
            alt="image"
            className="w-full h-80 rounded-t-md  object-cover object-center group-hover:opacity-75"
          />
          <button
            onClick={handleToggleFavorite}
            className="absolute left-4 top-4 p-2 rounded focus:outline-none"
            style={{
              backgroundColor: isFavorite ? "#FCA5B2" : "#F3F4F6",
              color: isFavorite ? "#FF0000" : "#374151",
              boxShadow: isFavorite
                ? "0 0 8px rgba(252, 165, 178, 0.7)"
                : "none",
              transition: "background-color 0.3s, box-shadow 0.3s, color 0.3s",
            }}
          >
            {isFavorite ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                {/* Update the heart icon to a love icon */}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 21.35l-1.45-1.32C5.4 16.26 2 13.07 2 9.5 2 7.5 3 6 4.5 6c1.08 0 2.08.7 2.41 1.75C7.59 7.36 8.5 8 9.5 8s1.91-.64 2.09-1.25C14.42 6.7 15.42 6 16.5 6c1.5 0 2.5 1.5 2.5 3.5 0 3.57-3.4 6.75-8.55 10.54L12 21.35z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                {/* Update the heart icon to a love icon */}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l-1-1m-1-1H8a2 2 0 01-2-2V9a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2h-2l-1 1z"
                />
              </svg>
            )}
          </button>
          {identiconTemplate(product.owner)}
        </div>

        <div className="m-5">
          <div className="pt-1">
            <div className="flex flex-row items-center justify-between">
              <p className="text-2xl font-bold">{product.name}</p>
            </div>
            <p>Average Rating: {averageRating.toFixed(1)}/10</p>
            <div className="h-40 overflow-y-hidden scrollbar-hide">
              <h3 className="mt-4 text-sm text-yellow-400">
                {product.description}
              </h3>
            </div>
          </div>

          <div>
            <div className="flex flex-row">
              <img src="/location.svg" alt="Location" className="w-6" />
              <h3 className="pt-1 text-sm text-yellow-400">{product.location}</h3>
            </div>
            <button
              onClick={purchaseProduct}
              className="mt-4 h-14 w-full border-[1px] border-white text-white p-2 rounded-lg hover:bg-purple-900 hover:text-white"
            >
              Buy for {productPriceFromWei} cUSD
            </button>
            {reviewsSection}
            <div className="mt-4">
              <button
                onClick={handleShareToggle}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Share
              </button>
              {shareIcons}
            </div>
          </div>
        </div>
      </p>
    </div>
  );
};

export default Product;
