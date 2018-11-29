// pages/selectdestination/selectdestination.js
var that;
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    addressList: [{
        addressName: '三亚站',
        addressInfo: ''
      },
      {
        addressName: '三亚凤凰国际机场',
        addressInfo: ''
      }, {
        addressName: '解放路步行街',
        addressInfo: ''
      },
      {
        addressName: '三亚明珠广场',
        addressInfo: ''
      },
      {
        addressName: '三亚农垦医院',
        addressInfo: ''
      },
      {
        addressName: '三亚人民医院',
        addressInfo: ''
      },
      {
        addressName: '金润阳光购物广场',
        addressInfo: ''
      },
      {
        addressName: '大菠萝广场',
        addressInfo: ''
      },
      {
        addressName: '大东海旅游区',
        addressInfo: ''
      },
      {
        addressName: '亚龙湾站',
        addressInfo: ''
      },
      {
        addressName: '第一市场',
        addressInfo: ''
      },
      {
        addressName: '友谊路下岗职工海鲜加工广场',
        addressInfo: ''
      },
      {
        addressName: '春园海鲜广场',
        addressInfo: ''
      },
      {
        addressName: '天涯海角',
        addressInfo: ''
      },
      {
        addressName: '南山寺',
        addressInfo: ''
      }
    ]
  },
  itemOnclickListener: function(e) {
    var pages = getCurrentPages() //获取加载的页面( 页面栈 )
    var currentPage = pages[pages.length - 1] // 获取当前页面
    var prevPage = pages[pages.length - 2] //获取上一个页面
    　　 // 设置上一个页面的数据（可以修改，也可以新增
    switch(that.data.type){
      case 0:
        prevPage.setData({
          origin: e.currentTarget.dataset.item.addressName
        })
      break;
      case 1:
        prevPage.setData({
          destination: e.currentTarget.dataset.item.addressName
        })
      break;
    }
   // 返回上一个页面（这个API不允许跟参数）
    wx.navigateBack({
      delta: 1
    })
  },
  inputChangeListener: function(e) {
    console.log(e);
    qqmapsdk.getSuggestion({
      region: "苏州",
      keyword: e.detail.value,
      key: "JVCBZ-5UK6J-TQGFH-FWJO6-WECYF-GJFIF",
      success: function(res) {
        var al = [];
        var datas = res.data;
        for (var i = 0; i < 10; i++) {
          var data={
            addressName:datas[i].title,
            addressInfo:datas[i].address
          }
          al.push(data);
        }
        that.setData({
          addressList:al
        })
      },

      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        console.log(res);
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    qqmapsdk = new QQMapWX({
      key: 'JVCBZ-5UK6J-TQGFH-FWJO6-WECYF-GJFIF'
    });
    that = this;
    switch (options.type) {
      case '0':
        console.log("没走到吗");
        that.setData({
          type: 0,
          placeholder: "请输入出发地"
        })
        break;
      case '1':
        that.setData({
          type: 1,
          placeholder: "请输入目的地"
        })
        break;
    }
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

  }
})