var HPMap = require('./HPMap.js');
class Cities{
    constructor(){
      this._hpMap = new HPMap();
      this.cities = null;
      this.alphabeticalOrder = {
          "A":[],
          "B":[],
          "C":[],
          "D":[],
          "E":[],
          "F":[],
          "G":[],
          "H":[],
          "I":[],
          "J":[],
          "K":[],
          "L":[],
          "M":[],
          "N":[],
          "O":[],
          "P":[],
          "Q":[],
          "R":[],
          "S":[],
          "T":[],
          "U":[],
          "V":[],
          "W":[],
          "X":[],
          "Y":[],
          "Z":[]
      }
        
    }
    convertToAlphabeticalOrder(cities){
        
        for(let i = 0 ;i < cities.length;i++){
            this.alphabeticalOrder[cities[i].sortLetters].push(cities[i]);
        }
        return this.alphabeticalOrder;
    }
    convertToWXList(alphabeticalOrderCities){
      let WXCitiesList = [];
      for (let prop in alphabeticalOrderCities){
        if (alphabeticalOrderCities[prop].length > 0){
          WXCitiesList.push({ key: prop, cities: alphabeticalOrderCities[prop] });
        }
        
      }
      return WXCitiesList;
    }

    getCities(){  
      let self = this;
      return new Promise((resolve,reject)=>{
        if (self.cities !== null){
          resolve(self.cities);
        }else{
          self._hpMap.getCities().then((cities) => {
            self.cities = self.convertToAlphabeticalOrder(cities.data);      
            resolve(self.cities);
          })
        }       
      })
    }
    convertToLocationInfo(city) {
      return this._hpMap.getGeocoder(city);
    }
    selectCity(city){
      return city;
    }
}

module.exports.cities = new Cities();