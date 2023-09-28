import Center from "@/components/Center";
import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import { Category, categorySchemaType } from "@/models/category";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { mongooseConnect } from "@/lib/mongoose";
import { Product, productSchemaType } from "@/models/product";
import ProductsGrid from "@/components/ProductsGrid";
import styled from "styled-components";
import { filterValuesTypes } from "@/types";
import axios from "axios";
import Spinner from "@/components/Spinner";

interface CategoryPageProps {
  category: categorySchemaType;
  subCategories: categorySchemaType[];
  products: productSchemaType[];
}

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h2 {
    font-size: 1.5em;
  }
`;

const FiltersWrapper = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const Filter = styled.div`
  background-color: #ddd;
  padding: 5px 10px;
  border-radius: 5px;
  display: flex;
  gap: 5px;
  select {
    background-color: transparent;
    border: 0;
    font-size: inherit;
    color: #444;
  }
`;

const CategoryPage = ({
  category,
  subCategories,
  products: originalProducts,
}: CategoryPageProps) => {
  const initalFilterValues: filterValuesTypes = {};
  category.properties.forEach((prop) => {
    initalFilterValues[prop.name] = "all";
  });
  initalFilterValues["sort"] = "_id-desc";

  const [products, setProducts] = useState(originalProducts);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [filterValues, setFilterValues] = useState(initalFilterValues);

  const updateFilterValue = (filterName: string, filterValue: string) => {
    setFilterValues({
      ...filterValues,
      [filterName]: filterValue,
    });
  };

  useEffect(() => {
    const catIds = [
      ...(subCategories || []).map((cat) => cat._id),
      category._id,
    ];

    const url = "/api/product?";
    const params = new URLSearchParams();
    params.set("categoryIds", catIds?.join(","));
    Object.entries(filterValues).map(([name, value]) => {
      if (value !== "all") params.set(name, value);
    });
    setLoadingProducts(true);
    axios
      .get(url, { params })
      .then((res) => setProducts(res.data))
      .finally(() => setLoadingProducts(false));
  }, [filterValues]);

  return (
    <>
      <Header />
      <Center>
        <>
          <CategoryHeader>
            <h2>{category.name}</h2>
            <FiltersWrapper>
              {category.properties.map((prop, i) => (
                <Filter key={i}>
                  <span>{prop.name}:</span>
                  <select
                    value={filterValues[prop.name]}
                    onChange={(e) =>
                      updateFilterValue(prop.name, e.target.value)
                    }
                  >
                    <option value="all">All</option>
                    {(prop.values as string[]).map((val, i) => (
                      <option key={i} value={val}>
                        {val}
                      </option>
                    ))}
                  </select>
                </Filter>
              ))}
              <Filter>
                <span>Sort:</span>
                <select
                  value={filterValues["sort"]}
                  onChange={(e) => updateFilterValue("sort", e.target.value)}
                >
                  <option value="_id-desc">Newest first</option>
                  <option value="_id-asc">Oldest first</option>
                  <option value="price-asc">Price, low to high</option>
                  <option value="price-desc">Price, high to low</option>
                </select>
              </Filter>
            </FiltersWrapper>
          </CategoryHeader>
          {!loadingProducts ? (
            <>
              {products.length !== 0 ? (
                <ProductsGrid products={products} wishedProductIds={[]} />
              ) : (
                <div>Sorry, No Products found!</div>
              )}
            </>
          ) : (
            <Spinner />
          )}
        </>
      </Center>
    </>
  );
};

export default CategoryPage;

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};

export const getStaticProps: GetStaticProps<CategoryPageProps> = async ({
  params,
}) => {
  await mongooseConnect();

  const category = await Category.findById(params?.id);
  const subCats = await Category.find({ parentCategory: category._id });
  const catIds = [...(subCats || []).map((cat) => cat._id), category._id];

  const products = await Product.find({ category: catIds });
  return {
    props: {
      category: JSON.parse(JSON.stringify(category)),
      subCategories: JSON.parse(JSON.stringify(subCats)),
      products: JSON.parse(JSON.stringify(products)),
    },
  };
};
