/**
 * Mini wrapper key-value sobre IndexedDB (solo navegador).
 * IndexedDB guarda Blobs/Files tal cual, ideal para cachear audios.
 */
const DB_NAME = "soundboard";
const STORE = "kv";

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  dbPromise ??= new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => {
      dbPromise = null;
      reject(req.error);
    };
  });
  return dbPromise;
}

async function run<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>) {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = fn(tx.objectStore(STORE));
    tx.oncomplete = () => resolve(req.result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export const idb = {
  get: <T>(key: string) => run<T | undefined>("readonly", (s) => s.get(key)),
  set: (key: string, value: unknown) => run("readwrite", (s) => s.put(value, key)).then(() => undefined),
  del: (key: string) => run("readwrite", (s) => s.delete(key)).then(() => undefined),
};
