var JaxxApp = function() {
//    this._relayManagerBitcoin = null;
//    this._relayManagerImplementationBitcoin = null;
//    this._relayManagerLitecoin = null;
//    this._relayManagerImplementationLitecoin = null;
    //@note: @here: @todo: @next: relay implementations, probably a good idea to make this generic.
    
    this._intTimeoutTimeForServerRequests = 10000; // milliseconds
    this._objTimeoutForServerRequests = null; // @Note: This is just a catch-all solution. We should implement a timeout for each function really.
    this._functionsToTest = ['getTxLists', 'getTxCount', 'getTxDetails', 'getAddressBalances', 'getUTXO'];
    
    this._lastBlock = [];
    this._addresses = [];
    this._txHashes = [];
    this._balanceAddress = [];
    this._whiteListForFunction = [];

    // Bitcoin related.
    this._lastBlock[COIN_BITCOIN] = "417370";
    this._addresses[COIN_BITCOIN] = "1NoMhneypFEt2VvPBkn8cUXxb7vhhUBKLE,156NsCs1jrKbb1zNne6jB2ZqMfBnd6KRve,1BF9aFApL44QBq7ofnVMweqHEFF8ayxBq9,1PJSEkeiGt4n6FfARxbirgNLTaVQAYp2Hf,1os9tWLDhYEfN6Et8HQWpv5gsS3LKahqT";
    this._txHashes[COIN_BITCOIN] = ['8907aac8024726ea6398b1253696e27d5b5df32537a983b8b2af0e2f7ba68e3b', '95132a35aad2186ad57e4683db159df05d6ef1f1d39b3462833417449baf2167'];
    this._balanceAddress[COIN_BITCOIN] = '198aMn6ZYAczwrE5NvNTUMyJ5qkfy4g3Hi';
    
    // Litecoin related.
    this._lastBlock[COIN_LITECOIN] = "1079380";
    this._addresses[COIN_LITECOIN] = "LcFAosSLzy9TuRRedcLVriVd8938P2o69p,LeL16MDWU5jS3oeHHwEZRBTDExwPbNgcvy,LUnWaHtvTBbTmJ5ycM9XJP1DohAg3h9gHF";
    this._txHashes[COIN_LITECOIN] = ['1df9a5db8f3dbeac96d3b20cab807634b34ecea5915d5dbdadca95b1c8ec8c41', 'caaeb42a2367f9d0dcd5bfdb6d90fb7d9fef0bffbf147a9775a0f5d831e4b780'];
    this._balanceAddress[COIN_LITECOIN] = 'LS7SmxbMgCVYywnEbVDhrWxKjsYi4DsLg3';
    //LYoFmzcS5YXHRDzKd6eBExHi1XN5iYqNHB over 15k transactions
    
    // Z-Cash Related. 2016-10-26
    this._lastBlock[COIN_ZCASH] = "2468";
    this._addresses[COIN_ZCASH] = "tmRqAQWsY37h2FYr7cueRTNEiSkz1TkuHoD,tmDBA6bZRGVwA6tSduJPpZQQJyjMbkkJV44,t1WRSHyUHhrgRX5JcMZTFKsMWnEdXgyDiLM";
    this._txHashes[COIN_ZCASH] = ['c2a84310ded895eb838599c6cf1672c8078bc6f9b745a0a7c67889c2fc5afcef', 'bc01ef45803aceb8328b79fb12854267ccf6ee4bb1005e34933f56ea6a4b1ba2'];
    this._balanceAddress[COIN_ZCASH] = 'tmRqAQWsY37h2FYr7cueRTNEiSkz1TkuHoD';
    //this._blockHashes[COIN_ZCASH] = ['000001508ec902c7c52b3813ea4204f7bc222e06c0117812b8c49f34e9e86be7'];
    // The following has a balance - tmX9mitRNG827gxDQW2kwNW2RADxy8bzhYa
    
    this._whiteListForFunction["getUTXO"] = ["confirmations", "unconfirmed", "block"];
    
    
    // Comparison constants:
    this._whiteList_getTxList = ["unconfirmed"];
    this._whiteList_getTxDetails = ["confirmations", "unconfirmed", "block"];
    
    this._filePath = '../../../logs/somedata.txt';
    this._logFullPath = '';
    
    //this._relaysCoinTypesToTest = [COIN_LITECOIN];
    this._relaysCoinTypesToTest = [COIN_BITCOIN, COIN_LITECOIN, COIN_ZCASH]; // @TODO: Add Z-Cash
    this._relayManager = [];
    this._relayManagerImplementation = [];
}

JaxxApp.prototype.initialize = function() {
    /*this._relayManagerBitcoin = new BitcoinRelays();
    this._relayManagerBitcoin.initialize();

    this._relayManagerLitecoin = new LitecoinRelays();
    this._relayManagerLitecoin.initialize(); */
    this._relayManagerImplementation[COIN_BITCOIN] = new RelayManagerBitcoin();
    this._relayManagerImplementation[COIN_LITECOIN] = new RelayManagerLitecoin();
    this._relayManagerImplementation[COIN_ZCASH] = new RelayManagerZCash();

    for (var i = 0; i < this._relaysCoinTypesToTest.length; i++) {
        var coinType = this._relaysCoinTypesToTest[i];
        
        this._relayManager[coinType] = new RelayManager();
        this._relayManager[coinType].initialize(this._relayManagerImplementation[coinType]);
    }
    
    this._filePath = '../../../logs/somedata' + Date.now() + '.txt';
    
    baseLog("[JaxxApp] :: initialize :: filePath :: " + this._filePath);
}

JaxxApp.prototype.getRelayManager = function(coinType) {
    return this._relayManager[coinType];
}

