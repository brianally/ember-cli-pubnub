import PubNubService from "../services/pubnub";

export default initialize(container, app) {
	app.register("pubnub:main", PubNubService, (singleton: true});
	app.inject("route", "pubnub","pubnub:main");
	app.inject("controller", "pubnub", "pubnub:main");
});

export default {
	name      : "PubNubService",
	initialize: initialize
};