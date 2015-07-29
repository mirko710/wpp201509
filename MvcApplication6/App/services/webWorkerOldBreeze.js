
//importScripts('../../Scripts/breeze.debug.js');
importScripts('../../Scripts/jqueydemo.js', '../../Scripts/q.js', '../../Scripts/breeze.debug.js', '../../Scripts/require2.js');
define('jquery', function () { return jQuery; });
require(
{
    baseUrl: "..",
},
function(){
    var my = my || {}; // root namespace for my stuff
    

    my.em = new breeze.EntityManager("../../breeze/Breeze");
    

    var Selects = {};

    
       
    var unoTest = "";
    var SelectsArrays = [{ 'dIme': 'zbirke', 'ime': 'Zbirke', 'izvor': 'tbl_T_Zbirke' },
                       { 'dIme': 'jedinice', 'ime': 'Jedinice', 'izvor': 'tbl_T_Jedinice_mjere' },
                       { 'dIme': 'dijelovi', 'ime': 'Dijelovi', 'izvor': 'tbl_T_Dijelovi' },
                       { 'dIme': 'vrste_naziva', 'ime': 'Vrste_naziva', 'izvor': 'tbl_T_Vrste_naziva' },
                       { 'dIme': 'vrste_naslova', 'ime': 'Vrste_naslova', 'izvor': 'tbl_T_Vrste_naslova' },
                       { 'dIme': 'vrste_odgovornosti', 'ime': 'Vrste_odgovornosti', 'izvor': 'tbl_T_Vrste_odgovornosti' },
                       { 'dIme': 'uloge_autora', 'ime': 'Uloge_autora', 'izvor': 'tbl_T_Uloge_Autora' },
                       { 'dIme': 'jezici', 'ime': 'Jezici', 'izvor': 'tbl_T_Jezici' },
                       { 'dIme': 'materijali', 'ime': 'Materijali', 'izvor': 'tbl_T_Materijali' },
                       { 'dIme': 'tehnike', 'ime': 'Tehnike', 'izvor': 'tbl_T_Tehnike' },
                       { 'dIme': 'mjesta', 'ime': 'Mjesta', 'izvor': 'tbl_T_Mjesta' },
                       { 'dIme': 'nazivi', 'ime': 'Nazivi', 'izvor': 'tbl_T_Nazivi' },
                       { 'dIme': 'sadrzaj_predmet', 'ime': 'Sadrzaj_predmet', 'izvor': 'tbl_T_Sadrzaj_predmet' },
                       { 'dIme': 'vrste_sadrzaja', 'ime': 'Vrste_sadrzaja', 'izvor': 'tbl_T_Vrste_sadrzaja' },
                       { 'dIme': 'vremenske_odrednice', 'ime': 'Vremenske_odrednice', 'izvor': 'tbl_T_Vremenske_odrednice' },
                       { 'dIme': 'osobe_i_inst_odrednice', 'ime': 'Osobe_i_inst_odrednice', 'izvor': 'vw_T_Osobe_i_inst_odrednice' },
                       { 'dIme': 'sakupljaci', 'ime': 'Sakupljaci', 'izvor': 'vw_T_Sakupljaci' },
                       { 'dIme': 'nacini_prikupljanja', 'ime': 'Nacini_prikupljanja', 'izvor': 'tbl_T_Nacini_prikupljanja' },
                       { 'dIme': 'nalaziste', 'ime': 'Nalaziste', 'izvor': 'tbl_T_Nalaziste' },
                       { 'dIme': 'kljucne_rijeci', 'ime': 'Kljucne_rijeci', 'izvor': 'tbl_T_Kljucne_rijeci' },
                       { 'dIme': 'dimenzije', 'ime': 'Dimenzije', 'izvor': 'tbl_T_Dimenzije' }];

    var getTerminoloskeListe = function () {
        var query = breeze.EntityQuery.from('ListeLight')
                 .select('IDT,Pojam,Nad_IDT');


        return my.em.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);
        function querySucceeded(data) {
            var tempListe = data.results;
            $.each(SelectsArrays, function (i, p) {
                //console.log('liste' + tempListe[0][p.dIme]);
                Selects[p.ime] = tempListe[0][p.dIme];
                //    my.vm.getTerminoloske(p.ime);
            })

        };
        function queryFailed(error) {
            console.log("Query failed: " + error.message);
        };
    };


    var load = function () {

        
        
        
        my.em.fetchMetadata();
        
        //$.each(SelectsArrays, function (i, p) {
            

        return getTerminoloskeListe();
        
        //postMessage(unoTest);
    }

 

    var toRet = {
        unoTest: unoTest,
        load:load
    }
        
    load().then(function () {
        var tranny = JSON.stringify(Selects);
        postMessage(tranny);
    });



})





   
