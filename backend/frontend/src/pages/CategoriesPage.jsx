import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useStore, getCategories,
  createCategory, updateCategory, deleteCategory,
} from '../store/useStore';

export default function CategoriesPage() {
  const categories = useStore(getCategories);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    createCategory({ name: name.trim() });
    setName('');
  };

  const saveEdit = (id) => {
    updateCategory(id, { name: editingName.trim() });
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Удалить категорию и все её товары?')) {
      deleteCategory(id);
    }
  };

  return (
    <>
      <h1>Категории</h1>

      <div className="card">
        <form onSubmit={handleCreate}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Название категории"
          />
          <button type="submit">Добавить</button>
        </form>
      </div>

      <ul className="list">
        {categories.map((cat) => (
          <li key={cat.id}>
            {editingId === cat.id ? (
              <>
                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                />
                <button onClick={() => saveEdit(cat.id)}>Сохранить</button>
                <button className="secondary" onClick={() => setEditingId(null)}>
                  Отмена
                </button>
              </>
            ) : (
              <>
                <Link to={`/categories/${cat.id}`}>{cat.name}</Link>
                <span className="spacer" />
                <button
                  className="icon"
                  onClick={() => { setEditingId(cat.id); setEditingName(cat.name); }}
                >
                  ✏️
                </button>
                <button className="icon" onClick={() => handleDelete(cat.id)}>
                  🗑️
                </button>
              </>
            )}
          </li>
        ))}
        {categories.length === 0 && <li>Пока пусто</li>}
      </ul>
    </>
  );
}