import React from "react";
import { signOut, useSession } from 'next-auth/react';
import HeroBanner from "../../components/HeroBanner";
import ProductCard from "../../components/ProductCard";
import Wrapper from "../../components/Wrapper";
import { fetchDataFromApi } from "@/utils/api";
export default function Home({ products }) {
    return (
        <main>
        <HeroBanner />
        <Wrapper>
            {/* heading and paragraph start */}
            <div className="text-center max-w-[800px] mx-auto my-[50px] md:my-[80px]">
                <div className="text-3xl md:text-4xl mb-5 font-semibold leading-tight text-gray-900">
                    Latest Arrivals
                </div>
                <div className="text-lg md:text-xl text-gray-700">
                    Explore our newest products.
                </div>
            </div>
            {/* heading and paragraph end */}
    
            {/* products grid start */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-14 px-5 md:px-0">
                {products?.data?.map((product) => (
                    <ProductCard key={product?.id} data={product} />
                ))}
            </div>
            {/* products grid end */}
        </Wrapper>
    </main>
    );
}

export async function getStaticProps() {
    const products = await fetchDataFromApi("/api/products?populate=*");

    return {
        props: { products },
    };
}






// import Image from 'next/image'
// // import { Inter } from 'next/font/google'

// // const inter = Inter({ subsets: ["latin"] });

// import { fetchDataFromApi } from '@/utils/api'
// import { useEffect, useState } from 'react'

// export default function Home() {
//   const [data, setData ] = useState(null);

//   useEffect(()=>{
//     fetchProducts();
//   },[])

//   const fetchProducts = async () => {
//     const {data} = await fetchDataFromApi('/api/products');
//     setData(data);
//     console.log(data);
//   }

//   return (
//     <>
//     <h>{data?.[0]?.attributes?.name}</h>

//     <h1>hello</h1>
//     </>
//   )
// }
