import React, { useState } from "react";
import { useContractCall } from "@/hooks/contract/useContractRead";
import Product from "@/components/Product";
import ProductFilter from "@/components/ProductFilter";
import ErrorAlert from "@/components/alerts/ErrorAlert";
import LoadingAlert from "@/components/alerts/LoadingAlert";
import SuccessAlert from "@/components/alerts/SuccessAlert";

interface ProductData {
  id: number;
  name: string;
  // Add other product properties here as needed
}

const ProductList: React.FC = () => {
  const { data } = useContractCall("getProductsLength", [], true);
  const productLength = data ? Number(data.toString()) : 0;

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>(getProducts());

  const clear = () => {
    setError("");
    setSuccess("");
    setLoading("");
  };

  function getProducts(): ProductData[] {
    if (!productLength) return [];

    // Replace the hardcoded product names with the actual product names
    const productNames = [
      "Air Jordan 1 OG",
      "Nike SB Parra",
      "Air Jordan 1 pinky",
      "Hermes Sneakers",
    ];

    const products: ProductData[] = [];
    for (let i = 0; i < productLength; i++) {
      products.push({
        id: i,
        name: productNames[i],
        // Add other product properties here as needed
      });
    }
    return products;
  }

  return (
    <div>
      {error && <ErrorAlert message={error} clear={clear} />}
      {success && <SuccessAlert message={success} />}
      {loading && <LoadingAlert message={loading} />}
      <ProductFilter products={getProducts()} setFilteredProducts={setFilteredProducts} />
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Product
                key={product.id}
                id={product.id}
                name={product.name}
                setSuccess={setSuccess}
                setError={setError}
                setLoading={setLoading}
                loading={loading}
                clear={clear}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center w-full col-span-3">
              No products found. Please try a different search term.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
