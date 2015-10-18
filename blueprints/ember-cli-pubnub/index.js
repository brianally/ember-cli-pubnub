module.exports = {
  description: "Provides the PubNub JavaScript SDK",
  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addBowerPackageToProject("pubnub", "3.7.15");
  }
};
