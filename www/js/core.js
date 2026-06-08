myApp.title = "Mangiaplastica";
myApp.originTarget = 'https://greenpoints.eurven.online';
myApp.debug = false;
myApp.useLocalConnection = false;
myApp.audioEnabled = true;
myApp.endpoint = (myApp.useLocalConnection) ? 'http://localhost:91/v2/':'https://mangiaplastica.eurven.online/v2/';
myApp.errorMessage = 'Impossibile completare l\'operazione.';

myApp.storedKey = Object.freeze(
    {
        UTENTE: 'user',
        UTOKEN: 'user_token',
        STATO_UTENTE: 'stato_utente',
        CODE: 'code',
        CONFERIMENTI: 'conferimenti',
        PUNTI: 'punti',
        CONFERIMENTI_PER_CLIENTE: 'percliente',
        CONFERIMENTI_PER_PERIODO: 'periodo',
        CLASSIFICA: 'classifica',
        MACCHINE: 'macchine',
        TESSERE: 'tessere',
        ELENCO_TESSERE: 'elenco_tessere',
        STORAGE_DIR: 'storage.dir',
        ULTIMI: 'ultimi',
        FORM_STORE: 'f7form-impostazioni-utente',
        LANGUAGE: 'language'
    }
);

myApp.messages = Object.freeze(
    {
        APP_START: 'app.start'
    }
);

myApp.api = Object.freeze(
    {
        REGISTRAZIONE:'registrazione',
        ACCESSO: 'login',
        ACCESSO_AUTOMATICO: 'login_token',
        PROFILO: 'profilo',
        AGGIORNA_PROFILO: 'aggiorna',
        RECUPERA_PASSWORD: 'recupera_password',
        SERVIZI: 'servizi'
    }
);

/** Async Function **/

myApp.sendRequest = function($url, $data, callback, callback_error) {

    myApp.setupHeaders();
    navigator.geolocation.getCurrentPosition(success);
    if (crd != null) {
        $data.latitude = crd.latitude;
        $data.longitude = crd.longitude;
    } else {
        $data.noposition= 1;
    }

    dpr =  myApp.dialog.preloader(myApp.translate("messaggio_richiesta"));

    myApp.request.postJSON(
        $url ,
        (JSON.stringify($data)),
        function(data) {
            myApp.debugControl(data);
            myApp.dialog.close();
            if (typeof data == 'object') j = data;
            else j = JSON.parse(data);
            if (!j.hasError) {
                callback(j);
            } else {
                if (callback_error) callback_error(j);
                else myApp.dialog.alert(myApp.translate(j.statusMessage), myApp.title);
            }
        },function (xhr, status){

            if (status == 0) myApp.dialog.alert(myApp.translate('servizio_impossibile_contattare'));
            else if (status == 401) myApp.dialog.alert(myApp.translate('servizio_problema'));
            else callback_error();

            myApp.dialog.close();
        }
    )
};

var crd ;
var options = {enableHighAccuracy: true,timeout: 5000,maximumAge: 0};

function success(pos) {
    crd = pos.coords;
};

function error(err) {
    console.log('ERROR(' + err.code + '): ' + err.message);
};

myApp.readData = function(key) {

    if (localStorage.key(key))
        return JSON.parse(localStorage.getItem(key));
    else
        return null;
}

myApp.storeData = function(data){
    for (var key in data.keys) {
        k = data.keys[key];
        localStorage.setItem(k,JSON.stringify(data.data[k]));
    }
}


myApp.storeSingleData = function(key, value){
    localStorage.setItem(key,JSON.stringify(value));
}

myApp.notifyMessage = function($message, $hold){
    myApp.notification.create({
        title: myApp.name,
        text: $message,
        closeTimeout: $hold,
        closeButton: true,
    }).open();

}

myApp.alertMessage = function($message, $hold){
    myApp.dialog.alert( $message, myApp.title);
}

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

myApp.debugControl = function (mess, trace) {
    if (myApp.debug) {
        if (trace) {
            console.log(myApp.debugControl.caller);
        }
        else
            console.log(mess);
    }


}

myApp.createLoaderApp = function (tipo) {
    myApp.popup.open('.popup-'+tipo);
}

myApp.closeLoaderApp = function () {
    myApp.popup.close('.popup-trasmissione');
    myApp.popup.close('.popup-posizione');
}

myApp.loadContext =function() {
    context = {
        versione: myApp.versione
    };

    return myApp.loadLangContext(context);
}

myApp.loadLangContext = function(context) {
    if (context != null) {

        if (myApp.language == null) ll = 'it';
        else ll = myApp.language;
        context.lang = app_langs[ll];
        context.av_lang = active_langs;
        context.curr_lang = ll;
    }


    return context;
}


