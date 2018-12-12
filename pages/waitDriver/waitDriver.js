// pages/waitDriver/waitDriver.js
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
var that;
const REQUEST_ORDER = 'request_order';
const REQUEST_DRIVER_LOCATION = 'request_driver_location'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scale: 16,
    demo_index: 0,
    isDriverLocRecycle: true,
    isRecycle: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    that.setData({
      navH: getApp().globalData.navHeight,
      bodyHeight: getApp().globalData.windowHeight - getApp().globalData.navHeight
    })
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: getApp().globalData.key
    });
    wx.getLocation({
      type: "gcj02",
      success: function(res) {
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
        that.setData({
          orderInfo: res.data,
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
        });
        setTimeout(that.requestDriverLocation, 5000);
        setTimeout(that.request, 5000);
      },
    })
  },
  //请求订单的状态以及司机的位置并显示
  request: function() {
    if (that.data.isRecycle) {
      var body = {
        "data": [{
          "token": "979347F6010C4F8C42BDD0C3535A5735",
          "orderNumber": that.data.orderInfo.orderNumber
        }],
        "datatype": "wxUserOrderStatus",
        "op": "getdata"
      }
      getApp().webCall(null, body, REQUEST_ORDER, that.onSuccess, that.onErrorBefore, that.onComplete);
      //两秒更新一次订单信息
      setTimeout(that.request, 2000);
    }
  },
  requestDriverLocation: function() {
    if (that.data.isDriverLocRecycle) {
      var body = {
        "data": [{
          "token": "979347F6010C4F8C42BDD0C3535A5735",
          "orderNumber": that.data.orderInfo.orderNumber
        }],
        "datatype": "queryDriverPosition",
        "op": "getdata"
      }
      getApp().webCall(null, body, REQUEST_DRIVER_LOCATION, that.onSuccess, that.onErrorBefore, that.onComplete);
      //五秒更新一次司机的位置信息
      setTimeout(that.requestDriverLocation, 5000);
    }
  },
  onSuccess: function(res, requestCode) {
    switch (requestCode) {
      case REQUEST_ORDER:
        //订单状态到接单成功了
        console.log("查询订单状态:" + res);
        wx.redirectTo({
          url: '../orderservice/orderservice',
        })
        break;
      case REQUEST_DRIVER_LOCATION:
        var demo_location = [{
            'lng': 120.67367744476319,
            'lat': 31.249085662200144
          },
          {
            'lng': 120.68457794219971,
            'lat': 31.248498633295462
          },
          {
            'lng': 120.69788169891358,
            'lat': 31.248058359222476
          },
          {
            'lng': 120.70449066192627,
            'lat': 31.248058359222554
          },
          {
            'lng': 120.72285842926026,
            'lat': 31.25312138712596
          },
          {
            'lng': 120.72697830230713,
            'lat': 31.26001840853483
          },
          {
            'lng': 120.73993873626709,
            'lat': 31.263760198629505
          }
        ]
        //更新司机位置
        that.setData({
          markers: [{
            iconPath: "../../image/str.png",
            id: 0,
            latitude: that.data.orderInfo.depLat,
            longitude: that.data.orderInfo.depLong,
            width: 30,
            height: 30
          }, {
            iconPath: "../../image/end.png",
            id: 1,
            latitude: that.data.orderInfo.desLat,
            longitude: that.data.orderInfo.desLong,
            width: 30,
            height: 30
          }, {
            iconPath: "../../image/map_car.png",
            id: 2,
            latitude: demo_location[that.data.demo_index].lat,
            longitude: demo_location[that.data.demo_index].lng,
            width: 30,
            height: 60
          }],
          demo_index: that.data.demo_index < 7 ? that.data.demo_index + 1 : 0
        })
        break;
    }
  },
  onErrorBefore: function(statusCode, errorMessage, requestCode) {
    console.log("错误处理");
  },
  onComplete: function(res) {

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
    that.setData({
      isDriverLocRecycle: false,
      isRecycle: false
    })
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

  },
  movetoPosition: function() {
    this.mapCtx.moveToLocation();
  },
  mapClickListener(e) {
    console.log(e);
    switch (e.currentTarget.id) {
      // case "personal_center":
      //   wx.navigateTo({
      //     url: '../personcenter/personcenter',
      //     success: function (res) { },
      //     fail: function (res) { },
      //     complete: function (res) { },
      //   })
      //   break;
      // case "phone_call":
      //   wx.makePhoneCall({
      //     phoneNumber: '089896789'
      //   })
      //   break;
      case "current_location":
        wx.getLocation({
          type: "gcj02",
          success: function(res) {
            that.setData({
              origin_lng: res.longitude,
              origin_lat: res.latitude
            })
          },
        })
        break;
    }
  },
})