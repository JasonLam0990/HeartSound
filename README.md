# heartSound
心声Lite是一款为听障者服务的微信小程序，提供语音识别、语音合成、画板写字等功能，希望能为他们的生活提供一些便利。本项目使用了“同声传译”插件，希望能和大家一起把这个微信小程序完善地更好，为听障者们带来福音。<br>

**👏👏如果觉得本项目对你学习小程序插件的使用或其他方面有帮助的话，欢迎右上star支持👏👏** 

### “微信同声传译”插件使用教程：

微信公众平台添加插件

https://developers.weixin.qq.com/miniprogram/introduction/plugin.html#%E4%BD%BF%E7%94%A8%E6%8F%92%E4%BB%B6 

浏览插件使用文档

https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/using.html

查看微信同声传译开发文档

https://mp.weixin.qq.com/wxopen/plugindevdoc?appid=wx069ba97219f66d99&token=321904791&lang=zh_CN


以上材料是我入门插件使用所看的材料，相信阅读完以后，大家对插件也有一定的了解了。接下来就来看看实战的项目吧。

先简单的介绍一下本项目。

以下是主要功能页面的截图。

<div style="display:flex;justify-content:space-around;"> 

 <img src="/项目截图/index.jpg" width=30% />
 <img src="/项目截图/talk.jpg" width=30% />
 <img src="/项目截图/longtalk.jpg" width=30% />
 
</div>

<div style="display:flex;justify-content:space-around;"> 
 <img src="/项目截图/draw.jpg" width=30% />
 <img src="/项目截图/user.jpg" width=30% />  
 <img src="/项目截图/about.jpg" width=30% />

</div>

 #### 使用流程

一、在后台添加好插件以后

二、用你添加了插件的小程序的AppID作为小程序开发者创建项目

三、在项目的app.json引入插件
``` 
{
  "pages": [
    ...
  ],
 
  ...
  
  "plugins": {
      "WechatSI": {
      "version": "0.1.0",
      "provider": "wx069ba97219f66d99"
    }
  }
}
``` 

四、在需要用到插件功能的页面引入和使用插件，以下的讲解我都写在注释里啦，认真看注释唷！！！
``` 
// pages/talk/talk.js
 
// 引入插件
var plugin = requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager()
 
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    showmicro:false,
    input:'',
    content_up:'',
    content_down:'你好，我听力不好，你可以按住底部的按钮，对我说普通话'
  },
 
  //监听字的输入，实时显示在屏幕，并且content_down还会用在文字转语音（语音合成）上。
  listenInput: function (e) {
    var content = e.detail.value
    if (content==''){
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
      input:''
    })
  },
 
  // 插件使用重要步骤！！！
 
  // 手指按下
  touchdown_plugin: function () {
 
    // 开始识别语音，设置最长能录30s（插件默认最长能录60s，我觉得30s够了，反正也显示不完- -。）
    manager.start({ 
      duration: 30000, lang: "zh_CN" 
    })
 
    //让“正在说话”的遮罩层出现
    this.setData({
      showmicro:true
    }) 
  },
 
  // 手指松开
  touchup_plugin: function () {
    var that = this
 
    // 语音停止识别的时候会调用的函数，这里是把最终识别结果返回的内容呈现在content_up中
    manager.onStop = function (res) {
      that.setData({
        content_up: res.result
      })
    }
    
    // 当有新的识别内容返回，就会调用此事件。一般用于想马上得到结果的那种，否则还是onstop用的习惯一些，项目没用到这个，仅作讲解
    // manager.onRecognize = function (res) {
    //  that.setData({
    //    content_up: res.result
    //  })
    //}
 
    //语音识别停止（此时就会调用manager.onStop函数）
    manager.stop();
 
    //让“正在说话”的遮罩层消失
    this.setData({
      showmicro: false,
    })
  },
 
  // 文字转语音（语音合成）
  wordtospeak: function(e) {
 
    // 将wxml中传过来的文本内容存起来，用api传给插件
    var content = e.currentTarget.dataset.content
 
    var that = this
    plugin.textToSpeech({
      lang: "zh_CN",
      tts: true,
      content: content,
      success: function (res) {
        
        // 插件返回合成好以后的mp3文件，用api自动播放
        const innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.autoplay = true
        innerAudioContext.src = res.filename
        innerAudioContext.onPlay(() => {
          console.log('开始播放')
        })
 
        console.log("succ tts", res.filename)
      },
      fail: function (res) {
        console.log("fail tts", res)
      }
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
})
``` 


