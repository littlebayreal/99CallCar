//index.js
//获取应用实例
const app = getApp()
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var Parser = require('../../libs/dom-parser.js');
var qqmapsdk;
var that;
Page({
  data: {
    titleData: ['出租车', '网约车', '电话招车'],
    carTypeList: [{
        name: '出租车',
        value: '出租车'
      },
      {
        name: '豪华车',
        value: '豪华车'
      },
      {
        name: '七座商务车',
        value: '七座商务车'
      },
      {
        name: '舒适车',
        value: '舒适车'
      },
      {
        name: '快车',
        value: '快车'
      },
    ],
    navScrollLeft: 0,
    //记录正在显示的页面标签
    currentTab: 1,
    //现在叫车 还是预约叫车
    isNow: 0,
    order_times: "预约时间",
    multiArray: [],
    multiIndex: [],
    //动态改变底部的样式
    bottom_clazz: 'bottom',
    //显示预计的花费价格
    showCost: true,
    isLoading: true,
    showModalStatus: false,
    carType: "",
    scale: 16,
  },
  onLoad: function() {
    that = this;
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'JVCBZ-5UK6J-TQGFH-FWJO6-WECYF-GJFIF'
    });
    wx.getLocation({
      type: "gcj02",
      success: function(res) {
        console.log(res)
        that.setData({
          cur_lng: res.longitude,
          cur_lat: res.latitude
        })
      },
    })
    //手动载入一遍 否则第一次点击出来是空白
    that.orderTimeListener();
  },
  onReady: function() {
    this.mapCtx = wx.createMapContext("99CallCarMap"); // 地图组件的id
    that.movetoPosition()
  },
  switchNav: function(e) {
    var ct = e.currentTarget.dataset.id;
    that.setData({
      currentTab: ct
    })
  },
  bottomInputListener: function(e) {
    var typeNum = '';
    switch (e.target.id) {
      case "input_origin":
        typeNum = 0;
        break;
      case "input_destination":
        typeNum = 1;
        break;
    }
    wx.navigateTo({
      url: '../selectdestination/selectdestination?type=' + typeNum,
      success: function(res) {

      },
      fail: function(res) {

      },
      complete: function(res) {

      },
    })
  },
  toggleListener: function(e) {
    switch (e.target.id) {
      case "nowBtn":
        that.setData({
          isNow: 0,
          bottom_clazz: 'bottom'
        })
        break;
      case "orderBtn":
        that.setData({
          isNow: 1,
          bottom_clazz: 'bottom_large'
        })
        break
    }
  },
  bindColumnChange: function(e) {
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
  },
  radioChange: function(e) {
    // console.log(e);
    var list = that.data.carTypeList;
    for (var i = 0; i < list.length; i++) {
      if (i == e.currentTarget.dataset.pos) {
        console.log("设置为选中");
        list[i].checked = true;
      } else {
        list[i].checked = false;
      }
    }
    for (var i = 0; i < list.length; i++) {
      console.log(list[i].checked)
    }
    that.setData({
      carTypeList: list,
      carType: e.currentTarget.dataset.value
    })
  },
  powerDrawer: function(e) {
    console.log("车辆类型:" + that.data.carType);
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function(currentStatu) {
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
    setTimeout(function() {
      // 执行第二组动画
      animation.opacity(1).rotateX(0).step();
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
  mapClickListener(e) {
    console.log(e);
    switch (e.currentTarget.id) {
      case "personal_center":
        wx.navigateTo({
          url: '../personcenter/personcenter',
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
        break;
      case "phone_call":
        wx.makePhoneCall({
          phoneNumber: '089896789'
        })
        break;
      case "current_location":
        wx.getLocation({
          type: "gcj02",
          success: function(res) {
            that.setData({
              cur_lng: res.longitude,
              cur_lat: res.latitude
            })
          },
        })
        break
    }
  },
  regionchangeListener: function(e) {
    that.mapCtx.getCenterLocation({ //getCenterLocation可以获取地图中点的经纬度
      success: function(res) {
        app.globalData.strLatitude = res.latitude //存放到全局去，供后面计算价格使用
        app.globalData.strLongitude = res.longitude
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude, //通过移动地图可以得到相应中心点的经纬度
            longitude: res.longitude,
          },
          success: function(res) {
            var o = {
              addressName: res.result.formatted_addresses.recommend,
              addressInfo: res.result.address,
              addressLocation: res.result.location
            }
            console.log(res);
            console.log("o打印：" + o.addressLocation.lng);
            that.setData({
              // origin: res.result.address, //得到的经纬度逆地址解析得到我们的位置信息
              origin: o
            })
          },
        });
      },
    })
  },
  movetoPosition: function() {
    that.mapCtx.moveToLocation();
  },
  callCarClickListener: function() {
    var body = {
      "data": [{
        "token": "979347F6010C4F8C42BDD0C3535A5735",
        "cartype": 3,
        "depProvince": "江苏省",
        "depCity": "苏州市",
        "depCounty": "吴中区",
        "depDetails": "江苏省苏州市姑苏区十梓街338号",
        "depLong": 120.63132,
        "depLat": 31.30227,
        "desProvince": "江苏省",
        "desCity": "苏州市",
        "desCounty": "吴中区",
        "desDetails": "江苏省苏州市姑苏区车站路27号",
        "desLong": 120.610814921,
        "desLat": 31.329628709,
        "isBook": 1,
        "estimateTralvelDistance": 15.6
      }],
      "datatype": "priceEstimate",
      "op": "getdata"
    }
   
    //组装请求体 
    var httpBody = "";
    httpBody += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">';
    httpBody += '<soapenv:Header/>';
    httpBody += '<soapenv:Body>';
    httpBody += '<tem:Webservice>';
    httpBody += '<tem:input>';
    httpBody += JSON.stringify(body);
    httpBody += '</tem:input>';
    httpBody += '</tem:Webservice>';
    httpBody += '</soapenv:Body>';
    httpBody += '</soapenv:Envelope>';
    wx.request({
      url: 'https://99car.sanyadcyc.com/communicate.asmx?op=Webservice',
      method: 'POST',
      header: {
        // 设置请求的 header 
        'content-type': 'text/xml; charset=utf-8',
      },
      data: httpBody,
      success: function(e) {
        //新建DOM解析对象
         var parser = new Parser.DOMParser(); 
         //基于请求到的 XML数据 来构建DOM对象 
         var xmlDoc = parser.parseFromString(e.data, "text/xml");
        var res = xmlDoc.getElementsByTagName('WebserviceResult'); 
        //得到节点数据，文本也是节点所以使用firstChild.nodeValue,只有文本节点，所以firstChild就是文本节点 
        console.log(res[0].firstChild.data); 
        //nodeValue问节点值 //转化为json对象 
        var jsond = JSON.parse(res[0].firstChild.data); 
        console.log(jsond);
      },
      fail: function(e) {
        console.log(e);
      }
    })
  }
})