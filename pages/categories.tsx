import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductBox from "@/components/ProductBox";
import Title from "@/components/Title";
import { Category, categorySchemaType } from "@/models/category";
import { Product } from "@/models/product";
import { categoryProductsType } from "@/types";
import { GetServerSideProps, GetStaticProps } from "next";
import { getServerSession } from "next-auth";
import { RevealWrapper } from "next-reveal";
import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { authOptions } from "./api/auth/[...nextauth]";
import { WishedProduct } from "@/models/WishedProduct";
import { mongooseConnect } from "@/lib/mongoose";
import { ObjectId } from "mongodb";

interface CategoriesPageProps {
  // categories: categorySchemaType[];
  mainCategories: categorySchemaType[];
  categoryProducts: categoryProductsType;
  wishedProductsIds: string[];
}

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

const CategoryWrapper = styled.div`
  margin-bottom: 40px;
`;

const CategoryTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 30px;
  a {
    /* text-decoration: none; */
    color: #555;
    cursor: pointer;
  }
`;

const ShowAllSquare = styled(Link)`
  background-color: #ddd;
  height: 160px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  text-decoration: none;
`;

const CategoriesPage = ({
  mainCategories,
  categoryProducts,
  wishedProductsIds,
}: CategoriesPageProps) => {
  return (
    <>
      <Header />
      <Center>
        <>
          <Title>All Categories</Title>
          {mainCategories.map((cat, i) => (
            <CategoryWrapper key={i}>
              <CategoryTitle>
                <h2>{cat.name}</h2>
                <div>
                  <Link href={"/category/" + cat._id}>Show All</Link>
                </div>
              </CategoryTitle>
              <CategoryGrid>
                {categoryProducts[cat._id as unknown as string].map(
                  (catProd, i) => {
                    let wished = false;
                    if (
                      wishedProductsIds.includes(
                        catProd._id?.toString() || "random"
                      )
                    )
                      wished = true;
                    return (
                      <RevealWrapper delay={100 * i} key={i}>
                        <ProductBox product={catProd} wished={wished} />
                      </RevealWrapper>
                    );
                  }
                )}
                <RevealWrapper
                  delay={
                    100 * categoryProducts[cat._id as unknown as string].length
                  }
                >
                  <ShowAllSquare href={"/category/" + cat._id}>
                    Checkout more &rarr;
                  </ShowAllSquare>
                </RevealWrapper>
              </CategoryGrid>
            </CategoryWrapper>
          ))}
        </>
      </Center>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  CategoriesPageProps
> = async (ctx) => {
  await mongooseConnect();
  const categories: categorySchemaType[] = await Category.find().populate(
    "parentCategory"
  );

  const mainCategories = categories.filter((cat) => !cat.parentCategory);

  const categoryProducts: categoryProductsType = {};

  for (const mainCat of mainCategories) {
    const mainCatId = mainCat._id?.toString();

    const childCatIds = categories
      .filter((cat) => cat.parentCategory?._id?.toString() === mainCatId)
      .map((cat) => cat._id);

    const allCatIds = [mainCatId, ...childCatIds];

    const products = await Product.find({ category: allCatIds }, null, {
      limit: 3,
      sort: { _id: -1 },
    });
    categoryProducts[mainCatId as unknown as string] = JSON.parse(
      JSON.stringify(products)
    );
  }
  const sessionData = await getServerSession(ctx.req, ctx.res, authOptions);
  let wishedProductsIds: string[] = [];
  let productIdsToFind: ObjectId[] = [];
  Object.values(categoryProducts).forEach((prods) => {
    productIdsToFind.push(...prods.map((prod) => prod._id as ObjectId));
  });
  if (sessionData) {
    const { user } = sessionData;
    const wishedProducts = user
      ? await WishedProduct.find({
          userEmail: user?.email,
          product: productIdsToFind,
        })
      : [];
    wishedProductsIds = wishedProducts.map((row) => row.product.toString());
  }

  return {
    props: {
      // categories,
      mainCategories: JSON.parse(JSON.stringify(mainCategories)),
      categoryProducts,
      wishedProductsIds,
    },
  };
};

export default CategoriesPage;
