import { productSchemaType } from "@/models/product";
import React, { useState } from "react";
import { styled } from "styled-components";
import CartIcon from "./Icons/CartIcon";
import Link from "next/link";
import FlyingButton from "./FlyingButton";
import HeartSolid from "./Icons/HeartSolid";
import HearStroke from "./Icons/HeartStroke";
import axios from "axios";

interface productBoxProps {
  product: productSchemaType;
  wished?: boolean;
  onRemove?: (pId: string) => void;
}

const ProductWrapper = styled.div``;

const WhiteBox = styled(Link)`
  background-color: #fff;
  padding: 20px;
  height: 120px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img {
    max-width: 100%;
    max-height: 80px;
  }
  position: relative;
`;

const Title = styled(Link)`
  font-weight: normal;
  font-size: 1rem;
  margin: 0;
  color: inherit;
  text-decoration: none;
`;

const ProductInfoBox = styled.div`
  margin-top: 5px;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
`;

const Price = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const WishlistButton = styled.button`
  border: 0;
  background: transparent;
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
  svg {
    width: 16px;
  }
`;

const ProductBox = ({ product, wished = false, onRemove }: productBoxProps) => {
  const uri = "/product/" + product._id;
  const [isWished, setIsWished] = useState(wished);
  const addToWishlist = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    axios
      .post("/api/wishlist", {
        product: product._id,
      })
      .then((res) => {
        if (!onRemove) setIsWished(!isWished);
        if (isWished && onRemove) {
          onRemove(product._id?.toString() || "");
        }
      });
  };
  return (
    <ProductWrapper>
      <WhiteBox href={uri}>
        <div>
          <WishlistButton onClick={addToWishlist}>
            {isWished ? <HeartSolid /> : <HearStroke />}
          </WishlistButton>
          <img src={product.images[0]} />
        </div>
      </WhiteBox>
      <ProductInfoBox>
        <Title href={uri}>{product.title}</Title>
        <PriceRow>
          <Price>${product.price}</Price>
          <FlyingButton src={product.images?.[0]} id={product._id}>
            <CartIcon />
          </FlyingButton>
        </PriceRow>
      </ProductInfoBox>
    </ProductWrapper>
  );
};

export default ProductBox;
