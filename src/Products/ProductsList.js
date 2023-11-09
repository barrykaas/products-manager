import { Button, CircularProgress, Divider, IconButton, List, ListItem, ListItemButton, ListItemText, Skeleton, Typography } from "@mui/material";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";

import { fetchProducts, fetchProductsAndSearchFn } from './ProductsApiQueries';

import EditIcon from '@mui/icons-material/Edit';
import { getBrandsFn } from "../ShoppingLists/ShoppingListApiQueries";
import useHumanReadableProduct from "./HumanReadableProduct";


// replace `getPersonsFn` with a function that fetches product data
// function getProductsFn() {
//   return fetch('/api/products').then((res) => res.json());
// }

function ProductsListItem({ item, handleEdit, handleSelectedProduct }) {
  const { isLoading, isError, data, error } = useQuery({ queryKey: ['brands'], queryFn: getBrandsFn })
//   const { isLoading, isError, data, error } = useQuery({
//     queryKey: ['products'],
//     queryFn: getProductsFn,
//   });

//   function getDate() {
//     const date = new Date(item.date_added);
//     const formattedDate = date.toLocaleDateString();
//     return formattedDate;
//   }
  //console.log(item);

  const {isLoadingHuman, isErrorHuman, formatProductDescription, errorHuman} = useHumanReadableProduct()

  if (isLoading || isError || isLoadingHuman || isErrorHuman) {
    return <Skeleton />;
  }

  const filteredBrand = data.data.filter(brand_item => item.brand === brand_item.id);
  const brand = filteredBrand.length > 0 ? filteredBrand[0].name : null;

  //const productBrand = data.find((product) => product.id === item.brand_id)?.brand_name || '';
  return (
    <ListItem alignItems="flex-start" secondaryAction={
      <IconButton aria-label="comment" onClick={() => handleEdit(item)}>
        <EditIcon />
      </IconButton>
    } disablePadding>
      <ListItemButton onClick={handleSelectedProduct}>
        <ListItemText
          primary={item.name}
          secondary={
            <>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {brand ? brand : 'merkloos'}
                
              </Typography>
              {` - €${item.unit_price.toFixed(2)} - `}
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {formatProductDescription(item)}
                
              </Typography>
            </>
          }
        />
      </ListItemButton>
    </ListItem>
  );
}

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
    queryFn: ({pageParam = 0}) => fetchProductsAndSearchFn(pageParam, searchQuery),
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
            <ProductsListItem item={item} handleEdit={handleEdit} handleSelectedProduct={() => handleSelectedProduct(item)} />
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
      <Button disabled={!hasNextPage || isFetchingNextPage} onClick={() => fetchNextPage()}>Load more</Button>
    </>
  );
};