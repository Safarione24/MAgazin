import { useParams, Link } from 'react-router-dom';
import { useFetch, getProduct } from '../store/useStore';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { data: product, loading, error } = useFetch(() => getProduct(id), [id]);

  if (loading) return <div className="card">Загрузка...</div>;
  if (error) return <div className="card error">Ошибка: {error}</div>;
  if (!product) return <div className="card">Товар не найден</div>;

  return (
    <>
      <h1>{product.name}</h1>
      <div className="card">
        <p style={{ marginBottom: 12 }}>{product.description || '— без описания —'}</p>
        <p style={{ marginBottom: 8 }}>
          <strong>Цена:</strong> <span className="price">{product.price} ₽</span>
        </p>
        <p>
          <strong>Категория:</strong>{' '}
          <Link to={`/categories/${product.category}`}>{product.category_name}</Link>
        </p>
      </div>
      <Link to="/products" className="back-link">← Назад к товарам</Link>
    </>
  );
}