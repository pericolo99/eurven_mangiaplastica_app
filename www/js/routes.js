var routes = [
    {
        path: '/panel-component/',
        async: function (routeTo, routeFrom, resolve, reject) {

            resolve(
                {
                panel: {
                    componentUrl: './panel-component.html'
                },

                }
            )
        },


    },
    {
        path: '/main',
        name: 'main',
        async: function (routeTo, routeFrom, resolve, reject) {
            resolve(
                // Custom template context
                {
                    componentUrl: './main.html',
                },
                {
                    context: myApp.loadContext()
                }
            );
        },
        on: {
            pageBeforeIn: function (event, page) {
            },
            pageAfterIn: function (event, page) {
                myApp.closeLoaderApp();
            },
            pageInit: function (event, page) {
            },
            pageBeforeRemove: function (event, page) {
            },
        },
        options: {
            animate: true,
        },
    },
    {
        path: '/contatti',
        name: 'contatti',
        async: function (routeTo, routeFrom, resolve, reject) {

            resolve(
                {
                        componentUrl: myApp.loadPageComponentBase('info/contatti.html'),
                },
                {
                    context: myApp.loadContext()
                }
            )
        }
    },
    {
        path: '/informazioni',
        async: function (routeTo, routeFrom, resolve, reject) {

            resolve(
                {
                    componentUrl:  myApp.loadPageComponentBase( 'info/informazioni.html')
                }
            )
        },
        name: 'informazioni',
    },
    {
        path: '/impostazioni',
        name: 'impostazioni',
        async: function (routeTo, routeFrom, resolve, reject) {
            resolve(
                {
                    panel: {
                        url: myApp.loadPageComponentBase('impostazionii.html'),
                    }
                }
            )
        },
        on: {
            pageBeforeRemove: function (event, page) {

            },
        }
    },
    {
        path: '/statistiche',
        name: 'statistiche',
        async: function (routeTo, routeFrom, resolve, reject) {
            resolve(
                // Custom template context
                {
                    componentUrl: myApp.loadPageComponentBase('statistiche.html'),
                },
                {
                    context: myApp.loadContext()
                }
            );
        },
    },
    {
        path: '/login',
        async: function (routeTo, routeFrom, resolve, reject) {
            resolve(
                // Custom template context
                {
                    componentUrl: myApp.loadPageComponentBase('utente/login.html'),
                },
                {
                    context: myApp.loadContext()
                }
            );
        },
        name: 'login',
        on: {
            pageBeforeIn: function (e, page) {
                myApp.closeLoaderApp();
            }
            }
    },
    {
        path: '/registrati',
        async: function (routeTo, routeFrom, resolve, reject) {

            var o = {};
            myApp.setupHeaders();
            myApp.sendRequest(
                myApp.endpoint+"comuni",
                o,
                function (data) {
                    $comuni = data.data.comuni;
                    $context = myApp.loadContext();
                    $context.comuni = $comuni;


                    resolve(
                        // Custom template context
                        {
                            componentUrl: './pages/utente/registrazione.html',
                        },
                        {
                            context: $context,
                            ignoreCache: true,
                            reloadCurrent: true,

                        }
                    );

                },
                function (data) {
                    if (data != null && data.messaggio)
                        myApp.alertMessage(myApp.translate(data.messaggio));
                    else
                        myApp.alertMessage(myApp.translate('problema_generico'));
                }
            );

        },
        name: 'registrazione',
        clearPreviousHistory: true,
        ignoreCache: true,
        reloadCurrent: true,

    },

    {
        path: '/profilo',
        name: 'profilo',
        async: function (routeTo, routeFrom, resolve, reject) {

            var o = {};
            myApp.setupHeaders();
            myApp.sendRequest(
                myApp.endpoint+"comuni",
                o,
                function (data) {
                    $comuni = data.data.comuni;
                    $context = myApp.loadUserContext();
                    $context.comuni = $comuni;


                    resolve(
                        // Custom template context
                        {
                            componentUrl: './pages/utente/profilo.html',
                        },
                        {
                            context: $context,
                            ignoreCache: true,
                            reloadCurrent: true,
                            clearPreviousHistory: true

                        }
                    );

                },
                function (data) {
                    if (data != null && data.messaggio)
                        myApp.alertMessage(myApp.translate(data.messaggio));
                    else
                        myApp.alertMessage(myApp.translate('problema_generico'));
                }
            );
        },
    },
    {
        path: '/welcome',
        name: 'welcome',
        async: function (routeTo, routeFrom, resolve, reject) {
            resolve(
                // Custom template context
                {
                    componentUrl: myApp.loadPageComponentBase('welcome.html'),
                },
                {
                    context: myApp.loadUserContext(),
                    ignoreCache: true,
                    reloadCurrent: true,
                    clearPreviousHistory: true

                }
            );
        },
    },
    {
        path: '/codice',
        name: 'codice',
        on: {
            pageAfterIn: function (e, page) {

            }
        },

        async: function (routeTo, routeFrom, resolve, reject) {
            resolve(
                // Custom template context
                {
                    componentUrl: myApp.loadPageComponentBase('codice.html'),
                },
                {
                    context: myApp.loadUserContext()
                }
            );
        },
    },

    {
        path: '/reset',
        name: 'reset',
        on: {
            pageAfterIn: function (e, page) {

            }
        },

        async: function (routeTo, routeFrom, resolve, reject) {
            resolve(
                // Custom template context
                {
                    componentUrl: myApp.loadPageComponentBase('utente/passreset.html'),
                },
                {
                    context: myApp.loadUserContext()
                }
            );
        },
    },
    {
        path: '/tessere',
        name: 'tessere',
        on: {
            pageAfterIn: function (e, page) {

            }
        },

        async: function (routeTo, routeFrom, resolve, reject) {

            resolve(
                // Custom template context
                {
                    componentUrl: myApp.loadPageComponentBase('tessere.html'),
                },
                {
                    context: myApp.loadUserContext()
                }
            );
        },
    },
    {
        path: '/storico',
        name: 'storico',
        clearPreviousHistory: true,
        force: true,
        ignoreCache: true,
        async: function (routeTo, routeFrom, resolve, reject) {
            myApp.setupHeaders();
            myApp.sendRequest(
                myApp.endpoint+"storico",
                {},
                function (data) {
                    resolve(
                        // Custom template context
                        {
                            componentUrl: myApp.loadPageComponentBase('timeline.html'),
                        },
                        {
                            context: {
                                contenuto : data.data.contenuto
                            }
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
    },
    {
        path: '/macchine',
        name: 'macchine',
        on: {
            pageAfterIn: function (e, page) {

            }
        },

        async: function (routeTo, routeFrom, resolve, reject) {


            var popupPosizione = myApp.createPopupPosizione();
            popupPosizione.open();
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    o = {};
                    o.latitude = position.coords.latitude;
                    o.longitude = position.coords.longitude;

                    myApp.latitude = position.coords.latitude;
                    myApp.longitude = position.coords.longitude;

                    myApp.setupHeaders();
                    myApp.sendRequest(
                        myApp.endpoint+"macchine",
                        o,
                        function (data) {
                            myApp.storeData(data);
                            resolve(
                                // Custom template context
                                {
                                    componentUrl: myApp.loadPageComponentBase('macchine.html'),
                                },
                                {
                                    context: {
                                        utente: myApp.readData(myApp.storedKey.UTENTE),
                                        contenuto : data.data.contenuto
                                    } //myApp.loadMacchineContext()
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
                    popupPosizione.close();

                },

                function (error) {

                    myApp.setupHeaders();
                    myApp.sendRequest(
                        myApp.endpoint+"macchine",
                        {},
                        function (data) {

                            myApp.storeData(data);
                            resolve(
                                // Custom template context
                                {
                                    componentUrl: myApp.loadPageComponentBase('macchine.html'),
                                },
                                {
                                    context: {
                                        utente: myApp.readData(myApp.storedKey.UTENTE),
                                        contenuto : data.data.contenuto
                                    }
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

                    /* resolve(
                         // Custom template context
                         {
                             componentUrl:  myApp.loadPageComponentBase('macchine-noposition.html'),
                         },
                         {
                             context: myApp.loadUserContext()
                         }
                     ); */
                    popupPosizione.close();
                },
                { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }
            );


        },
    },
    {
        path: '/progetti',
        name: 'progetti',
        ignoreCache: true,
        reloadCurrent: true,
        clearPreviousHistory: true,
        async: function (routeTo, routeFrom, resolve, reject) {

            var o = {};
            o.action = "index";
            if (myApp.searchData)
                o.search_params = myApp.searchData;

            myApp.setupHeaders();
            myApp.sendRequest(
                myApp.endpoint+"progetti",
                o,
                function (data) {
                    resolve(
                        // Custom template context
                        {
                            componentUrl: './pages/progetti.html',
                        },
                        {
                            context: {
                                contenuto: data.data.contenuto,
                            },
                            ignoreCache: true,
                            reloadCurrent: true,
                            clearPreviousHistory: true
                        }
                    );
                },
                function (data) {
                    if (data != null && data.messaggio)
                        myApp.alertMessage(myApp.translate(data.messaggio));
                    else
                        myApp.alertMessage(myApp.translate('problema_generico'));
                });


        },
        routes: [
            {
                path: '/:criteria',
                name: 'progetto',
                ignoreCache: true,
                reloadCurrent: true,
                clearPreviousHistory: true,
                async: function (routeTo, routeFrom, resolve, reject) {
                    var o = {};
                    o.action = routeTo.params.criteria;

                    myApp.setupHeaders();
                    myApp.sendRequest(
                        myApp.endpoint+"progetti",
                        o,
                        function (data) {

                            resolve(
                                // Custom template context
                                {
                                    componentUrl: './pages/progetto.html',
                                },
                                {
                                    context: {
                                        contenuto: data.data.contenuto,
                                    },
                                    ignoreCache: true,
                                    reloadCurrent: true,
                                    clearPreviousHistory: true
                                }
                            );

                        },
                        function (data) {
                            if (data != null && data.messaggio)
                                myApp.alertMessage(myApp.translate(data.messaggio));
                            else
                                myApp.alertMessage(myApp.translate('problema_generico'));
                        }
                    );
                }

            }
        ]
    },
];
