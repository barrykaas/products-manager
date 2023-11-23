import { Button, CircularProgress, Divider, List, Skeleton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";

import { getBarcodeProduct, useScannedItems } from './queries';
import { BarcodeListItem } from "./BarcodeListItem";
import { ProductListItem } from '../Helpers/ProductListItem';


function ScannedItemsListItem({ item, onSelect, disableKnownProduct = false }) {
  const barcode = item.barcode;

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['barcode', barcode],
    queryFn: ({ queryKey }) => getBarcodeProduct(queryKey[1]),
  });

  if (isLoading || isError) {
    console.log("lookup barcode error", barcode, error);
    return <Skeleton />;
  }

  const matchingProducts = data.data.results;
  const product = matchingProducts.length > 0 ? matchingProducts[0] : null;


  if (!product) {
    return (
      <BarcodeListItem barcode={item.barcode} onSelect={onSelect} />
    );
  }

  return (
    <ProductListItem product={product} available={!disableKnownProduct} />
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

  if (isFetching) {
    return <CircularProgress />
  }

  const scannedItemsData = data.pages.flatMap((page) => page.results);

  let listItem;
  if (disableKnownProducts) {
    listItem = (item) => <BarcodeListItem
      barcode={item.barcode}
      onSelect={() => selectBarcode(item.barcode)}
    />;
  } else {
    listItem = (item) => <ScannedItemsListItem
      item={item}
      disableKnownProduct={disableKnownProducts}
      onSelect={() => selectBarcode(item.barcode)}
    />;
  }

  return (
    <>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {scannedItemsData.map((item) => (
          <React.Fragment key={item.id}>
            {listItem(item)}
            {/* <ScannedItemsListItem
              item={item}
              disableKnownProduct={disableKnownProducts}
              selectBarcode={() => selectBarcode(item.barcode)} /> */}
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
      <Button disabled={!hasNextPage || isFetchingNextPage} onClick={() => fetchNextPage()}>Load more</Button>
    </>
  );
};
