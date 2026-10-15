export interface Positioned {
  id: string;
  position: number;
}

/** Geser satu item ke atas/bawah, lalu kembalikan hanya baris yang posisinya berubah. */
export function reorder(items: Positioned[], id: string, direction: 'up' | 'down'): Positioned[] {
  const list = [...items];
  const from = list.findIndex((item) => item.id === id);
  const to = direction === 'up' ? from - 1 : from + 1;
  if (from === -1 || to < 0 || to >= list.length) return [];

  [list[from], list[to]] = [list[to], list[from]];

  // Nomori ulang 1..n supaya aman walau ada posisi ganda atau lubang
  const before = new Map(items.map((item) => [item.id, item.position]));
  return list
    .map((item, index) => ({ id: item.id, position: index + 1 }))
    .filter((item) => before.get(item.id) !== item.position);
}
