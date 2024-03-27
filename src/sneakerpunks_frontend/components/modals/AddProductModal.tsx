// This component is used to add a product to the marketplace and show the user's USD balance

// Importing the dependencies
import { useEffect, useState } from "react";
// import ethers to convert the product price to wei
import { ethers } from "ethers";
// Import the useAccount and useBalance hooks to get the user's address and balance
import { useAccount, useBalance } from "wagmi";
// Import the toast library to display notifications
import { toast } from "react-toastify";
// Import the useDebounce hook to debounce the input fields
import { useDebounce } from "use-debounce";
// Import our custom useContractSend hook to write a product to the marketplace contract
import { useContractSend } from "@/hooks/contract/useContractWrite";
// Import the erc20 contract abi to get the USD balance
import erc20Instance from "../../abi/erc20.json";

// Define the AddProductModal component
const AddProductModal = () => {
  // The visible state is used to toggle the visibility of the modal
  const [visible, setVisible] = useState(false);
  // The following states are used to store the values of the input fields
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState<string | number>(0);
  const [productImage, setProductImage] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productLocation, setProductLocation] = useState("");

  // The following states are used to debounce the input fields
  const [debouncedProductName] = useDebounce(productName, 500);
  const [debouncedProductPrice] = useDebounce(productPrice, 500);
  const [debouncedProductImage] = useDebounce(productImage, 500);
  const [debouncedProductDescription] = useDebounce(productDescription, 500);
  const [debouncedProductLocation] = useDebounce(productLocation, 500);
  const [loading, setLoading] = useState("");
  const [displayBalance, setDisplayBalance] = useState(false);

  // Validate a url
  function isValidUrl(url:string) {
    let isValid = false;

    try {
      const parsedUrl = new URL(url);
      isValid = true;
    } catch (error) {
      isValid = false;
    }

    return isValid;
  }

  // Check if all the input fields are filled
   const isComplete = () => {
    if (productName.replace(/^[ ]+|[ ]+$/g, '').length < 2) {
      toast.warn("Please enter valid product name (2 characters or more)")
      return false;
    }
    if (!isValidUrl(productImage)) {
      toast.warn("Please enter a valid image url")
      return false;
    }
    if (productDescription.replace(/^[ ]+|[ ]+$/g, '').split(" ").length < 2) {
      toast.warn("Please enter a valid product description (2 words or more)")
      return false;
    }
    if (productLocation.replace(/^[ ]+|[ ]+$/g, '').length < 2) {
      toast.warn("Please enter a valid product location")
      return false;
    }
    if (Number(productPrice) < 1) {
      toast.warn("Please enter a valid product price (> 0)")
      return false;
    }
    return true
  }

  // Clear the input fields after the product is added to the marketplace
  const clearForm = () => {
    setProductName("");
    setProductPrice(0);
    setProductImage("");
    setProductDescription("");
    setProductLocation("");
  };

  // Convert the product price to wei
  const productPriceInWei = ethers.utils.parseEther(
    `${debouncedProductPrice.toString() || 0}`
  );

  // Use the useContractSend hook to use our writeProduct function on the marketplace contract and add a product to the marketplace
  const { writeAsync: createProduct } = useContractSend("writeProduct", [
    debouncedProductName,
    debouncedProductImage,
    debouncedProductDescription,
    debouncedProductLocation,
    productPriceInWei,
  ]);

  // Define function that handles the creation of a product through the marketplace contract
  const handleCreateProduct = async () => {
    if (!createProduct) {
      throw "Failed to create product";
    }
    setLoading("Creating...");
    if (!isComplete()) throw new Error("Please fill all fields");
    // Create the product by calling the writeProduct function on the marketplace contract
    const purchaseTx = await createProduct();
    setLoading("Waiting for confirmation...");
    // Wait for the transaction to be mined
    await purchaseTx.wait();
    // Close the modal and clear the input fields after the product is added to the marketplace
    setVisible(false);
    clearForm();
  };

  // Define function that handles the creation of a product, if a user submits the product form
  const addProduct = async (e: any) => {
    e.preventDefault();
    try {
      // Display a notification while the product is being added to the marketplace
      await toast.promise(handleCreateProduct(), {
        pending: "Creating product...",
        success: "Product created successfully",
        error: "Something went wrong. Try again.",
      });
      // Display an error message if something goes wrong
    } catch (e: any) {
      console.log({ e });
      toast.error(e?.message || "Something went wrong. Try again.");
      // Clear the loading state after the product is added to the marketplace
    } finally {
      setLoading("");
    }
  };

  // Get the user's address and balance
  const { address, isConnected } = useAccount();
  const { data: usdBalance } = useBalance({
    address,
    token: erc20Instance.address as `0x${string}`,
    watch: true
  });

  // If the user is connected and has a balance, display the balance
  useEffect(() => {
    if (isConnected && usdBalance) {
      setDisplayBalance(true);
      return;
    }
    setDisplayBalance(false);
  }, [usdBalance, isConnected]);

  // Define the JSX that will be rendered
  return (
    <div className={"flex flex-row w-full justify-between"}>
      <div>
        {/* Add Product Button that opens the modal */}
        <button
          type="button"
          onClick={() => setVisible(true)}
          className="inline-block ml-4 px-6 py-2.5 bg-black text-white font-medium text-md leading-tight rounded-2xl shadow-md hover:bg-purple-900 hover:shadow-lg focus:bg-purple-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-900 active:shadow-lg transition duration-150 ease-in-out"
          data-bs-toggle="modal"
          data-bs-target="#exampleModalCenter"
        >
          List Sneaker
        </button>

        {/* Modal */}
        {visible && (
          <div
            className="fixed z-40 overflow-y-auto top-0 w-full left-0"
            id="modal"
          >
            {/* Form with input fields for the product, that triggers the addProduct function on submit */}
            <form onSubmit={addProduct}>
              <div className="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity">
                  <div className="absolute inset-0 bg-gray-900 opacity-75" />
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                  &#8203;
                </span>
                <div
                  className="inline-block align-center bg-black rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-headline"
                >
                  {/* Input fields for the product */}
                  <div className="bg-purple-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <label>Product Name</label>
                    <input
                      onChange={(e) => {
                        setProductName(e.target.value);
                      }}
                      required
                      type="text"
                      className="w-full bg-black p-2 mt-2 mb-3"
                    />

                    <label>Product Image (URL)</label>
                    <input
                      onChange={(e) => {
                        setProductImage(e.target.value);
                      }}
                      required
                      type="text"
                      className="w-full bg-black p-2 mt-2 mb-3"
                    />

                    <label>Product Description</label>
                    <input
                      onChange={(e) => {
                        setProductDescription(e.target.value);
                      }}
                      required
                      type="text"
                      className="w-full bg-black p-2 mt-2 mb-3"
                    />

                    <label>Product Location</label>
                    <input
                      onChange={(e) => {
                        setProductLocation(e.target.value);
                      }}
                      required
                      type="text"
                      className="w-full bg-black p-2 mt-2 mb-3"
                    />

                    <label>Product Price (USD)</label>
                    <input
                      onChange={(e) => {
                        setProductPrice(e.target.value);
                      }}
                      required
                      type="number"
                      className="w-full bg-black p-2 mt-2 mb-3"
                    />
                  </div>
                  {/* Button to close the modal */}
                  <div className="bg-purple-900 px-4 py-3 text-right">
                    <button
                      type="button"
                      className="py-2 px-4 bg-red-500 text-white rounded hover:bg-gray-700 mr-2"
                      onClick={() => setVisible(false)}
                    >
                      <i className="fas fa-times"></i> Cancel
                    </button>
                    {/* Button to add the product to the marketplace */}
                    <button
                      type="submit"
                      disabled={!!loading || !isComplete || !createProduct}
                      className="py-2 px-4 bg-yellow-500 text-white rounded hover:bg-purple-700 mr-2 disabled:bg-gray-300 disabled:hover:bg-gray-300"
                    >
                      {loading ? loading : "Create"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Display the user's USD balance */}
      {displayBalance && (
        <span
          className="inline-block text-dark ml-4 px-6 py-2.5 font-medium text-md leading-tight rounded-2xl shadow-none "
          data-bs-toggle="modal"
          data-bs-target="#exampleModalCenter"
        >
          Balance: {Number(usdBalance?.formatted || 0).toFixed(2)} USD
        </span>
      )}
    </div>
  );
};

export default AddProductModal;