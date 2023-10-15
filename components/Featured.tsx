import React, { useContext } from "react";
import Center from "./Center";
import { styled } from "styled-components";
import Button from "./Button";
import { productSchemaType } from "@/models/product";
import ButtonLink from "./ButtonLink";
import CartIcon from "./Icons/CartIcon";
import { CartContext } from "./CartContext";
import { ObjectId } from "mongodb";
import FlyingButton from "./FlyingButton";
import { RevealWrapper } from "next-reveal";

const Bg = styled.div`
  background-color: #222;
  color: #fff;
  padding: 50px 0;
`;
const Title = styled.h1`
  margin: 0;
  font-weight: normal;
  font-size: 1.5rem;
  @media screen and (min-width: 768px) {
    font-size: 3rem;
  }
`;
const Desc = styled.p`
  color: #aaa;
  font-weight: normal;
`;
const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  img {
    max-width: 100%;
    max-height: 100%;
    display: block;
    margin: 0 auto;
  }
  div:nth-child(1) {
    order: 2;
  }
  @media screen and (min-width: 768px) {
    grid-template-columns: 0.9fr 1.1fr;
    div:nth-child(1) {
      order: 0;
    }
    img {
      max-width: 100%;
    }
  }
`;
const ButtonsWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 25px;
`;

const Column = styled.div`
  display: flex;
  align-items: center;
`;

interface featuredProps {
  product: productSchemaType;
}

const Featured = ({ product }: featuredProps) => {
  const { addProductToCart } = useContext(CartContext);

  const addFeaturedToCart = () => {
    addProductToCart(product._id as ObjectId);
  };

  return (
    <Bg>
      <Center>
        <ColumnsWrapper>
          <Column>
            <div>
              <RevealWrapper origin="left">
                <Title>{product.title}</Title>
                <Desc>{product.description.slice(0, 150)}...</Desc>
                <ButtonsWrapper>
                  <ButtonLink
                    href={"/product/" + product._id}
                    outline={1}
                    white={1}
                  >
                    Read more
                  </ButtonLink>
                  <FlyingButton
                    white={1}
                    src={product.images?.[0]}
                    onClick={addFeaturedToCart}
                  >
                    <CartIcon />
                    Add to cart
                  </FlyingButton>
                </ButtonsWrapper>
              </RevealWrapper>
            </div>
          </Column>
          <Column>
            <RevealWrapper>
              <img src={product.images?.[0]} alt="" />
            </RevealWrapper>
          </Column>
        </ColumnsWrapper>
      </Center>
    </Bg>
  );
};

export default Featured;
