import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  makeStyles
} from '@mui/material';


function ProductTable() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("https://django.producten.kaas/api/products/");
      const data = await response.json();
      setProducts(data);
    }

    fetchData();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Unit Number</TableCell>
            <TableCell>Unit Weight/Vol</TableCell>
            <TableCell>Unit Price</TableCell>
            <TableCell>Unit Type</TableCell>
            <TableCell>Date Added</TableCell>
            <TableCell>Brand</TableCell>
            <TableCell>Barcode</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Category</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.unit_number}</TableCell>
              <TableCell>{product.unit_weightvol}</TableCell>
              <TableCell>{product.unit_price}</TableCell>
              <TableCell>{product.unit_type}</TableCell>
              <TableCell>{product.date_added}</TableCell>
              <TableCell>{product.brand}</TableCell>
              <TableCell>{product.barcode}</TableCell>
              <TableCell>
                <img src={product.image} alt="product" />
              </TableCell>
              <TableCell>{product.category}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ProductTable;