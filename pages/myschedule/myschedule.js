// pages/myschedule/myschedule.js
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
    myscheduleData: [{
        "orderNumber": "XXXXXX",
        "orderTime": "2016-10-3 8:00",
        "depTime": "2016-10-3 8:10",
        "desTime": "2017-10-3 8:52",
        "orderSource": "3",
        "dep": "苏州站",
        "des": "南大研究生院-公交站",
        "receivableMoney": "11.5",
        "actualMoney": "11.5",
        "state": 9,
      },
      {
        "orderNumber": "XXXXXX",
        "orderTime": "2016-10-3 8:00",
        "depTime": "2016-10-3 8:10",
        "desTime": "2017-10-3 8:52",
        "orderSource": "3",
        "dep": "苏州站",
        "des": "南大研究生院-公交站",
        "receivableMoney": "11.5",
        "actualMoney": "11.5",
        "state": 9
      },
      {
        "orderNumber": "XXXXXX",
        "orderTime": "2016-10-3 8:00",
        "depTime": "2016-10-3 8:10",
        "desTime": "2017-10-3 8:52",
        "orderSource": "3",
        "dep": "苏州站",
        "des": "南大研究生院-公交站",
        "receivableMoney": "11.5",
        "actualMoney": "11.5",
        "state": 9
      },
      {
        "orderNumber": "XXXXXX",
        "orderTime": "2016-10-3 8:00",
        "depTime": "2016-10-3 8:10",
        "desTime": "2017-10-3 8:52",
        "orderSource": "3",
        "dep": "苏州站",
        "des": "南大研究生院-公交站",
        "receivableMoney": "11.5",
        "actualMoney": "11.5",
        "state": 9
      },
      {
        "orderNumber": "XXXXXX",
        "orderTime": "2016-10-3 8:00",
        "depTime": "2016-10-3 8:10",
        "desTime": "2017-10-3 8:52",
        "orderSource": "3",
        "dep": "苏州站",
        "des": "南大研究生院-公交站",
        "receivableMoney": "11.5",
        "actualMoney": "11.5",
        "state": 9
      },
      
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var items = this.data.myscheduleData;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      item.state = getApp().getOrderStatusString(item.state);
    };
    this.setData({
      myscheduleData:items
    })
    this.clazzStatus();
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
  indexChanged: function(e) {
    // 点中的是组中第个元素 
    var index = e.target.dataset.index;
    // 读取原始的数组 
    var radioValues = this.data.radioValues;
    for (var i = 0; i < radioValues.length; i++) {
      // 全部改为非选中 
      radioValues[i].selected = false;
      // 当前那个改为选中 
      radioValues[index].selected = true;
    }
    // 写回数据 
    this.setData({
      radioValues: radioValues
    });
    // clazz状态 
    this.clazzStatus();
  },
  clazzStatus: function() {
    /* 此方法分别被加载时调用，点击某段时调用 */ // class样式表如"selected last","selected" 
    var clazz = [];
    // 参照数据源
    var radioValues = this.data.radioValues;
    for (var i = 0; i < radioValues.length; i++) {
      // 默认为空串，即普通按钮 
      var cls = '';
      // 高亮，追回selected 
      if (radioValues[i].selected) {
        cls += 'selected ';
      }
      // 最后个元素, 追加last 去掉右侧的竖线
      if (i == radioValues.length - 1) {
        cls += 'last ';
      }
      //去掉尾部空格 
      cls = cls.replace(/(\s*$)/g, '');
      clazz[i] = cls;
    }
    // 写回数据 
    this.setData({
      clazz: clazz
    });
  }
})