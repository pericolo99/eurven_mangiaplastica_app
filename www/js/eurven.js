var myApp = new Framework7({
    root: '#app',
    name: 'Mangiaplastica',
    id: 'it.eurven.app',
    panel: {
        swipe: 'left',
    },
    routes: routes,
    modalCloseByOutside: false,
    dialog: {
        buttonOk: 'Procedi',
        buttonCancel: 'Annulla'
    }
});

var $$ = Dom7;

var app = {

    initialize: function() {
        document.addEventListener("backbutton", this.onBackKeyDown, false);
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener("resume", this.onDeviceResume, false);
        document.addEventListener("pause", this.onDevicePause, false);
    },
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        window.screen.orientation.lock('portrait');
        //window.open = cordova.InAppBrowser.open;
        document.addEventListener("backbutton", this.onBackButton, false);
        myApp.init();


        var langCurr = (myApp.readData(myApp.storedKey.LANGUAGE));
        if (langCurr == null) myApp.language = 'it';
        else myApp.language = langCurr;



        cordova.getAppVersion.getVersionNumber(function (version) {
            myApp.versione =  version;
            myApp.changeLang(myApp.language);
            myApp.checkUtente();
        });
    },
    onBackButton: function(){
        myApp.views.main.router.back();

    },
    onDeviceResume: function(){
        myApp.debugControl("Applicazione riattivata");
    },
    onDevicePause: function(){
    },
    receivedEvent: function(id) {
        myApp.debugControl('Received Event: ' + id);
    },
    onBackKeyDown: function(){
        myApp.views.main.router.back();
}
};

app.initialize();

function eurvenMap($data) {
    navigator.geolocation.getCurrentPosition(success);
}
window.eurvenMap=eurvenMap;

