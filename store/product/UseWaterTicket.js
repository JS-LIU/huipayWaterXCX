class UseWaterTicket{
  constructor(waterTicketInfo){
    this.name = waterTicketInfo.name;
    this.brandName = waterTicketInfo.brandName;
    this.canUseCount = waterTicketInfo.canUseCount;
    this.productItemId = waterTicketInfo.productItemId;
    this.selectUseCount = waterTicketInfo.selectUseCount;
    this.ticketId = waterTicketInfo.ticketId;
    this.totalCount = waterTicketInfo.totalCount;
    this.currentPrice = waterTicketInfo.currentPrice;
  }
  increase(){
    if (this.selectUseCount < this.canUseCount){
      this.selectUseCount++;
    }
  }
  reduce(){
    if (this.selectUseCount > 0){
      this.selectUseCount--;
    }
  }
}
module.exports = UseWaterTicket;