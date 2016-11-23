//@note: @todo: @next: wrap the entirety in this, separate out business logic and UI code, this JaxxApp function
//should be placed in its own JS file. functions should be unit-testable.

var g_JaxxApp = new JaxxApp();
g_JaxxApp.initialize();

//@note: @todo: move into JaxxApp object
var refreshHistoryTimer = null;
var historyRefreshTime = 5000;

// Move to tools?
function isDecimal(value) {
    return (value + '').match(/^([0-9]+|[0-9]+\.[0-9]*|[0-9]*\.[0-9]+)$/);
}

function truncate(text, frontCount, backCount, delimiter) {
    if (text === null) { text = 'null'; }

    if (!delimiter) { delimiter = '...'; }
    if (text.length < (frontCount + backCount + delimiter.length)) {
        return text;
    }
    return text.substring(0, frontCount) + delimiter + text.substring(text.length - backCount);
}

const transitionElementNames = ['.tab.send',
                                '.tab.receive',
                                '.mainBalanceBox',
                                '.refresh',
                                '.mainAddressBox',
                                '.qrCode',
                                '.cameraTab',
                                '.balanceBoxSeperator',
                                '.mainTransactionHistoryHeader',
                                '.transactionHistorySeperator',
                                '.noTransactions',
                                '.landscapeQRSeperator',
                                '.landscapeRight'];

const portraitTransitionsIn = [];
const portraitTransitionsOut = [];

const landscapeTransitionsIn = [];
const landscapeTransitionsOut = [];

portraitTransitionsIn['.tab.send'] = 'slideInRight';
portraitTransitionsIn['.tab.receive'] = 'slideInLeft';
portraitTransitionsIn['.mainBalanceBox'] = 'fadeInLeft';
portraitTransitionsIn['.refresh'] = 'fadeIn';
portraitTransitionsIn['.mainAddressBox'] = 'zoomIn';
portraitTransitionsIn['.qrCode'] = 'fadeInRight';
portraitTransitionsIn['.cameraTab'] = 'fadeIn';
portraitTransitionsIn['.balanceBoxSeperator'] = 'fadeIn';
portraitTransitionsIn['.mainTransactionHistoryHeader'] = 'fadeInUp';
portraitTransitionsIn['.transactionHistorySeperator'] = 'fadeInUp';
portraitTransitionsIn['.noTransactions'] = 'fadeInUp';
portraitTransitionsOut['.landscapeQRSeperator'] = 'fadeIn';
portraitTransitionsOut['.landscapeRight'] = 'fadeIn';

portraitTransitionsOut['.tab.send'] = 'slideOutRight';
portraitTransitionsOut['.tab.receive'] = 'slideOutLeft';
portraitTransitionsOut['.mainBalanceBox'] = 'fadeOutLeft';
portraitTransitionsOut['.refresh'] = 'fadeOut';
portraitTransitionsOut['.mainAddressBox'] = 'zoomOut';
portraitTransitionsOut['.qrCode'] = 'fadeOutRight';
portraitTransitionsOut['.cameraTab'] = 'fadeOut';
portraitTransitionsOut['.balanceBoxSeperator'] = 'fadeOut';
portraitTransitionsOut['.mainTransactionHistoryHeader'] = 'fadeOutDown';
portraitTransitionsOut['.transactionHistorySeperator'] = 'fadeOutDown';
portraitTransitionsOut['.noTransactions'] = 'fadeOutDown';
portraitTransitionsOut['.landscapeQRSeperator'] = 'fadeOut';
portraitTransitionsOut['.landscapeRight'] = 'fadeOut';

landscapeTransitionsIn['.tab.send'] = 'fadeInUp';
landscapeTransitionsIn['.tab.receive'] = 'fadeInUp';
landscapeTransitionsIn['.mainBalanceBox'] = 'zoomIn';
landscapeTransitionsIn['.refresh'] = 'zoomIn';
landscapeTransitionsIn['.mainAddressBox'] = 'zoomIn';
landscapeTransitionsIn['.qrCode'] = 'zoomIn';
landscapeTransitionsIn['.cameraTab'] = 'fadeInUp';
landscapeTransitionsIn['.balanceBoxSeperator'] = 'fadeIn';
landscapeTransitionsIn['.mainTransactionHistoryHeader'] = 'fadeInUp';
landscapeTransitionsIn['.transactionHistorySeperator'] = 'fadeInUp';
landscapeTransitionsIn['.noTransactions'] = 'fadeInUp';
landscapeTransitionsIn['.landscapeQRSeperator'] = 'fadeIn';
landscapeTransitionsIn['.landscapeRight'] = 'fadeIn';

landscapeTransitionsOut['.tab.send'] = 'fadeOutDown';
landscapeTransitionsOut['.tab.receive'] = 'fadeOutDown';
landscapeTransitionsOut['.mainBalanceBox'] = 'zoomOut';
landscapeTransitionsOut['.refresh'] = 'zoomOut';
landscapeTransitionsOut['.mainAddressBox'] = 'zoomOut';
landscapeTransitionsOut['.qrCode'] = 'zoomOut';
landscapeTransitionsOut['.cameraTab'] = 'fadeOutDown';
landscapeTransitionsOut['.balanceBoxSeperator'] = 'fadeOut';
landscapeTransitionsOut['.mainTransactionHistoryHeader'] = 'fadeOutDown';
landscapeTransitionsOut['.transactionHistorySeperator'] = 'fadeOutDown';
landscapeTransitionsOut['.noTransactions'] = 'fadeOutDown';
landscapeTransitionsOut['.landscapeQRSeperator'] = 'fadeOut';
landscapeTransitionsOut['.landscapeRight'] = 'fadeOut';


if (PlatformUtils.extensionCheck() || PlatformUtils.desktopCheck()) {
} else if (PlatformUtils.mobileCheck()) {
    $('.wallet').fadeTo(0, 0);
} else {
    //@note: desktop
}

var lastSentTimestampSeconds = 0; //timestamp or last sent tx

var prevBalance = [];
var hasUpdatedBalance = [];

var pageScanAddresses = [];

for (var i = 0; i < COIN_NUMCOINTYPES; i++) {
    prevBalance[i] = 0;
    hasUpdatedBalance[i] = false;
    pageScanAddresses[i] = [];
}

var scanImportWallet = null;

var forceTransactionRefresh = true;
var lastTransactionRefreshTime = new Date().getTime();

var curCoinType = COIN_BITCOIN;

var ethereumSecretProgress = 0;
var ethereumUnlocked = true;//getStoredData('ethereum_unlocked');

const PROFILE_PORTRAIT = 0;
const PROFILE_LANDSCAPE = 1;

var curProfileMode = -1;

var canUpdateWalletUI = true;

var hasBlit = false;

function switchToProfileMode(profileMode) {
    if (profileMode === curProfileMode) {
        return;
    }

    if (curProfileMode == PROFILE_PORTRAIT) {
        $('.landscapeQRCode').fadeTo(0, 1);
        $('.landscapeQRCode').show();
        $('.landscapeQRCode').removeClass('cssNoSizeOverride');
        $('.copied').css('left', '');
    } else if (curProfileMode == PROFILE_LANDSCAPE) {
        $('.landscapeLeft').removeClass('cssTabletLeft');

        $('.cameraTab').css('right', '');
        $('.mainBalanceBox').removeClass('cssFloatNoneOverride');
        $('.landscapeBalanceCenteringA').removeClass('cssCenter');
        $('.landscapeBalanceCenteringB').removeClass('cssTabletBalance');
        $('.portraitCurrency').addClass('cssCurrencyFloat');
        //        $('.populateBalanceFiat').removeClass('cssLandscapePopulateBalanceFiatFix');
        $('.landscapeQRSeperator').removeClass('cssSeparator');
        $('.wrapTableCurrencySelectionMenu').removeClass('cssZeroMarginLeftOverride');

        $('.landscapeRight').removeClass('cssTabletRight');
        $('.portraitQRCode').fadeTo(0, 1);
        $('.portraitQRCode').removeClass('cssPortraitQRCodeLandscapeOverride');
        $('.populateQRCode').removeClass('cssLandscapeQRSizing')
    }

    curProfileMode = profileMode;

    if (profileMode == PROFILE_PORTRAIT) {
        $('.landscapeQRCode').fadeTo(0, 0);
        $('.landscapeQRCode').hide();
        $('.landscapeQRCode').addClass('cssNoSizeOverride');

        //        var leftWindowWidth = g_JaxxApp.getUI().getWindowWidth() / 2;
        //        $('.cameraTab').css('right', leftWindowWidth + 'px');

        $('.copied').css('left', '26%');
    } else if (profileMode == PROFILE_LANDSCAPE) {
        $('.landscapeLeft').addClass('cssTabletLeft');

        var wWidth = g_JaxxApp.getUI().getLargerScreenDimension() / 2;

        //        var leftWindowWidth = $(document).width() / 2;
        //        console.log("using width :: " + wWidth);
        var leftWindowWidth = wWidth;
        $('.cameraTab').css('right', leftWindowWidth + 'px');
        $('.mainBalanceBox').addClass('cssFloatNoneOverride');
        //        $('.copied').css('left', '25%');
        $('.landscapeBalanceCenteringA').addClass('cssCenter');
        $('.landscapeBalanceCenteringB').addClass('cssTabletBalance');
        $('.portraitCurrency').removeClass('cssCurrencyFloat');
        $('.populateBalanceFiat').addClass('cssLandscapePopulateBalanceFiatFix');
        $('.landscapeQRSeperator').addClass('cssSeparator');

        $('.wrapTableCurrencySelectionMenu').addClass('cssZeroMarginLeftOverride');

        $('.landscapeRight').addClass('cssTabletRight');
        $('.portraitQRCode').fadeTo(0, 0);
        $('.portraitQRCode').addClass('cssPortraitQRCodeLandscapeOverride');
        $('.populateQRCode').addClass('cssLandscapeQRSizing')
    }
}

function setDefaultProfileMode(profileMode) {
    if (profileMode == PROFILE_LANDSCAPE) {
        var transitionBasePortraitIn = portraitTransitionsIn;
        var transitionBaseLandscapeIn = landscapeTransitionsIn;

        for (var eID in transitionElementNames) {
            var curElement = transitionElementNames[eID];

            $(curElement).removeClass(transitionBasePortraitIn[curElement]);
            $(curElement).addClass(transitionBaseLandscapeIn[curElement]);
        }
    }
}

//@note: @here: @todo: @token: this needs to be refactored soon.
function getAddressCoinTypes(coinAddress) {
    var validAddressTypes = [];

    for (var i = 0; i < COIN_NUMCOINTYPES; i++) {
        validAddressTypes[i] = false;
    }

    //@note: Bitcoin address
    try {
        var bitcoinAddress = thirdparty.bitcoin.address.fromBase58Check(coinAddress);

        if (bitcoinAddress) {
            //@note: check for testnet/nontestnet prefix validity
            //@note:@here:@todo:
            //            if (HDWallet.TESTNET) {
            //                if (bitcoinAddress.version == 0x6f) {
            //                    validAddressType[COIN_BITCOIN] = true;
            //                }
            //            } else {
            //@note: Bitcoin pubkey hash = 0, starts with a 1
            //@note: Bitcoin script hash = 5, starts with a 3
            if (bitcoinAddress.version == 0x00) {
                validAddressTypes[COIN_BITCOIN] = true;
            } else if (bitcoinAddress.version == 0x05) {
                validAddressTypes[COIN_BITCOIN] = true;
            } else if (bitcoinAddress.version == 0x4C) {
                //@note: 76, dash mainnet
                validAddressTypes[COIN_DASH] = true;
            } else if (bitcoinAddress.version == 0x8C) {
                //@note: 140, dash testnet
                validAddressTypes[COIN_DASH] = true;
            } else if (bitcoinAddress.version == 0x30) {
                //@note: 48, litecoin mainnet
                validAddressTypes[COIN_LITECOIN] = true;
            } else if (bitcoinAddress.version == 0x1cb8) {
                //@note: 7352, zcash mainnet
                validAddressTypes[COIN_ZCASH] = true;
            } else if (bitcoinAddress.version == 0x1d25) {
                //@note: 7461, zcash testnet
                validAddressTypes[COIN_ZCASH] = true;
            }
            
//            console.log("bitcoinAddress.version :: " + bitcoinAddress.version);
            //            }
        } else {
            //            validAddressType[COIN_BITCOIN] = false;
        }
    } catch (error) {
        //        validAddressType[COIN_BITCOIN] = false;
    }

    //@note: Ethereum address

    try {
        if (HDWalletHelper.parseEthereumAddress(coinAddress)) {
            validAddressTypes[COIN_ETHEREUM] = true;
            validAddressTypes[COIN_ETHEREUM_CLASSIC] = true;
            validAddressTypes[COIN_TESTNET_ROOTSTOCK] = true;
        } else {
            //        validAddressType[COIN_ETHEREUM] = false;
        }
    } catch(error) {
        //        validAddressType[COIN_ETHEREUM] = false;
    }

    var isValidAddressType = -1;
    var numValidAddressTypes = 0;

    for (var i = 0; i < COIN_NUMCOINTYPES; i++) {
        if (validAddressTypes[i] === true) {
            numValidAddressTypes++;
            
            isValidAddressType = i;
        }
    }

//    if (numValidAddressTypes > 0) {
//        console.log("!! error :: getAddressCoinType :: " + address + " is valid for multiple coin types !!");
//    }

    return validAddressTypes;
}

/**
 *  Wallet loading and updating
 *
 */

var wallet = null;

var openUrl = null;
function checkOpenUrl(url) {
    console.log("< wallet :: " + wallet + " :: url :: " + url + " >");
    if (wallet) {
        var result = HDWalletHelper.parseURI(url);

        var output = '';
        for (var property in result) {
            output += property + ': ' + result[property]+'; ';
        }

        //        console.log("< parsed :: " + output + " >")
        Navigation.showTab('send');
        $('.tabContent .address input').val(result.address).trigger('keyup');
        if (result.amount) {
            $('.tabContent .amount input').val(result.amount).trigger('keyup');
        }
    } else {
        openUrl = url;
    }
}

function updateSpendable() {
    var coinBalance = 0;

    var minimumSpendable = 0;

    //@note: @here: @todo: something like "wallet.getSpendableWithShapeShiftLimitsIfApplicable(curCoinType). or something.
    if (g_JaxxApp.getShapeShiftHelper().getIsTriggered()) {
        var marketMinimum = g_JaxxApp.getShapeShiftHelper().getMarketMinimumForCoinTypeSend(curCoinType);

        if (typeof(marketMinimum) !== 'undefined' && marketMinimum !== null) {
            minimumSpendable = parseInt(HDWalletHelper.convertCoinToUnitType(curCoinType, marketMinimum, COIN_UNITSMALL));

            if (curCoinType === COIN_THEDAO_ETHEREUM) {
                minimumSpendable /= 100;
            }
        }
    }

    if (minimumSpendable > 0) {
        coinBalance = wallet.getPouchFold(curCoinType).getSpendableBalance(minimumSpendable);
    } else {
        coinBalance = wallet.getPouchFold(curCoinType).getSpendableBalance();
    }

    //    console.log("update spendable :: minimumSpendable :: " + minimumSpendable + " :: coinBalance :: " + coinBalance);

    if (Navigation.isUseFiat()) {
        if (HDWalletHelper.convertCoinToUnitType(curCoinType, coinBalance, COIN_UNITLARGE) != 0) {
            var fiatAmount = wallet.getHelper().convertCoinToFiatWithFiatType(curCoinType, coinBalance, COIN_UNITSMALL, null, true);
            
            var spendableFiatScaled = HDWalletHelper.getCoinDisplayScalar(curCoinType, fiatAmount, true);
            //            console.log("spendableFiatScaled :: " + spendableFiatScaled);

            $('.populateSpendable').text(wallet.getHelper().getFiatUnitPrefix() + parseFloat(spendableFiatScaled).toFixed(2));
        } else {
            $('.populateSpendable').text(wallet.getHelper().getFiatUnitPrefix() + '0.00');
        }
    } else {
        if (HDWalletHelper.convertCoinToUnitType(curCoinType, coinBalance, COIN_UNITLARGE) != 0) {
            var spendableCoinScaled = HDWalletHelper.getCoinDisplayScalar(curCoinType, HDWalletHelper.convertCoinToUnitType(curCoinType, coinBalance, COIN_UNITLARGE));
            spendableCoinScaled = parseFloat(parseFloat(spendableCoinScaled).toFixed(8));

            //            console.log("spendableCoinScaled :: " + spendableCoinScaled);
            var coinAbbreviatedName = HDWalletPouch.getStaticCoinPouchImplementation(curCoinType).pouchParameters['coinAbbreviatedName'];
            
            $('.populateSpendable').html(spendableCoinScaled + ' ' +  coinAbbreviatedName);
        } else {
            $('.populateSpendable').text('0');
        }
    }

    if ($('.tab.send').hasClass('selected')) {
        if (wallet.getPouchFold(curCoinType).isTokenType() === true) {
            var gasRequiredList = wallet.getPouchFold(curCoinType).hasInsufficientGasForSpendable();

            //            console.log("gasRequiredList :: " + gasRequiredList);

            if (gasRequiredList.length > 0) {
                var coinAbbreviatedName = HDWalletPouch.getStaticCoinPouchImplementation(curCoinType).pouchParameters['coinAbbreviatedName'];
                
                $('.ethereumTokenInsufficientGasForSpendableWarningText').slideDown();

                //            gasRequiredList.push("0x051Da87c3679Be285DC22E2fbA5E833052375ced");
                //            gasRequiredList.push("0x051Da87c3679Be285DC22E2fbA5E833052375ced");
                //            gasRequiredList.push("0x051Da87c3679Be285DC22E2fbA5E833052375ced");

                $('.ethereumTokenInsufficientGasForSpendableWarningText').html("<p> Some of your " + coinAbbreviatedName + "-holding accounts requires more ETH to be able to transfer:<br>" + gasRequiredList.join('<br>') + "</p>");
            } else {
                $('.ethereumTokenInsufficientGasForSpendableWarningText').slideUp();
            }
        }
    } else {
        $('.ethereumTokenInsufficientGasForSpendableWarningText').slideUp();
    }
}



function populateSpendMax(max) {
    if (curCoinType === COIN_BITCOIN) {

    } else if (curCoinType === COIN_ETHEREUM) {
        var floatMax = parseFloat(max);
        //        console.log("" +floatMax.toString().split('.')[1]);
        try {
            if (floatMax.toString().split('.')[1].length > 14) {
                max = parseFloat(floatMax.toString().split('.')[0] + "." + floatMax.toString().split('.')[1].substring(0, 14)); 
            }
        } catch(err) {

        }
    } else if (curCoinType === COIN_THEDAO_ETHEREUM) {
        var floatMax = parseFloat(max);
        //        console.log("" +floatMax.toString().split('.')[1]);
        try {
            if (floatMax.toString().split('.')[1].length > 14) {
                max = parseFloat(floatMax.toString().split('.')[0] + "." + floatMax.toString().split('.')[1].substring(0, 14)); 
            }
        } catch(err) {
        }
    } else if (curCoinType === COIN_DASH) {
        
    }

    $('#amountSendInput').val(max);
}

function switchToCoinType(targetCoinType, firstUnlock, callback) {
    if (targetCoinType >= 0 && targetCoinType < COIN_NUMCOINTYPES) {
        g_JaxxApp.getUI().resetShapeShift();
        g_JaxxApp.getUI().resetTXHistory(curCoinType);
        g_JaxxApp.getUI().beginSwitchToCoinType(curCoinType, targetCoinType);

        wallet.switchToCoinType(targetCoinType);

        if (curCoinType != targetCoinType) {
            
            for (var i = 0; i < COIN_NUMCOINTYPES; i++) {
                if (i !== targetCoinType) {
                    //                    $(coinHelpMenuNames[i]).hide();
                    //                    $(coinMenuHeaderNames[i]).hide();
                } else {
                    //                    $(coinHelpMenuNames[i]).show();
                    //                    $(coinMenuHeaderNames[i]).show();
                }
            }
            g_JaxxApp.getUI().switchToSolidCoinButton(targetCoinType);

            for (var i = 0; i < COIN_NUMCOINTYPES; i++) {
                if (i !== targetCoinType) {
                    g_JaxxApp.getUI().resetCoinButton(i);
                }
            }

            Navigation.showSpinner(targetCoinType, firstUnlock);

            canUpdateWalletUI = false;

            if (firstUnlock === true) {
                setTimeout(function() {
                    Navigation.hideSpinner(targetCoinType);
                }, 1000);
            }

            Navigation.hideUI(curProfileMode, curProfileMode, function () {
                completeSwitchToCoin(tCoinType, callback);
            }, firstUnlock);

            var tCoinType = targetCoinType;

            curCoinType = targetCoinType;
            g_JaxxApp.getUI().populateCurrencyList(targetCoinType);
        } else {
            callback();
        }
    } else {
        console.log("!! error :: coin type :: " + targetCoinType + " is invalid !!");
        callback();
    }
}

function completeSwitchToCoin(targetCoinType, callback) {
    Navigation.setUseFiat(Navigation.isUseFiat());

    Navigation.setupCoinUI(targetCoinType);

    wallet.completeSwitchToCoinType(targetCoinType);

    g_JaxxApp.getUI().completeSwitchToCoinType(curCoinType, targetCoinType);

    canUpdateWalletUI = true;
    forceUpdateWalletUI();

    Navigation.hideSpinner(targetCoinType);

    //@note: eventually have all the ui stuff go through here.
    g_JaxxApp.getUI().setupShapeShiftCoinUI(targetCoinType);

    Navigation.showUI(curProfileMode, curProfileMode, function() {
        callback();
        showPageScanAddresses(targetCoinType);
    });
}

//function updateExchangeRate(coinType) {
//    //    console.log("updateExchangeRate :: " + coinType);
//    if (coinType === curCoinType) {
//        //        console.log("updateExchangeRate");
//        updateWalletUI();
//    }
//}

function forceUpdateWalletUI(coinType) {
    forceTransactionRefresh = true;
    updateWalletUI(coinType);
}

