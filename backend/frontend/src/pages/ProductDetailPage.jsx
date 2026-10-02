import { useParams, Link } from 'react-router-dom';
import { useStore, getProduct, getCategory } from '../store/useStore';

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = useStore(() => getProduct(id));
  const category = useStore(() =>
    product ? getCategory(product.categoryId) : null
  );

  if (!product) return <div className="card">Товар не найден</div>;

  return (
    <>
      <h1>{product.name}</h1>

      <div className="card">
        <p style={{ marginBottom: 12 }}>
          {product.description || '— без описания —'}
        </p>
        <p style={{ marginBottom: 8 }}>
          <strong>Цена:</strong> <span className="price">{product.price} ₽</span>
        </p>
        <p>
          <strong>Категория:</strong>{' '}
          {category ? (
            <Link to={`/categories/${category.id}`}>{category.name}</Link>
          ) : '—'}
        </p>
      </div>

      <Link to="/products" className="back-link">← Назад к товарам</Link>
    </>
  );
}