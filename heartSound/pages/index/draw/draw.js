let ctx;
Page({
  data: {
    isrotate:false,
    tempFilePath:'',
    pen: {
      lineWidth: 5,
      color: "#2c2c2c"
    }
  },
  onShareAppMessage: function () {
    return {
      title: '心声Lite，用画笔说话',
      path: '/pages/index/draw/draw',
      imageUrl: '/images/xxs.png'
    }
  },
  onLoad(options) {
    ctx = wx.createCanvasContext('myCanvas');
    ctx.setStrokeStyle(this.data.pen.color);
    ctx.setLineWidth(this.data.pen.lineWidth);
    ctx.setLineCap('round');
    ctx.setLineJoin('round');
  },
  touchstart(e) {
    ctx.setStrokeStyle(this.data.pen.color);
    ctx.setLineWidth(this.data.pen.lineWidth);
    ctx.moveTo(e.touches[0].x, e.touches[0].y);
  },
  touchmove(e) {
    let x = e.touches[0].x;
    let y = e.touches[0].y;
    ctx.lineTo(x, y)
    ctx.stroke();
    ctx.draw(true);
    ctx.moveTo(x, y)
  },
  dele: function () {
    ctx.setFillStyle('#ffffff')
    ctx.fillRect(0, 0, 750, 1000)
    ctx.draw()
  },
  rotate: function () {
    wx.showToast({
      title: '旋转功能开发中',
      image: '/images/fail.png',
      duration: 1000,
      mask: true,
    })
  },
})
