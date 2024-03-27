import { useState } from "react";
import Image from "next/image";
import { useContractCall } from "@/hooks/contract/useContractRead";
import Product from "@/components/Product";
import loadingShoeImg from "./loading_shoe.gif";

import ErrorAlert from "@/components/alerts/ErrorAlert";
import LoadingAlert from "@/components/alerts/LoadingAlert";
import SuccessAlert from "@/components/alerts/SuccessAlert";

const RandomProductModal = () => {
  const { data } = useContractCall("getProductsLength", [], true);
  const productLength = data ? Number(data.toString()) : 0;

  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState("");
  const [showProduct, setShowProduct] = useState(false);
  const [productId, setProductId] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Please wait ...");
  const [selectedSneaker, setSelectedSneaker] = useState<number | null>(null);

  const clear = () => {
    setError("");
    setSuccess("");
    setLoading("");
  };

  const loadingRandom = async () => {
    setShowProduct(false);
    if (productLength === 0) {
      setLoadingMessage("***Please add products to use the random function");
    } else {
      setLoadingMessage("Please wait ...");
      // Simulate loading 2 seconds
      setTimeout(() => {
        const randomProductId = Math.floor(Math.random() * productLength);
        setProductId(randomProductId);
        setSelectedSneaker(randomProductId); // Store the selected sneaker
        setLoadingMessage("Congratulations!🎉 You chose this sneaker!");
        setShowProduct(true);
      }, 2000);
    }
  };

  return (
    <div className={"flex flex-row w-full justify-between"}>
      <div>
        <button
          type="button"
          onClick={() => {
            setVisible(true);
            loadingRandom();
          }}
          className="inline-block ml-4 px-6 py-2.5 mt-8 bg-black text-white font-medium text-md leading-tight rounded-2xl shadow-md hover:bg-yellow-300 hover:shadow-lg focus:bg-yellow-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-yellow-300 active:shadow-lg transition duration-150 ease-in-out"
          data-bs-toggle="modal"
          data-bs-target="#exampleModalCenter"
        >
          Shuffle Sneakers
        </button>

        {visible && (
          <div className="fixed z-40 top-0 w-full left-0" id="modal">
            <form>
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity">
                  <div className="absolute inset-0 bg-gray-900 opacity-75" />
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                  &#8203;
                </span>
                <div
                  className={`inline-block align-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
                    showProduct ? "product-container animate-fade-in" : "" /* Apply the "fadeIn" animation when showProduct is true */
                  }`}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-headline"
                >
                  <div className="bg-purple-900 px-4 pb-4 sm:p-6">
                    {!showProduct ? (
                      <div className="text-center">
                        <Image
                          className="block w-full sm:block lg:block"
                          src={loadingShoeImg}
                          width="32"
                          height="32"
                          alt="random image"
                        />
                        <span>{loadingMessage}</span>
                      </div>
                    ) : (
                      <div>
                        <p className="text-white text-center mb-4">{loadingMessage}</p>
                        <div className="h-96 overflow-y-scroll">
                          <Product
                            id={selectedSneaker}
                            setSuccess={setSuccess}
                            setError={setError}
                            setLoading={setLoading}
                            loading={loading}
                            clear={clear}
                            imgHeight="h-40"
                            descHeight="h-20"
                            editdelete={false}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="bg-purple-900 px-4 py-3 text-right">
                    <button
                      type="button"
                      className="py-2 px-4 bg-red-500 text-white rounded hover:bg-gray-700 mr-2"
                      onClick={() => setVisible(false)}
                    >
                      <i className="fas fa-times"></i> Cancel
                    </button>
                    <button
                      type="button"
                      className="py-2 px-4 bg-yellow-500 text-white rounded hover:bg-blue-700 mr-2"
                      onClick={() => {
                        loadingRandom();
                        setSuccess(""); // Clear previous success message
                        setVisible(false); // Close the modal after shuffling
                      }}
                    >
                      Choose again
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
        {error && <ErrorAlert message={error} clear={clear} />}
        {success && <SuccessAlert message={success} />}
        {loading && <LoadingAlert message={loading} />}
      </div>
    </div>
  );
};

export default RandomProductModal;
