var HB = {};
Function.prototype.before = function(beforefn) {
    let __self = this;
    return function() {
        beforefn.apply(this, arguments);
        return __self.apply(this, arguments);
    }
};

HB.ajax = (function() {

    let wxRequest = function(requestInfo, context) {
        wx.request({
            url: requestInfo.url,
            data: requestInfo.data,
            method: requestInfo.method,
            success: (data)=>{
              if (data.statusCode === 500){
                requestInfo.reject(data);
              }else{
                requestInfo.resolve(data);
              }             
            }
            
        })
    }.before((requestInfo, context) => {
        context.config(requestInfo);
    });
    let config = function(configObj = {}) {
        this.config = function(requestInfo) {
            requestInfo.url = configObj.baseUrl + requestInfo.url;
        };
        return this.config;

    };
    class UrlCreator {
        constructor(templateUrl) {
            this.templateUrl = templateUrl + "/";
        }
        getUrl(replaceUrlObj) {
            let url = this.templateUrl;
            for (let p in replaceUrlObj) {
                url = url.replace("/:" + p + "/", "/" + replaceUrlObj[p] + "/");
            }
            return url.substr(0, url.length - 1);
        }
    }

    class Resource {
        constructor(url, that) {
            this.urlCreator = new UrlCreator(url);
            this.that = that;
        }
        query() {}
        save(replaceUrlObj, data) {
            let url = this.urlCreator.getUrl(replaceUrlObj);
            let method = "POST";
            return new Promise((resolve, reject) => {
                wxRequest({ resolve, reject, method, url, data }, this.that);
            })
        }
    }

    return {
        config: config,
        resource: function(url) {
            let that = this;
            return new Resource(url, that);
        }
    }
})();




module.exports = HB;