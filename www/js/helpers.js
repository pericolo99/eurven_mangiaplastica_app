Template7.registerHelper('macchina', function (macchina) {


    stato = "";

    if (macchina.stato_macchina == 1) {
        stato = "text-color-red";
    }


    var ret = '<li class="">'+
        '<a href="#" clasS="macchina-route item-content macchina" id="x-'+ macchina.codice_macchina +'" data-lat="'+macchina.latitudine+'" data-lng="'+macchina.longitudine+'">'+
        '<div class="item-media"><i class="f7-icons '+ stato +'">placemark</i></div>'+
        '<div class="item-inner">'+
        '<div class="item-title-row">'+
        '<div class="item-title">'+macchina.descrizione+'</div>'+
        '<div class="item-after">'+
        '</div>'+
        '</div>'+
        ((macchina.distance) ?'<div class="item-subtitle">'+macchina.distance+'</div>':'' )+
      //  '<div class="item-footer text-color-black">{{@root.lang.pagine.vicinoame_1_1}}</div>'+
        '</div>'+
        '</a>'+
        '</li>';

    return ret;
});