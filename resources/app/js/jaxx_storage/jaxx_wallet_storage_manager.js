var WalletStorageManager = function() {
    this._pouchFoldStorage = [];
};

WalletStorageManager.prototype.initialize = function() {
    return;
    this._pouchFoldStorage[COIN_BITCOIN] = new WalletStorageBitcoin();
    this._pouchFoldStorage[COIN_ETHEREUM] = new WalletStorageEthereum();
    this._pouchFoldStorage[COIN_THEDAO_ETHEREUM] = new WalletStorageTheDaoEthereum();
    this._pouchFoldStorage[COIN_DASH] = new WalletStorageDash();
    this._pouchFoldStorage[COIN_ETHEREUM_CLASSIC] = new WalletStorageEthereumClassic();
    this._pouchFoldStorage[COIN_AUGUR_ETHEREUM] = new WalletStorageAugurEthereum();

    for (var i = 0; i < COIN_NUMCOINTYPES; i++) {
        this._pouchFoldStorage[i].initialize();
    }
}

WalletStorageManager.prototype.getPouchFoldStorage = function(coinType) {
    return this._pouchFoldStorage[coinType];
}