//g_JaxxApp = new JaxxApp();
//g_JaxxApp.initialize();

// ********************************************************************************
//                          Order for Relays 
//                            - Blockr
//                            - BlockExplorer
//                            - Block Cypher
// ********************************************************************************

// ********************************************************************************
//                          Current Order of Tests  
//                            - Tx List
//                            - Tx Details
//                            - Tx Balance 
//                            - Tx Fixed Block Height
//                            - Tx Check all relays live
// ********************************************************************************



// ********************************************************************************
//                  Test Relays have a list of transactions
// ********************************************************************************


// ********************************************************************************
//                     Run Tests Manually Here
// ********************************************************************************

JaxxApp.prototype.getLastBlockHeights = function(coinType) {
    for (var i = 0; i < this._relayManager[coinType]._relays.length; i++) {
        var curRelay = this._relayManager[coinType]._relays[i];

        console.log("relay :: " + curRelay._name + " :: getLastBlockHeight :: " + curRelay.getLastBlockHeight());
    }
}

JaxxApp.prototype.doGenericCompare = function(listA, listB, strFunctionName) {
    var whiteList = this._whiteListForFunction[strFunctionName];
    return this.compareObjectsWithWhitelist(listA, listB, 'notwhitelisted', whiteList);
}

JaxxApp.prototype.doTxListCompare = function(listA, listB) {
    return this.compareObjectsWithWhitelist(listA, listB, 'notwhitelisted', this._whiteList_getTxList);
}

