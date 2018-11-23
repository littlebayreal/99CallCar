//index.js
//获取应用实例
const app = getApp()
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
var that;
Page({
  data: {
    titleData: ['出租车', '网约车', '电话招车', '出租车', '网约车', '电话招车'],
    navScrollLeft: 0,
    //记录正在显示的页面标签
    currentTab: 1,
    //现在叫车 还是预约叫车
    isNow: 0,
    order_times: "预约时间",
    multiArray:[],
    multiIndex:[]
  },
  onLoad: function() {
    that = this;
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'JVCBZ-5UK6J-TQGFH-FWJO6-WECYF-GJFIF'
    });
    //手动载入一遍 否则第一次点击出来是空白
    that.orderTimeListener();
  },
  onReady: function() {
    this.mapCtx = wx.createMapContext("99CallCarMap"); // 地图组件的id
    // this.movetoPosition()
  },
  toggleListener: function(e) {
    switch (e._relatedInfo.anchorTargetText) {
      case "现在":
        console.log("现在");
        that.setData({
          isNow: 0
        })
        break;
      case "预约":
        console.log("预约");
        that.setData({
          isNow: 1
        })
        break
    }
  },
  orderTimeListener: function(e) {
    var date = new Date();
    var monthDay = ['今天', '明天','后天'];
    var hours = [];
    var minute = []; // 月-日 
  
    for (var i = 0; i < 24; i++) {
      hours.push(i);
    } // 分 
    for (var i = 0; i < 60; i += 10) {
      minute.push(i);
    }
    var data = {
    multiArray: this.data.multiArray,
    multiIndex: this.data.multiIndex 
    }; 
    data.multiArray[0] = monthDay; 
    data.multiArray[1] = hours; 
    data.multiArray[2] = minute;
    that.setData(data);
  }
})