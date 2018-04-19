class Address {
  constructor(positionInfo) {
    this.longitude = positionInfo.longitude;
    this.latitude = positionInfo.latitude;
    this.fullAddress = positionInfo.fullAddress;
    this.city = positionInfo.city;
  }
}

module.exports = Address;
