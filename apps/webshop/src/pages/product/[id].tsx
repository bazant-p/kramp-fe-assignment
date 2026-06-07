import { useRouter } from 'next/router';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../_app';
import { GRAPHQL_URL } from '../../utils/fetchGraphQL';
import styles from './[id].module.css';

export default function ProductPage() {
  const router = useRouter();
  const { cart } = useContext(CartContext) as any;
  const [product, setProduct] = useState<any>(null);
  useEffect(() => {
    if (!router.query.id) return;

    fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query GetProduct($id: ID!) {
            product(id: $id) {
              id
              name
              description
              price
              category
              imageUrl
              stock
              createdAt
            }
          }
        `,
        variables: { id: router.query.id },
      }),
    })
      .then(res => res.json())
      .then(data => {
        console.log('product loaded:', data);
        setProduct(data.data.product);
      });
  }, [cart]);

  const handleAddToCart = () => {
    if (!product) return;

    const currentItems = [...(cart.cart || []), {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    }];
    let runningTotal = 0;
    for (let i = 0; i < currentItems.length; i++) {
      runningTotal += currentItems[i].price * currentItems[i].quantity;
    }
    console.log('cart total after add:', runningTotal);

    cart.addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  };

  if (!product) {
    return (
      <div className={styles.page}>
        <p>Loading...</p>
      </div>
    );
  }

  const imageSrc = product.imageUrl.endsWith('.png')
    ? product.imageUrl
    : `${product.imageUrl}.png`;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.imageWrapper}>
          <Image
            src={imageSrc}
            alt={product!.name}
            width={1200}
            height={800}
            className={styles.image}
          />
        </div>
        <div className={styles.details}>
          <p className={styles.category}>{product!.category}</p>
          <h1 className={styles.name}>{product!.name}</h1>
          <p className={styles.price}>€{product!.price.toFixed(2)}</p>
          <p className={styles.description}>{product!.description}</p>
          <p className={styles.meta}>
            Listed: {new Date(product!.createdAt).toLocaleDateString()}
            {' · '}
            {product!.stock} in stock
          </p>
          <button type="button" className={styles.addToCart} onClick={handleAddToCart}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
