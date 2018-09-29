var {shoppingCartContainer} = require('../../store/shoppingCart/ShoppingCartContainer.js');
var {order} = require('../../store/order/Order.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        selected: false,
        shoppingCartList: [],
        selectedCount: 0,
        selectedPrice: 0,
        isEdit: false,
        editText:"编辑商品"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let shoppingCartList = shoppingCartContainer.getList();
        let selected = shoppingCartContainer.hasSelected();
        this.setData({
            shoppingCartList: shoppingCartList,
            selected: selected,
            selectedCount: shoppingCartContainer.getSelectedCount(),
            selectedPrice: shoppingCartContainer.getSelectedPrice(),
            isEdit: false,
            editText: "编辑商品"
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    bindRemoveProduct: function (e) {
        let shopId = e.currentTarget.dataset.shopId;
        let productItemId = e.currentTarget.dataset.productId;
        let shoppingCartProduct = shoppingCartContainer.findShopShoppingCartProduct(shopId, productItemId);
        shoppingCartContainer.removeProduct(shoppingCartProduct, () => {
            this.setData({
                shoppingCartList: shoppingCartContainer.getList(),
                selectedCount: shoppingCartContainer.getSelectedCount(),
                selectedPrice: shoppingCartContainer.getSelectedPrice(),
                selected: shoppingCartContainer.hasSelected()
            })
        });
    },
    bindAddProduct: function (e) {
        let shopId = e.currentTarget.dataset.shopId;
        let productItemId = e.currentTarget.dataset.productId;
        let shoppingCartProduct = shoppingCartContainer.findShopShoppingCartProduct(shopId, productItemId);
        shoppingCartContainer.addProduct(shoppingCartProduct, () => {
            this.setData({
                shoppingCartList: shoppingCartContainer.getList(),
                selectedCount: shoppingCartContainer.getSelectedCount(),
                selectedPrice: shoppingCartContainer.getSelectedPrice(),
                selected: shoppingCartContainer.hasSelected()
            })
        }).then((shopShoppingCart)=>{
            shopShoppingCart.increaseRequest(shoppingCartProduct);
        });

    },
    bindNavigateToSettle: function (e) {
        wx.showLoading({
            title:"提交中"
        });
        order.getSettleInfo('default', "cartSettle", {}).then(() => {

            return shoppingCartContainer.getShoppingCartContainer();
        }).then(()=>{
            wx.hideLoading();
            wx.navigateTo({
                url: '/pages/settle/settle'
            })
        }).catch((info) => {
            if (info.data.message === "需要用户正式登录") {
                wx.navigateTo({
                    url: '/pages/login/login',
                })
            }
        });
    },
    bindSelectShoppingCart: function () {
        let shoppingCartList = shoppingCartContainer.toggleSelected();
        let selected = shoppingCartContainer.hasSelected();
        this.setData({
            shoppingCartList: shoppingCartList,
            selected: selected,
            selectedCount: shoppingCartContainer.getSelectedCount(),
            selectedPrice: shoppingCartContainer.getSelectedPrice()
        })
    },
    bindSelectedShopShoppingCart: function (e) {
        let shopId = e.currentTarget.dataset.shopShoppingCartId;
        let shopShoppingCart = shoppingCartContainer.findShoppingCart(shopId);
        shopShoppingCart.toggleSelected();
        let selected = shoppingCartContainer.hasSelected();
        let shoppingCartList = shoppingCartContainer.getList();
        this.setData({
            shoppingCartList: shoppingCartList,
            selected: selected,
            selectedCount: shoppingCartContainer.getSelectedCount(),
            selectedPrice: shoppingCartContainer.getSelectedPrice()
        })
    },
    bindSelectedProductItem: function (e) {
        let productId = e.currentTarget.dataset.productId;
        let shopId = e.currentTarget.dataset.shopShoppingCartId;
        let shopShoppingCart = shoppingCartContainer.findShoppingCart(shopId);
        let shoppingCartProduct = shoppingCartContainer.findShopShoppingCartProduct(shopId, productId);
        shoppingCartProduct.toggleSelected().selectedRequest();
        shopShoppingCart.hasSelected();

        let selected = shoppingCartContainer.hasSelected();
        let shoppingCartList = shoppingCartContainer.getList();
        this.setData({
            shoppingCartList: shoppingCartList,
            selected: selected,
            selectedCount: shoppingCartContainer.getSelectedCount(),
            selectedPrice: shoppingCartContainer.getSelectedPrice()
        });
    },
    bindEdit: function () {
        let isEdit = !this.data.isEdit;
        let editText = isEdit ? "完成" :"编辑商品";
        this.setData({
            isEdit:isEdit,
            editText:editText
        })
    },
    bindDeleteProductList: function (){
        shoppingCartContainer.removeAllSelectedProduct();
        let shoppingCartList = shoppingCartContainer.getList();
        let selected = shoppingCartContainer.hasSelected();
        this.setData({
            shoppingCartList: shoppingCartList,
            selected: selected,
            selectedCount: shoppingCartContainer.getSelectedCount(),
            selectedPrice: shoppingCartContainer.getSelectedPrice()
        })
    }

});