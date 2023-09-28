import { productSchemaType } from "@/models/product";
import React from "react";
import { styled } from "styled-components";
import Center from "./Center";
import ProductsGrid from "./ProductsGrid";

interface NewProductsProps {
  products: productSchemaType[];
  wishedNewProductIds: string[];
}

const Title = styled.h2`
  font-size: 2rem;
  margin: 30px 0 10px;
  font-weight: normal;
`;

const NewProducts = ({ products, wishedNewProductIds }: NewProductsProps) => {
  return (
    <Center>
      <>
        <Title>New Arrivals</Title>
        <ProductsGrid
          products={products}
          wishedProductIds={wishedNewProductIds}
        />
      </>
    </Center>
  );
};

export default NewProducts;
