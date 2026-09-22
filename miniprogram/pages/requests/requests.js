const api = require("../../utils/api");
const catalog = require("../../utils/catalog");
const labels = {
  new: "已收到询单",
  quoted: "方案与报价",
  confirmed: "拍摄已确认",
  editing: "正在修片",
  completed: "已完成",
  cancelled: "已取消",
};
const steps = [
  { id: "new", label: "询单" },
  { id: "quoted", label: "报价" },
  { id: "confirmed", label: "拍摄" },
  { id: "editing", label: "修片" },
  { id: "completed", label: "交付" },
];
Page({
  data: { saved: [], input: "", error: "", loading: false },
  onShow() {
    this.load();
  },
  onPullDownRefresh() {
    return this.load().finally(() => wx.stopPullDownRefresh());
  },
  input(e) {
    this.setData({ input: e.detail.value.trim() });
  },
  async load() {
    const version = (this.loadVersion = (this.loadVersion || 0) + 1);
    this.setData({ loading: true, error: "" });
    try {
      const saved = api.savedRequests();
      const results = [];
      for (let i = 0; i < saved.length; i += 3) {
        const batch = await Promise.all(
          saved.slice(i, i + 3).map(async (item) => {
            try {
              const { order } = await api.request(
                "/api/bookings/status",
                "POST",
                { token: item.token },
              );
              const stage = steps.findIndex((s) => s.id === order.status);
              const pkg = catalog.packages.find(
                (p) => p.id === order.package_id,
              );
              return {
                ...item,
                order,
                label: labels[order.status] || "请联系工作室",
                packageLabel: pkg ? pkg.zh : "拍摄方案待确认",
                date: order.starts_at
                  ? api.timeLabel(order.starts_at)
                  : "时间待确认",
                steps: steps.map((s, index) => ({
                  ...s,
                  done: index <= stage,
                })),
              };
            } catch (e) {
              return { ...item, error: e.message };
            }
          }),
        );
        results.push(...batch);
        if (version !== this.loadVersion) return;
      }
      this.setData({ saved: results });
    } catch {
      if (version === this.loadVersion)
        this.setData({
          error: "无法读取本机询单记录。可以粘贴私人查询码重新查询。",
        });
    } finally {
      if (version === this.loadVersion) this.setData({ loading: false });
    }
  },
  async add() {
    if (this.data.loading) return;
    const token = this.data.input;
    if (!/^[a-f0-9]{64}$/.test(token)) {
      this.setData({ error: "请输入完整的 64 位私人查询码。" });
      return;
    }
    this.setData({ loading: true, error: "" });
    try {
      await api.request("/api/bookings/status", "POST", { token });
      api.remember(token);
      this.setData({ input: "" });
      await this.load();
    } catch (e) {
      this.setData({
        error: e.message || "无法保存查询码，请检查微信存储空间。",
        loading: false,
      });
    }
  },
  copy(e) {
    wx.setClipboardData({ data: e.currentTarget.dataset.token });
  },
  book() {
    wx.switchTab({ url: "/pages/booking/booking" });
  },
  contact() {
    wx.setClipboardData({ data: catalog.studio.wechat });
  },
  forget(e) {
    wx.showModal({
      title: "从这台设备移除？",
      content:
        "只移除本机查询码，不会取消预约。请先复制查询码，日后可以重新添加。",
      success: (r) => {
        if (r.confirm) {
          try {
            wx.setStorageSync(
              "studioRequests",
              api
                .savedRequests()
                .filter((x) => x.token !== e.currentTarget.dataset.token),
            );
            this.load();
          } catch {
            this.setData({ error: "暂时无法移除，请检查微信存储空间。" });
          }
        }
      },
    });
  },
});
