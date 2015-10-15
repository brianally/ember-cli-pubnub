import PubNubService from "../services/pubnub";

export function initialize(container, app) {
	app.register("pubnub:main", PubNubService, {singleton: true});
	app.inject("route", "pubnub","pubnub:main");
	app.inject("controller", "pubnub", "pubnub:main");
}

export default {
	name      : "pubnub",
	initialize: initialize
};