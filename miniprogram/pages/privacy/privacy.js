const { studio } = require("../../utils/catalog");
Page({
  data: { studio },
  contact() {
    wx.setClipboardData({ data: studio.wechat });
  },
});
