//@note: @here: super useful for debugging stack traces of objects being hidden/shown
//jQuery(function($) {
//
//    var _oldShow = $.fn.show;
//
//    $.fn.show = function(speed, oldCallback) {
//        return $(this).each(function() {
//            var obj         = $(this),
//                newCallback = function() {
//                    if ($.isFunction(oldCallback)) {
//                        oldCallback.apply(obj);
//                    }
//                    obj.trigger('afterShow');
//                };
//
//            // you can trigger a before show if you want
//            obj.trigger('beforeShow');
//
//            // now use the old function to show the element passing the new callback
//            _oldShow.apply(obj, [speed, newCallback]);
//        });
//    }
//    
//    var _oldHide = $.fn.hide;
//
//    $.fn.hide = function(speed, oldCallback) {
//        return $(this).each(function() {
//            var obj         = $(this),
//                newCallback = function() {
//                    if ($.isFunction(oldCallback)) {
//                        oldCallback.apply(obj);
//                    }
//                    obj.trigger('afterHide');
//                };
//
//            // you can trigger a before show if you want
//            obj.trigger('beforeHide');
//
//            // now use the old function to show the element passing the new callback
//            _oldHide.apply(obj, [speed, newCallback]);
//        });
//    }
//});

var JaxxUI = function() {
    this._wWidth = 0;
    this._wHeight = 0;

	this._mainMenuIsOpen = false;
	
    this._numPinEntryFields = 4;
    this._sUI = null;
    
    this._hasDisplayedJaxxNews = false;
    
    this._numHistoryElementsDefault = 20;
    this._numHistoryElementsDisplayed = [];
    
    this._txFullHistory = [];
    
    this._walletWasChangedInMenu = false;
	this._hasAttachedScriptAction = false;
    
    this._coinBannerCarousel = null; // Should be not null when the banner carousel has been initialized.
    this._coinBannerCarouselTimeout = null;
    this._coinBannerCarouselAnimationTime = 300;
    this._coinBannerCarouselTimeoutTime = 5000;
    
    this._coinBannerCarouselDragTimeout = null;
    
    this._coinDontHover = {} // Example {0: true, 1 : false, ..., NUMCOINTYPES(of whatever its called)}

    //@note: @todo: @here: @next: refactor into JaxxData
    this._jaxxNewsData = null;
    
    this._criticalVersionUpdatesShown = [];
    
    this._shouldShowEtcEthSplitIfNoneAvailable = false;
    
    this._disableETCETHSplitOption = false;
}

JaxxUI.prototype.generateSettingsCurrencyRows = function(){
	// This function generates the currency position order as well as the html elements for the settings rows.
	
	// <tr class="currency cssCurrency toggleCurrency scriptAction" value="AUD"><td class="cssSelectedCurrency"><div class="cssCircleUnchecked"></div></td> <td class="cssUnit">AUD</td><td class="name">Australian Dollar</td><td class="rate rateAUD"> </td></tr>
	
	var fiatUnitArray = [];
	// if currency order is stored
	// 		then restore from currency order
	// else
	// 		Get all currency keys as listed from HDWalletHelper.dictFiatCurrency
    var storedCurrencyOrder = getStoredData('currencies_position_order', false);
    if (typeof(storedCurrencyOrder) !== 'undefined' && storedCurrencyOrder !== null) {
		fiatUnitArray = JSON.parse(storedCurrencyOrder);
	} else {
		for (var key in HDWalletHelper.dictFiatCurrency){
			if (HDWalletHelper.dictFiatCurrency.hasOwnProperty(key)) { // hasOwnProperty is needed because it's possible to insert keys into the prototype object of dictionary
				fiatUnitArray.push(key);	
			}
		}
	}
    // @TODO: We should push currencies to the array that are not included just as a safeguard (also remove ones that don't exist at all.)
    
	for (var i = 0; i < fiatUnitArray.length; i++) {
		key = fiatUnitArray[i] // We should expect key to be something like 'CAD'
		if (HDWalletHelper.dictFiatCurrency.hasOwnProperty(key)) { // hasOwnProperty is needed because it's possible to insert keys into the prototype object of dictionary
			// 'key' should be something like 'USD'
			// Use HDWalletHelper.dictFiatCurrency['AUD']['name']
//			console.log(key);
			var column1 = '<td class="cssSelectedCurrency"><div class="cssCircleUnchecked"></div></td>';
            
            var column2 = '<td class="cssUnitAndCurrency"><div class="cssUnit">'  + key + '</div><div class="name">' + HDWalletHelper.dictFiatCurrency[key]['name'] + '</div></td>'
            
//            var column2 = '<td class="cssUnit">' + key + '</td>';
//			var column3 = '<td class="name">' + HDWalletHelper.dictFiatCurrency[key]['name'] + '</td>';
			var column4 = '<td class="rate rate' + key.trim().toUpperCase() + '"></td>';
			var column5 = '<td class="handle cssHandle"><img src="images/dragAndDrop.svg" alt="" height="13" width="13" style="position:absolute; padding-top:14px;"></td>';
			var tableRow = '<tr class="currency cssCurrency scriptAction" value="' + key + '" specialAction="toggleCurrency">' + column1 + column2 + column4 + column5 + '</tr>';
			$('.exchangeRateList tbody').append(tableRow);
			g_JaxxApp.getSettings().pushCurrencyToEndOfList(key); // Adds a backend record of the currency order mechanism. //@TODO: add this in one step as an array instead of inside a loop.
		} else {
			console.log('Somehow an invalid key was put ')
		}
	}
	
	//var isDragging = false;
	//$(".exchangeRateList tbody tr")
	//.mousedown(function() {
	//	isDragging = false;
	//})
	//.mousemove(function() {
	//	isDragging = true;
	// })
	//.mouseup(function() {
		//var wasDragging = isDragging;
		//isDragging = false;
		//if (!wasDragging) {
		//g_JaxxApp.getSettings().setCurrencyPosition($(".exchangeRateList tbody tr").attr('value')) $(this).prevAll().length)
		//	$("#throbble").toggle();
		//}
	//});
		/*
		$(".exchangeRateList tbody tr").draggable({
        helper: "clone",
        start: function(event, ui) {
            c.tr = this;
            c.helper = ui.helper;
        }
		});
		$(".exchangeRateList tbody tr").droppable({
			drop: function(event, ui) {
				var inventor = ui.draggable.text();
				$(this).find("input").val(inventor);

				$(c.tr).remove();
				$(c.helper).remove();
			}
		});*/

	/*$('.exchangeRateList tbody').sortable();
	$('.exchangeRateList tbody tr').draggable({
		handle: ".cssHandle"
	});*/
		/*handle: ".cssHandle"*/
	
	$(".exchangeRateList tbody").sortable({
    	/*items: "> tr:not(:first)",*/
    	appendTo: "parent",
    	helper: "clone",
		handle: ".handle",
		update: function(event, ui) {
			// @TODO: Javascript optimization
			var rows = $('.cssMainMenuCurrencies .exchangeRateList tbody tr');
			var currencyArray = [];
			for (var i = 0; i < rows.length; i++){
				currencyArray.push($($('.exchangeRateList tbody tr').get(i)).attr('value'));
			}
			g_JaxxApp.getSettings().setCurrencyPositionList(currencyArray);
		},
	}).disableSelection();
}

JaxxUI.prototype.initialize = function() {
    console.log("[ Jaxx :: UI Initialize ]");

    JaxxUI._sUI = this;

    this._mainPinPadElementName = '';

    this._pinEntryFocus = 0;
    this._f_onPinSuccess = function() {};
    this._f_onPinFailure = function() {};

    this._temporaryPin = "";
    
    this._miningFeeModalSetup = {};

    this.refreshSizes();
    this.initializeElements();
	
	this.mainMenuShowMenu();
}

JaxxUI.prototype.refreshSizes = function() {
    var wWidth = window.innerWidth;
    var wHeight = window.innerHeight;

    //console.log("window dimensions inner (width/height) :: " + window.innerWidth + " :: " + window.innerHeight + " :: outer :: " + window.outerWidth + " :: " + window.outerHeight + " :: " + window.width + " :: " + window.height);

    //console.log(JSON.stringify(window));

    //@note: for Android.

    if (wWidth == 0) {
        if (window.native && window.native.getWindowWidth) {
            wWidth = window.native.getWindowWidth();
            wHeight = window.native.getWindowHeight();
            console.log("Android window dimensions (height/width) :: " + wHeight + " :: " + wWidth);
        }
    }

    //    console.log("screen dimensions :: width :: " + wWidth + " :: " + wHeight);

    //    $('.wallet').css('width', '320px');// !important');
    //    $('.wallet').css('height', '568px');// !important');
    //    this._wWidth = 320;
    //    this._wHeight = 568;
    this._wWidth = wWidth;
    this._wHeight = wHeight;
}

JaxxUI.prototype.getWindowWidth = function() {
    //    if (window.native && window.native.getWindowWidth) {
    //        if (curProfileMode == PROFILE_LANDSCAPE) {
    //            return this._wHeight;
    //        } else {
    //            return this._wWidth;
    //        }
    //    } else {
    return this._wWidth;
    //    }
}

JaxxUI.prototype.getWindowHeight = function() {
    //    if (window.native && window.native.getWindowWidth) {
    //        if (curProfileMode == PROFILE_LANDSCAPE) {
    //            return this._wWidth;
    //        } else {
    //            return this._wHeight;
    //        }
    //    } else {
    return this._wHeight;
    //    }
}

JaxxUI.prototype.getLargerScreenDimension = function() {
    if (this._wWidth > this._wHeight) {
        return this._wWidth;
    } else {
        return this._wHeight;
    }
}

JaxxUI.prototype.setupExternalLink = function(element, linkDisplayText, linkAddress) {
    element.data('linkToExplorer',linkAddress);

    //    console.log("A :: for element :: " + element + " :: trying :: " + linkAddress + " :: " + linkDisplayText)

    //test browser env, simple href
    if(!PlatformUtils.mobileCheck() && !PlatformUtils.extensionCheck() && !PlatformUtils.desktopCheck() ){ 
        element.html("<a href=\"" + linkAddress + "\" target=\"_blank\">" + linkDisplayText + "</a>");
    }
    else if(PlatformUtils.extensionChromeCheck() || PlatformUtils.extensionFirefoxCheck()) { //ChromeExt doesn't support inline js.
        //Possible Workaround #1 : use an href with target blank.
        //        console.log("B :: for element :: " + element + " :: trying :: " + linkAddress + " :: " + linkDisplayText)
        element.html("<a href=\"" + linkAddress + "\" target=\"_blank\">" + linkDisplayText + "</a>");
    } else if(PlatformUtils.mobileiOSCheck()){
        element.html("<a href=\"#\" target=\"_blank\">" + linkDisplayText + "</a>");
        element.unbind('click');
        element.click({param1: linkAddress}, Navigation.tryToOpenExternalLinkMobile);
    } else if (PlatformUtils.mobileAndroidCheck()) {
        element.html("<a href='#' onclick=\"Navigation.tryToOpenExternalLink('"+linkAddress+"')\">" + linkDisplayText + "</a>");
    } else {
        element.html("<a href=\"" + linkAddress + "\" target=\"_blank\">" + linkDisplayText + "</a>");
    }
}

JaxxUI.prototype.showHamburgerMenu = function() {
	$('.hamburger').show();
}

JaxxUI.prototype.hideHamburgerMenu = function() {
	$('.hamburger').hide();
}

JaxxUI.prototype.initializeElements = function() {
    //    console.log("JaxxUI._sUI :: " + JaxxUI._sUI + " :: " + JaxxUI._sUI._numPinEntryFields);
    //	try {
    JaxxUI._sUI.initializePinPad();

    //@note: @here: @todo: this is incorrectly placed, should be set up later when an actual wallet is loaded.
    this.updateCryptoCurrencyBannersInHeader(true);
    this.generateSettingsCurrencyRows();
    this.generateSettingsCryptoCurrencyRows();
    this.initializeCarouselStickyProperty();

    var versionsForNewsUpdates = JSON.parse(getStoredData('criticalVersionUpdatesShown', false));
    if (typeof(versionsForNewsUpdates) !== 'undefined' && versionsForNewsUpdates !== null){
        this._criticalVersionUpdatesShown = versionsForNewsUpdates;
    }
    
    var cryptoCurrenciesAllowed = {};
    if (PlatformUtils.mobileiOSCheck()) {
        cryptoCurrenciesAllowed = HDWalletHelper.cryptoCurrenciesAllowed.ios;
    } else {
        cryptoCurrenciesAllowed = HDWalletHelper.cryptoCurrenciesAllowed.regular;
    }

    var allKeys = Object.keys(HDWalletHelper.dictCryptoCurrency);

    var currenciesEnabled = [];

    for (var i = 0; i < allKeys.length; i++) {
        var cryptoEnabled = cryptoCurrenciesAllowed[allKeys[i]];
        if (typeof(cryptoEnabled) !== 'undefined' && cryptoEnabled !== null && cryptoEnabled === true) {
            currenciesEnabled.push(allKeys[i]);
            var curElement = $('.displayPrivateKeys' + allKeys[i] + 'SettingsButton');

            if (typeof(curElement) !== 'undefined' && curElement !== null) {
                curElement.show();
            }
        } else {
            var curElement = '.displayPrivateKeys' + allKeys[i] + 'SettingsButton';

            try {
                $(curElement).hide();
            } catch(err) {
                console.log("possible error :: " + err);
            }
            
            //@note: hide the etc/eth split button if ETC is not enabled.
            if (allKeys[i] === "ETC") {
                this._disableETCETHSplitOption = true;
                $('.checkForEtcEthSplitToolsButton').hide();
            }
        }
    }
    
//    $('.displayPrivateKeysDashSettingsButton').hide();
    
    
    var pvtKeysDisplayText = "";

    for (var i = 0; i < currenciesEnabled.length; i++) {
        pvtKeysDisplayText += currenciesEnabled[i];
        if (i !== currenciesEnabled.length - 1) {
            if (i === currenciesEnabled.length - 2) {
                pvtKeysDisplayText += " and ";
            } else {
                pvtKeysDisplayText += ", ";
            }
        }
    }


    $('.displayPrivateKeysText').text(pvtKeysDisplayText);
    //this.initializeCarousels(); // Must be run after this.updateCryptoCurrencyBannersInHeader(true);
    //this.updateCoinBannerCarousel();
    //		this.animateHamburgerMenu();
    //	} catch(error) {
    //		console.log('Failed to initialize the programmatic elements of the table.');
    //		console.log(error.message);
    //	}
}

JaxxUI.prototype.initializePinPad = function() {
    JaxxUI._sUI.deinitializePinPad();

    console.log("initialize pin pad");
    for (var i = 0; i < JaxxUI._sUI._numPinEntryFields; i++) {
        var element = $(JaxxUI._sUI._mainPinPadElementName + ' .pinEntry' + i);

        element.index = i;

        if (i !== 0) {
            element.prevElement = $(JaxxUI._sUI._mainPinPadElementName + ' .pinEntry' + (i - 1));
        }

        if (i < JaxxUI._sUI._numPinEntryFields - 1) {
            element.nextElement = $(JaxxUI._sUI._mainPinPadElementName + ' .pinEntry' + (i + 1));
        }

        element.bind('input', { prevElement: element.prevElement, curElement: element, newFocusTarget: element.nextElement }, JaxxUI._sUI.enterPinData);

        element.bind('keyup', { prevElement: element.prevElement, curElement: element, newFocusTarget: element.nextElement }, JaxxUI._sUI.removePinData);

        element.bind('focus', { index: i }, function(e) {
            $(e.target).val("");
            JaxxUI._sUI._pinEntryFocus = e.data.index;
        });

        if (PlatformUtils.mobileCheck()) {
            element.attr('disabled', 'true');
        }

        //        console.log("setup :: " + JSON.stringify(element) + " :: nextElement :: " + element.nextElement);
    }

    for (var i = 0; i < 10; i++) {
        var element = $(JaxxUI._sUI._mainPinPadElementName + ' .numPadButton' + i);
        var curVal = i;

        element.bind('click', { curNum: i }, JaxxUI._sUI.clickNumPad);
    }

    $(JaxxUI._sUI._mainPinPadElementName + ' .numPadDelete').bind('click', null, function() {
        if (JaxxUI._sUI._pinEntryFocus > 0) {
            var inputElement = $(JaxxUI._sUI._mainPinPadElementName + ' .pinEntry' + JaxxUI._sUI._pinEntryFocus);

            if (PlatformUtils.mobileCheck()) {
                var event = {};
                event.keyCode = 8;
                event.data = {};
                event.data.curElement = $(JaxxUI._sUI._mainPinPadElementName + ' .pinEntry' + JaxxUI._sUI._pinEntryFocus);

                event.data.curElement.val('');

                if (JaxxUI._sUI._pinEntryFocus > 0) {
                    event.data.prevElement = $(JaxxUI._sUI._mainPinPadElementName + ' .pinEntry' + (JaxxUI._sUI._pinEntryFocus - 1));
                }

                JaxxUI._sUI.removePinData(event);

                if (JaxxUI._sUI._pinEntryFocus > 0) {
                    JaxxUI._sUI._pinEntryFocus--;
                }
            } else {
                inputElement.trigger(jQuery.Event('keyup', {keyCode: 8}));
            }
        } else {
            var inputElement = $(JaxxUI._sUI._mainPinPadElementName + ' .pinEntry' + JaxxUI._sUI._pinEntryFocus);

            if (PlatformUtils.mobileCheck()) {
                inputElement.val('');
            } else {
                inputElement.focus();
            }
        }
    });


    $(JaxxUI._sUI._mainPinPadElementName + ' .numPadClear').bind('click', null, function() {
        JaxxUI._sUI.clearAllNumPadData();
    });
}

JaxxUI.prototype.deinitializePinPad = function() {
    for (var i = 0; i < JaxxUI._sUI._numPinEntryFields; i++) {
        var element = $(JaxxUI._sUI._mainPinPadElementName + ' .pinEntry' + i);

        element.unbind('input');
        element.unbind('keyup');
        element.unbind('focus');
    }

    for (var i = 0; i < 10; i++) {
        var element = $(JaxxUI._sUI._mainPinPadElementName + ' .numPadButton' + i);

        element.unbind('click');
    }

    $(JaxxUI._sUI._mainPinPadElementName + ' .numPadDelete').unbind();
    $(JaxxUI._sUI._mainPinPadElementName + ' .numPadClear').unbind();
}

JaxxUI.prototype.removePinData = function(e) {
    //    console.log(e.keyCode);

    var prevElement = e.data.prevElement;
    var curElement = e.data.curElement;

    if (e.keyCode == 8) {
        curElement.val("");

        if (typeof(prevElement) !== 'undefined') {
            prevElement.focus();
        }
    }

    JaxxUI._sUI.setupUIWithEnteredPin(JaxxUI._sUI.getEnteredPINCode());
}

JaxxUI.prototype.enterPinData = function(e) {

    var prevElement = e.data.prevElement;
    var curElement = e.data.curElement;
    var newFocusTarget = e.data.newFocusTarget;

    var curVal = curElement.val();

    //        console.log("entered input:: " + JSON.stringify(curElement) + " :: " + curVal + " :: " + newFocusTarget);

    if (isDecimal(curVal)) {
        curElement.val(curVal.substring(curVal.length - 1));

        if (typeof(newFocusTarget) !== 'undefined') {
            newFocusTarget.focus();
        }
    } else {
        curElement.val("");
    }

    JaxxUI._sUI.setupUIWithEnteredPin(JaxxUI._sUI.getEnteredPINCode());
}


