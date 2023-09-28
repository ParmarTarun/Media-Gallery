import { productSchemaType } from "@/models/product";
import React from "react";
import styled from "styled-components";
import ProductBox from "./ProductBox";
import { RevealWrapper } from "next-reveal";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  gap: 40px;
  padding-top: 20px;
`;

interface ProductsGridProps {
  products: productSchemaType[];
  wishedProductIds: string[];
}

const ProductsGrid = ({ products, wishedProductIds }: ProductsGridProps) => {
  return (
    <Wrapper>
      {products?.map((prod, i) => {
        let isWished = false;
        if (wishedProductIds.includes(prod._id?.toString() || "random"))
          isWished = true;
        return (
          <RevealWrapper delay={100 * i} key={i}>
            <ProductBox product={prod} wished={isWished} />
          </RevealWrapper>
        );
      })}
    </Wrapper>
  );
};

export default ProductsGrid;
