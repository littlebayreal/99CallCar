// pages/orderDetail.js
var that;
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
const REQUEST_TRAIL='request_trail'
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
    that.setData({
      navH: getApp().globalData.navHeight,
      bodyHeight: getApp().globalData.windowHeight - getApp().globalData.navHeight,
    });
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
  },
  navBack: function () {
    // 返回上一个页面（这个API不允许跟参数）
      wx.navigateBack({
        delta: 1
      })
  },
  request: function () {
    var body = {
      "data": [
        {
          "token": "50A675725D2006141DC7C3BB4C673A64",
          "orderNumber": "XXXXXXXXXX"
        }
      ],
      "datatype": "queryTrack",
      "op": "getdata"
    }
    getApp().webCall(null, body, REQUEST_TRAIL, that.onSuccess, that.onErrorBefore, that.onComplete);
  },
  onSuccess: function (res) {
    
  },
  onErrorBefore: function (e) {

  },
  onComplete: function () {
    that.refreshView.stopPullRefresh();
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