function updateWalletUI(coinType) {

    //@note: for landscape/portrait rotation
    if (!wallet) {
        return;
    }

    if (!canUpdateWalletUI) {
        return;
    }

    if (coinType == null || typeof(coinType) === "undefined") {
        coinType = COIN_BITCOIN;
    }

    // Update the address
    var address = 0;
    var qrCode = 0;

    var prefixForAddress = "Current ";

    address = wallet.getPouchFold(curCoinType).getCurrentReceiveAddress();
    qrCode = wallet.getPouchFold(curCoinType).generateQRCode();

    var coinFullDisplayName = HDWalletPouch.getStaticCoinPouchImplementation(curCoinType).uiComponents['coinFullDisplayName'];

    $('.populateAddressType').text("Your " + prefixForAddress + coinFullDisplayName + " Address");
    $('.populateAddress').text(address);
    $('.populateAddressCopy').attr('copy', address);
    $('.populateAddressCopyLarge').attr('copyLarge', address);

    $('.populateMnemonic').text(wallet.getMnemonic());

    // Update the QR code
    $('.populateQRCode').attr("src", qrCode);
    
    var isTestnet = HDWalletPouch.getStaticCoinPouchImplementation(curCoinType).pouchParameters['isTestnet'];
    
    if (isTestnet === true) {
        $('.populateAddressType').parent('.mainAddressBox').addClass('cssTestnet');
    } else {
        $('.populateAddressType').parent('.mainAddressBox').removeClass('cssTestnet');
    }

    //@note: In the case of bitcoin:// uri, needs to update exchange rate.
    //    console.log("< checking for update to exchange rates >");

    //@note: @here: only checking BTC exchange rate as that will be populated first and the others
    //derive from this.
    if (wallet.getHelper().hasFiatExchangeRates(COIN_BITCOIN, 'USD')) {
        //        console.log("< updates to exchange rates >");

        if (Navigation.getTab() == 'send') {
            //            console.log("< is send tab >");
            if (!$('.tabContent .amount input').is(":focus")) {
                //                console.log("< input tab not focused >");
                $('.tabContent .amount input').trigger('keyup');
            }
        }
    } else {
        //        console.log("< no fiat exchange rates found >");
    }

    var balance = [];

    for (var i = 0; i < COIN_NUMCOINTYPES; i++) {
        balance[i] = wallet.getPouchFold(i).getPouchFoldBalance();
    }

    if (!hasUpdatedBalance[coinType]) {
        //                console.log("updating for :: " + coinFullDisplayName + " :: " + balance[coinType]);
        hasUpdatedBalance[coinType] = true;
    } else {
        //                console.log("balance for :: " + coinFullDisplayName + " :: " + balance[coinType]);
        if (balance[coinType] > prevBalance[coinType]) {
            //            console.log("beep for :: " + coinFullDisplayName);
            playSound("snd/balance.wav", null, null);
        }
    }

    prevBalance[coinType] = balance[coinType];

    var coinBalance = HDWalletHelper.convertCoinToUnitType(curCoinType, balance[curCoinType], COIN_UNITLARGE);

    var coinAbbreviatedName = HDWalletPouch.getStaticCoinPouchImplementation(curCoinType).pouchParameters['coinAbbreviatedName'];

    $('.populateBalanceCoinUnit').text(coinAbbreviatedName);

    $('.populateBalanceCoinAmount').empty();

    g_JaxxApp.getUI().updateCoinDisplayBalanceInWallet(curCoinType, coinBalance);

    var fiatAmount = wallet.getHelper().convertCoinToFiatWithFiatType(curCoinType, balance[curCoinType], COIN_UNITSMALL, null, false);

    $('.populateBalanceFiat').text(fiatAmount); // We specify 'false' so that the correct prefix is used for the currency.

    $('.populateCurrencyName').text(wallet.getHelper().getFiatUnit());

    updateSpendable();

    // Update currency settings
    currency = wallet.getHelper().getFiatUnit();
    // Currently an issue... If the user is browsing currencies and an update comes in, we jump on them.
    //var selectedTop = 0;
    $('.settings.setCurrency .currency').each(function (i, e) {
        e = $(e);
        if (e.attr('value') === currency) {
            //            e.addClass('selected').addClass('cssSelected');
            //selectedTop = e.position().top;
        } else {
            e.removeClass('selected').removeClass('cssSelected');
        }
    });
    
    //@note: for thedao tokens, because they're scaled at 100:1, and the same conversion functions work on these,
    //we pre-scale the amount. this may be incorrect.
    
    var conversionCoinAmount = 1;
    
    if (curCoinType === COIN_THEDAO_ETHEREUM) {
        conversionCoinAmount /= 100;
    }

    var conversionAmount = wallet.getHelper().convertCoinToFiatWithFiatType(curCoinType, conversionCoinAmount, COIN_UNITLARGE, null, false);

    $('.settings.setCurrency .exchangeRateAbbreviatedUnit').text(coinAbbreviatedName);
    $('.mainMenuCurrencies .exchangeRateAbbreviatedUnit').text(coinAbbreviatedName);
    $('.mainMenuCurrencies .exchangeRate').text(conversionAmount);

    //$('.settings.setCurrency .cssList').scrollTop(selectedTop);

    var shouldRefreshTransaction = false;
    //    var curTime = new Date().getTime();

    //    if (!forceTransactionRefresh && curTime - lastTransactionRefreshTime > historyRefreshTime) {
    //        lastTransactionRefreshTime = curTime;
    //        shouldRefreshTransaction = true;
    //    } else if (!forceTransactionRefresh) {
    if (!g_JaxxApp.getUI().isTransactionListEqualToHistory(curCoinType, wallet.getPouchFold(curCoinType).getHistory())) {
        shouldRefreshTransaction = true;
    }
    //        if (refreshHistoryTimer === null) {
    //            refreshHistoryTimer = setTimeout(function() {
    ////                console.log("do refresh tx history");
    //                updateWalletUI();
    //            }, historyRefreshTime - (curTime - lastTransactionRefreshTime) + 100);
    //
    //            lastTransactionRefreshTime = curTime;
    //        }
    //    }

    //    console.log("shouldRefreshTransaction :: " + shouldRefreshTransaction + " :: forceTransactionRefresh :: " + forceTransactionRefresh + " :: timer :: " + (curTime - lastTransactionRefreshTime));

    if (forceTransactionRefresh || shouldRefreshTransaction) {
        //        console.log("refreshing tx history :: timer :: " + (curTime - lastTransactionRefreshTime));

        refreshHistoryTimer = null;

        forceTransactionRefresh = false;
        //        lastTransactionRefreshTime = curTime;

        g_JaxxApp.getUI().updateTransactionList(curCoinType, wallet.getPouchFold(curCoinType).getHistory());
    }

    // Here we update the exchange rates in the table.

    g_JaxxApp.getUI().updateCoinToFiatExchangeRates();
}

function ethereumAddressInputCheck() {
    var addressInput = $('.tabContent .address input');
    var addressValue = addressInput.val();

    if (addressInput.data('address')) {
        addressValue = addressInput.data('address');
    }

    var isValidEthereumLikeAddress = false;
    
    var validAddressTypes = getAddressCoinTypes(addressValue);
    
    if (validAddressTypes[COIN_ETHEREUM] === true ||
        validAddressTypes[COIN_ETHEREUM_CLASSIC] === true ||
        validAddressTypes[COIN_TESTNET_ROOTSTOCK] === true) {
        isValidEthereumLikeAddress = true;
    }
    
    if (addressValue !== "" && isValidEthereumLikeAddress === true) {
        if (addressValue.match(/[A-Z]/)) {
            if (HDWalletHelper.isEthereumChecksumAddress(addressValue)) {
                //                console.log("is valid checksum address");
                $('.ethereumChecksumAddressWarningText').slideUp();
            } else {
                $('.ethereumChecksumAddressWarningText').slideDown();
                return false;
            }
        } else {
            $('.ethereumChecksumAddressWarningText').slideUp();
        }
        if (curCoinType === COIN_ETHEREUM || curCoinType === COIN_ETHEREUM_CLASSIC || curCoinType === COIN_TESTNET_ROOTSTOCK) {
            wallet.getPouchFold(curCoinType).getPouchFoldImplementation().checkIsSmartContractQuery(addressValue, function(err, res) {
                if (err) {
                    console.log("updateFromInputFieldEntry :: error :: " + err);
                } else {
                    //                    console.log("checkIsSmartContractQuery :: " + res + " :: ethereumAdvancedModeHidden :: " + Navigation.ethereumAdvancedModeHidden());
                    if (res === true) {
                        //@note: 100000 recommended from Fabien.
                        var customGasLimit = 100000;
                        wallet.getHelper().setRecommendedEthereumCustomGasLimit(customGasLimit);

                        //                                                console.log("Navigation.ethereumAdvancedModeHidden() :: " + Navigation.ethereumAdvancedModeHidden());
                        if (Navigation.ethereumAdvancedModeHidden()) {
                            //                                                        console.log("existing customGasLimit :: " + wallet.getHelper().getCustomEthereumGasLimit());

                            Navigation.showEthereumAdvancedMode();

                            $('.advancedTabContentEthereum .customGasLimit input').val(customGasLimit);
                            wallet.getHelper().setCustomEthereumGasLimit(customGasLimit);
                        } else {

                            //@note: if the custom gas limit is the same as the default gas limit, up it.
                            if (wallet.getHelper().getCustomEthereumGasLimit().toNumber() === HDWalletHelper.getDefaultEthereumGasLimit().toNumber()) {
                                $('.advancedTabContentEthereum .customGasLimit input').val(customGasLimit);
                                wallet.getHelper().setCustomEthereumGasLimit(customGasLimit);
                            }
                        }

                        Navigation.setEthereumAdvancedModeCustomGasLimitSuggestion(customGasLimit, "Contract");

                        //                        console.log("is smart contract");
                    } else {
                        wallet.getHelper().setRecommendedEthereumCustomGasLimit(HDWalletHelper.getDefaultEthereumGasLimit());

                        $('.advancedTabContentEthereum .customGasLimit input').val(HDWalletHelper.getDefaultEthereumGasLimit());

                        if (Navigation.ethereumAdvancedModeHidden()) {
                            //                            $('.advancedTabContentEthereum .customGasLimit input').val(customGasLimit);
                            //                            wallet.getHelper().setCustomEthereumGasLimit(customGasLimit);
                        } else {
                            Navigation.hideEthereumAdvancedMode();
                        }

                        Navigation.setEthereumAdvancedModeCustomGasLimitSuggestion(HDWalletHelper.getDefaultEthereumGasLimit(), "Account");
                        wallet.getHelper().setCustomEthereumGasLimit(HDWalletHelper.getDefaultEthereumGasLimit());

                        //                        console.log("is regular address");
                    }

                    wallet.getPouchFold(COIN_ETHEREUM).clearSpendableBalanceCache();

                    updateSpendable();
                    updateFromInputFieldEntry();
                }
            });
        }
    } else {
        Navigation.setEthereumAdvancedModeCustomGasLimitSuggestion(0, null);
        $('.ethereumChecksumAddressWarningText').slideUp();
    }

    return true;
}

function updateFromInputFieldEntry() {
    //@note: to guard against reentrancy in cases where the ui is cleared and closed.
    if (Navigation.ignoreUpdateFromInputFieldEntry === true) {
        return;
    }

    var addressInput = $('.tabContent .address input');
    var addressValue = addressInput.val();

    var amountValueString = $('.tabContent .amount input').val();

    if (addressInput.data('address')) {
        addressValue = addressInput.data('address');
    }

    //@note: no idea why this doesn't source the right amount. 11 seems to be the right number.
    var fontSize = 11;//parseInt($('.cssAmount').css('font-size'));

    var textAreaMaxChars = Math.floor($('.tabContent .amount input').width() / fontSize);

    //    console.log("amountValueString :: " + amountValueString + " :: str length :: " + amountValueString.length);

    var precisionCropLength = textAreaMaxChars - 5;

    if (precisionCropLength > 20) {
        precisionCropLength = 20;
    }

    if (amountValueString.length > precisionCropLength) {
        //        console.log("truncating entry");
        amountValueString = amountValueString.substr(0, precisionCropLength);
        $('.tabContent .amount input').val(amountValueString);
    }

    var amountLength = amountValueString.length;

    var amountValue = amountValueString;

    var validDecimal = isDecimal(amountValue);


    if (curCoinType === COIN_THEDAO_ETHEREUM) {
        var newVal = thirdparty.web3.toBigNumber(amountValue);// parseInt(amountValue);
        amountValue = newVal.dividedBy(100.0).toNumber();
    }

    var coinAmountLargeAndScaled = amountValue;

    // Update the converted amount details
    var converted = '';
    if (validDecimal) {
        //        console.log("< valid decimal amount :: " + amountValue + " >");
        if (Navigation.isUseFiat()) {
            coinAmountLargeAndScaled = wallet.getPouchFold(curCoinType).convertFiatToCoin(amountValue, COIN_UNITLARGE);

            if (curCoinType === COIN_THEDAO_ETHEREUM) {
                coinAmountLargeAndScaled *= 100;
            }

            var coinSymbol = HDWalletPouch.getStaticCoinPouchImplementation(curCoinType).uiComponents['coinSymbol'];

            converted = "(" + coinSymbol + coinAmountLargeAndScaled + ")";
        } else {            
            var fiatAmount = wallet.getHelper().convertCoinToFiatWithFiatType(curCoinType, amountValue, COIN_UNITLARGE, null, null);
            
            converted = "(" + fiatAmount + ")";
        }
    }

    var lengthOfConvertedText = converted.length;

    var lengthAvailableForConvertedText = (lengthOfConvertedText > textAreaMaxChars - amountLength) ? textAreaMaxChars - amountLength : lengthOfConvertedText;

//    console.log("textAreaMaxChars :: " + textAreaMaxChars + " :: amountLength :: " + amountLength + " :: lengthOfConvertedText :: " + lengthOfConvertedText + " :: lengthAvailableForConvertedText :: " + lengthAvailableForConvertedText);

    if (lengthAvailableForConvertedText + 4 < lengthOfConvertedText) {
        converted = converted.substr(0, lengthAvailableForConvertedText) + "...)";
    }

    $('.tabContent .amountDetails').text(converted);

    // Check the amount is valid
    var data = null;

    if (validDecimal) {
        var validAddressTypes = [];
        for (var i = 0; i < COIN_NUMCOINTYPES; i++) {
            validAddressTypes[i] = false;
        }
        
        if (addressValue !== "") {
            validAddressTypes = getAddressCoinTypes(addressValue);
        }

        if (g_JaxxApp.getShapeShiftHelper().getIsTriggered()) {
            validAddressTypes[curCoinType] = true;
        }

        var tab = Navigation.getTab();

        var coinAmountSmallType = 0;
        if (Navigation.isUseFiat()) {
            //            console.log("fiat");
            coinAmountSmallType = wallet.getPouchFold(curCoinType).convertFiatToCoin(amountValue, COIN_UNITSMALL);

        } else {
            //            console.log("not fiat");
            coinAmountSmallType = HDWalletHelper.convertCoinToUnitType(curCoinType, amountValue, COIN_UNITSMALL);
        }

        var minimumToSpend = 0;
        var numShiftsRequired = 1;

        if (g_JaxxApp.getShapeShiftHelper().getIsTriggered()) {
            //get latest market object
            var curMarketData = g_JaxxApp.getShapeShiftHelper().getMarketForCoinTypeSend(curCoinType);

            minimumToSpend = curMarketData.depositMin;

            if (minimumToSpend) {
                if (curCoinType === COIN_THEDAO_ETHEREUM) {
                    minimumToSpend /= 100;
                }

                //            console.log("minimumToSpend (large units) :: " + minimumToSpend);

                minimumToSpend = parseInt(HDWalletHelper.convertCoinToUnitType(curCoinType, minimumToSpend, COIN_UNITSMALL));

                var numShiftsRequired = wallet.getPouchFold(curCoinType).getShiftsNecessary(minimumToSpend);

                if (g_JaxxApp.getShapeShiftHelper().isMultiShiftValid(curCoinType, numShiftsRequired)) {
//                    console.log("updateFromInputFieldEntry :: multiShift is valid");

                    var shiftResults = g_JaxxApp.getShapeShiftHelper().getMultiShiftResults(curCoinType, numShiftsRequired);

                    if (shiftResults !== null) {

                    } else {
                        return;
                    }
                } else {
                    console.log("updateFromInputFieldEntry :: multiShift is invalid.. requesting");
                    
                    g_JaxxApp.getShapeShiftHelper().requestMultiShift(curCoinType, numShiftsRequired, function(shiftParams) {
                        console.log("updateFromInputFieldEntry :: finished multishift :: shiftParams :: " + JSON.stringify(shiftParams, null, 4));

                        var coinTypeDict = g_JaxxApp.getShapeShiftHelper().getPairCoinTypeDict(shiftParams.shiftMarketData.pair);

                        if (coinTypeDict.send === curCoinType) {
                            g_JaxxApp.getUI().populateShapeShiftReceiveData(g_JaxxApp.getShapeShiftHelper()._marketData[coinTypeDict.send][coinTypeDict.receive]);
                        }
                    });
                    
                    $('.tabContent .amount .button').removeClass('cssEnabled').removeClass('enabled');
                    
                    return;
                }
//                g_JaxxApp.getShapeShiftHelper().setupMultiShift(curCoinType, numShiftsRequired);
            } else {
                console.log("minimumToSpend unavailable :: curMarketData :: " + JSON.stringify(curMarketData, null, 4));
                
                $('.tabContent .amount .button').removeClass('cssEnabled').removeClass('enabled');
                
                return;
            }
        }


        var withinLimits = true;

        if (coinAmountSmallType > wallet.getPouchFold(curCoinType).getSpendableBalance(minimumToSpend)) {
            withinLimits = false;
        }

        if (coinAmountSmallType <= 0) {
            withinLimits = false;
        }

        if (curCoinType === COIN_BITCOIN) {
            //            console.log("bitcoin :: trying to spend :: " + coinAmountSmallType + " :: total spendable balance :: " + wallet.getPouchFold(curCoinType).getSpendableBalance());
        } else if (curCoinType === COIN_ETHEREUM) {
            //            console.log("ethereum :: trying to spend :: " + coinAmountSmallType + " :: total spendable balance :: " + wallet.getPouchFold(curCoinType).getSpendableBalance(minimumToSpend));

            //@note: for a zero wei transfer, this is valid for a contract address w/ data.

            if (            wallet.getPouchFold(curCoinType).getPouchFoldImplementation().hasCachedAddressAsContract(HDWalletHelper.parseEthereumAddress(addressValue))) {
                if (coinAmountSmallType >= 0) {
                    if (coinAmountSmallType > wallet.getPouchFold(curCoinType).getSpendableBalance(minimumToSpend)) {
                        withinLimits = false;
                    } else {
                        withinLimits = true;
                    }
                }
            }
        } else if (curCoinType === COIN_ETHEREUM_CLASSIC) {
            //            console.log("ethereum :: trying to spend :: " + coinAmountSmallType + " :: total spendable balance :: " + wallet.getPouchFold(curCoinType).getSpendableBalance(minimumToSpend));

            //@note: for a zero wei transfer, this is valid for a contract address w/ data.

            if (            wallet.getPouchFold(curCoinType).getPouchFoldImplementation().hasCachedAddressAsContract(HDWalletHelper.parseEthereumAddress(addressValue))) {
                if (coinAmountSmallType >= 0) {
                    if (coinAmountSmallType > wallet.getPouchFold(curCoinType).getSpendableBalance(minimumToSpend)) {
                        withinLimits = false;
                    } else {
                        withinLimits = true;
                    }
                }
            }
        } else if (curCoinType === COIN_TESTNET_ROOTSTOCK) {
            //            console.log("roostock :: trying to spend :: " + coinAmountSmallType + " :: total spendable balance :: " + wallet.getPouchFold(curCoinType).getSpendableBalance(minimumToSpend));

            //@note: for a zero wei transfer, this is valid for a contract address w/ data.

            if (            wallet.getPouchFold(curCoinType).getPouchFoldImplementation().hasCachedAddressAsContract(HDWalletHelper.parseEthereumAddress(addressValue))) {
                if (coinAmountSmallType >= 0) {
                    if (coinAmountSmallType > wallet.getPouchFold(curCoinType).getSpendableBalance(minimumToSpend)) {
                        withinLimits = false;
                    } else {
                        withinLimits = true;
                    }
                }
            }
        } else if (curCoinType === COIN_THEDAO_ETHEREUM) {
            //            console.log("TheDAO Ethereum :: trying to spend :: " + coinAmountSmallType + " :: total spendable balance :: " + wallet.getPouchFold(curCoinType).getSpendableBalance(minimumToSpend));
        } else if (curCoinType === COIN_DASH) {
            console.log("dash :: trying to spend :: " + coinAmountSmallType + " :: total spendable balance :: " + wallet.getPouchFold(curCoinType).getSpendableBalance());
        }

        var hasValidAddress = false;

        if (validAddressTypes[curCoinType] === true) {
            hasValidAddress = true;
        } else {
            if (wallet.getPouchFold(curCoinType).isTokenType()) {
                var coinHolderType = CoinToken.getMainTypeToTokenCoinHolderTypeMap(curCoinType);

                if (validAddressTypes[coinHolderType] === true) {
                    hasValidAddress = true;
                }
            }
        }
        //        console.log("curCoinType :: " + coinAbbreviatedName[curCoinType] + " :: fiat :: " + Navigation.isUseFiat() + " :: amountValue :: " + amountValue + " :: coinAmountSmallType :: " + coinAmountSmallType + " :: withinLimits :: " + withinLimits + " :: hasValidAddress :: " + hasValidAddress);

        //@note: for sending, make sure the address matches a coin type, and there's some value set on the html input field.
        if (tab === 'send' && hasValidAddress === true && withinLimits === true) {

            //Detect if shapeshift, make additional checks and change addressValue
            var depositAddresses = [];

            if (g_JaxxApp.getShapeShiftHelper().getIsTriggered()) {
                //get latest market object
                var curMarketData = g_JaxxApp.getShapeShiftHelper().getMarketForCoinTypeSend(curCoinType);

                console.log("[packaging shapeShift transaction] :: numShiftsRequired :: " + numShiftsRequired + " :: curMarketData :: " + JSON.stringify(curMarketData));

                var foundIssue = false;

                for (var i = 0; i < numShiftsRequired; i++) {
                    if (curMarketData.multiShift !== null && typeof(curMarketData.multiShift[i]) !== 'undefined' && curMarketData.multiShift[i] !== null && curMarketData.multiShift[i].depositAddress !== null) {
                        console.log("shapeShift :: multiShifting :: " + i + " :: with deposit :: " + curMarketData.multiShift[i].depositAddress);
                        depositAddresses[i] = curMarketData.multiShift[i].depositAddress;

                    } else {
                        console.log("shapeShift :: issue with deposit :: " + i + " :: curMarketData :: " + JSON.stringify(curMarketData, null, 4));
                        foundIssue = true;
                    }
                }

                //@note: @here: @next:

                //check if updated
                if (foundIssue === false) {
                    if (numShiftsRequired === 1) {
                        addressValue = curMarketData.multiShift[0].depositAddress;
                        //Check if within shapeshift limits

                        //@note:@todo:@here: this withinSSLimits variable isn't actually used anywhere.

                        if (!Navigation.isUseFiat() && curCoinType === COIN_THEDAO_ETHEREUM) {
                            coinAmountLargeAndScaled *= 100;
                        }


                        console.log("shifting to :: " + addressValue + " :: coinAmountLargeAndScaled :: " + coinAmountLargeAndScaled + " :: depositMin :: " + curMarketData.depositMin + " :: depositMax :: " + curMarketData.depositMax);

                        var withinSSLimits = true;
                        if (coinAmountLargeAndScaled > curMarketData.depositMax || coinAmountLargeAndScaled < curMarketData.depositMin) {
                            withinSSLimits = false;
                            console.log("Shapeshift : amount out of shapeshift limit boundary!");
                            $('.tabContent .amount input').addClass('validShapeshiftAmount').addClass('cssValidShapeshiftAmount'); //Change color
                            $('.tabContent .amount .button').removeClass('cssEnabled').removeClass('enabled');    //disable shift button 
                            $('.tabContent .amount .button').removeClass('cssEnabled').removeClass('enabled');    

                            return;
                        } else {
                            console.log("within limits :: " + addressValue);
                            $('.tabContent .amount input').removeClass('validShapeshiftAmount').removeClass('cssValidShapeshiftAmount ');
                        }
                    } else {
                        console.log("multiShifting to :: " + JSON.stringify(depositAddresses));
                    }
                } else {
                    $('.tabContent .amount .button').removeClass('cssEnabled').removeClass('enabled');    

                    console.log("Invalid ss market object. not ready");
                    return;
                }
            }
            
            //@note: @here: @todo: @tokens: this should be refactored eventually.

            if (curCoinType === COIN_BITCOIN) {
                var transactionDict = wallet.getPouchFold(curCoinType).getPouchFoldImplementation().createTransaction(addressValue, coinAmountSmallType);
                
                $('.computedFeeText').html(transactionDict.miningFee);
                if (transactionDict) {
                    data = {
                        address: addressValue,
                        coinAmount_unitLarge: amountValue,
                        transaction: transactionDict.transaction,
                    };
                } else {
                    console.log("COIN_BITCOIN :: no transaction dictionary created");
                }
            } else if (curCoinType === COIN_ETHEREUM) {
                //                console.log("check ether");

                var ethereumAddress = HDWalletHelper.parseEthereumAddress(addressValue);

                var computedFee = "";

                var ethereumTXData = $('.advancedTabContentEthereum .customData input').val();
                if (ethereumTXData === "") {
                    ethereumTXData = null;
                }

                var gasPrice = HDWalletHelper.getDefaultEthereumGasPrice().toNumber();
                var gasLimit = wallet.getHelper().getCustomEthereumGasLimit().toNumber();

                //@note: @here: due to the ethereum tx structure, we may need multiple individual
                //transactions.

                //@note: if not shapeshift, use basic address.

                if (depositAddresses.length === 0) {
                    depositAddresses = [ethereumAddress];
                }

                var transactionDict = wallet.getPouchFold(curCoinType).getPouchFoldImplementation().buildEthereumTransactionList(depositAddresses, coinAmountSmallType, gasPrice, gasLimit, ethereumTXData, null);

                if (transactionDict) {
                    var computedFee = HDWalletHelper.convertWeiToEther(transactionDict.totalTXCost);
                    $('.computedFeeText').html(computedFee);
                    
                    wallet.getPouchFold(curCoinType).getPouchFoldImplementation().checkIsSmartContractQuery(ethereumAddress, function(err, res) {
                        if (!err) {
                            if (res === true) {
                                console.log("advanced data :: " + ethereumTXData + " :: ethereumCustomGasLimit :: " + gasLimit);
                            }
                        }
                    });

                    data = {
                        address: ethereumAddress,
                        coinAmount_unitLarge: amountValue,
                        gasPrice: gasPrice,
                        gasLimit: gasLimit,
                        txArray: transactionDict.txArray,
                    };
                } else {
                    //                    console.log("no transaction dictionary created");
                }
            } else if (curCoinType === COIN_ETHEREUM_CLASSIC) {
                console.log("check ethereum classic");

                var ethereumAddress = HDWalletHelper.parseEthereumAddress(addressValue);

                var computedFee = "";

                var ethereumTXData = $('.advancedTabContentEthereum .customData input').val();
                if (ethereumTXData === "") {
                    ethereumTXData = null;
                }

                var gasPrice = HDWalletHelper.getDefaultEthereumGasPrice().toNumber();
                var gasLimit = wallet.getHelper().getCustomEthereumGasLimit().toNumber();

                //@note: @here: due to the ethereum tx structure, we may need multiple individual
                //transactions.

                //@note: if not shapeshift, use basic address.

                if (depositAddresses.length === 0) {
                    depositAddresses = [ethereumAddress];
                }

                var transactionDict = wallet.getPouchFold(curCoinType).getPouchFoldImplementation().buildEthereumTransactionList(depositAddresses, coinAmountSmallType, gasPrice, gasLimit, ethereumTXData, null);

                if (transactionDict) {
                    var computedFee = HDWalletHelper.convertWeiToEther(transactionDict.totalTXCost);
                    $('.computedFeeText').html(computedFee);

                    wallet.getPouchFold(curCoinType).getPouchFoldImplementation().checkIsSmartContractQuery(ethereumAddress, function(err, res) {
                        if (!err) {
                            if (res === true) {
                                console.log("advanced data :: " + ethereumTXData + " :: ethereumCustomGasLimit :: " + gasLimit);
                            }
                        }
                    });
                    
                    data = {
                        address: ethereumAddress,
                        coinAmount_unitLarge: amountValue,
                        gasPrice: gasPrice,
                        gasLimit: gasLimit,
                        txArray: transactionDict.txArray,
                    };
                } else {
                    //                    console.log("no transaction dictionary created");
                }
            } else if (curCoinType === COIN_DASH) {
                var transactionDict = wallet.getPouchFold(curCoinType).getPouchFoldImplementation().createTransaction(addressValue, coinAmountSmallType);

                $('.computedFeeText').html(transactionDict.miningFee);
                if (transactionDict) {
                    data = {
                        address: addressValue,
                        coinAmount_unitLarge: amountValue,
                        transaction: transactionDict.transaction,
                    };
                } else {
                    console.log("COIN_DASH :: no transaction dictionary created");
                }
            } else if (curCoinType === COIN_THEDAO_ETHEREUM ||
                       curCoinType === COIN_AUGUR_ETHEREUM) {
                //@note: @todo: @here: combine these into a more generic erc20 token type.
                var transactionDict = wallet.getPouchFold(curCoinType).getPouchFoldImplementation().createTransaction(addressValue, depositAddresses, coinAmountSmallType);

                if (transactionDict) {
                    $('.computedFeeText').html(transactionDict.miningFee);

                    data = {
                        address: transactionDict.ethereumAddress,
                        coinAmount_unitLarge: amountValue,
                        gasPrice: transactionDict.gasPrice.toNumber(),
                        gasLimit: transactionDict.gasLimit.toNumber(),
                        txArray: transactionDict.txArray,
                    };
                } else {
                    console.log("[ token: " + curCoinType + " ] :: no transaction dictionary created");
                }
            } else if (curCoinType === COIN_LITECOIN) {
                var transactionDict = wallet.getPouchFold(curCoinType).getPouchFoldImplementation().createTransaction(addressValue, coinAmountSmallType);

                $('.computedFeeText').html(transactionDict.miningFee);
                if (transactionDict) {
                    data = {
                        address: addressValue,
                        coinAmount_unitLarge: amountValue,
                        transaction: transactionDict.transaction,
                    };
                } else {
                    console.log("COIN_LITECOIN :: no transaction dictionary created");
                }
            } else if (curCoinType === COIN_LISK) {
                //@note: @todo: @lisk:
//                var transactionDict = wallet.getPouchFold(curCoinType).getPouchFoldImplementation().createTransaction(addressValue, coinAmountSmallType);
//
//                $('.computedFeeText').html(transactionDict.miningFee);
//                if (transactionDict) {
//                    data = {
//                        address: addressValue,
//                        coinAmount_unitLarge: amountValue,
//                        transaction: transactionDict.transaction,
//                    };
//                } else {
//                    console.log("COIN_LISK :: no transaction dictionary created");
//                }
            } else if (curCoinType === COIN_ZCASH) {
                var transactionDict = wallet.getPouchFold(curCoinType).getPouchFoldImplementation().createTransaction(addressValue, coinAmountSmallType);

                $('.computedFeeText').html(transactionDict.miningFee);
                if (transactionDict) {
                    data = {
                        address: addressValue,
                        coinAmount_unitLarge: amountValue,
                        transaction: transactionDict.transaction,
                    };
                } else {
                    console.log("COIN_ZCASH :: no transaction dictionary created");
                }
            } else if (curCoinType === COIN_TESTNET_ROOTSTOCK) {
                console.log("check rootstock testnet");

                var ethereumAddress = HDWalletHelper.parseEthereumAddress(addressValue);

                var computedFee = "";

                var ethereumTXData = $('.advancedTabContentEthereum .customData input').val();
                if (ethereumTXData === "") {
                    ethereumTXData = null;
                }

                var gasPrice = HDWalletHelper.getDefaultEthereumGasPrice().toNumber();
                var gasLimit = wallet.getHelper().getCustomEthereumGasLimit().toNumber();

                //@note: @here: due to the ethereum tx structure, we may need multiple individual
                //transactions.

                //@note: if not shapeshift, use basic address.

                if (depositAddresses.length === 0) {
                    depositAddresses = [ethereumAddress];
                }

                var transactionDict = wallet.getPouchFold(curCoinType).getPouchFoldImplementation().buildEthereumTransactionList(depositAddresses, coinAmountSmallType, gasPrice, gasLimit, ethereumTXData, null);

                if (transactionDict) {
                    var computedFee = HDWalletHelper.convertWeiToEther(transactionDict.totalTXCost);
                    $('.computedFeeText').html(computedFee);

                    wallet.getPouchFold(curCoinType).getPouchFoldImplementation().checkIsSmartContractQuery(ethereumAddress, function(err, res) {
                        if (!err) {
                            if (res === true) {
                                console.log("advanced data :: " + ethereumTXData + " :: ethereumCustomGasLimit :: " + gasLimit);
                            }
                        }
                    });

                    data = {
                        address: ethereumAddress,
                        coinAmount_unitLarge: amountValue,
                        gasPrice: gasPrice,
                        gasLimit: gasLimit,
                        txArray: transactionDict.txArray,
                    };
                } else {
                    //                    console.log("no transaction dictionary created");
                }
            }

            var coinAbbreviatedName = HDWalletPouch.getStaticCoinPouchImplementation(curCoinType).pouchParameters['coinAbbreviatedName'];
            
            var miningAbbreviatedName = coinAbbreviatedName;

            if (wallet.getPouchFold(curCoinType).isTokenType() === true) {
                miningAbbreviatedName = HDWalletPouch.getStaticCoinPouchImplementation(CoinToken.getMainTypeToTokenCoinHolderTypeMap(curCoinType)).pouchParameters['coinAbbreviatedName'];
            }

            $('.modal send .amountAbbreviatedName').text(miningAbbreviatedName);
        } else if (tab === 'receive') {
            data = {
                coinAmount_unitLarge: amountValue,
            }
        }
    } else if (tab === 'receive' && amountValue.replace(' ', '') === '') {
        data = {
            coinAmount_unitLarge: amountValue,
        }
    } else {
        //        console.log("curCoinType :: " + coinAbbreviatedName[curCoinType] + " :: not valid :: " + amountValue);
    }

    // Update the state of the button
    if (data) {
        $('.tabContent .amount .button').addClass('cssEnabled').addClass('enabled');
    } else {
        $('.tabContent .amount .button').removeClass('cssEnabled').removeClass('enabled');
    }

    $('.modal.send').data('transaction', data);
}

