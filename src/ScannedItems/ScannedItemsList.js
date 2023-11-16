import { Button, CircularProgress, Divider, List, Skeleton } from "@mui/material";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import React from "react";

import { fetchScannedItems, getBarcodeProduct } from './ScannedApiQueries';
import { BarcodeListItem } from "./BarcodeListItem";
import { ProductListItem } from '../Helpers/ProductListItem';


function ScannedItemsListItem({ item, selectBarcode, disableKnownProduct=false }) {
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
      <BarcodeListItem barcode={item.barcode} handleSelection={selectBarcode} />
    );
  }

  return (
    <ProductListItem product={product} available={!disableKnownProduct} />
  );
}


export default function ScannedItemsList({ selectBarcode, disableKnownProducts=false }) {
  const {
    data,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  } = useInfiniteQuery({
    queryKey: ['scanneditems'],
    queryFn: ({ pageParam = 1 }) => fetchScannedItems({ pageParam }),
    getNextPageParam: (lastPage, allPages) => lastPage.next,
  });

  if (isFetching) {
    return <CircularProgress />
  }

  const scannedItemsData = data.pages.flatMap((page) => page.results);

  return (
    <>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {scannedItemsData.map((item) => (
          <React.Fragment key={item.id}>
            <ScannedItemsListItem item={item} disableKnownProduct={disableKnownProducts} />
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
      <Button disabled={!hasNextPage || isFetchingNextPage} onClick={() => fetchNextPage()}>Load more</Button>
    </>
  );
};