JaxxUI.prototype.clickNumPad = function(e) {
    //    console.log(e.data + " :: " + JaxxUI._sUI._pinEntryFocus);

    var inputElement = $(JaxxUI._sUI._mainPinPadElementName + ' .pinEntry' + JaxxUI._sUI._pinEntryFocus);

    if (JaxxUI._sUI._pinEntryFocus < JaxxUI._sUI._numPinEntryFields - 1) {
        JaxxUI._sUI._pinEntryFocus++;

        var nextElement = $(JaxxUI._sUI._mainPinPadElementName + ' .pinEntry' + JaxxUI._sUI._pinEntryFocus);

        nextElement.focus();
    } else {
        //        console.log("focus binding");
        inputElement.unbind('focus');

        inputElement.focus();

        inputElement.bind('focus', { index: JaxxUI._sUI._pinEntryFocus }, function(e) {
            $(e.target).val("");
            JaxxUI._sUI._pinEntryFocus = e.data.index;
        });
    }

    inputElement.val(e.data.curNum);
    inputElement.trigger('keyup');
}


JaxxUI.prototype.clearAllNumPadData = function() {
    JaxxUI._sUI._pinEntryFocus = 0;

    for (var i = 0; i < JaxxUI._sUI._numPinEntryFields; i++) {
        var inputElement = $(JaxxUI._sUI._mainPinPadElementName + ' .pinEntry' + i);
        inputElement.val('');
    }

    var inputElement = $(JaxxUI._sUI._mainPinPadElementName + ' .pinEntry' + JaxxUI._sUI._pinEntryFocus);
    inputElement.focus();
}


JaxxUI.prototype.getEnteredPINCode = function() {
    var pinCode = "";

    for (var i = 0; i < JaxxUI._sUI._numPinEntryFields; i++) {
        var element = $(JaxxUI._sUI._mainPinPadElementName + ' .pinEntry' + i);
        pinCode += element.val();
    }

    return pinCode;
}

JaxxUI.prototype.setupUIWithEnteredPin = function(pinCode) {
    if (g_JaxxApp.getUser().hasPin()) {
        var validPin = g_JaxxApp.getUser().checkForValidPin(pinCode);

        if (validPin) {
            JaxxUI._sUI._f_onPinSuccess();
        } else {
            JaxxUI._sUI._f_onPinFailure();
        }
    } else {
        JaxxUI._sUI._f_onPinFailure();
    }
}

JaxxUI.prototype.setOnPinSuccess = function(callback) {
    JaxxUI._sUI._f_onPinSuccess = callback;
}

JaxxUI.prototype.setOnPinFailure = function(callback) {
    JaxxUI._sUI._f_onPinFailure = callback;
}

JaxxUI.prototype.showEnterPinModal = function(successCallback) {
    JaxxUI._sUI.setOnPinSuccess(function() {
        JaxxUI._sUI.deinitializePinPad();
        Navigation.closeModal();
        successCallback(null);
    });

    JaxxUI._sUI.setOnPinFailure(function() {
    });

    JaxxUI._sUI.setupPinPad('.modalSendEnterPinPad');

    Navigation.openModal('enterPin');

    JaxxUI._sUI.clearAllNumPadData();

    var inputElement = $(JaxxUI._sUI._mainPinPadElementName + ' .pinEntry' + JaxxUI._sUI._pinEntryFocus);
    inputElement.trigger('keyup');
    inputElement.focus();
}

JaxxUI.prototype.turnHoverEffectOff = function(){
    for (var i = 0; i < COIN_NUMCOINTYPES; i++){
        if (i !== curCoinType){
            this._coinDontHover[i] = true;
        }
    }
}

JaxxUI.prototype.turnHoverEffectOn = function(){
    for (var i = 0; i < COIN_NUMCOINTYPES; i++){
        if (i !== curCoinType){
            this._coinDontHover[i] = false;
        }
    }
}

JaxxUI.prototype.resetCoinButton = function(coinType) {
    var self = this;
    var coinButtonName = HDWalletPouch.getStaticCoinPouchImplementation(coinType).uiComponents['coinButtonName'];
    
    var coinButtonSVGName = HDWalletPouch.getStaticCoinPouchImplementation(coinType).uiComponents['coinButtonSVGName'];
    
    $(coinButtonName).css({background: 'url(images/' + coinButtonSVGName + '-gray.svg) no-repeat center center', color: '#888888'});
    $(coinButtonName).removeClass('cssSelected');
    $(coinButtonName).off('mouseover');
    $(coinButtonName).off('mouseleave');
    $(coinButtonName).on({
        mouseover: function(){
            if (!self._coinDontHover[coinType]) {
                var coinButtonSVGName = HDWalletPouch.getStaticCoinPouchImplementation(coinType).uiComponents['coinButtonSVGName'];
                $(this).css({background: 'url(images/' + coinButtonSVGName + '.svg) no-repeat center center', color: '#FFFFFF'});
            }
        },
        mouseleave: function(){
            if (!self._coinDontHover[coinType]) {
                var coinButtonSVGName = HDWalletPouch.getStaticCoinPouchImplementation(coinType).uiComponents['coinButtonSVGName'];
                $(this).css({background: 'url(images/' + coinButtonSVGName + '-gray.svg) no-repeat center center', color: '#888888'});
                $(this).removeClass('cssSelected');
            }
        },
        click: function(){
            //$(this).off('mouseleave');
        }
    });
}


JaxxUI.prototype.setupMiningFeeSelector = function(miningFeeRadioButtonSetOverride) {
//    console.log("$('.modal.send.averageMiningFee') :: " + $('.modal.send.averageMiningFee'));

    if (typeof(this._miningFeeModalSetup[miningFeeRadioButtonSetOverride]) === 
        'undefined' || this._miningFeeModalSetup[miningFeeRadioButtonSetOverride] === null) {
        this._miningFeeModalSetup[miningFeeRadioButtonSetOverride] = true;

        $('input[type=radio][name=miningFee' + miningFeeRadioButtonSetOverride + 
        'Button]').on('change', function() {
            //            console.log("clicky :: " + JSON.stringify($(this).val()));
//            if (this.value === 'customMiningFee') {
//                $('.modal.send .slider').slideDown();
//
//                var curMiningFeeDict = wallet.getPouchFold(COIN_BITCOIN).getMiningFeeDict();
//
//                var lowerLimit = 20;
//                var upperLimit = parseFloat(curMiningFeeDict.fastestFee);
//
//                var overrideFee = parseFloat(wallet.getPouchFold(COIN_BITCOIN).getCurrentMiningFee()) / 1000.0;
//
//                console.log("overrideFee :: " + overrideFee + " :: lowerLimit :: " + lowerLimit + " :: upperLimit :: " + upperLimit);
//
//                if (upperLimit !== 0) {
//                    for (var i = 0; i < 1000; i++) {
//                        if (lowerLimit > upperLimit) {
//                            lowerLimit /= 2;
//                        }
//                    } 
//                }
//
//                var curPercent = (overrideFee - lowerLimit) / (upperLimit - lowerLimit);
//
//                //                console.log("curPercent :: " + curPercent);
//                $('.modal.send .slider').slider('value', parseInt(curPercent * 100));
//            } else {
                //                $('.modal.send .slider').slideUp();
            var curMiningFeeDict = wallet.getPouchFold(COIN_BITCOIN).getMiningFeeDict();

            var overrideFee = 0;

            var lowerLimit = 20;
            var slowerLimit = parseFloat(curMiningFeeDict.hourFee);
            var fasterLimit = parseFloat(curMiningFeeDict.halfHourFee);

            if (slowerLimit !== 0) {
                for (var i = 0; i < 1000; i++) {
                    if (lowerLimit > slowerLimit) {
                        lowerLimit /= 2;
                    }
                } 
            }
            
            if (this.value === 'slowMiningFee' + miningFeeRadioButtonSetOverride ) {
                overrideFee = (lowerLimit * 1000);
                wallet.getPouchFold(COIN_BITCOIN).setMiningFeeLevel(HDWalletPouch.MiningFeeLevelSlow);
            } else if (this.value === 'averageMiningFee' + miningFeeRadioButtonSetOverride) {
                overrideFee = (slowerLimit * 1000);
                wallet.getPouchFold(COIN_BITCOIN).setMiningFeeLevel(HDWalletPouch.MiningFeeLevelAverage);
            } else if (this.value === 'fastMiningFee' + miningFeeRadioButtonSetOverride) {
                overrideFee = (fasterLimit * 1000);
                wallet.getPouchFold(COIN_BITCOIN).setMiningFeeLevel(HDWalletPouch.MiningFeeLevelFast);
            }

//            var newMiningFeeLevel = wallet.getPouchFold(COIN_BITCOIN).getMiningFeeLevel();
//            console.log("miningFeeRadioButtonSetOverride :: " + miningFeeRadioButtonSetOverride + " :: radiobutton value :: " + this.value + " :: overrideFee :: " + overrideFee + " :: newMiningFeeLevel :: " + newMiningFeeLevel);

            wallet.getPouchFold(COIN_BITCOIN).setMiningFeeOverride(overrideFee);

            updateFromInputFieldEntry();
            specialAction('walletSendReceive');
            
//        }
        });

        //        var sliderChanged = function(event, ui) {
        //            if (event.originalEvent) {
        //                //manual change
        //                console.log(ui.value);
        //                //@note: @todo: move the following function to this class.
        //
        //                var curMiningFeeDict = wallet.getPouchFold(COIN_BITCOIN).getMiningFeeDict();
        //
        //                var lowerLimit = 20;
        //                var upperLimit = parseFloat(curMiningFeeDict.fastestFee);
        //
        //                var overrideFee = 0;
        //
        //                if (upperLimit !== 0) {
        //                    for (var i = 0; i < 1000; i++) {
        //                        if (lowerLimit > upperLimit) {
        //                            lowerLimit /= 2;
        //                        }
        //                    } 
        //
        //                    var modifier = parseFloat(ui.value) / 100.0;
        //
        ////                    console.log("modifier :: " + modifier);
        //
        //                    overrideFee = lowerLimit + (upperLimit - lowerLimit) * modifier;
        //                    overrideFee = parseInt(overrideFee * 1000);
        //                }
        //
        ////                console.log("overrideFee :: " + overrideFee);
        //
        //                wallet.getPouchFold(COIN_BITCOIN).setMiningFeeOverride(overrideFee);
        //
        //                updateFromInputFieldEntry();
        //                specialAction('walletSendReceive');
        //            }
        //            else {
        //                //programmatic change
        //            }
        //        }
        //
        //        $('.modal.send .slider').slider({
        //            range: "max",
        //            min: 0,
        //            max: 100,
        //            value: 50,
        //            slide: sliderChanged,
        //            change: sliderChanged
        //        });
        //        
        //        $('.modal.send .slider').slideUp();
        
        updateFromInputFieldEntry();
        specialAction('walletSendReceive');
    }
    
    this.overrideMiningFeeRadioButton(miningFeeRadioButtonSetOverride);
}

JaxxUI.prototype.overrideMiningFeeRadioButton = function(miningFeeRadioButtonSetOverride) {
    var curMiningFeeDict = wallet.getPouchFold(COIN_BITCOIN).getMiningFeeDict();

    var overrideFee = 0;

    var lowerLimit = 20;
    var slowerLimit = parseFloat(curMiningFeeDict.hourFee);
    var fasterLimit = parseFloat(curMiningFeeDict.halfHourFee);

    if (slowerLimit !== 0) {
        for (var i = 0; i < 1000; i++) {
            if (lowerLimit > slowerLimit) {
                lowerLimit /= 2;
            }
        } 
    }

    var curMiningFeeOverride = lowerLimit;


    var curMiningFeeLevel = wallet.getPouchFold(COIN_BITCOIN).getMiningFeeLevel();

    if (curMiningFeeLevel === HDWalletPouch.MiningFeeLevelSlow) {
        $('input:radio[type=radio][name=miningFee' + miningFeeRadioButtonSetOverride + 'Button][id=slowMiningFee' + miningFeeRadioButtonSetOverride + ']').prop('checked', true);

        curMiningFeeOverride = lowerLimit;
    } else if (curMiningFeeLevel === HDWalletPouch.MiningFeeLevelAverage) {
        $('input:radio[type=radio][name=miningFee' + miningFeeRadioButtonSetOverride + 'Button][id=averageMiningFee' + miningFeeRadioButtonSetOverride + ']').prop('checked', true);

        curMiningFeeOverride = slowerLimit;
    } else if (curMiningFeeLevel === HDWalletPouch.MiningFeeLevelFast) {
        $('input:radio[type=radio][name=miningFee' + miningFeeRadioButtonSetOverride + 'Button][id=fastMiningFee' + miningFeeRadioButtonSetOverride + ']').prop('checked', true);

        curMiningFeeOverride = fasterLimit;
    }

    overrideFee = (curMiningFeeOverride * 1000);

//    console.log("overrideMiningFeeRadioButton :: " + miningFeeRadioButtonSetOverride + " :: curMiningFeeLevel :: " + curMiningFeeLevel + " :: overrideFee :: " + overrideFee);

    wallet.getPouchFold(COIN_BITCOIN).setMiningFeeOverride(overrideFee);
}

JaxxUI.prototype.showSendModal = function() {
    
    if (curCoinType === COIN_BITCOIN) {
        this.setupMiningFeeSelector('Generic');
        
        $('.modal.send .miningFeeSelector').show();
    } else {
        $('.modal.send .miningFeeSelector').hide();
    }
    
    if (!$('.modal.send').hasClass('visible')) {
        Navigation.openModal('send');
    }
}

JaxxUI.prototype.showShiftModal = function() {

    if (curCoinType === COIN_BITCOIN) {
        this.setupMiningFeeSelector('ShapeShift');
        
        $('.modal.shift .miningFeeSelector').show();
    } else {
        $('.modal.shift .miningFeeSelector').hide();
    }

    if (!$('.modal.shift').hasClass('visible')) {
        Navigation.openModal('shift');
    }
}

JaxxUI.prototype.setupPinPad = function(elementName) {
    JaxxUI._sUI._mainPinPadElementName = elementName;

    JaxxUI._sUI.initializePinPad();

    console.log($(JaxxUI._sUI._mainPinPadElementName + ' .pinEntry0'));
}

JaxxUI.prototype.showEnterPinSettings = function() {
    if (g_JaxxApp.getUser().hasPin()) {
        JaxxUI._sUI.showConfirmExistingPinSettings(function() {
            JaxxUI._sUI.showEnterNewPinSettings("Your PIN has been changed.");
        });
    } else {
        JaxxUI._sUI.showEnterNewPinSettings("Your PIN has been set.");
    }
}

JaxxUI.prototype.showRemovePinSettings = function() {
    JaxxUI._sUI.showConfirmExistingPinSettings(function() {
        console.log("remove pin");
        JaxxUI._sUI.clearUserPin();
    });
}

JaxxUI.prototype.showConfirmExistingPinSettings = function(successCallback) {
    JaxxUI._sUI.setupPinPad('.settingsEnterPinPad');

    $('.settingsEnterPinPadText').text('Confirm PIN')
    $('.settingsEnterNewPinConfirmButton').hide();

    JaxxUI._sUI.setOnPinSuccess(function() {
        JaxxUI._sUI.deinitializePinPad();
        successCallback();
    });

    JaxxUI._sUI.setOnPinFailure(function() { 

    });

    JaxxUI._sUI.clearAllNumPadData();

    var inputElement = $(JaxxUI._sUI._mainPinPadElementName + ' .pinEntry' + JaxxUI._sUI._pinEntryFocus);
    inputElement.trigger('keyup');
    inputElement.focus();
}

JaxxUI.prototype.showEnterNewPinSettings = function(successMessage) {
    JaxxUI._sUI.setupPinPad('.settingsEnterPinPad');

    $('.settingsEnterPinPadText').text('Select New PIN');
    $('.settingsEnterNewPinConfirmButton').hide();

    var checkForValid = function() {
        var enteredPin = JaxxUI._sUI.getEnteredPINCode();

        //        console.log("entered pin :: " + enteredPin);

        if (enteredPin.length === JaxxUI._sUI._numPinEntryFields) {
            JaxxUI._sUI.setupTemporaryPin(JaxxUI._sUI.getEnteredPINCode());
            JaxxUI._sUI.showConfirmNewPinSettings(successMessage);
        }
    }

    JaxxUI._sUI.setOnPinSuccess(checkForValid);
    JaxxUI._sUI.setOnPinFailure(checkForValid);

    JaxxUI._sUI.clearAllNumPadData();

    var inputElement = $(JaxxUI._sUI._mainPinPadElementName + ' .pinEntry' + JaxxUI._sUI._pinEntryFocus);
    inputElement.trigger('keyup');
    inputElement.focus();
}

JaxxUI.prototype.showConfirmNewPinSettings = function(successMessage) {
    $('.settingsEnterPinPadText').text('Confirm New PIN');
    $('.settingsEnterNewPinConfirmButton').hide();

    var checkForMatchingPin = function() {
        var enteredPin = JaxxUI._sUI.getEnteredPINCode();

        if (enteredPin === JaxxUI._sUI._temporaryPin) {
            g_JaxxApp.getUser().setPin(enteredPin);

            Navigation.clearSettings();
            Navigation.flashBanner(successMessage, 5);
        }
    }


    JaxxUI._sUI.setOnPinSuccess(checkForMatchingPin);
    JaxxUI._sUI.setOnPinFailure(checkForMatchingPin);

    JaxxUI._sUI.clearAllNumPadData();

    var inputElement = $(JaxxUI._sUI._mainPinPadElementName + ' .pinEntry' + JaxxUI._sUI._pinEntryFocus);
    inputElement.trigger('keyup');

    inputElement.focus();
}

JaxxUI.prototype.setupTemporaryPin = function(temporaryPin) {
    JaxxUI._sUI._temporaryPin = temporaryPin;
}

JaxxUI.prototype.clearUserPin = function() {
    g_JaxxApp.getUser().clearPin();
    Navigation.clearSettings();
    Navigation.flashBanner("Your PIN has been removed.", 5);
}

JaxxUI.prototype.showSettingsMnemonicConfirmPin = function(settingsPinPadElementName, successCallback) {
    JaxxUI._sUI.setupPinPad(settingsPinPadElementName);

    JaxxUI._sUI.setOnPinSuccess(function() {
        //        console.log("pin success");
        JaxxUI._sUI.deinitializePinPad();
        successCallback();
    });

    JaxxUI._sUI.setOnPinFailure(function() { 
        //        console.log("pin failure");
    });

    JaxxUI._sUI.clearAllNumPadData();

    var inputElement = $(JaxxUI._sUI._mainPinPadElementName + ' .pinEntry' + JaxxUI._sUI._pinEntryFocus);

    inputElement.trigger('keyup');
    inputElement.focus();
}

JaxxUI.prototype.setupTransactionList = function(coinType, numItemsToCreate) {
    this._numHistoryElementsDisplayed[coinType] = this._numHistoryElementsDefault;
    
    for (var i = 0; i < numItemsToCreate; i++) {
//                console.log("creating new transaction list row :: " + i);
        this.createNewTransactionRow(coinType);
    }

    var self = this;

    var transactionsListElement = HDWalletPouch.getStaticCoinPouchImplementation(coinType).uiComponents['transactionsListElementName'];

    var transactionTable = $('.table.transactions' + transactionsListElement);
    
    var scrollStopFunction = function() {
        self.checkForTXScroll(coinType);
//
//        var coinType = parseInt($(this).attr('coinType'));
//
//        clearTimeout($.data(this, 'scrollTimer'));
//        $.data(this, 'scrollTimer', setTimeout(function() {
//
//            self.checkForTXScroll(coinType);
//        }, 50));
    }
    
    //@note: attribute the coinType to the table for later 'scrollStop' functionality reference.
    transactionTable.attr('coinType', coinType);
    
    //@note: basic 'scrollStop' functionality.
    transactionTable.off('scroll', scrollStopFunction);
    transactionTable.on('scroll', scrollStopFunction);

//    console.log("table :: " + transactionTable + " :: number of children :: " + transactionTable.children('.tableRow').length + " :: " + transactionTable.coinType);
}

