var JaxxApp = function() {
    this._appVersion = "1.1.7";
    this._settings = new JaxxAppSettings();
    this._ui = new JaxxUI();
    this._user = new JaxxUser();
    this._txManager = new JaxxTXManager();
    this._shapeShiftHelper = new JaxxShapeShiftHelper();
    
    this._relayManagerBitcoin = new RelayManager();
    this._relayManagerImplementationBitcoin = new RelayManagerBitcoin();

    this._relayManagerLitecoin = new RelayManager();
    this._relayManagerImplementationLitecoin = new RelayManagerLitecoin();

    this._relayManagerZCash = new RelayManager();
    this._relayManagerImplementationZCash = new RelayManagerZCash();
}

JaxxApp.prototype.initialize = function() {
    this._settings.initialize();
    this._ui.initialize();
    this._user.initialize();
    this._txManager.initialize();
    this._shapeShiftHelper.initialize();
    this._relayManagerBitcoin.initialize(this._relayManagerImplementationBitcoin);
    this._relayManagerLitecoin.initialize(this._relayManagerImplementationLitecoin);
    this._relayManagerZCash.initialize(this._relayManagerImplementationZCash);
}

JaxxApp.prototype.setupWithWallet = function(wallet) {
    this._user.setupWithWallet(wallet);
}

JaxxApp.prototype.getVersionCode = function() {
    return this._appVersion;
}

JaxxApp.prototype.getSettings = function() {
    return this._settings;
}

JaxxApp.prototype.getUI = function() {
    return this._ui;
}

JaxxApp.prototype.getUser = function() {
    return this._user;
}

JaxxApp.prototype.getTXManager = function() {
    return this._txManager;
}

JaxxApp.prototype.getShapeShiftHelper = function() {
    return this._shapeShiftHelper;
}

//@note: @todo: @next: @relays:
JaxxApp.prototype.getBitcoinRelays = function() {
    return this._relayManagerBitcoin;
}

//@note: @todo: @next: @relays:
JaxxApp.prototype.getLitecoinRelays = function() {
    return this._relayManagerLitecoin;
}

//@note: @todo: @next: @relays:
JaxxApp.prototype.getZCashRelays = function() {
    return this._relayManagerZCash;
}