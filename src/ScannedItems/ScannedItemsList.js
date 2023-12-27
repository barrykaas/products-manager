import { Box, Button, CircularProgress, Divider, List, Stack } from "@mui/material";
import { Fragment, useState } from "react";

import { useScannedItems } from './ScannedItemsApiQueries';
import { BarcodeListItem } from "./BarcodeListItem";
import { ProductListItem } from '../Products/ProductListItem';


function ScannedItemsListItem({ item, onSelect }) {
  const product = item.product;

  if (!product) {
    return (
      <BarcodeListItem barcode={item.barcode} onSelect={onSelect} />
    );
  }

  return (
    <ProductListItem product={product} showBarcode />
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

  const scannedItemsData = data ? data.pages.flatMap((page) => page.results) : [];

  return (
    <Stack sx={{ display: 'flex', height: '100%' }}>
      <List sx={{ p: 0, width: 1, bgcolor: 'background.paper' }}>
        {scannedItemsData.map((item) => (
          <Fragment key={item.id}>
            <ScannedItemsListItem item={item} onSelect={() => selectBarcode(item)} />
            <Divider component="li" />
          </Fragment>
        ))}
      </List>
      {
        isFetchingNextPage || isFetching
          ? <CircularProgress />
          : (<Button
            disabled={!hasNextPage || isFetchingNextPage}
            onClick={() => fetchNextPage()}
            >Meer laden</Button>)
      }
    </Stack>
  );
};