JaxxUI.prototype.checkForTXScroll = function(coinType) {
    coinType = parseInt(coinType);

    var transactionsListElement = HDWalletPouch.getStaticCoinPouchImplementation(coinType).uiComponents['transactionsListElementName'];

    var transactionTable = $('.table.transactions' + transactionsListElement);
    
    var numChildren = transactionTable.children('.tableRow').length;

    if (numChildren > 1) {
        //@note: this works because only one can be expanded at a time.
        var minHeight = 0;

        minHeight = $(transactionTable.children('.tableRow')[0]).height();
        var otherMinHeight = $(transactionTable.children('.tableRow')[1]).height();
        if (otherMinHeight < minHeight) {
            minHeight = otherMinHeight;
        }

        if (minHeight !== 0) {
            var numRowsScrolled = transactionTable.scrollTop() / minHeight;
            var numRowsVisible = transactionTable.height() / minHeight;

//            console.log("table :: " + coinType + 
//            " :: scroll :: numRowsScrolled :: " + numRowsScrolled + " :: numRowsVisible :: " + numRowsVisible + " :: history length :: " + g_JaxxApp.getUI().getTXHistoryLength(coinType) + " :: " + (numRowsScrolled + numRowsVisible));

            if (numRowsScrolled + numRowsVisible >= g_JaxxApp.getUI().getTXHistoryLength(coinType)) {
//                console.log("table :: increase visible table cells");
                g_JaxxApp.getUI().increaseTXHistoryLength(coinType);
            }
        }

//        console.log("table scroll :: " + transactionTable + " :: coinType :: " + transactionTable.attr('coinType') + " :: numChildren :: " + numChildren + " :: scrollTop :: " + transactionTable.scrollTop() + " :: row min height :: " + minHeight + " :: table height :: " + transactionTable.height() + " :: table row height :: " + (minHeight * numChildren));
    }        
}

JaxxUI.prototype.getTXHistoryLength = function(coinType) {
    return this._numHistoryElementsDisplayed[coinType];
}

JaxxUI.prototype.increaseTXHistoryLength = function(coinType) {
//    console.log("table :: " + coinType + " :: displayed length :: " +  this._numHistoryElementsDisplayed[coinType] + " :: full tx history length :: " + this._txFullHistory[coinType].length);
    if (this._numHistoryElementsDisplayed[coinType] < this._txFullHistory[coinType].length) {
        this._numHistoryElementsDisplayed[coinType] += this._numHistoryElementsDefault;

//        console.log("table :: " + coinType + " :: new tx history length :: " + this._numHistoryElementsDisplayed[coinType]);
        this.updateTransactionList(coinType, this._txFullHistory[coinType]);
    }
}

JaxxUI.prototype.resetTXHistory = function(coinType) {
    this._numHistoryElementsDisplayed[coinType] = this._numHistoryElementsDefault;

    var transactionsListElement = HDWalletPouch.getStaticCoinPouchImplementation(coinType).uiComponents['transactionsListElementName'];

    var transactionTable = $('.table.transactions' + transactionsListElement);
    
//    $('html, body').animate({
//        scrollTop: transactionTable.offset().top
//    }, 500);
    transactionTable.scrollTop(0);
    
//    console.log("transactionTable.scrollTop :: " + transactionTable.scrollTop());
}

JaxxUI.prototype.resetTransactionList = function(coinType) {
    for (var i = 0; i < COIN_NUMCOINTYPES; i++) {
        var transactionsListElement = HDWalletPouch.getStaticCoinPouchImplementation(coinType).uiComponents['transactionsListElementName'];

        var transactionTableElementNoTransactions = $('.table.transactions' + transactionsListElement + ' .noTransactions');
    
        transactionTableElementNoTransactions.show();

        var transactionTableElementTableRows = $('.table.transactions' + transactionsListElement + ' .tableRow');

        transactionTableElementNoTransactions.remove();
    }
}

JaxxUI.prototype.isTransactionListEqualToHistory = function(coinType, history) {
    var transactionsListElement = HDWalletPouch.getStaticCoinPouchImplementation(coinType).uiComponents['transactionsListElementName'];

    var transactionTable = $('.table.transactions' + transactionsListElement);

    var tableChildren = transactionTable.children('.tableRow');
    var numExistingRows = tableChildren.length;

    //@note: check for differences between existing tx list and history.
    var itemCountDiff = history.length - numExistingRows;

//    console.log("[pre] table :: " + transactionTable + " :: number of children :: " + numExistingRows + " :: history.length :: " + history.length + " :: itemCountDiff :: " + itemCountDiff);


    if (itemCountDiff === 0) {
        return true;
    } else {
        return false;
    }
}

JaxxUI.prototype.createNewTransactionRow = function(coinType) {
    var transactionsListElement = HDWalletPouch.getStaticCoinPouchImplementation(coinType).uiComponents['transactionsListElementName'];

    var transactionTemplateElement = HDWalletPouch.getStaticCoinPouchImplementation(coinType).uiComponents['transactionTemplateElementName'];

    var transactionTable = $('.table.transactions' + transactionsListElement);
    var templateTransaction = $('.transactionRowTemplate' + transactionTemplateElement + ' > div');

    var row = templateTransaction.clone(true);
    row.addClass('tableRow');

//    console.log("with table :: " + JSON.stringify($(transactionTable)) + " :: cloning :: " + JSON.stringify(templateTransaction) + " :: " + JSON.stringify(row));

    $('.receiveConfirmations', row).hide();
    $('.sendToAddress', row).show();
    // $(row, '.transactionDirectionHeader').text("Received From");
    $('.transactionDirectionHeader', row).text("Sent To");
	
    row.attr('rowtxid', -1);

    (function (row) {
        $('.glance', row).click(function() {
            var thisElement = $(this).parent()[0];

            //@note: hide the send/receive tabs, hide all other table elements.
            Navigation.returnToDefaultView();
            Navigation.hideTransactionHistoryDetails(thisElement);

            $('.verbose', row).slideToggle();
        });

        $('.verbose', row).css({display: 'none'}).click(function() {
            //                    console.log("verbose :: " + row);
            $('.verbose', row).slideToggle();
        });
    })(row);

    transactionTable.append(row);
}

JaxxUI.prototype.updateTransactionList = function(coinType, history) {
    //return;
    
//    console.log("updateTransactionList :: " + coinType + " :: " + history.length + " :: this._numHistoryElementsDisplayed[coinType] :: " + this._numHistoryElementsDisplayed[coinType]);
    this._txFullHistory[coinType] = history;
    
    history = history.slice(0, this._numHistoryElementsDisplayed[coinType]);

    var transactionsListElement = HDWalletPouch.getStaticCoinPouchImplementation(coinType).uiComponents['transactionsListElementName'];

    var transactionTable = $('.table.transactions' + transactionsListElement);
    
    var tableChildren = transactionTable.children('.tableRow');
    var numExistingRows = tableChildren.length;

//    console.log("[pre] table :: " + transactionTable + " :: number of children :: " + numExistingRows + " :: history.length :: " + history.length);

    //@note: check for differences between existing tx list and history. push or pop as necessary.
    var itemCountDiff = history.length - numExistingRows;
    if (itemCountDiff < 0) {
        for (var i = 0; i < -itemCountDiff; i++) {
            transactionTable.children('.tableRow').last().remove();
        }

        tableChildren = transactionTable.children('.tableRow');
        numExistingRows = tableChildren.length;
    } else if (itemCountDiff > 0) {
        for (var i = 0; i < itemCountDiff; i++) {
            this.createNewTransactionRow(coinType);
        }

        tableChildren = transactionTable.children('.tableRow');
        numExistingRows = tableChildren.length;
    }

//    console.log("[post] table :: " + transactionTable + " :: number of children :: " + numExistingRows + " :: history.length :: " + history.length);


    if (history.length === 0) {
        $('.noTransactions', transactionTable).show();
    } else {
        $('.noTransactions', transactionTable).hide();
    }

    for (var i = 0; i < history.length; i++) {
        var item = history[i];

        var row = $(tableChildren[i]);

        //@note: caches the rows via txid.
        var rowtxid = row.attr('rowtxid');
        if (history[i].txid === rowtxid) {
            continue;
        } else {
            row.attr('rowtxid', history[i].txid);
        }

        if (item.deltaBalance < 0) {
            $('.receiveConfirmations', row).hide();
            $('.sendToAddress', row).show();
            $('.transactionDirectionHeader', row).text("Sent To");
        } else {
            $('.receiveConfirmations', row).show();
            $('.sendToAddress', row).hide();
            $('.transactionDirectionHeader', row).text("Received From");
        }

        //            console.log("bitcoin history item :: " + i + " :: " + item.deltaBalance);

        var itemAmount = item.deltaBalance;
        var amountFieldText = "";
        var blockExplorerEntrypoint = "";
        var itemTime = 0;

        if (coinType === COIN_BITCOIN) {
            if (itemAmount < 0) {
                itemAmount -= item.miningFee;
            }
			
			
            amountFieldText = ((itemAmount > 0) ? '+': '') + HDWalletHelper.convertSatoshisToBitcoins(itemAmount) + ' BTC';

            itemTime = item.timestamp;

//            blockExplorerEntrypoint = HDWallet.TESTNET ? 'https://tbtc.blockr.io/tx/info/' : 'https://blockr.io/tx/info/';
            blockExplorerEntrypoint = 'https://live.blockcypher.com/btc/tx/';

            $('.blockHeight', row).text(item.blockHeight);

            $('.miningFee', row).text(HDWalletHelper.convertSatoshisToBitcoins(item.miningFee));
        } else if (coinType === COIN_ETHEREUM) {
            var indexOfDecimalPlace = itemAmount.indexOf('.');
            
            if (itemAmount.length - indexOfDecimalPlace - 1 > 8) { // If the string is too long.
                // Then we cut it off and add ....
                itemAmount = itemAmount.substring(0, indexOfDecimalPlace + 1 + 8) + '...';
            }
            
            
            //var decimalDifference = parseFloat(item.deltaBalance) - parseFloat(parseFloat(item.deltaBalance).toFixed(8));

            //if (decimalDifference !== 0.0) {
            //    itemAmount = parseFloat(item.deltaBalance).toFixed(8) + "...";
            //}
			
			// This is where logic is inserted that allows us to create transaction display data.
			
//			console.log("(" + item.toAddress + "," + wallet.theDAOAddress + ")");
//            if (item.toAddressFull === HDWalletHelper.theDAOAddress) {
//            // This 'if' branch is entered when a DAO transaction takes place.
//                amountFieldText = ((parseFloat(itemAmount) > 0) ? '+': '') + itemAmount + ' ETH';
//                $( "div[rowtxid=" + item.txid + "]").find(".cssDisplayForDAOImageInTransaction").css("display", "block"); // Displays the 'td' element that has the attached image.
//
//            } else {
                // This 'if' branch is entered when an ETH transaction takes place.
                amountFieldText = ((parseFloat(itemAmount) > 0) ? '+': '') + itemAmount + ' ETH';	
//            }

            // This is where logic is inserted that allows us to create transaction display data.

            //@note: @here: @todo: @augur:
            
            
            //			console.log("(" + item.toAddress + "," + wallet.theDAOAddress + ")");
            //            if (item.toAddressFull === HDWalletHelper.theDAOAddress) {
            //            // This 'if' branch is entered when a DAO transaction takes place.
            //                amountFieldText = ((parseFloat(itemAmount) > 0) ? '+': '') + itemAmount + ' ETH';
            //                $( "div[rowtxid=" + item.txid + "]").find(".cssDisplayForDAOImageInTransaction").css("display", "block"); // Displays the 'td' element that has the attached image.
            //
            //            } else {
            // This 'if' branch is entered when an ETH transaction takes place.
            amountFieldText = ((parseFloat(itemAmount) > 0) ? '+': '') + itemAmount + ' ETH';	
            //            }

            itemTime = item.timestamp * 1000;

            blockExplorerEntrypoint = 'https://www.etherscan.io/tx/';

            $('.blockNumber', row).text(item.blockNumber);

            $('.gasCost', row).text(item.gasCost + " Ether");
        } else if (coinType === COIN_ETHEREUM_CLASSIC) {
            var indexOfDecimalPlace = itemAmount.indexOf('.');

            if (itemAmount.length - indexOfDecimalPlace - 1 > 8) { // If the string is too long.
                // Then we cut it off and add ....
                itemAmount = itemAmount.substring(0, indexOfDecimalPlace + 1 + 8) + '...';
            }


            //var decimalDifference = parseFloat(item.deltaBalance) - parseFloat(parseFloat(item.deltaBalance).toFixed(8));

            //if (decimalDifference !== 0.0) {
            //    itemAmount = parseFloat(item.deltaBalance).toFixed(8) + "...";
            //}

            // This is where logic is inserted that allows us to create transaction display data.

            //			console.log("(" + item.toAddress + "," + wallet.theDAOAddress + ")");
//            if (item.toAddressFull === HDWalletHelper.theDAOAddress) {
//                // This 'if' branch is entered when a DAO transaction takes place.
//                amountFieldText = ((parseFloat(itemAmount) > 0) ? '+': '') + itemAmount + ' ETH';
//                $( "div[rowtxid=" + item.txid + "]").find(".cssDisplayForDAOImageInTransaction").css("display", "block"); // Displays the 'td' element that has the attached image.
//
//            } else {
                // This 'if' branch is entered when an ETH transaction takes place.
                amountFieldText = ((parseFloat(itemAmount) > 0) ? '+': '') + itemAmount + ' ETH';	
//            }

            itemTime = item.timestamp * 1000;

            blockExplorerEntrypoint = 'https://gastracker.io/tx/';

            $('.blockNumber', row).text(item.blockNumber);

            $('.gasCost', row).text(item.gasCost + " Ether");
        } else if (coinType === COIN_THEDAO_ETHEREUM) {
            //@note: @todo: @next:
            //            var decimalDifference = parseFloat(item.deltaBalance) - parseFloat(parseFloat(item.deltaBalance).toFixed(8));
            //
            //            if (decimalDifference !== 0.0) {
            //                itemAmount = parseFloat(item.deltaBalance).toFixed(8) + "...";
            //            }
            //            
            //            amountFieldText = ((item.deltaBalance > 0) ? '+': '') + itemAmount + ' ETH';
            //            
            //            itemTime = item.timestamp * 1000;
            //
            //            blockExplorerEntrypoint = 'https://www.etherchain.org/tx/';
            //            
            //            $('.blockNumber', row).text(item.blockNumber);
            //
            //            $('.gasCost', row).text(item.gasCost + " Ether");
        } else if (coinType === COIN_DASH) {
            if (itemAmount < 0) {
                itemAmount -= item.miningFee;
            }

            amountFieldText = ((itemAmount > 0) ? '+': '') + HDWalletHelper.convertSatoshisToBitcoins(itemAmount) + ' DASH';

            itemTime = item.timestamp * 1000;

            //            blockExplorerEntrypoint = HDWallet.TESTNET ? 'https://tbtc.blockr.io/tx/info/' : 'https://blockr.io/tx/info/';
            
            //@note: @here: @todo: @next:
            blockExplorerEntrypoint = 'https://chainz.cryptoid.info/dash/tx.dws?';

            $('.blockHeight', row).text(item.blockHeight);

            $('.miningFee', row).text(HDWalletHelper.convertSatoshisToBitcoins(item.miningFee));
        } else if (coinType === COIN_LITECOIN){

            if (itemAmount < 0) {
                itemAmount -= item.miningFee;
            }


            amountFieldText = ((itemAmount > 0) ? '+': '') + HDWalletHelper.convertSatoshisToBitcoins(itemAmount) + ' LTC';

            itemTime = item.timestamp;

            //            blockExplorerEntrypoint = HDWallet.TESTNET ? 'https://tbtc.blockr.io/tx/info/' : 'https://blockr.io/tx/info/';
            blockExplorerEntrypoint = 'https://live.blockcypher.com/ltc/tx/';

            $('.blockHeight', row).text(item.blockHeight);

            $('.miningFee', row).text(HDWalletHelper.convertSatoshisToBitcoins(item.miningFee));
        } else if (coinType === COIN_LISK) {
            //@note: @todo: @here: @lisk:
//            if (itemAmount < 0) {
//                itemAmount -= item.miningFee;
//            }
//
//
//            amountFieldText = ((itemAmount > 0) ? '+': '') + HDWalletHelper.convertSatoshisToBitcoins(itemAmount) + ' LSK';
//
//            itemTime = item.timestamp;
//
//            //            blockExplorerEntrypoint = HDWallet.TESTNET ? 'https://tbtc.blockr.io/tx/info/' : 'https://blockr.io/tx/info/';
//            blockExplorerEntrypoint = 'https://live.blockcypher.com/ltc/tx/';
//
//            $('.blockHeight', row).text(item.blockHeight);
//
//            $('.miningFee', row).text(HDWalletHelper.convertSatoshisToBitcoins(item.miningFee));
        } else if (coinType === COIN_ZCASH) {

            if (itemAmount < 0) {
                itemAmount -= item.miningFee;
            }


            amountFieldText = ((itemAmount > 0) ? '+': '') + HDWalletHelper.convertSatoshisToBitcoins(itemAmount) + ' ZEC';

            itemTime = item.timestamp;

            //@note: @here: @todo: @zcash: reevaluate this block explorer.
            blockExplorerEntrypoint = 'https://explorer.zcha.in/transactions/';

            $('.blockHeight', row).text(item.blockHeight);

            $('.miningFee', row).text(HDWalletHelper.convertSatoshisToBitcoins(item.miningFee));
        } else if (coinType === COIN_TESTNET_ROOTSTOCK) {
            var indexOfDecimalPlace = itemAmount.indexOf('.');

            if (itemAmount.length - indexOfDecimalPlace - 1 > 8) { // If the string is too long.
                // Then we cut it off and add ....
                itemAmount = itemAmount.substring(0, indexOfDecimalPlace + 1 + 8) + '...';
            }


            //var decimalDifference = parseFloat(item.deltaBalance) - parseFloat(parseFloat(item.deltaBalance).toFixed(8));

            //if (decimalDifference !== 0.0) {
            //    itemAmount = parseFloat(item.deltaBalance).toFixed(8) + "...";
            //}

            // This is where logic is inserted that allows us to create transaction display data.

            //			console.log("(" + item.toAddress + "," + wallet.theDAOAddress + ")");
            //            if (item.toAddressFull === HDWalletHelper.theDAOAddress) {
            //                // This 'if' branch is entered when a DAO transaction takes place.
            //                amountFieldText = ((parseFloat(itemAmount) > 0) ? '+': '') + itemAmount + ' ETH';
            //                $( "div[rowtxid=" + item.txid + "]").find(".cssDisplayForDAOImageInTransaction").css("display", "block"); // Displays the 'td' element that has the attached image.
            //
            //            } else {
            // This 'if' branch is entered when an ETH transaction takes place.
            amountFieldText = ((parseFloat(itemAmount) > 0) ? '+': '') + itemAmount + ' RSK';	
            //            }

            itemTime = item.timestamp * 1000;

            blockExplorerEntrypoint = null;

            $('.blockNumber', row).text(item.blockNumber);

            $('.gasCost', row).text(item.gasCost + " Ether");
        }

        $('.amount', row).text(amountFieldText);

        $('.date', row).text(moment(itemTime).format("MMM D YYYY"));
        $('.time', row).text(moment(itemTime).format("h:mma"));

        $('.txid', row).text(item.txid);

        var linkDisplayText = truncate(item.txid, 5, 5);

        //@note:@here:@todo:

        if (blockExplorerEntrypoint === null) {
            $('.txidShort').text((item.txid + "").substr(0, 5) + "..." + (item.txid + "").substr((item.txid + "").length - 5));
        } else {
            var linkToExplorer = blockExplorerEntrypoint + item.txid;

            g_JaxxApp.getUI().setupExternalLink($('.txidShort', row), linkDisplayText, linkToExplorer);
        }
        
        if (item.toAddress === null) {
            item.toAddress = "Self";
        }

        $('.toAddress', row).text(item.toAddress);
        $('.toAddressShort', row).text(truncate(item.toAddress, 5, 5));

        var confirmationString = null;
        switch (item.confirmations) {
            case -1:
                confirmationString = "Unconfirmed";
                break;
            case 0:
                confirmationString = "Unconfirmed";
                break;
            case 1:
                confirmationString = "1 Confirmation";
                break;
            case 2: case 3: case 4: case 5:
                confirmationString = item.confirmations + " Confirmations";
                break;
            default:
                confirmationString = "Confirmed";
                break;
        } 

        $('.glance .confirmations', row).text(confirmationString);
        $('.verbose .confirmations', row).text(commify(item.confirmations));
    }
}

