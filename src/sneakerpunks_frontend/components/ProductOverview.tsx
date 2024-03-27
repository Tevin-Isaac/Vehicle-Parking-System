/* eslint-disable @next/next/no-img-element */
// This component displays and enables the purchase of a product

// Importing the dependencies
import { useCallback, useEffect, useState } from "react";
// Import ethers to format the price of the product correctly
import { ethers } from "ethers";

// Import our custom hooks to interact with the smart contract
import { useContractCall } from "@/hooks/contract/useContractRead";

// Define the interface for the product, an interface is a type that describes the properties of an object
interface Product {
    name: string;
    price: number;
    owner: string;
    image: string;
    description: string;
    location: string;
    sold: boolean;
}

// Define the Product component which takes in the id of the product and some functions to display notifications
const ProductOverview = ({ id}: any) => {
    // Use the useContractCall hook to read the data of the product with the id passed in, from the marketplace contract
    const { data: rawProduct }: any = useContractCall("readProduct", [id], true);
    // Use the useContractSend hook to purchase the product with the id passed in, via the marketplace contract

    const [product, setProduct] = useState<Product | null>(null);
    // Format the product data that we read from the smart contract
    const getFormatProduct = useCallback(() => {
      if (!rawProduct) return null;

      // hide product delete
      if (rawProduct[0] == "0x0000000000000000000000000000000000000000") return null;
      
      setProduct({
        owner: rawProduct[0],
        name: rawProduct[1],
        image: rawProduct[2],
        description: rawProduct[3],
        location: rawProduct[4],
        price: Number(rawProduct[5]),
        sold: rawProduct[6].toString(),
      });
    }, [rawProduct]);
  
    // Call the getFormatProduct function when the rawProduct state changes
    useEffect(() => {
      getFormatProduct();
    }, [getFormatProduct]);

  // If the product cannot be loaded, return null
  if (!product) return null;

  // Format the price of the product from wei to cUSD otherwise the price will be way too high
  const productPriceFromWei = ethers.utils.formatEther(
    product.price.toString()
  );

  // Return the JSX for the product component
  return (
    <tr>
      <th>{id}</th>
      <th>{product.name}</th>
      <th>{product.description}</th>
      <th>{product.owner}</th>
      <th>{product.location}</th>
      <th>{productPriceFromWei} CUSD</th>
      <th>{product.sold}</th>
      <th><img
            src={product.image}
            alt={"image"}
            className="w-full rounded-t-md  object-cover object-center group-hover:opacity-75"
          /></th>
    </tr>
  );
};

export default ProductOverview;