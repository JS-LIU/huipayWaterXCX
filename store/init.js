var HB = require("../libs/HB.js");
var { loginInfo } = require('../store/login/LoginInfo.js');
var huipayRequest = HB.ajax;
huipayRequest.config({
  baseUrl: "https://huipay.com/huibeiwater"
});

module.exports.huipayRequest = huipayRequest;
