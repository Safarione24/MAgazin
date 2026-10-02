import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useFetch, getProducts, getCategories,
  createProduct, updateProduct, deleteProduct,
} from '../store/useStore';

const empty = { name: '', description: '', price: '', category: '' };

export default function ProductsPage() {
  const { data: products, loading, error, refetch } = useFetch(getProducts, []);
  const { data: categories } = useFetch(getCategories, []);

  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const reset = () => { setForm(empty); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: form.price,
      category: Number(form.category),
    };
    if (!payload.name || !payload.category) return;

    if (editingId) await updateProduct(editingId, payload);
    else await createProduct(payload);
    reset();
    refetch();
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description || '',
      price: p.price,
      category: p.category,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить?')) return;
    await deleteProduct(id);
    refetch();
  };

  if (loading) return <div className="card">Загрузка...</div>;
  if (error) return <div className="card error">Ошибка: {error}</div>;

  return (
    <>
      <h1>Товары</h1>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Название" required />
          <input name="description" value={form.description} onChange={handleChange} placeholder="Описание" />
          <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} placeholder="Цена" required />
          <select name="category" value={form.category} onChange={handleChange} required>
            <option value="">— категория —</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button type="submit">{editingId ? 'Сохранить' : 'Добавить'}</button>
          {editingId && <button type="button" className="secondary" onClick={reset}>Отмена</button>}
        </form>
      </div>

      <ul className="list">
        {products.map((p) => (
          <li key={p.id}>
            <Link to={`/products/${p.id}`}>{p.name}</Link>
            <span className="badge">{p.category_name}</span>
            <span className="spacer" />
            <span className="price">{p.price} ₽</span>
            <button className="icon" onClick={() => startEdit(p)}>✏️</button>
            <button className="icon" onClick={() => handleDelete(p.id)}>🗑️</button>
          </li>
        ))}
        {products.length === 0 && <li>Пока пусто</li>}
      </ul>
    </>
  );
}