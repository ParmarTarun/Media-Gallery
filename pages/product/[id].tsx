import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import CartIcon from "@/components/Icons/CartIcon";
import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductImages from "@/components/ProductImages";
import Title from "@/components/Title";
import WhiteBox from "@/components/WhiteBox";
import { mongooseConnect } from "@/lib/mongoose";
import { Product, productSchemaType } from "@/models/product";
import { ObjectId } from "mongodb";
import { GetServerSideProps } from "next";
import React, { useContext } from "react";
import styled from "styled-components";
import FlyingButton from "@/components/FlyingButton";

const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  margin-top: 40px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 0.8fr 1.2fr;
  }
`;

const PriceRow = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 40px;
  align-items: center;
`;
const Price = styled.span`
  font-size: 1.5rem;
`;

interface ProductPageProps {
  product: productSchemaType;
}

const ProductPage = ({ product }: ProductPageProps) => {
  const { addProductToCart } = useContext(CartContext);
  return (
    <>
      <Header />
      <Center>
        <>
          <ColWrapper>
            <WhiteBox>
              <ProductImages images={product.images} />
            </WhiteBox>
            <div>
              <Title>{product.title}</Title>
              <p>{product.description}</p>
              <PriceRow>
                <div>
                  <Price>${product.price}</Price>
                </div>
                <div>
                  <FlyingButton
                    main
                    id={product._id}
                    src={product.images?.[0]}
                    onClick={() => addProductToCart(product._id as ObjectId)}
                  >
                    <CartIcon />
                    Add to Cart
                  </FlyingButton>
                </div>
              </PriceRow>
            </div>
          </ColWrapper>
        </>
      </Center>
    </>
  );
};

export default ProductPage;

export const getServerSideProps: GetServerSideProps<ProductPageProps> = async (
  context
) => {
  await mongooseConnect();
  const { id } = context.query;
  const product = await Product.find({ _id: id });
  return {
    props: {
      product: JSON.parse(JSON.stringify(product))[0],
    },
  };
};
