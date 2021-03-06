var RelayManagerLisk = function() {
    this._debugRelays = true; // Set to 'true' to report messages from the relay log.
    this._name = "LiskRelays"; // Just maybe used for testing.
    this._relayNodes = [];
    this._defaultRelayIndex = 0;
}

RelayManagerLisk.prototype.initialize = function() {
    if (typeof(importScripts) !== 'undefined') {
        importScripts("../relays/relay_nodes_lisk/jaxx_lsk_custom_relay.js");
//        importScripts("../relays/relay_nodes_litecoin/jaxx_ltc_custom_relay.js");
    }

    this._relayNodes = [
        new LSKJaxxCustomRelay(),
//        new LTCJaxxCustomRelay(),
    ]
}

RelayManagerLisk.prototype.getDefaultRelayIndex = function() {
    return this._defaultRelayIndex;
}

if (typeof(exports) !== 'undefined') {
    exports.relayManagerImplementation = RelayManagerLisk;
}