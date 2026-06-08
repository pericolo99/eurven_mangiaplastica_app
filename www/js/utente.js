
myApp.checkUtente = function() {
    if (localStorage.getItem(myApp.storedKey.UTOKEN) != null) {
    //Reload status and data
      var o = {};
      myApp.setupHeaders();
      myApp.sendRequest(
          myApp.endpoint+"login_token",
          o,
          function (data) {
              myApp.storeData(data);
              myApp.views.main.router.navigate("/welcome/",
                  {
                      reloadAll: true,
                      reloadCurrent: true,
                  }
                  );
          },
          function (data) {
              if (data.messaggio)
                  myApp.alertMessage(data.messaggio);
              else
                  myApp.alertMessage('Esegui nuovamente l\'accesso.');

              myApp.views.main.router.navigate('/login/');
          }

      );
  } else {
        myApp.views.main.router.navigate('/login/');
    }
}

$$(document).on('click','.refresh', function (e) {
    myApp.views.main.router.clearHistory();
    myApp.checkUtente();
});

$$(document).on('click','.logout', function (e) {
    localStorage.clear();
    myApp.views.main.router.clearHistory();
    myApp.views.main.router.navigate('/login/');
});

$$(document).on('click','.main', function (e) {

});

$$(document).on('click','.scan-codice', function (e) {
    cordova.plugins.barcodeScanner.scan(
        function (result) {

            if (!result.cancelled) {
                $$('#registra-utente #codice_fiscale').val(result.text.toUpperCase());
            };
        },
        function (error) {
            //alert("Scanning failed: " + error);
        },
        {
            preferFrontCamera : false, // iOS and Android
            showFlipCameraButton : false, // iOS and Android
            showTorchButton : true, // iOS and Android
            torchOn: false, // Android, launch with the torch switched on (if available)
            saveHistory: true, // Android, save scan history (default false)
            prompt : myApp.translate('messaggio_inquadra_codice'), // Android
            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
            disableAnimations : true, // iOS
            disableSuccessBeep: false // iOS and Android
        }
    );

} );

$$(document).on('click','.scan-qrcode', function (e) {
    cordova.plugins.barcodeScanner.scan(
        function (result) {

            if (!result.cancelled) {
                console.log(result.text);
           //     $$('#registra-utente #codice_fiscale').val(result.text.toUpperCase());
            };
        },
        function (error) {
            //alert("Scanning failed: " + error);
        },
        {
            preferFrontCamera : false, // iOS and Android
            showFlipCameraButton : false, // iOS and Android
            showTorchButton : true, // iOS and Android
            torchOn: false, // Android, launch with the torch switched on (if available)
            saveHistory: true, // Android, save scan history (default false)
            prompt : myApp.translate('messaggio_inquadra_codice'), // Android
            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
            disableAnimations : true, // iOS
            disableSuccessBeep: false // iOS and Android
        }
    );

} );

$$(document).on('click','.aggiungi-tessera', function (e) {
    $$('#aggiungi-tessera').trigger('click');
});

$$(document).on('click','.elimina_tessera', function (e) {
    e.preventDefault();
    $id = $$(this).data('ref');

    myApp.dialog.confirm(myApp.translate('messaggio_elimina_tessera'),
        myApp.title, function() {
            o = {};
            o.codice_tessera = $id;

            myApp.setupHeaders();
            myApp.sendRequest(
                myApp.endpoint+"elimina_tessera",
                o,
                function (data) {
                    myApp.storeData(data);

                    router =  myApp.views.main.router.navigate('/tessere' ,
                        {
                            reloadCurrent: true,
                            ignoreCache: true
                        }
                        );

                },
                function (data) {
                    if (data.messaggio)
                        myApp.alertMessage(data.messaggio);
                    else
                        myApp.alertMessage(myApp.errorMessage);
                }

            );
        },
        function() {
        return false;
        }
        )

});

$$(document).on('click','.salva-tessera', function (e) {

  $d =  $$('#registra-tessera #codice_tessera').val();
    $t =  $$('#registra-tessera #tipo_tessera').val();
    if (!$d)  { myApp.notifyMessage(myApp.translate('codice_tessera_errore'), 2000); return false; }
    if (!$t)  { myApp.notifyMessage(myApp.translate('tipo_tessera_errore'), 2000); return false; }


    o = {};
    o.codice_tessera = $d;
    o.tipo_tessera = $t;

    myApp.setupHeaders();
    myApp.sendRequest(
        myApp.endpoint+"registra_tessera",
        o,
        function (data) {
            myApp.storeData(data);

            router =  myApp.views.main.router.navigate('/tessere' ,
                {
                    reloadCurrent: true,
                    ignoreCache: true
                }
            );
        },
        function (data) {
            if (data.messaggio)
                myApp.alertMessage(data.messaggio);
            else
                myApp.alertMessage(myApp.errorMessage);
        }

    );


})

