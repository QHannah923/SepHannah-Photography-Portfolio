const catalog = require("../../utils/catalog");
const api = require("../../utils/api");
const sessions = [
  { id: "wedding", name: "婚纱 / 婚礼" },
  { id: "graduation", name: "毕业写真" },
  { id: "registry", name: "领证跟拍" },
  { id: "portrait", name: "主题写真" },
];
Page({
  data: {
    sessions,
    sessionIndex: 0,
    styleNames: ["一起商量", ...catalog.styles.map((s) => s.zh)],
    styleIndex: 0,
    packages: [],
    packageIndex: 0,
    packageLabels: [],
    film: false,
    price: 0,
    month: api.monthKey(),
    slots: [],
    slotId: "",
    slotLabel: "",
    loading: false,
    sending: false,
    error: "",
    calendarError: "",
    success: false,
    token: "",
    name: "",
    wechat: "",
    email: "",
    location: "",
    preferredDates: "",
    message: "",
    consent: false,
  },
  onLoad() {
    try {
      const d = wx.getStorageSync("studioDraft");
      if (d) {
        this.setData(d.fields || {});
        this.requestId = d.requestId || "";
        this.savedPayload = d.payload || "";
      }
    } catch {}
    this.syncPackages();
  },
  onShow() {
    const s = getApp().globalData.selection;
    if (s.session || s.style) {
      const index = sessions.findIndex((x) => x.id === s.session);
      this.setData({
        ...(index >= 0 ? { sessionIndex: index, packageIndex: 0 } : {}),
        styleIndex: Math.max(
          0,
          catalog.styles.findIndex((x) => x.id === s.style) + 1,
        ),
      });
      getApp().globalData.selection = {};
      this.syncPackages();
    }
    this.loadDates();
  },
  syncPackages() {
    const list = catalog.packages.filter(
      (p) => p.group === sessions[this.data.sessionIndex].id,
    );
    const idx = Math.min(this.data.packageIndex, list.length - 1);
    this.setData({
      packages: list,
      packageIndex: idx,
      packageLabels: list.map(
        (p) => p.zh + " · " + (p.from ? "起价 " : "") + "A$" + p.price,
      ),
      price: list[idx].price + (this.data.film ? 100 : 0),
      selectedPackage: list[idx],
    });
  },
  chooseSession(e) {
    this.setData({ sessionIndex: Number(e.detail.value), packageIndex: 0 });
    this.syncPackages();
  },
  choosePackage(e) {
    this.setData({ packageIndex: Number(e.detail.value) });
    this.syncPackages();
  },
  chooseStyle(e) {
    this.setData({ styleIndex: Number(e.detail.value) });
  },
  film(e) {
    this.setData({ film: e.detail.value });
    this.syncPackages();
  },
  field(e) {
    this.setData({ [e.currentTarget.dataset.field]: e.detail.value });
  },
  consent(e) {
    this.setData({ consent: e.detail.value.includes("yes") });
  },
  month(e) {
    this.setData({ month: e.detail.value, slotId: "", slotLabel: "" });
    this.loadDates();
  },
  async loadDates() {
    const month = this.data.month;
    this.setData({ loading: true, calendarError: "" });
    try {
      const d = await api.request("/api/availability?month=" + month);
      if (month === this.data.month)
        this.setData({
          slots: d.slots.map((s) => ({
            ...s,
            label:
              api.timeLabel(s.starts_at) +
              " – " +
              api.timeLabel(s.ends_at).slice(11),
          })),
        });
    } catch (e) {
      if (month === this.data.month)
        this.setData({ slots: [], calendarError: e.message });
    } finally {
      if (month === this.data.month) this.setData({ loading: false });
    }
  },
  selectSlot(e) {
    this.setData({
      slotId: e.currentTarget.dataset.id,
      slotLabel: e.currentTarget.dataset.label,
    });
  },
  clearSlot() {
    this.setData({ slotId: "", slotLabel: "" });
  },
  guide() {
    wx.navigateTo({ url: "/pages/guide/guide" });
  },
  async submit() {
    if (this.data.sending) return;
    const d = this.data;
    if (!d.name.trim() || !d.wechat.trim() || !d.consent) {
      this.setData({ error: "请填写姓名、微信号，并同意询单隐私说明。" });
      return;
    }
    const payload = {
      name: d.name,
      email: d.email,
      wechat: d.wechat,
      sessionType: sessions[d.sessionIndex].id,
      packageId: d.selectedPackage.id,
      style: d.styleIndex ? catalog.styles[d.styleIndex - 1].id : "",
      film: d.film,
      location: d.location,
      preferredDates: d.preferredDates,
      message: d.message,
      consent: true,
      contactMethod: "wechat",
      source: "miniprogram",
      slotId: d.slotId,
    };
    const serialized = JSON.stringify(payload);
    this.setData({ sending: true, error: "" });
    try {
      if (!this.requestId || this.savedPayload !== serialized)
        this.requestId = await api.uuid();
      this.savedPayload = serialized;
    } catch (e) {
      this.setData({ sending: false, error: e.message });
      return;
    }
    const fields = {};
    [
      "name",
      "wechat",
      "email",
      "location",
      "preferredDates",
      "message",
      "sessionIndex",
      "packageIndex",
      "styleIndex",
      "film",
      "slotId",
      "slotLabel",
    ].forEach((k) => (fields[k] = d[k]));
    try {
      wx.setStorageSync("studioDraft", {
        fields,
        requestId: this.requestId,
        payload: serialized,
      });
    } catch {
      this.setData({
        sending: false,
        error: "无法保存询单草稿。请清理微信存储后重试，以免重复提交。",
      });
      return;
    }
    try {
      const result = await api.request("/api/inquiries", "POST", {
        ...payload,
        requestId: this.requestId,
      });
      if (!result.trackingToken)
        throw new Error("没有收到查询码，请重试同一份询单。");
      this.setData({ success: true, token: result.trackingToken });
      try {
        api.remember(result.trackingToken);
        wx.removeStorageSync("studioDraft");
      } catch {
        this.setData({
          error: "询单已保存，但查询码未保存在手机上。请复制下方查询码。",
        });
      }
    } catch (e) {
      this.setData({ error: e.message });
    } finally {
      this.setData({ sending: false });
    }
  },
  copy() {
    wx.setClipboardData({ data: this.data.token });
  },
  requests() {
    wx.switchTab({ url: "/pages/requests/requests" });
  },
  again() {
    this.requestId = "";
    this.savedPayload = "";
    this.setData({
      success: false,
      token: "",
      consent: false,
      slotId: "",
      slotLabel: "",
      error: "",
    });
  },
});
