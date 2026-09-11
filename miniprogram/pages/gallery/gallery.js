const catalog = require("../../utils/catalog");
Page({
  data: {
    collections: [{ slug: "all", zh: "全部场景" }, ...catalog.collections],
    styles: [{ id: "all", zh: "全部风格" }, ...catalog.styles],
    collection: "all",
    style: "all",
    photos: catalog.photos,
  },
  onShow() {
    const selection = getApp().globalData.selection;
    if (selection.collection) {
      this.setData({ collection: selection.collection });
      delete selection.collection;
      this.filter();
    }
  },
  chooseCollection(e) {
    this.setData({ collection: e.currentTarget.dataset.id });
    this.filter();
  },
  chooseStyle(e) {
    this.setData({ style: e.currentTarget.dataset.id });
    this.filter();
  },
  filter() {
    this.setData({
      photos: catalog.photos.filter(
        (p) =>
          (this.data.collection === "all" ||
            p.collection === this.data.collection) &&
          (this.data.style === "all" || p.styles.includes(this.data.style)),
      ),
    });
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
      session: c ? c.session : "portrait",
    };
    wx.switchTab({ url: "/pages/booking/booking" });
  },
});
