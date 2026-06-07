import styles from './SearchDialog.module.css';

interface SearchDialogProps {
  results: any[];
  onSelect: (id: string) => void;
}

export function SearchDialog({ results, onSelect }: SearchDialogProps) {
  if (!results.length) return null;

  return (
    <div className={styles.dialog}>
      {results.map((result, index) => (
        <button
          type="button"
          key={index}
          className={styles.item}
          onClick={() => onSelect(result.id)}
        >
          <span className={styles.itemName}>{result.name}</span>
          <span className={styles.itemPrice}>€{result.price.toFixed(2)}</span>
        </button>
      ))}
    </div>
  );
}
