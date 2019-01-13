// pages/orderServiceForTexi/orderServiceForTexi.js
const QUERY_PASSENGER_ON_CAR = "passenger_on_car";
const QUERY_TEXI_LOCATION = "texi_location";
const QUERY_CALL_CAR_RESULT = "queryCallCarResultByOrderId";
var lt = require('../../utils/locationTrans.js');
var that;
var timeout;
var orderTimeout;

var count = 5;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTitle: "等待出租车服务",
    showToast: "司机正在赶往您的上车地点，到达后最多等待3分钟",
    isDriverLocRecycle: true,
    isOrderRecycle: true,
    isShowButton: true,
    type: 0,
    carNo: "苏 A89001",
    carType: "捷达",
    unit: "中北出租",
    empcode: "1212121212121212121",
    totalAndCancel: "订单1111笔/爽约11次",
    driverName: "aaaa",
    driverRate: 90,
    scale: 16,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    that.setData({
      navH: getApp().globalData.navHeight,
      bodyHeight: getApp().globalData.windowHeight - getApp().globalData.navHeight,
    })
    wx.getStorage({
      key: 'order_info',
      success: function(res) {
        console.log("订单参数:" + JSON.stringify(res));
        that.setData({
          orderInfo: res.data,
          origin_lng: res.data.mLongitude,
          origin_lat: res.data.mLatitude
        });
        that.requestOrder();
        that.requestDriverLocation();
        that.showMarks();
      },
    })
  },

  getInCar: function() {
    wx.getLocation({
      success: function(res) {
        var body = {
          orderId: that.data.orderInfo.orderId,
          mLongitude: res.longitude,
          mLatitude: res.latitude
        }
        var timestamp = Date.parse(new Date());
        getApp().webCallForTexi('passengerOnCar', body, timestamp, QUERY_PASSENGER_ON_CAR, that.onSuccess, that.onErrorBefore, that.onComplete, true, 'GET', 1)
      },
    })
  },
  requestOrder: function() {
    if (that.data.isOrderRecycle) {
      var body = {
        "orderNumber": that.data.orderInfo.orderNumber,
        "mobilenumber": getApp().globalData.mobilenumber
      }
      var timestamp = Date.parse(new Date());
      getApp().webCallForTexi('queryCallCarResultByOrderId', body, timestamp, QUERY_CALL_CAR_RESULT, that.onSuccess, that.onErrorBefore, that.onComplete, true, 'GET', 1)
      //五秒更新一次司机的位置信息
      orderTimeout = setTimeout(that.requestOrder, 2000);
    }
  },
  requestDriverLocation: function() {
    if (that.data.isDriverLocRecycle) {
      var body = {
        "orderNumber": that.data.orderInfo.orderNumber
      }
      var timestamp = Date.parse(new Date());
      getApp().webCallForTexi('queryMyCarLocationByOrderId', body, timestamp, QUERY_TEXI_LOCATION, that.onSuccess, that.onErrorBefore, that.onComplete, true, 'GET', 1)
      //五秒更新一次司机的位置信息
      timeout = setTimeout(that.requestDriverLocation, 5000);
    }
  },
  onSuccess: function(res, requestCode) {
    switch (requestCode) {
      case QUERY_PASSENGER_ON_CAR:
        if (res.success && res.msg == '操作成功!') {
          that.setData({
            isShowButton: false,
            showTitle: "服务进行中",
            showToast: "服务开始，请系好您的安全带",
            type: 1,
          })
          clearInterval(timeout);
          clearTimeout(orderTimeout);
          timeout = null;
          orderTimeout = null;
          //重新刷新司机位置
          that.requestDriverLocation();
          that.requestOrder();
          that.showMarks();
        }
        break;
        //更新出租车的位置
      case QUERY_TEXI_LOCATION:
        that.showMarks(res);
        break;
      case QUERY_CALL_CAR_RESULT:
        console.log("循环次数:" + count)
        if (res.res == true) {
          that.setData({
            driverName: res.name,
            driverRate: res.praiserate,
            carNo: res.carno,
            carType: res.mtype,
            unit: res.ownername,
            empcode: res.empcode,
            totalAndCancel: "订单" + res.ordercount + "笔/爽约" + res.cancelcount + "次"
          })
          switch (res.orderstate) {
            //订单完成
            case 8:
              console.log("订单完成");
              //返回首页 并清除本地订单信息
              //清除当前订单信息
              wx.setStorage({
                key: 'order_info',
                data: '',
              })
              wx.navigateBack({
                delta: 1,
              })
              break;
              //订单正在执行
            case 25:
              break;
          }
        }
        // if(count<0){
        //   wx.navigateBack({
        //         delta: 1,
        //       })
        // }
        break;
    }
  },
  onErrorBefore: function(e) {

  },
  onComplete: function() {

  },
  showMarks(res) {
    var dep_gcj02 = lt.wgs84togcj02(that.data.orderInfo.mLongitude, that.data.orderInfo.mLatitude);
    var des_gcj02 = lt.wgs84togcj02(that.data.orderInfo.destlng, that.data.orderInfo.destlat);
    var loc_gcj02 = lt.wgs84togcj02(res.carLongitude, res.carLatitude);
    // var loc_gcj02 = lt.wgs84togcj02(120.72687547833848, 31.246890319716055);
    switch (that.data.type) {
      case 0:
        that.setData({
          markers: [{
            iconPath: "../../image/map_car.png",
            id: 3,
            latitude: loc_gcj02[1],
            longitude: loc_gcj02[0],
            width: 15,
            height: 30,
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
      case 1:
        that.setData({
          markers: [{
            iconPath: "../../image/map_car.png",
            id: 0,
            latitude: loc_gcj02[1],
            longitude: loc_gcj02[0],
            width: 15,
            height: 30,
          }, {
            iconPath: "../../image/end.png",
            id: 1,
            latitude: des_gcj02[1],
            longitude: des_gcj02[0],
            width: 30,
            height: 30
          }]
        })
        break;
    }
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