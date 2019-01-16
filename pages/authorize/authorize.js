// pages/authorize/authorize.js
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
    that.setData({
      navH: getApp().globalData.navHeight,
      bodyHeight: getApp().globalData.windowHeight - getApp().globalData.navHeight,
    });

    //获取用户信息
    //获取用户授权信息
    wx.getSetting({
      success: res => {
        console.log("userInfo" + JSON.stringify(res));
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              console.log("请求结果" + JSON.stringify(res));
              getApp().globalData.userInfo.nickName = res.userInfo.nickName;
              getApp().globalData.userInfo.avatarUrl = res.userInfo.avatarUrl;
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  userInfoReadyCallback: function(res) {
    wx.redirectTo({
      url: '../index/index',
    })
  },
  authorize: function(e) {
    //点击了授权登陆
    if (e.detail.userInfo) {
      console.log("点击了授权登陆:" + JSON.stringify(e.detail.userInfo));
      // getApp().globalData.userInfo = e.detail.userInfo;
      getApp().globalData.userInfo.nickName = e.detail.userInfo.nickName;
      getApp().globalData.userInfo.avatarUrl = e.detail.userInfo.avatarUrl;
      if (this.userInfoReadyCallback) {
        this.userInfoReadyCallback(null)
      }
    } else { //没点击授权登陆
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
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