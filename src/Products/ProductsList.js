import { Divider } from "@mui/material";
import React from "react";
import { useSearchParams } from "react-router-dom";

import { useProducts } from './ProductsApiQueries';
import { ProductListItem } from "./ProductListItem";
import InfiniteList from "../Helpers/InfiniteList";
import { removeEmpty } from "../Helpers/objects";


export default function ProductsList({ handleEdit, handleSelectedProduct, searchQuery }) {
  const [searchParams] = useSearchParams();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isError,
    error,
  } = useProducts({
    params: {
      search: searchQuery,
      ...searchParamsToApi(searchParams)
    }
  });

  const productsData = (data?.pages || []).flatMap((page) => page.results);

  return (
    <InfiniteList onMore={fetchNextPage} hasMore={hasNextPage}
      isLoading={isFetching || isFetchingNextPage}
      error={isError ? error : null}
    >
      {productsData.map((item) => (
        <React.Fragment key={item.id}>
          <ProductListItem
            product={item}
            onEdit={handleSelectedProduct && (() => handleEdit(item))}
            onSelect={handleSelectedProduct ? (
              () => handleSelectedProduct(item)
            ) : (
              () => handleEdit(item)
            )}
          />
          <Divider component="li" />
        </React.Fragment>
      ))}
    </InfiniteList>
  );
};

function searchParamsToApi(params) {
  const apiParams = {
    ordering: params.get('ordering'),
    market: params.get('market'),

    date_added__lte: params.get('created_before'),
    date_added__gte: params.get('created_after'),
  };

  return removeEmpty(apiParams);
}
