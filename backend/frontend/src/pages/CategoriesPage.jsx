import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useFetch, getCategories,
  createCategory, updateCategory, deleteCategory,
} from '../store/useStore';

export default function CategoriesPage() {
  const { data: categories, loading, error, refetch } = useFetch(getCategories, []);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createCategory({ name: name.trim() });
    setName('');
    refetch();
  };

  const saveEdit = async (id) => {
    await updateCategory(id, { name: editingName.trim() });
    setEditingId(null);
    refetch();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить категорию и все её товары?')) return;
    await deleteCategory(id);
    refetch();
  };

  if (loading) return <div className="card">Загрузка...</div>;
  if (error) return <div className="card error">Ошибка: {error}</div>;

  return (
    <>
      <h1>Категории</h1>

      <div className="card">
        <form onSubmit={handleCreate}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Название" />
          <button type="submit">Добавить</button>
        </form>
      </div>

      <ul className="list">
        {categories.map((cat) => (
          <li key={cat.id}>
            {editingId === cat.id ? (
              <>
                <input value={editingName} onChange={(e) => setEditingName(e.target.value)} />
                <button onClick={() => saveEdit(cat.id)}>Сохранить</button>
                <button className="secondary" onClick={() => setEditingId(null)}>Отмена</button>
              </>
            ) : (
              <>
                <Link to={`/categories/${cat.id}`}>{cat.name}</Link>
                <span className="spacer" />
                <button className="icon" onClick={() => { setEditingId(cat.id); setEditingName(cat.name); }}>✏️</button>
                <button className="icon" onClick={() => handleDelete(cat.id)}>🗑️</button>
              </>
            )}
          </li>
        ))}
        {categories.length === 0 && <li>Пока пусто</li>}
      </ul>
    </>
  );
}