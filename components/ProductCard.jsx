import { getDiscountedPricePercentage } from "../src/utils/helper";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToFavorite } from "./../src/store/cartSlice";

const ProductCard = ({   data: { attributes: p, id, url } }) => {
  const imgurl = `${p.thumbnail.data[0].attributes.url}`;
  const dispatch = useDispatch();
  return (
    <Link href={`/product/${p.slug}`}>
      <div className="bg-white shadow-lg p-4 rounded-lg cursor-pointer transition-transform transform hover:scale-105">
        <Image
          width={500}
          height={500}
          src={imgurl}
          alt={p.name}
          className="object-cover w-full h-40 mb-4"
        />
        <div className="text-black">
          <h2 className="text-lg font-medium mb-2">{p.name}</h2>
          <div className="flex items-center text-black/[0.7]">
            <p className="text-lg font-semibold mr-2">&#8377;{p.price}</p>
            {p.original_price && (
              <>
                <p className="text-base font-medium line-through mr-2">
                  &#8377;{p.original_price}
                </p>
                <p className="text-base font-medium text-green-500">
                  {getDiscountedPricePercentage(p.original_price, p.price)}% off
                </p>
              </>
            )}
          </div>
  
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
