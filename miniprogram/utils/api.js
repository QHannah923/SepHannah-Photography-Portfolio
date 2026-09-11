// Public URL only. Database keys and mail credentials must never be included here.
const BASE_URL = "https://sep-hannah-photography-portfolio-qt.vercel.app";
function request(path, method = "GET", data) {
  return new Promise((resolve, reject) =>
    wx.request({
      url: BASE_URL + path,
      method,
      data,
      timeout: 30000,
      header: { "content-type": "application/json" },
      success: (r) => {
        if (
          r.statusCode >= 200 &&
          r.statusCode < 300 &&
          r.data &&
          typeof r.data === "object"
        )
          resolve(r.data);
        else
          reject(
            new Error(
              (r.data && r.data.error) ||
                "服务暂时不可用，请稍后重试或联系 Hannah。",
            ),
          );
      },
      fail: () =>
        reject(
          new Error(
            "网络连接失败。请保留询单内容后重试，或通过微信联系 Hannah。",
          ),
        ),
    }),
  );
}
function monthKey() {
  return new Date(Date.now() + 10 * 3600000).toISOString().slice(0, 7);
}
function timeLabel(iso) {
  const d = new Date(Date.parse(iso) + 10 * 3600000);
  return d.toISOString().slice(0, 16).replace("T", " ");
}
function uuid() {
  return new Promise((resolve, reject) => {
    const unavailable = () => reject(new Error("无法生成安全询单编号，请更新微信后重试。"));
    if (typeof wx.getRandomValues !== "function") return unavailable();
    wx.getRandomValues({
      length: 16,
      success: ({ randomValues }) => {
        const bytes = new Uint8Array(randomValues);
        if (bytes.length !== 16) return unavailable();
        bytes[6] = (bytes[6] & 15) | 64;
        bytes[8] = (bytes[8] & 63) | 128;
        const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
        resolve(`${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`);
      },
      fail: unavailable,
    });
  });
}
function remember(token) {
  const list = wx.getStorageSync("studioRequests") || [];
  if (!list.some((x) => x.token === token))
    list.unshift({ token, savedAt: new Date().toISOString() });
  wx.setStorageSync("studioRequests", list.slice(0, 50));
}
module.exports = { request, BASE_URL, monthKey, timeLabel, uuid, remember };
