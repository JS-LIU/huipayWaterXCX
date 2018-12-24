var HB = require("../libs/HB.js");
var { loginInfo } = require('../store/login/LoginInfo.js');
var huipayRequest = HB.ajax;
huipayRequest.config({
  baseUrl: "https://huipay.com/huibeiwater"
  // baseUrl:"http://123.57.161.212:9931/huibeiwater"
  // baseUrl: "http://192.168.1.83:9931/huibeiwater"
  // baseUrl: "http://192.168.1.9:9931/huibeiwater"
});

module.exports.huipayRequest = huipayRequest;