JaxxUI.prototype.setupAccountList = function(coinType, numItemsToCreate) {
    for (var i = 0; i < numItemsToCreate; i++) {
        //        console.log("creating new transaction list row :: " + i);
        this.createNewAccountRow(coinType);
    }
}

JaxxUI.prototype.createNewAccountRow = function(coinType) {
    var accountsListElement = HDWalletPouch.getStaticCoinPouchImplementation(coinType).uiComponents['accountsListElementName'];

    var accountTemplateElement = HDWalletPouch.getStaticCoinPouchImplementation(coinType).uiComponents['accountTemplateElementName']

    var accountTable = $(accountsListElement);
    var templateAccount = $('.accountDataRowTemplate' + accountTemplateElement + ' > div');

    var row = templateAccount.clone(true);
    row.addClass('tableRow');

    //    console.log("with table :: " + JSON.stringify($(transactionTable)) + " :: cloning :: " + JSON.stringify(templateTransaction) + " :: " + JSON.stringify(row));

    //    row.attr('rowtxid', -1);

    accountTable.append(row);
}

JaxxUI.prototype.updateAccountList = function(coinType, accounts) {
    var accountsListElement = HDWalletPouch.getStaticCoinPouchImplementation(coinType).uiComponents['accountsListElementName'];

    var accountTable = $(accountsListElement);

    var tableChildren = accountTable.children('.tableRow');
    var numExistingRows = tableChildren.length;

//    console.log("[pre] table :: " + accountTable + " :: number of children :: " + numExistingRows + " :: accounts.length :: " + accounts.length);

    //@note: check for differences between existing tx list and history. push or pop as necessary.
    var itemCountDiff = accounts.length - numExistingRows;
    if (itemCountDiff < 0) {
        for (var i = 0; i < -itemCountDiff; i++) {
            accountTable.children('.tableRow').last().remove();
        }

        tableChildren = accountTable.children('.tableRow');
        numExistingRows = tableChildren.length;
    } else if (itemCountDiff > 0) {
        for (var i = 0; i < itemCountDiff; i++) {
            this.createNewAccountRow(coinType);
        }

        tableChildren = accountTable.children('.tableRow');
        numExistingRows = tableChildren.length;
    }

//    console.log("[post] table :: " + accountTable + " :: number of children :: " + numExistingRows + " :: accounts.length :: " + accounts.length);


    //@note: @here: @token: this seems necessary.
    for (var i = 0; i < accounts.length; i++) {
        var item = accounts[i];

        var row = $(tableChildren[i]);

        var largeBalance = HDWalletHelper.convertCoinToUnitType(coinType, item.balance, COIN_UNITLARGE);

        //        console.log("account :: " + i + " :: balance :: " + item.balance + " :: largeBalance :: " + largeBalance + " :: " + JSON.stringify(item));

        $('.accountPublicAddress', row).text(item.pubAddr);
        $('.accountPrivateKey', row).text(item.pvtKey);
        
        for (var j = 0; j < COIN_NUMCOINTYPES; j++) {
            var coinLargePngName = HDWalletPouch.getStaticCoinPouchImplementation(j).uiComponents['coinLargePngName'];

            if (j === coinType) {
                $(coinLargePngName, row).show();
            } else {
                $(coinLargePngName, row).hide();
            }
        }

        if (coinType === COIN_BITCOIN) {
            $('.accountBalance', row).text("");
        } else if (coinType === COIN_ETHEREUM) {
            largeBalance = parseFloat(parseFloat(largeBalance).toFixed(8));
            
            if (parseFloat(largeBalance) >= 0.000001) {
            } else {
                largeBalance = 0;
            }
            
            var accountDAOBalance = HDWalletHelper.convertCoinToUnitType(COIN_THEDAO_ETHEREUM, wallet.getPouchFold(COIN_THEDAO_ETHEREUM).getAccountBalance(item.pubAddr), COIN_UNITLARGE) * 100;

            accountDAOBalance = parseFloat(parseFloat(accountDAOBalance).toFixed(8));
            if (parseFloat(accountDAOBalance) >= 0.000001) {

            } else {
                accountDAOBalance = 0;
            }

            var accountREPBalance = HDWalletHelper.convertCoinToUnitType(COIN_AUGUR_ETHEREUM, wallet.getPouchFold(COIN_AUGUR_ETHEREUM).getAccountBalance(item.pubAddr), COIN_UNITLARGE);

            accountREPBalance = parseFloat(parseFloat(accountREPBalance).toFixed(8));
            if (parseFloat(accountREPBalance) >= 0.000001) {

            } else {
                accountREPBalance = 0;
            }

            var coinAbbreviatedNameEthereum = HDWalletPouch.getStaticCoinPouchImplementation(COIN_ETHEREUM).pouchParameters['coinAbbreviatedName'];

            var coinAbbreviatedNameTheDAOEthereum = HDWalletPouch.getStaticCoinPouchImplementation(COIN_THEDAO_ETHEREUM).pouchParameters['coinAbbreviatedName'];

            var coinAbbreviatedNameAugurEthereum = HDWalletPouch.getStaticCoinPouchImplementation(COIN_AUGUR_ETHEREUM).pouchParameters['coinAbbreviatedName'];

            $('.accountBalanceEther', row).text(("" + largeBalance).substring(0, 8) + " " + coinAbbreviatedNameEthereum + '\xa0');
            
			$('.accountBalanceDAO', row).text(("" + accountDAOBalance).substring(0, 8) + " " + coinAbbreviatedNameTheDAOEthereum);
            
            $('.accountBalanceREP', row).text(("" + accountREPBalance).substring(0, 8) + " " + coinAbbreviatedNameAugurEthereum);
            
//            if (accountDAOBalance > 0) {
                $('.imgDAO', row).show();
//            } else {
//                $('.imgDAO', row).hide();
//            }
            
//            if (accountREPBalance > 0) {
                $('.imgREP', row).show();
//            } else {
//                $('.imgREP', row).hide();
//            }
        } else if (coinType === COIN_ETHEREUM_CLASSIC) {
            largeBalance = parseFloat(parseFloat(largeBalance).toFixed(8));

            if (parseFloat(largeBalance) >= 0.000001) {
            } else {
                largeBalance = 0;
            }

            var coinAbbreviatedName = HDWalletPouch.getStaticCoinPouchImplementation(COIN_ETHEREUM_CLASSIC).pouchParameters['coinAbbreviatedName'];

            $('.accountBalanceEther', row).text(("" + largeBalance).substring(0, 8) + " " + coinAbbreviatedName + '\xa0');
        } else if (coinType === COIN_THEDAO_ETHEREUM) {
            var coinAbbreviatedName = HDWalletPouch.getStaticCoinPouchImplementation(curCoin).pouchParameters['coinAbbreviatedName'];
            
            $('.accountBalance', row).text(("" + largeBalance).substring(0, 8) + " " + coinAbbreviatedName);
            //@note: @here: @todo: @augur:
        } else if (coinType === COIN_DASH) {
            $('.accountBalance', row).text("");
        } else if (coinType === COIN_TESTNET_ROOTSTOCK) {
            largeBalance = parseFloat(parseFloat(largeBalance).toFixed(8));

            if (parseFloat(largeBalance) >= 0.000001) {
            } else {
                largeBalance = 0;
            }

            var coinAbbreviatedName = HDWalletPouch.getStaticCoinPouchImplementation(COIN_TESTNET_ROOTSTOCK).pouchParameters['coinAbbreviatedName'];

            $('.accountBalanceEther', row).text(("" + largeBalance).substring(0, 8) + " " + coinAbbreviatedName + '\xa0');
        }
        
//        $('.imgDAO', row).bind('beforeShow', function() {
//            console.log("yo");
//        });
//
//        $('.imgDAO', row).bind('beforeHide', function() {
//            console.log("sup");
//        });

        if (item.isShapeShiftAssociated === true) {
            $('.imgShapeShift', row).show();
        } else {
            $('.imgShapeShift', row).hide();
        }
    }
}

JaxxUI.prototype.setupEthereumLegacyKeypairDisplay = function(item) {
    var largeBalance = HDWalletHelper.convertCoinToUnitType(COIN_ETHEREUM, item.balance, COIN_UNITLARGE);

    //    console.log("ethereum legacy account :: balance :: " + item.balance + " :: largeBalance :: " + largeBalance + " :: " + JSON.stringify(item));

    var row = $('.accountDataEthereumLegacyKeypair');
	
	var accountDAOBalance = HDWalletHelper.convertCoinToUnitType(COIN_THEDAO_ETHEREUM, wallet.getPouchFold(COIN_THEDAO_ETHEREUM).getAccountBalance(item.pubAddr), COIN_UNITLARGE) * 100;

    var coinAbbreviatedNameEthereum = HDWalletPouch.getStaticCoinPouchImplementation(COIN_ETHEREUM).pouchParameters['coinAbbreviatedName'];

    var coinAbbreviatedNameTheDAOEthereum = HDWalletPouch.getStaticCoinPouchImplementation(COIN_THEDAO_ETHEREUM).pouchParameters['coinAbbreviatedName'];

    $('.accountPublicAddress', row).text(item.pubAddr);
    $('.accountPrivateKey', row).text(item.pvtKey);
    $('.accountBalanceEther', row).text(("" + largeBalance).substring(0, 8) + " " + coinAbbreviatedNameEthereum + '\xa0');
    $('.accountBalanceDAO', row).text(("" + accountDAOBalance).substring(0, 8) + " " + coinAbbreviatedNameTheDAOEthereum); // This line will display something like XX.XXX DAO in the legacy key pairs.

    for (var j = 0; j < COIN_NUMCOINTYPES; j++) {
        var coinLargePngName = HDWalletPouch.getStaticCoinPouchImplementation(j).uiComponents['coinLargePngName'];

        if (j === COIN_ETHEREUM) {
            $(coinLargePngName, row).show();
        } else {
            $(coinLargePngName, row).hide();
        }
    }

    if (item.isShapeShiftAssociated === true) {
        $('.imgShapeShift', row).show();
    } else {
        $('.imgShapeShift', row).hide();
    }
}

JaxxUI.prototype.showShapeShift = function() {
    
    var input = $('.tabContent .address input');
    
    g_JaxxApp.getShapeShiftHelper().setIsTriggered(true);

    input.val("ShapeShift"); //Correct capitalization 
    input.addClass('validShapeshift').addClass('cssValidShapeshift'); //Change color
    input.css({ backgroundImage: 'url(' + g_JaxxApp.getShapeShiftHelper()._avatarImage + ')'}); //Show fox icon
    //            $('.spendable').slideUp(); // Hide Spendable line
    $('.spendableShapeshift').slideDown(); // Show ShapeShift logo and Info icon

//    var placeholderAmountText = "Amount (Send BTC get ETH)";
//    if(curCoinType===COIN_ETHEREUM){
//        placeholderAmountText = "Amount (Send ETH get BTC)";
//    }

//    $('.tabContent .amount input').attr("placeholder", placeholderAmountText); //Change text of amount placeholder
    $('#sendLabel').text("Shift"); //Send button becomes shift
    
    if (curCoinType === COIN_ETHEREUM) {
        Navigation.hideEthereumAdvancedMode();
        $('.tabContent .advancedTabButton').slideUp().hide();
//        $('.tabContent .advancedTabButton').slideUp().hide();
    }
    
    var coinAbbreviatedName = HDWalletPouch.getStaticCoinPouchImplementation(curCoinType).pouchParameters['coinAbbreviatedName'];

    var receiveCoinAbbreviatedName = g_JaxxApp.getSettings().getDefaultShapeshiftCoinAbbreviatedName(coinAbbreviatedName);
    
    g_JaxxApp.getSettings().setShapeshiftCoinTarget(coinAbbreviatedName, receiveCoinAbbreviatedName);
    
    var receiveCoinType = HDWalletHelper.dictCryptoCurrency[receiveCoinAbbreviatedName].index;
   
    g_JaxxApp.getShapeShiftHelper().setReceivePairForCoinType(curCoinType, receiveCoinType);
    g_JaxxApp.getShapeShiftHelper().clearUpdateIntervalIfNecessary();
    this.setupShapeShiftCoinUI(HDWalletHelper.dictCryptoCurrency[g_JaxxApp.getSettings().getShapeshiftCoinTarget(coinAbbreviatedName)]['index']);
}

JaxxUI.prototype.resetShapeShift = function() {
//    console.log("resetShapeShift");
    
	this.closeShapeshiftCoinList();
	
    $('.shiftingProgress').stop().fadeOut();

    $('.shapeShiftToggleItem :checkbox').prop('checked', false);

    $('.spendableShapeshift').slideUp();

    //Reset normal UI values (remove shapeshift)
    $('.tabContent .address input').css({backgroundImage: 'none'}).removeClass('validShapeshift').removeClass('cssValidShapeshift ');
    $('.tabContent .amount input').attr("placeholder", "Amount"); //Change text of amount placeholder 
    $('#sendLabel').text("Send");
    $('.tabContent .amount input').removeClass('validShapeshiftAmount').removeClass('cssValidShapeshiftAmount ');
    
    if (curCoinType === COIN_ETHEREUM) {
        $('.tabContent .advancedTabButton').show().slideDown();
    }

    var receiveCoinType = COIN_BITCOIN;

    if (curCoinType === COIN_BITCOIN) {
        receiveCoinType = COIN_ETHEREUM;
    }

    //@note: @todo: @here: @optimization: this might want to be checked for validity re: opacity or such.
    
    $('.shiftingProgress').stop().fadeOut();

    if (g_JaxxApp.getShapeShiftHelper().getIsTriggered()) {
        if (this.isShapeshiftCoinListOpen()) {
            this.closeShapeshiftCoinList();
        }
        
        $('.shapeShiftToggleItem :checkbox').prop('checked', false);

        $('.spendableShapeshift').slideUp();

        //Reset normal UI values (remove shapeshift)
        $('.tabContent .address input').css({backgroundImage: 'none'}).removeClass('validShapeshift').removeClass('cssValidShapeshift ');
        $('.tabContent .amount input').attr("placeholder", "Amount"); //Change text of amount placeholder 
        $('#sendLabel').text("Send");
        $('.tabContent .amount input').removeClass('validShapeshiftAmount').removeClass('cssValidShapeshiftAmount ');

        if (curCoinType === COIN_ETHEREUM) {
            $('.tabContent .advancedTabButton').show().slideDown();
        }

        var coinDisplayColor = HDWalletPouch.getStaticCoinPouchImplementation(receiveCoinType).uiComponents['coinDisplayColor'];

        $('.shapeShiftToggleButtonLabel').css({'background': coinDisplayColor});
    }
    
    
    g_JaxxApp.getShapeShiftHelper().setReceivePairForCoinType(curCoinType, receiveCoinType);

    g_JaxxApp.getShapeShiftHelper().reset();
}

JaxxUI.prototype.beginShapeShiftMultiShift = function() {
    $('.shiftingProgress').stop().fadeIn();
}

JaxxUI.prototype.endShapeShiftMultiShift = function() {
    $('.shiftingProgress').stop().fadeOut();
}

JaxxUI.prototype.updateShapeShiftDisplay = function(coinTypeDict, displayDict) {
	// Example parameters : ({send: 0, receive: 1}, {pair: "btc_eth", depositMax: 1.70901548, depositMin: 0.00039924, exch.....)
    if ( g_JaxxApp.getShapeShiftHelper().getIsTriggered() && curCoinType === coinTypeDict.send) {
        var coinAbbreviatedNameSend = HDWalletPouch.getStaticCoinPouchImplementation(coinTypeDict.send).pouchParameters['coinAbbreviatedName'];
        
        var coinAbbreviatedNameReceive = HDWalletPouch.getStaticCoinPouchImplementation(coinTypeDict.receive).pouchParameters['coinAbbreviatedName'];

        if (typeof(displayDict.exchangeRate) !== 'undefined' && displayDict.exchangeRate !== null) {
            $('.shapeShiftExchangeRate').text(displayDict.exchangeRate.toString().substring(0, 8));
            $('.shapeShiftDepositMin').text(displayDict.depositMin.toString().substring(0, 8));
            $('.shapeShiftDepositMax').text(displayDict.depositMax.toString().substring(0, 8));
            $('.shapeShiftAbbreviatedUnitSend').text(coinAbbreviatedNameSend);
            $('.shapeShiftAbbreviatedUnitReceive').text(coinAbbreviatedNameReceive);
        }            
    }
}

JaxxUI.prototype.populateShapeShiftReceiveData = function(ssMarketData) {
    //@note: @todo: in the Grand Cleaning.

    var curMarketData = g_JaxxApp.getShapeShiftHelper().getMarketForCoinTypeSend(curCoinType);
    
    if (curMarketData.multiShift !== null) {
        var foundIssue = false;
        
        for (var i = 0; i < curMarketData.multiShift.length; i++) {
            if (typeof(curMarketData.multiShift[i]) !== 'undefined' && curMarketData.multiShift[i] !== null && curMarketData.multiShift[i].depositAddress !== null) {
//                console.log("shapeShift :: multiShifting :: " + i + " :: with deposit :: " + curMarketData.multiShift[i].depositAddress);
//                depositAddresses[i] = curMarketData.multiShift[i].depositAddress;
            } else {
                console.log("shapeShift :: issue with deposit :: " + i);
                foundIssue = true;
            }
        }
        
        if (foundIssue !== true) {
            console.log("shapeShift :: done multishifting :: " + curMarketData.multiShift.length);
        }
    } else {
        console.log("shapeShift :: issue with multishifting :: " + JSON.stringify(curMarketData, null, 4));
    }

    $('.tabContent .amount input').trigger('keyup');
    updateSpendable();
}

JaxxUI.prototype.setupShapeShiftCoinUI = function(targetCoinType) {
    var receiveCoinType = g_JaxxApp.getShapeShiftHelper().getReceivePairForCoinType(targetCoinType);

    var coinAbbreviatedNameCurrent = HDWalletPouch.getStaticCoinPouchImplementation(curCoinType).pouchParameters['coinAbbreviatedName'];
    
    var coinAbbreviatedNameTarget = HDWalletPouch.getStaticCoinPouchImplementation(targetCoinType).pouchParameters['coinAbbreviatedName'];

    var coinAbbreviatedNameReceive = HDWalletPouch.getStaticCoinPouchImplementation(receiveCoinType).pouchParameters['coinAbbreviatedName'];

    this.generateShapeshiftBanner(coinAbbreviatedNameCurrent); // Generate the banners for transfer.
    
    $('.shapeshiftToggleLabelPrimary').text(coinAbbreviatedNameTarget + " to " + coinAbbreviatedNameReceive);

    
//    var secondaryReceiveCoinType = COIN_BITCOIN;
//    
//    if (targetCoinType === COIN_BITCOIN) {
//        if (receiveCoinType !== COIN_ETHEREUM) {
//            secondaryReceiveCoinType = COIN_ETHEREUM;
//        } else {
//            secondaryReceiveCoinType = COIN_THEDAO_ETHEREUM;
//        }
//    } else if (targetCoinType === COIN_ETHEREUM) {
//        if (receiveCoinType !== COIN_BITCOIN) {
//            secondaryReceiveCoinType = COIN_BITCOIN;
//        } else {
//            secondaryReceiveCoinType = COIN_THEDAO_ETHEREUM;
//        }
//    } else if (targetCoinType === COIN_THEDAO_ETHEREUM) {
//        if (receiveCoinType !== COIN_BITCOIN) {
//            secondaryReceiveCoinType = COIN_BITCOIN;
//        } else {
//            secondaryReceiveCoinType = COIN_ETHEREUM;
//        }
//    } if (targetCoinType === COIN_DASH) {
//        if (receiveCoinType !== COIN_BITCOIN) {
//            secondaryReceiveCoinType = COIN_BITCOIN;
//        } else {
//            secondaryReceiveCoinType = COIN_ETHEREUM;
//        }
//    }
//    
//    var coinAbbreviatedNameSecondaryReceive = HDWalletPouch.getStaticCoinPouchImplementation(secondaryReceiveCoinType).pouchParameters['coinAbbreviatedName'];
//
//    
//    $('.shapeshiftToggleLabelSecondary').text(coinAbbreviatedNameTarget + " to " + coinAbbreviatedNameSecondaryReceive);
//    
//    var coinDisplayColor = HDWalletPouch.getStaticCoinPouchImplementation(receiveCoinType).uiComponents['coinDisplayColor'];
//
//    $('.shapeShiftToggleButtonLabel').css({'background': coinDisplayColor});
}

