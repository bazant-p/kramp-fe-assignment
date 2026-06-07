import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ProductCard.module.css';

const ProductCard: React.FC<any> = ({ product, onAddToCart }) => {
  const imageSrc = product.imageUrl.endsWith('.png')
    ? product.imageUrl
    : `${product.imageUrl}.png`;

  return (
    <div
      className={styles.card}
      data-testid="product-card"
    >
      <Image
        src={imageSrc}
        alt={product.name}
        width={300}
        height={200}
        className={styles.image}
      />
      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.price} data-testid="product-price">€{product.price.toFixed(2)}</p>
        <Link href={`/product/${product.id}`} className={styles.button}>
          View product
        </Link>
      </div>
    </div>
  );
};

(ProductCard as any).defaultProps = {
  onAddToCart: () => {},
};

export default ProductCard;
