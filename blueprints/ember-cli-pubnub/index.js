module.exports = {
  description: "Provides the PubNub JavaScript SDK",
  normalizeEntityName: function() {},
  
  afterInstall: function() {
    return this.addBowerPackageToProject("pubnub", "0.0.5");
  }
};
