import { useEffect, useState } from 'react';

const CAT_KEY = 'app_categories';
const PROD_KEY = 'app_products';

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event('store-change'));
};

// --- Сиды ---
if (!localStorage.getItem(CAT_KEY)) {
  write(CAT_KEY, [
    { id: 1, name: 'Электроника' },
    { id: 2, name: 'Книги' },
    { id: 3, name: 'Одежда' },
    { id: 4, name: 'Продукты' },
    { id: 5, name: 'Спорт' },
  ]);
}

if (!localStorage.getItem(PROD_KEY)) {
  write(PROD_KEY, [
    // Электроника (categoryId: 1)
    { id: 1, name: 'Ноутбук Lenovo IdeaPad', description: '16 ГБ ОЗУ, SSD 512 ГБ, 15.6"', price: 74990, categoryId: 1 },
    { id: 2, name: 'Смартфон Xiaomi Redmi', description: '6.5", 128 ГБ, 5000 мАч', price: 19990, categoryId: 1 },
    { id: 3, name: 'Наушники Sony WH-1000', description: 'Беспроводные, шумоподавление', price: 27990, categoryId: 1 },
    { id: 4, name: 'Клавиатура Logitech', description: 'Механическая, RGB-подсветка', price: 5990, categoryId: 1 },
    { id: 5, name: 'Монитор Samsung 27"', description: 'IPS, 144 Гц, 2K', price: 24990, categoryId: 1 },
    { id: 6, name: 'Powerbank Anker 20000', description: 'Быстрая зарядка 65 Вт', price: 3990, categoryId: 1 },

    // Книги (categoryId: 2)
    { id: 7, name: 'Мастер и Маргарита', description: 'Булгаков, классика', price: 720, categoryId: 2 },
    { id: 8, name: '1984', description: 'Оруэлл, антиутопия', price: 650, categoryId: 2 },
    { id: 9, name: 'Преступление и наказание', description: 'Достоевский', price: 850, categoryId: 2 },
    { id: 10, name: 'Три товарища', description: 'Ремарк', price: 690, categoryId: 2 },
    { id: 11, name: 'Дюна', description: 'Фрэнк Герберт, фантастика', price: 1100, categoryId: 2 },

    // Одежда (categoryId: 3)
    { id: 12, name: 'Футболка белая', description: 'Хлопок 100%, размеры S–XXL', price: 990, categoryId: 3 },
    { id: 13, name: "Джинсы Levi's 501", description: 'Классический крой, синие', price: 6990, categoryId: 3 },
    { id: 14, name: 'Куртка зимняя', description: 'Утеплитель, до −25 °C', price: 12990, categoryId: 3 },
    { id: 15, name: 'Кроссовки Nike Air', description: 'Беговые, амортизация', price: 8990, categoryId: 3 },
    { id: 16, name: 'Шапка вязаная', description: 'Шерсть, серый цвет', price: 1290, categoryId: 3 },

    // Продукты (categoryId: 4)
    { id: 17, name: 'Кофе зерновой Arabica', description: '1 кг, средняя обжарка', price: 1890, categoryId: 4 },
    { id: 18, name: 'Чай зелёный Sencha', description: '100 г, листовой', price: 590, categoryId: 4 },
    { id: 19, name: 'Шоколад тёмный 85%', description: '100 г, без сахара', price: 250, categoryId: 4 },
    { id: 20, name: 'Оливковое масло Extra Virgin', description: '500 мл, Греция', price: 990, categoryId: 4 },
    { id: 21, name: 'Мёд липовый', description: '500 г, натуральный', price: 690, categoryId: 4 },

    // Спорт (categoryId: 5)
    { id: 22, name: 'Гантели 2×5 кг', description: 'Обрезиненные, хромированный гриф', price: 2490, categoryId: 5 },
    { id: 23, name: 'Коврик для йоги', description: '6 мм, нескользящий', price: 1490, categoryId: 5 },
    { id: 24, name: 'Скакалка про', description: 'Счётчик прыжков, стальной трос', price: 890, categoryId: 5 },
    { id: 25, name: 'Велосипед горный', description: '21 скорость, 27.5"', price: 34990, categoryId: 5 },
  ]);
}

const nextId = (arr) => (arr.length ? Math.max(...arr.map(i => i.id)) + 1 : 1);

// === Categories ===
export const getCategories = () => read(CAT_KEY, []);
export const getCategory = (id) => getCategories().find(c => c.id === Number(id));

export const createCategory = (data) => {
  const list = getCategories();
  const item = { id: nextId(list), ...data };
  write(CAT_KEY, [...list, item]);
  return item;
};

export const updateCategory = (id, data) => {
  const list = getCategories().map(c => (c.id === Number(id) ? { ...c, ...data } : c));
  write(CAT_KEY, list);
};

export const deleteCategory = (id) => {
  const list = getCategories().filter(c => c.id !== Number(id));
  write(CAT_KEY, list);
  const prods = getProducts().filter(p => p.categoryId !== Number(id));
  write(PROD_KEY, prods);
};

// === Products ===
export const getProducts = () => read(PROD_KEY, []);
export const getProduct = (id) => getProducts().find(p => p.id === Number(id));
export const getProductsByCategory = (categoryId) =>
  getProducts().filter(p => p.categoryId === Number(categoryId));

export const createProduct = (data) => {
  const list = getProducts();
  const item = { id: nextId(list), ...data };
  write(PROD_KEY, [...list, item]);
  return item;
};

export const updateProduct = (id, data) => {
  const list = getProducts().map(p => (p.id === Number(id) ? { ...p, ...data } : p));
  write(PROD_KEY, list);
};

export const deleteProduct = (id) => {
  write(PROD_KEY, getProducts().filter(p => p.id !== Number(id)));
};

// === React hook для подписки на изменения ===
export function useStore(selector) {
  const [value, setValue] = useState(() => selector());
  useEffect(() => {
    const handler = () => setValue(selector());
    window.addEventListener('store-change', handler);
    return () => window.removeEventListener('store-change', handler);
  }, [selector]);
  return value;
}