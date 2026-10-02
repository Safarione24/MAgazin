import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useStore, getProducts, getCategories,
  createProduct, updateProduct, deleteProduct,
} from '../store/useStore';

const empty = { name: '', description: '', price: '', categoryId: '' };

export default function ProductsPage() {
  const products = useStore(getProducts);
  const categories = useStore(getCategories);

  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const reset = () => {
    setForm(empty);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      categoryId: Number(form.categoryId),
    };
    if (!payload.name || !payload.categoryId) return;

    if (editingId) updateProduct(editingId, payload);
    else createProduct(payload);
    reset();
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description || '',
      price: p.price,
      categoryId: p.categoryId,
    });
  };

  const catName = (id) => categories.find((c) => c.id === id)?.name ?? '—';

  return (
    <>
      <h1>Товары</h1>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Название"
            required
          />
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Описание"
          />
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Цена"
            required
          />
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">— категория —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button type="submit">{editingId ? 'Сохранить' : 'Добавить'}</button>
          {editingId && (
            <button type="button" className="secondary" onClick={reset}>
              Отмена
            </button>
          )}
        </form>
      </div>

      <ul className="list">
        {products.map((p) => (
          <li key={p.id}>
            <Link to={`/products/${p.id}`}>{p.name}</Link>
            <span className="badge">{catName(p.categoryId)}</span>
            <span className="spacer" />
            <span className="price">{p.price} ₽</span>
            <button className="icon" onClick={() => startEdit(p)}>✏️</button>
            <button
              className="icon"
              onClick={() => window.confirm('Удалить?') && deleteProduct(p.id)}
            >
              🗑️
            </button>
          </li>
        ))}
        {products.length === 0 && <li>Пока пусто</li>}
      </ul>
    </>
  );
}