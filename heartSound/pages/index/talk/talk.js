// pages/talk/talk.js

// 引入插件
const app = getApp()

var plugin = requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager()
const innerAudioContext = wx.createInnerAudioContext()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shownull:false,
    showmicro: false,
    input: '',
    content_up: '',
    content_down: '你好，我听力不好，你可以按住底部的按钮，对我说普通话'
  },

  initRecord: function () {
    var that = this
    manager.onStart = (res) => {
      that.setData({
        showmicro:true
      })
    }

    // 识别结束事件
    manager.onStop = (res) => {
      var that = this
      let text = res.result

      if (text == '') {
        this.setData({
          shownull: true
        })
        setTimeout(function () {
          that.setData({
            shownull: false
          })
        }, 500) 
      }

      this.setData({
        content_up: text,
        showmicro: false
      })
    }

  },
  //监听字的输入，实时显示在屏幕，并且content_down还会用在文字转语音（语音合成）上。
  listenInput: function (e) {
    var content = e.detail.value
    if (content == '') {
      content = '你好，我听力不好，你可以按住底部的按钮，对我说普通话'
    }
    this.setData({
      content_down: content
    })
  },

  // 清空输入框的内容
  dele: function (e) {
    this.setData({
      content_down: '',
      input: ''
    })
  },

  // 插件使用重要步骤！！

  //手指按下
  touchdown_plugin: function (e) {
    wx.stopBackgroundAudio();

    manager.start({
      lang: "zh_CN"
    })
  },
  //手指松开
  touchup_plugin: function () {

    manager.stop();
  },

  // 文字转语音（语音合成）
  wordtospeak: function (e) {
    var that = this

    var content = e.currentTarget.dataset.content

    if (content==''){
      wx.showToast({
        title: '请输入文字',
        image: '/images/fail.png',
      })
    }
    
    plugin.textToSpeech({
      lang: "zh_CN",
      tts: true,
      content: content,
      success: function (res) {
        innerAudioContext.autoplay = true
        innerAudioContext.src = res.filename
        innerAudioContext.onPlay(() => {
          console.log('开始播放')
        })
        
        wx.showLoading({
          title: '正在播放',
        })

        innerAudioContext.onError((res) => {
          if (res) {
            wx.hideLoading(),
              wx.showToast({
                title: '文本格式错误',
                image: '/images/fail.png',
              })
          }
        })

        innerAudioContext.onEnded(function(){
          wx.hideLoading()
        })
        console.log("succ tts", res.filename)
      },
      fail: function (res) {
        console.log("fail tts", res)
      },
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '心声Lite，让爱发声',
      path: '/pages/index/talk/talk',
      imageUrl: '/images/xxs.png'
    }
  },
  onLoad: function (){
    this.initRecord()
    app.getRecordAuth()
  },
})