import { Button, CircularProgress, Divider, List, Skeleton } from "@mui/material";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import React from "react";

import { fetchScannedItems, getBarcodeProduct } from './ScannedApiQueries';
import { ProductListItem, DrawProductListItem } from '../Helpers/ProductListItem';


function ScannedItemsListItem({ item, selectBarcode }) {
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
      <DrawProductListItem name={item.barcode} />
    );
  }

  return (
    <ProductListItem product={product} />
  );
}


export default function ScannedItemsList({selectBarcode}) {
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
  console.log(data.pages);

  return (
    <>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {scannedItemsData.map((item) => (
          <React.Fragment key={item.id}>
            <ScannedItemsListItem item={item} />
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
      <Button disabled={!hasNextPage || isFetchingNextPage} onClick={() => fetchNextPage()}>Load more</Button>
    </>
  );
};
