import { Divider } from "@mui/material";
import { Fragment } from "react";

import { useScannedItems } from './ScannedItemsApiQueries';
import { BarcodeListItem } from "./BarcodeListItem";
import { ProductListItem } from '../Products/ProductListItem';
import InfiniteList from "../Helpers/InfiniteList";


function ScannedItemsListItem({ item, onSelect }) {
  const product = item.product;

  if (!product) {
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
    data,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  } = useScannedItems(disableKnownProducts);

  const scannedItemsData = data?.pages.flatMap((page) => page.results) || [];

  return (
    <InfiniteList onMore={fetchNextPage} hasMore={hasNextPage}
      isLoading={isFetching || isFetchingNextPage}
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
