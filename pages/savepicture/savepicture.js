// pages/savepicture/savepicture.js
var { userInfo } = require('../../store/user/UserInfo.js');
// var { huipayRequest } = require('../../store/init.js');
var QRCode = require('../../libs/weapp-qrcode.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    base64Code:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let ctx = wx.createCanvasContext('giveCanvas');
    let wW = wx.getSystemInfoSync().windowWidth;
    let wH = wx.getSystemInfoSync().windowHeight;
    let rate = wW / 375;
    let canvasW = 364 * rate;
    let canvasH = 505 * rate;
    let userIcon = userInfo.userIconUrl;
    // function calcTextStartX(textLength,fontSize){
    //   return ((292 - textLength * fontSize) / 2);
    // }
    // function calcCenterTextEndX(startX){
    //   return 292 - startX
    // }
    // function calcTextEndX(startX,text){
    //   return startX + text.length * fontSize;
    // }
    // function calcStartX(canvasW,itemW){
    //   return (canvasW-itemW)/2;
    // }
    //  背景
    ctx.drawImage("../images/share_img.png", 0, 0, canvasW, canvasH)
    ctx.draw(true);

    //  文字起始点
    let userName = userInfo.userName;
    // let nameTextStartX = calcTextStartX(userName.length,12);
    // let titleLineUp = "亲，送你1张喜腾山泉水票，凭此水票可";
    // let titleLineEnd = "免费兑换1桶喜腾山泉天然矿泉水";
    // let titleTextStartX = calcTextStartX(17,14);
    //  绘制头像
    ctx.drawImage(userIcon, 34 * rate, 22 * rate, 44, 44);
    ctx.draw(true);
    
    //  设置字号
    ctx.setFontSize(14);
    //  绘制姓名
    ctx.fillText(userName, 92 * rate, 54 * rate);
    ctx.draw(true);

    // ctx.setFontSize(14);
    // ctx.fillText(titleLineUp, titleTextStartX, 124);
    // ctx.fillText(titleLineEnd, titleTextStartX, 144);
    // ctx.draw(true);

    // ctx.setLineDash([10, 5], 5);
    // ctx.beginPath();
    // ctx.moveTo(titleTextStartX, 160);
    // let lineEndX = calcCenterTextEndX(titleTextStartX);
    // ctx.lineTo(lineEndX, 160);
    // ctx.stroke();
    // ctx.draw(true);
    // let waterTicketStartX = calcStartX(292,225);
    // ctx.drawImage("../images/home_water_ticket.png", waterTicketStartX, 210, 225, 98)
    // ctx.draw(true);
    
    // ctx.setFontSize(16);
    // ctx.fillText("长按识别喜腾订水小", titleTextStartX, 385);
    // ctx.fillText("程序立即领取水票", titleTextStartX, 405);
    // ctx.draw(true);

    // let self = this;
    // let qrCodeTextEndX = calcCenterTextEndX(titleTextStartX)-85;
    new QRCode('giveCanvas', {
      text: 'https://huipay.com/huibeiwater/pages/index/index?type=receiveTicket&activityId=2&inviteId=' + userInfo.id,
      width: 65*rate,
      height: 65 * rate,
      y: 416*rate,
      x: 20 * rate,
      colorDark: "#4dc0ff",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });


    // let logoStartX = calcStartX(292, 70);
    // ctx.drawImage("../images/huibei@2x.png", logoStartX, 490, 70, 15)
    // ctx.draw(true);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindSaveToPhoto:function(){
    wx.canvasToTempFilePath({
      
      canvasId:"giveCanvas",
      fileType:"jpg",
      quality:1,
      success:function(res){
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath
        })
      }
    })
  }
})