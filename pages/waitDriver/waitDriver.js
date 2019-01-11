// pages/waitDriver/waitDriver.js
var lt = require('../../utils/locationTrans.js');
var that;
const REQUEST_ORDER = 'request_order';
const REQUEST_ORDER_NUMBER = 'request_order_number'
const REQUEST_DRIVER_LOCATION = 'request_driver_location'
const REQUEST_CANCEL = 'request_cancel'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    scale: 16,
    demo_index: 0,
    isDriverLocRecycle: true,
    isRecycle: true,
    carTypeList: [{
        name: '临时有事',
        value: '临时有事'
      },
      {
        name: '等待时间过长',
        value: '等待时间过长'
      },
      {
        name: '其它原因',
        value: '其它原因'
      }
    ],
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
        // console.log("订单数据:" + JSON.stringify(res.data));
        // var dep_wgs84 = lt.gcj02towgs84(res.data.depLong, res.data.depLat);
        // var des_wgs84 = lt.gcj02towgs84(res.data.desLong, res.data.desLat);
        that.setData({
          orderInfo: res.data,
        });
        setTimeout(that.requestDriverLocation, 0);
        setTimeout(that.request, 0);

        that.requestOrderDetail();
      },
    })
  },
  requestOrderDetail: function() {
    var body = {
      "data": [{
        "token": "979347F6010C4F8C42BDD0C3535A5735",
        "orderNumber": that.data.orderInfo.orderNumber
      }],
      "datatype": "pTraveldetailQuery",
      "op": "getdata"
    }
    getApp().webCall(null, body, REQUEST_ORDER_NUMBER, that.onSuccess, that.onErrorBefore, that.onComplete);
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
        //订单状态到接单成功了并且行程
        console.log("查询订单状态:" + JSON.stringify(res));
        if (res.code == "0" && res.data.status == "4") {
          wx.redirectTo({
            url: '../orderservice/orderservice',
          })
        }
        break;
      case REQUEST_DRIVER_LOCATION:
        var dep_gcj02 = lt.wgs84togcj02(that.data.orderInfo.depLong, that.data.orderInfo.depLat);
        var des_gcj02 = lt.wgs84togcj02(that.data.orderInfo.desLong, that.data.orderInfo.desLat);
        var loc_gcj02 = lt.wgs84togcj02(res.data[0].long, res.data[0].lat);
        that.setData({
          markers: [{
            iconPath: "../../image/map_car.png",
            id: 3,
            latitude: loc_gcj02[1],
            longitude: loc_gcj02[0],
            width: 15,
            height: 30,
            rotate: -res.data[0].direction
          }, {
            iconPath: "../../image/str.png",
            id: 0,
            latitude: dep_gcj02[1],
            longitude: dep_gcj02[0],
            width: 30,
            height: 30
          }]
        })
        break;
      case REQUEST_CANCEL:
        //取消订单  返回主页
        if (res.code == 0) {
          var pages = getCurrentPages();
          wx.navigateBack({
            delta: pages.length - 1
          })
        } else {
          wx.showToast({
            title: res.desc,
          })
        }
        break;
      case REQUEST_ORDER_NUMBER:
        if (res.code == 0) {
          that.setData({
            driverName: res.data[0].driverName,
            stars: res.data[0].driverGrade,
            orderNum: res.data[0].orderCount,
            licensePlate: res.data[0].licensePlate,
            carcolor: res.data[0].vehicleColor,
            vehicleModel: res.data[0].vehicleModel
          })
        }
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
  powerDrawer: function(e) {
    console.log(e);
    var currentStatu = e.currentTarget.dataset.statu;
    that.util(currentStatu);
    if (e.currentTarget.id == 'btn_ok') {
      that.cancelOrder();
    }
  },
  cancelOrder: function() {
    var body = {
      "data": [{
        "token": "979347F6010C4F8C42BDD0C3535A5735",
        "orderNumber": that.data.orderInfo.orderNumber,
        "userType": 0,
        "reason": that.data.carType
      }],
      "datatype": "cancelOrder",
      "op": "setdata"
    }
    getApp().webCall(null, body, REQUEST_CANCEL, that.onSuccess, that.onErrorBefore, that.onComplete);
  },
  util: function(currentStatu) {
    if (currentStatu == 'close') {
      this.setData({
        showModalStatus: false
      });
    }
    // 显示
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
    }
  },
  //选择车型
  radioChange: function(e) {
    var list = that.data.carTypeList;
    for (var i = 0; i < list.length; i++) {
      if (i == e.currentTarget.dataset.pos) {
        list[i].checked = true;
      } else {
        list[i].checked = false;
      }
    }
    that.setData({
      carTypeList: list,
      carType: e.currentTarget.dataset.value
    })
  },
})