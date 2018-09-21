var {huipayRequest} = require('../init.js');
var {loginInfo} = require('../../store/login/LoginInfo.js');
var ShopShoppingCart = require('./ShopShoppingCart.js');
var ShoppingCartProduct = require('../product/ShoppingCartProduct');
class ShoppingCartContainer {
    constructor() {
        this.list = [];
        this.allSelectCount = 0;
        this.allPrice = 0;
        this.selected = false;
    }
    getBucketList(){
        let bucketList = [];
        let allProductList = this.getProductList();
        for(let i = 0;i < allProductList.length;i++){
            if(allProductList[i].isBucketProduct()){
                bucketList.push(allProductList[i]);
            }
        }
        return bucketList;
    }

    addProductList(productList, callback){

        for(let i = 0;i < productList.length;i++){
            for(let j = 0;j < productList[i].productItemModels.length;j++){
                let productItemModel = productList[i].productItemModels[j];
                let shoppingCartProduct = new ShoppingCartProduct(productItemModel,{shopId:productItemModel.shopId});
                this.addProductToShoppingCart(shoppingCartProduct).then(()=>{
                    callback();
                })
            }
        }



    }

    syncBucketList(callback){
        let accessInfo = Object.assign({}, {app_key: loginInfo.appKey}, loginInfo.getInfo());
        return new Promise((resolve, reject)=>{
            huipayRequest.resource('/shop/shoppingCart/:list').save({list: "emptyBucketProduct"}, {
                accessInfo: accessInfo
            }).then((info) => {
                this.addProductList(info.data.productList, callback);
                resolve();
            });
        })
    }

    addProductToShoppingCart(shoppingCartProduct){
        return new Promise((resolve,reject)=>{
            shoppingCartProduct.getShopInfo().then((shopInfo) => {
                let shopShoppingCart = this.getOrCreateShopShoppingCart(shopInfo);
                shopShoppingCart.addProduct(shoppingCartProduct);
                resolve(shopShoppingCart);
            })
        })
    }

    getShoppingCartContainer() {
        this.list = [];
        let accessInfo = Object.assign({}, {app_key: loginInfo.appKey}, loginInfo.getInfo());
        let self = this;
        huipayRequest.resource('/shoppingCart/:list').save({list: "list"}, {
            accessInfo: accessInfo
        }).then((info) => {
            this.selected = info.data.shoppingCartSelected;
            let list = info.data.list;
            for (let i = 0; i < list.length; i++) {
                this.list.push(new ShopShoppingCart(list[i]));
            }
        });

    }

    /**
     * 加入购物车/购物车中数量加一
     * @param shoppingCartProduct
     * @param callback
     * @returns {PromiseLike<ShopShoppingCart> | Promise<ShopShoppingCart>}
     */
    addProduct(shoppingCartProduct, callback = function () {
    }) {

        return shoppingCartProduct.getShopInfo().then((shopInfo) => {
            let shopShoppingCart = this.getOrCreateShopShoppingCart(shopInfo);
            shopShoppingCart.addProduct(shoppingCartProduct);
            callback();
            return new Promise((resolve,reject)=>{
                resolve(shopShoppingCart);
            })
        })
    }

    removeProduct(shoppingCartProduct, callback = function () {
    }) {
        shoppingCartProduct.getShopInfo().then((shopInfo) => {
            let shopShoppingCart = this.getOrCreateShopShoppingCart(shopInfo);
            shopShoppingCart.removeProduct(shoppingCartProduct);
            callback();
        })
    }

    removeAllSelectedProduct(){
        for(let i = 0;i < this.list.length;i++){
            let shopShoppingCart = this.list[i];
            shopShoppingCart.removeSelectedProduct(()=>{
                let selectedProductList = shopShoppingCart.getSelectedProduct();
                shopShoppingCart.removeProductsRequest(selectedProductList)
            });
        }
        return this.getList();
    }

    findShoppingCart(shopId) {
        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].shopId === shopId) {
                return this.list[i];
            }
        }
    }

    getOrCreateShopShoppingCart(shopInfo) {

        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].shopId === shopInfo.shopId) {
                return this.list[i];
            }
        }
        let shoppingCartInfo = {
            selectCount: 0,
            shopId: shopInfo.shopId,
            shopName: shopInfo.shopName,
            shopSelected: true,
            totalPrice: 0,
            productItemModels: []
        };
        let shopShoppingCart = new ShopShoppingCart(shoppingCartInfo);
        this.list.push(shopShoppingCart);
        return shopShoppingCart;
    }

    getSelectedCount() {
        let selectedCount = 0;
        for (let i = 0; i < this.list.length; i++) {
            selectedCount += this.list[i].getSelectedCount()
        }
        this.selectedCount = selectedCount;
        return this.selectedCount;
    }

    getTotalCount() {
        let totalCount = 0;
        let list = this.getList();
        for (let i = 0; i < list.length; i++) {
            totalCount += list[i].getTotalCount()
        }
        this.totalCount = totalCount;
        return this.totalCount;
    }

    getSelectedPrice() {
        let totalPrice = 0;
        for (let i = 0; i < this.list.length; i++) {
            totalPrice += this.list[i].getSelectedPrice()
        }
        return totalPrice;
    }

    getList() {
        let list = [];
        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].productList.length !== 0) {
                list.push(this.list[i])
            }
        }
        this.list = list;
        return this.list;
    }
    getProductList(){
        let list = [];
        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].productList.length !== 0) {

                list = list.concat(this.list[i].productList);
            }
        }

        return list;
    }

    findShopShoppingCartProduct(shopId, productId) {
        // let shopInfo = this.getShopInfo(shopId);
        let shopShoppingCart = this.findShoppingCart(shopId);
        return shopShoppingCart.findProduct(productId);
    }

    findProductByProductItemId(productItemId) {
        for (let i = 0; i < this.list.length; i++) {
            let shopShoppingCart = this.list[i];
            for (let j = 0; j < shopShoppingCart.productList.length; j++) {
                if (shopShoppingCart.productList[j].productItemId === productItemId) {
                    return shopShoppingCart.productList[j];
                }
            }
        }
    }

    hasSelected() {
        let list = this.getList();
        for (let i = 0; i < list.length; i++) {
            if (!list[i].selected) {
                this.selected = false;
                return this.selected;
            }
        }
        this.selected = true;
        return this.selected;
    }

    toggleSelected() {
        this.selected = !this.selected;
        for (let i = 0; i < this.list.length; i++) {
            this.list[i].toggleSelected(this.selected);
        }
        return this.getList();
    }


}

module.exports.shoppingCartContainer = new ShoppingCartContainer();