function checkForAllAddresses(docBody) {
    var allResults = [];

    for (var i = 0; i < COIN_NUMCOINTYPES; i++) {
        allResults[i] = checkForAddresses(docBody, i);
    }

    return allResults;
}

function checkForAddresses(docBody, targetCoinType) {
    //    console.log(docBody);
    //var addresses = str.match(/[\s>&"\:\;][13][1-9A-HJ-NP-Za-km-z]{26,33}[\s<&"\?\.]/g);
    //var uris = str.match(/bitcoin:[13][1-9A-HJ-NP-Za-km-z]{26,33}\?&?amount=[0-9\.]+/g);

    var results = {};

    if (targetCoinType == COIN_BITCOIN) {
        var bitcoinAddresses = docBody.match(/(^|[^A-Za-z0-9])[13mn][1-9A-HJ-NP-Za-km-z]{26,33}($|[^A-Z-z0-9])/g);
        if (!bitcoinAddresses) { bitcoinAddresses = []; }
        for (var i = 0; i < bitcoinAddresses.length; i++) {
            var bitcoinAddress = bitcoinAddresses[i].match(/[13mn][1-9A-HJ-NP-Za-km-z]{26,33}/);
            if (bitcoinAddress) {
                results[bitcoinAddress] = 0;
            }
        }

        //@note: @details: https://regex101.com/
        var uris = docBody.match(/bitcoin:(\/\/)?[13mn][1-9A-HJ-NP-Za-km-z]{26,33}(\?[A-Za-z0-9._&=-]*&amount=|\?amount=)[0-9\.]+/g);

        if (!uris) { uris = []; }
        for (var i = 0; i < uris.length; i++) {
            var uri = uris[i];

            var comps = uri.split('?');

            var address = comps[0].match(/[13mn][1-9A-HJ-NP-Za-km-z]{26,33}/);

            var amount = null;
            var amountError = false;

            var pairs = comps[1].split('&');
            for (var pairIndex = 0; pairIndex < pairs.length; pairIndex++) {
                var pair = pairs[pairIndex];
                if (amount !== null) {
                    amountError = true;
                } else if (pair.substring(0, 7) === 'amount=') {
                    amount = pair.substring(7);
                }
            }

            if (amountError) { amount = null; }

            results[address] = (amount !== null) ? amount: "";
        }
    } else if (targetCoinType == COIN_ETHEREUM) {
        var ethereumAddresses = docBody.match(/(0x[0-9a-fA-F]{40})/g);
        console.log("check :: " + ethereumAddresses);

        if (!ethereumAddresses) { ethereumAddresses = []; }
        for (var i = 0; i < ethereumAddresses.length; i++) {
            var isValidEthereumLikeAddress = false;

            var validAddressTypes = getAddressCoinTypes(ethereumAddresses[i]);

            if (validAddressTypes[COIN_ETHEREUM] === true ||
                validAddressTypes[COIN_ETHEREUM_CLASSIC] === true ||
                validAddressTypes[COIN_TESTNET_ROOTSTOCK] === true) {
                isValidEthereumLikeAddress = true;
            }
            
            
            console.log("found :: " + ethereumAddresses[i] + " :: " + JSON.stringify(validAddressTypes));
            
            var ethereumAddress = ethereumAddresses[i];

            if (isValidEthereumLikeAddress) {
                //            console.log("found ethereum address :: " + ethereumAddresses[i] + " :: " + getAddressCoinType(ethereumAddresses[i]))
                results[ethereumAddress] = 0;
            }
        }
        //@note: @todo: ethereum uri support.
    }

    for (resultAddress in results) {
        //        console.log("found :: resultAddress :: " + resultAddress + " :: " + getAddressCoinType(resultAddress) + " :: targetCoinType :: " + targetCoinType);
        var validAddressTypes = getAddressCoinTypes(resultAddress);

        if (validAddressTypes[targetCoinType] !== true) {
            delete results[resultAddress];
        }
    }

    return results;
}

function populateScanAddresses(coinScanAddresses) {
    $('.populatePageAddresses').empty();

    var template = $('.pageAddressTemplate > .pageAddress');

    var foundValidAddresses = 0;
    var foundAddressCoinType = -1;

    for (var address in coinScanAddresses) {
        console.log("found address :: " + address);

        var link = template.clone(true);
        var amount = coinScanAddresses[address];

        $('.address', link).text(address);
        $('.amount', link).text(amount);

        link.click((function(address, amount) {
            return function() {
                Navigation.showTab('send');
                if (amount) {
                    $('.tabContent .amount input').val(amount)
                }
                $('.tabContent .address input').val(address).trigger('keyup');
            };
        })(address, amount));

        console.log("populating to :: " + $('.populatePageAddresses') + " :: " + link);
        $('.populatePageAddresses').append(link);
    }

    if (Object.keys(coinScanAddresses).length < 3) {
        $('.pageAddressScrollContainer').css('overflow-y', 'hidden');
        $('.pageAddressScrollContainer').css('display', 'hidden');
    } else {
        $('.pageAddressScrollContainer').css('overflow-y', 'scroll');
    }

    $('.pageAddresses').data('addresses', Object.keys(coinScanAddresses).length);
}

function showPageScanAddresses(targetCoinType) {
    populateScanAddresses(pageScanAddresses[targetCoinType]);

    //    console.log("pageScanAddresses[targetCoinType].length :: " + Object.keys(pageScanAddresses[targetCoinType]).length);
    if (Object.keys(pageScanAddresses[targetCoinType]).length > 0) {
        $('.pageAddressesHeader').show();
        $('.pageAddresses').show();

        Navigation.showTab('send');
    }
}

function countdownButtonUpdate(element, prefixText, timeRemaining, onUpdateCallback, onFinishCallback) {
    if (onUpdateCallback) {
        onUpdateCallback(timeRemaining - 1);
    }

    setTimeout(function() {
        if (timeRemaining > 1) {
            countdownButtonUpdate(element, prefixText, timeRemaining - 1, onUpdateCallback, onFinishCallback);
        } else {
            onFinishCallback();
        }
    }, 1000);
}

function _loadWallet(loadedWallet) {
    console.log("loadedWallet :: " + loadedWallet + " :: loadedWallet.getPouchFold(COIN_BITCOIN) :: " + loadedWallet.getPouchFold(COIN_BITCOIN));

    if (wallet) {
        $(window).trigger('unload');
    } else {
        if (window.native && window.native.preloadEthereum) {
            //            native.preloadEthereum();
        }
    }

    g_JaxxApp.getUI().resetTransactionList(curCoinType);

    for (var i = 0; i < COIN_NUMCOINTYPES; i++) {
        g_JaxxApp.getUI().setupTransactionList(i, 50);
    }

    wallet = loadedWallet;

    g_JaxxApp.setupWithWallet(wallet);
    wallet.switchToCoinType(curCoinType);

    Navigation.setUseFiat(false);

    $('.settings').hide();
    $('.modal').hide();
    $('.wallet').show();

    forceUpdateWalletUI();

    for (var i = 0; i < COIN_NUMCOINTYPES; i++) {
        wallet.getPouchFold(i).addListener(updateWalletUI);
        wallet.getHelper().addExchangeRateListener(i, function(){
            if (curCoinType === i){
                updateWalletUI();
            }
        });
    }

    $(window).unload(function() {
        wallet.shutDown(updateWalletUI);
    });

    if (openUrl) {
        checkOpenUrl(openUrl);
        openUrl = null;
    }

    resize();

    g_JaxxApp.getUI().getJaxxNews(function() {
        g_JaxxApp.getUI().displayJaxxNewsIfCritical();
    });

    if (window.chrome && window.chrome.windows) {
        chrome.windows.getCurrent(function (currentWindow) {
            chrome.tabs.query({active: true, windowId: currentWindow.id}, function (activeTabs) {
                chrome.tabs.executeScript({allFrames: true, file: './js/extension_getdocbody.js'});
            });
        });

        //        console.log("setting up page scanner");

        chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
            //            console.log("received message :: " + JSON.stringify(message) + " :: " + JSON.stringify(sender) + " :: " + sendResponse);

            if (message['action'] === "getDocBody") {
                //                console.log("jaxx page scanner :: got document body");
                var pageResults = checkForAllAddresses(message.results);

                //                console.log("jaxx page scanner :: results :: " + JSON.stringify(pageResults));
                pageScanAddresses = pageResults;

                //@note: for UI class
                showPageScanAddresses(curCoinType);
            }
        });
    }	
	
	// getStoredData('mnemonic', false);
	// Restore the currencies into the program:
	
	var default_currency = getStoredData('fiat', false); // This needs to be set because toggleCurrency changes the default currency.
	var currencyListArray = JSON.parse(getStoredData('currencies_selected', false));
	// var currenciesPositionOrder = getStoredData('currencies_position_order', false); // Do something with this?
	if (typeof(currencyListArray) === 'undefined' || currencyListArray === null){
		currencyListArray = [];	
	}
	if (!(currencyListArray.indexOf(default_currency) > -1)) {
		Navigation.toggleCurrency(default_currency);
	}
	console.log('currencies_selected resource data is ', currencyListArray);
	for (var i = 0; i < currencyListArray.length; i++){
		Navigation.toggleCurrency(currencyListArray[i]);
	}
	// @Note: Set wallet unit
	wallet.getHelper().setFiatUnit(default_currency);
	
	g_JaxxApp.getUI().showHamburgerMenu();
	
	//currency = wallet.getHelper().getFiatUnit();
	//Navigation.toggleCurrency(currency, true);
    
    g_JaxxApp.getUI().updateCoinBannerCarousel();
    
    return wallet;
}

function loadFromEncryptedMnemonic(mnemonicEncrypted, callback) {
    var wallet = new HDWalletMain();
    wallet.initialize();

    //    var mnemonicEncrypted = getStoredData('mnemonic', false);

    wallet.setupWithEncryptedMnemonic(mnemonicEncrypted, function(err) {
        if (err) {
            console.log("loadFromEncryptedMnemonic :: error :: " + err);
            callback(err, null);
        } else {
            callback(null, _loadWallet(wallet));
        }
    });
}

/**
 *  User Interface - Tabs
 *
 */

