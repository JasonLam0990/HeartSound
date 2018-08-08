# heartSound
心声Lite是一款为听障者服务的微信小程序，提供语音识别、语音合成、画板写字等功能，希望能为他们的生活提供一些便利。本项目使用了“同声传译”插件，希望能和大家一起把这个微信小程序完善地更好，为听障者们带来福音。<br>

**👏👏如果觉得本项目对你学习小程序插件的使用或其他方面有帮助的话，欢迎右上star支持👏👏** 

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
