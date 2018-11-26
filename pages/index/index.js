//index.js
//获取应用实例
const app = getApp()
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
var that;
Page({
  data: {
    titleData: ['出租车', '网约车', '电话招车'],
    navScrollLeft: 0,
    //记录正在显示的页面标签
    currentTab: 1,
    //现在叫车 还是预约叫车
    isNow: 0,
    order_times: "预约时间",
    multiArray: [],
    multiIndex: []
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
  switchNav: function(e) {
    var ct = e.currentTarget.dataset.id;
    that.setData({
      currentTab: ct
    })
  },
  toggleListener: function(e) {
    switch (e.target.id) {
      case "nowBtn":
        that.setData({
          isNow: 0
        })
        break;
      case "orderBtn":
        that.setData({
          isNow: 1
        })
        break
    }
  },
  bindColumnChange: function(e){
    var date = new Date();
    var monthDay = ['今天', '明天', '后天'];
    var hours = [];
    var minute = [];

    var currentHours = date.getHours();
    var currentMinute = date.getMinutes();

    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    // 把选择的对应值赋值给 multiIndex
    data.multiIndex[e.detail.column] = e.detail.value;
    // 然后再判断当前改变的是哪一列,如果是第1列改变 
    if (e.detail.column === 0) {
      // 如果第一列滚动到第一行 
      if (e.detail.value === 0) {
        that.loadData(hours, minute);
      } else {
        that.loadHoursMinute(hours, minute);
      }
      //将时分定位到当前时间
      data.multiIndex[1] = 0;
      data.multiIndex[2] = 0;
      // 如果是第2列改变 
    } else if (e.detail.column === 1) {
      // 如果第一列为今天
      if (data.multiIndex[0] === 0) {
        if (e.detail.value === 0) {
          that.loadData(hours, minute);
        } else {
          //当选择的今天 但是时并不是当前时 分为0~50
          that.loadMinute(hours, minute);
        }
      }
      // 第一列不为今天
      else {
        that.loadHoursMinute(hours, minute);
      }
      data.multiIndex[2] = 0;
      // 如果是第3列改变 
    } else {
      // 如果第一列为'今天' 
      if (data.multiIndex[0] === 0) {
        // 如果第一列为 '今天'并且第二列为当前时间
        if (data.multiIndex[1] === 0) {
          that.loadData(hours, minute);
        } else {
          that.loadMinute(hours, minute);
        }
      } else {
        that.loadHoursMinute(hours, minute);
      }
    }
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;
    that.setData(data);
  },
  //点击选择框确定后返回的参数
  bindStartMultiPickerChange: function(e) {
    console.log(e);
    var v = [];
    v = e.detail.value;
    var day = that.data.multiArray[0][v[0]];
    var hour = that.data.multiArray[1][v[1]];
    var minute = that.data.multiArray[2][v[2]];
    var hrStr = hour.toString();
    var minStr = minute.toString();
    if (hrStr.length == 1) {
      hrStr = '0' + hrStr;
    }
    if (minStr.length == 1) {
      minStr = '0' + minStr;
    }
    that.setData({
      order_times: day + "-" + hrStr + ":" + minStr
    })
  },
  orderTimeListener: function(e) {
    console.log("走的这个");
    var monthDay = ['今天', '明天', '后天'];
    var hours = [];
    var minute = []; // 月-日

    that.loadData(hours, minute);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiArray[0] = monthDay;
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;
    that.setData(data);
  },
  loadData: function(hours, minute) {
    var date = new Date();
    //获取当前的时间
    var currentHours = date.getHours();
    var currentMinute = date.getMinutes();
    var minuteIndex;
    if (currentMinute > 0 && currentMinute <= 10) {
      minuteIndex = 10;
    } else if (currentMinute > 10 && currentMinute <= 20) {
      minuteIndex = 20;
    } else if (currentMinute > 20 && currentMinute <= 30) {
      minuteIndex = 30;
    } else if (currentMinute > 30 && currentMinute <= 40) {
      minuteIndex = 40;
    } else if (currentMinute > 40 && currentMinute <= 50) {
      minuteIndex = 50;
    } else {
      minuteIndex = 60;
    }
    if (minuteIndex == 60) {
      // 时 
      for (var i = currentHours + 1; i < 24; i++) {
        hours.push(i);
      }
      // 分 
      for (var i = 0; i < 60; i += 10) {
        minute.push(i);
      }
    } else {
      // 时 
      for (var i = currentHours; i < 24; i++) {
        hours.push(i);
      }
      // 分 
      for (var i = minuteIndex; i < 60; i += 10) {
        minute.push(i);
      }
    }
  },
  //载入完整的时分选择
  loadHoursMinute: function(hours, minute) {
    // 时 
    for (var i = 0; i < 24; i++) {
      hours.push(i);
    }
    // 分 
    for (var i = 0; i < 60; i += 10) {
      minute.push(i);
    }
  },
  loadMinute: function(hours, minute) {
    var date = new Date();
    //获取当前的时间
    var currentHours = date.getHours();
    var currentMinute = date.getMinutes();

    var minuteIndex;
    if (currentMinute > 0 && currentMinute <= 10) {
      minuteIndex = 10;
    } else if (currentMinute > 10 && currentMinute <= 20) {
      minuteIndex = 20;
    } else if (currentMinute > 20 && currentMinute <= 30) {
      minuteIndex = 30;
    } else if (currentMinute > 30 && currentMinute <= 40) {
      minuteIndex = 40;
    } else if (currentMinute > 40 && currentMinute <= 50) {
      minuteIndex = 50;
    } else {
      minuteIndex = 60;
    }
    if (minuteIndex == 60) {
      // 时 
      for (var i = currentHours + 1; i < 24; i++) {
        hours.push(i);
      }
    } else {
      // 时
      for (var i = currentHours; i < 24; i++) {
        hours.push(i);
      }
    }
    // 分
    for (var i = 0; i < 60; i += 10) {
      minute.push(i);
    }
  }
})