JaxxUI.prototype.getJaxxNews = function(callback) {
    var self = this;
    // **** Reminder:  When testing use different endpoint - not the live one ****
    var url = "https://jaxx.io/jaxx-data/jaxx-news.php"
//    var url = "https://jaxx.io/jaxx-data/jaxx-news-beta.php"
    $.getJSON( url, function( data ) {
        if (data && data[0]) {
            self._jaxxNewsData = data[0];
            callback();
        }
    });
}

JaxxUI.prototype.displayJaxxNews = function() {
    console.log("news data :: " + JSON.stringify(this._jaxxNewsData));
    
    var scrubbedTitleString = JaxxUtils.scrubInput(this._jaxxNewsData.title);
    $('.getTitleForJaxxNews').text(scrubbedTitleString);

    var scrubbedBodyString = JaxxUtils.scrubInput(this._jaxxNewsData.description);
    //            console.log("data[0].description :: " + this._jaxxNewsData.description + " :: scrubbed :: " + scrubbedBodyString);
    var version = null;
    if (typeof(this._jaxxNewsData.version) !== 'undefined' && this._jaxxNewsData.version !== null){
        version = this._jaxxNewsData.version;
    }
    if (typeof(version) !== 'undefined' && version !== null){
        this.addJaxxNewsShownVersions(JaxxUtils.scrubInput(version));
    }
    

    $('.getDescriptionForJaxxNews').html(scrubbedBodyString);
    
    
    Navigation.openModal('jaxxNews');
}

JaxxUI.prototype.addJaxxNewsShownVersions = function(strVersion){
    if (typeof(this._criticalVersionUpdatesShown) !== 'undefined' && this._criticalVersionUpdatesShown !== null && typeof(strVersion) !== 'undefined' && strVersion !== null){ 
        if (!(this._criticalVersionUpdatesShown.indexOf(strVersion) > -1)){
            this._criticalVersionUpdatesShown.push(strVersion);
            storeData('criticalVersionUpdatesShown', JSON.stringify(this._criticalVersionUpdatesShown), false);
        }
    }
}

JaxxUI.prototype.displayJaxxNewsIfUnseen = function() {
    if (this._hasDisplayedJaxxNews === false) {
        this._hasDisplayedJaxxNews = true;
        var version = JaxxUtils.scrubInput(this._jaxxNewsData.version);
        if (typeof(version) !== 'undefined' && version !== null){ 
            if (!(this._criticalVersionUpdatesShown.indexOf(version) > -1)){
                this.displayJaxxNews();
            }
        }
    }
}

JaxxUI.prototype.displayJaxxNewsIfCritical = function() {
    if (this._jaxxNewsData !== null && this._jaxxNewsData.criticality === "critical") {
        this.displayJaxxNewsIfUnseen();
        //            console.log("news data :: " + data[0].criticality)
    }
    else {
        //            console.log("view bulleting menu for relative news")
    }
}

JaxxUI.prototype.updateCoinToFiatExchangeRates = function() {
    if (this._mainMenuIsOpen) {
        //this.populateCurrencyList(curCoinType);
    }
}

JaxxUI.prototype.populateCurrencyList = function(targetCoinType) {
    if (typeof(targetCoinType) === 'undefined' || targetCoinType === null){
        targetCoinType = curCoinType;
    }
    var currencylist = $('.exchangeRateList').children().children(); // Gets the table rows.
    for (i = 0; i < currencylist.length; i++){
        var element = currencylist[i];
        // console.log(element);
        var fiatUnit = $(element).attr('value');
        //console.log(fiatUnit);
        //var targetElement = $('.cssSetCurrency .cssCurrency').filter('tr[value="' + value + '"]').find('.rate');
        this.populateExchangeRateInMainMenuCurrencyList(targetCoinType, fiatUnit);        
        //$(targetElement).text();
    }
}

JaxxUI.prototype.populateExchangeRateInMainMenuCurrencyList = function(coinType, fiatUnit){
    if (coinType === COIN_THEDAO_ETHEREUM){
        $('.rate' + fiatUnit).text(wallet.getHelper().convertCoinToFiatWithFiatType(coinType, 0.01, COIN_UNITLARGE, fiatUnit, false));
    } else {
        $('.rate' + fiatUnit).text(wallet.getHelper().convertCoinToFiatWithFiatType(coinType, 1.0, COIN_UNITLARGE, fiatUnit, false));
    }
}

JaxxUI.prototype.closeQuickFiatCurrencySelector = function() {
    if (this.isQuickFiatCurrencySelectorOpen()) {
        $('.wrapTableCurrencySelectionMenu').fadeOut(function() {
            $(".fiatCurrencySelectionMenu").empty();
            $('.displayCurrenciesSelectedArrow img').addClass('cssFlipped');
        });
//        $('.cssBalanceBox .dismiss').removeClass('cssDismissCurrencySelectionMenu');
        $('.cssDismissCurrencySelectionMenu').css('display', 'none');
    }
}

JaxxUI.prototype.openQuickFiatCurrencySelector = function() {
	// This is called when the user clicks on the arrow on the home screen of Jaxx to show the currencies.
	$(".fiatCurrencySelectionMenu").empty();
	// var currencies = Navigation.getEnabledCurrencies(); // Code from when there was no preference order for currencies.
	var currencies = g_JaxxApp.getSettings().getListOfEnabledCurrencies();
    for (var i = 0; i < currencies.length; i++){
        //element = '<div class="cssCurrency scriptAction setDefaultCurrency" currency=' + currencies[i] + ' > ' + currencies[i] + ' </div>'; 
        // This 'if' part is for Styling.
        element = '<tr class="quickFiatCurrencySelector ';
        if (i === 0){
            element += 'cssCurrencyFirstElement';
        } else {
            element += 'cssCurrencyAdditionalElement';
        }
        element += ' scriptAction" specialAction="setDefaultCurrencyFromMenu" value="' + currencies[i] + '"> <td class="fiatUnit cssFiatUnit">' + currencies[i] + '</td><td class="covertedBalance cssConvertedBalance"> ' +  wallet.getHelper().convertCoinToFiatWithFiatType(curCoinType, wallet.getPouchFold(curCoinType).getPouchFoldBalance(), COIN_UNITSMALL, currencies[i], false) + '</td></tr>';
        $(".fiatCurrencySelectionMenu").append(element);

        // HDWalletHelper.getFiatUnitPrefix(currencies[i]) +  wallet.getHelper().convertCoinToFiat(curCoinType, currencies[i], HDWalletHelper.convertWeiToEther(wallet.getPouchFold(curCoinType).getPouchFoldBalance())).toFixed(2)
    }
	
    $('.wrapTableCurrencySelectionMenu').fadeIn();
    
    $('.cssDismissCurrencySelectionMenu').css('display', 'block');
	// Highlight element matching currency to blue.
	$('.quickFiatCurrencySelector').removeClass('cssBlueHighlight');
	$('.displayCurrenciesSelectedArrow').find('img').removeClass('cssFlipped');
	$('.quickFiatCurrencySelector').filter('tr[value="' + wallet.getHelper().getFiatUnit() + '"]').addClass('cssBlueHighlight');
	
	scrollIntoView($('.quickFiatCurrencySelector').filter('tr[value="'+wallet.getHelper().getFiatUnit()+'"]'), $('.fiatCurrencySelectionMenu'), $('.wrapTableCurrencySelectionMenu'));
	
	// @TODO: find a way to refactor this code resuse.
    $('.quickFiatCurrencySelector').off('click'); // This should do nothing, but we add it just in case.
    $('.quickFiatCurrencySelector').click(function (event) {
        try {
            //                console.log("event :: " + JSON.stringify(event);
            scriptAction(event);
        } catch (err) {
            console.error(err);
        }
    });
    
    Navigation.collapseTabs();
    Navigation.hideTransactionHistoryDetails();
}

JaxxUI.prototype.toggleQuickFiatCurrencySelector = function() {
	console.log("Toggling the quickFiatCurrencySelector menu.");
	if (this.isQuickFiatCurrencySelectorOpen()){
		// Close the currency selection menu.
		this.closeShapeshiftCoinList();
		this.closeQuickFiatCurrencySelector();
	} else {
		// Open the currency selection menu.
		this.openQuickFiatCurrencySelector();
        //$('.wallet .menu,.wallet .dismiss').fadeOut();
		this.closeMainMenu();
	}
}

JaxxUI.prototype.isQuickFiatCurrencySelectorOpen = function(){
	return (!($(".wrapTableCurrencySelectionMenu").css('display') === 'none'));
}

JaxxUI.prototype.setDefaultCurrencyFromMenu = function(element){
    // This code is run when the user selects a currency to use from the list of enabled currencies.
//    console.log("element :: " + element + " :: element.attr('value') :: " + element.attr('value'));
    var currency = element.attr('value');
    
    $('.quickFiatCurrencySelector').filter('tr[value="' + wallet.getHelper().getFiatUnit() +'"]').removeClass('cssBlueHighlight');
    
    wallet.getHelper().setFiatUnit(currency);
    $('.quickFiatCurrencySelector').filter('tr[value="' + currency + '"]').addClass('cssBlueHighlight');
    
    updateWalletUI();
    
    var self = this;
    setTimeout(function() {
		self.closeShapeshiftCoinList();
        self.closeQuickFiatCurrencySelector();
    }, 100)
}

JaxxUI.prototype.quickFiatCurrencySwitch = function() {
    var nextCurrency = g_JaxxApp.getSettings().getNextEnabledCurrency(wallet.getHelper().getFiatUnit());
	wallet.getHelper().setFiatUnit(nextCurrency);
	updateWalletUI();
	this.closeShapeshiftCoinList();
	JaxxUI.prototype.closeQuickFiatCurrencySelector();
	/*
	var currencies = Navigation.getEnabledCurrencies();

    var nextCurrency = 0;

    for (var i = 0; i < currencies.length; i++){
        var curCurrency = currencies[i];
        
        console.log("check currency :: " + curCurrency + " :: current currency :: " + wallet.getHelper().getFiatUnit());
        
        if (curCurrency === wallet.getHelper().getFiatUnit()) {
            if (i === currencies.length - 1) {
                nextCurrencyIdx = 0;
            } else {
                nextCurrencyIdx = i + 1;
            }
            
            nextCurrency = currencies[nextCurrencyIdx];
            break;
        }
    }
    
    $('.quickFiatCurrencySelector').filter('tr[value="' + wallet.getHelper().getFiatUnit() +'"]').removeClass('cssBlueHighlight');

    wallet.getHelper().setFiatUnit(nextCurrency);
    $('.quickFiatCurrencySelector').filter('tr[value="' + nextCurrency + '"]').addClass('cssBlueHighlight');

    updateWalletUI();

    JaxxUI.prototype.closeQuickFiatCurrencySelector();
	*/
}

JaxxUI.prototype.showDAORefund = function() {
    var showNoBalances = false;
    
    $('.theDaoRefundConfirmButton').removeClass("cssTheDaoRefundButtonWait");
    $('.theDaoRefundConfirmButton').text("Refund");

    var theDAODefaultGasLimit = HDWalletPouch.getStaticCoinPouchImplementation(COIN_THEDAO_ETHEREUM).getDefaultGasLimit();

    var gasRequiredList = wallet.getPouchFold(COIN_THEDAO_ETHEREUM).hasInsufficientGasForSpendable(theDAODefaultGasLimit * 2);

    //            console.log("gasRequiredList :: " + gasRequiredList);

    if (gasRequiredList.length > 0) {
        $('.theDaoInsufficientGasForRefundWarningText').show();

        //            gasRequiredList.push("0x051Da87c3679Be285DC22E2fbA5E833052375ced");
        //            gasRequiredList.push("0x051Da87c3679Be285DC22E2fbA5E833052375ced");
        //            gasRequiredList.push("0x051Da87c3679Be285DC22E2fbA5E833052375ced");

        $('.theDaoInsufficientGasForRefundWarningText').html("<p>The following DAO-holding addresses require more ETH to be able to perform the refund. We recommend depositing at least 0.01 ETH into this address in your Ethereum wallet:<br></p>" + gasRequiredList.join('<br>'));
    } else {
        $('.theDaoInsufficientGasForRefundWarningText').hide();
    }
    
    var daoAddressData = wallet.getPouchFold(COIN_THEDAO_ETHEREUM).getSpendableAddresses(0, theDAODefaultGasLimit * 2);

//    daoAddressData = [];
    
    if (daoAddressData.length > 0) {
        var refundAddressesString = "";
        for (var i = 0; i < daoAddressData.length; i++) {
            var curAddress = daoAddressData[i].address;
            var curBalance = HDWalletHelper.getCoinDisplayScalar(COIN_THEDAO_ETHEREUM, HDWalletHelper.convertCoinToUnitType(COIN_THEDAO_ETHEREUM, daoAddressData[i].balance, COIN_UNITLARGE), false);
            
            if (curBalance.toString().length > 8) {
                curBalance = curBalance.toFixed(8);
            }

            refundAddressesString += "<p><span class='cssDaoRefundDisplayAddress'>" + curAddress + ":</span> <span class='cssDaoRefundDisplayAmount cssAmount'>" + curBalance + " DAO</span></p>";
//            console.log("showDAORefund :: " + i + " :: daoAddressData :: " + JSON.stringify(daoAddressData[i]) + " :: refundAddressesString :: " + refundAddressesString);
        }

//        console.log("showDAORefund :: daoAddressData :: " + daoAddressData + " :: refundAddressesString :: " + refundAddressesString);

        $('.theDaoRefundAddressesList').html(refundAddressesString);
        $('.theDaoRefundAddressesText').show();
        $('.theDaoRefundCost').show();
        $('.theDaoRefundConfirmButton').addClass('cssEnabled').addClass('enabled');
        $('.theDaoRefundConfirmButton').text("Refund");
        $('.theDaoRefundConfirmButton').attr("specialAction", "confirmDAORefund");
        $('.theDaoRefundConfirmButton').attr("closeModal", null);
        
        var approveTXDict = this.processDAOApprove(daoAddressData);
        var refundTXDict = this.processDAORefund(daoAddressData);
        
        $('.daoRefund').data('daoAddressData', daoAddressData);

        var totalTXCost = approveTXDict.totalTXCost + refundTXDict.totalTXCost;
        $('.theDaoRefundCost').text(HDWalletHelper.convertCoinToUnitType(COIN_THEDAO_ETHEREUM, totalTXCost, COIN_UNITLARGE) + " ETH");        
    } else {
        $('.theDaoRefundAddressesText').hide();
        $('.theDaoRefundCost').hide();
       
        $('.theDaoRefundConfirmButton').text("Close");
        $('.theDaoRefundConfirmButton').attr("specialAction", null);
        $('.theDaoRefundConfirmButton').attr("closeModal", "true");
        
        if (gasRequiredList.length === 0) {
            showNoBalances = true;
        }
    }
    
    if (showNoBalances === true) {
        $('.theDaoRefundNoBalances').show();
        $('.theDaoRefundConfirmButton').text("Close");
        $('.theDaoRefundConfirmButton').attr("specialAction", null);
        $('.theDaoRefundConfirmButton').attr("closeModal", "true");
    } else {
        $('.theDaoRefundNoBalances').hide();
    }

    Navigation.openModal('daoRefund');
}

JaxxUI.prototype.confirmDAORefund = function() {
//    console.log("confirmDAORefund");
//    $('.theDaoRefundConfirmButton').addClass("cssTheDaoRefundButtonWait");
//    $('.theDaoRefundConfirmButton').text("Please Wait");
//
//    return;

//    $('.theDaoRefundConfirmButton').addClass("cssTheDaoRefundButtonWait");
//    $('.theDaoRefundConfirmButton').attr("specialAction", null);
//    $('.theDaoRefundConfirmButton').text("Please Wait");

    var daoAddressData = $('.daoRefund').data('daoAddressData');
    
    var self = this;
    
    var approveTXDict = this.processDAOApprove(daoAddressData);
    
    g_JaxxApp.getTXManager().sendEthereumLikeTXList(COIN_ETHEREUM, approveTXDict, function(result) {
        if (result === 'success') {
            console.log("confirmDAORefund :: approve :: success");
            var refundData = $('.daoRefund').data('refundTXDict');
            
            $('.theDaoRefundConfirmButton').addClass("cssTheDaoRefundButtonWait");
            $('.theDaoRefundConfirmButton').text("Please Wait");

            setTimeout(function() {
                var refundTXDict = self.processDAORefund(daoAddressData);

                g_JaxxApp.getTXManager().sendEthereumLikeTXList(COIN_ETHEREUM, refundTXDict, function(result) {
                    if (result === 'success') {
                        console.log("confirmDAORefund :: refund :: success");
                        playSound("snd/balance.wav", null, null);
                        Navigation.flashBanner('DAO refund successful', 5);
                    } else {
                        console.log("confirmDAORefund :: refund :: error :: " + result);
                        Navigation.flashBanner('DAO refund error', 5);
                    }

                    $('.daoRefund').data('approveTXDict', null);
                    $('.daoRefund').data('refundTXDict', null);
                    Navigation.closeModal();
                });
            }, 3000);
        } else {
            console.log("confirmDAORefund :: approve :: error :: " + result);
            
            $('.daoRefund').data('approveTXDict', null);
            $('.daoRefund').data('refundTXDict', null);
            
            Navigation.closeModal();
        }
    });
}

//@note: @here: @todo: these two classes don't deal with any UI stuff, they should be moved somewhere more appropriate.

JaxxUI.prototype.processDAOApprove = function(daoAddressData) {
    var theDAODefaultGasLimit = HDWalletPouch.getStaticCoinPouchImplementation(COIN_THEDAO_ETHEREUM).getDefaultGasLimit();
    
    var gasPrice = HDWalletHelper.getDefaultEthereumGasPrice();
    var gasLimit = theDAODefaultGasLimit;

    var tokenContractAddress = CoinToken.getStaticTokenImplementation(CoinToken.TheDAO).pouchParameters['tokenContractAddress'];

    var theDAOTokenWithdrawalAddress = CoinToken.getStaticTokenImplementation(CoinToken.TheDAO).pouchParameters['tokenWithdrawalAddress'];

    var approveOpCode = wallet.getPouchFold(COIN_THEDAO_ETHEREUM).getApproveOpCode();

    var ABIAddressTarget = HDWalletHelper.zeroPadLeft(HDWalletHelper.toEthereumNakedAddress(theDAOTokenWithdrawalAddress), 64);

    var txArray = [];
    var totalTXCost = 0;
    
    var baseGasCost = gasPrice.mul(gasLimit);

    for (var i = 0; i < daoAddressData.length; i++) {
        var ABIBalanceParameter = HDWalletHelper.zeroPadLeft(daoAddressData[i].balance.toString(16), 64);
//        var ABIBalanceParameter = HDWalletHelper.zeroPadLeft("1".toString(16), 64);

        var approveTXData = approveOpCode + ABIAddressTarget + ABIBalanceParameter;
        
        var newTX = wallet.getPouchFold(COIN_ETHEREUM).getPouchFoldImplementation()._buildEthereumTransaction(false, daoAddressData[i].ethereumNodeIndex, tokenContractAddress, 0, gasPrice, gasLimit, approveTXData, null);

        if (newTX) {
            txArray.push(newTX);
        } else {
            console.log("error :: ethereum transaction :: account failed to build :: " + daoAddressData[i].ethereumNodeIndex);
            return null;
        }

        totalTXCost += parseInt(baseGasCost);
    }
    
    console.log("processDAOApprove :: txArray.length :: " + txArray.length + " :: txArray :: " + JSON.stringify(txArray) + " :: baseGasCost :: " + baseGasCost);

    return {txArray: txArray, totalTXCost: totalTXCost};
}

