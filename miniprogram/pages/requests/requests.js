const api = require("../../utils/api");
const labels = {
  new: "已收到询单",
  quoted: "已提供报价",
  confirmed: "拍摄已确认",
  editing: "正在修片",
  completed: "已完成",
  cancelled: "已取消",
};
Page({
  data: { saved: [], input: "", error: "", loading: false },
  onShow() {
    this.load();
  },
  input(e) {
    this.setData({ input: e.detail.value.trim() });
  },
  async load() {
    const saved = wx.getStorageSync("studioRequests") || [];
    this.setData({ loading: true, error: "" });
    const results = await Promise.all(
      saved.map(async (item) => {
        try {
          const d = await api.request("/api/bookings/status", "POST", {
            token: item.token,
          });
          return {
            ...item,
            order: d.order,
            label: labels[d.order.status] || d.order.status,
            date: d.order.starts_at
              ? api.timeLabel(d.order.starts_at)
              : "时间待确认",
          };
        } catch (e) {
          return { ...item, error: e.message };
        }
      }),
    );
    this.setData({ saved: results, loading: false });
  },
  async add() {
    if (!/^[a-f0-9]{64}$/.test(this.data.input)) {
      this.setData({ error: "请输入完整的 64 位私人查询码。" });
      return;
    }
    this.setData({ loading: true, error: "" });
    try {
      await api.request("/api/bookings/status", "POST", {
        token: this.data.input,
      });
      api.remember(this.data.input);
      this.setData({ input: "" });
      await this.load();
    } catch (e) {
      this.setData({ error: e.message, loading: false });
    }
  },
  copy(e) {
    wx.setClipboardData({ data: e.currentTarget.dataset.token });
  },
  forget(e) {
    wx.showModal({
      title: "从这台设备移除？",
      content:
        "只移除本机保存的查询码，不会取消你的预约。请先复制查询码，日后可以重新添加。",
      success: (r) => {
        if (r.confirm) {
          const saved = (wx.getStorageSync("studioRequests") || []).filter(
            (x) => x.token !== e.currentTarget.dataset.token,
          );
          wx.setStorageSync("studioRequests", saved);
          this.load();
        }
      },
    });
  },
});