$$(document).on('click','.registra-tessera', function (e) {
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if (!result.cancelled) {
                $$('#registra-tessera #codice_tessera').val(result.text);
            };
        },
        function (error) {
        },
        {
            preferFrontCamera : false, // iOS and Android
            showFlipCameraButton : false, // iOS and Android
            showTorchButton : true, // iOS and Android
            torchOn: false, // Android, launch with the torch switched on (if available)
            saveHistory: true, // Android, save scan history (default false)
            prompt : myApp.translate('messaggio_inquadra_codice'), // Android
            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
            disableAnimations : true, // iOS
            disableSuccessBeep: false // iOS and Android
        }
    );
} );



$$(document).on('click','.registra-adesione', function (e) {

    e.preventDefault();
    o = myApp.form.convertToData('#form-adesione');
    myApp.setupHeaders();
    myApp.sendRequest(
        myApp.endpoint+"progetti",
        o,
        function (data) {
            myApp.storeData(data);

            if (data.data.back_url) {
                $back_url = data.data.back_url;
            } else {
                $back_url = '/progetti';
            }
            myApp.views.main.router.navigate($back_url ,
                {
                    reloadCurrent: true,
                    ignoreCache: true
                }
            );
        },
        function (data) {
            if (data.messaggio)
                myApp.alertMessage(data.messaggio);
            else
                myApp.alertMessage(myApp.errorMessage);
        }
    );
});

$$(document).on('click','#accedi', function (e) {
    e.preventDefault();
    $_user = $$('#login-utente #input1').val();
    $_pass = $$('#login-utente #input2').val();

    if (!$_user)  { myApp.notifyMessage(myApp.translate('cellulare_error'), 2000); return false; }
    if (!$_pass) {myApp.notifyMessage(myApp.translate('password_error'), 2000); return false;}

    var o = {};
    o.cellulare = $_user;
    o.password = $_pass;
    myApp.setupHeaders();
    myApp.sendRequest(
        myApp.endpoint+"login",
        o,
        function (data) {
            myApp.storeData(data);
            myApp.views.main.router.navigate("/welcome/");
        },
        function (data) {
            if (data.messaggio)
                myApp.alertMessage(myApp.translate(data.messaggio));
            else
                myApp.alertMessage(myApp.translate('verifica.login'));
        }

    );

});

$$(document).on('click', '.go-main', function (e) {
    e.preventDefault();
    router =  myApp.views.main.router.navigate('/main');
});

$$(document).on('click', '.macchina-route', function (e) {
e.preventDefault();

    lat = $$(this).data('lat');
    lng = $$(this).data('lng');

myApp.dialog.confirm(myApp.translate("messaggio_apri_navigatore"), function()
    {
        launchnavigator.navigate([lat, lng]);
    }
)
});

$$(document).on('click', '.privacy', function (e) {
    e.preventDefault();

    OpenUrlExt.open('https://www.iubenda.com/privacy-policy/17209575',
        function(){
        },
        function(){
        });

});

// AZIONI PER REGISTRAZIONE
$$(document).on('click','#registrami', function () {
    // ESEGUO I CONTROLLI
    has_error = false;

    nome = $$('#registra-utente #nome').val();
    cognome = $$('#registra-utente #cognome').val();
    cellulare = $$('#registra-utente #cellulare').val();
    codice_comune = $$('#registra-utente #codice_comune').val();

    email = $$('#registra-utente #email').val();
    pwd = $$('#registra-utente #password').val();
    //cf = $$('#registra-utente #codice_fiscale').val();
    termini = $$('#registra-utente #termini:checked').val();
    comunicazioni = $$('#registra-utente #comunicazioni:checked').val();
    myApp.hold_time = 3000;


    $controllo = new ControlloCampi();

    myApp.check_value($controllo, nome, 'nome');
    myApp.check_value($controllo, cognome, 'cognome');
    myApp.check_value($controllo, codice_comune, 'comune');
    myApp.check_value($controllo, email, 'email_error');
    myApp.check_value($controllo, cellulare, 'cellulare_error');
    myApp.check_value($controllo, pwd, 'password_error');
    myApp.check_value($controllo, termini, 'accetta');


    if ($controllo.hasErrors()) {
        var notificationFull = myApp.notification.create({
            title: myApp.name,
            subtitle: '',
            text: $controllo.getErrorsAsText(),
            closeTimeout: myApp.hold_time,
            closeButton: true,
        }).open();

        myApp.hold_time = myApp.hold_time +500;
    }

    else {
        var o = myApp.form.convertToData('#registra-utente');

        myApp.sendRequest(
            myApp.endpoint+'registrazione',
            o,
            function(data){
                myApp.dialog.alert(myApp.translate("registrazione_ok"), myApp.name , function () {
                    myApp.views.main.router.navigate('/login/');
                });}

        )
    }
});

