var HB = require("../libs/HB.js");
var { loginInfo } = require('../store/login/LoginInfo.js');
var huipayRequest = HB.ajax;
huipayRequest.config({
  baseUrl: "http://123.57.161.212:9931/huibeiwater"
});

module.exports.huipayRequest = huipayRequest;
