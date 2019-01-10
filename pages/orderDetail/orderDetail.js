// pages/orderDetail.js
var that;
// var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var locTrans = require('../../utils/locationTrans.js');
var qqmapsdk;
const REQUEST_TRAIL = 'request_trail'
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
  onLoad: function(options) {
    that = this;
    var schedulebean = JSON.parse(options.scheduleJson);
    that.setData({
      schedulebean: schedulebean,
      navH: getApp().globalData.navHeight,
      bodyHeight: getApp().globalData.windowHeight - getApp().globalData.navHeight,
    });
    // 实例化API核心类
    // qqmapsdk = new QQMapWX({
    //   key: getApp().globalData.key
    // });
    // wx.getLocation({
    //   type: "gcj02",
    //   success: function (res) {
    //     console.log(res)
    //     that.setData({
    //       origin_lng: res.longitude,
    //       origin_lat: res.latitude
    //     })
    //   },
    // });
    that.request();
  },
  navBack: function() {
    // 返回上一个页面（这个API不允许跟参数）
    wx.navigateBack({
      delta: 1
    })
  },
  request: function() {
    var body = {
      "data": [{
        "token": "20181002094556OSQNUWGSG-XXICG3EIQP3DA-VQPS",
        "orderNumber": that.data.schedulebean.orderNumber
      }],
      "datatype": "queryTrack",
      "op": "getdata"
    }
    getApp().webCall(null, body, REQUEST_TRAIL, that.onSuccess, that.onErrorBefore, that.onComplete);
  },
  onSuccess: function(res) {
    var datas = res.data;
    var points = [];
    for (var i in datas) {
      var loc_gcj02 = locTrans.wgs84togcj02(datas[i].long, datas[i].lat);
      points.push({latitude: loc_gcj02[1], longitude: loc_gcj02[0]})
    }
    var first_gcj02 = locTrans.wgs84togcj02(datas[0].long,datas[0].lat);
    that.setData({
      origin_lng: points[0].longitude,
      origin_lat: points[0].latitude,
      markers: [{
        iconPath: "../../image/str.png",
        id: 0,
        latitude: points[0].latitude,
        longitude: points[0].longitude,
        width: 30,
        height: 30
      }, {
        iconPath: "../../image/end.png",
        id: 1,
          latitude: points[points.length - 1].latitude,
          longitude: points[points.length - 1].longitude,
        width: 30,
        height: 30
      }],
      polyline: [{
        points: points,
        color: "#99FF00",
        width: 6
      }]
    })
    
  },
  onErrorBefore: function(e) {

  },
  onComplete: function() {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})