$$(document).on('click','#aggiorna', function () {
    // ESEGUO I CONTROLLI
    has_error = false;

        var o = myApp.form.convertToData('#registra-utente');
        myApp.sendRequest(
            myApp.endpoint+'aggiorna',
            o,
            function(data){
                myApp.storeData(data);
                myApp.dialog.alert(myApp.translate(data.statusMessage), myApp.name , function () {
                    myApp.views.main.router.navigate('/welcome');
                });}

        );

});

$$(document).on('click','#cancella', function () {
    // ESEGUO I CONTROLLI
    has_error = false;


    myApp.dialog.confirm("Sei sicuro di voler eliminare il tuo profilo",
        function() {
            var o = myApp.form.convertToData('#registra-utente');
            myApp.sendRequest(
                myApp.endpoint+'cancella',
                o,
                function(data){
                    localStorage.clear();
                    myApp.views.main.router.clearHistory();
                    myApp.views.main.router.navigate('/login/');
                }

            );
        }

        );



});



$$(document).on('click','#recupera', function () {
    // ESEGUO I CONTROLLI
    has_error = false;
    myApp.hold_time = 3000;
    cellulare = $$('#reset-utente #input1').val();
    email = $$('#reset-utente #input2').val();

    $controllo = new ControlloCampi();
    myApp.check_value($controllo, email, 'email_error');
    myApp.check_value($controllo, cellulare, 'cellulare_error');

    if ($controllo.hasErrors()) {
        var notificationFull = myApp.notification.create({
            title: myApp.name,
            subtitle: '',
            text: $controllo.getErrorsAsText(),
            closeTimeout: myApp.hold_time,
            closeButton: true,
        }).open();

        myApp.hold_time = myApp.hold_time +500;
    }

    else {
        var o = {};
        o.email = email;
        o.cellulare =cellulare;
        myApp.sendRequest(
            myApp.endpoint+'recupera_password',
            o,
            function(data){
                myApp.dialog.alert(myApp.translate(data.statusMessage), myApp.name , function () {
                    myApp.views.main.router.navigate('/login/');
                });}

        )
    }
});




myApp.check_value = function ($controllo, $value, $message) {
    if (!$value) {
        has_error = true;
        $controllo.addError(myApp.translate($message));
    }
};

myApp.createChart = function() {
   $periodo = myApp.readData(myApp.storedKey.CONFERIMENTI_PER_PERIODO);


    var labels = [];
    var data = [];
    $periodo.forEach(function (val) {


        data.push(val.totale);
        if (val.totale > 0)
            labels.push(val.periodo);
        else
            labels.push('');
   });


    var barChartData = {
        labels: labels,
        datasets: [{
            label: myApp.translate('conferimenti_settimana'),
            backgroundColor: '#EE4A6F',
            data: data
        }]

    };
        var ctx = document.getElementById('chart').getContext('2d');
        var myBar = new Chart(ctx, {
            type: 'bar',
            data: barChartData,
            options: {
                title: {
                    display: false,
                    text: 'I tuoi conferimenti'
                },
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                responsive: true,
                scales: {
                    xAxes: [{
                        stacked: true,
                    }],
                    yAxes: [{
                        stacked: true
                    }]
                }
            }
        });

}

class ControlloCampi {

    constructor() {
        this.errors = [];
    }

    addError(error) {
        this.errors.push(error);
    }

    hasErrors() {
        return this.errors.length > 0;
    }

    getErrorsAsText() {
        return this.errors.join("<br/>")

    }
}



myApp.createPopupPosizione = function(){

  var dynamicPopup = myApp.popup.create({
    content: '<div class="popup popup-posizione">'+
                  '<div class="page-content">'+
                      '<div class="block">'+
                          '<img src="./img/logo_bk.png" style="width: 30vw; margin: auto; display: block;">'+
                      '</div>'+
                      '<div class="block" style="color:black">'+
                          '<h3>'+myApp.translate('popup.posizione_title')+'</h3>'+
                          '<p>'+myApp.translate('popup.posizione_subtitle')+'</p>'+
                          '<p>'+
                              '<br/>'+
                              '<br/>'+
                          '</p>'+
                      '</div>'+
                  '</div>'+
              '</div>',
  });

  return dynamicPopup;


}