var Navigation = (function () {
    this.ignoreUpdateFromInputFieldEntry = false;
    var _currenciesEnabled = []; // This keeps a record of all currencies the user has enabled

    var closeModal = function() {
        var visible = $('.modal.visible');
        visible.removeClass('visible').animate({ opacity: 0}, 300, function () {
            visible.hide();
        });
		if (window.native && window.native.setIsModalOpenStatus) {
			window.native.setIsModalOpenStatus(false);
		}
    }

    var openModal = function(modalName) {
        closeModal();
        var modal = $('.modal.' + modalName);
        modal.css({opacity: 0}).show().animate({opacity: 1}).addClass('visible');
        modal.click(function (e) {
            if ($(e.target).hasClass('modal')) {
                closeModal();
            }
        });
        if (window.native && window.native.setIsModalOpenStatus) {
            window.native.setIsModalOpenStatus(true);
        }
    };

    var futureResize = function() {
        setTimeout(resize, 10);
    }


    // Show a tab
    // @TODO: add an "amiated" parameter
    var showTab = function(tabName) {
        $('.tab').removeClass('cssSelected').removeClass('selected');
        $('.tab.' + tabName).addClass('cssSelected').addClass('selected');

        if (tabName === 'send') {
            if ($('.tabContent').hasClass('selected')) {
                //                console.log("path A1");
                $('.tabContent .address').slideDown();
                $('.tabContent .spendable').slideDown();
                if ($('.tabContent .pageAddresses').data('addresses')) {
                    //                    console.log("path A");
                    $('.tabContent .pageAddressesHeader').slideDown();
                    $('.tabContent .pageAddresses').slideDown();
                }

                if (curCoinType === COIN_BITCOIN) {
                } else if (curCoinType === COIN_ETHEREUM) {
                    if (g_JaxxApp.getShapeShiftHelper().getIsTriggered()) {

                    } else {
                        $('.tabContent .advancedTabButton').slideDown();
                        //                    $('.tabContent .advancedTabContentEthereum').slideDown(futureResize);
                    }
                }
            } else {
                //                console.log("path B1");
                $('.tabContent .address').show();
                $('.tabContent .spendable').show();
                if ($('.tabContent .pageAddresses').data('addresses')) {
                    //                    console.log("path B");
                    $('.tabContent .pageAddressesHeader').show();
                    $('.tabContent .pageAddresses').show();
                }
                if (curCoinType === COIN_BITCOIN) {
                } else if (curCoinType === COIN_ETHEREUM) {
                    if (g_JaxxApp.getShapeShiftHelper().getIsTriggered()) {

                    } else {
                        $('.tabContent .advancedTabButton').show();
                    }
                    //                    $('.tabContent .advancedTabContentEthereum').show();
                }
            }
            $('.tabContent .amount .button span.send').css({opacity: 1});
            $('.tabContent .amount .button span.receive').css({opacity: 0});
            $('.tabs .tab.send .icon').fadeTo(0, 1);
            $('.tabs .tab.receive .icon').fadeTo(0, 0.5);
        } else {
            if ($('.tabContent').hasClass('selected')) {
                $('.tabContent .address').slideUp();
                $('.tabContent .pageAddressesHeader').slideUp();
                $('.tabContent .pageAddresses').slideUp();
                $('.tabContent .spendable').slideUp();
                if (curCoinType === COIN_BITCOIN) {
                } else if (curCoinType === COIN_ETHEREUM) {
                    $('.tabContent .advancedTabButton').slideUp();
                    Navigation.hideEthereumAdvancedMode();
                    //                    $('.tabContent .advancedTabContentEthereum').slideUp(futureResize);
                }
            } else {
                $('.tabContent .address').hide();
                $('.tabContent .pageAddressesHeader').hide();
                $('.tabContent .pageAddresses').hide();
                $('.tabContent .spendable').hide();
                if (curCoinType === COIN_BITCOIN) {
                } else if (curCoinType === COIN_ETHEREUM) {
                    $('.tabContent .advancedTabButton').hide();
                    $('.tabContent .advancedTabContentEthereum').hide();
                }
            }
            $('.tabContent .amount .button span.receive').css({opacity: 1});
            $('.tabContent .amount .button span.send').css({opacity: 0});
            $('.tabs .tab.send .icon').fadeTo(0, 0.5);
            $('.tabs .tab.receive .icon').fadeTo(0, 1);

            ethereumAdvancedModeHidden = true;
        }

        if ($('.tabContent').hasClass('selected')) {
            $('.tabContent .amount').slideDown();
        } else {
            $('.tabContent .amount').show();
        }

        $('.tabContent').slideDown(futureResize).addClass('cssSelected').addClass('selected');
        //
        //        $('.tabContent .amount input').trigger('keyup');

        // @Todo: Refactor this.
        if (window.native && window.native.setTabName) {
            window.native.setTabName(Navigation.getTab()); // Push data to Android app.
        }
    };

    var getTab = function() {
        var tab = $('.tab.selected');
        if (tab.hasClass('receive')) {
            return 'receive';
        } else if (tab.hasClass('send')) {
            return 'send';
        }
        return null;
    }

    // Collapse the tabs
    var collapseTabs = function() {
        $('.tabs .tab').removeClass('cssSelected');
        $('.tabs .tab').removeClass('selected');

        $('.tabs .icon').fadeTo(500, 1);
        $('.tabContent').removeClass('cssSelected');
        $('.tabContent').removeClass('selected');
        $('.tabContent').slideUp(futureResize);

        ethereumAdvancedModeHidden = true;

        // @Todo: Refactor this.
        if (window.native && window.native.setTabName) {
            window.native.setTabName(Navigation.getTab()); // Push data to Android app.
        }
    };


    // If the tab is already selected, collapse the tabs; otherwise open it
    var toggleTab = function(tabName) {
        //        console.log(tabName);
        if (g_JaxxApp.getShapeShiftHelper().getIsTriggered()) {
            if (tabName === 'send') {
                $('.spendable').slideDown(); // Hide Spendable line
            }

            g_JaxxApp.getUI().resetShapeShift();
        }

        var tab = $('.tab.' + tabName);
        if (tab.hasClass('selected')) {
            collapseTabs();
        } else {
            showTab(tabName);
        }
        //@note: also hide the transaction history.

        Navigation.clearInputFields();

        Navigation.hideTransactionHistoryDetails();

		g_JaxxApp.getUI().closeShapeshiftCoinList();
        g_JaxxApp.getUI().closeQuickFiatCurrencySelector();
    }


    var isUseFiat = function () {
        return ($('.unitToggle').data('fiat') === true);
    };

    var setUseFiat = function(useFiat) {
        $('.unitToggle').data('fiat', (useFiat === true));

        if (useFiat) {
            $('.unitToggle .symbol').text(wallet.getHelper().getFiatUnitPrefix());
        } else {
            var coinSymbol = HDWalletPouch.getStaticCoinPouchImplementation(curCoinType).uiComponents['coinSymbol'];
            
            $('.unitToggle .symbol').text(coinSymbol);
        }

        updateSpendable();

        $('.tabContent .amount input').trigger('keyup');
    };

    var toggleUseFiat = function() {
        setUseFiat(!isUseFiat());
    };

    var settingsStack = [];

    var getSettingsStack = function(){
        return settingsStack;
        // @Todo: Refactor this.
        if (window.native && window.native.setSettingsStackStatusSize) {
            window.native.setSettingsStackStatusSize(settingsStack.length);
        }

        // Log message to Android Studio:
        if (window.native && window.native.createLogMessage) {
            window.native.createLogMessage("The settings stack size is " + settingsStack.length);
        }
    };

    var clearSettings = function() {
        $('.settings').hide();
        $('#privateKeySweep').val('').trigger('keyup');
        settingsStack = [];
        //@note: @here: @todo: @next: maybe also close the slideout menu here.
        
        // @Todo: Refactor this.
        if (window.native && window.native.setSettingsStackStatusSize) {
            window.native.setSettingsStackStatusSize(settingsStack.length);
        }

        // Log message to Android Studio:
        if (window.native && window.native.createLogMessage) {
            window.native.createLogMessage("The settings stack size is " + settingsStack.length);
        }
    }

    var pushSettings = function(settingsName) {
        if (settingsName === 'backupMnemonic') {
            var element = $('.proceedToBackupMnemonicButton');
            element.removeClass('cssBlueButtonWide');
            element.addClass('cssGreyButtonWide');
            element.css('cursor', 'default');
            element.attr('pushSettings', null);

            countdownButtonUpdate(element, 'Proceed to Backup', 10, null, function() {
                element.removeClass('cssGreyButtonWide');
                element.addClass('cssBlueButtonWide');
                element.css('cursor', 'pointer');

                element.attr('pushSettings', 'viewMnemonic'); // This is attached to the button when the counter hits '0'.
                element.attr('hide', ".settings.viewMnemonic .cssShowButton"); // This is appended to allow the same functionality that the warning screen would have provided.
                element.attr('show', ".settings.viewMnemonic .mnemonic"); // This is appended to allow the same functionality that the warning screen would have provided.
            });

            var elementTwo = $('.proceedToBackupMnemonicCount');
            elementTwo.fadeIn();

            countdownButtonUpdate(elementTwo, '', 10, function(timeRemaining) {
                elementTwo.text(timeRemaining);
            }, function() {
                elementTwo.fadeOut();
            });
        }

        if (settingsName === 'pairToDevice') {
            var element = $('.pairDeviceShowMnemonicButton');
            element.removeClass('cssBlueButtonWide');
            element.addClass('cssGreyButtonWide');
            element.css('cursor', 'default');
            element.attr('pushSettings', null);

            countdownButtonUpdate(element, 'I Understand: ', 10, null, function() {
                element.removeClass('cssGreyButtonWide');
                element.addClass('cssBlueButtonWide');
                element.text('I Understand');
                element.css('cursor', 'pointer');
                element.attr('pushSettings', 'viewJaxxToken');
            });

            var elementTwo = $('.pairDeviceShowMnemonicCount');
            elementTwo.fadeIn();

            countdownButtonUpdate(elementTwo, '', 10, function(timeRemaining) {
                elementTwo.text(timeRemaining);
            }, function() {
                elementTwo.fadeOut();
            });
        }

        console.log("push settingsName :: " + settingsName);

        if (settingsName === 'backupPrivateKeysBitcoin') {
            setupBackupPrivateKeys(COIN_BITCOIN);
        }

        if (settingsName === 'exportPrivateKeysBitcoin') {
            setupExportPrivateKeys(COIN_BITCOIN);
        }

        if (settingsName === 'backupPrivateKeysEthereum') {
            setupBackupPrivateKeys(COIN_ETHEREUM);
        }

        if (settingsName === 'exportPrivateKeysEthereum') {
            setupExportPrivateKeys(COIN_ETHEREUM);
        }

        if (settingsName === 'backupPrivateKeysEthereumClassic') {
            setupBackupPrivateKeys(COIN_ETHEREUM_CLASSIC);
        }

        if (settingsName === 'exportPrivateKeysEthereumClassic') {
            setupExportPrivateKeys(COIN_ETHEREUM_CLASSIC);
        }

        if (settingsName === 'backupPrivateKeysDash') {
            setupBackupPrivateKeys(COIN_DASH);
        }

        if (settingsName === 'exportPrivateKeysDash') {
            setupExportPrivateKeys(COIN_DASH);
        }

        if (settingsName === 'backupPrivateKeysLitecoin') {
            setupBackupPrivateKeys(COIN_LITECOIN);
        }

        if (settingsName === 'exportPrivateKeysLitecoin') {
            setupExportPrivateKeys(COIN_LITECOIN);
        }

        if (settingsName === 'backupPrivateKeysLisk') {
            setupBackupPrivateKeys(COIN_LISK);
        }

        if (settingsName === 'exportPrivateKeysLisk') {
            setupExportPrivateKeys(COIN_LISK);
        }

        if (settingsName === 'backupPrivateKeysZCash') {
            setupBackupPrivateKeys(COIN_ZCASH);
        }

        if (settingsName === 'exportPrivateKeysZCash') {
            setupExportPrivateKeys(COIN_ZCASH);
        }
        
        if (settingsName === 'backupPrivateKeysTestnetRootstock') {
            setupBackupPrivateKeys(COIN_TESTNET_ROOTSTOCK);
        }

        if (settingsName === 'exportPrivateKeysTestnetRootstock') {
            setupExportPrivateKeys(COIN_TESTNET_ROOTSTOCK);
        }



        if (settingsName === 'viewMnemonic') {
            if (g_JaxxApp.getUser().hasPin()) {
                settingsName = 'viewMnemonicConfirmPin';
            } else {
            }
        } else if (settingsName === 'viewMnemonicConfirmed') {
            settingsName = 'viewMnemonic';
        }

        if (settingsName === 'viewJaxxToken') {
            if (g_JaxxApp.getUser().hasPin()) {
                settingsName = 'pairToDeviceConfirmPin';
            } else {
            }
        } else if (settingsName === 'pairToDeviceConfirmed') {
            settingsName = 'viewJaxxToken';
        }

        if (settingsName === 'setupPINCode') {
            if (g_JaxxApp.getUser().hasPin()) {
            } else {
                settingsName = 'changePinCode';
            }
        }

        if (settingsName === 'backupPrivateKeys') {
            if (g_JaxxApp.getUser().hasPin()) {
                settingsName = 'backupPrivateKeysConfirmPin';
            } else {
            }
        } else if (settingsName === 'backupPrivateKeysConfirmed') {
            settingsName = 'backupPrivateKeys';
        }

        //@note: @todo: android back button support for submenus.
        if (settingsStack.length) {
            var topSettings = $('.settings.' + settingsStack[settingsStack.length - 1]);
            topSettings.animate({left: "-50%"});
        }
        var settings = $('.settings.' + settingsName);
        settingsStack.push(settingsName);
        settings.css({left: '100%'}).show().animate({left: 0});

        if (settingsName === 'viewMnemonicConfirmPin') {
            JaxxUI._sUI.showSettingsMnemonicConfirmPin('.settingsViewMnemonicConfirmPinPad', function() {
                Navigation.pushSettings('viewMnemonicConfirmed');
            });
        }

        if (settingsName === 'pairToDeviceConfirmPin') {
            JaxxUI._sUI.showSettingsMnemonicConfirmPin('.settingsPairToDeviceConfirmPinPad', function() {
                Navigation.pushSettings('pairToDeviceConfirmed');
            });
        }

        if (settingsName === 'backupPrivateKeysConfirmPin') {
            JaxxUI._sUI.showSettingsMnemonicConfirmPin('.settingsBackupPrivateKeysConfirmPinPad', function() {
                Navigation.pushSettings('backupPrivateKeysConfirmed');
            });
        }
        if (settingsName === 'changePinCode') {
            g_JaxxApp.getUI().showEnterPinSettings();
        }

        if (settingsName === 'removePinCode') {
            g_JaxxApp.getUI().showRemovePinSettings();
        }

        // @Todo: Refactor this.
        if (window.native && window.native.setSettingsStackStatusSize) {
            window.native.setSettingsStackStatusSize(settingsStack.length);
        }

        // Log message to Android Studio:
        if (window.native && window.native.createLogMessage) {
            window.native.createLogMessage("The settings stack is " + settingsStack.join(','));
        }
    }

    var popSettings = function() {
        var settingsName = settingsStack.pop();

        if (settingsStack.length) {
            var nextSettings = $('.settings.' + settingsStack[settingsStack.length - 1]);
            nextSettings.animate({left: 0});
        }

        var settings = $('.settings.' + settingsName);
        settings.animate({left: '100%'}, function () {
            settings.hide();
        });

        console.log("pop settingsName :: " + settingsName);

        if (settingsName === 'viewMnemonic') {
            if (g_JaxxApp.getUser().hasPin()) {
                JaxxUI._sUI.showSettingsMnemonicConfirmPin('.settingsViewMnemonicConfirmPinPad', function() {
                    Navigation.pushSettings('viewMnemonicConfirmed');
                });
            } else {

            }
        }

        if (settingsName === 'viewJaxxToken') {
            if (g_JaxxApp.getUser().hasPin()) {
                JaxxUI._sUI.showSettingsMnemonicConfirmPin('.settingsPairToDeviceConfirmPinPad', function() {
                    Navigation.pushSettings('pairToDeviceConfirmed');
                });
            } else {

            }
        }

        if (settingsName === 'backupPrivateKeys') {
            if (g_JaxxApp.getUser().hasPin()) {
                JaxxUI._sUI.showSettingsMnemonicConfirmPin('.settingsBackupPrivateKeysConfirmPinPad', function() {
                    Navigation.pushSettings('backupPrivateKeysConfirmed');
                });
            } else {

            }
        }

        // @Todo: Refactor this.
        if (window.native && window.native.setSettingsStackStatusSize) {

            window.native.setSettingsStackStatusSize(settingsStack.length);
        }

        // Log message to Android Studio:
        if (window.native && window.native.createLogMessage) {
            window.native.createLogMessage("The settings stack size is " + settingsStack.length);
        }
    }

    var flashBanner = function(text, timeout) {
        var banner = $('<div>').addClass("flex-container").text(text).css({display: 'flex'}).css({"flex-direction": 'column'}).css({"min-height":'0vh'});

        $('.banners').append(banner);
        banner.slideDown();
        if (timeout) {
            setTimeout(function () {
                banner.slideUp(function() {
                    banner.remove();
                });
            }, parseInt(timeout) * 1000);
        }
    }

    var flashBannerMultipleMessages = function(textArray, timeout) {
        var banner = $('<div>').addClass("flex-container").css({display: 'none'});
        for (var i = 0; i < textArray.length; i++) { // This loop populates the text of the banner.
            if (i != 0) {
                banner.append('<br/>');
            }
            banner.append(textArray[i]);
        }

        $('.banners').append(banner);
        banner.slideDown();
        if (timeout) {
            setTimeout(function () {
                banner.slideUp(function() {
                    banner.remove();
                });
            }, parseInt(timeout) * 1000);
        }
    }

    var hideUI = function(fromProfileMode, toProfileMode, callbackFunc, firstUnlock) {
        var animSpeed = 250;//parseFloat($('.tab.send').attr('data-wow-duration')) * 1000;
        var completionOffset = 750;
        if (firstUnlock === true) {
            completionOffset = 1250;
        }

        //        for (idx in elementNames) {
        //            $(elementNames[idx]).attr({'data-wow-duration': animSpeed})// = animSpeed;
        //        }

        //        console.log("animSpeed :: " + animSpeed + " :: " + (animSpeed + completionOffset));

        var coinFullName = HDWalletPouch.getStaticCoinPouchImplementation(curCoinType).uiComponents['coinFullName'];

        var curTransactionTable = '.table.transactions.transactions' + coinFullName;

        //        console.log("hiding :: " + curTransactionTable);

        $(curTransactionTable).slideUp(0, function() {
            //            console.log("hidden :: " + curCoinType);
        });
        //        var tableElements = $(curTransactionTable).get();

        //        var tableElements = $('.table.transactions .tableRow').get();
        //        for (rowID in tableElements) {
        //            var curElement = $(tableElements[rowID]);//[0];
        //
        //            curElement.fadeTo(animSpeed, 0);
        //        }

        Navigation.hideTransactionHistoryDetails();
        Navigation.clearInputFields();
        Navigation.returnToDefaultView();

        //@note: @here: @todo: put this in a better spot.
        $('.ethereumTokenInsufficientGasForSpendableWarningText').slideUp();


        var transitionBaseIn;
        var transitionBaseOut;

        //@note: @todo: consider switching from landscape to portrait and vise-versa.
        //would need to have a flag on hide to use portrait/landscape in/out selectively.

        transitionBaseIn = (fromProfileMode === PROFILE_PORTRAIT) ? portraitTransitionsIn : landscapeTransitionsIn;

        transitionBaseOut = (toProfileMode === PROFILE_PORTRAIT) ? portraitTransitionsOut : landscapeTransitionsOut;

        for (var eID in transitionElementNames) {
            var curElement = transitionElementNames[eID];

            $(curElement).removeClass(transitionBaseIn[curElement]);
            $(curElement).addClass(transitionBaseOut[curElement]);
        }

        setTimeout(callbackFunc, animSpeed + completionOffset);
    }

    var showUI = function(fromProfileMode, toProfileMode, callback) {
        var animSpeed = 250;

        //@note: @todo: consider switching from landscape to portrait and vise-versa.
        //would need to have a flag on hide to use portrait/landscape in/out selectively.

        var transitionBaseIn;
        var transitionBaseOut;

        transitionBaseIn = (fromProfileMode === PROFILE_PORTRAIT) ? portraitTransitionsIn : landscapeTransitionsIn;

        transitionBaseOut = (toProfileMode === PROFILE_PORTRAIT) ? portraitTransitionsOut : landscapeTransitionsOut;

        for (var eID in transitionElementNames) {
            var curElement = transitionElementNames[eID];

            $(curElement).removeClass(transitionBaseOut[curElement]);
            $(curElement).addClass(transitionBaseIn[curElement]);
        }

        var coinFullName = HDWalletPouch.getStaticCoinPouchImplementation(curCoinType).uiComponents['coinFullName'];
        
        var curTransactionTable = '.table.transactions.transactions' + coinFullName;

        //        console.log("showing :: " + curTransactionTable);

        resize();
        if (callback) {
            $(curTransactionTable).slideDown({complete: callback});
        } else {
            $(curTransactionTable).slideDown();
        }
    }

    var returnToDefaultView = function() {
        var sendTab = $('.tab.' + 'send');
        var receiveTab = $('.tab.' + 'receive');

        if (g_JaxxApp.getShapeShiftHelper().getIsTriggered()) {
            $('.spendableShapeshift').slideUp(); // Show ShapeShift logo and Info icon

            g_JaxxApp.getUI().resetShapeShift();
        }

        if (sendTab.hasClass('selected') || receiveTab.hasClass('selected')) {
            Navigation.collapseTabs();
        }
        
        g_JaxxApp.getUI().closeQuickFiatCurrencySelector();
		g_JaxxApp.getUI().closeShapeshiftCoinList();
    }

    var hideTransactionHistoryDetails = function(excludeElement) {
        var coinFullName = HDWalletPouch.getStaticCoinPouchImplementation(curCoinType).uiComponents['coinFullName'];
        
        if (excludeElement) {
            var curTransactionTable = '.table.transactions.transactions' + coinFullName;

            var tableElements = $('.table.transactions.transactions' + coinFullName + ' .tableRow').get();

            //@note: most likely there is a more succinct way to do this comparison, but there's no global table object
            //available, and none of this stuff is classed so this is the way it's going to be until there's a proper
            //refactoring.
            for (var rowID in tableElements) {

                var curElement = $(tableElements[rowID])[0];
                if (excludeElement && curElement == excludeElement) {
                    //                console.log("found row");
                } else {
                    //                console.log("other row");
                    if ($('.verbose', curElement).is(':visible')) {
                        $('.verbose', curElement).slideToggle();
                    }
                }
            }
        } else {
            var tableVerboseElements = $('.table.transactions.transactions' + coinFullName + ' .tableRow').children('.verbose').filter(':visible');

            //            console.log("num elements :: " + tableVerboseElements.length);
            tableVerboseElements.slideToggle();
        }
    }

    var clearInputFields = function() {
        Navigation.ignoreUpdateFromInputFieldEntry = true;

        $('.settings.sweepPrivateKey input').val("").trigger('keyup');
        $('.settings.sweepPrivateKeyPasswordEntry input').val("").trigger('keyup');

        $('.tabContent .address input').val('').trigger('keyup');
        $('.tabContent .amount input').val('').trigger('keyup');
        $('.advancedTabContentEthereum .customGasLimit input').val('').trigger('keyup');
        $('.advancedTabContentEthereum .customData input').val('').trigger('keyup');

        $('.ethereumChecksumAddressWarningText').slideUp();

        Navigation.ignoreUpdateFromInputFieldEntry = false;

        updateFromInputFieldEntry();
    }

    var setupCoinUI = function(targetCoinType) {
        Navigation.hideEthereumAdvancedMode();

        //@note: @here: @token: this seems necessary.
        if (targetCoinType === COIN_BITCOIN ||
            targetCoinType === COIN_THEDAO_ETHEREUM ||
            targetCoinType === COIN_DASH ||
            targetCoinType === COIN_AUGUR_ETHEREUM ||
            targetCoinType === COIN_LITECOIN ||
            targetCoinType === COIN_LISK ||
            targetCoinType === COIN_ZCASH) {
            $('.tabContent .advancedTabButton').slideUp();
            $('.tabContent .advancedTabButton').hide();
        } else if (targetCoinType === COIN_ETHEREUM ||
                   targetCoinType === COIN_ETHEREUM_CLASSIC ||
                   targetCoinType === COIN_TESTNET_ROOTSTOCK) {

            Navigation.setEthereumAdvancedModeCustomGasLimitSuggestion(0, null);

            $('.advancedTabButton').unbind();
            $('.advancedTabButton').bind('click', null, function() {
                if (Navigation.ethereumAdvancedModeHidden()) {
                    Navigation.showEthereumAdvancedMode();
                } else {
                    Navigation.hideEthereumAdvancedMode();
                }

                console.log("toggle advanced tab");
            });

            if (g_JaxxApp.getShapeShiftHelper().getIsTriggered()) {

            } else {
                $('.tabContent .advancedTabButton').show();
            }
        }
    }
    
    var ethereumSecretSelectorActivate = function() {
        if(!PlatformUtils.mobileCheck() && !PlatformUtils.extensionCheck() && !PlatformUtils.desktopCheck() ){
            var newProfileMode = (curProfileMode === PROFILE_PORTRAIT) ? PROFILE_LANDSCAPE : PROFILE_PORTRAIT;

            Navigation.setProfileMode(newProfileMode);
        }

        if (typeof(ethereumUnlocked) === 'undefined' || ethereumUnlocked === null || ethereumUnlocked === false) {
            if (ethereumSecretProgress > 1 && ethereumSecretProgress < 4) {
                ethereumSecretProgress++;

                //                console.log("ethereumSecretProgress :: " + ethereumSecretProgress);
                if (ethereumSecretProgress === 4) {
                    console.log("[Unlock Ethereum]");

                    ethereumUnlocked = true;
                    storeData('ethereum_unlocked', ethereumUnlocked);

g_JaxxApp.getUI().resetCoinButton(COIN_ETHEREUM);
                    $('.imageLogoBannerETH').fadeTo(0, 1);
                    Navigation.switchToEthereum(true);
                }
            } else {
                ethereumSecretProgress = 0;
            }
        }
    }

    var showSpinner = function(targetCoinType) {
        var coinSpinnerElementName = HDWalletPouch.getStaticCoinPouchImplementation(targetCoinType).uiComponents['coinSpinnerElementName'];
        
        $(coinSpinnerElementName).show();
        $(coinSpinnerElementName).fadeTo(100, 1);
        $(coinSpinnerElementName).css('z-index', '1100');
    }

    var hideSpinner = function(targetCoinType) {
        var coinSpinnerElementName = HDWalletPouch.getStaticCoinPouchImplementation(targetCoinType).uiComponents['coinSpinnerElementName'];
        
        $(coinSpinnerElementName).fadeTo(500, 0);
        $(coinSpinnerElementName).css('z-index', '-1');

        setTimeout(function() {
            $(coinSpinnerElementName).hide();
        }, 500);
    }

    var startBlit = function() {
        //        console.log("resize :: " + resize);
        resize();
        setTimeout(function() {
            resize();
        }, 50);

        if (hasBlit === false) {
            hasBlit = true;

            Navigation.clearInputFields();

            if (PlatformUtils.extensionCheck() || PlatformUtils.desktopCheck()) {
            } else if (PlatformUtils.mobileCheck()) {
                console.log("< mobile mode >");
                function stopAllAnimations() {
                    for (cName in transitionElementNames) {
                        var element = $(transitionElementNames[cName]);
                        element.removeClass('animated');
                        element.addClass('animatedInstant');
                    }
                }

                stopAllAnimations();
                Navigation.hideUI(curProfileMode, curProfileMode);

                setTimeout(function() {

                    function playAllAnimations() {
                        for (cName in transitionElementNames) {
                            var element = $(transitionElementNames[cName]);
                            element.removeClass('animatedInstant');
                            element.addClass('animated');
                        }
                    }

                    playAllAnimations();

                    $('.wallet').fadeTo(0, 1);

                    Navigation.showUI(curProfileMode, curProfileMode);
                }, 10);
            } else {
                //@note: desktop
            }
        }
    }

    //@note: @here: this function will only set it to closed properly, and doesn't
    //take into account the submenus.
    var setMainMenuOpen = function(isMainMenuOpenStatus) {
        if (isMainMenuOpenStatus === false) {
            //$('.wallet .menu,.wallet .dismiss').fadeOut();
			g_JaxxApp.getUI().closeMainMenu();
        }

        specialAction('toggleMainMenuOff', null);
    }

    var tryToOpenExternalLink = function(url)
    {
        console.log('open external link '+ url);
        if(PlatformUtils.desktopCheck()){ //Desktop
            require('electron').remote.shell.openExternal(url);
        }
        else if(PlatformUtils.extensionChromeCheck()){ //Chrome extension
            chrome.tabs.create({ url: url });
        }
        else if(PlatformUtils.mobileAndroidCheck() || PlatformUtils.mobileiOSCheck()){ //Android
            if (window.native && window.native.openExternalURL) {
                native.openExternalURL(url);
            }
        }
        else{//@TODO
            console.log("Not supported yet for this platform");
        }
    }


    var tryToOpenExternalLinkMobile = function(event){
        var urlToOpen = event.data.param1;
        Navigation.tryToOpenExternalLink(urlToOpen);
    }

    var setProfileMode = function(newProfileMode) {
        console.log("switch to profile mode :: " + newProfileMode);
        canUpdateWalletUI = false;

        //        Navigation.hideUI(curProfileMode, newProfileMode, function () {
        Navigation.hideUI(curProfileMode, newProfileMode, function () {
            completeSwitchToProfileMode(newProfileMode)
        }, false);
    }

    var showEthereumAdvancedMode = function() {
        ethereumAdvancedModeHidden = false;
        //        $('.tabContent .advancedTabContentEthereum').show();
        $('.advancedBtnImage').attr('src', 'img/Icon_up.svg');

        $('.tabContent .advancedTabContentEthereum').slideDown();
    }

    var hideEthereumAdvancedMode = function() {
        ethereumAdvancedModeHidden = true;
        $('.advancedBtnImage').attr('src', 'img/Icon_down.svg');
        $('.tabContent .advancedTabContentEthereum').slideUp(700, function() {
            $('.tabContent .advancedTabContentEthereum').hide();
        });
    }

    var ethereumAdvancedModeHidden = function() {
        return ethereumAdvancedModeHidden;
    }

    var setEthereumAdvancedModeCustomGasLimitSuggestion = function(customGasLimit, addressTypeName) {
        if (customGasLimit > 0) {
            $('.gasLimitSuggestion').text("Suggested for this " + addressTypeName + ": " + customGasLimit);
        } else {
            $('.gasLimitSuggestion').text("(No valid address entered)");
        }
    }

    var showEthereumLegacySweep = function(legacyEthereumBalance) {
        console.log("[ethereum] :: loaded legacy wallet support :: hasGlitchedLegacyEthereumWallet :: " + wallet.hasGlitchedLegacyEthereumWallet());

        $('.ethereumLegacySweepEtherAmount').text(HDWalletHelper.convertWeiToEther(legacyEthereumBalance) + " ETH");

        $('.ethereumLegacySweepTXCost').text(HDWalletHelper.convertWeiToEther(HDWalletHelper.getDefaultEthereumGasLimit().mul(HDWalletHelper.getDefaultEthereumGasPrice()).toString()) + " ETH");

        $('.ethereumLegacySweepConfirmButton').off('click');

        $('.ethereumLegacySweepConfirmButton').on('click', function() {
            wallet.transferLegacyEthereumAccountToHDNode();
            Navigation.closeModal();
        });

        Navigation.openModal('ethereumLegacySweepModal');
    }

    var toggleCurrency = function(pCurrency, pEnabled){
        //Parameters: pEnabled is optional.
        console.log("Toggling currency Currency: " + pCurrency + " Enabled: " + pEnabled);
        if (typeof pEnabled === 'undefined') {
            // In this case we remove the currency if it is in the list and add it to the list if it is not there.
            if ($.inArray(pCurrency, _currenciesEnabled) > -1) {
                pEnabled = false;
            } else {
                pEnabled = true;
            }
        }
        if (pEnabled && (!$.inArray(pCurrency, _currenciesEnabled) > -1)){
            // Run this if block if the user ticked the box.
            console.log("Adding currency " + pCurrency);
            _currenciesEnabled.push(pCurrency);
            wallet.getHelper().setFiatUnit(pCurrency);
            $(".exchangeRateList").find('[value='+pCurrency+']').addClass('cssOrangeHighlightText'); // Set currency block to orange F27221.

            $(".exchangeRateList").find('[value='+pCurrency+']').find('.cssSelectedCurrency').find('.cssCircleUnchecked').css('border', 'none');
            $(".exchangeRateList").find('[value='+pCurrency+']').find('.cssSelectedCurrency').find('.cssCircleUnchecked').addClass('cssCurrencyisChecked');
            //            $(".exchangeRateList").find('[value='+pCurrency+']').find('.cssSelectedCurrency').find('.circle-checked').css('border', 'none');

            _currenciesEnabled.sort();
        } else if (!pEnabled && ($.inArray(pCurrency , _currenciesEnabled) > -1)){
            if (_currenciesEnabled.length > 1){
                // Now set the default currency to the most recent element pushed to _currenciesEnabled.

                // Run this if block if the user unticked the box.
                var index = _currenciesEnabled.indexOf(pCurrency);
                if (index > -1) {
                    _currenciesEnabled.splice(index, 1);
                    if (pCurrency === wallet.getHelper().getFiatUnit()){
                        wallet.getHelper().setFiatUnit(_currenciesEnabled[0]); // Set fiat currency to most recently chosen currency.
                    }
                }
                $(".exchangeRateList").find('[value='+pCurrency+']').removeClass('cssOrangeHighlightText'); // Set currency block to orange F27221.

                $(".exchangeRateList").find('[value='+pCurrency+']').find('.cssSelectedCurrency').find('.cssCircleUnchecked').css('border', '1px solid white');
                $(".exchangeRateList").find('[value='+pCurrency+']').find('.cssSelectedCurrency').find('.cssCircleUnchecked').removeClass('cssCurrencyisChecked');

            } else { // The user has tried to deselect the only selected currency.
                // Navigation.flashBanner("You must have at least one currency selected.", 5)
            }
        }

        if (Navigation.isUseFiat()) {
            $('.unitToggle .symbol').text(wallet.getHelper().getFiatUnitPrefix());
        }

        if (_currenciesEnabled.length <= 1) {
            $(".displayCurrenciesSelectedArrow").hide();
        } else {
            $(".displayCurrenciesSelectedArrow").show();
        }

        // Set currencies menu element here 
        g_JaxxApp.getUI().updateSettingsUI();
        updateWalletUI();

        // @Note: Navigation.getCurrencies()
        storeData('currencies_selected', JSON.stringify(_currenciesEnabled));

    }

    var isCurrencyEnabled = function(pCurrency){
        if ($.inArray(pCurrency, _currenciesEnabled) > -1){
            return true;
        }
        return false;
    }

    var getEnabledCurrencies = function(){
        return _currenciesEnabled;
    }

    return {

        // Modal
        openModal: openModal,
        closeModal: closeModal,

        // @note: Switching coins
        clearInputFields: clearInputFields,

        // Using Fiat vs. Bitcoin for units
        isUseFiat: isUseFiat,
        setUseFiat: setUseFiat,
        toggleUseFiat: toggleUseFiat,

        // Tabs
        getTab: getTab,
        collapseTabs: collapseTabs,
        showTab: showTab,
        toggleTab: toggleTab,

        // Settings
        clearSettings: clearSettings,
        pushSettings: pushSettings,
        popSettings: popSettings,

        // Banner
        flashBanner: flashBanner,
        flashBannerMultipleMessages: flashBannerMultipleMessages,

        // @note: ui stuff;
        hideUI: hideUI,
        showUI: showUI,

        // @note: Returning to default view
        returnToDefaultView: returnToDefaultView,
        hideTransactionHistoryDetails: hideTransactionHistoryDetails,

        // @note: clearing input fields
        clearInputFields: clearInputFields,

        //@note: for setting up coin-specific ui elements.
        setupCoinUI: setupCoinUI,

        // @note: ethereum secret selector
        ethereumSecretSelectorActivate: ethereumSecretSelectorActivate,

        // @note: currency spinners
        showSpinner: showSpinner,
        hideSpinner: hideSpinner,

        // @note: show animations
        startBlit: startBlit,

        // @note: main menu navigation from mobile (Android)
        //setMainMenuOpen: setMainMenuOpen,

        // @note: opening external link support for various platforms
        tryToOpenExternalLink: tryToOpenExternalLink,
        tryToOpenExternalLinkMobile: tryToOpenExternalLinkMobile,

        // @note: profile mode portrait/landscape transition;
        setProfileMode: setProfileMode,

        // @note: ethereum specific features:
        showEthereumAdvancedMode: showEthereumAdvancedMode,
        hideEthereumAdvancedMode: hideEthereumAdvancedMode,
        ethereumAdvancedModeHidden: ethereumAdvancedModeHidden,
        setEthereumAdvancedModeCustomGasLimitSuggestion: setEthereumAdvancedModeCustomGasLimitSuggestion,

        // @note: ethereum legacy sweeping of funds:
        showEthereumLegacySweep: showEthereumLegacySweep,

        // @note: getSettingsStack for getting the stack settings variable when debugging.
        getSettingsStack: getSettingsStack,

        // @note: quick fiat currency selection
        toggleCurrency: toggleCurrency,
        isCurrencyEnabled: isCurrencyEnabled,
        getEnabledCurrencies: getEnabledCurrencies,
    };
})()