myApp.loadUserContext =function() {

    context = {
        utente: myApp.readData(myApp.storedKey.UTENTE),
        stato_utente: myApp.readData(myApp.storedKey.STATO_UTENTE),
        code: myApp.readData(myApp.storedKey.CODE),
        conferimenti: myApp.readData(myApp.storedKey.CONFERIMENTI),
        punti :  myApp.readData(myApp.storedKey.PUNTI),
        ultimi: myApp.readData(myApp.storedKey.ULTIMI),
        elenco_tessere: myApp.readData(myApp.storedKey.ELENCO_TESSERE),
        classifica: myApp.readData(myApp.storedKey.CLASSIFICA),
        progetti: myApp.readData('progetti'),
        elaborazioni: myApp.readData('elaborazioni'),
    };

    if (myApp.readData(myApp.storedKey.TESSERE))
        context.tessere =  myApp.readData(myApp.storedKey.TESSERE);


    context = myApp.loadLangContext(context);
    return context;
}

myApp.loadConferimentiContext =function() {

    context = {
        utente: myApp.readData(myApp.storedKey.UTENTE),
        stato_utente: myApp.readData(myApp.storedKey.STATO_UTENTE),
        conferimenti: myApp.readData(myApp.storedKey.CONFERIMENTI),
        ultimi: myApp.readData(myApp.storedKey.ULTIMI),
        periodo: myApp.readData(myApp.storedKey.CONFERIMENTI_PER_PERIODO),
    };


    context = myApp.loadLangContext(context);
    return context;
}

myApp.loadMacchineContext =function() {

    context = {
        utente: myApp.readData(myApp.storedKey.UTENTE),
        macchine: myApp.readData(myApp.storedKey.MACCHINE),
    };


    context = myApp.loadLangContext(context);
    return context;
}


myApp.setupHeaders = function() {

    if (myApp.readData(myApp.storedKey.UTOKEN))
        myApp.request.setup({
            headers: {
                'Authorization': 'Bearer '+myApp.readData(myApp.storedKey.UTOKEN),
                'authtoken': 'CRPXPR',
                'datatype': 'BASE64'
            },
            processData: false,
        });
    else
        myApp.request.setup({
            headers: {
                'Authorization': '%4sa123fsd9&0=££',
                'authtoken': 'CRPXPR',
                'datatype': 'BASE64',
            },
            processData: false,
        });

}

myApp.linkify = function(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;
    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="#" class="follow-url link" data-url="$1">$1</a>');

    return replacedText;
    }



myApp.getMap = function() {

    var mapOptions = {
        center: new google.maps.LatLng(0, 0),
        zoom: 1,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false
    };

    map = new google.maps.Map(document.getElementById("map"), mapOptions);


    if (myApp.latitude) {

        var latLong = new google.maps.LatLng(myApp.latitude, myApp.longitude);
        var marker = new google.maps.Marker({
            position: latLong,
            icon: './img/me_icon.png'
        });

        marker.setMap(map);

        map.setCenter(marker.getPosition());
    } else {
        var latLong = new google.maps.LatLng(41.902782, 12.496366);
        map.setCenter(latLong);
    }



    map.setZoom(13);
    macchine = myApp.readData(myApp.storedKey.MACCHINE);

    if (macchine != null) {
        bounds = new google.maps.LatLngBounds();
        macchine.forEach(function (macchina) {
            myApp.createMarker(macchina, map, bounds);
        });
        bounds.extend(latLong);


        map.fitBounds(bounds);
        map.panToBounds(bounds);
    }

}


myApp.createMarker = function(macchina, map, bounds) {

    var placeLoc = new google.maps.LatLng(macchina.latitudine, macchina.longitudine);
    bounds.extend(placeLoc);

    var marker = new google.maps.Marker({
        map: map,
        position: placeLoc,
        icon: './img/map_icon.png'
    });

    var infoWindow = new google.maps.InfoWindow({content : macchina.descrizione});

    google.maps.event.addListener(marker, 'click', function () {

        infoWindow.open(map, this);
        $$('.macchina').removeClass('map-element-active');
        $$('#x-'+macchina.codice_macchina).addClass('map-element-active');

    });
}


myApp.loadPageComponentBase = function(page) {
    // /if (myApp.language == null) return "./pages/it/"+page;
    //else if (myApp.language == 'it' ) return "./pages/it/"+page;
    //else if (myApp.language == 'en' ) return "./pages/en/"+page;
    //else
    return "./pages/"+page;
}
