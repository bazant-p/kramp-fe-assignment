import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import { GRAPHQL_URL } from '../utils/fetchGraphQL';
import styles from './index.module.css';

export const getServerSideProps: GetServerSideProps = async () => {
  const FEATURED_IDS = ['1', '4', '11', '17'];
  let featured = [];

  try {
    const res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query GetProducts($ids: [ID!]!) {
            products(ids: $ids) {
              id
              name
              price
              imageUrl
              description
              category
              stock
              createdAt
            }
          }
        `,
        variables: { ids: FEATURED_IDS },
      }),
    });

    const data = await res.json();
    featured = data.data?.products ?? [];
  } catch (e) {
    featured = [];
  }

  return {
    props: {
      featured,
      timestamp: Date.now(),
    },
  };
};

interface HomePageProps {
  featured: any[];
  timestamp: number;
}

export default function HomePage({ featured, timestamp }: HomePageProps) {
  const heroImageSrc = 'https://placehold.co/1200x800/e63329/ffffff.png?text=Kramp+Webshop';

  return (
    <div>
      <section className={styles.hero}>
        <Image
          src={heroImageSrc}
          alt="Kramp — Your industrial supply partner"
          width={1200}
          height={800}
          priority
          className={styles.heroImage}
        />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Industrial supplies, delivered.</h1>
          <p className={styles.heroSubtitle}>
            Tools, fasteners, safety equipment and power tools for professionals.
          </p>
        </div>
      </section>

      <section className={styles.featured}>
        <div className={styles.featuredHeader}>
          <h2>Featured products</h2>
          <p className={styles.timestamp}>
            Last updated: {new Date(timestamp).toLocaleTimeString()}
          </p>
        </div>
        <div className={styles.grid}>
          {featured.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </section>

      <section className={styles.categories}>
        <h2>Shop by category</h2>
        <div className={styles.categoryGrid}>
          {['Tools', 'Fasteners', 'Safety Equipment', 'Power Tools'].map((cat, index) => (
            <Link key={index} href={`/search?q=${encodeURIComponent(cat)}`} className={styles.categoryCard}>
              {cat}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
