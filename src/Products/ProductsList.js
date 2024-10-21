import { Divider } from "@mui/material";
import { Fragment } from "react";

import { ProductListItem } from "./ProductListItem";
import InfiniteList from "../Helpers/InfiniteList";
import { apiLocations, usePaginatedQuery } from "../Api/Common";
import { searchParamsToObject } from "../Helpers/searchParams";


export default function ProductsList({ handleEdit, handleSelectedProduct, searchParams }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isError,
    error,
  } = usePaginatedQuery({
    queryKey: [apiLocations.products,
      searchParamsToObject(searchParams)
    ]
  });

  const productsData = (data?.pages || []).flatMap((page) => page.results);

  return (
    <InfiniteList onMore={fetchNextPage} hasMore={hasNextPage}
      isLoading={isFetching || isFetchingNextPage}
      error={isError ? error : null}
    >
      {productsData.map((item) => (
        <Fragment key={item.id}>
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
        </Fragment>
      ))}
    </InfiniteList>
  );
};
