import { Divider } from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";

import { fetchProductsAndSearchFn } from './ProductsApiQueries';
import { ProductListItem } from "./ProductListItem";
import InfiniteList from "../Helpers/InfiniteList";


export default function ProductsList({ handleEdit, handleSelectedProduct, searchQuery }) {
  const {
    isError,
    error,
    data,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  } = useInfiniteQuery({
    queryKey: ['products', searchQuery],
    queryFn: ({ pageParam = 0 }) => fetchProductsAndSearchFn(pageParam, searchQuery),
    getNextPageParam: (lastPage, pages) => lastPage['next'],

  });

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