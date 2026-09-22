const catalog = require("../../utils/catalog");
Page({
  data: {
    studio: catalog.studio,
    hero: catalog.photos.find((p) => p.id === "wedding2").src,
    collections: catalog.collections.map((c) => ({
      ...c,
      src: catalog.photos.find((p) => p.id === c.image).src,
      price: Math.min(
        ...catalog.packages
          .filter((p) => p.group === c.session)
          .map((p) => p.price),
      ),
    })),
  },
  gallery(e) {
    getApp().globalData.selection = {
      collection: e.currentTarget.dataset.slug,
    };
    wx.switchTab({ url: "/pages/gallery/gallery" });
  },
  book() {
    wx.switchTab({ url: "/pages/booking/booking" });
  },
  guide() {
    wx.navigateTo({ url: "/pages/guide/guide" });
  },
  contact() {
    wx.setClipboardData({ data: catalog.studio.wechat });
  },
  onShareAppMessage() {
    return {
      title: "SepHannah Studio · 在 Brisbane，留住你的故事",
      path: "/pages/home/home",
    };
  },
});
