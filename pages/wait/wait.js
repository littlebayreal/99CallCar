// pages/wait/wait.js
var that;
const PLACE_ORDER = 'place_order';
const PLACE_ORDER_TEXI = 'place_order_texi';
const REQUEST_ORDER = 'request_order';
const REQUEST_ORDER_TEXI = 'request_order_texi'
var util = require('../../utils/util.js')
var lt = require('../../utils/locationTrans.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    progress_txt: '已等待',
    waitTimer: null,
    time: '00:00',
    //单位秒 3分钟
    limitTime: 180,
    wait_time: null,
    isGenerate: true,
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

  parseTime: function(time) {
    // var time = time.toString();
    var sec = time % 60;
    var min = Math.floor(time / 60);
    return sec >= 10 ? min + ':' + sec : min + ':0' + sec;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    var originbean = JSON.parse(options.originJson);
    var destinctionbean = JSON.parse(options.destinctionJson);
    var params = JSON.parse(options.paramsJson);
    that.setData({
      navH: getApp().globalData.navHeight,
      bodyHeight: getApp().globalData.windowHeight - getApp().globalData.navHeight,
      origin: originbean,
      destinction: destinctionbean,
      params: params,
      address: originbean.addressName
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.drawProgressbg();
    // this.countInterval();
    //初始的计时线条
    this.drawProgress(0);
  },
  //不断调用的任务
  countInterval: function() {
    if (this.data.wait_time == null) return;
    // var seconds = this.data.wait_time + this.data.limitTime - Math.round(+new Date() / 1000);
    var seconds = Math.round(+new Date() / 1000) - this.data.wait_time;
    if (seconds <= this.data.limitTime) {
      that.drawProgress(seconds / 180 * 4);
      that.setData({
        time: that.parseTime(seconds),
      })
      //每五秒发送一次请求
      if (seconds % 5 == 0 && that.data.isGenerate) {
        that.introduceOrder();
      }
      if (seconds % 2 == 0 && !that.data.isGenerate) {
        that.requestOrder();
      }
      setTimeout(that.countInterval, 1000);
    }
  },
  introduceOrder: function() {
    var orgigin_wgs84 = lt.gcj02towgs84(that.data.origin.addressLocation.lng, that.data.origin.addressLocation.lat);
    var destinction_wgs84 = lt.gcj02towgs84(that.data.destinction.addressLocation.lng,
      that.data.destinction.addressLocation.lat);
    console.log("我要打的:" + that.data.params.callVehicleOpType);
    if (that.data.params.callVehicleOpType == 1) {
      //出租车招车
      var body = {
        "mLongitude": orgigin_wgs84[0],
        "mLatitude": orgigin_wgs84[1],
        "addr": that.data.origin.addressInfo,
        "mobilenumber": '18262041404',
        "findRadius": 1000,
        "des": that.data.destinction.addressInfo,
        "destlng": destinction_wgs84[0],
        "destlat": destinction_wgs84[1],
        "callfee": 0,
        "ddtj": 6,
        "tip": 0,
        "carpool": 0,
        "veltype": 0
      }
      var timestamp = Date.parse(new Date());
      getApp().webCallForTexi('callCarMyself', body, timestamp, PLACE_ORDER_TEXI, that.onSuccess, that.onErrorBefore, that.onComplete, true, 'GET', 1);
      that.setData({
        requestParam: body
      })
    } else {
      var body = {
        "data": [{
          "token": "979347F6010C4F8C42BDD0C3535A5735",
          "depProvince": that.data.origin.provinceCityDistrict.province,
          "depCity": that.data.origin.provinceCityDistrict.city,
          "depCounty": that.data.origin.provinceCityDistrict.district,
          "depDetails": that.data.origin.addressInfo,
          "depLong": orgigin_wgs84[0],
          "depLat": orgigin_wgs84[1],
          "desProvince": that.data.destinction.provinceCityDistrict.province,
          "desCity": that.data.destinction.provinceCityDistrict.city,
          "desCounty": that.data.destinction.provinceCityDistrict.district,
          "desDetails": that.data.destinction.addressInfo,
          "desLong": destinction_wgs84[0],
          "desLat": destinction_wgs84[1],
          "passengerNumber": that.data.params.passagerNumber,
          "addtime": util.formatTime(new Date()),
          "price": that.data.params.price,
          "callVehicleLevel": that.data.params.callVehicleLevel,
          "callVehicleOpType": that.data.params.callVehicleOpType,
          "bookTime": that.data.params.bookTime,
          // "driverCode": null,
          // "codetime": null,
          "orderSource": 6,
          "orderMethod": that.data.params.ordermethod
        }],
        "datatype": "placeOrder",
        "op": "setdata"
      };
      that.setData({
        requestParam: body.data[0]
      })
      getApp().webCall(null, body, PLACE_ORDER, that.onSuccess, that.onErrorBefore, that.onComplete);
    }
  },
  //请求订单的状态以及司机的位置并显示
  requestOrder: function() {
    if (that.data.params.callVehicleOpType == 1) {
      var body = {
        orderId: that.data.orderNumber,
        mobilenumber:'18262041404',
      }
      var timestamp = Date.parse(new Date());
      getApp().webCallForTexi('queryCallCarResultByOrderId', body, timestamp, REQUEST_ORDER_TEXI, that.onSuccess, that.onErrorBefore, that.onComplete, true, 'GET', 1)
    } else {
      var body = {
        "data": [{
          "token": "979347F6010C4F8C42BDD0C3535A5735",
          "orderNumber": that.data.orderNumber
        }],
        "datatype": "wxUserOrderStatus",
        "op": "getdata"
      }
      getApp().webCall(null, body, REQUEST_ORDER, that.onSuccess, that.onErrorBefore, that.onComplete);
    }
  },
  onSuccess: function(res, requestCode) {
    switch (requestCode) {
      case PLACE_ORDER:
        if (res.code == 0) {
          that.setData({
            orderNumber: res.data[0].orderNumber,
            isGenerate: false
          })
          console.log("等待订单:" + JSON.stringify(res));
          //保存订单号以及订单信息到本地
          var d = {
            "orderNumber": res.data[0].orderNumber,
            "token": that.data.requestParam.token,
            "depProvince": that.data.requestParam.depProvince,
            "depCity": that.data.requestParam.depCity,
            "depCounty": that.data.requestParam.depCounty,
            "depDetails": that.data.requestParam.depDetails,
            "depLong": that.data.requestParam.depLong,
            "depLat": that.data.requestParam.depLat,
            "desProvince": that.data.requestParam.desProvince,
            "desCity": that.data.requestParam.desCity,
            "desCounty": that.data.requestParam.desCounty,
            "desDetails": that.data.requestParam.desDetails,
            "desLong": that.data.requestParam.desLong,
            "desLat": that.data.requestParam.desLat,
            "passengerNumber": that.data.requestParam.passengerNumber,
            "addtime": that.data.requestParam.addtime,
            "price": that.data.requestParam.pricie,
            "callVehicleLevel": that.data.requestParam.callVehicleLevel,
            "callVehicleOpType": that.data.requestParam.callVehicleOpType,
            "bookTime": that.data.requestParam.bookTime,
            // "driverCode": null,
            // "codetime": null,
            "orderSource": that.data.requestParam.orderSource,
            "orderMethod": that.data.requestParam.orderMethod
          }
          wx.setStorage({
            key: 'order_info',
            data: d,
          })
        }
        break;
      case REQUEST_ORDER:
        if (res.code == 0 && res.data.status == 1) {
          wx.redirectTo({
            url: '../waitDriver/waitDriver',
          })
        }
        break;
      case REQUEST_ORDER_TEXI:
        // if (res.orderstate == 5) {
          wx.redirectTo({
            url: '../orderServiceForTexi/orderServiceForTexi',
          })
        // }
        break;
      case PLACE_ORDER_TEXI:
        if (res.success) {
          console.log("生成订单成功");
          that.setData({
            orderNumber: res.orderid,
            isGenerate: false
          });
          //保存订单号以及订单信息到本地
          var d = {
            "orderNumber": res.orderid,
            "mLongitude": that.data.params.mLongitude,
            "mLatitude": that.data.params.mLatitude,
            "addr": that.data.params.addr,
            "mobilenumber": that.data.params.mobilenumber,
            "findRadius": that.data.params.findRadius,
            "des": that.data.params.des,
            "destlng": that.data.params.destlng,
            "destlat": that.data.params.destlat,
            "callfee": that.data.params.callfee,
            "ddtj": that.data.params.ddtj,
            "tip": that.data.params.tip,
            "carpool": that.data.params.carpool,
            "veltype": that.data.params.veltype
          }
          wx.setStorage({
            key: 'order_info',
            data: d,
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
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      //设置按下按钮的时间 整数 单位秒
      wait_time: Math.round(+new Date() / 1000)
    })
    this.countInterval();
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
      wait_time: null
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
  drawProgressbg: function() {
    var ctx = wx.createCanvasContext('canvasProgressbg');
    ctx.setLineWidth(4);
    ctx.setStrokeStyle("#e5e5e5");
    ctx.setLineCap("round");
    ctx.beginPath();
    ctx.arc(110, 110, 100, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.draw();
  },
  drawProgress: function(step) {
    console.log(step);
    var context = wx.createCanvasContext('canvasProgress');
    context.setLineWidth(4);
    context.setStrokeStyle("#fbcb02");
    context.setLineCap('round')
    context.beginPath();
    // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
    context.arc(110, 110, 100, -Math.PI / 2, step * Math.PI / 2 - Math.PI / 2, false);
    context.stroke();
    context.draw()
  },
  powerDrawer: function(e) {
    var currentStatu = e.currentTarget.dataset.statu;
    that.util(currentStatu);

    if (e.currentTarget.id == 'btn_ok') {
      // that.cancelOrder();
      //取消订单  返回主页
      wx.navigateBack({
        delta: 1
      })
    }
  },
  // cancelOrder: function() {
  //   var body = {

  //   }
  //   getApp().webCall(null, body, PLACE_ORDER, that.onSuccess, that.onErrorBefore, that.onComplete);
  // },
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