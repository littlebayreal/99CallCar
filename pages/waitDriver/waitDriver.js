// pages/waitDriver/waitDriver.js
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
var that;
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    scale: 16,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: getApp().globalData.key
    });
    wx.getLocation({
      type: "gcj02",
      success: function (res) {
        console.log(res)
        that.setData({
          origin_lng: res.longitude,
          origin_lat: res.latitude
        })
      },
    });
    // var origin = JSON.parse(options.originJson);
    // var destinction = JSON.parse(options.destinctionJson);
    wx.getStorage({
      key: 'order_info',
      success: function(res) {
        console.log(res);
        that.setData({
          orderInfo:res.data,
          markers: [{
            iconPath: "../../image/str.png",
            id: 0,
            latitude: res.data.depLat,
            longitude: res.data.depLong,
            width: 30,
            height: 30
          }, {
            iconPath: "../../image/end.png",
            id: 1,
              latitude: res.data.desLat,
              longitude: res.data.desLong,
            width: 30,
            height: 30
          }],
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})