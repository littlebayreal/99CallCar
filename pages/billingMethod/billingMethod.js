// pages/billingMethod/billingMethod.js
const QUERY_BILL_METHOD = 'bill_method'
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    // that.setData({
    //   navH: getApp().globalData.navHeight,
    //   bodyHeight: getApp().globalData.windowHeight - getApp().globalData.navHeight,
    // });
    // that.request();
  },
  // request: function() {
  //   var body = {
  //     "data": [{
  //       "token": "20181002094556OSQNUWGSG-XXICG3EIQP3DA-VQPS",
  //       "city": "三亚"
  //     }],
  //     "datatype": "queryRulesDetail",
  //     "op": "getdata"
  //   }
  //   getApp().webCall(null, body, QUERY_BILL_METHOD, that.onSuccess, that.onErrorBefore, that.onComplete);
  // },
  onSuccess: function (res, requestCode) {
    //真正接到订单的时候
    // console.log(res.data);
  },
  onErrorBefore: function (statusCode, errorMessage, requestCode) {
   
  },
  onComplete: function (res) {

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