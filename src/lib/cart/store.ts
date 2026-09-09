import type { CartLine } from "@/lib/checkout/types";

/**
 * Cart state as an external store, consumed with `useSyncExternalStore`.
 *
 * localStorage genuinely IS an external system, so modelling it as one is both
 * the correct React pattern and simpler than reading it in an effect: there is
 * no setState-in-effect cascade, the server and first client render agree by
 * construction, and cross-tab sync falls out for free.
 *
 * Snapshots are cached and only replaced when the data actually changes, which
 * `useSyncExternalStore` requires (it compares snapshots by reference).
 */

const STORAGE_KEY = "rkms.cart.v1";

export type CartSnapshot = {
  lines: CartLine[];
  /** False until localStorage has been read, so the UI can hold a skeleton. */
  hydrated: boolean;
};

const EMPTY: CartSnapshot = { lines: [], hydrated: false };

let snapshot: CartSnapshot = EMPTY;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function setLines(lines: CartLine[]) {
  snapshot = { lines, hydrated: true };
  emit();
}

/** Blob preview URLs die on reload, so they are never persisted. */
function persist(lines: CartLine[]) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        lines.map((line) => ({
          ...line,
          photos: line.photos.map(
            ({ previewUrl: _previewUrl, ...photo }) => photo
          ),
        }))
      )
    );
  } catch {
    // Quota exceeded or storage blocked (private mode) - the cart still works
    // for this session, it just will not survive a reload.
  }
}

function read(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartLine[]) : [];
  } catch {
    return [];
  }
}

/* ---- useSyncExternalStore contract -------------------------------------- */

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  // Hydrate from storage on the first subscription.
  if (!snapshot.hydrated) setLines(read());

  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    setLines(read());
  };

  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function getSnapshot(): CartSnapshot {
  return snapshot;
}

/** The server has no cart. Returning a stable constant keeps SSR consistent. */
export function getServerSnapshot(): CartSnapshot {
  return EMPTY;
}

/* ---- Mutations ----------------------------------------------------------- */

function commit(lines: CartLine[]) {
  setLines(lines);
  persist(lines);
}

function revoke(line: CartLine) {
  line.photos.forEach((photo) => {
    if (photo.previewUrl) URL.revokeObjectURL(photo.previewUrl);
  });
}

export function addLine(line: CartLine) {
  commit([...snapshot.lines, line]);
}

export function removeLine(id: string) {
  const target = snapshot.lines.find((line) => line.id === id);
  if (target) revoke(target);
  commit(snapshot.lines.filter((line) => line.id !== id));
}

export function updateQuantity(
  id: string,
  quantity: number,
  quantityLabel: string
) {
  commit(
    snapshot.lines.map((line) =>
      line.id === id ? { ...line, quantity, quantityLabel } : line
    )
  );
}

export function clear() {
  snapshot.lines.forEach(revoke);
  commit([]);
}
