module.exports = {
  description: "Provides the PubNub JavaScript SDK",

  afterInstall: function() {
    normalizeEntityName: function() {},
    return this.addBowerPackageToProject("pubnub", "0.0.5");
  }
};
