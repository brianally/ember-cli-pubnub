import PubNubService from "../services/pubnub";

export function initialize(container, app) {
	app.register("service:pubnub", PubNubService, {singleton: true});
	app.inject("route", "pubnub", "service:pubnub");
	app.inject("controller", "pubnub", "service:pubnub");
}

export default {
	name      : "pubnub",
	initialize: initialize
};