function completeSwitchToProfileMode(newProfileMode) {
    switchToProfileMode(newProfileMode);
    Navigation.showUI(curProfileMode, newProfileMode);

    canUpdateWalletUI = true;
    forceUpdateWalletUI();
    resize();
}

function parseJaxxToken(jaxxToken, callback) {
    if (!jaxxToken) { return null; }

    // Support all valid entropy sizes (128-bit, 160-bit, 192-bit, 224-bit, 256-bit)
    if (!jaxxToken.match(/^jaxx:[0-9a-f]{32,64}\/[0-9a-zA-Z]*$/) && ((jaxxToken.length - 5) % 8) == 0) {
        console.log("No match: " + jaxxToken);
        return null;
    }

    jaxxToken = jaxxToken.substring(5);

    var comps = jaxxToken.split('/');
    var mnemonicEncrypted = g_Vault.encryptSimple(thirdparty.bip39.entropyToMnemonic(comps[0]));


    var newWallet = new HDWalletMain();
    newWallet.initialize();

    //    var mnemonicEncrypted = getStoredData('mnemonic', false);

    newWallet.setupWithEncryptedMnemonic(mnemonicEncrypted, function(err) {
        if (err) {
            console.log("parseJaxxToken :: error :: " + err);
            callback(err, null);
        } else {
            //            console.log("parseJaxxToken :: wallet :: " + wallet + " :: " + wallet.getMnemonic() + " :: getRootNodeAddress :: " + wallet.getPouchFold(COIN_BITCOIN).getRootNodeAddress() + " :: comps[1] :: " + comps[1]);
            if (newWallet.getPouchFold(COIN_BITCOIN).getRootNodeAddress() !== comps[1]) {
                var errStr = "root node doesn't match";
                console.log("parseJaxxToken :: error :: " + errStr);
                callback(err, null);
            } else {
                callback(null, newWallet);
            }
        }
    });
}

function setupBackupPrivateKeys(coinType) {
    var accounts = wallet.getPouchFold(coinType).getAccountList();

    g_JaxxApp.getUI().updateAccountList(coinType, accounts);

    if (coinType === COIN_BITCOIN) {
    } else if (coinType === COIN_ETHEREUM) {
        setupEthereumLegacyLightwalletKeypairDisplay();
    }
}

function setupEthereumLegacyLightwalletKeypairDisplay() {
    //    console.log("setupEthereumLegacyLightwalletKeypairDisplay");
    var ethereumLegacyLightwalletAccount = wallet.getEthereumLegacyLightwalletAccount();
    //            var ethereumLegacyStableKeypair = wallet.getEthereumLegacyStableKeypair();

    if (ethereumLegacyLightwalletAccount !== null) {
        g_JaxxApp.getUI().setupEthereumLegacyKeypairDisplay(ethereumLegacyLightwalletAccount);

        $('.backupPrivateKeyListETHLegacyLightwallet').text(ethereumLegacyLightwalletAccount.pubAddr + ", " + ethereumLegacyLightwalletAccount.pvtKey);
        if (wallet.hasGlitchedLegacyEthereumWallet()) {
            $('.backupPrivateKeyListETHLegacyWarning').show();
        } else {
            $('.backupPrivateKeyListETHLegacyWarning').hide();
        }
    } else {
        if (wallet.getHasSetupLegacyEthereumSweep()) {
            $('.backupPrivateKeyListETHLegacyLightwallet').text("We're having trouble detecting your non-HD keypair. Please attempt a Cache Reset (see Tools).");
            $('.backupPrivateKeyListETHLegacyWarning').hide();
        } else {
            //            console.log("force lightwallet load");
            $('.accountDataEthereumLegacyKeypair .accountPublicAddress').text("Please wait a moment while we load the previous wallet path.");
            $('.accountDataEthereumLegacyKeypair .accountPrivateKey').text("");
            $('.accountDataEthereumLegacyKeypair .accountBalance').text("");

            wallet.setShouldSetUpLegacyEthereumSweep(setupEthereumLegacyLightwalletKeypairDisplay, setupEthereumLegacyLightwalletKeypairDisplay);
            $('.backupPrivateKeyListETHLegacyLightwallet').text("Please wait a moment while we load the previous wallet path.");
            $('.backupPrivateKeyListETHLegacyWarning').hide();
        }
    }
}

function setupExportPrivateKeys(coinType) {
    var csvExportField = HDWalletPouch.getStaticCoinPouchImplementation(coinType).uiComponents["csvExportField"];

    var printStr = wallet.getAddressesAndKeysCSVForCoinType(coinType);

    $(csvExportField).text(printStr);
}


//@note: returns the detected coin type.
function checkAndSetupSendScan(uri, targetCoinType) {
    var parsed = HDWalletHelper.parseURI(uri);

    // Invalid
    if (!parsed) { return -1; }

    // Are we the type of coin we expect?
    var baseCoinFormatAddressType = {bitcoin: COIN_BITCOIN, 'ether': COIN_ETHEREUM, 'dash': COIN_DASH, 'litecoin': COIN_LITECOIN, 'lisk': COIN_LISK, 'zcash': COIN_ZCASH}[parsed.coin];

    console.log("checkAndSetupSendScan :: " + JSON.stringify(parsed) + " :: baseCoinFormatAddressType :: " + baseCoinFormatAddressType + " :: targetCoinType :: " + targetCoinType);
    
    if (typeof(targetCoinType) !== 'undefined') {
        if (wallet.getPouchFold(targetCoinType).getBaseCoinAddressFormatType() !== baseCoinFormatAddressType) {
            return -1;
        }
    }

    // Fill in the UI
    $('.tabContent .address input').val(parsed.address).trigger('keyup');
    if (parsed.amount) {
        $('.tabContent .amount input').val(parsed.amount).trigger('keyup');
    }

    return baseCoinType;
}

function checkSendScan(uri) {
    var parsed = HDWalletHelper.parseURI(uri);

    // Invalid
    if (!parsed) { return -1; }

    return {bitcoin: COIN_BITCOIN, 'ether': COIN_ETHEREUM, 'dash': COIN_DASH, 'litecoin': COIN_LITECOIN, 'lisk': COIN_LISK, 'zcash': COIN_ZCASH}[parsed.coin];
}

function prepareSweepTxCallback(error, info) {
    // This is called when:
    // The user enters their private key and then hits 'Next'.
    if (error) {
        console.log('Sweep error: ' + error.message);
        Navigation.clearSettings();
        Navigation.closeModal();
        g_JaxxApp.getUI().closeMainMenu();

        Navigation.flashBanner('Insufficient Balance', 5);
    } else if (info) {
        var coinAbbreviatedName = HDWalletPouch.getStaticCoinPouchImplementation(curCoinType).pouchParameters['coinAbbreviatedName'];
        
        $('.settings.confirmSweepPrivateKey .amount').text(info.totalValue + coinAbbreviatedName);
        $('.settings.confirmSweepPrivateKey .button').data('transaction', info.signedTransaction);
        $('.settings.confirmSweepPrivateKey .button').addClass('enabled').addClass('cssEnabled');
        $('.settings.confirmSweepPrivateKey .button').show();
    } else {
        $('.settings.confirmSweepPrivateKey .amount').text('Nothing to sweep');
        $('.settings.confirmSweepPrivateKey .button').hide();
    }
    $('.settings.confirmSweepPrivateKey .spinner').hide();
}

function sendTransaction() {
    var now = Math.floor(new Date().getTime()/1000);
    if (Math.abs(now-lastSentTimestampSeconds) > 2){ //force two seconds before sending next tx
        lastSentTimestampSeconds = Math.floor(new Date().getTime()/1000);

        //        if (data.transaction) {
        //            console.log("data.transaction :: " + JSON.stringify(data.transaction));
        //        } else if (data.txArray) {
        //            for (var i = 0; i < data.txArray.length; i++) {
        //                console.log("data.txArray[" + i + "] :: " + JSON.stringify(data.txArray[i].hash));
        //            }
        //        }


        //        return;

        //@note: @todo: this should be handled through control logic instead of a data parameter on a jquery object.
        
        var data = $('.modal.send').data('transaction');
        if (data) {
            if (curCoinType === COIN_BITCOIN) {
                wallet.getPouchFold(curCoinType).getPouchFoldImplementation().sendBitcoinTransaction(data.transaction, function(response, tx) {
                    if (response.status == 'success' || response == 'success') {
                        $('.tabContent .address input').val('');
                        $('.tabContent .amount input').val('').trigger('keyup');

                        playSound("snd/balance.wav", null, null);
                        Navigation.flashBanner('Successfully Sent', 5);

                        //                        g_JaxxApp.getTXManager().addTXOfType(g_JaxxApp.getTXManager().getCurrentTXType(), COIN_BITCOIN, data.transaction.hash);
                        Navigation.returnToDefaultView();
                        Navigation.hideTransactionHistoryDetails();
                    } else {
                        Navigation.flashBanner('Error: ' + response.message, 5);
                        console.log('Error', response.message);
                    }

                    //@note: @here: always update the tx history for sends.
                    forceUpdateWalletUI();
                });
            } else if (curCoinType === COIN_ETHEREUM) {
                g_JaxxApp.getTXManager().sendEthereumLikeTXList(COIN_ETHEREUM, data, function(result) {
                    console.log("sendTransaction :: result :: " + result);
                    if (result === 'success') {
                        $('.tabContent .address input').val('');
                        $('.tabContent .amount input').val('').trigger('keyup');

                        playSound("snd/balance.wav", null, null);
                        Navigation.flashBanner('Successfully Sent', 5);

                        for (var i = 0; i < data.txArray.length; i++) {
                            //@note: @here: @next: tx members.
                            //                                    g_JaxxApp.getTXManager().addTXOfType(g_JaxxApp.getTXManager().getCurrentTXType(), COIN_ETHEREUM, data.txArray[i].hash);
                        }

                        Navigation.returnToDefaultView();
                        Navigation.hideTransactionHistoryDetails();
                    } else if (result === 'failure') {
                        //@note: all of the batch failed:
                        Navigation.flashBanner('Error: ' + status, 5);
                        console.log('Error', status);
                    } else { //@note: partial failure.
                        //@note: some of the batch succeeded, some failed:

                        $('.tabContent .address input').val('');
                        $('.tabContent .amount input').val('').trigger('keyup');

                        playSound("snd/balance.wav", null, null);
                        Navigation.flashBanner('Batch Transaction: Some Failed', 5);

                        Navigation.returnToDefaultView();
                        Navigation.hideTransactionHistoryDetails();
                    }

                    //@note: @here: always update the tx history for sends.
                    forceUpdateWalletUI();
                });
            } else if (curCoinType === COIN_ETHEREUM_CLASSIC) {
                g_JaxxApp.getTXManager().sendEthereumLikeTXList(COIN_ETHEREUM_CLASSIC, data, function(result) {
                    console.log("sendTransaction :: result :: " + result);
                    if (result === 'success') {
                        $('.tabContent .address input').val('');
                        $('.tabContent .amount input').val('').trigger('keyup');

                        playSound("snd/balance.wav", null, null);
                        Navigation.flashBanner('Successfully Sent', 5);

                        for (var i = 0; i < data.txArray.length; i++) {
                            //@note: @here: @next: tx members.
                            //                                    g_JaxxApp.getTXManager().addTXOfType(g_JaxxApp.getTXManager().getCurrentTXType(), COIN_ETHEREUM, data.txArray[i].hash);
                        }

                        Navigation.returnToDefaultView();
                        Navigation.hideTransactionHistoryDetails();
                    } else if (result === 'failure') {
                        //@note: all of the batch failed:
                        Navigation.flashBanner('Error: ' + status, 5);
                        console.log('Error', status);
                    } else { //@note: partial failure.
                        //@note: some of the batch succeeded, some failed:

                        $('.tabContent .address input').val('');
                        $('.tabContent .amount input').val('').trigger('keyup');

                        playSound("snd/balance.wav", null, null);
                        Navigation.flashBanner('Batch Transaction: Some Failed', 5);

                        Navigation.returnToDefaultView();
                        Navigation.hideTransactionHistoryDetails();
                    }

                    //@note: @here: always update the tx history for sends.
                    forceUpdateWalletUI();
                });
            } else if (curCoinType === COIN_THEDAO_ETHEREUM ||
                       curCoinType === COIN_AUGUR_ETHEREUM ) {
                g_JaxxApp.getTXManager().sendEthereumLikeTXList(COIN_ETHEREUM, data, function(result) {
                    console.log("sendTransaction :: result :: " + result);
                    if (result === 'success') {
                        $('.tabContent .address input').val('');
                        $('.tabContent .amount input').val('').trigger('keyup');

                        playSound("snd/balance.wav", null, null);
                        Navigation.flashBanner('Successfully Sent', 5);

                        for (var i = 0; i < data.txArray.length; i++) {
                            //@note: @here: @next: tx members.
                            //                                    g_JaxxApp.getTXManager().addTXOfType(g_JaxxApp.getTXManager().getCurrentTXType(), COIN_THEDAO_ETHEREUM, data.txArray[i].hash);
                        }

                        Navigation.returnToDefaultView();
                        Navigation.hideTransactionHistoryDetails();
                    } else if (result === 'failure') {
                        //@note: all of the batch failed:
                        Navigation.flashBanner('Error: ' + status, 5);
                        console.log('Error', status);
                    } else { //@note: partial failure.
                        //@note: some of the batch succeeded, some failed:
                        $('.tabContent .address input').val('');
                        $('.tabContent .amount input').val('').trigger('keyup');

                        playSound("snd/balance.wav", null, null);
                        Navigation.flashBanner('Batch Transaction: Some Failed', 5);

                        Navigation.returnToDefaultView();
                        Navigation.hideTransactionHistoryDetails();
                    }

                    //@note: @here: always update the tx history for sends.
                    forceUpdateWalletUI();
                });
            } else if (curCoinType === COIN_DASH) {
                //@note: @todo: @here: @next:
                wallet.getPouchFold(curCoinType).getPouchFoldImplementation().sendDashTransaction(data.transaction, function(response, tx) {

                    if (response.status == 'success' || response == 'success') {
                        $('.tabContent .address input').val('');
                        $('.tabContent .amount input').val('').trigger('keyup');

                        playSound("snd/balance.wav", null, null);
                        Navigation.flashBanner('Successfully Sent', 5);

                        //                        g_JaxxApp.getTXManager().addTXOfType(g_JaxxApp.getTXManager().getCurrentTXType(), COIN_BITCOIN, data.transaction.hash);
                        Navigation.returnToDefaultView();
                        Navigation.hideTransactionHistoryDetails();
                    } else {
                        Navigation.flashBanner('Error: ' + response.message, 5);
                        console.log('Error', response.message);
                    }

                    //@note: @here: always update the tx history for sends.
                    forceUpdateWalletUI();
                });
            } else if (curCoinType === COIN_LITECOIN) {
                //@note: @todo: @here: @next:
                wallet.getPouchFold(curCoinType).getPouchFoldImplementation().sendLitecoinTransaction(data.transaction, function(response, tx) {

                    if (response.status == 'success' || response == 'success') {
                        $('.tabContent .address input').val('');
                        $('.tabContent .amount input').val('').trigger('keyup');

                        playSound("snd/balance.wav", null, null);
                        Navigation.flashBanner('Successfully Sent', 5);

                        //                        g_JaxxApp.getTXManager().addTXOfType(g_JaxxApp.getTXManager().getCurrentTXType(), COIN_BITCOIN, data.transaction.hash);
                        Navigation.returnToDefaultView();
                        Navigation.hideTransactionHistoryDetails();
                    } else {
                        Navigation.flashBanner('Error: ' + response.message, 5);
                        console.log('Error', response.message);
                    }

                    //@note: @here: always update the tx history for sends.
                    forceUpdateWalletUI();
                });
            } else if (curCoinType === COIN_LISK) {
                //@note: @todo: @lisk:
//                wallet.getPouchFold(curCoinType).getPouchFoldImplementation().sendLitecoinTransaction(data.transaction, function(response, tx) {
//
//                    if (response.status == 'success' || response == 'success') {
//                        $('.tabContent .address input').val('');
//                        $('.tabContent .amount input').val('').trigger('keyup');
//
//                        playSound("snd/balance.wav", null, null);
//                        Navigation.flashBanner('Successfully Sent', 5);
//
//                        //                        g_JaxxApp.getTXManager().addTXOfType(g_JaxxApp.getTXManager().getCurrentTXType(), COIN_BITCOIN, data.transaction.hash);
//                        Navigation.returnToDefaultView();
//                        Navigation.hideTransactionHistoryDetails();
//                    } else {
//                        Navigation.flashBanner('Error: ' + response.message, 5);
//                        console.log('Error', response.message);
//                    }
//
//                    //@note: @here: always update the tx history for sends.
//                    forceUpdateWalletUI();
//                });
            } else if (curCoinType === COIN_ZCASH) {
                //@note: @todo: @here: @next:
                wallet.getPouchFold(curCoinType).getPouchFoldImplementation().sendZCashTransaction(data.transaction, function(response, tx) {

                    if (response.status == 'success' || response == 'success') {
                        $('.tabContent .address input').val('');
                        $('.tabContent .amount input').val('').trigger('keyup');

                        playSound("snd/balance.wav", null, null);
                        Navigation.flashBanner('Successfully Sent', 5);

                        //                        g_JaxxApp.getTXManager().addTXOfType(g_JaxxApp.getTXManager().getCurrentTXType(), COIN_BITCOIN, data.transaction.hash);
                        Navigation.returnToDefaultView();
                        Navigation.hideTransactionHistoryDetails();
                    } else {
                        Navigation.flashBanner('Error: ' + response.message, 5);
                        console.log('Error', response.message);
                    }

                    //@note: @here: always update the tx history for sends.
                    forceUpdateWalletUI();
                });
            } else if (curCoinType === COIN_TESTNET_ROOTSTOCK) {
                g_JaxxApp.getTXManager().sendEthereumLikeTXList(COIN_TESTNET_ROOTSTOCK, data, function(result) {
                    console.log("sendTransaction :: result :: " + result);
                    if (result === 'success') {
                        $('.tabContent .address input').val('');
                        $('.tabContent .amount input').val('').trigger('keyup');

                        playSound("snd/balance.wav", null, null);
                        Navigation.flashBanner('Successfully Sent', 5);

                        for (var i = 0; i < data.txArray.length; i++) {
                            //@note: @here: @next: tx members.
                            //                                    g_JaxxApp.getTXManager().addTXOfType(g_JaxxApp.getTXManager().getCurrentTXType(), COIN_ETHEREUM, data.txArray[i].hash);
                        }

                        Navigation.returnToDefaultView();
                        Navigation.hideTransactionHistoryDetails();
                    } else if (result === 'failure') {
                        //@note: all of the batch failed:
                        Navigation.flashBanner('Error: ' + status, 5);
                        console.log('Error', status);
                    } else { //@note: partial failure.
                        //@note: some of the batch succeeded, some failed:

                        $('.tabContent .address input').val('');
                        $('.tabContent .amount input').val('').trigger('keyup');

                        playSound("snd/balance.wav", null, null);
                        Navigation.flashBanner('Batch Transaction: Some Failed', 5);

                        Navigation.returnToDefaultView();
                        Navigation.hideTransactionHistoryDetails();
                    }

                    //@note: @here: always update the tx history for sends.
                    forceUpdateWalletUI();
                });
            }
        }
    }
    else{
        console.log("Already sending another tx. Please wait a few seconds");
    }
}

