var SettleProduct = require('../product/SettleProduct.js');
class SettleProductContainer {
  constructor(settleProductsInfo) {
    this.totalCount = settleProductsInfo.totalCount;
    this.minusPayMount = settleProductsInfo.minusPayMount;

    this.totalPayMount = settleProductsInfo.totalPayMount;
    this.totalPrice = settleProductsInfo.totalPrice;
    this.originPayMount = settleProductsInfo.originPayMount;

    this.settleProductList = [];
    for (let i = 0; i < settleProductsInfo.productItemModels.length; i++) {
      this.settleProductList.push(new SettleProduct(settleProductsInfo.productItemModels[i]));
    }
  }
  getSettleProductList() {
    
    return this.settleProductList;
  }
  findProductById(productItemId){
    for (let i = 0; i < this.settleProductList.length;i++){
      if (this.settleProductList[i].productItemId === productItemId){
        return this.settleProductList[i];
      }
    }
    return null;
  }
  getTotalPrice(){
    this.totalPrice = 0;
    for (let i = 0; i < this.settleProductList.length; i++){
      this.totalPrice += this.settleProductList[i].selectCount * this.settleProductList[i].currentPrice;
    }
    return this.totalPrice;
  }
  getTotalCount(){
    this.totalCount = 0;
    for (let i = 0; i < this.settleProductList.length; i++){
      this.totalCount += this.settleProductList[i].selectCount;
    }
    return this.totalCount;
  }
}
module.exports = SettleProductContainer;