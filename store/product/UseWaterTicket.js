var {huipayRequest} = require('../init.js');
var {loginInfo} = require('../login/LoginInfo.js');

class UseWaterTicket {
    constructor(waterTicketInfo) {
        this.name = waterTicketInfo.name;
        this.brandName = waterTicketInfo.brandName;
        this.canUseCount = waterTicketInfo.canUseCount;
        this.productItemId = waterTicketInfo.productItemId;
        this.selectUseCount = waterTicketInfo.selectUseCount;
        this.ticketId = waterTicketInfo.ticketId;
        this.totalCount = waterTicketInfo.totalCount;
        this.currentPrice = waterTicketInfo.currentPrice;
    }

    increase() {
        if (this.selectUseCount < this.canUseCount) {
            this.selectUseCount++;
        }
        let accessInfo = Object.assign({}, {app_key: loginInfo.appKey}, loginInfo.getInfo());
        let postInfo = {
            accessInfo: accessInfo,
            productItemId: this.productItemId,
            ticketId: this.ticketId,
            shopId: 1
        };
        huipayRequest.resource('/ticket/increase').save({}, postInfo)
    }

    reduce() {
        if (this.selectUseCount > 0) {
            this.selectUseCount--;
        }
        let accessInfo = Object.assign({}, {app_key: loginInfo.appKey}, loginInfo.getInfo());
        let postInfo = {
            accessInfo: accessInfo,
            productItemId: this.productItemId,
            ticketId: this.ticketId,
            shopId: 1
        };
        huipayRequest.resource('/ticket/decrease').save({}, postInfo)
    }

    /***
     * 商品数量变化，同步更新
     * @param productSelectCount
     */
    refreshTicketUse(productSelectCount, maxUseTicketFlag) {
        this.canUseCount = (productSelectCount < this.totalCount ? productSelectCount : this.totalCount);
        if (maxUseTicketFlag) {
            this.selectUseCount = this.canUseCount;
        } else {
            this.selectUseCount = 0;
        }
    }
}

module.exports = UseWaterTicket;