function specialAction(actionName, element) {
    if (typeof(ethereumUnlocked) === 'undefined' || ethereumUnlocked === null || ethereumUnlocked === false) {
        if (actionName !== 'refresh' && ethereumSecretProgress !== 4) {
            ethereumSecretProgress = 0;
        }
    }

    if (actionName === 'walletSendReceive') {
        if ($('.tabContent .amount .button').hasClass('enabled')) {
            var coinAbbreviatedNameCur = HDWalletPouch.getStaticCoinPouchImplementation(curCoinType).pouchParameters['coinAbbreviatedName'];

            var tab = Navigation.getTab();
            var data = $('.modal.send').data('transaction');
            if (tab === 'send' && data) {
                if (g_JaxxApp.getShapeShiftHelper().getIsTriggered()) {
                    // @TODO: add fiat converted amount
                    //                    $('.modal.send .address').text(data.address);

                    var receiveCoinType = g_JaxxApp.getShapeShiftHelper().getReceivePairForCoinType(curCoinType);

                    if (Navigation.isUseFiat()) {
                        $('.modal.shift .amountAbbreviatedNameSend').text(wallet.getHelper().getFiatUnit());
                    } else {
                        $('.modal.shift .amountAbbreviatedNameSend').text(coinAbbreviatedNameCur);
                    }

                    var coinAbbreviatedNameReceive = HDWalletPouch.getStaticCoinPouchImplementation(receiveCoinType).pouchParameters['coinAbbreviatedName'];
                    
                    $('.modal.shift .amountAbbreviatedNameReceive').text(coinAbbreviatedNameReceive);

                    var miningAbbreviatedName = coinAbbreviatedNameCur;

                    if (wallet.getPouchFold(curCoinType).isTokenType() === true) {
                        miningAbbreviatedName = HDWalletPouch.getStaticCoinPouchImplementation(CoinToken.getMainTypeToTokenCoinHolderTypeMap(curCoinType)).pouchParameters['coinAbbreviatedName'];
                    }

                    $('.modal.shift .miningFeeAbbreviatedName').text(miningAbbreviatedName);


                    var scaledAmountSend = HDWalletHelper.getCoinDisplayScalar(curCoinType, data.coinAmount_unitLarge, Navigation.isUseFiat());

                    var marketData = g_JaxxApp.getShapeShiftHelper().getMarketForCoinTypeSend(curCoinType);

                    var receiveScalar = 1.0;
                    if (curCoinType === COIN_THEDAO_ETHEREUM) {
                        receiveScalar = 100;
                    }

                    var scaledAmountReceive = receiveScalar * marketData.exchangeRate * data.coinAmount_unitLarge;
                    
                    if (Navigation.isUseFiat()){
                        scaledAmountReceive = wallet.getPouchFold(curCoinType).convertFiatToCoin(scaledAmountReceive, COIN_UNITLARGE);
                    }
                    //                    HDWalletHelper.getCoinDisplayScalar(receiveCoinType, marketData.exchangeRate * data.coinAmount_unitLarge, false);

                    $('.modal.shift .amountSend').text(scaledAmountSend);
                    $('.modal.shift .amountReceive').text(scaledAmountReceive);

                    g_JaxxApp.getTXManager().setCurrentTXType(TX_SHAPESHIFT);
                    g_JaxxApp.getUI().showShiftModal();
                } else {
                    // @TODO: add fiat converted amount
                    var coinAbbreviatedName = HDWalletPouch.getStaticCoinPouchImplementation(curCoinType).pouchParameters['coinAbbreviatedName'];
                    
                    $('.modal.send .address').text(data.address);

                    if (Navigation.isUseFiat()) {
                        $('.modal.send .amountAbbreviatedName').text(wallet.getHelper().getFiatUnit());
                    } else {
                        $('.modal.send .amountAbbreviatedName').text(coinAbbreviatedName);
                    }

                    var miningAbbreviatedName = coinAbbreviatedName;

                    if (wallet.getPouchFold(curCoinType).isTokenType() === true) {
                        miningAbbreviatedName = HDWalletPouch.getStaticCoinPouchImplementation(CoinToken.getMainTypeToTokenCoinHolderTypeMap(curCoinType)).pouchParameters['coinAbbreviatedName'];
                    }

                    $('.modal.send .miningFeeAbbreviatedName').text(miningAbbreviatedName);


                    var scaledAmount = HDWalletHelper.getCoinDisplayScalar(curCoinType, data.coinAmount_unitLarge, Navigation.isUseFiat());

                    if (Navigation.isUseFiat() && curCoinType === COIN_THEDAO_ETHEREUM) {
                        scaledAmount *= 100;
                    }


                    $('.modal.send .amount').text(scaledAmount);

                    g_JaxxApp.getTXManager().setCurrentTXType(TX_GENERIC);
                    g_JaxxApp.getUI().showSendModal();
                }
            } else if (tab === 'receive' && data) {
                var qrCodeImage = null;

                var coinAmountSmallType = 0;

                if (Navigation.isUseFiat()) {
                    //            console.log("fiat");
                    coinAmountSmallType = wallet.getPouchFold(curCoinType).convertFiatToCoin(data.coinAmount_unitLarge, COIN_UNITLARGE);
                } else {
                    //            console.log("not fiat");
                    coinAmountSmallType = data.coinAmount_unitLarge;
                }

                var scaledAmount = HDWalletHelper.getCoinDisplayScalar(curCoinType, coinAmountSmallType, Navigation.isUseFiat());

                qrCodeImage = wallet.getPouchFold(curCoinType).generateQRCode(true, scaledAmount);

                if (qrCodeImage != null) {
                    if (Navigation.isUseFiat()) {
                        $('.modal.receive .amountAbbreviatedName').text(wallet.getHelper().getFiatUnit());
                    } else {
                        $('.modal.receive .amountAbbreviatedName').text(coinAbbreviatedNameCur);
                    }

                    var scaledAmount = HDWalletHelper.getCoinDisplayScalar(curCoinType, data.coinAmount_unitLarge, Navigation.isUseFiat());

                    $('.modal.receive .amount').text(scaledAmount);

                    $(".modal.receive .qrCode img").attr("src", qrCodeImage);

                    Navigation.openModal('receive');
                } else {
                    console.log("!! error :: could not create qr code for :: " + coinAbbreviatedNameCur + " !!");
                }
            }
        }

    } else if (actionName === 'refresh') {
        if (typeof(ethereumUnlocked) === 'undefined' || ethereumUnlocked === null || ethereumUnlocked === false) {
            if (ethereumSecretProgress < 2) {
                ethereumSecretProgress++;
            }
        }
        
        var coinFullName = HDWalletPouch.getStaticCoinPouchImplementation(curCoinType).uiComponents['coinFullName'];
        
        console.log("[ Wallet Update :: " + coinFullName + " ]");

        wallet.getPouchFold(curCoinType).refresh();

        $('.refresh').addClass('cssActive');
        setTimeout(function () {
            $('.refresh').removeClass('cssActive');
        }, 400);

    } else if (actionName === 'spendableMaxButtonPressed') {
        var coinBalance = 0; 
        var minimumSpendable = 0;

        if (g_JaxxApp.getShapeShiftHelper().getIsTriggered()) {
            var marketMinimum = g_JaxxApp.getShapeShiftHelper().getMarketMinimumForCoinTypeSend(curCoinType);

            if (typeof(marketMinimum) !== 'undefined' && marketMinimum !== null) {
                minimumSpendable = parseInt(HDWalletHelper.convertCoinToUnitType(curCoinType, marketMinimum, COIN_UNITSMALL));

                if (curCoinType === COIN_THEDAO_ETHEREUM) {
                    minimumSpendable /= 100;
                }
            }
        }

        if (minimumSpendable > 0) {
            coinBalance = wallet.getPouchFold(curCoinType).getSpendableBalance(minimumSpendable);
        } else {
            coinBalance = wallet.getPouchFold(curCoinType).getSpendableBalance();
        }

        if (Navigation.isUseFiat()) {
            //            console.log("convertCoinToFiat(coinBalance, COIN_UNITSMALL) :: " + convertCoinToFiat(coinBalance, COIN_UNITSMALL, true).substr(1));
            if (HDWalletHelper.convertCoinToUnitType(curCoinType, coinBalance, COIN_UNITLARGE) != 0) {
                var fiatAmount = wallet.getHelper().convertCoinToFiatWithFiatType(curCoinType, coinBalance, COIN_UNITSMALL, null, true);
                
                var spendableFiatScaled = fiatAmount;

                //                console.log("spendableFiatScaled :: " + spendableFiatScaled);
                populateSpendMax(HDWalletHelper.getCoinDisplayScalar(curCoinType, spendableFiatScaled, true));
            }
        } else {
            if (HDWalletHelper.convertCoinToUnitType(curCoinType, coinBalance, COIN_UNITLARGE) != 0) {
                var spendableCoinScaled = HDWalletHelper.getCoinDisplayScalar(curCoinType, HDWalletHelper.convertCoinToUnitType(curCoinType, coinBalance, COIN_UNITLARGE));

                spendableCoinScaled = parseFloat(parseFloat(spendableCoinScaled).toFixed(8));

                populateSpendMax(spendableCoinScaled);
            }
        }

        $('.tabContent .amount input').trigger('keyup');
    } else if (actionName === 'sendConfirm') {
        Navigation.closeModal();

        if (g_JaxxApp.getUser().hasPin()) {
            g_JaxxApp.getUI().showEnterPinModal(function(error) {
                if (error) {
                    console.log("enter pin error :: " + error);
                } else {
                    sendTransaction();
                }
            });
        } else {
            sendTransaction();
        }
    } else if (actionName === "createWallet") {
        //@note: ignore existing architecture and use js side securerandom.

        setTimeout(function() {
            var mnemonicEncrypted = g_Vault.encryptSimple(thirdparty.bip39.generateMnemonic());

            loadFromEncryptedMnemonic(mnemonicEncrypted, function(err, wallet) {
                if (err) {
                    console.log("createWallet :: error :: " + err);
                    console.log('Failed To Create HD Wallet');
                } else {
                    storeData('mnemonic', wallet.getMnemonic(),true);

                    Navigation.flashBanner("Successfully Created HD Wallet!", 5);
                    Navigation.flashBannerMultipleMessages(['Back up your wallet', 'Go to Tools > Display Backup Phrase'], 10);

                    Navigation.startBlit();

                    setTimeout(function() {
                        if (PlatformUtils.extensionChromeCheck()) {

                        } else if (PlatformUtils.extensionFirefoxCheck()) {
                            Navigation.openModal('firefoxWarningPopupFirstFrame');
                        }
                    }, 500);

                    removeStoredData('fiat');
                }
            });

            Navigation.closeModal();
            Navigation.startBlit();
        }, 1000);


        // Clean up.
        Navigation.clearSettings();
        Navigation.openModal('creatingWallet');
    } else if (actionName === 'scanPayment') {
        if (window.native && window.native.scanCode) {
            var processScan = function(uri) {
                console.log("scanPayment :: found uri :: " + uri);

                var foldMainCoinType = curCoinType;
                
                if (wallet.getPouchFold(curCoinType).isTokenType() === true) {
                    foldMainCoinType = CoinToken.getMainTypeToTokenCoinHolderTypeMap(curCoinType);
                }

                foundCoinType = checkAndSetupSendScan(uri, foldMainCoinType);

                if (foundCoinType === foldMainCoinType) {
                    console.log("scanPayment :: found coin type :: " + foundCoinType);
                }
            };

            Navigation.clearInputFields();
            native.scanCode(processScan);
        }
    } else if (actionName === 'scanPrivateKey') {
        if (window.native && window.native.scanCode) {
            var processScan = function(uri) {
                console.log("scanPrivateKey :: found qr :: " + uri);
                $('#privateKeySweep').val(uri).trigger('keyup');
            };

            $('#privateKeySweep').val('').trigger('keyup');

            Navigation.clearInputFields();

            native.scanCode(processScan);
        }
    } else if (actionName === 'quickVerifyMnemonic.prepare') {
        var words = wallet.getMnemonic().split(' ');
        var index = parseInt(Math.random() * words.length);
        var ordinalIndex = [
            'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth',
            'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth',
            'seventeenth', 'eighteenth','nineteenth', 'twentieth', ' twenty-first', 'twenty-second',
            'twenty-third', 'twenty-fourth'
        ][index];

        var input = $('.settings.quickVerifyMnemonic input');

        input.data('word', words[index]);
        input.attr('placeholder', input.attr('placeholderFormat').replace('%s', ordinalIndex));
        input.val('');

    } else if (actionName === 'viewJaxxToken.prepare') {
        //@note:@todo:@here:
        var uri = "jaxx:" + thirdparty.bip39.mnemonicToEntropy(wallet.getMnemonic()) + '/' + wallet.getPouchFold(COIN_BITCOIN).getRootNodeAddress();
        var qrCodeImage = thirdparty.qrImage.imageSync(uri, {
            type: "png",
            ec_level: "H"
        }).toString('base64');
        $(".settings.viewJaxxToken .jaxxToken img").attr("src", "data:image/png;base64," + qrCodeImage)

    } else if (actionName === 'importMnemonic.import') {
        
        
        g_JaxxApp.getUI().closeMainMenu();
        var mnemonicEncrypted = g_Vault.encryptSimple($(element.attr('targetInput')).val());

        var saveAndRestoreData = {
//            "mnemonic": {data: null, isEncrypted: false},
//            "crypto_currency_position_data": {data: null, isEncrypted: false},
//            "crypto_currency_enabled_data": {data: null, isEncrypted: false},
//            "currencies_position_order": {data: null, isEncrypted: false},
//            "currencies_selected": {data: null, isEncrypted: false},
            "hasShownTermsOfService": {data: null, isEncrypted: false},
        };
        
        for (var curValKey in saveAndRestoreData) {
            var isEncrypted = saveAndRestoreData[curValKey].isEncrypted;
            saveAndRestoreData[curValKey].data = getStoredData(curValKey, isEncrypted);
        }

        clearAllData(); //Clear local storage
        
        for (var curValKey in saveAndRestoreData) {
            var curData = saveAndRestoreData[curValKey].data;
            var isEncrypted = saveAndRestoreData[curValKey].isEncrypted;

            if (typeof(curData) !== 'undefined' && curData !== null) {
                storeData(curValKey, curData, isEncrypted);
            }
        }

        
        $(element.attr('targetInput')).val('') ; //Clear HTML field or it stays there
        setTimeout(function() {
            loadFromEncryptedMnemonic(mnemonicEncrypted, function(err, wallet) {
                if (err) {
                    console.log("importMnemonic.import :: error :: " + err);

                    Navigation.flashBanner("Error on Import Attempt", 5);
                    Navigation.closeModal();
                    Navigation.startBlit();
                } else {
                    storeData('mnemonic', wallet.getMnemonic(),true);

                    Navigation.flashBanner("Successfully Imported!", 5);

                    Navigation.closeModal();
                    Navigation.startBlit();

                    forceUpdateWalletUI();
                }
            });
        }, 1000);
		g_JaxxApp.getUI().hideHamburgerMenu();
        Navigation.clearSettings();
        Navigation.openModal('loading');

    } else if (actionName === 'scanJaxxToken') {
        if (window.native && window.native.scanCode) {
            var processScan = function(jaxxToken) {

                // @TODO: The loading page should be something special, no a modal page. ie. no dismiss; better design; etc.
                setTimeout(function() {
                    parseJaxxToken(jaxxToken, function(err, newWallet) {
                        if (err) {
                            console.log("scanJaxxToken :: error :: " + err);
                        } else {
                            _loadWallet(newWallet);

                            storeData('mnemonic', wallet.getMnemonic(),true);

                            Navigation.flashBanner("Successfully Imported!", 5);

                            Navigation.startBlit();
                        }
                    });

                    Navigation.closeModal();
                }, 3000);
                Navigation.clearSettings();
                Navigation.openModal('loading');
            };

            window.native.scanCode(processScan);
        }

    } else if  (actionName === 'confirmBackup') {
        //@note:@todo:@here:
        console.log("confirmed backup");
        wallet.confirmBackup();
        updateWalletUI();
    } else if (actionName === 'sweepPrivateKey.prepare') {
        var privateKey = $('#privateKeySweep').val();
        
        wallet.getPouchFold(curCoinType).prepareSweepTransaction(privateKey, prepareSweepTxCallback);
        
        var privateKey = $('#privateKeySweep').val('').trigger('keyup');

    } else if (actionName === 'sweepPrivateKey.showDecrypt') {
        if (curCoinType === COIN_BITCOIN ||
            curCoinType === COIN_DASH ||
            curCoinType === COIN_LITECOIN || 
            curCoinType === COIN_ZCASH) {
            loadScript('js/thirdparty/bip38-dist.js', callBackOnLoadBIP38Internal, callBackOnErrLoadBIP38);
        }
    }
    else if (actionName === 'sweepPrivateKey.tryToDecrypt') {
        $('#bip38ProgressDiv').show();
        var pass = $('.settings.sweepPrivateKeyPasswordEntry input').val();
        var pvtkey = $('#privateKeySweep').val();

        var nextSweepPassBehaviours = buttonBehaviours['nextSweepPass'];
        nextSweepPassBehaviours.disableButton();

        setTimeout(function() {
            var unencrypted = "";
            var validResult = false;
            if (curCoinType === COIN_BITCOIN) {
                unencrypted = tryToDecryptBIP38KeySync(pvtkey,pass);
                //currently there is no way to tell if the pass is wrong
                if(isValidBTCPrivateKey(unencrypted)){
                    validResult = true;
                }
            } else if (curCoinType === COIN_ETHEREUM) {
                unencrypted = decryptETHKey(pvtkey,pass);
                if(isValidETHPrivateKey(unencrypted)){
                    validResult= true;
                }
            } else if (curCoinType === COIN_DASH) {
                unencrypted = tryToDecryptBIP38KeySync(pvtkey,pass);
                //currently there is no way to tell if the pass is wrong
                //@note: this should work properly.
                if(isValidBTCPrivateKey(unencrypted, HDWalletPouchDash.networkDefinitions.mainNet)){
                    validResult = true;
                }
            }
            
            $('#bip38ProgressDiv').hide();
            if (validResult === true) {
                //                console.log("valid password :: " + unencrypted);
                $('#privateKeySweep').val(unencrypted);
                specialAction('sweepPrivateKey.prepare');
                Navigation.pushSettings('confirmSweepPrivateKey');
                $('.settings.sweepPrivateKeyPasswordEntry input').val('').trigger('keyup');
            }
            else {
                console.log("invalid password");
                shake($('.nextSweepPass'));
            }

            var nextSweepPassBehaviours = buttonBehaviours['nextSweepPass'];
            nextSweepPassBehaviours.enableButton();

        }, 500); //@@
    }
    else if (actionName === 'sweepPrivateKey.execute') {
        var signedTransaction = $('.settings.confirmSweepPrivateKey .button').data('transaction');

        var callback = function(status, tx) {
            console.log("status :: " + JSON.stringify(status));
            if (status === 'success') {
                Navigation.flashBanner('Successfully Transferred', 5);
            } else {
                Navigation.flashBanner('Error with transfer', 5);
            }
            
            Navigation.clearSettings();
            Navigation.closeModal();
            g_JaxxApp.getUI().closeMainMenu();
        }

        if (curCoinType === COIN_BITCOIN) {
            wallet.getPouchFold(curCoinType).getPouchFoldImplementation().sendBitcoinTransaction(signedTransaction, callback);
        } else if (curCoinType === COIN_ETHEREUM) {
            wallet.getPouchFold(curCoinType).getPouchFoldImplementation().sendEthereumTransaction(signedTransaction, callback, null, -1);
        } else if (curCoinType === COIN_ETHEREUM_CLASSIC) {
            wallet.getPouchFold(curCoinType).getPouchFoldImplementation().sendEthereumTransaction(signedTransaction, callback, null, -1);
        } else if (curCoinType === COIN_DASH) {
            wallet.getPouchFold(curCoinType).getPouchFoldImplementation().sendDashTransaction(signedTransaction, callback);
        } else if (curCoinType === COIN_LITECOIN) {
            wallet.getPouchFold(curCoinType).getPouchFoldImplementation().sendLitecoinTransaction(signedTransaction, callback);
        } else if (curCoinType === COIN_LISK) {
            wallet.getPouchFold(curCoinType).getPouchFoldImplementation().sendLiskTransaction(signedTransaction, callback);
        } else if (curCoinType === COIN_ZCASH) {
            wallet.getPouchFold(curCoinType).getPouchFoldImplementation().sendZCashTransaction(signedTransaction, callback);
        } else if (curCoinType === COIN_TESTNET_ROOTSTOCK) {
            wallet.getPouchFold(curCoinType).getPouchFoldImplementation().sendEthereumTransaction(signedTransaction, callback);
        }
    }
    else if (actionName === 'onename.register') {
        var onename = $(element).data('onename');
        Onename.registerUsername(onename, wallet.getOnenameAddress(), function (error, success) {
            console.log(success, error);
            if (error) {
                console.log('Onename error', error);

            } else {
                wallet.setOnename(onename);

                Navigation.flashBanner('Onename request sent', 5);
                Navigation.clearSettings();
            }
        });

    } else if (actionName === 'scan') {
        //@note: middle camera button functionality
        var processScan = function(uri) {
            console.log("scan :: found uri :: " + uri);
            //@note: check for sending uri
            //@note: @todo: @next

            var foundScanSendCoinType = checkSendScan(uri);

            if (foundScanSendCoinType != -1) {
                console.log("scan send :: found coin type :: " + foundScanSendCoinType);

                switchToCoinType(foundScanSendCoinType, null, function() {
                    Navigation.showTab('send');
                    checkAndSetupSendScan(uri);
                });
            } else if(isValidBTCPrivateKey(uri)){
                //@note: @todo: @next: check this out for dash & other bitcoin-like coins.
                console.log("scan ::  valid private key for BTC :: ");
                wallet.getPouchFold(COIN_BITCOIN).prepareSweepTransaction(uri,prepareSweepTxCallback);

                if(curCoinType!=COIN_BITCOIN){
                    switchToCoinType(COIN_BITCOIN, null, function() {
                        //$('.confirmSweepPrivateKey').show(); //wait before showing import
                        Navigation.pushSettings('confirmSweepPrivateKey');
                    });
                } else {
                    Navigation.pushSettings('confirmSweepPrivateKey');
                    //$('.confirmSweepPrivateKey').show();  //update UI right away
                }
            } else if (isValidBTCPrivateKey(uri, HDWalletPouchDash.networkDefinitions.mainNet)) {
                console.log("scan ::  valid private key for DASH :: ");
                wallet.getPouchFold(COIN_DASH).prepareSweepTransaction(uri,prepareSweepTxCallback);

                if(curCoinType != COIN_DASH){
                    switchToCoinType(COIN_DASH, null, function() {
                        //$('.confirmSweepPrivateKey').show(); //wait before showing import
                        Navigation.pushSettings('confirmSweepPrivateKey');
                    });
                } else {
                    Navigation.pushSettings('confirmSweepPrivateKey');
                    //$('.confirmSweepPrivateKey').show();  //update UI right away
                }
            } else if (isValidBTCPrivateKey(uri, HDWalletPouchLitecoin.networkDefinitions.mainNet)) {
                console.log("scan ::  valid private key for LITECOIN :: ");
                wallet.getPouchFold(COIN_LITECOIN).prepareSweepTransaction(uri,prepareSweepTxCallback);

                if(curCoinType != COIN_LITECOIN){
                    switchToCoinType(COIN_LITECOIN, null, function() {
                        //$('.confirmSweepPrivateKey').show(); //wait before showing import
                        Navigation.pushSettings('confirmSweepPrivateKey');
                    });
                } else {
                    Navigation.pushSettings('confirmSweepPrivateKey');
                    //$('.confirmSweepPrivateKey').show();  //update UI right away
                }
                
                //@note: @here: @lisk:
            } else if (isValidBTCPrivateKey(uri, HDWalletPouchZCash.networkDefinitions.mainNet)) {
                console.log("scan ::  valid private key for ZCASH :: ");
                wallet.getPouchFold(COIN_ZCASH).prepareSweepTransaction(uri,prepareSweepTxCallback);

                if(curCoinType != COIN_ZCASH){
                    switchToCoinType(COIN_ZCASH, null, function() {
                        //$('.confirmSweepPrivateKey').show(); //wait before showing import
                        Navigation.pushSettings('confirmSweepPrivateKey');
                    });
                } else {
                    Navigation.pushSettings('confirmSweepPrivateKey');
                    //$('.confirmSweepPrivateKey').show();  //update UI right away
                }
            } else if (isValidETHPrivateKey(uri)){
                console.log("scan ::  valid private key for ETH :: ");
                wallet.getPouchFold(COIN_ETHEREUM).prepareSweepTransaction(uri,prepareSweepTxCallback);

                if(curCoinType!=COIN_ETHEREUM){
                    switchToCoinType(COIN_ETHEREUM, null, function() {
                        //$('.confirmSweepPrivateKey').show(); //wait before showing import
                        Navigation.pushSettings('confirmSweepPrivateKey');
                    });
                } else {
                    Navigation.pushSettings('confirmSweepPrivateKey');
                }

            } else if(isValidETHAESkey(uri)){
                console.log("scan ::  valid encrypted private key for ETH :: ");
                if(curCoinType!=COIN_ETHEREUM){
                    switchToCoinType(COIN_ETHEREUM, null, function() {
                        $('#privateKeySweep').val(uri).trigger('keyup');
                        Navigation.pushSettings('sweepPrivateKeyPasswordEntry');
                    });
                } else {
                    $('#privateKeySweep').val(uri).trigger('keyup');
                    Navigation.pushSettings('sweepPrivateKeyPasswordEntry');
                }
            } else if(isValidBIP38key(uri)){
                console.log("scan ::  valid encrypted BIP38 private key for BTC :: ");
                loadScript('js/thirdparty/bip38-dist.js', callBackOnLoadBIP38Internal, callBackOnErrLoadBIP38);
                if (curCoinType!=COIN_BITCOIN){
                    switchToCoinType(COIN_BITCOIN, null, function() {
                        $('#privateKeySweep').val(uri).trigger('keyup');
                        Navigation.pushSettings('sweepPrivateKeyPasswordEntry');
                    });
                } else {
                    $('#privateKeySweep').val(uri).trigger('keyup');
                    Navigation.pushSettings('sweepPrivateKeyPasswordEntry');
                }
            } else {
                var jaxxToken = uri;

                parseJaxxToken(jaxxToken, function(err, newWallet) {
                    if (err) {
                        console.log("scan for Jaxx token :: error :: " + err);
                    } else {
                        scanImportWallet = newWallet;
                        Navigation.openModal('scanPrivate');
                    }
                });
            }
        }

        Navigation.clearInputFields();

        native.scanCode(processScan);
    } else if (actionName === 'confirmImportPrivateKey') {
        //        console.log("confirmImportPrivateKey");
        if (typeof(scanImportWallet) !== 'undefined' && scanImportWallet != null) {
            setTimeout(function() {
                setTimeout(function() {

                    //@note: @here: @todo: @next:
                    _loadWallet(scanImportWallet);

                    scanImportWallet = null;

                    storeData('mnemonic', wallet.getMnemonic(),true);

                    Navigation.flashBanner("Successfully Imported!", 5);
                    Navigation.closeModal();
                }, 1000);

                Navigation.clearSettings();
                Navigation.openModal('loading');
            }, 500);
        } else {
            console.log("no private key code to import");
        }
    } else if (actionName === 'cancelImportPrivateKey') {
        //        console.log("cancelImportPrivateKey");
        scanImportWallet = null;
//    } else if (actionName === 'toggleMainMenuOn') {
//		g_JaxxApp.getUI().openMainMenu();
//    } else if (actionName === 'toggleMainMenuOff') {
//        console.log("toggle menu off");
//		g_JaxxApp.getUI().closeMainMenu();
//	} else if (actionName === 'toggleMainMenuOffAndAnimate') {
//		g_JaxxApp.getUI().animateHamburgerMenu();
//		g_JaxxApp.getUI().closeMainMenu();
    } else if (actionName === 'chooseDefaultCurrency') {	
	//} else if (actionName === 'promptUserForCacheReset') {
		// This is where we write code to open the modal when the user selects 'Reset Jaxx Cache'
		//Navigation.openModal('resetJaxxCache');
    } else if (actionName === 'resetCache') {
        var defaultCoinType = g_JaxxApp.getSettings().getDefaultCoinType();
        //@note: @here: @todo: maybe add default currencies.
        
        var pinEncrypted = "";
        if (g_JaxxApp.getUser().hasPin()) {
            pinEncrypted = g_JaxxApp.getUser().getEncryptedPin();
        }
        
        // Enter data to preserve here:
        var saveAndRestoreData = {
            "mnemonic": {data: null, isEncrypted: false},
            "crypto_currency_position_data": {data: null, isEncrypted: false},
            "crypto_currency_enabled_data": {data: null, isEncrypted: false},
            "currencies_position_order": {data: null, isEncrypted: false},
            "currencies_selected": {data: null, isEncrypted: false},
            "hasShownTermsOfService": {data: null, isEncrypted: false},
        };
        
        for (var curValKey in saveAndRestoreData) {
            var isEncrypted = saveAndRestoreData[curValKey].isEncrypted;
            saveAndRestoreData[curValKey].data = getStoredData(curValKey, isEncrypted);
        }

        window.localStorage.clear();
        
        for (var curValKey in saveAndRestoreData) {
            var curData = saveAndRestoreData[curValKey].data;
            var isEncrypted = saveAndRestoreData[curValKey].isEncrypted;

            if (typeof(curData) !== 'undefined' && curData !== null) {
                storeData(curValKey, curData, isEncrypted);
            }
        }
                
        if (g_JaxxApp.getUser().hasPin()) {
            g_JaxxApp.getUser().manuallyStoreHashedPin(pinEncrypted);
        }

        g_JaxxApp.getSettings().setDefaultCoinType(defaultCoinType);

        Navigation.clearSettings();

        window.localStorage.setItem('shouldShowLoading', "true");
        location.reload();
    } else if (actionName === 'showJaxxNews') {
        //Navigation.setMainMenuOpen(false);
		g_JaxxApp.getUI().closeMainMenu();
        g_JaxxApp.getUI().displayJaxxNews();
    } else if (actionName === "toggleQuickFiatCurrencySelector") {
        g_JaxxApp.getUI().toggleQuickFiatCurrencySelector();
    } else if (actionName === "setDefaultCurrencyFromMenu") {
        g_JaxxApp.getUI().setDefaultCurrencyFromMenu(element);
    } else if (actionName === 'quickFiatCurrencySwitch') {
        g_JaxxApp.getUI().quickFiatCurrencySwitch(element);
    } else if (actionName === 'showDAORefund') {
        g_JaxxApp.getUI().showDAORefund(element);
    } else if (actionName === 'confirmDAORefund') {
        g_JaxxApp.getUI().confirmDAORefund(element);
    } else if (actionName === 'toggleShapeshiftCoinSelector') {
		g_JaxxApp.getUI().toggleShapeshiftCoinList();
    } else if (actionName === 'toggleMainMenu') {
		g_JaxxApp.getUI().toggleMainMenu();
	} else if (actionName === 'enableOptionTab') {
		if (element.attr('value') === 'menu'){
			g_JaxxApp.getUI().mainMenuShowMenu();
		} else if (element.attr('value') === 'wallets') {
			g_JaxxApp.getUI().mainMenuShowWallets();
		} else if (element.attr('value') === 'currencies') {
			g_JaxxApp.getUI().mainMenuShowCurrencies();
		}
	} else if (actionName === 'toggleCurrency') {
		Navigation.toggleCurrency(element.attr("value"));
	} else if (actionName === 'toggleCryptoCurrency') {
		//console.log(element);
		g_JaxxApp.getUI().toggleCryptoCurrencyIsEnabled(element.attr("value"));
	} else if (actionName === 'slideBannerLeft') {
		g_JaxxApp.getUI().slideBannerLeft();
	} else if (actionName === 'slideBannerRight') {
		g_JaxxApp.getUI().slideBannerRight();
	} else if (actionName === 'leftCoinBannerClicked') {
		g_JaxxApp.getUI().leftCoinBannerClicked(element.attr('value'));
	} else if (actionName === 'centerCoinBannerClicked') {
		g_JaxxApp.getUI().centerCoinBannerClicked(element.attr('value'));
	} else if (actionName === 'rightCoinBannerClicked') {
		g_JaxxApp.getUI().rightCoinBannerClicked(element.attr('value'));
	/* } else if (actionName === 'rightBannerArrowClicked') {
		g_JaxxApp.getUI().rightBannerArrowClicked(); 
	} else if (actionName === 'leftBannerArrowClicked') {
		g_JaxxApp.getUI().leftBannerArrowClicked(); */
	} else if (actionName === 'selectShapeshiftCoin') {
		g_JaxxApp.getUI().selectShapeshiftCoin(element.attr('value'));
	} else if (actionName === 'changeShapeshiftCoinToNextCoinType') {
        g_JaxxApp.getUI().changeShapeshiftCoinToNextCoinType(element.attr('value'));
    } else if (actionName === 'toggleIgnoreEtcEthSplit') {
        g_JaxxApp.getUI().toggleIgnoreEtcEthSplit();
    } else if (actionName === 'checkForEtcEthSplit') {
        g_JaxxApp.getUI().checkForEtcEthSplit();
    } else if (actionName === 'confirmEtcEthSplit') {
        g_JaxxApp.getUI().confirmEtcEthSplit();
    }
}
// End of special action div.

