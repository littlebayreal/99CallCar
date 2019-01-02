// pages/myschedule/myschedule.js
var that;
const QUERY_SCHEDULE = 'query_schedule';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isNoData: false,
    radioValues: [{
        'value': '网约车行程',
        'selected': true
      },
      {
        'value': '出租车行程',
        'selected': false
      }
    ],
    myscheduleData: [],
    currentPage: 0,
    pageSize: 10
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    // 刷新组件
    this.refreshView = this.selectComponent("#refreshView");

    this.setData({
      navH: getApp().globalData.navHeight,
      bodyHeight: getApp().globalData.windowHeight - getApp().globalData.navHeight,
    })
    // this.clazzStatus();
    that.request(0, 10);
  },
  navBack: function() {
    // 返回上一个页面（这个API不允许跟参数）
    wx.navigateBack({
      delta: 1
    })
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
    this.refreshView.setData({
      topDistance: getApp().globalData.navHeight
    })
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
  // indexChanged: function(e) {
  //   // 点中的是组中第个元素 
  //   var index = e.target.dataset.index;
  //   // 读取原始的数组 
  //   var radioValues = this.data.radioValues;
  //   for (var i = 0; i < radioValues.length; i++) {
  //     // 全部改为非选中 
  //     radioValues[i].selected = false;
  //     // 当前那个改为选中 
  //     radioValues[index].selected = true;
  //   }
  //   // 写回数据 
  //   this.setData({
  //     radioValues: radioValues
  //   });
  //   // clazz状态 
  //   this.clazzStatus();
  // },
  // clazzStatus: function() {
  //   /* 此方法分别被加载时调用，点击某段时调用 */ // class样式表如"selected last","selected" 
  //   var clazz = [];
  //   // 参照数据源
  //   var radioValues = this.data.radioValues;
  //   for (var i = 0; i < radioValues.length; i++) {
  //     // 默认为空串，即普通按钮 
  //     var cls = '';
  //     // 高亮，追回selected 
  //     if (radioValues[i].selected) {
  //       cls += 'selected ';
  //     }
  //     // 最后个元素, 追加last 去掉右侧的竖线
  //     if (i == radioValues.length - 1) {
  //       cls += 'last ';
  //     }
  //     //去掉尾部空格 
  //     cls = cls.replace(/(\s*$)/g, '');
  //     clazz[i] = cls;
  //   }
  //   // 写回数据 
  //   this.setData({
  //     clazz: clazz
  //   });
  // },
  request: function(page, pageSize) {
    console.log("页码:" + page);
    var body = {
      "data": [{
        "token": "979347F6010C4F8C42BDD0C3535A5735",
        "userType": 0,
        "page": page,
        "pageSize": pageSize
      }],
      "datatype": "travelQuery",
      "op": "transformdata"
    }
    getApp().webCall(null, body, QUERY_SCHEDULE, that.onSuccess, that.onErrorBefore, that.onComplete);
  },
  onSuccess: function(res) {
    var items = res.data;
    for (var i in items) {
      that.data.myscheduleData.push(items[i]);
    }
    for (var i = 0; i < that.data.myscheduleData.length; i++) {
      if (that.checkRate(that.data.myscheduleData[i].state)) {
        console.log("什么情况:" + that.data.myscheduleData.state)
        var item = that.data.myscheduleData[i];
        item.state = getApp().getOrderStatusString(item.state);
      }
    };
    that.setData({
      myscheduleData: that.data.myscheduleData
    })
    wx.showToast({
      title: '刷新成功',
    })
  },
  onErrorBefore: function(e) {

  },
  onComplete: function() {
    that.refreshView.stopPullRefresh();
  },
  checkRate: function(number) {　　
    var re = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/
    var num = number;
    if (!re.test(num)) {　　　
      return false;　　
    } else
      return true;
  },
  listBottom: function(event) {
    if (this.data.isUpScroll) {
      that.request(that.data.currentPage + 1, 10);
      that.setData({
        currentPage: that.data.currentPage + 1
      })
      wx.showToast({
        title: '加载更多',
      })
    }
  },
  //解决往上回滚也会出发触底事件的bug
  scrollHandle: function(event) {
    if (event.detail.deltaY > 0) {
      this.setData({
        isUpScroll: false
      })
    } else {
      this.setData({
        isUpScroll: true
      })
    }
  },
  onItemClick: function(e) {
    var scheduleJson = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: '../evaluation/evaluation?scheduleJson=' + scheduleJson + '&type=1',
    })
  },
  //触摸开始
  handletouchstart: function(event) {
    this.refreshView.handletouchstart(event)
  },
  //触摸移动
  handletouchmove: function(event) {
    this.refreshView.handletouchmove(event)
  },
  //触摸结束
  handletouchend: function(event) {
    this.refreshView.handletouchend(event)
  },
  //触摸取消
  handletouchcancel: function(event) {
    this.refreshView.handletouchcancel(event)
  },
  //页面滚动
  onPageScroll: function(event) {
    this.refreshView.onPageScroll(event)
  },
  onPullDownRefresh: function() {
    // setTimeout(() => {
    //   this.refreshView.stopPullRefresh()
    // }, 2000)
    that.setData({
      myscheduleData: [],
      currentPage: 0
    })
    that.request(0, 10);
  }
})