// pages/evaluation/evaluation.js
var that;
const QUERY_ORDERINFO = 'query_order_info';
const SUBMIT_EVALUATION = 'submit_evaluation';
const FROM_PAY = 0;
const FROM_ORDER_DETAIL = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    star: 0,
    starMap: ['非常差',
      '差',
      '一般',
      '好',
      '非常好'
    ],
    //是否可以给司机评分
    isCanEval:true
  },
  phoneCall:function(e){
    wx.makePhoneCall({
      phoneNumber: that.data.driverPhone,
    })
  },
  myStarChoose(e) {
    console.log(e);
    if (e.target.dataset.star == null || !that.data.isCanEval) return;
    let star = parseInt(e.target.dataset.star) || 0;
    this.setData({
      star: star,
    });
  },
  toIndex: function() {
    // 返回上一个页面（这个API不允许跟参数）
    if(that.data.type == FROM_PAY){
    var pages = getCurrentPages();
    wx.navigateBack({
      delta: pages.length - 1
    })
    }else{
      var scheduleJson = JSON.stringify(that.data.schedulebean);
      wx.navigateTo({
        url: '../orderDetail/orderDetail?scheduleJson=' + scheduleJson
      })
    }
  },
  navBack: function() {
    // 返回上一个页面（这个API不允许跟参数）
    if(that.data.type == FROM_PAY)
    that.toIndex();
    else
    wx.navigateBack({
      delta:1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    var type;
    if (options.type == FROM_PAY){
      type = FROM_PAY;
    }else{
      type = FROM_ORDER_DETAIL;
      var schedulebean = JSON.parse(options.scheduleJson);
      console.log(schedulebean);
    }
    that.setData({
      type:type,
      navH: getApp().globalData.navHeight,
      bodyHeight: getApp().globalData.windowHeight - getApp().globalData.navHeight,
      schedulebean: schedulebean,
      // name:'周师傅',
      // star:5,
      // orderNum:'2w+',
      // carNum:'浙C1234',
      // carType:'farrari·438',
      isAlreadyEval:false,
      bottomRightButton: options.type == FROM_PAY?'结束行程':'查看轨迹'
    });
    that.request();
  },
  request: function() {
    var body = {
      "data": [{
        "token": "20181002094556OSQNUWGSG-XXICG3EIQP3DA-VQPS",
        "orderNumber": that.data.schedulebean.orderNumber
      }],
      "datatype": "pTraveldetailQuery",
      "op": "getdata"
    }
    getApp().webCall(null, body, QUERY_ORDERINFO, that.onSuccess, that.onErrorBefore, that.onComplete);
  },
  submitEval: function () {
    var body = {
      "data": [
        {
          "token": "20181002094556OSQNUWGSG-XXICG3EIQP3DA-VQPS",
          "orderNumber": that.data.schedulebean.orderNumber,
          "userType": 0,
          "grade": that.data.star,
          "content": that.data.evalContent
        }
      ],
      "datatype": "evaluation",
      "op": "setdata"
    }
    getApp().webCall(null, body, SUBMIT_EVALUATION, that.onSuccess, that.onErrorBefore, that.onComplete);
  },
  inputListener: function (e) {
    that.setData({
      evalContent: e.detail.value
    });
  },
  submitClick:function(){
    that.submitEval();
  },
  onSuccess: function(res) {
    that.setData({
      isCanEval: Math.round(res.data[0].orderGrade) == 0?true:false,
      star: Math.round(res.data[0].orderGrade),
      name:res.data[0].driverName,
      driverStar:Math.round(res.data[0].driverGrade),
      orderNum: res.data[0].orderCount,
      carNum: res.data[0].licensePlate,
      carType: res.data[0].vehicleBrand + '·' + res.data[0].vehicleModel,
      driverPhone: res.data[0].driverPhone
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

  },
  
})