JaxxApp.prototype.compareObjectsWithWhitelist = function(object1, object2, comparisonKey, whiteList) {
    // Returns true if 2 data objects are objectively equal.
    // whiteList: contains a list of values where we return true when the comparisonKey is one of those values.
    // comparisonKey: is the key whenever the next subcomparison is a dictionary.
    // g_JaxxApp.compareObjectsWithWhitelist({'a':'b', 'i': 'j'}, {'a':'b', 'i': 'k'}, 'c', ['c']) >> true
    // g_JaxxApp.compareObjectsWithWhitelist({'a':'b', 'i': 'j'}, {'a':'b', 'i': 'k'}, 'b', ['i']) >> true
    // g_JaxxApp.compareObjectsWithWhitelist({'a':'b', 'i': 'j'}, {'a':'b', 'i': 'k'}) >> false
    // g_JaxxApp.compareObjectsWithWhitelist({'a':'b'}, {'a':'b'}) >> true
    // g_JaxxApp.compareObjectsWithWhitelist('c', 'c') >> true
    
    // Whitelist here
    if (typeof(whiteList) !== 'undefined' && whiteList !== null && typeof(comparisonKey) !== 'undefined' && comparisonKey !== null) {
        if (typeof(whiteList.indexOf) === 'function') {
            if (whiteList.indexOf(comparisonKey) > -1) {
                return true;
            }
        }
        if (whiteList.hasOwnProperty(comparisonKey)){
            return true;
        }
    }
    
    // Array case here.
    if (Array.isArray(object1) || Array.isArray(object2)){
        if (Array.isArray(object1) && Array.isArray(object2) && object1.length === object2.length) {
            for (var i = 0; i < object1.length ; i++){
                if (!this.compareObjectsWithWhitelist(object1[i], object2[i], 'arrayElement', whiteList)){
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    }
    
    // Special cases here
    if (typeof(object1) === 'string'){
        return (object1 === object2)
    }
    if (comparisonKey === 'time') {
        if (object1 * 1.03 < object2) {
            return false;
        }
        if (object2 * 1.03 < object1){
            return false
        }
        return true;
    }

    // Handling dictionaries
    if (typeof(object1) !== 'undefined' && object1 !== null && Object.keys(object1) && Object.keys(object1).length > 0){
        if (Object.keys(object1).length != Object.keys(object2).length) {
            return false; // When the dictionaries being compared don't have the same keys.
        }

        for (var key in object1) {
            // @TODO: More riggorous key checking
            if (object1.hasOwnProperty(key) && object2.hasOwnProperty(key)) {
                if (!this.compareObjectsWithWhitelist(object1[key], object2[key], key, whiteList)) {
                    return false;
                }
            }
        }
    } else {
        return (object1 === object2);
    }
    return true;
}

JaxxApp.prototype.compareObjects = function(object1, object2, comparisonKey) {
	// Returns true if 2 data objects are objectively equal.
	if (typeof(comparisonKey) === 'undefined' || comparisonKey === null){
		comparisonKey = ""
	}
	if (comparisonKey === "No case") {
		
	} else {
		if (object1 === object2) {
			return true;
		}
	}
	
	return false;
}

JaxxApp.prototype.compareResponses = function(coinType, passthroughParams, strFunctionName) {
    var compareList = passthroughParams.compareList;
    var referenceRelayIndex = passthroughParams.compareList.bestRelayIndex;

    for (var i = 0; i < this._relayManager[coinType]._relays.length; i++) {
        var isReference = (i === referenceRelayIndex) ? true : false;

        var outStr = "<div class='" + ((isReference === true) ? "cssReference" : "cssSuperNumerary") + "'>["+compareList.relayFunctionName+"] [" + this._relayManager[coinType]._relays[i]._name + "] [" + this._relayManager[coinType]._relays[i]._name + "] reference :: " + ((i === referenceRelayIndex) ? "yes" : "no") + " :: " + JSON.stringify(compareList.response[i]) + "\n</div>";
        //        console.log(outStr);

        this.outputToLog(outStr);
    }

    console.log(compareList.relayFunctionName+"test completed :: " + JSON.stringify(compareList));
    var referenceResponse = compareList.response[referenceRelayIndex];
    var numPassed = 1;
    var spacer = "<div><br></div>\n";
    this.outputToLog(spacer);

    for (var i = 0; i < this._relayManager[coinType]._relays.length; i++) {
        if (i !== referenceRelayIndex) {
            var curRelay = this._relayManager[coinType]._relays[i];

            var didPass = this.doGenericCompare(compareList.response[i], referenceResponse, strFunctionName);

            var outStr = "<div class='" + ((didPass === true) ? "cssSucceed" : "cssFail") + "'>["+compareList.relayFunctionName+"] [" + this._relayManager[coinType]._relays[i]._name + "] :: didPass :: " + didPass + "\n</div>";
            //            console.log(outStr);

            this.outputToLog(outStr);

            if (didPass) {
                numPassed++;
            }
        }
    }

    var spacer = "<div><br></div>\n";
    this.outputToLog(spacer);

    console.log("total relays passed :: " + numPassed);

    compareList.completeCallback();
}

JaxxApp.prototype.compareTxLists = function(coinType, passthroughParams) {
    var compareList = passthroughParams.compareList;
    var referenceRelayIndex = passthroughParams.compareList.bestRelayIndex;

    for (var i = 0; i < this._relayManager[coinType]._relays.length; i++) {
        var isReference = (i === referenceRelayIndex) ? true : false;
        
        var outStr = "<div class='" + ((isReference === true) ? "cssReference" : "cssSuperNumerary") + "'>[txLists] [" + this._relayManager[coinType]._relays[i]._name + "] [" + this._relayManager[coinType]._relays[i]._name + "] reference :: " + ((i === referenceRelayIndex) ? "yes" : "no") + " :: " + JSON.stringify(compareList.txLists[i]) + "\n</div>";
//        console.log(outStr);
        
        this.outputToLog(outStr);
    }
    
    console.log("txList test completed :: " + JSON.stringify(compareList));

    var referenceTxList = compareList.txLists[referenceRelayIndex];
    
    var numPassed = 1;
    
    var spacer = "<div><br></div>\n";
    this.outputToLog(spacer);
    
    for (var i = 0; i < this._relayManager[coinType]._relays.length; i++) {
        if (i !== referenceRelayIndex) {
            var curRelay = this._relayManager[coinType]._relays[i];
        
            var didPass = this.doTxListCompare(compareList.txLists[i], referenceTxList);
            
            var outStr = "<div class='" + ((didPass === true) ? "cssSucceed" : "cssFail") + "'>[txLists] [" + this._relayManager[coinType]._relays[i]._name + "] :: didPass :: " + didPass + "\n</div>";
//            console.log(outStr);

            this.outputToLog(outStr);

            if (didPass) {
                numPassed++;
            }
        }
    }
    
    var spacer = "<div><br></div>\n";
    this.outputToLog(spacer);

    console.log("total relays passed :: " + numPassed);

    compareList.completeCallback();
}

JaxxApp.prototype.getTxLists = function(coinType, callback) {
    var self = this;
    
    var bestRelayIndex = this._relayManager[coinType].getBestRelayIndex();

    var delegateFunction = "getTxList";
    
    var compareList = {bestRelayIndex: bestRelayIndex, numRelaysProcessed: 0, numRelaysTotal: this._relayManager[coinType]._relays.length, txLists: {}, completeCallback: callback};
    
    var relayArguments = [];
    
    for (var i = 0; i < this._relayManager[coinType]._relays.length; i++) {
        var curName = this._relayManager[coinType]._relays[i]._name;
        relayArguments[i] = [this._addresses[coinType], function(status, txList, passthroughParams) {
            var didComplete = self.processRelayReturnValues("txLists", txList, passthroughParams);
            
            if (didComplete) {
                self.compareTxLists(coinType, passthroughParams);
            }
        }];
    }
    
    var bestRelayArguments = [this._addresses[coinType], function(status, txList) {
        console.log("txList :: " + JSON.stringify(txList));
        
        compareList.txLists[bestRelayIndex] = txList;
        compareList.numRelaysProcessed++;

        for (var i = 0; i < self._relayManager[coinType]._relays.length; i++) {
            if (i !== bestRelayIndex) {
//                var curRelay = self._curRelayManager._relays[i];
                
                var passthroughParams = {relayIndex: i, compareList: compareList};
            
                self._relayManager[coinType].startRelayTaskWithArbitraryRelay(i, delegateFunction, relayArguments[i], callbackIndex, isCallbackSuccessfulFunction, isCallbackPermanentFailureFunction, actionTakenWhenTaskIsNotExecuted, passthroughParams);
            }
        }
    }];
    
    var callbackIndex = 1;

    var isCallbackSuccessfulFunction = function(status) {
        if (typeof(status) === 'string' && status === 'success') {
//            console.log("callback successful");
            return true;
        } else {
            console.log("callback unsuccessful");
            return false;
        }
    }

    var isCallbackPermanentFailureFunction = function() {
		return true;
    }

    var actionTakenWhenTaskIsNotExecuted = function(returnArgs) {
        var passthroughParams = returnArgs[2];
        
        var didComplete = self.processRelayReturnValues("txLists", {}, passthroughParams);
        
        if (didComplete) {
            self.compareTxLists(coinType, passthroughParams);
        }
    };
    
    
    console.log("trying to txlist with an array of addresses :: " + this._addresses[coinType] + " :: using relay :: " + this._relayManager[coinType]._relays[bestRelayIndex]._name);
    
    this._relayManager[coinType].startRelayTaskWithArbitraryRelay(bestRelayIndex, delegateFunction, bestRelayArguments, callbackIndex, isCallbackSuccessfulFunction, isCallbackPermanentFailureFunction, actionTakenWhenTaskIsNotExecuted, ["passthroughParameters"]);
}


JaxxApp.prototype.doTxCountCompare = function(listA, listB) {
    var doesMatch = true;

    var dontCompareList = {};
//    dontCompareList["confirmations"] = true;
//    dontCompareList["unconfirmed"] = true;

    var allKeys = Object.keys(listA);
    for (var i = 0; i < allKeys.length; i++) {
        var curKey = allKeys[i];

        if (typeof(dontCompareList[curKey.toLowerCase()]) === 'undefined' || dontCompareList[curKey.toLowerCase()] === null) {
            if (listA[curKey] === listB[curKey]) {

            } else {
                doesMatch = false;
                break;
            }
        } else {
            //@note: is on the black list, don't compare.        
        }
    }

    return doesMatch;
}

JaxxApp.prototype.compareTxCounts = function(coinType, passthroughParams) {
    var compareList = passthroughParams.compareList;
    var referenceRelayIndex = passthroughParams.compareList.bestRelayIndex;
    
    for (var i = 0; i < this._relayManager[coinType]._relays.length; i++) {
        var isReference = (i === referenceRelayIndex) ? true : false;

        var outStr = "<div class='" + ((isReference === true) ? "cssReference" : "cssSuperNumerary") + "'>[txCounts] [" + this._relayManager[coinType]._relays[i]._name + "] reference :: " + ((i === referenceRelayIndex) ? "yes" : "no") + " :: " + JSON.stringify(compareList.txCounts[i]) + "\n</div>";
//        console.log(outStr);

        this.outputToLog(outStr);
    }

    //    console.log("txList test completed :: " + JSON.stringify(compareList));

    var spacer = "<div><br></div>\n";
    this.outputToLog(spacer);

    var referenceTxCount = compareList.txCounts[referenceRelayIndex];

    var numPassed = 1;

    for (var i = 0; i < this._relayManager[coinType]._relays.length; i++) {
        if (i !== referenceRelayIndex) {
            var curRelay = this._relayManager[coinType]._relays[i];

            var didPass = this.doTxCountCompare(compareList.txCounts[i], referenceTxCount);
            
            var outStr = "<div class='" + ((didPass === true) ? "cssSucceed" : "cssFail") + "'>[txCounts] [" + this._relayManager[coinType]._relays[i]._name + "] :: didPass :: " + didPass + "\n</div>";
//            console.log(outStr);

            this.outputToLog(outStr);

            if (didPass) {
                numPassed++;
            }
        }
    }
    
    var spacer = "<div><br></div>\n";
    this.outputToLog(spacer);

    console.log("total relays passed :: " + numPassed);

    compareList.completeCallback();
}

/* // Do this for getTxLists
JaxxApp.prototype.getUTXO = function(coinType, callback) {
    var relayArguments = [this._addresses[coinType], function(){console.log("This callback will be substituted.");}];
    this.runRelayFunctionUsingString('getTxList', coinType, callback, relayArguments, 1, null);
} */

JaxxApp.prototype.getUTXO = function(coinType, callback) {
    var relayArguments = [this._addresses[coinType], function(){console.log("This callback will be substituted.");}];
    this.runRelayFunctionUsingString('getUTXO', coinType, callback, relayArguments, 1, null);
} 

JaxxApp.prototype.runRelayFunctionUsingString = function(strFunctionName, coinType, callback, defaultRelayArguments, callbackIndex, comparisonFunction){
    // @TODO: Add a comparison function.
    // strFunctionName ie. "getTxLists"
    var self = this;
    var bestRelayIndex = this._relayManager[coinType].getBestRelayIndex(); // ie. 0
    
    var compareList = {bestRelayIndex: bestRelayIndex, numRelaysProcessed: 0, numRelaysTotal: this._relayManager[coinType]._relays.length, response: {}, completeCallback: callback, relayFunctionName: strFunctionName};

    var relayArguments = [];

    for (var i = 0; i < this._relayManager[coinType]._relays.length; i++) {
        var curName = this._relayManager[coinType]._relays[i]._name;
        //relayArguments[i] = defaultRelayArguments;
        relayArguments[i] = [];
        for (var j = 0; j < defaultRelayArguments.length; j++){
            relayArguments[i].push(defaultRelayArguments[j]);
        }
        relayArguments[i][callbackIndex] = function(status, response, passthroughParams) {
            var didComplete = self.processRelayReturnValuesGeneral(strFunctionName, response, passthroughParams);
            if (didComplete) {
                self.compareResponses(coinType, passthroughParams, strFunctionName); // @TODO: substitute with a general comparison function.
            }
        };
    }
    
    var bestRelayArguments = defaultRelayArguments;
    bestRelayArguments[callbackIndex] = function(status, response, passthoughParams) {
        console.log(strFunctionName + " :: " + JSON.stringify(response));
        compareList.response[bestRelayIndex] = response;
        compareList.numRelaysProcessed++;

        for (var i = 0; i < self._relayManager[coinType]._relays.length; i++) {
            if (i !== bestRelayIndex) {
                //                var curRelay = self._curRelayManager._relays[i];
                var passthroughParams = {relayIndex: i, compareList: compareList};

                self._relayManager[coinType].startRelayTaskWithArbitraryRelay(i, strFunctionName, relayArguments[i], callbackIndex, isCallbackSuccessfulFunction, isCallbackPermanentFailureFunction, actionTakenWhenTaskIsNotExecuted, passthroughParams);
            }
        }
    };

    

    var isCallbackSuccessfulFunction = function(status) {
        if (typeof(status) === 'string' && status === 'success') {
            //            console.log("callback successful");
            return true;
        } else {
            console.log("callback unsuccessful");
            return false;
        }
    }

    var isCallbackPermanentFailureFunction = function() {
        return true;
    }

    var actionTakenWhenTaskIsNotExecuted = function(returnArgs) {
        var passthroughParams = returnArgs[2];
        compareList.numRelaysProcessed++;

        var didComplete = self.processRelayReturnValuesGeneral(strFunctionName, {}, passthroughParams); // @TODO: "txLists" generalize

        if (didComplete) {
            self.compareResponses(coinType, passthroughParams, strFunctionName); // @TODO: check this comparison function.
        }
    };


    console.log("trying to txlist with an array of addresses :: " + this._addresses[coinType] + " :: using relay :: " + this._relayManager[coinType]._relays[bestRelayIndex]._name);

    var passthroughParams = {relayIndex: bestRelayIndex, compareList: compareList};
    this._relayManager[coinType].startRelayTaskWithArbitraryRelay(bestRelayIndex, strFunctionName, bestRelayArguments, callbackIndex, isCallbackSuccessfulFunction, isCallbackPermanentFailureFunction, actionTakenWhenTaskIsNotExecuted, passthroughParams);
}

JaxxApp.prototype.getTxCount = function(coinType, callback) {
    var self = this;

    var bestRelayIndex = this._relayManager[coinType].getBestRelayIndex();

    var delegateFunction = "getTxCount";

    var compareList = {bestRelayIndex: bestRelayIndex, numRelaysProcessed: 0, numRelaysTotal: this._relayManager[coinType]._relays.length, txCounts: {}, completeCallback: callback};

    var relayArguments = [];

    for (var i = 0; i < this._relayManager[coinType]._relays.length; i++) {
        var curName = this._relayManager[coinType]._relays[i]._name;
        relayArguments[i] = [this._addresses[coinType], function(status, txCount, passthroughParams) {
            var didComplete = self.processRelayReturnValues("txCounts", txCount, passthroughParams);
            
            if (didComplete === true) {
                console.log("compare txCounts");
                self.compareTxCounts(coinType, passthroughParams);
            }
        }];
    }

    var bestRelayArguments = [this._addresses[coinType], function(status, txCount) {
        console.log("txCount :: " + JSON.stringify(txCount));

        compareList.txCounts[bestRelayIndex] = txCount;
        compareList.numRelaysProcessed++;

        for (var i = 0; i < self._relayManager[coinType]._relays.length; i++) {
            if (i !== bestRelayIndex) {
                //                var curRelay = self._curRelayManager._relays[i];

                var passthroughParams = {relayIndex: i, compareList: compareList};

                self._relayManager[coinType].startRelayTaskWithArbitraryRelay(i, delegateFunction, relayArguments[i], callbackIndex, isCallbackSuccessfulFunction, isCallbackPermanentFailureFunction, actionTakenWhenTaskIsNotExecuted, passthroughParams);
            }
        }
    }];

    var callbackIndex = 1;

    var isCallbackSuccessfulFunction = function(status) {
        if (typeof(status) === 'string' && status === 'success') {
            // console.log("callback successful");
            return true;
        } else {
            console.log("callback unsuccessful");
            return false;
        }
    }

    var isCallbackPermanentFailureFunction = function() {
        console.log("isCallbackPermanentFailureFunction");
        return true;
    }

    var actionTakenWhenTaskIsNotExecuted = function(returnArgs) {
        var passthroughParams = returnArgs[2];
        
        var didComplete = self.processRelayReturnValues("txCounts", -1, passthroughParams);
        
        if (didComplete) {
            self.compareTxCounts(coinType, passthroughParams);
        } 
    };
    this._relayManager[coinType].startRelayTaskWithArbitraryRelay(bestRelayIndex, delegateFunction, bestRelayArguments, callbackIndex, isCallbackSuccessfulFunction, isCallbackPermanentFailureFunction, actionTakenWhenTaskIsNotExecuted, ["passthroughParameters"]);
}

JaxxApp.prototype.doTxDetailsCompare = function(listA, listB) {
    var doesMatch = true;

    //var whitelist = {};
    //whitelist["confirmations"] = true;
    //whitelist["unconfirmed"] = true;
    //whitelist["block"] = true;

    return this.compareObjectsWithWhitelist(listA, listB, 'notwhitelisted', this._whiteList_getTxDetails);
}

JaxxApp.prototype.compareTxDetails = function(coinType, passthroughParams) {
    var compareList = passthroughParams.compareList;
    var referenceRelayIndex = passthroughParams.compareList.bestRelayIndex;
    
    for (var i = 0; i < this._relayManager[coinType]._relays.length; i++) {
        var isReference = (i === referenceRelayIndex) ? true : false;
        
        var outStr = "<div class='" + ((isReference === true) ? "cssReference" : "cssSuperNumerary") + "'>[txDetails] [" + this._relayManager[coinType]._relays[i]._name + "] reference :: " + ((i === referenceRelayIndex) ? "yes" : "no") + " :: " + JSON.stringify(compareList.txDetails[i]) + "\n</div>";
//        console.log(outStr);

        this.outputToLog(outStr);
    }

    //    console.log("txList test completed :: " + JSON.stringify(compareList));
    
    var spacer = "<div><br></div>\n";
    this.outputToLog(spacer);

    var referenceTxDetails = compareList.txDetails[referenceRelayIndex];

    var numPassed = 1;

    for (var i = 0; i < this._relayManager[coinType]._relays.length; i++) {
        if (i !== referenceRelayIndex) {
            var curRelay = this._relayManager[coinType]._relays[i];

            var didPass = this.doTxDetailsCompare(compareList.txDetails[i], referenceTxDetails);
            
            var outStr = "<div class='" + ((didPass === true) ? "cssSucceed" : "cssFail") + "'>[txDetails] [" + this._relayManager[coinType]._relays[i]._name + "] :: didPass :: " + didPass + "\n</div>";
//            console.log(outStr);

            this.outputToLog(outStr);

            if (didPass) {
                numPassed++;
            }
        }
    }
    
    var spacer = "<div><br></div>\n";
    this.outputToLog(spacer);

    console.log("total relays passed :: " + numPassed);
    
    compareList.completeCallback();
}

JaxxApp.prototype.getTxDetails = function(coinType, callback) {
    var self = this;

    var bestRelayIndex = this._relayManager[coinType].getBestRelayIndex();

    var delegateFunction = "getTxDetails";

    var compareList = {bestRelayIndex: bestRelayIndex, numRelaysProcessed: 0, numRelaysTotal: this._relayManager[coinType]._relays.length, txDetails: {}, completeCallback: callback};

    var relayArguments = [];

    for (var i = 0; i < this._relayManager[coinType]._relays.length; i++) {
        var curName = this._relayManager[coinType]._relays[i]._name;
        relayArguments[i] = [this._txHashes[coinType], function(status, txDetails, passthroughParams) {
            var didComplete = self.processRelayReturnValues("txDetails", txDetails, passthroughParams);
            
            if (didComplete) {
                self.compareTxDetails(coinType, passthroughParams);
            }
        }];
    }

    var bestRelayArguments = [this._txHashes[coinType], function(status, txDetails) {
        //        console.log("txList :: " + JSON.stringify(txList));

        compareList.txDetails[bestRelayIndex] = txDetails;
        compareList.numRelaysProcessed++;

        for (var i = 0; i < self._relayManager[coinType]._relays.length; i++) {
            if (i !== bestRelayIndex) {
                //                var curRelay = self._curRelayManager._relays[i];

                var passthroughParams = {relayIndex: i, compareList: compareList};
                self._relayManager[coinType].startRelayTaskWithArbitraryRelay(i, delegateFunction, relayArguments[i], callbackIndex, isCallbackSuccessfulFunction, isCallbackPermanentFailureFunction, actionTakenWhenTaskIsNotExecuted, passthroughParams);
            }
        }
    }];

    var callbackIndex = 1;

    var isCallbackSuccessfulFunction = function(status) {
        if (typeof(status) === 'string' && status === 'success') {
            // console.log("callback successful");
            return true;
        } else {
            console.log("callback unsuccessful");
            return false;
        }
    }

    var isCallbackPermanentFailureFunction = function(status) {
		return true;
    }

    var actionTakenWhenTaskIsNotExecuted = function(returnArgs) {
        var passthroughParams = returnArgs[2];

        var didComplete = self.processRelayReturnValues("txDetails", {}, passthroughParams);
        
        if (didComplete) {
            self.compareTxDetails(coinType, passthroughParams);
        }
    };
    
    this._relayManager[coinType].startRelayTaskWithArbitraryRelay(bestRelayIndex, delegateFunction, bestRelayArguments, callbackIndex, isCallbackSuccessfulFunction, isCallbackPermanentFailureFunction, actionTakenWhenTaskIsNotExecuted, ["passthroughParameters"]);
}

JaxxApp.prototype.doAccountBalanceCompare = function(listA, listB) {
    var doesMatch = true;

//    console.log("listA :: " + JSON.stringify(listA));
//    console.log("listB :: " + JSON.stringify(listB));
    var dontCompareList = {};
    //    dontCompareList["confirmations"] = true;
    //    dontCompareList["unconfirmed"] = true;

    var allKeys = Object.keys(listA);
    for (var i = 0; i < allKeys.length; i++) {
        var curKey = allKeys[i];

        if (typeof(dontCompareList[curKey.toLowerCase()]) === 'undefined' || dontCompareList[curKey.toLowerCase()] === null) {
            if (listA[curKey] === listB[curKey]) {

            } else {
                doesMatch = false;
                break;
            }
        } else {
            //@note: is on the black list, don't compare.        
        }
    }

    return doesMatch;
}

JaxxApp.prototype.compareAccountBalances = function(coinType, passthroughParams) {
    var compareList = passthroughParams.compareList;
    var referenceRelayIndex = passthroughParams.compareList.bestRelayIndex;

    for (var i = 0; i < this._relayManager[coinType]._relays.length; i++) {
        var isReference = (i === referenceRelayIndex) ? true : false;
        
        var outStr = "<div class='" + ((isReference === true) ? "cssReference" : "cssSuperNumerary") + "'>[addressBalances] [" + this._relayManager[coinType]._relays[i]._name + "] reference :: " + ((isReference === true) ? "yes" : "no") + " :: " + JSON.stringify(compareList.accountBalances[i]) + "\n</div>";
//        console.log(outStr);
        
        this.outputToLog(outStr);
    }

    //    console.log("txList test completed :: " + JSON.stringify(compareList));
    
    var spacer = "<div><br></div>\n";
    this.outputToLog(spacer);

    var referenceBalance = {accountBalance: compareList.accountBalances[referenceRelayIndex]};

    var numPassed = 1;

    for (var i = 0; i < this._relayManager[coinType]._relays.length; i++) {
        if (i !== referenceRelayIndex) {
            var curRelay = this._relayManager[coinType]._relays[i];

            var didPass = this.doAccountBalanceCompare({accountBalance: compareList.accountBalances[i]}, referenceBalance);
            
            var outStr = "<div class='" + ((didPass === true) ? "cssSucceed" : "cssFail") + "'>[addressBalances] [" + this._relayManager[coinType]._relays[i]._name + "] :: didPass :: " + didPass + "\n</div>";
//            console.log(outStr);

            this.outputToLog(outStr);

            if (didPass) {
                numPassed++;
            }
        }
    }

    var spacer = "<div><br></div>\n";
    this.outputToLog(spacer);

    console.log("[addressBalances] total relays passed :: " + numPassed);

    compareList.completeCallback();
}

JaxxApp.prototype.processRelayReturnValues = function(dictElementName, elementValue, passthroughParams, callbackOnAllRelaysCompleted) {
    console.log("compareList :: " + JSON.stringify(passthroughParams));
    if (typeof(passthroughParams) !== 'undefined' && passthroughParams !== null){
        passthroughParams.compareList[dictElementName][passthroughParams.relayIndex] = elementValue;
        passthroughParams.compareList.numRelaysProcessed++;

        if (passthroughParams.compareList.numRelaysProcessed === passthroughParams.compareList.numRelaysTotal) {
            baseLog("finished :: " + dictElementName + " :: passthroughParams :: " + JSON.stringify(passthroughParams));

            return true;
        } else {
            return false;
        }
    } else {
        console.log("passthroughParams is not defined. JSON.stringify({'dictElementName' : dictElementName, 'elementValue': elementValue,'callbackOnAllRelaysCompleted' : callbackOnAllRelaysCompleted})" + JSON.stringify({'dictElementName' : dictElementName, 'elementValue': elementValue, 'callbackOnAllRelaysCompleted' : callbackOnAllRelaysCompleted}));
        return false;
    }
}

JaxxApp.prototype.processRelayReturnValuesGeneral = function(dictElementName, elementValue, passthroughParams, callbackOnAllRelaysCompleted) {
    console.log("compareList :: " + JSON.stringify(passthroughParams));
    if (typeof(passthroughParams) !== 'undefined' && passthroughParams !== null){
        passthroughParams.compareList["response"][passthroughParams.relayIndex] = elementValue;
        passthroughParams.compareList.numRelaysProcessed++;

        if (passthroughParams.compareList.numRelaysProcessed === passthroughParams.compareList.numRelaysTotal) {
            baseLog("finished :: " + dictElementName + " :: passthroughParams :: " + JSON.stringify(passthroughParams));

            return true;
        } else {
            return false;
        }
    } else {
        console.log("passthroughParams is not defined. JSON.stringify({'dictElementName' : dictElementName, 'elementValue': elementValue,'callbackOnAllRelaysCompleted' : callbackOnAllRelaysCompleted})" + JSON.stringify({'dictElementName' : dictElementName, 'elementValue': elementValue, 'callbackOnAllRelaysCompleted' : callbackOnAllRelaysCompleted}));
        return false;
    }
}

JaxxApp.prototype.getAddressBalances = function(coinType, callback) {
    var self = this;

    var bestRelayIndex = this._relayManager[coinType].getBestRelayIndex();

    var delegateFunction = "getAddressBalance";

    var compareList = {bestRelayIndex: bestRelayIndex, numRelaysProcessed: 0, numRelaysTotal: this._relayManager[coinType]._relays.length, accountBalances: {}, completeCallback: callback};

    var relayArguments = [];

    for (var i = 0; i < this._relayManager[coinType]._relays.length; i++) {
        var curName = this._relayManager[coinType]._relays[i]._name;
        relayArguments[i] = [this._balanceAddress[coinType], function(status, accountBalance, passthroughParams) {
            var didComplete = self.processRelayReturnValues("accountBalances", accountBalance, passthroughParams);
            
            if (didComplete === true) {
                self.compareAccountBalances(coinType, passthroughParams);
            }
        }];
    }

    var bestRelayArguments = [this._balanceAddress[coinType], function(status, accountBalance) {
        //        console.log("txList :: " + JSON.stringify(txList));

        compareList.accountBalances[bestRelayIndex] = accountBalance;
        compareList.numRelaysProcessed++;

        for (var i = 0; i < self._relayManager[coinType]._relays.length; i++) {
            if (i !== bestRelayIndex) {
                //                var curRelay = self._curRelayManager._relays[i];

                var passthroughParams = {relayIndex: i, compareList: compareList};

                self._relayManager[coinType].startRelayTaskWithArbitraryRelay(i, delegateFunction, relayArguments[i], callbackIndex, isCallbackSuccessfulFunction, isCallbackPermanentFailureFunction, actionTakenWhenTaskIsNotExecuted, passthroughParams);
            }
        }
    }];

    var callbackIndex = 1;

    var isCallbackSuccessfulFunction = function(status) {
        if (typeof(status) === 'string' && status === 'success') {
            //            console.log("callback successful");
            return true;
        } else {
            console.log("callback unsuccessful");
            return false;
        }
    }

    var isCallbackPermanentFailureFunction = function() {
    	return true;
    }

    var actionTakenWhenTaskIsNotExecuted = function(returnArgs) {
        var passthroughParams = returnArgs[2];

        var didComplete = self.processRelayReturnValues("accountBalances", -1, passthroughParams);
        
        if (didComplete) {
            self.compareAccountBalances(coinType, passthroughParams);
        }
    };
	
    this._relayManager[coinType].startRelayTaskWithArbitraryRelay(bestRelayIndex, delegateFunction, bestRelayArguments, callbackIndex, isCallbackSuccessfulFunction, isCallbackPermanentFailureFunction, actionTakenWhenTaskIsNotExecuted, ["passthroughParameters"]);
}

JaxxApp.prototype.startTest = function() {
    var self = this;

    baseLog("[JaxxApp] :: starting relay tests");
    
    var relayCheckParams = {numRelaysTested: 0, numRelaysTotal: this._relaysCoinTypesToTest.length};
    
    var coinType = this._relaysCoinTypesToTest[0];

    var passthroughParams = {coinType: coinType, 
                             relayCheckParams: relayCheckParams,
                             allChecksCompletedCallback: function() {
                                 if (typeof(process) !== 'undefined') {
                                     process.exit();
                                 }
                             }
                            };

    var relayTestsCompleted = function(passthroughParams) {
        passthroughParams.relayCheckParams.numRelaysTested++;

        if (passthroughParams.relayCheckParams.numRelaysTested === passthroughParams.relayCheckParams.numRelaysTotal) {
            passthroughParams.relayCheckParams.allChecksCompletedCallback();
        } else {
            var nextCoinType = self._relaysCoinTypesToTest[passthroughParams.relayCheckParams.numRelaysTested];// var nextCoinType = self._relaysCoinTypesToTest[passthroughParams.coinType + 1];

            var newPassthroughParams = {coinType: nextCoinType, relayCheckParams: passthroughParams.relayCheckParams};

            self.runAllTestsForRelay(nextCoinType, relayTestsCompleted, newPassthroughParams);
        }
    }
    
    this.runAllTestsForRelay(coinType, relayTestsCompleted, passthroughParams);
}

JaxxApp.prototype.runAllTestsForRelay = function(coinType, completionCallback, passthroughParams) {
    baseLog("[JaxxApp] :: running test with relay :: " + this._relayManager[coinType]._name);

    var outStr = "<div class='cssBlockchain'>[" + this._relayManager[coinType]._name + "] :: setup\n</div>";
    //            console.log(outStr);

    this.outputToLog(outStr);

    var spacer = "<div><br></div>\n";
    this.outputToLog(spacer);


    var self = this;

    this._relayManager[coinType].setup(function(resultParams, passthroughParams) {
        console.log("RelayTests :: fetchBlockHeights :: " + JSON.stringify(resultParams));

        self.getLastBlockHeights(coinType);

        if (typeof(process) !== 'undefined') {
            self._logFullPath = path.resolve(__dirname, self._filePath);

            baseLog("[JaxxApp] :: file path :: " + self._filePath);
            baseLog("[JaxxApp] :: main path :: " + self._logFullPath);//process.argv[1]);

            self._filePath = (process.argv[1] + "") + self._filePath;

            baseLog("[JaxxApp] :: relative file path :: " + self._filePath);
        }

        //        console.log("next :: " + self.getAddressBalances);
        self.runTestsForListOfFunctions(coinType, self._functionsToTest, completionCallback, passthroughParams);
        /*
        self.getTxLists(coinType, function() {
            self.getTxCount(coinType, function() {
                self.getTxDetails(coinType, function() {
                    self.getAddressBalances(coinType, function() {
                        var outStr = "<div class='cssBlockchain'>[" + self._relayManager[coinType]._name + "] :: complete\n</div>";
                        //            console.log(outStr);

                        self.outputToLog(outStr);

                        var spacer = "<div><br></div>\n";
                        self.outputToLog(spacer);

                        completionCallback(passthroughParams);
                    });
                });
            });
        });
        */
        //        setTimeout(function() {
        //            process.exit();
        //        }, 10 * 1000);
    }, passthroughParams);
}

JaxxApp.prototype.runTestsForListOfFunctions = function(coinType, arrFunctionList, completionCallback, passthroughParams) {
    // Example Parameters
    // coinType = 0 etc.
    // arrFunctionList = ['getTxLists', 'getTxCount', 'getTxDetails', 'getAddressBalances'];
    var self = this;
    if (arrFunctionList.length === 0){
        var outStr = "<div class='cssBlockchain'>[" + self._relayManager[coinType]._name + "] :: complete\n</div>";
        //            console.log(outStr);

        self.outputToLog(outStr);

        var spacer = "<div><br></div>\n";
        self.outputToLog(spacer);

        completionCallback(passthroughParams);        
    } else {
        this._objTimeoutForServerRequests = setTimeout(function(){
            self.respondToServerTimeout(coinType, arrFunctionList);
            clearTimeout(self._objTimeoutForServerRequests);
            self.runTestsForListOfFunctions(coinType, arrFunctionList.slice(1, arrFunctionList.length), completionCallback, passthroughParams);
        }, this._intTimeoutTimeForServerRequests);        
        this[arrFunctionList[0]](coinType, function() {
            clearTimeout(self._objTimeoutForServerRequests);
            self.runTestsForListOfFunctions(coinType, arrFunctionList.slice(1, arrFunctionList.length), completionCallback, passthroughParams);
        });

    }
}

JaxxApp.prototype.respondToServerTimeout = function(coinType, arrFunctionList){
    // Run this when the server request times out.
    var spacer = "<div><br></div>\n";
    var strOutputMessage = "[" + arrFunctionList[0] + "] " + "This relay task did not complete within the given timeframe for all relays. coinType=" + coinType + " and arrFunctionList=" + JSON.stringify(arrFunctionList);
    this.outputToLog(strOutputMessage);
    this.outputToLog(spacer);
    console.log(strOutputMessage);
}

JaxxApp.prototype.outputToLog = function(outputString) {
//    console.log("output");
    baseLog(outputString);
//    console.log(outputString);
    
    var self = this;
    
    if (typeof(fs) !== 'undefined') {
//        baseLog("fs available :: filePath :: " + this._filePath);

        fs.open(this._filePath, 'a', function(err, data) {
            if (err) {
                console.log("ERROR !! " + err);
            } else {
                console.log("create success :: " + data);
                fs.appendFile(self._filePath, outputString + "\n", 0, 'content length', null, function(err) {
                    if (err)
                        console.log("ERROR !! " + err);
                    fs.close(data, function() {
                        console.log('written success');
                    })
                });
            }
        });
    } else {
//        baseLog("output unavailable");
    }
    
    if (typeof($) !== 'undefined') {
//        baseLog("jquery available");
        $('.output').html($('.output').html() + outputString);
    }
}

exports.jaxxApp = JaxxApp;
//g_JaxxApp.startTest();
