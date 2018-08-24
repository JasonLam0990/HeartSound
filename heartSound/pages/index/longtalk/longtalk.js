const app = getApp()

var plugin = requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager()
const innerAudioContext = wx.createInnerAudioContext()

Page({
  data: {
    recording:false,
    scrollTop: 10000,
    content:[
      {
        'content':'可用于和别人较长时间的交谈，请对方戴上耳机交谈会更加方便，识别也更加清晰。',
        'person':'me'
      }
    ],
    ison:false,
    now:'me',
    content_now:'',
    content_temp:'',
    addinput: '',//清楚input框的值
  },
  initRecord: function () {
    var that = this

    manager.onStart = (res) => {

    }

    manager.onRecognize = (res) => {
      var content_temp = that.data.content_temp
      if (content_temp == res.result){

      }else{
        var array = []
        array = that.data.content
        console.log(array)

        var a = content_temp
        var b = res.result
        var text = b.slice(a.length, b.length)

        var temp = {
          'content': text,
          'person': 'you'
        }
        array.push(temp)
        console.log(array)
        that.setData({
          content: array,
          content_temp: res.result,
          scrollTop: that.data.scrollTop + 100
        })
      }
    }

    // 识别结束事件
    manager.onStop = (res) => {

    }
  },

  onLoad: function (options) {
    this.initRecord()
    app.getRecordAuth()
  },

  touchdown_plugin: function() {
    var that = this
    if(that.data.recording){
      manager.stop()

      wx.showToast({
        title: '停止识别',
        image: '/images/stop.png',
        duration: 800
      })

      that.setData({
        recording: false
      })
      
    }else{
      wx.stopBackgroundAudio();

      manager.start({
        lang: "zh_CN"
      })
      wx.showToast({
        title: '开始识别',
        image:'/images/begin.png',
        duration:800
      })
      that.setData({
        recording: true
      })
    }
  },

  listenInput: function (e) {
    var content = e.detail.value
    this.setData({
      content_now: content
    })
    console.log(e.detail.value)
  },

  // 清空输入框的内容
  dele: function (e) {
    this.setData({
      content_down: '',
      input: ''
    })
  },
  
  // 文字转语音（语音合成）
  wordtospeak: function (e) {
    let flag = 0
    if (this.data.recording){
      manager.stop
      flag = 1
    }

    if (e.currentTarget.dataset.content == '') {
      wx.showToast({
        title: '请勿发空消息',
        image: '/images/fail.png',
      })
    } else if (/[@\/'\\"#$%&\^*]/.test(e.currentTarget.dataset.content)){
      wx.showToast({
        title:'有非法字符',
        image:'/images/fail.png'
      })
    }else{
    // 将wxml中传过来的文本内容存起来，用api传给插件
    var content = e.currentTarget.dataset.content

    var that = this

    plugin.textToSpeech({
      lang: "zh_CN",
      tts: true,
      content: content,
      success: function (res) {
        console.log(" tts", res)
          innerAudioContext.autoplay = true
          innerAudioContext.src = res.filename
          innerAudioContext.onPlay(() => {
            console.log('开始播放')
          })

        wx.showLoading({
          title: '正在播放',
        })

        innerAudioContext.onError((res) => {
          if(res){
            wx.hideLoading(),
              wx.showToast({
                title: '文本格式错误',
                image: '/images/fail.png',
              })
          }
        })

          innerAudioContext.onEnded(function () {
            wx.stopBackgroundAudio();

            manager.start({
              lang: "zh_CN"
            })

            setTimeout(function () {
              wx.hideLoading()
            }, 300)

            that.setData({
              content_temp: ''
            })
          })
      },
      fail: function (res) {
        console.log("fail tts", res)

      }
    })

    var array = []
    array = this.data.content
    var temp = {
      'content': e.currentTarget.dataset.content,
      'person' : 'me'
    }
    array.push(temp)
    console.log(array)
    that.setData({
      content:array,
      scrollTop:that.data.scrollTop + 100
    })
    }
  },

  onUnload: function () {
    manager.stop()
  },
})