function scrollIntoView(tableElement, tableContainer, scrollContainer) {
    var scrollAmount = $(tableElement).position().top - $(tableContainer).position().top;
    $(scrollContainer).scrollTop(scrollAmount);

    // var containerTop = $(container).scrollTop();
    // console.log('containerTop: ' + containerTop);
    //var containerBottom = containerTop + containerHeight; 
    //console.log('Container height: ' + containerHeight);
    //console.log('container bottom: ' + containerBottom);
    //var elemTop = $(element).position().top;
    //console.log('offsetTop: ' + elemTop);
    //var elemBottom = elemTop + $(element).height(); 
    //console.log('elemBottom: ' + elemBottom);
    //if (elemTop < containerTop) {
    //	$(container).scrollTop(elemTop);
    //} else if (elemBottom > containerBottom) {
    //	$(container).scrollTop(elemBottom - containerHeight);
    //}
}

// Called when a settings page comes on screen to handle special events
function specialOnEnter(page) {
    if (page === 'onenameComplete') {
        $('.settings.onenameComplete .populateOnename').text(wallet.getOnename());

    } else if (page === 'oennameTwitter') {
        $('.settings.onenameTwitter input').val('').trigger('keyup');
    }
}

function scriptAction(event) {
    //    console.log(event)
    var e = $(event.currentTarget);

    var effect = e.attr('effect');

    if (e.hasClass('disabled')) { return; }
    if (e.hasClass('button') && !e.hasClass('enabled')) { return; }
	
    var pushSettings = e.attr('pushSettings');
    if (pushSettings) {
//        specialAction('toggleMainMenuOff', null);
//        //$('.wallet .menu,.wallet .dismiss').fadeOut();
//        g_JaxxApp.getUI().closeMainMenu();


        Navigation.pushSettings(pushSettings);
        specialOnEnter(pushSettings);
    }

    if (e.attr('popSettings') == 'true') {
        Navigation.popSettings();
    }

    if (e.attr('clearSettings') == 'true') {
        Navigation.clearSettings();
    }

    var enable = (e.attr('enable') || '').split(',');
    for (var i = 0; i < enable.length; i++) {
        $(enable[i]).removeClass('disabled');
    }

    var disable = (e.attr('disable') || '').split(',');
    for (var i = 0; i < disable.length; i++) {
        $(disable[i]).addClass('disabled');
    }

    var hide = (e.attr('hide') || '').split(',');
    for (var i = 0; i < hide.length; i++) {
        //        console.log("hide :: " + i + " :: " + hide[i]);
        if (effect === 'fade') {
            $(hide[i]).fadeOut();
        } else if (effect === 'slide') {
            $(hide[i]).slideUp();
        } else {
            $(hide[i]).hide();
        }
    }

    var show = (e.attr('show') || '').split(',');
    for (var i = 0; i < show.length; i++) {
        if (effect === 'fade') {
            $(show[i]).fadeIn();
        } else if (effect === 'slide') {
            $(show[i]).slideDown();
        } else {
            $(show[i]).show();
        }
    }

    var toggle = (e.attr('toggle') || '').split(',');
    for (var i = 0; i < toggle.length; i++) {
        //        console.log("toggle :: " + toggle[i] + " :: " + $(toggle[i]) + " :: effect :: " + effect);

        if (effect === 'fade') {
            $(toggle[i]).fadeToggle();
        } else if (effect === 'slide') {
            $(toggle[i]).slideToggle();
        } else {
            $(toggle[i]).toggle();
        }
    }

    // Clear the input/textarea value in the attribute "clearValue"
    var clear = (e.attr('clearValue') || '').split(',');
    for (var i = 0; i < clear.length; i++) {
        $(clear[i]).val('').trigger('keyup');
    }

    // Copy to the clipboard the value in the attribute "copy"
    var copy = e.attr('copy');
    //    console.log("copy :: " + copy)
    if (copy) {
        var sandbox = $('#clipboard').val(copy).select();
        document.execCommand('copy');
        sandbox.val('').blur();

        if (window.native && window.native.copyToClipboard) {
            window.native.copyToClipboard(copy);
        }

        $('.copied').slideDown();

        setTimeout(function() {
            $('.copied').slideUp();
        }, 1500);
    }

    var copyLarge = e.attr('copyLarge');
    if (copyLarge) {
        var sandbox = $('#clipboard').val(copyLarge).select();
        document.execCommand('copy');
        sandbox.val('').blur();

        if (window.native && window.native.copyToClipboard) {
            window.native.copyToClipboard(copyLarge);
        }

        $('.copiedLarge').fadeTo(1000, 1);
        setTimeout(function() {
            $('.copiedLarge').fadeTo(1000, 0);
        }, 1000);
    }

    var showTab = e.attr('showTab');
    if (showTab) {
        Navigation.showTab(showTab);
    }

    var toggleTab = e.attr('toggleTab');
    if (toggleTab) {
        Navigation.toggleTab(toggleTab);
    }

    var collapseTabs = e.attr('collapseTabs');
    if (collapseTabs === 'true') {
        Navigation.toggleTab();
    }

    var openModal = e.attr('openModal');
    if (openModal) {
        Navigation.openModal(openModal);
    }

    var closeModal = e.attr('closeModal');
    if (closeModal === 'true') {
        Navigation.closeModal();
    }
	
	var switchToCoin = e.attr('switchToCoin');
	if (switchToCoin) {
		g_JaxxApp.getUI().switchToCoin(switchToCoin);
	}

    var flashBanner = e.attr('flashBanner');
    if (flashBanner) {
        var timeout = e.attr('timeout');
        Navigation.flashBanner(flashBanner, timeout);
    }

    var special = e.attr('specialAction');
    if (special) {
        specialAction(special, e);
    }

    if (typeof(ethereumUnlocked) === 'undefined' || ethereumUnlocked === null || ethereumUnlocked === false) {
        if (ethereumSecretSelector !== 'true' && !special) {
            ethereumSecretProgress = 0;
        }
    }
}

$('.scriptAction').click(function (event) {
//    try {
        scriptAction(event);
//    } catch (err) {
//        console.error(err);
//    }
});
//g_JaxxApp.getUI().setHasAttachedScriptAction(true);


// @TODO: Move to "special"
$('.tabContent .unitToggle').click(function () {
    // Open menu here.
    Navigation.toggleUseFiat();

    // Update the state of the button
    $('.tabContent .amount input').val('').trigger('keyup');
});

$('.tabContent .address input').keyup((function() {
    //@note: onename lookup functionality.
    var input = $('.tabContent .address input');

    var onenameCache = {};

    return function () {

        if (input.val() !== "" && curCoinType === COIN_ETHEREUM) {
            var isValidAddress = ethereumAddressInputCheck();

            if (isValidAddress === false) {
                //                $('.ethereumChecksumAddressWarningText').slideDown();
                return;
            }
        } else {
            $('.ethereumChecksumAddressWarningText').slideUp();
        }

        var processData = function(data) {
            if (data.jaxxValue != input.val()) {
                return;
            }

            if (!data.v) {
                input.css({backgroundImage: 'none'}).removeClass('validOnename').removeClass('cssValidOnename');
                input.data('onename', false).data('address', false).data('showAddress', false);
                return;
            }

            var avatarImage = 'img/default-profile_360.png';
            if (data.avatar && data.avatar.url) {
                avatarImage = sanitizeOneNameAvatar(data.avatar.url);
            }

            input.css({ backgroundImage: 'url(' + avatarImage + ')'});

            var name = 'unknown';
            if (data.name && data.name.formatted) {
                name = data.name.formatted;
            }

            var bitcoinAddress = null, truncatedBitcoinAddress = null;
            if (data.bitcoin && data.bitcoin.address) {
                bitcoinAddress = data.bitcoin.address;
                truncatedBitcoinAddress = bitcoinAddress.substring(0, 6) + '\u2026' + bitcoinAddress.substring(bitcoinAddress.length - 5);
            }

            var onenameData = {
                avatarImage: avatarImage,
                bitcoinAddress: bitcoinAddress,
                data: data,
                onename: data.jaxxValue,
                name: name,
                success: true,
                truncatedBitcoinAddress: truncatedBitcoinAddress
            };

            input.addClass('validOnename').addClass('cssValidOnename');
            input.data('onename', data.jaxxValue).data('address', bitcoinAddress).data('showAddress', truncatedBitcoinAddress);

            // Update the state of the button
            $('.tabContent .amount input').trigger('keyup');
        }

        input.data('onename', false).data('address', false);


        var continueOneNameCheck = true;

        var value = input.val()

        //Check if equals to shapeshift, avoid doing anything else 
        if(value.toUpperCase() === "SHAPESHIFT") {
            if (g_JaxxApp.getShapeShiftHelper().getIsTriggered() !== true) {
                g_JaxxApp.getUI().showShapeShift();
            }

            //Display HTML box TODO


            //@note: setup shapeshift helper update interval if necessary.

            g_JaxxApp.getShapeShiftHelper().setupUpdateIntervalIfNecessary(curCoinType);

            continueOneNameCheck = false;
        } else {
            if (g_JaxxApp.getShapeShiftHelper().getIsTriggered()) {
                $('.spendable').slideDown(); // Hide Spendable line

                g_JaxxApp.getUI().resetShapeShift();
            }
        }

        var data = onenameCache[value];
        if (continueOneNameCheck === true && data) {
            processData(data);

        } else {
            RequestSerializer.getJSON('https://glacial-plains-9083.herokuapp.com/lookup.php?id=' + value, function (data) {
                data.jaxxValue = value;
                onenameCache[value] = data;
                processData(data);
            });
        }

        // Update the state of the button
        $('.tabContent .amount input').trigger('keyup');
    };

})()).change(function() {
    var input = $('.tabContent .address input');
    input.trigger('keyup');
}).focus(function () {
    var input = $('.tabContent .address input');
    if (input.data('onename') && input.data('address')) {
        input.val(input.data('onename'));
    }

}).blur(function () {
    var input = $('.tabContent .address input');
    if (input.data('onename') && input.data('address')) {
        var value = input.data('onename') + ' (' + truncate(input.data('address'), 5, 5) + ')';
        input.val(value);
    }
});

/* Limit input to 8 decimals (bitcoin) or 16 decimals (ethereum) */
function checkForDecimalLimits(inputField) {
    var returnString = "";
    var didModify = false;

    var numDecimals = 8;

    if (Navigation.isUseFiat()) {
        numDecimals = 2;
    } else {
        var displayNumDecimals = HDWalletPouch.getStaticCoinPouchImplementation(curCoinType).uiComponents['displayNumDecimals'];
        
        numDecimals = displayNumDecimals;
    }

    if (inputField.val().indexOf('.') != -1) {
        //        console.log("numDecimals :: " + numDecimals + " :: inputField :: " + inputField.val());
        var inputFieldComponents = inputField.val().split(".");
        
        if (inputFieldComponents[1].length > numDecimals) {
            if (isNaN(parseFloat(inputField.val()))) {
                console.log("nan");
                return null;
            }

            //            console.log("returning float :: " + parseFloat(inputField.val()));
            didModify = true;
            returnString = parseFloat(inputFieldComponents[0] + "." + inputFieldComponents[1].substring(0, numDecimals));
        } else {
            //            console.log("returning :: " + parseFloat(inputField.val()).toFixed(numDecimals));
            didModify = false;
            returnString = inputField.val();
        }
    } else {
        //        console.log("no decimal");
        didModify = true;
        returnString = null;
    }

    return JSON.stringify([didModify, returnString]);
}

$('.tabContent .amount input').keyup(function () {
    if ($('.tabContent .amount input').val() !== "") {
        var returnArray = JSON.parse(checkForDecimalLimits($('.tabContent .amount input')));
        var didModify = returnArray[0];
        var valueString = returnArray[1];

        if (didModify && valueString !== null) {
            $('.tabContent .amount input').val(valueString);
        }
    }

    updateFromInputFieldEntry();
});

$('.tabContent .amount input').bind('paste', function(e) {
    setTimeout(function() {
        $('.tabContent .amount input').trigger('keyup');
    }, 10);
});


$('.advancedTabContentEthereum .customGasLimit input').keyup(function () {
    var didModify = false;
    var valueInt = parseInt($('.advancedTabContentEthereum .customGasLimit input').val());

    if (valueInt !== wallet.getHelper().getCustomEthereumGasLimit().toNumber()) {
        didModify = true;
        //        console.log("valueInt :: " + valueInt + " :: ethereumWallet.getCustomEthereumGasLimit() :: " + ethereumWallet.getCustomEthereumGasLimit());
    }

    if (didModify && valueInt !== null) {
        if (isNaN(valueInt)) {
            //            $('.advancedTabContentEthereum .customGasLimit input').val(ethereumWallet.getRecommendedEthereumCustomGasLimit());
            wallet.getHelper().setCustomEthereumGasLimit(wallet.getHelper().getRecommendedEthereumCustomGasLimit());
        } else {
            $('.advancedTabContentEthereum .customGasLimit input').val(valueInt);
            wallet.getHelper().setCustomEthereumGasLimit(valueInt);
        }

        wallet.getPouchFold(COIN_ETHEREUM).clearSpendableBalanceCache();

        updateSpendable();
        updateFromInputFieldEntry();
    }
});

$('.advancedTabContentEthereum .customData input').keyup(function () {
    updateFromInputFieldEntry();
});


$('textarea.validateMnemonic').keyup(function() {
    var e = $(this);
    var value = $(this).val();
    //@note: remove whitespace, linebreaks.
    value = value.replace(/^\s+|\s+$/g, '');

    var parsedWords = value.trim().toLowerCase().split(" ");
    var numWords = 0;
    var combinedWords = "";

    for (var i = 0; i < parsedWords.length; i++) {
        if (parsedWords[i] !== "") {
            numWords++;
            combinedWords += parsedWords[i];
            if (i < parsedWords.length - 1) {
                combinedWords += " ";
            }
        }
    }

    //    console.log("parsedWords :: " + parsedWords + " :: numWords :: " + numWords);

    if (numWords == 12 && thirdparty.bip39.validateMnemonic(combinedWords)) {
        $(this).val(combinedWords);
        $(e.attr('targetButton')).addClass('cssEnabled').addClass('enabled');
    } else {
        $(e.attr('targetButton')).removeClass('cssEnabled').removeClass('enabled');
    }
});

$('textarea.validateMnemonic').on('paste', function () {
    var self = this;
    
    setTimeout(function() {
        $(self).trigger('keyup');  
    }, 100);
    
});

$('.settings.quickVerifyMnemonic input').keyup(function () {
    var input = $('.settings.quickVerifyMnemonic input');
    var value = input.val().toLowerCase();
    if (value === input.data('word')) {
        $('.settings.quickVerifyMnemonic .button').addClass('cssEnabled').addClass('enabled');
    } else {
        $('.settings.quickVerifyMnemonic .button').removeClass('cssEnabled').removeClass('enabled');
    }
});

$('.settings.sweepPrivateKeyPasswordEntry input').keyup(function () {
    var value = $('.sweepPrivateKeyPasswordEntry input').val();

    var nextSweepPassBehaviours = buttonBehaviours['nextSweepPass'];
    if (value != "" && value != null) {
        nextSweepPassBehaviours.enableButton();
    } else {
        nextSweepPassBehaviours.disableButton();
    }
});


$('.settings.sweepPrivateKey input').keyup(function () {
    var value = $('.settings.sweepPrivateKey input').val();

    function disableButton() {
        var element = $('.sweepNextButton');
        element.removeClass('cssEnabled');
        element.removeClass('cssBlueButton');
        element.addClass('cssGreyButton');
        element.css('cursor', 'default');
        element.attr('specialAction', null);
        element.attr('pushSettings', null);
    }

    function enableButton() {
        var element = $('.sweepNextButton');
        element.addClass('cssEnabled');
        element.addClass('cssBlueButton');
        element.removeClass('cssGreyButton');
        element.css('cursor', 'pointer');
        element.attr('specialAction', 'sweepPrivateKey.prepare');
        element.attr('pushSettings', 'confirmSweepPrivateKey');
    }

    function enableButtonEncrypted() {
        var element = $('.sweepNextButton');
        element.addClass('cssEnabled');
        element.addClass('cssBlueButton');
        element.removeClass('cssGreyButton');
        element.css('cursor', 'pointer');
        element.attr('specialAction', 'sweepPrivateKey.showDecrypt');
        element.attr('pushSettings', 'sweepPrivateKeyPasswordEntry');
    }

    if (value === "") {
        disableButton();
        return;
    }

    //    console.log("value :: " + value);

    var isPlainPrivateKey = false;
    if (curCoinType === COIN_BITCOIN) {
        isPlainPrivateKey = isValidBTCPrivateKey(value);
    } else if (curCoinType === COIN_ETHEREUM) {
        isPlainPrivateKey = isValidETHPrivateKey(value);
    } else if (curCoinType === COIN_DASH) {
        //@note: @here: this should work.
        isPlainPrivateKey = isValidBTCPrivateKey(value, HDWalletPouchDash.networkDefinitions.mainNet);
    } else if (curCoinType === COIN_LITECOIN) {
        //@note: @here: this should work.
        isPlainPrivateKey = isValidBTCPrivateKey(value, HDWalletPouchLitecoin.networkDefinitions.mainNet);
    } else if (curCoinType === COIN_LISK) {
        //@note: @here: @lisk:
//        isPlainPrivateKey = isValidBTCPrivateKey(value, HDWalletPouchLisk.networkDefinitions.mainNet);
    } else if (curCoinType === COIN_ZCASH) {
        //@note: @here: this should work.
        isPlainPrivateKey = isValidBTCPrivateKey(value, HDWalletPouchZCash.networkDefinitions.mainNet);
    }

    if (isPlainPrivateKey === true) {
        //        console.log("regular private key detected");
        enableButton();
    } else {
        //check if is encrypted private key
        var isEncryptedPrivateKey = false;
        if (curCoinType === COIN_BITCOIN) {
            isEncryptedPrivateKey = isValidBIP38key(value);
        } else if (curCoinType === COIN_ETHEREUM) {
            isEncryptedPrivateKey = isValidETHAESkey(value);
        } else if (curCoinType === COIN_DASH) {
            //@note: @here: this should work.
            isEncryptedPrivateKey = isValidBIP38key(value);
        }

        if (isEncryptedPrivateKey ){
            //            console.log("encrypted private key detected")
            enableButtonEncrypted();
        } else{
            //            console.log("invalid private key detected");
            disableButton();
        }
    }
});



