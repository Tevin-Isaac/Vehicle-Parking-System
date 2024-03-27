import React, { useState, ChangeEvent } from "react";

interface Product {
  id: number;
  name: string;
  // Add other product properties here as needed
}

interface ProductFilterProps {
  products: Product[];
  setFilteredProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ products, setFilteredProducts }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (!term) {
      // If no search term is entered, show all products
      setFilteredProducts(products);
      return;
    }

    const filteredProducts = products.filter(
      (product) =>
        product.name.toLowerCase().startsWith(term.toLowerCase())
    );
    setFilteredProducts(filteredProducts);
  };

  const handleSearchClick = () => {
    // This function is optional, you can implement any specific action here when the button is clicked
    console.log("Search button clicked!");
  };

  return (
    <div className="mb-4 text-black" style={{ maxWidth: "400px", margin: "0 auto" }}>
      <label htmlFor="search" className="block text-sm font-medium text-black mb-1">
        Search Products
      </label>
      <div className="flex rounded-md shadow-sm">
        <input
          type="text"
          name="search"
          id="search"
          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300 px-3 py-2"
          placeholder="Enter product name"
          value={searchTerm}
          onChange={handleSearch}
          style={{ color: "black", height: "2.5rem" }}
        />
        <button
          className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md transition-colors duration-150 hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200 active:bg-indigo-800"
          onClick={handleSearchClick}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default ProductFilter;
