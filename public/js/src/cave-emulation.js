if (typeof cave === "undefined") {
    window.cave = {
        toolbar_enableBackBtnFunc: function(enable) {
            console.log('cave.toolbar_enableBackBtnFunc(enable = ' + enable + ')');
        },

        toolbar_setCallback: function(btnType, callback) {
            console.log('cave.toolbar_setCallback(btnType = ' + btnType + ', callback = ' + typeof callback + ')');
        },

        toolbar_setVisible: function(visibility) {
            console.log('cave.toolbar_setVisible(visibility = ' + visibility + ')');
        },

        toolbar_setButtonType: function(type) {
            console.log('cave.toolbar_setButtonType(type = ' + type + ')');
        },

        toolbar_setActiveButton: function(btnType) {
            console.log('cave.toolbar_setActiveButton(btnType = ' + btnType + ')');
        },

        memo_open: function() {
            console.log('cave.memo_open()');
        },

        memo_clear: function() {
            console.log('cave.memo_clear()');
        },

        memo_hasValidImage: function() {
            console.log('cave.memo_hasValidImage()');
            return true;
        },

        memo_getImageBmp: function() {
            console.log('cave.memo_getImageBmp()');
            return 'Qk1SEwAAAAAAAJIAAAB8AAAAQAEAAHgAAAABAAEAAAAAAMASAAASCwAAEgsAAAIAAAACAAAAAAD/AAD/AAD/AAAAAAAA/0JHUnOPwvUoUbgeFR6F6wEzMzMTZmZmJmZmZgaZmZkJPQrXAyhcjzIAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAP///wD/////////////////////+P/////8f/////////////////////////////////////////////j//////H/////////////////////////////////////////////4//////x/////////////////////////////////////////////+P/////8f////////////////////////////////////////4A///h//////H////////////////////////////////////////4AH//4f/////x////////////////////////////////////////+Hx///H/////8f////////////////////////////////////////j8H//x//////H////////////////////////////////////////4wB//8f/////x////////////////////////////////////////+AAP//D//h//8f////////////////////////////////////////wPh//4//4f//H////////////////////////////////////////8H4f/+P/+H//x/////////////////////////////////////////h/D//j/////8f////////////////////////////////////////4f4f/4//////H/////////////////////////////////////////D/D/+P/////x/////////////////////////////////////////w/w//j/////8f////////////////////////////////////////+H+H/4//////H/////////////////////////////////////////w/g/+P/////x/////////////////////////////////////////8P+H/j//A//8f/////////////////////////////////////////h/h/4//wP//H/////////////////////////////////////////8f8P+P/4B//x//////////////////////////////////////////D/D/j/8Mf/8f/////////////////////////////////////////4f4f4/+HD//H/////////////////////////////////////////+D+H+P/h4//x//////////////////////////////////////////4fwfj/w+H/8f/wB//////////////////////////////////////+H+H4/8Ph//H/wAP//////////////////////////////////////w/w+H+H4P/x/wPA//////////////////////////////////////+H+Hx/h+D/8fwH4H//////////////////////////////////////x/w8f4Pgf/HwP/wf/////////////////////////////////////8P8HH8D4H/x4H/8D//////////////////////////////////////h/wx/A8A/8YP//4H/////////////////////////////////////8f8EfgPEP/EH///B//////////////////////////////////////D/gH4jxj/wH///8H/////////////////////////////////////4f8B+I8Y/8D////g//////////////////////////////////////D/gfCHGH/D/8B/8D/////////////////////////////////////4f8Hwhxx/w/+AP/gf/////////////////////////////////////D/h8cccf///Bg/+D/////////////////////////////////////4f//HHHH///g8H/wf/////////////////////////////////////D//hxhw///w/gf+D/////////////////////////////////////wf/48YeP//4P+D/4f/////////////////////////////////////D/+PCPj//4P/wf/A/////////////////////////////////////w//Dwj4//8H//B/4H////////////////////////////////////+D/x+A+P/+D//4H/h/////////////////////////////////////w/8fgPj//D///g/4D////////////////////////////////////+D/GAAAf/B///+D8AP////////////////////////////////////w/xAAAH/g////wPDD////////////////////////////////////+H8ADAB/w/////BB4f////////////////////////////////////w/Aggwf4f////4A/H////////////////////////////////////+HweA/D4P/////gfh/////////////////////////////////////w4Pgfw8H/////8Hwf///////////////////////////////////+AAAAB+EH//////wAP//////////////////////////////////+AAAAAAAAAf/////8AH//////////////////////////////////gAB+P//gAAAAH////////////////////////////////////////4B///////H4AB////////////////////////////////////////+P//////////4f////////////////////////////////////////j//////////+H////////////////////////////////////////4///////////j////////////////////////////////////////+P//////////4/////////////////////////////////////////j//////////8P////////////////////////////////////////4///////////D////////////////////////////////////////+P//////////x/////////////////////////////////////////j//////////8f////////////////////////////////////////4////wD/////H////////////////////////////////////////+P///4AP////x/////////////////////////////////////////h///wPAH///8f////////////////////////////////////////4f//4H8Af///H//////////////////////////////////////8ADH//wP/+AP//x//////////////////////////////////////8AAB//wH//4B//8YB////////////////////////////////////+D/Af/wP///8B//AAAP///////////////////////////////////j/8H/4H////gH/wHgA/////////////////////////////////8AA//x/8P/////gP8f/8H///////AAAAAAAAP////////////////+AAP/8f+H/////+A/H//x///////wAAAAAAAD////////////////+D////H+D8P///H8Bx//4f//////////////w/////////////////h////x/B/D///x/wEf/8AH///////////////////////////////4////8fB/x///8f/gH//AAP//////////////////////////////+H////HA/8f///H/8B///+B/////////////////////////////8AA////xg//H///x//4f///8H////////////////////////////8AAP///8Q//x///8f//H////h////////////////////////////8D//////Af/4f///H//x////8f///////////////////////////+D//////wP/+P///x//8f////H////////////////////////////D//////8H//j///8f//H////h////////////////////////////h///////H//4////H//x////w////////////////////////////4///////x///////x//8D///gf///////////////////////////+P/////8Af//////////AH//4D////////////////////////////j/////AAH//////////xAP/+AD////////H//////////////////4/////ADj//////////8eB///Af///////w//////////////////+P///wA/4///////////H8H///D///////+H//////////////////h///wA/8P//////////x/gf//w//////g/g//////////////////8P//AP//D//////////8f+B//+P/////4P+P//////////////////D/+AP//w/gAAAAAAAAAH/4H//j/////+H/j//////////////////4P4A///8AAAAAAAAAAAB//gf/4////j/w/////////////////////BgB////gAf///////////+D/+P///4f+P////////////////////4AH///////////////////4H/D////D/h/4D//////////////////Af////////////////////Afg/x//w/AP+A////////////////////////////////////////+Awf8f/+MAB/h/////////////////////////////////////////wAP/D//gA4f8f/////////////////////////////////////////wP/4//8D/D///////////////////////////////////////////+D/+P//A/4///////////////////////////////////////////////j//4f+H//////////////////////////////////////////////4f//H/x///////////////////////////////////////////////H//w/////////////////////////////////////////////////w//8H////////////////////////////////////////////////+P//x/////////////////////////////////////////////////h////////////////////////////////////////////////////8P////////////////////////////////////////////////////D////////////////////////////////////////////////////4////////////////////////////////////////////////////+P////////////////////////////////////////////////////j////////////////////////////////////////////////////4//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8=';
        },

        memo_getImageRawTga: function() {
            console.log('cave.memo_getImageRawTga()');
            return 'Qk1CAAAAAAAAAD4AAAAoAAAAAQAAAAEAAAABAAEAAAAAAAQAAADEDgAAxA4AAAAAAAAAAAAAAAAAAP///wCAAAAAAAAA';
        },

        toolbar_setNotificationCount: function(count) {
            console.log('cave.toolbar_setNotificationCount(' + count + ')');
        },

        error_callErrorViewer: function(errorCode) {
            var fakeMessage = 'Message for error code ' + errorCode;
            alert(errorCode + '\n\n' + fakeMessage);
        },

        error_callFreeErrorViewer: function(errorCode, message) {
            alert(errorCode + '\n\n' + message);
        },

        transition_begin: function() {
            console.log('cave.transition_begin()');
        },
        transition_end: function() {
            console.log('cave.transition_end()');
        },
        transition_beginWithoutEffect: function() {
            console.log('cave.transition_beginWithoutEffect()');
        },
        transition_endWithoutEffect: function() {
            console.log('cave.transition_endWithoutEffect()');
        },

        ls_setItem: function(key, value) {
            console.log('cave.ls_setItem()');
            // string でないと実機でエラー出るので挙動を合わせる
            for (var i = 0; i < 2; i++) {
                if (typeof arguments[i] !== 'string') {
                    console.error('Argument ' + i + ' should be string');
                    console.error('JavaScript Extension error. Arguments Count or Argument Type is not mutch. Or , too big arguments.');
                    return undefined;
                }
            }
            sessionStorage.setItem(key, value);
        },
        ls_getItem: function(key) {
            console.log('cave.ls_getItem()');
            if (typeof key !== 'string') {
                console.error('Argument 0 should be string');
                console.error('JavaScript Extension error. Arguments Count or Argument Type is not mutch. Or , too big arguments.');
                return undefined;
            }
            return sessionStorage.getItem(key);
        },
        ls_removeItem: function(key) {
            console.log('cave.ls_removeItem()');
            sessionStorage.removeItem(key);
        },
        // ゲスト初回起動済みフラグをセットする
        ls_setGuestModeLaunched: function(bool) {
            console.log('cave.ls_setGuestModeLaunched( ' + bool + ' )');
        },
        lls_setItem: function(key, value) {
            console.log('cave.lls_setItem()');
            localStorage.setItem(key, value);
        },
        lls_getCount: function() {
            console.log('cave.lls_getCount()');
            return localStorage.length;
        },
        lls_getItem: function(key) {
            console.log('cave.lls_getItem()');
            return localStorage.getItem(key);
        },
        lls_removeItem: function(key) {
            console.log('cave.lls_removeItem()');
            return localStorage.removeItem(key);
        },
        ls_canUseCachedServiceToken: function() {
            console.log('cave.ls_canUseCachedServiceToken()');
            return sessionStorage.getItem('custk') === '1' ? true : false;
        },
        ls_setCanUseCachedServiceToken: function(can_use) {
            console.log('cave.ls_setCanUseCachedServiceToken');
            var flag = can_use ? '1' : '0';
            sessionStorage.setItem('custk', flag);
        },
        dialog_oneButton: function(title, message, button_text) {
            console.log('cave.dialog_oneButton()');
            alert("タイトル:" + title + "\n" + "メッセージ:" + message + "\n\n[ " + button_text + " ]");
            return 0;
        },
        lls_getKeyAt: function(index) {
            console.log('cave.lls_getKeyAt index = ' + index);
            return localStorage.key(index);
        },
        mii_getIconBase64: function(expression) {
            console.log('cave.mii_getIconBase64 expression = ' + expression);
            // 本来表情毎に出し分けるべきだが、とりあえず固定のものを出す
            return 'data:image/png;base64,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';
        },
        mii_getName: function() {
            console.log('cave.mii_getName');
            return 'chris4403';
        },
        dialog_twoButton: function(title, message, buttonL_text, buttonR_text) {
            console.log('cave.dialog_twoButton()');
            var result = confirm("タイトル:" + title + "\n" + "メッセージ:" + message + "\n\n[ " + buttonL_text + " (Cancel) ] [ " + buttonR_text + " (OK) ]");
            return result ? 1 : 0;
        },

        brw_scrollImmediately: function(posX, posY) {
            console.log('cave.brw_scrollImmediately(posX='+posX+', posY='+posY+')');
            window.scroll(posX, posY);
        },

        brw_getScrollTopX: function() {
            console.log('cave.brw_getScrollTopX()');
            return window.pageXOffset;
        },

        brw_getScrollTopY: function() {
            console.log('cave.brw_getScrollTopY()');
            return window.pageYOffset;
        },

        brw_notifyPageMoving: function() {
            console.log('cave.brw_notifyPageMoving()');
        },

        requestGc: function() {
            console.log('requestGc');
        },

        exitApp: function() {
            console.log('cave.exitApp()');
        },

        plog_getPlayTitlesFilteredByPlayTime: function(minutes) {
            console.log('cave.plog_getPlayTitlesFilteredByPlayTime(' + minutes + ')');
            return '{"IDs":["0004001000020700"]}'; // Miiスタジオ
        },

        jump_toAccount: function() {
            console.log('cave.jump_toAccount()');
        },

        snd_playSe: function(label) {
            console.log('cave.snd_playSe(' + label + ')');
        },

        snd_playBgm: function(label) {
            console.log('cave.snd_playBgm(' + label + ')');
        },

        sap_exists: function() {
            console.log('cave.sap_exists()');
            return false;
        },

        sap_programId: function() {
            console.log('cave.sap_programId()');
            return undefined;
        },

        capture_getLowerImage: function() {
            console.log('cave.capture_getLowerImage()');
        },

        capture_getUpperImageLeft: function() {
            console.log('cave.capture_getUpperImageLeft()');
        },

        capture_getUpperImageRight: function() {
            console.log('cave.capture_getUpperImageRight()');
        },

        capture_getUpperImage3D: function() {
            console.log('cave.capture_getUpperImage3D()');
        },

        capture_getLowerImageDetail: function(width, height, quality, format) {
            console.log('cave.capture_getLowerImageDetail('+
                        [width, height, quality, format].join(', ')
                        +')');
        },

        capture_getUpperImageLeftDetail: function(width, height, quality, format) {
            console.log('cave.capture_getUpperImageLeftDetail('+
                        [width, height, quality, format].join(', ')
                        +')');
        },

        capture_getUpperImageRightDetail: function(width, height, quality, format) {
            console.log('cave.capture_getUpperImageRightDetail('+
                        [width, height, quality, format].join(', ')
                        +')');
        },

        capture_getUpperImage3DDetail: function(width, height, quality, format) {
            console.log('cave.capture_getUpperImage3DDetail('+
                        [width, height, quality, format].join(', ')
                        +')');
        },

        capture_notifyUpdatedLocalList: function() {
            console.log('cave.capture_notifyUpdatedLocalList()');
        },

        capture_isEnabled: function() {
            console.log('cave.capture_isEnabled()');
            return false;
        },
        capture_isEnabledEx: function(screen) {
            console.log('cave.capture_isEnabledEx(' + screen +')');

            // テスト等でスクショの有無を固定したい場合にクッキーで指定できるようにする, 実機ではこの挙動は存在しない
            var force = Olv.Cookie.get('force_screenshot_for_test');
            if (force === 'true')  return true;
            if (force === 'false') return false;

            return Math.random() >= 0.5 ? true : false;
        },

        boss_regist: function(interval_hour) {
            console.log('cave.boss_regist(' + interval_hour + ')');
            return true;
        },
        boss_registEx: function(interval_hour, count) {
            console.log('cave.boss_regist(' + interval_hour + ',' + count + ')');
            return true;
        },

        boss_unregist: function() {
            console.log('cave.boss_unregist()');
        },

        boss_isRegisted: function() {
            console.log('cave.boss_isRegisted()');
            return true;
        },

        boss_clearNewArrival: function() {
            console.log('cave.boss_clearNewArrival()');
        },
        lls_clear: function() {
            console.log('cave.lls_clear()');
            localStorage.clear();
        },
        lls_setCaptureImage: function(key, value) {
            console.log('cave.setCaptureImage(' + [key, value].join(', ') + ')');
            localStorage.setItem(key, value);
            return 0;
        },
        lls_getPath: function(key) {
            console.log('cave.getPath(' +  key + ')');
            var value = localStorage.getItem(key);
            if (value == 0) {
                return '/img/dummy-image/screenshot-dummy-3ds-low.jpeg';
            } else {
                return '/img/dummy-image/screenshot-dummy-3ds-upper.jpeg';
            }
        },

        history_getPrev: function() {
            console.log('cave.history_getPrev()');
            // 直前の履歴項目の URL を返す API だが、
            // とりあえずは referrer で代用しておく。
            return document.referrer;
        },
        history_removePrev: function() {
            console.log('cave.history_removePrev()');
        },
        history_getAt: function(backIndex) {
            console.log('cave.history_getAt(' + backIndex + ')');
            return '';
        },
        history_removeAt: function(backIndex) {
            console.log('cave.history_removeAt(' + backIndex + ')');
        },

        history_getBackCount: function() {
            console.log('cave.history_getBackCount()');
            // 戻ることのできるページ数を返すAPIだが、
            // とりあえずは referrer で代用しておく。
            return !!document.referrer ? 1 : 0;
        },

        toolbar_setMode: function(mode) {
            console.log('cave.toolbar_setMode(' + mode + ')');
        },
        toolbar_setWideButtonMessage: function(message) {
            console.log('cave.toolbar_setWideButtonMessage(' + message + ')')
        },
        jump_existsWebbrs: function() {
            console.log('jump_existsWebbrs()');
            return true;
        },
        jump_toSystemUpdate: function(type) {
            console.log('jump_toSystemUpdate(' + type + ')')
        },
        jump_toWebbrs: function(url) {
            console.log('cave.jump_toWebbrs(' + url + ')');
            window.location.href = url;
            return true;
        },
        jump_toShop: function(dialog, titleId) {
            console.log('cave.jump_toShop(' + dialog + ', ' + titleId + ')');
            return true;
        },
        jump_getYoutubeVersion: function() {
            console.log('cave.jump_getYoutubeVersion()');
            return -1;
        },
        jump_suspendedToutube: function(query) {
            console.log('cave.jump_suspendedToutube(' + query + ')');
            return 1;
        },
        jump_toYoutube: function(dialog, query) {
            console.log('cave.jump_toYoutube(' + dialog + ', ' + query + ')');
            return 1;
        },
        jump_existsApplication: function(titleId) {
            console.log('jump_existsApplication(' + titleId + ')');
            return true;
        },
        jump_resetParamToApp: function() {
            console.log('jump_resetParamToApp');
        },
        jump_canUseQuery: function(titleId) {
            console.log('jump_canUseQuery(' + titleId + ')');
            return true;
        },
        jump_setModeToApp: function(mode) {
            console.log('jump_setModeToApp(' + mode + ')');
        },
        jump_setDataUTF8ToApp: function(type, data) {
            console.log('jump_setDataUTF8ToApp(' + type + ', ' + data + ')');
        },
        jump_setNumberDataToApp: function(type, data) {
            console.log('jump_setNumberDataToApp(' + type + ', ' + data + ')');
        },
        jump_setBase64DataToApp: function(type, data) {
            console.log('jump_setBase64DataToApp(' + type + ', ' + data + ')');
        },
        jump_toApplication: function(dialog, titleId) {
            console.log('cave.jump_toApplication(' + dialog + ', ' + titleId + ')');
            return true;
        },
        convertTimeToString: function(unixTime) {
            console.log('cave.convertTimeToString(' + unixTime + ')');
            var date = new Date(unixTime * 1000);
            return date.getFullYear() + '-' + this._toDoubleDigits( date.getMonth() + 1 ) + '-' + this._toDoubleDigits(date.getDate())
            + ' ' + this._toDoubleDigits(date.getHours()) + ':' + this._toDoubleDigits(date.getMinutes()) + ':' + this._toDoubleDigits(date.getSeconds());
        },
        _toDoubleDigits: function (num) {
            num +="";
            if (num.length === 1) {
                num = "0" + num;
            }
            return num;
        },
        getLocalTimeSeconds: function () {
            console.log('cave.getLocalTimeSeconds()');
            return parseInt(new Date().getTime() / 1000);
        },
        effect_scrollGuide: function(flag) {
            console.log('cave.effect_scrollGuide( ' + flag + ' )');
        },
        effect_setScrollGuideOffsetPos: function(x, y) {
            console.log('effect_setScrollGuideOffsetPos( x = ' + x + ', y = ' + ' )');
        },
        // キーボードアプレットに入力した文字列が返り値になるので window.prompt でエミュレートする
        swkbd_callFullKeyboard: function(text, maxLength, minLength, isMonospace, isMultiline, isConvertible) {
            console.log('cave.callFullKeyboard( ' + Array.prototype.join.call(arguments, ', ') + ' )');
            return window.prompt('cave.callFullKeyboard', text);
        },
        swkbd_callFullKeyboardWithGuide: function(text, maxLength, minLength, isMonospace, isMultiline, isConvertible, guide) {
            console.log('cave.callFullKeyboardWithGuide( ' + Array.prototype.join.call(arguments, ', ') + ' )');
            return window.prompt('cave.callFullKeyboardWithGuide [' + guide + ']', text);
        },
        viewer_setOnCloseCallback: function(callback) {
            console.log('cave.viewer_setOnCloseCallback(callback = ' + typeof callback + ')');
        },
        home_setEnabled: function(flag) {
            console.log('cave.home_setEnabled', flag);
        },
    };
}
