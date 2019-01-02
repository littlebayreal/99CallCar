// pages/pay/pay.js
var that;
const QUERY_BILL = 'query_bill';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
      "desc": "起步价",
      "num": "",
      "unit": "",
      "count": 20.0
    }, {
      "desc": "最低消费",
      "num": "",
      "unit": "",
      "count": 20.0
    }, {
      "desc": "里程费",
      "num": 6.49,
      "unit": "公里",
      "count": 22.07
    }, {
      "desc": "远途费",
      "num": 0.0,
      "unit": "公里",
      "count": 0.0
    }, {
      "desc": "夜间费",
      "num": 0.0,
      "unit": "公里",
      "count": 0.0
    }, {
      "desc": "低速费",
      "num": 5.59,
      "unit": "分钟",
      "count": 4.47
    }, {
      "desc": "时长费",
      "num": 0.0,
      "unit": "分钟",
      "count": 0.0
    }]
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
    wx.getStorage({
      key: 'order_info',
      success: function(res) {
        // console.log("订单数据:" + JSON.stringify(res.data));
        // var dep_wgs84 = lt.gcj02towgs84(res.data.depLong, res.data.depLat);
        // var des_wgs84 = lt.gcj02towgs84(res.data.desLong, res.data.desLat);
        that.setData({
          orderInfo: res.data,
        });
        that.request();
      },
    })
  },
  navBack: function() {
    // 返回上一个页面（这个API不允许跟参数）
    var pages = getCurrentPages();
    wx.navigateBack({
      delta: pages.length - 1
    })
  },
  payClickListener() {
    wx.navigateTo({
      url: '../evaluation/evaluation?type=0',
    })
  },
  request: function() {
    var body = {
      "data": [{
        "token": "979347F6010C4F8C42BDD0C3535A5735",
        "orderNumber": that.data.orderInfo.orderNumber
      }],
      "datatype": "passengerBill",
      "op": "getdata"
    }
    getApp().webCall(null, body, QUERY_BILL, that.onSuccess, that.onErrorBefore, that.onComplete);
  },
  onSuccess: function(res, requestCode) {
    //真正接到订单的时候
    if (res.code == 0) {
      var list = [];
      for (var i in res.data[0].tripFee.items) {
        list.push(res.data[0].tripFee.items[i])
      }
      that.setData({
        list:list,
        tripFee:res.data[0].tripFee.price,
        totalFee:res.data[0].totalFee
      })
    }
  },
  onErrorBefore: function(statusCode, errorMessage, requestCode) {

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