### 更新日志：

#### 2018年8月6日 周一
1.因为“同声传译”插件那边的问题，第一次识别的时候总是没有返回值，所以我只能加一个标签说需要第一次试音之后才能正常使用来提示用户。<br>
2.当开始识别语音时，加入了一个提示的遮罩层。V0是必须要录够3S，才能结束一次，现在修改成了松开后就停止录音，返回识别，遮罩层消失。<br>
3.增加了onShareAppMessage的内容<br>

#### 2018年8月7日 周二
1.修复了第一次无法识别的问题，其实是我自己的代码问题- -。以后还是要好好看别人的开发手册和别人写的demo呀，然后要学会调试，看错误码。<br>
2.语音合成并播放的时候增加了一个提示，这样听障用户就知道自己的语音已经在播放了，播放完毕时，这个提示才会消失。<br>
3.语音合成的按钮修复了可以连续点击的bug，一直点会很鬼畜- -。所以改成了每次点击都会停止前一个语音的播放，然后开启当前的语音播放，保证每次都只有一条语音在播放。<br>
4.之前还忽略了一个录音授权的bug，如果不写在onload里面的话，当用户点击按钮才会自动调用授权，这样子的话已经按了按钮一次了，有些值就会发生变化，所以现在加上了录音授权的```app.getRecordAuth()```，并且用户可能会按拒绝授权，这时候我也考虑到了，我在没有授权的回调函数里写了个
```
              wx.showToast({
                title: '录音授权失败',
                image:'/images/fail.png',
                duration:1000
              })
              setTimeout(function () {
                wx.openSetting({
                  
                })
              }, 1000) 
```
这样就会toast提示，然后跳转到设置界面，让用户可以点击授权（毕竟不授权录音就肯定没法识别呀）<br>

#### 2018年8月8日 周三
1.修复了文字转语音（语音合成）遇到纯字符文本时会出问题的bug。debug过程主要是根据api返回的错误码<br>
2.从face2face的demo中偷了个component——animation-icon，就是用在正在录音时提示用户的，我觉得还挺好看哈哈，就用上了<br>
3.增加了坐下长谈的部分，原本想着api限制的manager.start最长只能录制1分钟，但是我发现了听障者使用语音合成功能时，语音识别会自动中断，于是我就在语音合成的按钮点击事件里加上了一个识别停止，然后播放完语音，又开始识别的过程。一般比较少听障者1分钟一直不讲话一直都在听，所以就算比较好的解决这个问题了，在做这个功能模块的过程中也是遇到了不少坑的。<br>
4.坐下长谈的部分是用了“微信同声传译”中提供的一个方法```manager.onRecognize```有新的识别内容返回，则会调用此事件
```
manager.onRecognize = function(res) {
    console.log("current result", res.result)
}
```
然后就是在语音识别的过程中，识别到了什么就返回什么，但是感觉这个AI在断句上还有待提高- -。感觉经常断错句哈哈<br>
5.为了充分利用布局，并且想加个分享按钮，我把授权登陆的那块换成了，这里有个知识点，就是如果想在其他按钮上出发转发事件（而不是右上角的那个转发），就要给button加上一个```open-type="share"```,这样点击这个按钮就会触发转发事件了。如果有多个按钮想触发不同的转发文本的事件的话可以给button设置传id，然后根据res.target.id来区分

```
  wxml
  
  <button wx:if="{{!hasUserInfo && canIUse}}" open-type="getUserInfo" bindgetuserinfo="getUserInfo" class="login-btn">
    <text>授权登陆</text>
  </button>

  <button wx:else open-type="share" class="login-btn">
    <text>分享给好友</text>
  </button>
 ```
 
 ```
  js
  
  onShareAppMessage: function () {
    return {
      title: '心声Lite，用心说话',
      desc: '语音识别，语音合成，画板涂鸦，心声Lite — 致力于为听障者服务。',
      path: '/pages/index/index',
      imageUrl: '/images/xxs.png'
    }
  },
 ```
