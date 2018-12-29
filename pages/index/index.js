//index.js
//获取应用实例
const app = getApp();
var bmap = require('../../libs/bmap-wx.js');
var util = require('../../utils/util.js')
var lt = require('../../utils/locationTrans.js')
var Bmapsdk;
var that;
const QUERY_BANNER = 'query_banner';
const QUERY_LOGIN = 'query_login';
const QUERY_NEAR_CAR = 'query_near_car';
Page({
  data: {
    passagerList: [{
        name: '1人',
        value: '1人'
      },
      {
        name: '2人',
        value: '2人'
      },
      {
        name: '3人',
        value: '3人'
      },
      {
        name: '4人',
        value: '4人'
      },
    ],
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
    isLoading: false,
    showModalStatus: false,
    carType: "舒适车",
    scale: 16,
  },
  onLoad: function() {
    that = this;
    that.setData({
      navH: getApp().globalData.navHeight,
      bodyHeight: getApp().globalData.windowHeight - getApp().globalData.navHeight - 45,
      mapHeight: (getApp().globalData.windowHeight - getApp().globalData.navHeight - 45) * 0.6
    })
    // 实例化API核心类
    Bmapsdk = new bmap.BMapWX({
      ak: app.globalData.key
    });
    wx.getLocation({
      type: "gcj02",
      success: function(res) {
        console.log(res)
        that.setData({
          cur_lng: res.longitude,
          cur_lat: res.latitude,
          isRefresh: true
        })
        // that.showNearCar(res.longitude, res.latitude)
        that.refreshCar();
      },
    })
    //手动载入一遍 否则第一次点击出来是空白
    that.orderTimeListener();
    // that.requestLogin();
  },
  onUnload:function(){
    that.setData({
      isRefresh:false
    })
  },
  onResume: function() {
    var title = null;
    if (that.data.origin == null) {
      title = '请选择起点'
    } else if (that.data.destination == null) {
      title = '请选择目的地'
    } else if (that.data.carType == null || that.data.carType == '') {
      title = '请输入车辆类型'
    } else if (that.data.passagerNum == null || that.data.passagerNum == '') {
      title = '请输入乘坐人数'
    } else {
      that.calcuteCost()
      return;
    }
    setTimeout(n => {
      wx.showToast({
        title: title,
      })
    }, 200)

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
        break;
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
  //选择车型
  radioChange: function(e) {
    var list = that.data.showList;
    for (var i = 0; i < list.length; i++) {
      if (i == e.currentTarget.dataset.pos) {
        list[i].checked = true;
      } else {
        list[i].checked = false;
      }
    }
    that.setData({
      showList: list,
      radioValue: e.currentTarget.dataset.value
    })

  },
  calcuteCost: function() {
    var depBD = lt.gcj02tobd09(that.data.origin.addressLocation.lng, that.data.origin.addressLocation.lat);
    var desBD = lt.gcj02tobd09(that.data.destination.addressLocation.lng,
      that.data.destination.addressLocation.lat)
    var body = {
      "data": [{
        "token": "979347F6010C4F8C42BDD0C3535A5735",
        "cartype": 3,
        "depProvince": that.data.origin.provinceCityDistrict.province,
        "depCity": that.data.origin.provinceCityDistrict.city,
        "depCounty": that.data.origin.provinceCityDistrict.district,
        "depDetails": that.data.origin.addressInfo,
        "depLong": depBD[0],
        "depLat": depBD[1],
        "desProvince": that.data.destination.provinceCityDistrict.province,
        "desCity": that.data.destination.provinceCityDistrict.city,
        "desCounty": that.data.destination.provinceCityDistrict.district,
        "desDetails": that.data.destination.addressInfo,
        "desLong": desBD[0],
        "desLat": desBD[1],
        "isBook": that.data.isNow,
        "estimateTralvelDistance": util.getDistance(that.data.origin.addressLocation.lat, that.data.origin.addressLocation.lng, that.data.destination.addressLocation.lat, that.data.destination.addressLocation.lng)
      }],
      "datatype": "priceEstimate",
      "op": "getdata"
    }
    that.setData({
      showCost: true,
      isLoading: true
    });
    app.webCall(null, body, QUERY_BANNER, that.onSuccess, that.onErrorBefore, that.onComplete);
  },
  onSuccess: function(res, requestCode) {
    switch (requestCode) {
      case QUERY_BANNER:
        that.setData({
          cost: res.data[0].price
        })
        break;
      case QUERY_NEAR_CAR:
        var datas = res.data;
        var points = [];
        for (var i in datas) {
          var loc_gcj02 = lt.wgs84togcj02(datas[i].long, datas[i].lat);
          points.push({ latitude: loc_gcj02[1], longitude: loc_gcj02[0] });
          that.setData({
            markers: [{
              iconPath: "../../image/map_car.png",
              id: i,
              latitude: points[0].latitude,
              longitude: points[0].longitude,
              width: 15,
              height: 30
            }]
          })
        }
        
        break;
    }

  },
  onErrorBefore: function(statusCode, errorMessage, requestCode) {
    console.log("错误处理")
  },
  onComplete: function(res) {
    that.setData({
      isLoading: false
    })
  },
  powerDrawer: function(e) {
    console.log("类型状态:" + e.currentTarget.dataset.statu);
    console.log("点选类型:" + e.currentTarget.dataset.type);
    var currentStatu = e.currentTarget.dataset.statu;
    var sType = e.currentTarget.dataset.type;
    that.util(sType, currentStatu);

    if (currentStatu == 'open') return;
    //每次选中车型都计算一次预计行程花费
    that.onResume();
    // if (that.data.origin == null) {
    //   wx.showToast({
    //     title: '请输入出发点',
    //   })
    //   return;
    // }
    // if (that.data.destination == null) {
    //   wx.showToast({
    //     title: '请输入目的地',
    //   })
    //   return;
    // }
    // that.calcuteCost();
  },
  util: function(sType, currentStatu) {
    if (sType == 0) {
      that.setData({
        sType: 0,
        showList: that.data.carTypeList
      })
    } else {
      that.setData({
        sType: 1,
        showList: that.data.passagerList
      })
    }
    // /* 动画部分 */
    // // 第1步：创建动画实例 
    // var animation = wx.createAnimation({
    //   duration: 200, //动画时长
    //   timingFunction: "linear", //线性
    //   delay: 0 //0则不延迟
    // });

    // // 第2步：这个动画实例赋给当前的动画实例
    // this.animation = animation;

    // // 第3步：执行第一组动画
    // animation.opacity(0).rotateX(-100).step();

    // // 第4步：导出动画对象赋给数据对象储存
    // this.setData({
    //   animationData: animation.export()
    // })

    // // 第5步：设置定时器到指定时候后，执行第二组动画
    // setTimeout(function() {
    //   // 执行第二组动画
    //   animation.opacity(1).rotateX(0).step();
    //   // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
    //   this.setData({
    //     animationData: animation
    //   })

    //关闭
    if (currentStatu == "close") {
      console.log("好奇怪:" + that.data.sType);
      if (that.data.sType == 0) {
        this.setData({
          showModalStatus: false,
          carType: that.data.radioValue
        });
      } else {
        this.setData({
          showModalStatus: false,
          passagerNum: that.data.radioValue
        });
      }
    }
    // }.bind(this), 200)

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
        })
        // wx.navigateTo({
        //   url: '../authorize/authorize',
        // })
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
        break;
    }
  },
  regionchangeListener: function(e) {
    console.log(e);
    if (e.type == "begin") {
      that.setData({
        isRefresh: false
      })
    }
    if (e.type = "end") {
      that.setData({
        isRefresh: true
      });
      that.mapCtx.getCenterLocation({ //getCenterLocation可以获取地图中点的经纬度
        type: "gcj02",
        success: function(res) {
          Bmapsdk.regeocoding({
            location: res.latitude + ',' + res.longitude,
            success: function(res) {
              console.log(res);
              var o = {
                addressName: res.originalData.result.formatted_address,
                addressInfo: res.originalData.result.sematic_description,
                addressLocation: res.originalData.result.location,
                provinceCityDistrict: res.originalData.result.addressComponent
              }
              console.log(res);
              console.log("o打印：" + o.addressLocation.lng);
              that.setData({
                // origin: res.result.address, //得到的经纬度逆地址解析得到我们的位置信息
                origin: o
              })
            },
            fail: function() {},
          });
        },
      })
    }
  },
  movetoPosition: function() {
    that.mapCtx.moveToLocation();
  },
  //叫车的方法
  callCarClickListener: function() {
    var callVehicleLevel = null;
    switch (that.data.carType) {
      case '豪华车':
        callVehicleLevel = 1;
        break;
      case '七座商务车':
        callVehicleLevel = 2;
        break;
      default:
        callVehicleLevel = 3;
        break;
    }
    if (that.data.isNow == 1) {
      var orderTime = null;
      var sday = that.data.order_times.substring(0, 2);
      var stime = that.data.order_times.substring(3, 8);
      var year, month, day;
      var date = new Date();
      switch (sday) {
        case '今天':
          year = date.getFullYear();
          month = date.getMonth() + 1;
          day = date.getDate();
          sday = [year, month, day].map(util.formatNumber).join('-');
          break;
        case '明天':
          year = date.getFullYear()
          month = date.getMonth() + 1
          day = date.getDate() + 1
          sday = [year, month, day].map(util.formatNumber).join('-')
          break;
        case '后天':
          year = date.getFullYear()
          month = date.getMonth() + 1
          day = date.getDate() + 2
          sday = [year, month, day].map(util.formatNumber).join('-')
          break;
      }
      stime = stime + ':00';
      orderTime = sday + ' ' + stime;
      console.log("orderTime:" + orderTime);
    }
    var originJson = JSON.stringify(that.data.origin);
    var destinctionJson = JSON.stringify(that.data.destination);
    var params = {
      passagerNumber: parseInt(that.data.passagerNum.substring(0, 1)),
      price: that.data.cost,
      callVehicleLevel: callVehicleLevel,
      callVehicleOpType: that.data.carType == '出租车' ? 1 : 0,
      bookTime: that.data.isNow == 1 ? orderTime : '',
      driverCode: that.data.driverCode,
      codetime: that.data.codetime,
      ordermethod: that.data.isScan ? 1 : 0,
    };
    var paramsJson = JSON.stringify(params);
    wx.navigateTo({
      url: '../wait/wait?originJson=' + originJson + '&destinctionJson=' + destinctionJson + '&paramsJson=' + paramsJson,
    })
  },
  refreshCar: function() {
    if (!that.data.isRefresh) return;
    // var seconds = Math.round(+new Date() / 1000) - this.data.wait_time;
    // if (seconds <= this.data.limitTime) {
    //   that.setData({
    //     time: that.parseTime(seconds),
    //   })
    that.showNearCar();
    //10秒刷新一下附近的车
    setTimeout(that.refreshCar, 10000);
  },
  showNearCar: function() {
    var square = util.returnLLSquarePoint(that.data.cur_lng, that.data.cur_lat, 5000);
    console.log("当前坐标:" + that.data.cur_lng + "--" + that.data.cur_lat + "左上角坐标：" + square[0][0] + "--" + square[0][1] +
      "右下角坐标:" + square[3][0] + "--" + square[3][1]);
    var curWGS = lt.gcj02towgs84(that.data.cur_lng, that.data.cur_lat);
    var leftTopWGS = lt.gcj02towgs84(square[0][1], square[0][0]);
    var rightBottomWGS = lt.gcj02towgs84(square[3][1], square[3][0]);
    var callVehicleLevel = null;
    switch (that.data.carType) {
      case '豪华车':
        callVehicleLevel = 1;
        break;
      case '七座商务车':
        callVehicleLevel = 2;
        break;
      default:
        callVehicleLevel = 3;
        break;
    }
    var body = {
      "data": [{
        "token": "9B58BBB28337BA5FB30D245F53448F04",
        "currLong": curWGS[0].toString(),
        "currLat": curWGS[1].toString(),
        "leftTopLong": leftTopWGS[0].toFixed(6),
        "letfTopLat": leftTopWGS[1].toFixed(6),
        "rightDownLong": rightBottomWGS[0].toFixed(6),
        "rightDownLat": rightBottomWGS[1].toFixed(6),
        "vehicleType": that.data.carType == '出租车' ? 1 : 0,
        "vehicleLevel": callVehicleLevel
      }],
      "datatype": "queryNearVehicle",
      "op": "getdata"
    }
    app.webCall(null, body, QUERY_NEAR_CAR, that.onSuccess, that.onErrorBefore, that.onComplete);
  }
})