import { openDB } from 'idb';

const DB_NAME = 'SahayakDB';
const DB_VERSION = 2; // bumped to force store recreation
const STORE_NAME = 'pendingScores';

export async function initDB() {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // Drop old store if it exists (schema fix)
            if (db.objectStoreNames.contains(STORE_NAME)) {
                db.deleteObjectStore(STORE_NAME);
            }
            // Out-of-line keys with autoIncrement — no keyPath needed on stored objects
            db.createObjectStore(STORE_NAME, { autoIncrement: true });
        },
    });
}

export async function saveScoreOffline(scoreData) {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await store.add(scoreData);
    await tx.done;
    console.log('Saved score offline:', scoreData);
}

export async function getPendingScores() {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    return await store.getAll();
}

export async function clearPendingScores() {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await store.clear();
    await tx.done;
}
