//app.js
var Parser = require('/libs/dom-parser.js');
var md5 = require('/libs/md5.js')
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取手机系统信息
    wx.getSystemInfo({
        success: res => {
          //导航高度
          this.globalData.navHeight = res.statusBarHeight + 46;
          this.globalData.windowHeight = res.windowHeight;
        },
        fail(err) {
          console.log(err);
        }
      }),
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          console.log("登录结果:" + JSON.stringify(res))
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
        return "司机违约";
      case 10:
        return "到达目的地";
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
  /**
   * 接口公共访问方法
   * @param {Object} urlPath 访问路径
   * @param {Object} params 访问参数（json格式）
   * @param {Object} requestCode 访问码，返回处理使用
   * @param {Object} onSuccess 成功回调
   * @param {Object} onErrorBefore 失败回调
   * @param {Object} onComplete 请求完成（不管成功或失败）回调
   * @param {Object} isVerify 是否验证重复提交
   * @param {Object} requestType 请求类型（默认POST）
   * @param {Object} retry 访问失败重新请求次数（默认1次）
   */
  webCall: function(urlPath, params, requestCode, onSuccess, onErrorBefore, onComplete, isVerify, requestType, retry) {
    var params = arguments[1] ? arguments[1] : {};
    //var requestCode = arguments[2] ? arguments[2] : 1;
    var onSuccess = arguments[3] ? arguments[3] : function() {};
    var onErrorBefore = arguments[4] ? arguments[4] : this.onError;
    var onComplete = arguments[5] ? arguments[5] : this.onComplete;
    var isVerify = arguments[6] ? arguments[6] : false;
    var requestType = arguments[7] ? arguments[7] : "POST";
    var retry = arguments[8] ? arguments[8] : 1;
    var that = this;
    //防止重复提交，相同请求间隔时间不能小于500毫秒 
    var nowTime = new Date().getTime();
    if (this.globalData.requestCount[requestCode] && (nowTime - this.globalData.requestCount[requestCode]) < 500) {
      return;
    }
    //设置数组的子参数
    this.globalData.requestCount[requestCode] = nowTime;
    console.log(this.globalData.requestCount);
    //是否验证重复提交 
    if (isVerify) {
      if (this.globalData.verifyCount[requestCode]) {
        return;
      }
      this.globalData.verifyCount[requestCode] = true; //重复验证开关开启 
    }
    //组装请求体 
    var httpBody = "";
    httpBody += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">';
    httpBody += '<soapenv:Header/>';
    httpBody += '<soapenv:Body>';
    httpBody += '<tem:Webservice>';
    httpBody += '<tem:input>';
    httpBody += JSON.stringify(params);
    httpBody += '</tem:input>';
    httpBody += '</tem:Webservice>';
    httpBody += '</soapenv:Body>';
    httpBody += '</soapenv:Envelope>';
    wx.request({
      url: 'https://99car.sanyadcyc.com/communicate.asmx?op=Webservice',
      data: httpBody,
      method: requestType, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT      
      header: {
        // 'content-type': requestType == 'POST' ? 'application/x-www-form-urlencoded' : 'application/json'
        'content-type': 'text/xml; charset=utf-8',
      },
      // 设置请求的header 
      success: function(res) {
        console.log(res);
        if (res.data) {
          if (res.statusCode == 200) { //访问成功 
            //新建DOM解析对象
            var parser = new Parser.DOMParser();
            //基于请求到的 XML数据 来构建DOM对象 
            var xmlDoc = parser.parseFromString(res.data, "text/xml");
            var re = xmlDoc.getElementsByTagName('WebserviceResult');
            //得到节点数据，文本也是节点所以使用firstChild.nodeValue,只有文本节点，所以firstChild就是文本节点 
            console.log(re[0].firstChild.data);
            //nodeValue问节点值 //转化为json对象 
            var jsond = JSON.parse(re[0].firstChild.data);
            console.log("返回结果：" + jsond);
            onSuccess(jsond, requestCode);
          } else if (res.data.statusCode == 300000001) {
            // 未登录 
            that.isLogin = false;
            onErrorBefore(0, res.data.message, requestCode);
          } else {
            onErrorBefore(0, res.data.message == null ? "请求失败 , 请重试" : res.data.message, requestCode);
          }
        } else {
          onErrorBefore(0, "请求失败 , 请重试", requestCode);
        }
      },
      fail: function(res) {
        retry--;
        console.log("网络访问失败：" + JSON.stringify(res));
        if (retry > 0) return that.webCall(urlPath, params, requestCode, onSuccess, onErrorBefore, onComplete, requestType, retry);
      },
      complete: function(res) {
        onComplete(requestCode);
        //请求完成后，2秒后重复验证的开关关闭 
        if (isVerify) {
          setTimeout(function() {
            that.globalData.verifyCount[requestCode] = false;
          }, 2000);
        }
      }
    })
  },
  onComplete: function(res) {},
  onError: function(statusCode, errorMessage, requestCode) {},
  //出租车相关请求的接口
  webCallForTexi: function(urlPath, params,timeStamp,requestCode, onSuccess, onErrorBefore, onComplete, isVerify, requestType, retry) {
    var params = arguments[1] ? arguments[1] : {};
    var onSuccess = arguments[4] ? arguments[4] : function() {};
    var onErrorBefore = arguments[5] ? arguments[5] : this.onError;
    var onComplete = arguments[6] ? arguments[6] : this.onComplete;
    var isVerify = arguments[7] ? arguments[7] : false;
    var requestType = arguments[8] ? arguments[8] : "POST";
    var retry = arguments[9] ? arguments[9] : 1;
    var that = this;
    //防止重复提交，相同请求间隔时间不能小于500毫秒 
    var nowTime = new Date().getTime();
    if (this.globalData.requestCountForTexi[requestCode] && (nowTime - this.globalData.requestCountForTexi[requestCode]) < 500) {
      return;
    }
    //设置数组的子参数
    this.globalData.requestCountForTexi[requestCode] = nowTime;
    console.log(this.globalData.requestCountForTexi);
    //是否验证重复提交 
    if (isVerify) {
      if (this.globalData.verifyCountForTexi[requestCode]) {
        return;
      }
      this.globalData.verifyCountForTexi[requestCode] = true; //重复验证开关开启 
    }
    //sn生成
    var base_string = 'GET' + "ak=" + 'A01' + "av=" + '1.22' + "iv=" + '2.1' + "params=" + encodeURIComponent(JSON.stringify(params)) + "st=" + 'MD5' + "ts=" + timeStamp +'b024dwa5f10346f1a295e6v422ed0334';
    console.log("base_string:" + base_string);
    var base_string_code = encodeURIComponent(base_string);
    console.log("base_string_code:" + base_string_code);
    var base_string_md5 = (md5.hexMD5(base_string_code)).toString();
    console.log("编译出来的MD5:"+base_string_md5);
    base_string_md5 = base_string_md5.substring(8,24).toUpperCase();
    var body = "sn=" + base_string_md5 + "&st=MD5&iv=2.1&ts=" + timeStamp + "&ak=A01&params=" + encodeURIComponent(JSON.stringify(params))+"&av=1.22";
    console.log("请求的参数:" + body);
    wx.request({
      url: 'https://syznjt.cn:41001/OrderSrv/passengerApp/' + urlPath + "?" + body,
      method: requestType, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT      
      header: {
        // 'content-type': requestType == 'POST' ? 'application/x-www-form-urlencoded' : 'application/json'
        'content-type': 'text/xml; charset=utf-8',
      },
      success: function(res) {
        console.log("出租车请求:"+ JSON.stringify(res));
        if(res.statusCode == '200'){
          onSuccess(res.data,requestCode);
        }else{
          onErrorBefore(0, "请求失败 , 请重试", requestCode);
        }
      },
      fail: function(res) {
        retry--;
        console.log("网络访问失败：" + JSON.stringify(res));
        if (retry > 0) return that.webCall(urlPath, params, requestCode, onSuccess, onErrorBefore, onComplete, requestType, retry);
      },
      complete: function(res) {
        onComplete(requestCode);
        //请求完成后，2秒后重复验证的开关关闭 
        if (isVerify) {
          setTimeout(function() {
            that.globalData.verifyCountForTexi[requestCode] = false;
          }, 2000);
        }
      }
    })
  },
  globalData: {
    key: '7OBV901GBwqGiW6uAeRVonRhC6ERr2SO',
    userInfo: {
      token:'979347F6010C4F8C42BDD0C3535A5735'
    },
    mobilenumber:"18262041404",
    requestCount: [],
    verifyCount: [],
    requestCountForTexi: [],
    verifyCountForTexi: [],
  }
})