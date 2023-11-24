import { Button, CircularProgress, Divider, List } from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";

import { fetchProductsAndSearchFn } from './ProductsApiQueries';
import { ProductListItem } from "./ProductListItem";


export default function ProductsList({ handleEdit, handleSelectedProduct, searchQuery }) {
  console.log("searchQuery before useInfiniteQuery:", searchQuery);
  const {
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

  if (isFetching) {
    return <CircularProgress />
  }

  const productsData = data.pages.flatMap((page) => page.results);

  return (
    <>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
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
      </List>
      <Button disabled={!hasNextPage || isFetchingNextPage} onClick={() => fetchNextPage()}>Load more</Button>
    </>
  );
};