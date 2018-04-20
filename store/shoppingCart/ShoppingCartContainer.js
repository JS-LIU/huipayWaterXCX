var {huipayRequest} = require('../init.js');
var {loginInfo} = require('../../store/login/LoginInfo.js');
var ShopShoppingCart = require('./ShopShoppingCart.js');

class ShoppingCartContainer {
    constructor() {
        this.list = [];
        this.allSelectCount = 0;
        this.allPrice = 0;
        this.selected = false;
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
        return selectedCount;
    }

    getTotalCount() {
        let totalCount = 0;
        let list = this.getList();
        console.log("===========", list);
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

    findShoppingCart(shopId) {
        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].shopId === shopId) {
                return this.list[i];
            }
        }
    }

    findShopShoppingCartProduct(shopId, productId) {
        let shopShoppingCart = this.findShoppingCart(shopId);
        let shopShoppingCartProduct = shopShoppingCart.findProduct(productId);
        return shopShoppingCartProduct;
    }

    findProudctByProductItemId(productItemId) {
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