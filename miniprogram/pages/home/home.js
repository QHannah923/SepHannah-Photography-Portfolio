const catalog = require("../../utils/catalog");
Page({
  data: {
    studio: catalog.studio,
    hero: catalog.photos[0].src,
    collections: catalog.collections,
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
});
