module.exports = {
  description: "Provides the PubNub JavaScript SDK",

  afterInstall: function(options) {
    return addBowerPackageToProject("pubnub");
  }
};
