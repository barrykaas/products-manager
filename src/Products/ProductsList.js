import { Divider } from "@mui/material";
import React from "react";

import { useProducts } from './ProductsApiQueries';
import { ProductListItem } from "./ProductListItem";
import InfiniteList from "../Helpers/InfiniteList";


export default function ProductsList({ handleEdit, handleSelectedProduct, searchQuery }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isError,
    error,
  } = useProducts(searchQuery);

  const productsData = data?.pages.flatMap((page) => page.results) || [];


  return (
    <InfiniteList onMore={fetchNextPage} hasMore={hasNextPage}
      isLoading={isFetching || isFetchingNextPage}
      error={isError ? error : null}
    >
      {productsData.map((item) => (
        <React.Fragment key={item.id}>
          <ProductListItem
            product={item}
            onEdit={() => handleEdit(item)}
            onSelect={() => handleSelectedProduct(item)}
          />
          <Divider component="li" />
        </React.Fragment>
      ))}
    </InfiniteList>
  );
};