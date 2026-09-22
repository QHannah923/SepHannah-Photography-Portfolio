const catalog = require("./catalog");
const KEY = "studioPhotoSelection";
const MAX = 6;
function clean(ids) {
  return Array.isArray(ids)
    ? [...new Set(ids)]
        .filter((id) => catalog.photos.some((p) => p.id === id))
        .slice(0, MAX)
    : [];
}
function read() {
  try {
    return clean(wx.getStorageSync(KEY));
  } catch {
    return [];
  }
}
function write(ids) {
  const selected = clean(ids);
  wx.setStorageSync(KEY, selected);
  return selected;
}
function describe(ids) {
  return clean(ids).map((id) => {
    const p = catalog.photos.find((photo) => photo.id === id);
    const c = catalog.collections.find((item) => item.slug === p.collection);
    return { ...p, label: `${c ? c.zh : "作品"} · ${id}` };
  });
}
function message(text, ids) {
  const selected = describe(ids);
  return [
    text.trim(),
    selected.length
      ? "参考作品（客户选择）：\n" +
        selected.map((p) => `${p.label}\n${p.src}`).join("\n")
      : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}
module.exports = { MAX, clean, read, write, describe, message };
