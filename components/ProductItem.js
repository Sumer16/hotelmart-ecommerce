import React from 'react';

import NextLink from 'next/link';

import { 
  Button, 
  Card, 
  CardActionArea, 
  CardActions, 
  CardContent, 
  CardMedia, 
  Typography 
} from '@mui/material';

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

import { urlForThumbnail } from '../utils/image';

export default function ProductItem({ product }) {
  return (
    <Card key={product._id}>
      <NextLink href={`/product/${product.slug.current}`} passHref>
        <CardActionArea>
          <CardMedia
            component="img"
            image={urlForThumbnail(product.image)}
            title={product.name}
          >
          </CardMedia>
          <CardContent>
            <Typography>{product.name}</Typography>
          </CardContent>
        </CardActionArea>
      </NextLink>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-around' }}>
        <Typography sx={{ fontSize: '1.2rem' }}>${product.price}</Typography>
        <Button size="small" color="primary">
          Add to Cart <AddShoppingCartIcon />
        </Button>
      </CardActions>
    </Card>
  )
}
