//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    //获取用户授权信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

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
  getOrderStatusString: function(status) {
    switch (status) {
      case 0:
        return "派单中";
      case 1:
        return "司机接单";
      case 2:
        return "到达约定地点";
      case 3:
        return "接到乘客";
      case 4:
        return "行程开始";
      case 5:
        return "待支付";
      case 6:
        return "已完成";
      case 7:
        return "乘客取消";
      case 8:
        return "司机撤销";
      case 9:
        return "司机违约"
      case 10:
        status = "到达目的地"
        break;
      case 11:
        return "订单超时";
      case 12:
        return "抢单失败";
      case 13:
        return "预约订单行程还未开始";
      case 14:
        return "系统取消订单";
    }
  },
  globalData: {
    userInfo: null
  }
})