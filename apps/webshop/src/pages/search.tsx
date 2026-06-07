import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { groupBy } from '../utils/groupBy';
import ProductCard from '../components/ProductCard';
import styles from './search.module.css';

export default function SearchPage() {
  const router = useRouter();
  const searchQuery = typeof router.query.q === 'string' ? router.query.q : '';
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

    const controller = new AbortController();

    setIsLoading(true);

    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        query: `
          query SearchProducts($q: String!) {
            searchProducts(query: $q) {
              id
              name
              price
              imageUrl
              category
              description
              stock
              createdAt
            }
          }
        `,
        variables: { q: searchQuery },
      }),
    })
      .then(res => res.json())
      .then(data => {
        setResults(data.data?.searchProducts ?? []);
      })
      .catch(error => {
        if (error?.name !== 'AbortError') {
          setResults([]);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [router.isReady, searchQuery]);

  const grouped = groupBy(results, 'category');

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.heading}>
          {searchQuery ? `Results for "${searchQuery}"` : 'All products'}
        </h1>

        {isLoading && <p>Loading...</p>}

        {!isLoading && !results.length && (
          <p className={styles.empty}>No products found.</p>
        )}

        {Object.keys(grouped).map(category => (
          <section key={category} className={styles.category}>
            <h2 className={styles.categoryTitle}>{category}</h2>
            <div className={styles.grid}>
              {grouped[category].map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
