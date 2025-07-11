import { Id } from '@/types/type';
import { useEffect, useState } from 'react';

export const useLocalStorage = <T extends { id: Id }>(key: string) => {
  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const data = localStorage.getItem(key);
    if (data) setItems(JSON.parse(data));
  }, [key]);

  const saveToStorage = (data: T[]) => {
    localStorage.setItem(key, JSON.stringify(data));
    setItems(data);
  };

  const create = (item: T) => {
    const updated = [...items, item];
    saveToStorage(updated);
  };

  const update = (id: Id, updatedItem: Partial<T>) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, ...updatedItem } : item
    );
    saveToStorage(updated);
  };

  const remove = (id: Id) => {
    const updated = items.filter((item) => item.id !== id);
    saveToStorage(updated);
  };

  const clear = () => {
    localStorage.removeItem(key);
    setItems([]);
  };

  // Enhanced setItems that also saves to localStorage
  const setItemsWithStorage = (updater: T[] | ((prev: T[]) => T[])) => {
    if (typeof updater === 'function') {
      const updated = updater(items);
      saveToStorage(updated);
    } else {
      saveToStorage(updater);
    }
  };

  return {
    items,
    create,
    update,
    remove,
    clear,
    setItems: setItemsWithStorage,
  };
};