JaxxUI.prototype.processDAORefund = function(daoAddressData) {
    var theDAODefaultGasLimit = HDWalletPouch.getStaticCoinPouchImplementation(COIN_THEDAO_ETHEREUM).getDefaultGasLimit();

    var gasPrice = HDWalletHelper.getDefaultEthereumGasPrice();
    var gasLimit = theDAODefaultGasLimit;

    var theDAOTokenWithdrawalAddress = CoinToken.getStaticTokenImplementation(CoinToken.TheDAO).pouchParameters['tokenWithdrawalAddress'];
    
    var refundOpCode = wallet.getPouchFold(COIN_THEDAO_ETHEREUM).getRefundOpCode();
    
    var txArray = [];
    var totalTXCost = 0;
    
    var baseGasCost = gasPrice.mul(gasLimit);

    for (var i = 0; i < daoAddressData.length; i++) {
        var newTX = wallet.getPouchFold(COIN_ETHEREUM).getPouchFoldImplementation()._buildEthereumTransaction(false, daoAddressData[i].ethereumNodeIndex, theDAOTokenWithdrawalAddress, 0, gasPrice, gasLimit, refundOpCode, null);

        if (newTX) {
            txArray.push(newTX);
        } else {
            console.log("error :: ethereum transaction :: account failed to build :: " + daoAddressData[i].ethereumNodeIndex);
            return null;
        }
        
        totalTXCost += parseInt(baseGasCost);
    }
    
    console.log("processDAORefund :: txArray.length :: " + txArray.length + " :: txArray :: " + JSON.stringify(txArray));
    
    return {txArray: txArray, totalTXCost: totalTXCost};
}

JaxxUI.prototype.switchToSolidCoinButton = function(coinType) {
    var coinButtonName = HDWalletPouch.getStaticCoinPouchImplementation(coinType).uiComponents['coinButtonName'];
    
    var coinButtonSVGName = HDWalletPouch.getStaticCoinPouchImplementation(coinType).uiComponents['coinButtonSVGName'];

    $(coinButtonName).css({background: 'url(images/' + coinButtonSVGName + '.svg) no-repeat center center'});
    $(coinButtonName).addClass('cssSelected');
    $(coinButtonName).off('mouseleave');
}

JaxxUI.prototype.initializeToCoinType = function(targetCoinType) {
    for (var i = 0; i < COIN_NUMCOINTYPES; i++) {
        var coinSpinnerElementName = HDWalletPouch.getStaticCoinPouchImplementation(i).uiComponents['coinSpinnerElementName'];
        
        var transactionsListElement = HDWalletPouch.getStaticCoinPouchImplementation(i).uiComponents['transactionsListElementName'];
        
        $(coinSpinnerElementName).fadeTo(0, 0);
        $(coinSpinnerElementName).hide();

        if (i !== targetCoinType) {
            //            $(coinHelpMenuNames[i]).hide();
            //            $(coinMenuHeaderNames[i]).hide();
            this.resetCoinButton(i);
            
            $(transactionsListElement).hide();
        } else {

            //            $(coinHelpMenuNames[i]).show();
            //            $(coinMenuHeaderNames[i]).show();
            this.switchToSolidCoinButton(i);
            
            $(transactionsListElement).show();
        }
    }

    //@note: @todo: @here: get dash paper wallets functional.
    if (targetCoinType === COIN_DASH || 
        targetCoinType === COIN_ETHEREUM_CLASSIC || 
        targetCoinType === COIN_THEDAO_ETHEREUM ||
        targetCoinType === COIN_AUGUR_ETHEREUM ||
        targetCoinType === COIN_LISK ||
        targetCoinType === COIN_ZCASH ||
        targetCoinType === COIN_TESTNET_ROOTSTOCK) {
        $('.menusPaperWallet').hide();
    } else {
        $('.menusPaperWallet').show();
    }
}

JaxxUI.prototype.beginSwitchToCoinType = function(currentCoinType, targetCoinType) {
}

JaxxUI.prototype.completeSwitchToCoinType = function(currentCoinType, targetCoinType) {
    var targetCoinShortName = "";
    var allKeys = Object.keys(HDWalletHelper.dictCryptoCurrency);
    
    for (var i = 0; i < allKeys.length; i++) {
        var curKey = allKeys[i];
        
        var curCoinIndex = HDWalletHelper.dictCryptoCurrency[curKey].index;
        
        if (targetCoinType === curCoinIndex) {
            targetCoinShortName = curKey;
            break;
        }
    }

    var shapeShiftCryptoCurrenciesAllowed = HDWalletHelper.shapeShiftCryptoCurrenciesAllowed.regular;
    
    if (targetCoinType === COIN_THEDAO_ETHEREUM) {
        $('.mainTransactionHistoryHeader').text('DAO Refund');
    } else {
        $('.mainTransactionHistoryHeader').html('Transaction History');
    }
    
    if (typeof(shapeShiftCryptoCurrenciesAllowed[targetCoinShortName]) !== 'undefined' &&
        shapeShiftCryptoCurrenciesAllowed[targetCoinShortName] !== null &&
        shapeShiftCryptoCurrenciesAllowed[targetCoinShortName] === true) {
        $('.btnActionShapeShift').show();
        $('.btnActionShapeShift').css('display', 'inline-block');
    } else {
        $('.btnActionShapeShift').hide();
    }
    
    if (targetCoinType === COIN_DASH || 
        targetCoinType === COIN_ETHEREUM_CLASSIC || 
        targetCoinType === COIN_THEDAO_ETHEREUM ||
        targetCoinType === COIN_AUGUR_ETHEREUM ||
        targetCoinType === COIN_LISK ||
        targetCoinType === COIN_ZCASH ||
        targetCoinType === COIN_TESTNET_ROOTSTOCK) {
        $('.menusPaperWallet').hide();
    } else {
        $('.menusPaperWallet').show();
    }
}

JaxxUI.prototype.resizeChromeExtension = function() {
    $('.cssDaoRefund').css('max-height', '365px');
}

JaxxUI.prototype.openShapeshiftCoinList = function() {
    var coinAbbreviatedName = HDWalletPouch.getStaticCoinPouchImplementation(curCoinType).pouchParameters['coinAbbreviatedName'];
    
    // $('.wrapTableShapeshiftCoinMenu').css('display', 'block');
	$('.wrapTableShapeshiftCoinMenu').fadeIn();
	
	$('.cssShapeShiftAndToggle .displayCoinsArrow img').removeClass('cssFlipped');
	$('.wrapTableShapeshiftCoinMenu tbody').empty();
	
    var dictOfCoinTypes = g_JaxxApp.getSettings().getListOfShapeshiftCoins(coinAbbreviatedName);
    
    var coinTypeKeys = Object.keys(dictOfCoinTypes);
    
    for (var i = 0; i < coinTypeKeys.length; i++){
        var coinType = dictOfCoinTypes[coinTypeKeys[i]];
        
		if (i === 0) {
            $(".wrapTableShapeshiftCoinMenu tbody").append(this.getShapeshiftCoinListRow(coinType));
		} else {
            $(".wrapTableShapeshiftCoinMenu tbody").append(this.getShapeshiftCoinListRow(coinType, ' cssAdditionalElement'));
		}
	}
	
    $('.wrapTableShapeshiftCoinMenu tbody .scriptAction').off('click'); // This action should be off, but just in case.
	$('.wrapTableShapeshiftCoinMenu tbody .scriptAction').click(function (event) {
        try {
            scriptAction(event);
        } catch (err) {
            console.error(err);
        }
    }); // Reattach script action events.
	
    var coinAbbreviatedName = HDWalletPouch.getStaticCoinPouchImplementation(curCoinType).pouchParameters['coinAbbreviatedName'];

	$('.wrapTableShapeshiftCoinMenu').removeClass('cssBlueHighlight');
	$('.wrapTableShapeshiftCoinMenu .coinType' + g_JaxxApp.getSettings().getShapeshiftCoinTarget(coinAbbreviatedName)).addClass('cssBlueHighlight');
}

JaxxUI.prototype.closeShapeshiftCoinList = function() {
	// $('.wrapTableShapeshiftCoinMenu').css('display', 'none');
	$('.wrapTableShapeshiftCoinMenu').fadeOut(function() {
        $(".wrapTableShapeshiftCoinMenu tbody").empty();
        $('.cssShapeShiftAndToggle .displayCoinsArrow img').addClass('cssFlipped');
    });
}

JaxxUI.prototype.toggleShapeshiftCoinList = function() {
	if (this.isShapeshiftCoinListOpen()){
		this.closeShapeshiftCoinList();
	} else {
		this.openShapeshiftCoinList();
	}
}

JaxxUI.prototype.isShapeshiftCoinListOpen = function() {
	return (!($(".wrapTableShapeshiftCoinMenu").css('display') === 'none'));
}

JaxxUI.prototype.getShapeshiftCoinListRow = function(coinType, additionalClass) {
	// @TODO: Add first element functionality
	// coinType should be 'ETH' or 'BTC' or something.
	if (typeof(additionalClass) === 'undefined') {
		additionalClass = " ";
	}
    
    var coinName = HDWalletHelper.dictCryptoCurrency[coinType]['name'];
    
	return '<tr class="shapeShiftCoinItem'+ additionalClass +' cssShapeShiftCoinListItem scriptAction coinType' + coinType + '" specialAction="selectShapeshiftCoin" value="' + coinType + '"><td class="icon cssHighlighted cssImageLogoIcon'+ coinType + '"><div class="image"></div></td><td class="label">' + coinType + ' - ' + coinName + '</td></tr>';
}

JaxxUI.prototype.populateCurrenciesInSettings = function() {
	
}

JaxxUI.prototype.isMainMenuOpen = function() {
    return this._mainMenuIsOpen;
}

JaxxUI.prototype.toggleMainMenu = function() {
	if (this._mainMenuIsOpen === true) {
		this.closeMainMenu();
	} else {
		this.openMainMenu();
	}
}

JaxxUI.prototype.openMainMenu = function() {
    // @TODO: Consider wrapping this function with a check for ._mainMenuIsOpen === false as an oiptimization.
    
    this._mainMenuIsOpen = true;
    this.moveCarouselToNearestPosition();
	if (window.native && window.native.setMainMenuOpenStatus) {
		window.native.setMainMenuOpenStatus(true);
	}
	
	//        console.log("toggle menu on");
	Navigation.collapseTabs();
    Navigation.hideTransactionHistoryDetails();
	g_JaxxApp.getUI().closeShapeshiftCoinList();
    g_JaxxApp.getUI().closeQuickFiatCurrencySelector();
	//jQuery('.nonScrollSize').css('min-height', jQuery(window).height());
	//jQuery('.menu').css('opacity', 1);

	//set the width of primary content container -> content should not scale while animating
	/*
	var contentWidth = jQuery('.nonScrollSize').width();

	//set the content with the width that it has originally
	jQuery('.nonScrollSize').css('width', contentWidth);

	//display a layer to disable clicking and scrolling on the content while menu is shown
	jQuery('.nonScrollSize').css('display', 'block');

	//disable all scrolling on mobile devices while menu is shown
	jQuery('.nonScrollSize').bind('touchmove', function (e) {
		e.preventDefault()
	});*/

	//set margin for the whole container with a jquery UI animation
    $(".menu").animate({"marginLeft": ["-=300px", 'easeOutExpo']}, {
		duration: 700
	});
    
    $('.menu').addClass('cssMenuCalc');
    
	$(".mainMenuCloser").css('display', 'block');
//	$('.wallet').addClass('cssBlurBg');
    
    $(".wallet").css({
        "opacity": "0.1",
        
        "-webkit-transform": "all 0.5s linear", 
        "-moz-transform": "all0.5s linear",
        "-ms-transform": "all 0.5s linear",
        "-o-transform": "all 0.5s linear",
        "transform": "all 0.5s linear",
    });
	// fade background out
    $('.material-design-hamburger__layer').addClass('material-design-hamburger__icon--to-arrow');
    $('.material-design-hamburger__layer').removeClass('material-design-hamburger__icon--from-arrow');
}

JaxxUI.prototype.setCoinNavBarToDefaultPosition = function() {
    var self=this;
    var coinAbbreviatedName = HDWalletPouch.getStaticCoinPouchImplementation(curCoinType).pouchParameters['coinAbbreviatedName'];

    if (typeof(this._coinBannerCarousel) !== 'undefined' && this._coinBannerCarousel !== null){
        var defaultCoinPosition = $($('.coinBannerContainer .coinType' + coinAbbreviatedName)[0]).prevAll().length; // The number of siblings before the coin banner in the nav bar.
        //this.moveBannerToPosition(defaultCoinPosition); // Move carousel to index of default coin.
        this.getCoinBannerCarousel().move(defaultCoinPosition);
        setTimeout(function(){self.moveBannerToPosition(defaultCoinPosition);},self._coinBannerCarouselAnimationTime);
    }
    
}

JaxxUI.prototype.closeMainMenu = function() {
    if (this._mainMenuIsOpen) {
        // @TODO: Consider updating the banners here instead of when banners are rearranged.
        if (this._walletWasChangedInMenu) {
            this.switchToCoin(g_JaxxApp.getSettings().getListOfEnabledCryptoCurrencies()[0]); // Switch coin type to default coin.
            this.updateHighlightingInCoinBannerContainer();
            this.setCoinNavBarToDefaultPosition(); // Arrange Navigation bar according to the correct layout.
            this._walletWasChangedInMenu = false;
        }
    } else {
        return;
    }
    
    this._mainMenuIsOpen = false;
	if (window.native && window.native.setMainMenuOpenStatus) {
		window.native.setMainMenuOpenStatus(false);
	}	
	//enable all scrolling on mobile devices when menu is closed
	//jQuery('#.non').unbind('touchmove');

	
	//set margin for the whole container back to original state with a jquery UI animation
    jQuery(".menu").animate({"marginLeft": ["100%", 'easeOutExpo']}, {
        duration: 700,
        complete: function () {
            //jQuery('.nonScrollSize').css('width', 'auto');
            //jQuery('.nonScrollSize').css('display', 'none');
            //jQuery('.menu').css('opacity', 0);
            //jQuery('.nonScrollSize').css('min-height', 'auto');

        }
    });
    $('.menu').removeClass('cssMenuCalc');
	jQuery(".mainMenuCloser").css('display', 'none');
	$('.nonScrollSize').fadeTo(0, 500);
	$('.wallet').removeClass('cssBlurBg');
    
    $(".wallet").css({
        "opacity": "1",

        "-webkit-transition": "0.5s linear", 
        "-moz-transition": "0.5s linear",
        "-ms-transition": "0.5s linear",
        "-o-transition": "0.5s linear",
        "transition": "0.25s linear",
    })
    	// Fade background in.
    $('.material-design-hamburger__layer').addClass('material-design-hamburger__icon--from-arrow');
    $('.material-design-hamburger__layer').removeClass('material-design-hamburger__icon--to-arrow');
    
    //this.clearNavigationBarPositionTimeout();
}

JaxxUI.prototype.swipeToCloseMenu = function() {
    var swipeMenu = document.getElementById('body');
    
    Hammer(swipeMenu).on("swiperight", function() {
        g_JaxxApp.getUI().closeMainMenu();

    
    var swipeManager = new Hammer.Manager(swipeMenu);
//    // create a recognizer
//    var swipe = new Hammer.Swipe();
//    // add the recognizer
//    swipeManager.add(swipe);
//    // subscribe to events
//    swipeManager.on('swipeleft', function(e) {
//        e.preventDefault;
//        g_JaxxApp.getUI().openMainMenu();
    });

    var swipeMenu = document.getElementById('body');

    Hammer(swipeMenu).on("swiperight", function(e) {
        if (g_JaxxApp.getUI().isMainMenuOpen()) {
            g_JaxxApp.getUI().closeMainMenu();
        }
    });

    Hammer(swipeMenu).on("swipeleft", function(e) {
        if (!g_JaxxApp.getUI().isMainMenuOpen()) {
            g_JaxxApp.getUI().openMainMenu();
        }
    });

}


// The next three functions pertain to showing and hiding menu windows which are:
// mainMenuMenu
// mainMenuWallets
// mainMenuCurrencies

JaxxUI.prototype.mainMenuShowMenu = function() { // Shows the MENU tab of the main menu.
	$('.cssActiveWindow .mainMenuMenu').addClass('cssSelected');
	$('.cssMenu .menuWindowOptionMenu').addClass('cssSelected');
	$('.cssActiveWindow .mainMenuWallets').removeClass('cssSelected');
	$('.cssMenu .menuWindowOptionWallets').removeClass('cssSelected');
	$('.cssActiveWindow .mainMenuCurrencies').removeClass('cssSelected');
	$('.cssMenu .menuWindowOptionCurrencies').removeClass('cssSelected');
    this.swipeToCloseMenu();
}

JaxxUI.prototype.mainMenuShowWallets = function() { // Shows the WALLETS tab of the main menu.
	$('.cssActiveWindow .mainMenuMenu').removeClass('cssSelected');
	$('.cssMenu .menuWindowOptionMenu').removeClass('cssSelected');
	$('.cssActiveWindow .mainMenuWallets').addClass('cssSelected');
	$('.cssMenu .menuWindowOptionWallets').addClass('cssSelected');
	$('.cssActiveWindow .mainMenuCurrencies').removeClass('cssSelected');
	$('.cssMenu .menuWindowOptionCurrencies').removeClass('cssSelected');
}

JaxxUI.prototype.mainMenuShowCurrencies = function() { // Shows the CURRENCIES tab of the main menu.
	$('.cssActiveWindow .mainMenuMenu').removeClass('cssSelected');
	$('.cssMenu .menuWindowOptionMenu').removeClass('cssSelected');
	$('.cssActiveWindow .mainMenuWallets').removeClass('cssSelected');
	$('.cssMenu .menuWindowOptionWallets').removeClass('cssSelected');
	$('.cssActiveWindow .mainMenuCurrencies').addClass('cssSelected');
	$('.cssMenu .menuWindowOptionCurrencies').addClass('cssSelected');
    
    //this.populateCurrencyList(curCoinType);
    //toggleMainMenu
}

