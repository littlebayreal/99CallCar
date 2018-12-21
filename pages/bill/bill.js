// pages/bill/bill.js
var that;
const QUERY_BILL = 'query_bill';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[{
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
  onLoad: function (options) {
    that = this;
    that.setData({
      navH: getApp().globalData.navHeight,
      bodyHeight: getApp().globalData.windowHeight - getApp().globalData.navHeight,
    });
    that.request();
  },
  request: function() {
    var body = {
      "data": [
        {
          "token": "20181002094556OSQNUWGSG-XXICG3EIQP3DA-VQPS",
          "orderNumber": "20181002080938820283"
        }
      ],
      "datatype": "passengerBill",
      "op": "getdata"
    }
    getApp().webCall(null, body, QUERY_BILL, that.onSuccess, that.onErrorBefore, that.onComplete);
  },
  navBack:function(){
     wx.navigateBack({
       delta:1
     })
  },
  onSuccess: function (res, requestCode) {
    //真正接到订单的时候
    console.log(res.data);
  },
  onErrorBefore: function (statusCode, errorMessage, requestCode) {

  },
  onComplete: function (res) {

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
  
  },
  checkBill:function(){
    wx.navigateTo({
      url: '../billingMethod/billingMethod',
    })
  }
})