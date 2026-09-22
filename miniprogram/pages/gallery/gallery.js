const catalog = require("../../utils/catalog");
const selection = require("../../utils/selection");
const descriptions = {
  all: "选择拍摄场景和视觉风格，也可以收藏最多六张参考作品。",
  airy: "柔和的光线、干净的色彩，留下轻盈自然的你。",
  film: "温暖色调与细腻颗粒。喜欢真实胶片，也可以在套餐中加选。",
  editorial: "更鲜明的造型、利落的构图，展现镜头前的表现力。",
  cinematic: "有氛围的光影与色彩，让照片像故事里的一个镜头。",
};
Page({
  data: {
    collections: [{ slug: "all", zh: "全部场景" }, ...catalog.collections],
    styles: [{ id: "all", zh: "全部风格" }, ...catalog.styles],
    collection: "all",
    style: "all",
    photos: [],
    selected: [],
    onlySelected: false,
    description: descriptions.all,
    error: "",
  },
  onShow() {
    const s = getApp().globalData.selection;
    if (s.collection) {
      this.setData({ collection: s.collection, onlySelected: false });
      delete s.collection;
    }
    this.setData({ selected: selection.read() });
    this.filter();
  },
  chooseCollection(e) {
    this.setData({
      collection: e.currentTarget.dataset.id,
      onlySelected: false,
    });
    this.filter();
  },
  chooseStyle(e) {
    this.setData({ style: e.currentTarget.dataset.id, onlySelected: false });
    this.filter();
  },
  filter() {
    this.setData({
      description: descriptions[this.data.style],
      photos: catalog.photos
        .filter((p) =>
          this.data.onlySelected
            ? this.data.selected.includes(p.id)
            : (this.data.collection === "all" ||
                p.collection === this.data.collection) &&
              (this.data.style === "all" || p.styles.includes(this.data.style)),
        )
        .map((p) => ({
          ...p,
          selected: this.data.selected.includes(p.id),
          label: catalog.collections.find((c) => c.slug === p.collection).zh,
        })),
    });
  },
  toggle(e) {
    const id = e.currentTarget.dataset.id,
      ids = this.data.selected;
    if (!ids.includes(id) && ids.length >= selection.MAX) {
      wx.showToast({ title: "最多选择六张参考作品", icon: "none" });
      return;
    }
    try {
      this.setData({
        selected: selection.write(
          ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
        ),
        error: "",
      });
      this.filter();
    } catch {
      this.setData({ error: "暂时无法保存选择，请检查微信存储空间。" });
    }
  },
  showSelected() {
    this.setData({ onlySelected: !this.data.onlySelected });
    this.filter();
  },
  preview(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: this.data.photos.map((p) => p.src),
    });
  },
  book() {
    const c = catalog.collections.find((c) => c.slug === this.data.collection);
    getApp().globalData.selection = {
      style: this.data.style === "all" ? "" : this.data.style,
      ...(c ? { session: c.session } : {}),
    };
    wx.switchTab({ url: "/pages/booking/booking" });
  },
});
