"use strict";

module.exports = {
  description: "Provides the PubNub JavaScript SDK",

  afterInstall: function(options) {
  	var ui = this.ui;
    ui.writeLine("adding pubnub Bower package?");

    return this.addBowerPackageToProject("pubnub", "~3.7.15")
    	.then(function() {
    		ui.writeLine("added pubnub Bower package!");
    	});
  }
};

