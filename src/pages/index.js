import React, { useState, useEffect } from "react";
import HeroBanner from "../../components/HeroBanner";
import ProductCard from "../../components/ProductCard";
import Wrapper from "../../components/Wrapper";
import { fetchDataFromApi } from "@/utils/api";

export default function Home({ products }) {
    const [categories, setCategories] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedPriceRange, setSelectedPriceRange] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
  
    const fetchCategories = async () => {
      const { data } = await fetchDataFromApi("/api/categories?populate=*");
      setCategories(data);
    };
  
    useEffect(() => {
      fetchCategories();
    }, []);
  
    const handleCategoryClick = (category) => {
      setSelectedCategory(category);
    };
  
    const handlePriceCheckboxChange = (priceRange) => {
      setSelectedPriceRange(priceRange);
    };
  
    const handleSearchInputChange = (e) => {
      setSearchTerm(e.target.value);
    };
  
    return (
      <div>
        <HeroBanner />
        <main className="flex">
          <div className="w-1/4 p-4">
            <div className="bg-white p-4 shadow rounded-md mb-4">
              <h2 className="text-xl font-semibold mb-4">Categories</h2>
              <ul>
                <li
                  className={`h-12 flex justify-between items-center px-3 hover:bg-blue-200 rounded-md cursor-pointer mb-2 ${
                    !selectedCategory ? "bg-blue-200" : ""
                  }`}
                  onClick={() => handleCategoryClick(null)}
                >
                  All Categories
                </li>
                {categories &&
                  categories.map(({ attributes: c, id }) => (
                    <li
                      key={id}
                      className={`h-12 flex justify-between items-center px-3 hover:bg-blue-200 rounded-md cursor-pointer mb-2 ${
                        selectedCategory === c.slug ? "bg-blue-200" : ""
                      }`}
                      onClick={() => handleCategoryClick(c.slug)}
                    >
                      {c.name}
                      <span className="opacity-50 text-sm">
                        {`(${c.products.data.length})`}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="bg-white p-4 shadow rounded-md mb-4">
              <h2 className="text-xl font-semibold mb-4">Price Range</h2>
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={!selectedPriceRange}
                  onChange={() => handlePriceCheckboxChange(null)}
                />
                <span className="ml-2">All Prices</span>
              </label>
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={selectedPriceRange === "low"}
                  onChange={() => handlePriceCheckboxChange("low")}
                />
                <span className="ml-2">Low</span>
              </label>
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={selectedPriceRange === "medium"}
                  onChange={() => handlePriceCheckboxChange("medium")}
                />
                <span className="ml-2">Medium</span>
              </label>
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={selectedPriceRange === "high"}
                  onChange={() => handlePriceCheckboxChange("high")}
                />
                <span className="ml-2">High</span>
              </label>
            </div>
          </div>
          <div className="w-3/4 p-4">     
          <div className="bg-white p-4 shadow rounded-md mb-4 flex items-center justify-center">
  <h2 className="text-xl font-semibold mr-4">Search Product</h2>
  <input
    type="text"
    className="w-64 p-2 border border-gray-300 rounded-l-md rounded-r-none"
    placeholder="Enter product name"
    value={searchTerm}
    onChange={handleSearchInputChange}
    style={{ width: '400px' }} // Set the width to 400 pixels
  />
</div>
            <Wrapper>
              {/* ... (existing code for heading and paragraph) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-14 px-5 md:px-0">
                {products?.data
                  ?.filter((product) => {
                    if (
                      !selectedCategory &&
                      !selectedPriceRange &&
                      !searchTerm
                    )
                      return true;
  
                    const categoryFilter =
                      !selectedCategory ||
                      product.attributes.categories.data.some(
                        (category) =>
                          category.attributes.slug === selectedCategory
                      );
  
                    const priceFilter =
                      !selectedPriceRange ||
                      (selectedPriceRange === "low" &&
                        product.attributes.price < 200) ||
                      (selectedPriceRange === "medium" &&
                        product.attributes.price >= 200 &&
                        product.attributes.price <= 600) ||
                      (selectedPriceRange === "high" &&
                        product.attributes.price > 800);
  
                    const searchFilter =
                      !searchTerm ||
                      product.attributes.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());
  
                    return categoryFilter && priceFilter && searchFilter;
                  })
                  .map((product) => (
                    <ProductCard key={product?.id} data={product} />
                  ))}
              </div>
            </Wrapper>
          </div>
        </main>
      </div>
    );
  }

export async function getStaticProps() {
  const products = await fetchDataFromApi("/api/products?populate=*");

  return {
    props: { products },
  };
}