JaxxUI.prototype.generateSettingsCryptoCurrencyRows = function() {
	var self = this;
    // Assertion: Settings has correctly stored the position order of the cryptocurrencies.
	var cryptoCurrencies = g_JaxxApp.getSettings().getCryptoCurrencyPositionList();
	for (var i = 0; i < cryptoCurrencies.length; i++) {
        var coinType = HDWalletHelper.dictCryptoCurrency[cryptoCurrencies[i]].index;
        
        var coinWalletSelector3LetterSymbol =     HDWalletPouch.getStaticCoinPouchImplementation(coinType).uiComponents['coinWalletSelector3LetterSymbol'];

        
		var column1 = '<td class="cssSelectedCurrency"><div class="cssCircleUnchecked"></div></td>';
        var column2 = '<td class="itemNumberLabel cssItemNumberLabel"></td>';
		var column3 = '<td class="coinIcon cssCoinIcon"></td>';
        var column4 = '<td class="coinLabel cssCoinLabel">' + coinWalletSelector3LetterSymbol + ' - ' + HDWalletHelper.dictCryptoCurrency[cryptoCurrencies[i]]['name'] + '</td>';
		var column5 = '<td class="handle cssHandle"><img src="images/dragAndDrop.svg" alt="" height="13" width="13" style="position:absolute; padding-top:15px;"></td>';
        var tableRow = '<tr class="cssCoinCurrency scriptAction coinType' + cryptoCurrencies[i] + '" specialAction ="toggleCryptoCurrency" value="' + cryptoCurrencies[i] + '">' + column1 + column2 + column3 + column4 + column5 + '</tr>';
		$('.coinList tbody').append(tableRow);
		if (g_JaxxApp.getSettings().isCryptoCurrencyEnabled(cryptoCurrencies[i])) {
			g_JaxxApp.getSettings().enableCryptoCurrency(cryptoCurrencies[i]);
            
		} else {
			g_JaxxApp.getSettings().disableCryptoCurrency(cryptoCurrencies[i]);
		}
        
        var isTestnet = HDWalletPouch.getStaticCoinPouchImplementation(HDWalletHelper.dictCryptoCurrency[cryptoCurrencies[i]].index).pouchParameters['isTestnet'];
        
        //TestNet
        if (isTestnet === true) {
            var $elCoin = 'tr.cssCoinCurrency.scriptAction.coinType' + cryptoCurrencies[i];
            $($elCoin).addClass('cssTestnet');
        }
	}
	// Make the table sortable.
	$(".coinList tbody").sortable({
    	/*items: "> tr:not(:first)",*/
    	appendTo: "parent",
    	helper: "clone",
		handle: ".handle",
		update: function(event, ui) {
			// @TODO: Javascript optimization
			g_JaxxApp.getUI().pushCryptoCurrencyPositionOrderToSettings();
            self._walletWasChangedInMenu = true;
            // Sortable change number of element
        //            var $lis = $(this).children('tr');
        //            $lis.each(function() {
        //                var $li = $(this);
        //                var newVal = $(this).index() + 1;
        //                $(this).children('.itemNumberLabel').html(newVal);
        //                $(this).children('#item_display_order').val(newVal);
        //            });
		},
	}).disableSelection();	
    
    // Toggle the rows that need the toggling.
}

JaxxUI.prototype.toggleCryptoCurrencyIsEnabled = function(cryptoCurrency) {
	//console.log(cryptoCurrency);
    
    //@note: @todo: @here: telling the settings that the currency is enabled is fine, but this function should handle all of the ui tasks.
	g_JaxxApp.getSettings().toggleCryptoCurrencyIsEnabled(cryptoCurrency); // Change settings	
	// Add class .cssCurrency is checked to the correct item.
}

JaxxUI.prototype.enableCryptoCurrencyInUI = function(cryptoCurrency) {
    this._walletWasChangedInMenu = true;
	$('.coinList .coinType' + cryptoCurrency + ' .cssSelectedCurrency .cssCircleUnchecked').addClass('cssCurrencyisChecked');// Make UI Change.	
	$(".coinList").find('[value='+cryptoCurrency+']').find('.cssSelectedCurrency').find('.cssCircleUnchecked').css('border', 'none');
    $('.mainMenuWallets .coinType' + cryptoCurrency).addClass('cssOrangeHighlightText');
	this.updateCryptoCurrencyBannersInHeader();
}

JaxxUI.prototype.disableCryptoCurrencyInUI = function(cryptoCurrency) {
    this._walletWasChangedInMenu = true;
    $('.coinList .coinType' + cryptoCurrency + ' .cssSelectedCurrency .cssCircleUnchecked').removeClass('cssCurrencyisChecked');// Make UI Change.
	$(".coinList").find('[value='+cryptoCurrency+']').find('.cssSelectedCurrency').find('.cssCircleUnchecked').css('border', '1px solid white');
    $('.mainMenuWallets .coinType' + cryptoCurrency).removeClass('cssOrangeHighlightText');
	this.updateCryptoCurrencyBannersInHeader();
}

JaxxUI.prototype.pushCryptoCurrencyPositionOrderToSettings = function() {
	// Extract ordering
	var rows = $('.coinList tbody tr');
	var currencyArray = [];
	for (var i = 0; i < rows.length; i++){
		currencyArray.push($($('.coinList tbody tr').get(i)).attr('value'));
	}
	g_JaxxApp.getSettings().setCryptoCurrencyPositionData(currencyArray); // Change settings
}

JaxxUI.prototype.updateCryptoCurrencyBannersInHeader = function() {
	// Parameter: excludeScriptAction is set to true when we want to skip the step where we add listeners.
//	try {
    var currenciesLength = g_JaxxApp.getSettings().getCryptoCurrencyEnabledCount();  
    var minimumBannerAmountForScrolling = 4;
    var generateWithCarousel = !(currenciesLength < minimumBannerAmountForScrolling);
    
    if (!generateWithCarousel) {
        // Hide scroll arrows.
        $('.scrollHeaderContainer .leftArrow').hide();
        $('.scrollHeaderContainer .rightArrow').hide();
        if (currenciesLength === 1) {
            $('.scrollHeaderContainer').css('width', '60px');
            $($('.coinBannerContainer').children()[0]).addClass('cssSelected');
        } else if (currenciesLength === 2) {
            $('.scrollHeaderContainer').css('width', '113px');
            $('.cssCoinSelector').css({"margin-left":"15px", "margin-right": "15px"});
        } else if (currenciesLength === 3) {
            $('.scrollHeaderContainer').css('width', '174px');
            $('.cssCoinSelector').css({"margin-left":"10px", "margin-right": "10px"});
        } 
    } else {
        // Show scroll arrows.
        $('.scrollHeaderContainer .leftArrow').show();
        $('.scrollHeaderContainer .rightArrow').show();
        $('.scrollHeaderContainer').css('width', '231px');
        // Set the width of the wrapper container to a fixed size.
        
        // Same deal, but we center the active currency.
        //var currenciesToInclude = [];
        //var middleCurrency = coinAbbreviatedName[curCoinType];
        //if (typeof(middleCurrency) === 'undefined' || middleCurrency === null) {
        //    middleCurrency = coinAbbreviatedName[g_JaxxApp.getSettings().getDefaultCoinType()];
        //}	currenciesToInclude.push(g_JaxxApp.getSettings().getPreviousEnabledCryptoCurrency(middleCurrency));
        //currenciesToInclude.push(middleCurrency);
        //currenciesToInclude.push(g_JaxxApp.getSettings().getNextEnabledCryptoCurrency(middleCurrency));
        //$('.scrollHeaderContainer').empty();
        //$('.scrollHeaderContainer').append('<div class="scriptAction leftArrow cssLeftArrow" specialAction="slideBannerLeft"><img src="images/arrowLeft.svg" alt="" height="12" width="12" style="position:absolute; padding-top:5px;"></div>');
        //$('.scrollHeaderContainer').append('<div class="cssCoinBannerWrapper viewport"><ul class="coinBannerContainer overview cssCoinBannerContainer"></ul</div>');
        //$('.scrollHeaderContainer').append('<div class="scriptAction rightArrow cssRightArrow" specialAction="slideBannerRight"><img src="images/arrowRight.svg" alt="" height="12" width="12" style="position:absolute; padding-top:5px;"></div>');
        //$('.scrollHeaderContainer').css('width', '227px');
    }
    
    // The following code changes elemental things in the coin banner.
    var currenciesToInclude = g_JaxxApp.getSettings().getListOfEnabledCryptoCurrencies();
    $('.scrollHeaderContainer .coinBannerContainer').empty();
    for (var i = 0; i < currenciesToInclude.length; i++){
        var currencyName = currenciesToInclude[i];
        var element = this.getBannerDivForCryptoCurrency(currencyName);
        $('.scrollHeaderContainer .coinBannerContainer').append(element)
    }
    if (generateWithCarousel) {
        if (this._coinBannerCarousel === null || typeof(this._coinBannerCarousel) === 'undefined'){
            this.initializeCarousels();
        } else {
            this.updateCoinBannerCarousel(); // Remember that this checks for undefined and null types.
        }
    }
    
    // Style stuff
    this.updateHandlersInCoinBannerContainer();
    this.updateHighlightingInCoinBannerContainer();
    updateWalletUI();
}

/*
JaxxUI.prototype.updateNewAttributesInCoin3Banners = function() {
    this.updateNewAttributesFor2OrLessCoinBanners();
	// @TODO: Add this later when there is a slide.
	
	var SelectCoinBannerChildren = $('.coinBannerContainer').children();
    
    SelectCoinBannerChildren.removeAttr('switchToCoin');
    $(SelectCoinBannerChildren[0]).attr('specialAction', 'leftCoinBannerClicked');
    $(SelectCoinBannerChildren[1]).attr('specialAction', 'centerCoinBannerClicked');
    $(SelectCoinBannerChildren[2]).attr('specialAction', 'rightCoinBannerClicked');
	$('.scrollHeaderContainer .leftArrow').attr('specialAction', 'leftBannerArrowClicked');
	$('.scrollHeaderContainer .rightArrow').attr('specialAction', 'rightBannerArrowClicked');
	
    this.resetCoinButton(HDWalletHelper.dictCryptoCurrency[$($('.coinBannerContainer').children()[0]).attr('value')]['index']);
    
    if (SelectCoinBannerChildren.length === 3) {
        this.switchToSolidCoinButton(HDWalletHelper.dictCryptoCurrency[$($('.coinBannerContainer').children()[1]).attr('value')]['index']);
        this.resetCoinButton(HDWalletHelper.dictCryptoCurrency[$($('.coinBannerContainer').children()[2]).attr('value')]['index']);
        $(SelectCoinBannerChildren[1]).addClass('cssSelected');
        console.log( 'Num Currencies Selected ::' + $('.coinBannerContainer').children().length )
    }
	this.updateHandlersInCoinBannerContainer();
    this.updateHighlightingInCoinBannerContainer();
    updateWalletUI();
}

JaxxUI.prototype.updateNewAttributesFor2OrLessCoinBanners = function() {
	this.updateHandlersInCoinBannerContainer();
    this.updateHighlightingInCoinBannerContainer();
}
*/

JaxxUI.prototype.updateHighlightingInCoinBannerContainer = function(){
    // Grey/white highlighting.
    var coinTypesInBanner = []; // ie. [0, 1]
    for (var i = 0; i < $('.coinBannerContainer').children().length; i++){
        coinTypesInBanner.push(HDWalletHelper.dictCryptoCurrency[$($('.coinBannerContainer').children()[i]).attr('value')]['index']);
    }
    for (var i = 0; i < coinTypesInBanner.length; i++){
        this.resetCoinButton(coinTypesInBanner[i]);
    }
    this.selectActiveBanner();    
}

JaxxUI.prototype.updateHandlersInCoinBannerContainer = function() {
	 // This is necessary for highlighting to be set properly.
	//$('.scrollHeaderContainer').children().off();
	$('.coinBannerContainer').children().off('click');
	$('.coinBannerContainer').children().click(function (event) { // Add the scriptAction triggers again.
		try {
			scriptAction(event);
		} catch (err) {
			console.error(err);
		}
	});
}

JaxxUI.prototype.selectActiveBanner = function() {
    this.selectBannerInNavigationBar(curCoinType);
}

JaxxUI.prototype.selectBannerInNavigationBar = function(coinType){
    if (typeof(coinType) === 'undefined' || coinType === null) {
        console.log("error :: JaxxUI :: need to update selectBannerInNavigationBar to not fire on initialization");
        
        return;
    }
    
    var coinAbbreviatedName = HDWalletPouch.getStaticCoinPouchImplementation(coinType).pouchParameters['coinAbbreviatedName'];

    // @TODO: Add a wrapper in that function that handles the case where coinType is not specified correctly.
    $('.coinBannerContainer').children().removeClass('cssSelected');
    $('.coinBannerContainer .coinType' + coinAbbreviatedName).addClass('cssSelected');
    
    var coinButtonSVGName = HDWalletPouch.getStaticCoinPouchImplementation(coinType).uiComponents['coinButtonSVGName'];
    
    $('.coinBannerContainer .cssSelected').css({background: 'url(images/' + coinButtonSVGName + '.svg) no-repeat center center', color: '#FFFFFF'});	
    //$('.coinBannerContainer .coinType')    
}


JaxxUI.prototype.highlightActiveCoinBanner = function() {
	// @Note: Legacy
	// Highlight all coin banners grey.
	$('.coinBannerContainer .cssSelected').css('color', '#fff'); // Highlight selected coin banner white.
}

JaxxUI.prototype.selectMiddleCoinBanner = function() { // We call this when the ui makes a change to the coin banner.
	// @Note: Legacy
	$('.coinBannerContainer').children().removeClass('cssSelected');
	$($('.coinBannerContainer').children()[1]).addClass('cssSelected');

	//this.highlightActiveCoinBanner();
}

JaxxUI.prototype.switchToCoin = function(targetCoinAbbreviatedName){
    this.clearNavigationBarPositionTimeout();
    if (curCoinType != HDWalletHelper.dictCryptoCurrency[targetCoinAbbreviatedName]['index']){
        if (targetCoinAbbreviatedName === 'ETH'){
            switchToCoinType(HDWalletHelper.dictCryptoCurrency[targetCoinAbbreviatedName]['index'], true, function() {});
        } else {
            switchToCoinType(HDWalletHelper.dictCryptoCurrency[targetCoinAbbreviatedName]['index'], null, function() {});
        }	
    } else {

    }
}

JaxxUI.prototype.getBannerDisplayCoinAbbreviation = function(cryptoCurrencyName) {
    return HDWalletHelper.dictCryptoCurrency[cryptoCurrencyName].bannerName;
}

JaxxUI.prototype.getBannerDivForCryptoCurrency = function(cryptoCurrencyName) {  
    var isTestnet = HDWalletPouch.getStaticCoinPouchImplementation(HDWalletHelper.dictCryptoCurrency[cryptoCurrencyName].index).pouchParameters['isTestnet'];

    var extraCss = "";
    
    if (isTestnet === true) {
        extraCss = 'cssTestnet';
    }
    
    return '<li class="scriptAction item cssItem imageLogoBanner' + cryptoCurrencyName + ' cssCoinSelector coinType' + cryptoCurrencyName +  ' ' + extraCss + '" switchToCoin="' + cryptoCurrencyName + '" value="' + cryptoCurrencyName + '">' + '<span class="cssCoinButtonText">' + this.getBannerDisplayCoinAbbreviation(cryptoCurrencyName) + '</span></li>';
    //TestNet
    /*
        var isTestnet = HDWalletPouch.getStaticCoinPouchImplementation(HDWalletHelper.dictCryptoCurrency[cryptoCurrencyName].index).pouchParameters['isTestnet'];
    if(isTestnet === true) {
        var $elCoin = 'li.item.imageLogoBanner' + cryptoCurrencyName;
        $($elCoin).addClass('cssTestnet');
    }
    return listitem;
    */
}

JaxxUI.prototype.getBannerForShapeshiftCoin = function(cryptoCurrencyName){
    return '<div class="scriptAction imageLogoBanner' + cryptoCurrencyName + ' cssCoinSelector coinType' + cryptoCurrencyName + '" value="' + cryptoCurrencyName + '">' + '<span class="cssCoinButtonText">' + this.getBannerDisplayCoinAbbreviation(cryptoCurrencyName) + '</span></div>';
}

JaxxUI.prototype.slideBannerRight = function() {
    var self = this;
	// Assertion: Current coin type is centered in the banner bar.
	//var self = this;
	//var newElement = this.getBannerDivForCryptoCurrency(g_JaxxApp.getSettings().getIncrementCryptoCurrencyNSteps(g_JaxxApp.getSettings().getActiveCoinType(), 2));
	//this.switchToCoin($($('.coinBannerContainer').children()[2]).attr('value'));
	//var elementToRemove = $('.coinBannerContainer').children().first();
	//var insertionIndex = elementOnLeft.indexOf("class") + 7;
    //$('.coinBannerContainer').append(newElement);
    //$(elementToRemove).remove();
    
//    $(newElement).hide();
//	$(newElement).show( function() {console.log('Show Callback');});
    
//	elementToRemove.hide( function(){
//		$(elementToRemove).remove();
//		self.updateNewAttributesInCoin3Banners();
//	});
	//this.updateNewAttributesInCoin3Banners();
	// Attach switchToCoin to the arrow.
    setTimeout( function(){
        self.moveCarouselToNearestPosition();
        self.resetCoinBannerCarouselTimeout();
    }, this._coinBannerCarouselAnimationTime)
	this.updateHandlersInCoinBannerContainer();
}

JaxxUI.prototype.clearNavigationBarPositionTimeout = function() {
    if (typeof(this._coinBannerCarouselTimeout) !== 'undefined' && this._coinBannerCarouselTimeout !== null) {
        clearTimeout(this._coinBannerCarouselTimeout);
    }    
}

JaxxUI.prototype.slideBannerLeft = function() {
    var self = this;
	// Assertion: Current coin type is centered in the banner bar.
	//alert("Sliding left");	
	//var self = this;
	//var newElement = this.getBannerDivForCryptoCurrency(g_JaxxApp.getSettings().getIncrementCryptoCurrencyNSteps(g_JaxxApp.getSettings().getActiveCoinType(), -2));
	//this.switchToCoin($($('.coinBannerContainer').children()[0]).attr('value'));
	//var elementToRemove = $('.coinBannerContainer').children().last();
	//var insertionIndex = elementOnLeft.indexOf("class") + 7;
	//var newElement; //elementOnLeft.slice(0, insertionIndex) + 'cssSlidingFromLeft ' + elementOnLeft.slice(insertionIndex);
	//$('.coinBannerContainer').prepend(newElement);
    //$(elementToRemove).remove();
//	$(newElement).hide();
//	//$(newElementOnLeft).removeClass('cssSlidingFromLeft');
//	$(newElement).show( function() {console.log('Show Callback');});
//	elementToRemove.hide( function(){
//		$(elementToRemove).remove();
//		self.updateNewAttributesInCoin3Banners();
//	});
	//this.switchToCoin(g_JaxxApp.getSettings().getPreviousEnabledCryptoCurrency());
	//this.updateNewAttributesInCoin3Banners();
	// Attach switchToCoin to the arrow.
    setTimeout( function(){
        self.moveCarouselToNearestPosition();
        self.resetCoinBannerCarouselTimeout();
    }, this._coinBannerCarouselAnimationTime);
    this.updateHandlersInCoinBannerContainer();
}

JaxxUI.prototype.resetCoinBannerCarouselTimeout = function() {
    var self = this;
    this.clearNavigationBarPositionTimeout();
    if (!this.isCurrentCoinTypeVisibleInCarousel()) {
        this._coinBannerCarouselTimeout = setTimeout(function(){self.setCoinNavBarToDefaultPosition();}, this._coinBannerCarouselTimeoutTime);
    } else {
        this.clearNavigationBarPositionTimeout()
    }
}

JaxxUI.prototype.isCurrentCoinTypeVisibleInCarousel = function(){
    return this.isCoinTypeVisibleInCarousel(curCoinType);
}

JaxxUI.prototype.isCoinTypeVisibleInCarousel = function(coinType){
    // Checks current index, index + 1 and index + 2
    var currentIndex = this.getCurrentBannerIndexInCarousel();
    return (coinType === this.getCoinAtIndexInCarousel(currentIndex) || coinType === this.getCoinAtIndexInCarousel(currentIndex + 1) || coinType === this.getCoinAtIndexInCarousel(currentIndex + 2));
}

JaxxUI.prototype.getCurrentBannerIndexInCarousel = function(){
    return parseInt(this.convertOffsetToBannerPosition($('.coinBannerContainer').offset().left)); //+ this.getCoinBannerCarousel().slideCurrent;
}

