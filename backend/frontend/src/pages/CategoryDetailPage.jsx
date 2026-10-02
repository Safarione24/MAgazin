import { useParams, Link } from 'react-router-dom';
import { useStore, getCategory, getProductsByCategory } from '../store/useStore';

export default function CategoryDetailPage() {
  const { id } = useParams();
  const category = useStore(() => getCategory(id));
  const products = useStore(() => getProductsByCategory(id));

  if (!category) return <div className="card">Категория не найдена</div>;

  return (
    <>
      <h1>{category.name}</h1>

      <div className="card">
        <p>Товаров в категории: <strong>{products.length}</strong></p>
      </div>

      <h3>Товары</h3>
      <ul className="list">
        {products.map((p) => (
          <li key={p.id}>
            <Link to={`/products/${p.id}`}>{p.name}</Link>
            <span className="spacer" />
            <span className="price">{p.price} ₽</span>
          </li>
        ))}
        {products.length === 0 && <li>— пусто —</li>}
      </ul>

      <Link to="/categories" className="back-link">← Назад к категориям</Link>
    </>
  );
}