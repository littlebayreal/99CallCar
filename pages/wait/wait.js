// pages/wait/wait.js
var that;
const PLACE_ORDER = 'place_order';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    progress_txt: '已等待',
    waitTimer: null,
    time: '00:00',
    //单位秒 3分钟
    limitTime: 10,
    wait_time: null,
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
    that.setData({
      navH: getApp().globalData.navHeight,
      bodyHeight: getApp().globalData.windowHeight - getApp().globalData.navHeight,
      origin: originbean,
      destinction: destinctionbean,
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
      if (seconds % 5 == 0) {
        console.log("五秒发一次");
        that.introduceOrder();
      }
      setTimeout(that.countInterval, 1000);
    } else {
      //暂时模拟等到车辆接单
      //保存订单号以及订单信息到本地
      var d = {
        "orderNumber": "123456789",
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
        "pricie": that.data.requestParam.pricie,
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
      wx.navigateTo({
        url: '../waitDriver/waitDriver',
      })
    }
  },
  introduceOrder: function() {
    var body = {
      "data": [{
        "token": "979347F6010C4F8C42BDD0C3535A5735",
        "depProvince": that.data.origin.provinceCityDistrict.province,
        "depCity": that.data.origin.provinceCityDistrict.city,
        "depCounty": that.data.origin.provinceCityDistrict.county,
        "depDetails": that.data.origin.addressInfo,
        "depLong": that.data.origin.addressLocation.lng,
        "depLat": that.data.origin.addressLocation.lat,
        "desProvince": that.data.destinction.provinceCityDistrict.province,
        "desCity": that.data.destinction.provinceCityDistrict.city,
        "desCounty": that.data.destinction.provinceCityDistrict.county,
        "desDetails": that.data.destinction.addressInfo,
        "desLong": that.data.destinction.addressLocation.lng,
        "desLat": that.data.destinction.addressLocation.lat,
        "passengerNumber": 2,
        "addtime": "2018-12-06 18:00:00",
        "pricie": "0.0",
        "callVehicleLevel": 3,
        "callVehicleOpType": 0,
        "bookTime": "2018-12-06 18:30:00",
        // "driverCode": null,
        // "codetime": null,
        "orderSource": 6,
        "orderMethod": 0
      }],
      "datatype": "placeOrder",
      "op": "setdata"
    };
    that.setData({
      requestParam: body.data[0]
    })
    getApp().webCall(null, body, PLACE_ORDER, that.onSuccess, that.onErrorBefore, that.onComplete);
  },
  onSuccess: function(res, requestCode) {
    //真正接到订单的时候
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
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    that.util(currentStatu);
    
    console.log("什么情况"+e.currentTarget.id)
    if (e.currentTarget.id == 'btn_ok'){
      
      //取消订单  返回主页
      wx.navigateBack({
        delta:1
      })
    }
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长
      timingFunction: "linear", //线性
      delay: 0 //0则不延迟
    });

    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;

    // 第3步：执行第一组动画
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function () {
      // 执行第二组动画
      animation.opacity(0.7).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })

      //关闭
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)

    // 显示
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
    }
  },
  //选择车型
  radioChange: function (e) {
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