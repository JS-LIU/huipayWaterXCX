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


    getBucketProductList(){
        let bucketProductList = [];
        for (let i = 0; i < this.settleProductList.length; i++) {
            let product = this.settleProductList[i];
            if(product.isBucketProduct()){
                bucketProductList.push(product);
            }
        }
        return bucketProductList;
    }
    //  桶套餐的price
    getBucketPrice(){
        let bucketPrice = 0;
        let list = this.getBucketProductList();
        for(let i = 0;i < list.length;i++){
            bucketPrice += list[i].selectCount * list[i].currentPrice;
        }
        return bucketPrice;
    }
    //  没有桶套餐
    getExcludeBucketSettleProductList(){
        let excludeBucketSettleProductList = [];
        for (let i = 0; i < this.settleProductList.length; i++) {
            let product = this.settleProductList[i];
            if(!product.isBucketProduct()){
                excludeBucketSettleProductList.push(product);
            }
        }
        return excludeBucketSettleProductList;
    }
    //  没有桶套餐的price
    getExcludeBucketPrice(){
        let excludeBucketPrice = 0;
        let list = this.getExcludeBucketSettleProductList();
        for(let i = 0;i < list.length;i++){

            excludeBucketPrice += list[i].selectCount * list[i].currentPrice;
        }
        return excludeBucketPrice;
    }
    findOrCreateProduct(shoppingCartProduct){
        let product = this.findProductById(shoppingCartProduct.productItemId);
        if(!product){
            this.settleProductList.push(new SettleProduct(shoppingCartProduct));
        }
        return product;
    }


    findProductById(productItemId) {
        let index = this.findIndexById(productItemId);
        if (this.settleProductList[index] === undefined){
            return null;
        }
        return this.settleProductList[index];
    }


    findIndexById(productItemId){
        return this.settleProductList.findIndex((productItem)=>{
            return productItem.productItemId === productItemId;
        })
    }

    deleteProduct(productItemId){
        let index = this.findIndexById(productItemId);
        this.settleProductList.splice(index,1);
        return this.settleProductList;
    }



    getTotalPrice() {
        this.totalPrice = 0;
        for (let i = 0; i < this.settleProductList.length; i++) {
            this.totalPrice += this.settleProductList[i].selectCount * this.settleProductList[i].currentPrice;
        }
        return this.totalPrice;
    }

    getTotalCount() {
        this.totalCount = 0;
        for (let i = 0; i < this.settleProductList.length; i++) {
            this.totalCount += this.settleProductList[i].selectCount;
        }
        return this.totalCount;
    }
}

module.exports = SettleProductContainer;