$('.settings.onenameSelect input').keyup(function () {
    var input = $('.settings.onenameSelect input')

    var checkOnename = function(value) {
        Onename.usernameAvailable(value, function (error, available) {
            if (value !== input.val()) {
                return;
            }

            if (error) {
                console.log('Onename error', error);

            } else {
                if (available) {
                    $('.settings.onenameConfirm .button').data('onename', value);
                    $('.settings.onenameSelect .button').addClass('cssEnabled').addClass('enabled');
                    $('.settings.onenameConfirm .populatePendingOnename').text(value);
                }
            }
        });
    }

    var delayToken = null;

    return function() {
        $('.settings.onenameSelect .button.next').removeClass('cssEnabled').removeClass('enabled');

        var value = input.val()
        if (delayToken) { clearTimeout(delayToken); }

        delayToken = setTimeout(function() {
            delayToken = null;
            checkOnename(value)
        }, 400);
    };
}());

//@note: @here: this isn't used right now.
$('.settings.onenameTwitter input').keyup(function () {
    var input = $(this);
    input.css({ backgroundImage: 'none'});
    $('.settings.onenameTwitter .button').removeClass('enabled').removeClass('cssEnabled');

    Onename.lookupTwitter(input.val(), function(username, data) {
        if (username != input.val()) { return; }
        if (data.status === 'success' && data.twitter == input.val()) {

            var avatarImage = 'img/default-profile_360.png';
            if (data.avatar && data.avatar.url) {
                avatarImage = sanitizeOneNameAvatar(data.avatar.url);
            }

            input.css({ backgroundImage: 'url(' + avatarImage + ')'});
            $('.settings.onenameTwitter .button').addClass('enabled').addClass('cssEnabled');

            $('.settings.onenameTwitterProfile .populateOnename').text(wallet.getOnename());
            $('.settings.onenameTwitterProfile .populateTwitter').text(username);
            $('.settings.onenameTwitterProfile .populateName').text(data.name);

            $('.settings.onenameTwitterProfile .populateAvatar').css({
                background: 'url(' + avatarImage + ') no-repeat center center',
                backgroundSize: 'cover',
                display: 'inline-block',
            });

            $('.settings.onenameTwitterProfile .button').data('twitter', data);
        }
    });
});

function sanitizeOneNameAvatar(avatarUrl) {
    var isValidAvatar = true;

    var schemePrefixIdx = avatarUrl.indexOf("://");

    if (schemePrefixIdx !== -1) {
        var prefixScheme = avatarUrl.substr(0, schemePrefixIdx);

        if (prefixScheme !== "http" && prefixScheme !== "https") {
            console.log("avatar invalid prefix scheme :: " + prefixScheme);
            isValidAvatar = false;
        } else {
            var hackArray = [")", ","];

            for (var hackIdx in hackArray) {
                var curHackToCheck = hackArray[hackIdx];

                if (avatarUrl.indexOf(curHackToCheck) !== -1) {
                    console.log("avatar has inclusion hack :: " + curHackToCheck);
                    isValidAvatar = false;
                }
            }
        }
    }

    if (isValidAvatar) {
        return avatarUrl;
    } else {
        console.log("invalid avatar");
        return "img/default-profile_360.png";
    }
}

var buttonBehaviours = {};

function setupUIButtonBehaviours() {
    buttonBehaviours['nextSweepPass'] = {};

    buttonBehaviours['nextSweepPass'].disableButton = function() {
        //        console.log("disabled");
        var element = $('.nextSweepPass');
        element.removeClass('cssEnabled');
        element.removeClass('cssBlueButton');
        element.addClass('cssGreyButton');
        element.css('cursor', 'default');
        element.attr('specialAction', null);
        element.attr('pushSettings', null);
    }

    buttonBehaviours['nextSweepPass'].enableButton = function() {
        //        console.log("enabled");
        var element = $('.nextSweepPass');
        element.addClass('cssEnabled');
        element.addClass('cssBlueButton');
        element.removeClass('cssGreyButton');
        element.css('cursor', 'pointer');
        element.attr('specialAction', 'sweepPrivateKey.tryToDecrypt');
    }
}

/**
 *  Bootstrap the wallet
 */


// Make sure all buttons enabled by design is enabled internally
$('.button.cssEnabled').addClass('enabled');

function updateDefaultWalletList() {
    $('.settings.setDefaultWallet .setDefaultWalletList div').each(function() {
        var element = $(this);

        var elementCoinType = parseInt(element.attr('changedefaultcointype'), 10);
        //        console.log("curDefaultCoinType :: " + elementCoinType);

        if (elementCoinType === g_JaxxApp.getSettings().getDefaultCoinType()) {
            element.addClass('selected').addClass('cssSelected');
            element.find('.cssCircleUnchecked').addClass('cssCurrencyisChecked').removeClass('cssCircleUnchecked');

            //            console.log("selectedDefaultCoinType :: " + elementCoinType + " :: " + typeof(elementCoinType));
            g_JaxxApp.getSettings().setDefaultCoinType(elementCoinType);
            g_JaxxApp.getUI().updateSettingsUI();
        } else {
            element.removeClass('selected').removeClass('cssSelected');
            element.find('.cssCurrencyisChecked').removeClass('cssCurrencyisChecked').addClass('cssCircleUnchecked');

        }
    });
}

function setupDefaultWalletList() {
    $('.setDefaultWalletList').empty();

    for (var i = 0; i < COIN_NUMCOINTYPES; i++) {
        var coinDisplayFullName = HDWalletPouch.getStaticCoinPouchImplementation(i).uiComponents['coinDisplayFullName'];

        
        $('.settings.setDefaultWallet .setDefaultWalletList').append('<div class="scriptAction defaultWalletItem cssDefaultWalletItem" changedefaultcointype="' + i + '"> <div class="cssSelectDefaultWallet cssCircleUnchecked" > </div>' + coinDisplayFullName + ' Wallet</div>');
    }

    $('.settings.setDefaultWallet .setDefaultWalletList').css("height", (COIN_NUMCOINTYPES * 30) + "px");

    $('.settings.setDefaultWallet .setDefaultWalletList div').click(function() {
        //        console.log("item :: " + $(this).attr('changedefaultcointype'));
        var elementCoinType = parseInt($(this).attr('changedefaultcointype'), 10);


        g_JaxxApp.getSettings().setDefaultCoinType(elementCoinType);
        updateDefaultWalletList();

    });

    updateDefaultWalletList();
}

function initializeJaxx() {
    console.log("[ Jaxx Initialize Version " + g_JaxxApp.getVersionCode() + " ]");
    $('.menusAboutVersionCode').text(g_JaxxApp.getVersionCode());
    g_JaxxApp.getUI().setupExternalLink($('.menusAboutWebsiteLink'), 'www.jaxx.io', 'http://jaxx.io');
    g_JaxxApp.getUI().setupExternalLink($('.menusAboutWebsiteContact'), 'info@decentral.ca', 'mailto:info@decentral.ca');

    g_JaxxApp.getUI().setupExternalLink($('.menusHelpResetWalletLink'), 'here', 'https://decentral.zendesk.com/hc/en-us/articles/218375737-How-do-I-reset-my-Jaxx-wallet-');

    var defaultCoinType = g_JaxxApp.getSettings().getDefaultCoinType();
    setupDefaultCoinType(defaultCoinType);
    Navigation.setupCoinUI(defaultCoinType);
    
    //@note: @todo: @here: make setup better timed with pouches if necessary.
    
    g_JaxxApp.getBitcoinRelays().setup(function(resultParams) {
        console.log("initializeJaxx :: getBitcoinRelays :: RelayTests :: fetchBlockHeights :: " + JSON.stringify(resultParams));
    }); // Setup the relays (Stored in a global so that instance data is not discarded.)

    g_JaxxApp.getLitecoinRelays().setup(function(resultParams) {
        console.log("initializeJaxx :: getLitecoinRelays :: yTests :: fetchBlockHeights :: " + JSON.stringify(resultParams));
    }); // Setup the relays (Stored in a global so that instance data is not discarded.)

    setupDefaultWalletList();

    showPageScanAddresses(defaultCoinType);

    setupUIButtonBehaviours();

    $('.btnActionShapeShift').click(function(){
        if (g_JaxxApp.getShapeShiftHelper().getIsTriggered()) {
            $('.tabContent .address input').val('').trigger('keyup');
        } else {
            $('.tabContent .address input').val('ShapeShift').trigger('keyup');
        }
    });

    //@note: @here: @todo: @next: remove this.
    //    shapeShiftPairSwitcher
    $('.shapeShiftToggleItem :checkbox').click(function() {
        var $this = $(this);
        var positionZero = $this.is(':checked');

        console.log("checked :: " + positionZero);

        var receiveCoinType = COIN_BITCOIN;
        
        while (receiveCoinType === curCoinType)
        {
            receiveCoinType = (receiveCoinType + 1) % COIN_NUMCOINTYPES;
        }

        g_JaxxApp.getShapeShiftHelper().setReceivePairForCoinType(curCoinType, receiveCoinType);
        g_JaxxApp.getShapeShiftHelper().clearUpdateIntervalIfNecessary();

//        var coinDisplayColor = HDWalletPouch.getStaticCoinPouchImplementation(receiveCoinType).uiComponents['coinDisplayColor'];
        
//        $('.shapeShiftToggleButtonLabel').css({'background': coinDisplayColor});

        $('.tabContent .address input').trigger('keyup');
	//        var $this = $(this);
	//        console.log("checked :: " + $this.is(':checked'));
	//        // $this will contain a reference to the checkbox   
	//        if ($this.is(':checked')) {
	//            // the checkbox was checked 
	//        } else {
	//            // the checkbox was unchecked
	//        }
    });

    var receiveCoinType = COIN_BITCOIN;

    if (defaultCoinType === COIN_BITCOIN) {
        receiveCoinType = COIN_ETHEREUM;
    } else {
        receiveCoinType = COIN_BITCOIN;
    }

//    var coinDisplayColor = HDWalletPouch.getStaticCoinPouchImplementation(receiveCoinType).uiComponents['coinDisplayColor'];
//    
//    $('.shapeShiftToggleButtonLabel').css({'background': coinDisplayColor});

    $('.spendableShapeshift').slideUp(0); // hide ShapeShift logo and Info icon

    $('.copied').slideUp(0);
    $('.ethereumChecksumAddressWarningText').slideUp(0);
    $('.ethereumTokenInsufficientGasForSpendableWarningText').slideUp(0);

    $('.shiftingProgress').fadeOut(0);

    setTimeout(function() {
        $('.copied').css('position', 'relative');
    }, 1500);

    if (window.chrome && chrome.extension) {
        var backgroundPage = chrome.extension.getBackgroundPage();
        if (backgroundPage) {
            console.log("[ Jaxx :: Trying to load background wallet :: " + backgroundPage.Wallet + " ]");
        }

        if (backgroundPage && backgroundPage.Wallet) {
            console.log('Using background wallet');
            var wallet = backgroundPage.Wallet;
            if (wallet) {

                for (var i = 0; i < COIN_NUMCOINTYPES; i++) {
                    wallet.getPouchFold(i).setLogger(console);
                    wallet.getPouchFold(i).dumpLog();
                }

                var success = _loadWallet(wallet);
                console.log('Linked to background wallet: ' + success);
            }
        }
    }

    //@note: disable the camera if it's not available.
    if (!window.native || !native.scanCode) {
        $('.cameraPairFromDevice').hide();
        $('.imageCamera').hide();
        $('.imageQR').hide();
        $('.cameraTab').hide();
        $('.pairFromDevice').hide();

        $('.tabContent .address input').css('width', 'calc(100% - 20px)');
    }

    if (PlatformUtils.mobileCheck()) {
        console.log("mobile check passed");
        $('.tabSend').removeClass('cssTab');
        $('.tabSend').addClass('cssTabOverrideHover');

        $('.tabReceive').removeClass('cssTab');
        $('.tabReceive').addClass('cssTabOverrideHover');
    }

    var dontShowReminder = false;

    if (!wallet) {
        var mnemonicEncrypted = getStoredData('mnemonic', false);
        if (mnemonicEncrypted) {
            loadFromEncryptedMnemonic(mnemonicEncrypted, function(err, wallet) {
                if (err) {
                    console.log("initializeJaxx :: error :: " + err);

                    //@note: @here: maybe a better error display in this case.
                    g_JaxxApp.getUI().updateSettingsUI();
                    Navigation.startBlit();
                } else {
                    g_JaxxApp.getUI().updateSettingsUI();
                    Navigation.startBlit();
                }
            });
        } else {
            console.log("[Show Splash Screen]");
            resize();

            dontShowReminder = true;
            Navigation.pushSettings('splash');
        }
    } else {
        g_JaxxApp.getUI().updateSettingsUI();
        Navigation.startBlit();
    }

    // Logic behind showing reminders using banners.
    var hasShownBackupReminder = getStoredData('hasShownBackupReminder');
    if (hasShownBackupReminder !== null) {
        var lastBackupTimestamp = getStoredData('lastBackupTimestamp');
        if (lastBackupTimestamp === null) {
            Navigation.flashBannerMultipleMessages(['Please remember to back up your wallet'], 5);	
            //            Navigation.flashBannerMultipleMessages(['Please go to Tools > Display Backup Phrase'], 10);	
        }
    } else if (dontShowReminder === false) {
        storeData('hasShownBackupReminder', 'true');
        Navigation.flashBannerMultipleMessages(['Please remember to back up your wallet'], 5);

        //        Navigation.flashBannerMultipleMessages(['Back up your wallet', 'Go to Tools > Display Backup Phrase'], 10);
    }



}

// Help Page Question Toggle

$('dd').hide();

$('dt').click(
    function() {
        var toggle = $(this).nextUntil('dt');
        toggle.slideToggle();
        $('dd').not(toggle).slideUp();
    });

/* Hover states off on mobile */
var touch = window.ontouchstart || ('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);

console.log("touch :: " + touch);
if (touch) { // remove all :hover stylesheets
    try { // prevent crash on browsers not supporting DOM styleSheets properly
        for (var si in document.styleSheets) {
            var styleSheet = document.styleSheets[si];
            if (!styleSheet.rules) continue;

            for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
                if (!styleSheet.rules[ri].selectorText) continue;

                if (styleSheet.rules[ri].selectorText.match(':hover')) {
                    styleSheet.deleteRule(ri);
                }
            }
        }
    } catch (ex) {}

    // Check a box for the default Jaxx currency.
    // Assertion: the currency has been loaded into the helper wallet.
}

function setupDefaultCoinType(defaultCoinType) {
    curCoinType = defaultCoinType;
    //    g_JaxxApp.getUI().resetCoinButton(COIN_BITCOIN);
    //    console.log("setupDefaultCoinType :: " + defaultCoinType);

    g_JaxxApp.getUI().initializeToCoinType(defaultCoinType);
}

function resize() {
    g_JaxxApp.getUI().refreshSizes();

    var offsetHeight = 0;
    if (curProfileMode === PROFILE_PORTRAIT) {
        //        console.log("nonScrollSize.height :: " + $('.nonScrollSize').height());
        offsetHeight = $('.mainTransactionHistoryHeader').height() + $('.landscapeLeft').height();
        //        offsetHeight = $('.nonScrollSize').height();

        //        console.log("$(window).height() :: " + $(window).height() + " :: $('.landscapeLeft').height() :: " + $('.landscapeLeft').height())

        $('.landscapeRight').css({height: ($(window).height() - $('.landscapeLeft').height())});
    } else if (curProfileMode === PROFILE_LANDSCAPE) {
        var landscapeRightOffsetHeight = $('.logoBanner').height() + $('.imageLogoBannerSVG').height();

        offsetHeight = $('.mainTransactionHistoryHeader').height() + $('.logoBanner').height() + $('.imageLogoBannerSVG').height();

        //        console.log("offsetHeight :: " + offsetHeight);

        var wWidth = g_JaxxApp.getUI().getLargerScreenDimension() / 2;

        //        console.log("window dimensions inner (width/height) :: " + window.innerWidth + " :: " + window.innerHeight + " :: outer :: " + window.outerWidth + " :: " + window.outerHeight + " :: " + window.width + " :: " + window.height);

        //        console.log("$(window).height() :: " + $(window).height());
        //        var leftWindowWidth = $(document).width() / 2;
        //        console.log("using width :: " + wWidth);
        var leftWindowWidth = wWidth;
        var wrapTableCurrencyWidth = $('.wrapTableCurrencySelectionMenu').width();
        var wrapTableCurrencyOffset = (leftWindowWidth / 2) - (wrapTableCurrencyWidth / 2);

        $('.cameraTab').css('right', leftWindowWidth + 'px');
        $('.wrapTableCurrencySelectionMenu').css('left', wrapTableCurrencyOffset + 'px');


        //        console.log("landscapeRight height :: " + (($(window).height() - $('.logoBanner').height()) + cssLogoBannerNegativeMarginHack));
        $('.landscapeRight').css({height: ($(window).height() - landscapeRightOffsetHeight)});
    }

    $('.table').css({height: ($(window).height() - offsetHeight)});
}

var forcePortrait = false;
var forceLandscape = false;

if (PlatformUtils.mobileIphoneCheck()) {
    forcePortrait = true;
} else {
    if (PlatformUtils.mobileIpadCheck()) {
        forceLandscape = true;
    }
}

//console.log("window.iosdefaultprofilemode :: " + window.iosdefaultprofilemode);
if (typeof(window.iosdefaultprofilemode) !== 'undefined') {
    //    console.log("window.iosdefaultprofilemode :: " + window.iosdefaultprofilemode);

    if (window.iosdefaultprofilemode == 1) {
        forceLandscape = true;
        forcePortrait = false;
    } else {
        forceLandscape = false;
        forcePortrait = true;
    }
}

if (PlatformUtils.extensionCheck()) {
    console.log("ext check");

    forcePortrait = true;
} else if (PlatformUtils.mobileAndroidCheck()) {
    var lowestScreenDim = (g_JaxxApp.getUI().getWindowHeight() < g_JaxxApp.getUI().getWindowWidth()) ? g_JaxxApp.getUI().getWindowHeight() : g_JaxxApp.getUI().getWindowWidth();

    console.log("ff check");

    if (lowestScreenDim > 700) {
    } else {
        forcePortrait = true;
    }
}

//PlatformUtils.outputAllChecks();

console.log("forcePortrait :: " + forcePortrait);
console.log("forceLandscape :: " + forceLandscape);

var loadProfileMode = PROFILE_PORTRAIT;

if (forcePortrait) {
    console.log("force portrait mode");
    loadProfileMode = PROFILE_PORTRAIT;
} else if (forceLandscape) {
    console.log("force landscape mode");
    loadProfileMode = PROFILE_LANDSCAPE;
} else if (g_JaxxApp.getUI().getWindowHeight() > g_JaxxApp.getUI().getWindowWidth()) {
    console.log("portrait mode detected");
    loadProfileMode = PROFILE_PORTRAIT;
} else {
    console.log("landscape mode detected");
    loadProfileMode = PROFILE_LANDSCAPE;
}

if (loadProfileMode === PROFILE_PORTRAIT) {
    switchToProfileMode(PROFILE_PORTRAIT);
} else {
    switchToProfileMode(PROFILE_LANDSCAPE);
    setDefaultProfileMode(PROFILE_LANDSCAPE);
}

if (PlatformUtils.extensionSafariCheck()) {
    safari.self.width = 375;
    safari.self.height = 600;
}

if(PlatformUtils.extensionCheck()) {
    JaxxUI._sUI.resizeChromeExtension();
}

$(window).on('openurl', function(event, url) {
    console.log("received openurl event :: " + event + " :: url ::" + url);
    checkOpenUrl(url);
});

$(window).resize(resize);

//@note: @todo: optimize more!
function updateScreen(time) {
    //@note: this is for resetting the cache.

    var shouldShowLoading = window.localStorage.getItem('shouldShowLoading');

    if (typeof(shouldShowLoading) !== 'undefined' && shouldShowLoading !== null && shouldShowLoading === "true") {
        Navigation.openModal('loading');
        window.localStorage.removeItem('shouldShowLoading');

        setTimeout(function() {
            updateScreen(0);
        }, 300);

        return;
    }

    if (PlatformUtils.extensionSafariCheck()) {
        setTimeout(function() {
            initializeJaxx();
            console.log("switch");
        }, 1500);
    } else {
        initializeJaxx();

        //        Navigation.pushSettings('backupPrivateKeysBitcoin');
    }
    
//    for (var i = 0;i < 10000; i++) {
//        var curSecret  = new thirdparty.Buffer.Buffer(crypto.getRandomValues(new Uint8Array(32 + 16 + 16)))
//        
//        var liskKeyDict = thirdparty.liskjs.crypto.getKeys(curSecret);
//        
//        console.log("liskKeyDict :: " + i + " :: " + liskKeyDict.publicKey);
//    }
}

//@note: this waits for the first frame.
requestAnimationFrame(updateScreen);

PlatformUtils.outputAllChecks();

//setInterval(function() {
//    var baseUrl = 'https://btc.blockr.io/';
//    var addresses = "13v9LAiAypC4TTuL8U56K9jBCf5SB4ZuXQ,1QBUrAzLJVQAvTxfVm8mf5LuDPaaYqk5u3,1BxB8eednC23dNwsapGXhAa3Wc6qAvHBcP,1CXbh4STLe39BocfZNRPy3dC4PLJdc44sg,1GYeRrZAXxj3S6JsgfHhADhW24PcuDQS6g,1Ntx4zwK5UrGXE2FWT1uHdBEc5deBpVYqK,19zTVALEmDUFXABZj6zBsDnjnvq2spBDwy,1Eiwx5Jdpf3WGcAbgJzvz4crC3yU6fb6E2,1PusjJ32X6eWEHxbU18adKc9CecjTQEu6e,1BRNiqb4CeBHbBcYi3rUZqCqxkDSgB3dB4";
//    
//    RequestSerializer.getJSON(baseUrl+'api/v1/address/txs/'+addresses, function (response,status) {
//        if(status==='error'){
//            g_JaxxApp.getBitcoinRelays().relayLog("Chain Relay :: Cannot get txList : No connection with blockr");
//        }
//        else {
//            g_JaxxApp.getBitcoinRelays().relayLog("Chain Relay :: " + this.getBitcoinRelays().blockr.name+" Tx List Raw response:"+JSON.stringify(response));
//        }  
//    },true);
//}, 100);
//setTimeout(function() {
//    g_JaxxApp.getUI().showDAORefund();
//
//}, 2000);
//
//setTimeout(function() {
//    g_JaxxApp.getUI().showEtcEthSplitModal();
//}, 100);
//console.log("try filesystem");
//
//function errorHandler(err) {
//    console.log("errorHandler :: " + err);
//
//}
//
//function onInitFs() {
//    console.log("file system init");
//}
//
//window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
//
//var fs = window.requestFileSystem(window.PERSISTENT, 1024*1024,onInitFs,errorHandler);
//
//console.log("filesystem :: " + fs);

//var passingPhrases = [];
//var searchWords = ["hamster", "spirit"];
//
//for (var i = 0; i < 100000; i++) {
//    var newPhrase = thirdparty.bip39.generateMnemonic();
//    
//    var parsedWords = newPhrase.trim().toLowerCase().split(" ");
//    
//    var foundSearchWords = {};
//    
//    for (var j = 0; j < parsedWords.length; j++) {
//        var curWord = parsedWords[j];
//        
//        for (var k = 0; k < searchWords.length; k++) {
//            var curSearchWord = searchWords[k];
//            
//            if (curWord === curSearchWord) {
//                foundSearchWords[curWord] = true;
//            }
//        }
//        
//        if (Object.keys(foundSearchWords).length === searchWords.length) {
//            passingPhrases.push(newPhrase);
//        }
//    }
//}
//
//console.log("[ phrases ] ::");
//
//for (var i = 0; i < passingPhrases.length; i++) {
//    var curPhrase = passingPhrases[i];
//    
//    console.log(curPhrase);
//}
//
//console.log("[ end of phrases ]");
