import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ProductsGrid from "@/components/ProductsGrid";
import { productSchemaType } from "@/models/product";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import { debounce } from "lodash";
import Spinner from "@/components/Spinner";

const SearchInput = styled(Input)`
  border-radius: 0;
  font-size: 1.4rem;
`;

const SearchInputWrapper = styled.div`
  padding: 20px 10px;
  position: sticky;
  top: 75px;
  margin: 20px 0 30px;
  z-index: 15;
  background-color: #eee;
`;

const SearchPage = () => {
  const [phrase, setPhrase] = useState("");
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const [products, setProducts] = useState<productSchemaType[]>([]);

  useEffect(() => {
    if (phrase.length > 0) {
      setIsFetchingProducts(true);
      debouncedSearch(phrase);
    } else setProducts([]);
  }, [phrase]);

  const searchProducts = (phrase: string) => {
    axios
      .get("/api/product?phrase=" + encodeURI(phrase))
      .then((res) => setProducts(res.data))
      .finally(() => setIsFetchingProducts(false));
  };

  const debouncedSearch = useCallback(debounce(searchProducts, 500), []);

  return (
    <>
      <Header />
      <Center>
        <>
          <SearchInputWrapper>
            <SearchInput
              autoFocus
              placeholder="Search for products..."
              onChange={(e) => setPhrase(e.target.value)}
              value={phrase}
            />
          </SearchInputWrapper>
          {!isFetchingProducts ? (
            <>
              {phrase !== "" && !products.length && (
                <h2>No Products for query: &quot;{phrase}&quot;</h2>
              )}
              <ProductsGrid products={products} wishedProductIds={[]} />
            </>
          ) : (
            <Spinner />
          )}
        </>
      </Center>
    </>
  );
};

export default SearchPage;
