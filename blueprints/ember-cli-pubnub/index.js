module.exports = {
  description: "Provides the PubNub JavaScript SDK",

  afterInstall: function(options) {
    return this.addBowerPackageToProject("pubnub", "0.0.5");
  }
};
