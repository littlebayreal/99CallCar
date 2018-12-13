// pages/evaluation/evaluation.js
var that;
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
      '非常好'],
  },
  myStarChoose(e) {
    console.log(e);
    if(e.target.dataset.star == null)return;
    let star = parseInt(e.target.dataset.star) || 0;
    this.setData({
      star: star,
    });
  },
  toIndex:function(){
    // 返回上一个页面（这个API不允许跟参数）
    var pages = getCurrentPages();
    wx.navigateBack({
      delta: pages.length - 1
    })
  },
  navBack: function () {
    // 返回上一个页面（这个API不允许跟参数）
    that.toIndex();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      navH: getApp().globalData.navHeight,
      bodyHeight: getApp().globalData.windowHeight - getApp().globalData.navHeight,
      
    })
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
  
  }
})