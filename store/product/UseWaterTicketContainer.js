var UseWaterTicket = require('../product/UseWaterTicket.js');

class UseWaterTicketContainer {
    constructor(useWaterTicketsInfo) {
        console.log(useWaterTicketsInfo);
        this.totalUsed = useWaterTicketsInfo.totalUsed;
        this.userTicketModels = useWaterTicketsInfo.userTicketModels;
        this.useTicketList = [];
        for (let i = 0; i < this.userTicketModels.length; i++) {
            this.useTicketList.push(new UseWaterTicket(this.userTicketModels[i]));
        }

    }

    getUseTicketList() {
        return this.useTicketList;
    }

    getTotalUsed() {
        this.totalUsed = 0;
        for (let i = 0; i < this.useTicketList.length; i++) {

            this.totalUsed += this.useTicketList[i].selectUseCount;
        }
        return this.totalUsed;
    }

    getTotalUsedMoney() {
        this.totalUsedMoney = 0;
        for (let i = 0; i < this.useTicketList.length; i++) {

            this.totalUsedMoney += this.useTicketList[i].selectUseCount * this.useTicketList[i].currentPrice;
        }
        return this.totalUsedMoney;
    }

    getTotalCount() {
        this.totalCount = 0;
        for (let i = 0; i < this.useTicketList.length; i++) {

            this.totalCount += this.useTicketList[i].totalCount;
        }
        return this.totalCount;
    }

    //  清零使用的
    refreshTicketUse(settleProduct, maxUseTicketFlag) {
        for (let i = 0; i < this.useTicketList.length; i++) {
            let useTicket = this.useTicketList[i];
            if (useTicket.productItemId === settleProduct.productItemId) {
                useTicket.refreshTicketUse(settleProduct.selectCount, maxUseTicketFlag);
            }
        }
    }


    findTicketById(ticketId) {
        for (let i = 0; i < this.useTicketList.length; i++) {
            if (this.useTicketList[i].ticketId === ticketId) {
                return this.useTicketList[i];
            }
        }
        return null;
    }
}

module.exports = UseWaterTicketContainer;
