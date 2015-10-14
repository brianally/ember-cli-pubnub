/* global PUBNUB */
/*jshint -W030 */
import Ember from "ember";

export default Ember.Service.extend(Ember.Evented, {
	PN: null,
	pnState: {},

	setup: function() {
		let config = this.container.lookupFactory("config.environment");

		if (PUBNUB === void 0) {
			throw new Ember.Error("ember-cli-pubnub: PubNub JS SDK not found");
		}

		if (config.pubnub === void 0){
			throw new Ember.Error("ember-cli-pubnub: no configuration in config.environment");
		}

		let pn = PUBNUB.init(config.pubnub);

		// ************************************************* Ember.A Ember.Object ??
		this.get("pnstate")["_channels"] = [];
		this.get("pnstate")["_presence"] = {};
		this.get("pnstate")["_presData"] = {};

		return this.set("PN", pn);

	}.on("init"),

	listChannels: function() {
		return this.get("pnState")["_channels"].slice(0);
	},

	listPresence: function(channel) {
		let _ref;
		return (_ref = this.get("pnState")["_presence"][channel]) != null ? _ref.slice(0) : void 0;
	},

	presenceData: function(channel) {
		return this.get("pnState")["_presData"][channel] || {};
	},

	msgEvent: function(channel) {
		return `pn-message:${channel}`;
	},

	prsEvent: function(channel) {
		return `pn-presence:${channel}`;
	},

	publish: function(args) {
		return this.get("PN")["publish"].apply(this.get("PN"), args);
	},

	state: function(args) {
		return this.get("PN")["state"](args);
	},

	auth: function(){
		return this.get("PN")["auth"].apply(this.get("PN"), arguments);
	},

	audit: function(){
		return this.get("PN")["audit"].apply(this.get("PN"), arguments);
	},

	grant: function(){
		return this.get("PN")["grant"].apply(this.get("PN"), arguments);
	},

	whereNow: function(args) {
		return this.get("PN")["where_now"](args);
	},

	hereNow: function(args) {
		args          = this._installHandlers(args);
		args.state    = true;
		args.callback = args.presence;
		delete args.presence;
		delete args.message;
		return this.get("PN")["here_now"](args);
	},

	history: function(args) {
		args.callback = this._fireMessages(args.channel);
		return this.get("PN")["history"](args);
	},

	subscribe: function(args) {
		let _base, _name, pnState = this.get("pnState");

		args = this._installHandlers(args);

		if (pnState["_channels"].indexOf(args.channel) < 0) {
			pnState["_channels"].push(args.channel);
		}

		(_base = pnState["_presence"])[_name = args.channel] || (_base[_name] = []);

		return this.get("PN")["subscribe"].apply(this.get("PN"), args);
	},

	unsubscribe: function(args) {
		let cpos, pnState = this.get("pnState");

		cpos = pnState["_channels"].indexOf(args.channel);

		if (cpos !== -1) {
			pnState["_channels"].splice(cpos, 1);
		}

		pnState["_presence"][args.channel] = null;
		this.off(this.msgEvent(args.channel));
		this.off(this.prsEvent(args.channel));

		return this.get("PN")["unsubscribe"](args);
	},

	_fireMessages: function(channel) {
		let PN   = this.get("PN");
		let self = this;

		return function(payload) {
			return PN.each(payload[0], function(message) {
				return self.trigger(self.msgEvent(channel), {
					message: message,
					channel: channel
				});
			});
		};
	},

	_installHandlers: function(args) {
		let self      = this;
		let PN        = this.get("PN");
		let pnState   = this.get("pnState");
		let _message  = args.message;
		let _presence = args.presence;

		args.message = function() {
			self.trigger(self.msgEvent(args.channel), {
				channel:args.channel,
				message: arguments[0],
				env    : arguments[1]
			});

			if (_message) {
				return _message(arguments);
			}
		};

		args.presence = function() {
			let _base1, _base2, cpos;
			let channel = args.channel;
			let event   = arguments[0];

			if (event.uuids) {
				PN.each(event.uuids, function(uuid) {					
					let state = uuid.state || null;

					uuid = uuid.uuid | uuid;

					(_base1 = pnState["_presence"])[channel] || (_base1[channel] = []);

					if (pnState["_presence"][channel].indexOf(uuid) < 0) {
						pnState["_presence"][channel].push(uuid);
					}

					(_base2 = pnState["_presData"])[channel] || (_base2[channel] = []);

					if (state) {
						return pnState["_presData"][channel][uuid] = state;
					}
				});
			}
			else {
				if (event.uuid && event.action) {
					(_base1 = pnState["_presence"])[channel] || (_base1[channel] = []);
					(_base2 = pnState["_presData"])[channel] || (_base2[channel] = {});

					if (event.action === "leave") {
						cpos = pnState["_presence"][channel].indexOf(event.uuid);

						if (cpos !== -1) {
							pnState["_presence"][channel].splice(cpos, 1);
						}
						delete pnState["_presData"][channel][event.uuid];
					}
					else {
						if (pnState["_presence"][channel].indexOf(event.uuid) < 0) {
							pnState["_presence"][channel].push(event.uuid);
						}
						if (event.data) {
							pnState["_presData"][channel][event.uuid] = event.data;
						}
					}
				}
			}

			return self.trigger(self.prsEvent(args.channel), {
				event  : event,
				channel: channel,
				message: arguments[1]
			});
		};
		return args;
	}
});
