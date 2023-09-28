import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import { mongooseConnect } from "@/lib/mongoose";
import { Product, productSchemaType } from "@/models/product";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { WishedProduct } from "@/models/WishedProduct";

interface ProductsPageProps {
  products: productSchemaType[];
  wishedProductIds: string[];
}

const ProductsPage = ({ products, wishedProductIds }: ProductsPageProps) => {
  return (
    <>
      <Header />
      <Center>
        <>
          <Title>All Products</Title>
          <ProductsGrid
            products={products}
            wishedProductIds={wishedProductIds}
          />
        </>
      </Center>
    </>
  );
};

export default ProductsPage;

export const getServerSideProps: GetServerSideProps<ProductsPageProps> = async (
  ctx
) => {
  await mongooseConnect();
  const products = await Product.find({}, null, { sort: { _id: -1 } });
  const sessionData = await getServerSession(ctx.req, ctx.res, authOptions);
  let wishedProductsIds: string[] = [];
  if (sessionData) {
    const { user } = sessionData;
    const wishedProducts = user
      ? await WishedProduct.find({
          userEmail: user?.email,
          product: products.map((prod) => prod._id.toString()),
        })
      : [];
    wishedProductsIds = wishedProducts.map((row) => row.product.toString());
  }
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      wishedProductIds: wishedProductsIds,
    },
  };
};
