import { useParams, Link } from 'react-router-dom';
import { useFetch, getCategory, getProducts } from '../store/useStore';

export default function CategoryDetailPage() {
  const { id } = useParams();
  const { data: category, loading, error } = useFetch(() => getCategory(id), [id]);
  const { data: products } = useFetch(getProducts, []);

  if (loading) return <div className="card">Загрузка...</div>;
  if (error) return <div className="card error">Ошибка: {error}</div>;
  if (!category) return <div className="card">Категория не найдена</div>;

  const myProducts = products?.filter((p) => p.category === Number(id)) || [];

  return (
    <>
      <h1>{category.name}</h1>
      <div className="card">
        <p>Товаров в категории: <strong>{myProducts.length}</strong></p>
      </div>
      <h3>Товары</h3>
      <ul className="list">
        {myProducts.map((p) => (
          <li key={p.id}>
            <Link to={`/products/${p.id}`}>{p.name}</Link>
            <span className="spacer" />
            <span className="price">{p.price} ₽</span>
          </li>
        ))}
        {myProducts.length === 0 && <li>— пусто —</li>}
      </ul>
      <Link to="/categories" className="back-link">← Назад к категориям</Link>
    </>
  );
}