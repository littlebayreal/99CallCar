// pages/login/login.js
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //xx秒后重新发送
    send_text: '发送短信验证码',
    send_disabled: false,
    send_time: null
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
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
  sendSMSCode:function(e){
    that.setData({
      send_disabled : true
    });
    //请求接口获取短信验证码
    wx.request({
      url: 'https://99car.sanyadcyc.com',
      data:{
        "data":[{
          "phone": "15850101933",
        }],
        "datatype":"sendRandcode",
        "op":"setdata"
      },
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log("调用API失败");
      }
    })
    // 开始倒计时
    that.setData({
      //设置按下按钮的时间 整数 单位秒
      send_time: Math.round(+new Date() / 1000)
    })
    that.sendCountDown()
  },
  //倒计时
  sendCountDown: function () {
    if (that.data.send_time == null) {
      return;
    }
    var seconds = this.data.send_time + 60 - Math.round(+new Date() / 1000);
    if (seconds > 0) {
      this.setData({
        send_text:seconds+"秒后重新发送",
      })
      setTimeout(that.sendCountDown, 1000)
    } else {
      console.log("我被调用了");
      this.setData({
        send_text: '发送短信验证码',
        send_disabled: false,
        send_time: null
      })
    }
  }
})