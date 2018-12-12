// pages/orderservice/orderservice.js
var that;
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
const REQUEST_ORDER = 'request_order';
const REQUEST_DRIVER_LOCATION = 'request_driver_location'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scale: 16,
    isRecycle:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
      success: function(res) {
        console.log(res)
        that.setData({
          origin_lng: res.longitude,
          origin_lat: res.latitude
        })
      },
    });
    //获取订单信息
    wx.getStorage({
      key: 'order_info',
      success: function(res) {
        that.setData({
          orderInfo: res.data,
          markers: [
              {
              iconPath: "../../image/str.png",
              id: 0,
              latitude: res.data.depLat,
              longitude: res.data.depLong,
              width: 30,
              height: 30
            },
            {
              iconPath: "../../image/end.png",
              id: 1,
              latitude: res.data.desLat,
              longitude: res.data.desLong,
              width: 30,
              height: 30
            }
          ],
        });
        setTimeout(that.updateLocation, 0);
        setTimeout(that.request, 0);
      },
    })
  },
  //请求订单的状态以及司机的位置并显示
  request: function () {
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
  //更新位置 根据手机定位非常不精准  看项目需要是否后面改成查询司机的位置？
  updateLocation: function () {
    if (that.data.isRecycle) {
      wx.getLocation({
        type: "gcj02",
        success: function (res) {
          console.log(res)
          that.setData({
            // origin_lng: res.longitude,
            // origin_lat: res.latitude,
            markers: [
                {
                iconPath: "../../image/str.png",
                id: 0,
                latitude: that.data.orderInfo.depLat,
                longitude: that.data.orderInfo.depLong,
                width: 30,
                height: 30
              },
              {
                iconPath: "../../image/end.png",
                id: 1,
                latitude: that.data.orderInfo.desLat,
                longitude: that.data.orderInfo.desLong,
                width: 30,
                height: 30
              },
              {
                iconPath: "../../image/demo_running.png",
                id: 2,
                latitude: res.latitude,
                longitude: res.longitude,
                width: 40,
                height: 40
              },
            ],
          })
        },
      });
      //三秒更新一次司机的位置信息
      setTimeout(that.updateLocation, 3000);
    }
  },
  onSuccess: function (res, requestCode) {
    switch (requestCode) {
      case REQUEST_ORDER:
        //到达目的地 跳转支付界面
        console.log("查询订单状态:" + res);
        wx.redirectTo({
          url: '../pay/pay',
        })
        that.setData({
          isRecycle:false
        })
        break;
      case REQUEST_DRIVER_LOCATION:
        break;
    }
  },
  onErrorBefore: function (statusCode, errorMessage, requestCode) {
    console.log("错误处理");
  },
  onComplete: function (res) {

  },
  movetoPosition: function() {
    this.mapCtx.moveToLocation();
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