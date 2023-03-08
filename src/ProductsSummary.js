import React from 'react';
import { Typography, Card, CardContent } from '@mui/material';

const ProductCard = ({ product }) => {
  const { name, unit_number, unit_weightvol, unit_price, date_added, barcode } = product;

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          {name}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          Barcode: {barcode}
        </Typography>
        <Typography variant="body2" component="p">
          Unit number: {unit_number}
        </Typography>
        <Typography variant="body2" component="p">
          Unit weight/volume: {unit_weightvol}
        </Typography>
        <Typography variant="body2" component="p">
          Unit price: {unit_price}
        </Typography>
        <Typography color="textSecondary" variant="caption" display="block" gutterBottom>
          Added: {new Date(date_added).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProductCard;