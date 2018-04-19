class Map{
  constructor(id){
    this.mapCtx = wx.createMapContext(id);
  }
  getCenterLngLat() {
    let self = this;
    return new Promise((resolve,reject)=>{
      self.mapCtx.getCenterLocation({
        success: function (res) {
          resolve(res);
        }
      })
    })
  }
  getLocationByLngLat(lngLat){
    
  }

}
module.exports = Map;
