import React, { useState } from "react";
import { useContractCall } from "@/hooks/contract/useContractRead";
import ProductOverview from "@/components/ProductOverview";

interface ProductData {
  id: number;
}

const OverviewList: React.FC = () => {
  const { data } = useContractCall("getProductsLength", [], true);
  const productLength = data ? Number(data.toString()) : 0;

  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>(getProducts());

  function getProducts(): ProductData[] {
    if (!productLength) return [];

    const products: ProductData[] = [];
    for (let i = 0; i < productLength; i++) {
      products.push({ id: i});
    }
    return products;
  }

  return (
    <div>
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <h2 className='font-bold text-3xl mb-6'>Overview all products record from sneaker shop</h2>
        <div className="grid">
          {filteredProducts.length > 0 ? (
            <table>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Owner</th>
                <th>Location</th>
                <th>Price</th>
                <th>Sold</th>
                <th style={{width: '10%'}}>Image</th>
              </tr>
            {filteredProducts.map((product) => (
              <ProductOverview
                key={product.id}
                id={product.id}
              />
            ))}
            </table>
          ) : (
            <p className="text-gray-500 text-center w-full col-span-3">
              No products found. Please try to add some!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewList;
