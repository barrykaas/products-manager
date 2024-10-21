import { Divider } from "@mui/material";
import { Fragment } from "react";

import { BarcodeListItem } from "./BarcodeListItem";
import { ProductListItem } from '../Products/ProductListItem';
import InfiniteList from "../Helpers/InfiniteList";
import { useQuery } from "@tanstack/react-query";
import { apiLocations, usePaginatedQuery } from "../Api/Common";


function ScannedItemsListItem({ item, onSelect }) {
  const productId = item.product;
  const productQuery = useQuery({
    queryKey: [apiLocations.products, productId],
    enabled: !!productId
  });
  const product = productQuery.data;

  if (productQuery.isLoading) {
    return (
      <BarcodeListItem barcode={item.barcode} onSelect={onSelect} />
    );
  }

  return (
    <ProductListItem product={product} showBarcode onSelect={onSelect} />
  );
}


export default function ScannedItemsList({ selectBarcode, disableKnownProducts = false }) {
  const {
    isError,
    error,
    data,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  } = usePaginatedQuery({
    queryKey: [apiLocations.scannedItems, {
      product_unknown: disableKnownProducts || undefined
    }]
  });

  const scannedItemsData = data?.pages.flatMap((page) => page.results) || [];

  return (
    <InfiniteList onMore={fetchNextPage} hasMore={hasNextPage}
      isLoading={isFetching || isFetchingNextPage}
      error={isError ? error : null}
    >
      {scannedItemsData.map((item) => (
        <Fragment key={item.id}>
          <ScannedItemsListItem item={item} onSelect={() => selectBarcode(item)} />
          <Divider component="li" />
        </Fragment>
      ))}
    </InfiniteList>
  );
};