JaxxUI.prototype.getCoinAtIndexInCarousel = function(index){
    // Returns an integer.
    var coinBanners = $('.coinBannerContainer').children();
    return HDWalletHelper.dictCryptoCurrency[$(coinBanners[index % coinBanners.length]).attr('value')]['index'];
    // g_JaxxApp.getUI().getCoinBannerCarousel().slideCurrent
}
/*
JaxxUI.prototype.rightCoinBannerClicked = function(coinType) {
	this.slideBannerRight();
	this.updateNewAttributesInCoin3Banners();
	console.log('The Banner on the left was clicked');
}

JaxxUI.prototype.centerCoinBannerClicked = function(coinType) {
	this.switchToCoin(coinType);
	this.updateNewAttributesInCoin3Banners();
	console.log('The Banner in the center was clicked');
}

JaxxUI.prototype.leftCoinBannerClicked = function(coinType) {
	this.slideBannerLeft();
	this.updateNewAttributesInCoin3Banners();
	console.log('The Banner on the right was clicked');
}

*/
/*
JaxxUI.prototype.rightBannerArrowClicked = function() {
	this.rightCoinBannerClicked($('.coinBannerContainer').children().first().attr('value'));
}

JaxxUI.prototype.leftBannerArrowClicked = function() {
	this.leftCoinBannerClicked($('.coinBannerContainer').children().last().attr('value'));
}
*/
/*
JaxxUI.prototype.setHasAttachedScriptAction = function(value) {
	this._hasAttachedScriptAction = value;
	/* this.updateNewAttributesInCoin3Banners(); 
}*/

JaxxUI.prototype.assignCoinButtonHandlers = function() {
	
}

JaxxUI.prototype.getHasAttachedScriptAction = function() {
	return this._hasAttachedScriptAction;
}
// Command that disables horrizontal movmnet for dradgging and dropping
$( ".exchangeRateList tbody" ).sortable({ axis: 'y' });
$( ".coinList tbody" ).sortable({ axis: 'y' });
$( ".exchangeRateList tbody" ).sortable({
    revert: true
});
$( ".coinList tbody" ).sortable({
    revert: true
});

JaxxUI.prototype.generateShapeshiftBanner = function(sourceCoin, targetCoin) {
    // We usually call this function without setting the second parameter.
	// parameters are of the form 'BTC', 'ETH' etc.
	
	// Consider setting the settings to the target.
	
	if (typeof(targetCoin) === 'undefined'){
		targetCoin = g_JaxxApp.getSettings().getShapeshiftCoinTarget(sourceCoin);
	}
	
	$('.currencyToggleFirst').empty();
	$('.currencyToggleFirst').append(this.getShapeshiftSourceHtml(sourceCoin));
	$('.currencyToggleFirst').append(this.getConversionArrowHtml());
	$('.currencyToggleFirst').append(this.getShapeshiftTargetHtml(targetCoin));
	
	$('.currencyToggleFirst .scriptAction').click(function (event) { scriptAction(event);});
}

JaxxUI.prototype.updateShapeshiftTarget = function(cryptoUnit) {
    var coinAbbreviatedName = HDWalletPouch.getStaticCoinPouchImplementation(curCoinType).pouchParameters['coinAbbreviatedName'];
    
    // Assumes elements have been generated.
	g_JaxxApp.getSettings().setShapeshiftCoinTarget(coinAbbreviatedName, cryptoUnit);
	
	$('.currencyToggleFirst').children().last().remove()
	$('.currencyToggleFirst').append(this.getShapeshiftTargetHtml(cryptoUnit));
	
	$('.currencyToggleFirst .scriptAction').last().click(function (event) { scriptAction(event); });
}

JaxxUI.prototype.getShapeshiftSourceHtml = function(coinType) {
	return '<div class="scriptAction  cssImageLogoBanner'+ coinType +' imageLogoBanner' + coinType + ' imageLogoCurrencyToCurrency shapeShiftSwitchFrom cssShapeshiftSwitchFrom cssCoinSelector cssHighlighted cssSourceCoin" value="' + coinType + '"><span class="cssCoinText">' + coinType + '</span></div>';
}

JaxxUI.prototype.getShapeshiftTargetHtml = function(coinType) {
	return '<div class="scriptAction cssImageLogoBanner' + coinType + ' imageLogoBanner' + coinType + ' imageLogoCurrencyToCurrency shapeShiftSwitchTo cssShapeshiftSwitchTo cssCoinSelector cssHighlighted" specialAction="changeShapeshiftCoinToNextCoinType"><span class="cssCoinText">' + coinType + '</span></div>';
}

JaxxUI.prototype.getConversionArrowHtml = function() {
	return '<img class="cssArrowcoinToCoin" src="images/coinToCoin.svg" alt="" height="12" width="28" style="margin-right:0px; margin-left:0px;">';
}

JaxxUI.prototype.changeShapeshiftCoinToNextCoinType = function() {
	// cryptoUnit should be left blank.
	var sendCoinAbbreviatedName = $('.shapeShiftSwitchFrom').attr('value');
	var receiveCoinAbbreviatedName = g_JaxxApp.getSettings().getNextCryptoForShapeshiftSelection(sendCoinAbbreviatedName);
	// coinType should be set to something like 'ETH' or 'BTC' (the current coin type in the app)
	g_JaxxApp.getSettings().setShapeshiftCoinTarget(sendCoinAbbreviatedName, receiveCoinAbbreviatedName);
	this.updateShapeshiftTarget(receiveCoinAbbreviatedName);

    var receiveCoinType = HDWalletHelper.dictCryptoCurrency[receiveCoinAbbreviatedName].index;
    
    g_JaxxApp.getShapeShiftHelper().setReceivePairForCoinType(curCoinType, receiveCoinType);
    g_JaxxApp.getShapeShiftHelper().clearUpdateIntervalIfNecessary();

    $('.tabContent .address input').trigger('keyup');

    this.closeShapeshiftCoinList(); // Close the menu
}

JaxxUI.prototype.selectShapeshiftCoin = function(receiveCoinAbbreviatedName){
    var coinAbbreviatedName = HDWalletPouch.getStaticCoinPouchImplementation(curCoinType).pouchParameters['coinAbbreviatedName'];

	// coinType is something like 'BTC', 'ETH' etc.
    g_JaxxApp.getSettings().setShapeshiftCoinTarget(coinAbbreviatedName, receiveCoinAbbreviatedName); // Set shapeshift currency in settings for this one.
    
	$('.shapeshiftCoinSelectionMenu tr').removeClass('cssBlueHighlight');
	$('.shapeshiftCoinSelectionMenu .coinType' + receiveCoinAbbreviatedName).addClass('cssBlueHighlight');
	
	this.updateShapeshiftTarget(receiveCoinAbbreviatedName); // Change the target coin banner.
    	
    var receiveCoinType = HDWalletHelper.dictCryptoCurrency[receiveCoinAbbreviatedName].index;
    
    g_JaxxApp.getShapeShiftHelper().setReceivePairForCoinType(curCoinType, receiveCoinType);
    g_JaxxApp.getShapeShiftHelper().clearUpdateIntervalIfNecessary();

    $('.tabContent .address input').trigger('keyup');

    var self = this;
    
    setTimeout(function() {
		
        self.closeShapeshiftCoinList(); // Close the menu
    }, 500);
}

JaxxUI.prototype.initializeCarousels = function() {
    //$('#scrollHeaderContainer').tinycarousel({display: 2});
    //$(document).ready(function(){
        $('#scrollHeaderContainer').tinycarousel({infinite: true, animationTime: this._coinBannerCarouselAnimationTime});
        this._coinBannerCarousel = $('#scrollHeaderContainer').data('plugin_tinycarousel'); // This stores plugin object for tinycarousel correponding to the coin banners in the Navigation bar.
        this._washImageSliderCarousel = null; // This stores plugin object for tinycarousel correponding to the coin banners in the Navigation bar. (Not implemented yet)
    //});
}

JaxxUI.prototype.getCoinBannerCarousel = function() {
    return this._coinBannerCarousel;
}

JaxxUI.prototype.updateCoinBannerCarousel = function() {
    if (typeof(this._coinBannerCarousel) !== 'undefined' && this._coinBannerCarousel !== null){
        this._coinBannerCarousel.update();
    }
}

JaxxUI.prototype.updateSettingsUI = function() {
    var coinFullName = HDWalletPouch.getStaticCoinPouchImplementation(g_JaxxApp.getSettings().getDefaultCoinType()).uiComponents['coinFullName'];
    
    $('.settingsCurrentWallet').text('(' + coinFullName + ')');
}

JaxxUI.prototype.convertOffsetToBannerPosition = function(offsetValue){
    return ($('.scrollHeaderContainer .viewport').offset().left - offsetValue) / $('.coinBannerContainer li').outerWidth(true);
}

JaxxUI.prototype.convertBannerPositionToOffset = function(slidePosition){
    return $('.scrollHeaderContainer .viewport').offset().left - parseInt(slidePosition + 0.5) * $('.coinBannerContainer li').outerWidth(true);    
}

JaxxUI.prototype.moveBannerToPosition = function(slidePosition){
    $('.coinBannerContainer').offset({left: this.convertBannerPositionToOffset(slidePosition)});
}

JaxxUI.prototype.moveCarouselToNearestPosition = function(){
    var slidesFromDefaultPosition = this.convertOffsetToBannerPosition($('.coinBannerContainer').offset().left);
    //var targetOffsetValue = $('.scrollHeaderContainer .viewport').offset().left - parseInt(slidesFromDefaultPosition + 0.5) * $('.coinBannerContainer li').outerWidth(true);
    //$('.coinBannerContainer').offset({left: targetOffsetValue});
    this.moveBannerToPosition(slidesFromDefaultPosition);
}

JaxxUI.prototype.initializeCarouselStickyProperty = function(){
    var self = this;
    /*
    $('.scrollHeaderContainer .viewport').mouseup(function(){
        alert('mouseup event');
        //function(){console.log('Mickey Mouse');}
    });
    $('.scrollHeaderContainer .viewport').mouseout(function(){
        alert('mouseout event');
        //function(){console.log('Mickey Mouse');}
    });
    */
    //$('.scrollHeaderContainer .viewport').on("scroll", function() {
        //console.log('scrolling');
        //$('.scrollHeaderContainer .viewport').mouseup(
        //    function(){console.log('Mickey Mouse');}
        //)
        
        //console.log("Haven't scrolled in 50ms!");
        //clearTimeout(g_Timeout_Scroll);
        //g_Timeout_Scroll = setTimeout(function(){console.log("Haven't scrolled in 50ms!");}, 250);
        //$.data(this, 'scrollTimer', setTimeout(function() {
            // do something
        //    console.log("Haven't scrolled in 50ms!");
        //}, 50));
    //});
    
    $('.scrollHeaderContainer .viewport').bind('scroll', function(){
        self.turnHoverEffectOff();
        self.resetCoinBannerCarouselTimeout();
        clearTimeout(self._coinBannerCarouselDragTimeout);

        self._coinBannerCarouselDragTimeout = setTimeout(function(){
            /*
            $('.scrollHeaderContainer .viewport').mouseup(function(){
                $('.scrollHeaderContainer .viewport').off('mouseup')
                alert('mouseup event');
            });
            */
            self.moveCarouselToNearestPosition();
            self.turnHoverEffectOn();
            self.resetCoinBannerCarouselTimeout();
            //alert('after scroll');
            //$('.scrollHeaderContainer .viewport').trigger('mouseup');}, 250);
            //function(){console.log('Mickey Mouse');}
        }, 250);
    });
}

JaxxUI.prototype.showEtcEthSplitModal = function(baseTXCost, balancesTransferrable) {
    if (this._disableETCETHSplitOption === true) {
        return;
    }
//    eth/etc split :: balancesTransferrable :: 
    //@note: @here: @etcethsplit
//    balancesTransferrable = {
//                "0xdbb89358ebe7af776222acbc99acfa005769f7d9": {
//                    "small": "73736579999999984",
//                    "large": "0.073736579999999984"
//                },
//                "0x190f6bd674b5614e59a53e1f7156a2c2ca86a05f": {
//                    "small": "5000000000000000",
//                    "large": "0.005"
//                },
//                "0x051da87c3679be285dc22e2fba5e833052375ced": false
//            };

    var ethTargetAddress = wallet.getPouchFold(COIN_ETHEREUM).getCurrentReceiveAddress();
    
    var etcTargetAddress = wallet.getPouchFold(COIN_ETHEREUM_CLASSIC).getCurrentReceiveAddress();
    
    $('.etcEthSplitEthAddress').text(ethTargetAddress);
    $('.etcEthSplitEtcAddress').text(etcTargetAddress);
    
    var addressDictToSplit = [];
    var ethBalanceRequiredList = [];

    var addressListText = "";

    var ethCost = 0;
    var etcCost = 0;

    for (var curAddress in balancesTransferrable) {
        var curBalanceStatus = balancesTransferrable[curAddress];
        
        if (curBalanceStatus.ethRequiredLarge !== 0) {
            ethBalanceRequiredList.push({address: curAddress, ethRequiredLarge: curBalanceStatus.ethRequiredLarge});
        } else {
            var addressDetails = {address: curAddress, etcBalance: curBalanceStatus.small};
            
            addressDictToSplit.push(addressDetails);
            
            addressListText += curAddress + ": <span class='cssAmount'>" + parseFloat(parseFloat(curBalanceStatus.large).toFixed(8)) + " ETC</span><br>";
            ethCost += baseTXCost;
            etcCost += baseTXCost;
        }
    }
    
    ethCost = HDWalletHelper.convertWeiToEther(ethCost);
    etcCost = HDWalletHelper.convertWeiToEther(etcCost);

    if (addressListText !== "") {
        $('.etcEthSplitAddressesText').show();
        $('.etcEthSplitAddressesConfirmText').show();
    } else {
        $('.etcEthSplitAddressesText').hide();
        $('.etcEthSplitAddressesConfirmText').hide();
    }
    
    $('.etcEthSplitAddressList').html(addressListText);

    if (ethBalanceRequiredList.length > 0) {
        var ethRequiredText = "";
        
        for (var i = 0; i < ethBalanceRequiredList.length; i++) {
            var curEthBalanceRequiredDict = ethBalanceRequiredList[i];
            
            ethRequiredText += "<span class='cssSelectable'>" + curEthBalanceRequiredDict.address + "</span>: <span class='cssSelectable'>" + parseFloat(parseFloat(curEthBalanceRequiredDict.ethRequiredLarge).toFixed(8)) + "</span> ETH<br>";
        }
        
        $('.etcEthSplitInsufficientGasForRefundWarningText').show();

        $('.etcEthSplitInsufficientGasForRefundWarningText').html("<p>Your following Ethereum addresses have both an ETH and ETC balance. Splitting these addresses will reduce future complications. These ETC-holding address requires more ETH to be able to perform the split. We recommend depositing the required ETH into your following Ethereum wallet address: <br></p>" + ethRequiredText);
        
        $('.etcEthSplitInsufficientGasForRefundWarningText').addClass();
        
    } else {
        $('.etcEthSplitInsufficientGasForRefundWarningText').hide();
    }
    
    var shouldShowSplitModal = false;
    if (addressListText === "" && ethBalanceRequiredList.length === 0) {
        $('.etcEthSplitAddressesNoSplitText').show();
        shouldShowSplitModal = false;
    } else {
        $('.etcEthSplitAddressesNoSplitText').hide();
        shouldShowSplitModal = true;
    }
    
    $('.etcEthSplitCostEth').text(ethCost + " ETH");
    $('.etcEthSplitCostEtc').text(etcCost + " ETC");

    if (shouldShowSplitModal === false) {
        if (this._shouldShowEtcEthSplitIfNoneAvailable === true) {
            shouldShowSplitModal = true;
        }
    }
    
    if (shouldShowSplitModal === true) {
        wallet.setEtcEthAddressesToSplit(addressDictToSplit);

        Navigation.openModal('etcEthSplit');
    }
}

JaxxUI.prototype.toggleIgnoreEtcEthSplit = function() {
    var ignoreEtcEthSplit = (g_JaxxApp.getSettings().getIgnoreEtcEthSplit() === true) ? false: true;
    
    g_JaxxApp.getSettings().setIgnoreEtcEthSplit(ignoreEtcEthSplit);
    
    if (ignoreEtcEthSplit === true) {
        $('.etcEthSplitIgnoreToggleButtonCheckArea').addClass('cssCurrencyisChecked');
        $('.etcEthSplitIgnoreToggleButtonCheckArea').css('border', 'none');
    } else {
        $('.etcEthSplitIgnoreToggleButtonCheckArea').removeClass('cssCurrencyisChecked');
        $('.etcEthSplitIgnoreToggleButtonCheckArea').css('border', '1px solid white');
    }
}

JaxxUI.prototype.checkForEtcEthSplit = function() {
    Navigation.clearSettings();
    Navigation.closeModal();
    this.closeMainMenu();
    
    this._shouldShowEtcEthSplitIfNoneAvailable = true;
    
    g_JaxxApp.getSettings().setIgnoreEtcEthSplit(false);
    $('.etcEthSplitIgnoreToggleButtonCheckArea').removeClass('cssCurrencyisChecked');
    $('.etcEthSplitIgnoreToggleButtonCheckArea').css('border', '1px solid white');

    wallet.getPouchFold(COIN_ETHEREUM).getPouchFoldImplementation().setupCheckForEtcEthSplit();
}

JaxxUI.prototype.confirmEtcEthSplit = function() {
    Navigation.clearSettings();
    Navigation.closeModal();

    if (wallet.getEtcEthAddressesToSplit().length === 0) {
        
    } else {    
        wallet.performEtcEthSplit();
    }
}

JaxxUI.prototype.updateCoinDisplayBalanceInWallet = function(coinType, coinBalance){
    // g_JaxxApp.getUI().updateCoinDisplayBalanceInWallet(4, "0.000000454"); // test case in wallet
    var coinDisplayBalance = parseFloat(HDWalletHelper.getCoinDisplayScalar(curCoinType, coinBalance) + "").toFixed(8);
    // var coinDisplayBalance = "4321.12345678";
    var residualDisplayString = '';
    //    console.log(coinType + " :: " + coinDisplayBalance);
    if (curProfileMode == PROFILE_PORTRAIT) {
        if (coinDisplayBalance.indexOf('.') != -1) {
            var wholePortion = coinDisplayBalance.split(".")[0];
            var decimalPortion = coinDisplayBalance.split(".")[1].substring(0, 8);
            //            0.15419750 41741231
            coinDisplayBalance = wholePortion + "." + decimalPortion;
            //            if (coinDisplayBalance.length >)
            if (wholePortion.length > 3 || coinDisplayBalance.length > 11) {
                coinDisplayBalance = wholePortion + ".";
                var smallScreen = window.matchMedia("(min-width: 375px)");
                if (smallScreen.matches){
                    $('.populateBalanceCoinAmount').css('font-size', '23pt');
                }
                else {
                    $('.populateBalanceCoinAmount').css('font-size', '22pt');
                }
                var coinBalanceResidual = decimalPortion;
                residualDisplayString = '<span class="populateBalanceCoinAmountSuperscript cssEthereumAmountSuperscript">' + coinBalanceResidual + '</span>';
                //                console.log("residualDisplayString :: " + residualDisplayString);

                //                $('.populateBalanceCoinAmountSuperscript').show();
                //                $('.populateBalanceCoinAmountSuperscript').text(coinBalanceResidual);
                //                console.log("coinBalanceResidual :: " + coinBalanceResidual);
                if (wholePortion.length == 5) {
                    coinDisplayBalance = wholePortion + ".";
                    var smallScreen = window.matchMedia("(min-width: 375px)");
                    if (smallScreen.matches){
                        $('.populateBalanceCoinAmount').css('font-size', '22pt');
                    }
                    else {
                        $('.populateBalanceCoinAmount').css('font-size', '21pt');
                    }
                } else {
                    //                $('.populateBalanceCoinAmountSuperscript').hide();
                }
            } else {
                //                $('.populateBalanceCoinAmountSuperscript').hide();
            }

        }
    } else {
        //        $('.populateBalanceCoinAmountSuperscript').hide();
        //        var smallScreen = window.matchMedia("(min-width: 375px)");
        //                if (smallScreen.matches){
        //                    $('.populateBalanceCoinAmount').css('font-size', '21pt');
        //                }
        //                else {
        //                    $('.populateBalanceCoinAmount').css('font-size', '20pt');
        //                }
    }

    $('.populateBalanceCoinAmount').text(coinDisplayBalance);

    $('.populateBalanceCoinAmount').append(residualDisplayString);
}