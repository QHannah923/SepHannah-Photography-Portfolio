const catalog = require("../../utils/catalog");
const api = require("../../utils/api");
const calendar = require("../../utils/calendar");
const selection = require("../../utils/selection");
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
    days: [],
    daySlots: [],
    selectedDay: "",
    weekdays: ["一", "二", "三", "四", "五", "六", "日"],
    references: [],
    minMonth: api.monthKey(),
    maxMonth: `${new Date().getFullYear() + 2}-12`,
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
    if (
      Object.prototype.hasOwnProperty.call(s, "session") ||
      Object.prototype.hasOwnProperty.call(s, "style")
    ) {
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
    this.setData({ references: selection.describe(selection.read()) });
    this.loadDates();
  },
  syncPackages() {
    const sessionIndex = Math.max(
      0,
      Math.min(sessions.length - 1, Number(this.data.sessionIndex) || 0),
    );
    this.setData({ sessionIndex });
    const list = catalog.packages.filter(
      (p) => p.group === sessions[this.data.sessionIndex].id,
    );
    const idx = Math.max(
      0,
      Math.min(Number(this.data.packageIndex) || 0, list.length - 1),
    );
    this.setData({
      packages: list,
      packageIndex: idx,
      styleIndex: Math.max(
        0,
        Math.min(catalog.styles.length, Number(this.data.styleIndex) || 0),
      ),
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
    this.setMonth(e.detail.value);
  },
  setMonth(month) {
    if (month < this.data.minMonth || month > this.data.maxMonth) return;
    this.setData({
      month,
      slotId: "",
      slotLabel: "",
      selectedDay: "",
      daySlots: [],
    });
    this.loadDates();
  },
  previousMonth() {
    this.setMonth(calendar.shiftMonth(this.data.month, -1));
  },
  nextMonth() {
    this.setMonth(calendar.shiftMonth(this.data.month, 1));
  },
  async loadDates() {
    const month = this.data.month;
    const loadId = (this.dateLoadId = (this.dateLoadId || 0) + 1);
    this.setData({
      loading: true,
      calendarError: "",
      slots: [],
      days: calendar.buildMonth(month, []).cells,
      daySlots: [],
    });
    try {
      const d = await api.request("/api/availability?month=" + month);
      if (loadId !== this.dateLoadId) return;
      const grid = calendar.buildMonth(month, d.slots);
      const slots = grid.slots.map((s) => ({
        ...s,
        day: calendar.dayKey(Date.parse(s.starts_at)),
        label:
          api.timeLabel(s.starts_at) +
          " – " +
          api.timeLabel(s.ends_at).slice(11),
      }));
      const selectedSlot = slots.find((s) => s.id === this.data.slotId);
      const lost = this.data.slotId && !selectedSlot;
      const day = selectedSlot
        ? selectedSlot.day
        : slots.some((s) => s.day === this.data.selectedDay)
          ? this.data.selectedDay
          : slots[0]
            ? slots[0].day
            : "";
      this.setData({
        slots,
        days: grid.cells,
        selectedDay: day,
        daySlots: slots.filter((s) => s.day === day),
        ...(lost
          ? {
              slotId: "",
              slotLabel: "",
              error: "之前选择的时段已不可用，请重新选择或填写偏好日期。",
            }
          : {}),
      });
    } catch (e) {
      if (loadId === this.dateLoadId)
        this.setData({ slots: [], calendarError: e.message });
    } finally {
      if (loadId === this.dateLoadId) this.setData({ loading: false });
    }
  },
  selectDay(e) {
    const selectedDay = e.currentTarget.dataset.day;
    this.setData({
      selectedDay,
      daySlots: this.data.slots.filter((s) => s.day === selectedDay),
      slotId: "",
      slotLabel: "",
    });
  },
  selectSlot(e) {
    if (this.data.loading || this.data.calendarError) return;
    const slot = this.data.slots.find(
      (s) => s.id === e.currentTarget.dataset.id,
    );
    if (slot) this.setData({ slotId: slot.id, slotLabel: slot.label });
  },
  clearSlot() {
    this.setData({ slotId: "", slotLabel: "" });
  },
  editReferences() {
    wx.switchTab({ url: "/pages/gallery/gallery" });
  },
  removeReference(e) {
    try {
      this.setData({
        references: selection.describe(
          selection.write(
            this.data.references
              .map((p) => p.id)
              .filter((id) => id !== e.currentTarget.dataset.id),
          ),
        ),
      });
    } catch {
      this.setData({ error: "无法保存参考照片选择，请检查微信存储空间。" });
    }
  },
  privacy() {
    wx.navigateTo({ url: "/pages/privacy/privacy" });
  },
  guide() {
    wx.navigateTo({ url: "/pages/guide/guide" });
  },
  async submit() {
    if (this.data.sending) return;
    const d = { ...this.data };
    if (!d.name.trim() || !d.wechat.trim() || !d.consent) {
      this.setData({ error: "请填写姓名、微信号，并同意询单隐私说明。" });
      return;
    }
    if (d.slotId && (d.loading || d.calendarError)) {
      this.setData({ error: "请先刷新档期，或取消所选时段后填写偏好日期。" });
      return;
    }
    if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) {
      this.setData({ error: "请填写有效邮箱，或留空并通过微信联系。" });
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
      message: selection.message(
        d.message,
        d.references.map((p) => p.id),
      ),
      consent: true,
      contactMethod: "wechat",
      source: "miniprogram",
      slotId: d.slotId,
    };
    if (payload.message.length > 4000) {
      this.setData({ error: "拍摄想法过长，请缩短后重试。" });
      return;
    }
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
      "month",
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
      if (e.status === 409) {
        this.clearSlot();
        this.loadDates();
      }
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
