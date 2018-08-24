//index.js
//获取应用实例
const app = getApp()

Page({
  data: {

  },
  onShareAppMessage: function () {
    return {
      title: '心声Lite，用心说话',
      desc: '语音识别，语音合成，画板涂鸦，心声Lite — 致力于为听障者服务。',
      path: '/pages/index/index',
      imageUrl:'/images/xxs.png'
    }
  },
  //事件处理函数
  gotoSmallTalk: function() {
    wx.navigateTo({
      url: '/pages/index/talk/talk'
    })
  },
  gotoLongTalk: function () {
    wx.navigateTo({
      url: '/pages/index/longtalk/longtalk'
    })
  },
  gotoDraw: function () {
    wx.navigateTo({
      url: '/pages/index/draw/draw'
    })
  },
  onLoad(){
  }
})
