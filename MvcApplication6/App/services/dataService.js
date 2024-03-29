﻿define(function () {


    var my = my || {} // root namespace for my stuff
$(function () {

        my.em = new breeze.EntityManager("breeze/Breeze");
        my.em.saveOptions= new breeze.SaveOptions({ allowConcurrentSaves: true });



    
        my.vm = function () {
            var navigacijaIzPretrazivanja = ko.observable("-1"),
            loadedTerminologyUpiti = ko.observable(false),
            loadedTerminologyUpis = ko.observable(false),
            katalogMode = false,//B_KATALOG_MODE  u parametrima za korisnike
            adresaAPI = 'api/WebAPISQL',
            adresaAccount = 'api/Account',
            lockedMmedia = false,
            userName = ko.observable(null),
            realIsAuth = ko.observable(false),
            realUserName = ko.observable(''),
            realUserRoles = ko.observableArray([]),
            password = ko.observable(''),

            fullkartica = ko.observableArray([]),
            defStruktura = ko.observableArray([]),
           // protoForme = ko.observableArray([]),
            mijenjanoFlag = ko.observable(false),
            autori = ko.observableArray([]),
            currentAutor = ko.observable(),
            currentBrojid = ko.observable(),
            isLoaded = false,
            testLoader = ko.observable(88),
            tempBrojid = ko.observable(-1);
            
                       
            var Selects = ko.observableArray([]);
            var SelectsPretrazivanje = [];
            
            var NewTermModel=function(termTablica,pojam,tablicaID,tablica,nadIDT,napomena,polje){
                this.newTermTablica=ko.observable(termTablica || null);
                this.newTermPojam=ko.observable(pojam || null);
                this.newTermID=ko.observable(tablicaID || null);
                this.newTermIDTablica=ko.observable(tablica || null);     
                this.newTermNadIDT=ko.observable(nadIDT || null);
                this.newTermNapomena=ko.observable(napomena || null);
                this.newTermPolje=ko.observable(polje || null);
            }
            
            var objektZaTerminoloske=new NewTermModel();
                
            var ParametriModel = function () {
                that = this;
                this.parametriZaKorisnika = [];


                this.Vrijednost = function (imeParametra) {
                    var returnValueB = false;//možda -1 ako ne nađe parametar
                    $.each(that.parametriZaKorisnika, function (i, v) {
                        if (v.Parametar().toUpperCase() === imeParametra.toUpperCase()) {
                            var returnValue = v.Vrijednost();
                            if (returnValue === 'DA') {
                                returnValueB = true;
                            }
                            if (returnValue === 'NE') {
                                returnValueB = false;
                            }
                           return false;
                        }
                    });
                    return returnValueB;
                }


                this.ucitajParametre = function () {
                    //alert(realUserName());
                    var feder = Q.defer();
                    var query = breeze.EntityQuery.from("Parametri_za_korisnika")
                    //.withParameters({ userName: realUserName() });

                    my.em.executeQuery(query)
                            .then(querySucceeded)
                            .fail(queryFailed);
                    function querySucceeded(data) {

                        that.parametriZaKorisnika=data.results;
                        feder.resolve(true);
                    }
                    function queryFailed(error) {
                        feder.resolve(false);
                        alert("Query failed: " + error.message);
                    }
                    return feder.promise;
                }

                this.upisiParametar=function(parametar, vrijednost) {
                    // alert(realUserName());
                    var p1 = breeze.Predicate.create('Korisnik_UserName', 'Eq', realUserName());
                    var p2 = breeze.Predicate.create('Parametar', 'Eq', parametar);


                    var pred = breeze.Predicate.and([p1, p2]);
                    var query = breeze.EntityQuery.from("tbl_Parametri_za_korisnike")
                        .where(pred);


                    return my.em.executeQuery(query)
                            .then(querySucceeded)
                            .fail(queryFailed);
                    function querySucceeded(data) {
                        if (data.results.length > 0) {
                            var newCust = ko.observableArray([]);
                            newCust(data.results);
                            //console.log(newCust());
                            //alert(newCust()[0]['ID_Broj']() + ' www ' + newCust()[0].AutoBroj());
                            newCust()[0]['Vrijednost'](vrijednost);
                            //my.em.saveChanges();
                            //alert(newCust()[0]['ID_Broj']());
                        } else {
                            //alert('upisi novi parametar');
                            var newCust = my.em.createEntity("tbl_Parametri_za_korisnike", { Institucija_ID: "AMZ", Korisnik_UserName: realUserName(), Parametar: parametar, Vrijednost: vrijednost });

                            //srediID_Broj;
                        }
                        my.em.saveChanges();
                        that.ucitajParametre();
                        //parametriZaKorisnika(data.results);
                    }
                    function queryFailed(error) {
                        alert("Query failed: " + error.message);
                    }
                }


            }
            var parametri = new ParametriModel();

            var zadnjiIDT = -1;
            var Vremena = [{ 'tekst': 'Vrijeme:', 'vrijednost': false }, { 'tekst': 'Vrijeme od:', 'vrijednost': true }];
       
            var VrijemeOpis = ['(?)', '1. des.', '1. pol.', '10-te', '2. des.', '2. pol.', '20-te', '3. des.', '30-te', '4. des.', '40-te', '5. des.', '50-te', '6. des.', '60-te', '7. des.', '70-te', '8. des.', '80-te', '9. des.', '90-te', 'bez datacije', 'jesen', 'kraj', 'ljeto', 'nepoznato vrijeme', 'oko', 'početak', 'poslije', 'prije', 'proljeće', 'sredina', 'zima'];
            var VrijemeJedinica = ['g.', 'g. pr. Kr.', 'st.', 'st. pr. Kr.', 'tis. pr. Kr.'];

            var defPoljaTablice = [{
                'tablica': 'tbl_Nazivi', 'templ': 'smlNazivi',
                'polja': [{ 'imePolja': 'NAZ_IDT_Vrsta_naziva', 'vrijednost': 1 }, { 'imePolja': 'NAZ_IDT_Naziv_predmeta', 'vrijednost': null }]
            },
                        {
                            'tablica': 'tbl_Naslovi', 'templ': 'smlNaslovi',
                            'polja': [{ 'imePolja': 'NSL_IDT_Vrsta_naslova', 'vrijednost': 1 },
                                    { 'imePolja': 'NSL_IDT_Jezik_naslova', 'vrijednost': 1 },
                                    { 'imePolja': 'NSL_Naslov', 'vrijednost': null }]
                        },
            {
                            'tablica': 'tbl_U_Materijali_u_dijelovima', 'templ': 'smlMaterijali',
                            'polja': [{ 'imePolja': 'U_IDT_Materijal', 'vrijednost': 1 },
                                    { 'imePolja': 'U_IDT_Dio_predmeta', 'vrijednost': 49 },
                                    { 'imePolja': 'U_IDT_Tehnika', 'vrijednost': 1 }]
            },
            {
                            'tablica':'tbl_Mjere','templ':'smlMjere',
                            'polja': [
                                    { 'imePolja': 'MJR_IDT_Mjereni_dio', 'vrijednost': 49 },
                                    { 'imePolja': 'MJR_IDT_Dimenzija', 'vrijednost': 17 },
                                    { 'imePolja': 'MJR_IDT_Jedinica_mjere', 'vrijednost': 1 },
                                    { 'imePolja': 'MJR_Mjera', 'vrijednost': null }
                            ]
            },
            {
                            'tablica': 'tbl_Izrada', 'templ': 'smlIzrada',
                            'polja': [{ 'imePolja': 'IZR_IDT_Vrsta_odgovornosti', 'vrijednost': 1 },
                                      { 'imePolja': 'IZR_IDT_Mjesto', 'vrijednost': null },
                                      { 'imePolja': 'IZR_ID_Autor', 'vrijednost': null },
                                      { 'imePolja': 'IZR_IDT_Uloga', 'vrijednost': null },
                                      { 'imePolja': 'IZR_Vrijeme_opis', 'vrijednost': null },
                                      { 'imePolja': 'IZR_Vrijeme_vrijednost', 'vrijednost': null },
                                      { 'imePolja': 'IZR_Vrijeme_jedinica', 'vrijednost': null },
                                      { 'imePolja': 'IZR_Vrijeme_od', 'vrijednost': null },
                                      { 'imePolja': 'IZR_Vrijeme_do', 'vrijednost': null },
                                      { 'imePolja': 'IZR_Vrijeme_opis2', 'vrijednost': null },
                                      { 'imePolja': 'IZR_Vrijeme_vrijednost2', 'vrijednost': null },
                                      { 'imePolja': 'IZR_Period', 'vrijednost': null },
                                      { 'imePolja': 'IZR_Period_do', 'vrijednost': null },
                                      { 'imePolja': 'IZR_Vrijeme_jedinica2', 'vrijednost': null },
                            ]
            }

            ];
 



            my.em.hasChangesChanged.subscribe(function (eventArgs) {
                //console.log(eventArgs);
                mijenjanoFlag(my.em.hasChanges());
            });



            /////start!!!
            var primeData = function () {
               return getUserName().then(function () {
                    parametri.ucitajParametre()
                    .then(function(){
                        console.log(parametri.Vrijednost("S_DEFAULT_ZBIRKA"));
                    });
                    //getUserRoles();
                });
            
            
                function success() {
                    return true;
                    if (true) {//primjer za webWorkera i terminološke
                        var myWorker = new Worker("../App/services/webWorker.js"); // Init Worker
                        myWorker.onmessage = function (oEvent) { // On worker job finished
                            var tmpSelects = JSON.parse(oEvent.data);
                            //my.vm.Selects = tmpSelects;
                            my.vm.Selects(tmpSelects);
                            myWorker.terminate();
                            loadedTerminologyUpiti(true);
                        }
                        myWorker.postMessage('WORK!');
                    } else {

                        var transferObject;
                        getWebAPISQL(1,-1, transferObject).then(function (b) {
                            defStruktura(b);
                        });
                       // getWebAPISQL(5, transferObject).then(function (b) {
                       /// //getJsonTermBucket(transferObject).then(function (b) {
                          //  my.vm.Selects = b;
                       // })
                    
                    }
                    my.vm.testLoader(999);
                    //console.log(my.vm.testLoader());
                    console.log('Primed databbb' );
                }
           


            }


            var getPocetnaZbirka= function(){
                var pocZbirka = null;
                var zbIndex = 231;
                var ferdef = Q.defer();
                pocZbirka =parametri.Vrijednost("S_default_zbirka");

                if (!pocZbirka) {
                    zbIndex = 231;//stavit neku pravu zbirku...
                    ferdef.resolve(zbIndex);
                } else {
                    if (pocZbirka.substr(0, 1) == "*") {
                        zbIndex = parseInt(pocZbirka.substr(1));
                        ferdef.resolve(zbIndex);
                    }
                    else {
                        zbIndex = parseInt(pocZbirka.split('#')[1]);
                        ferdef.resolve(zbIndex);
                    }
                }
                return ferdef.promise;
            }
            var  openNewTermDialog=function(termTablica,pojam,id,tablica,imePolja) {
                    objektZaTerminoloske.newTermTablica(termTablica);
                    objektZaTerminoloske.newTermPojam(pojam);
                    objektZaTerminoloske.newTermID(id);
                    objektZaTerminoloske.newTermIDTablica(tablica);
                    objektZaTerminoloske.newTermNapomena(null);
                    objektZaTerminoloske.newTermPolje(imePolja);
                    $("#dodajTerm").modal('show');
        
                //dialogNewRecord.show();
            }
            
            
            
            var spremiTerminPopUp=function(){
                
                return dMax('IDT', objektZaTerminoloske.newTermTablica())
                .then(function (nIDT) { return makeItSo(nIDT); })
                .then(function (uIDT) {return saveUTablici(uIDT);});

                    function makeItSo(nIDT) {
                        var deref=Q.defer();
                        var newCust = my.em.createEntity(objektZaTerminoloske.newTermTablica(),
                             { IDT: nIDT + 1, 
                                 Pojam: objektZaTerminoloske.newTermPojam(),
                                 Nad_IDT:objektZaTerminoloske.newTermNadIDT(),
                                 Napomena:objektZaTerminoloske.newTermNapomena()});
                        var z = [];
                        z.push(newCust);
                        my.em.saveChanges(z);
                        //return { IDT: nIDT + 1, Pojam: pojam }
                        deref.resolve(nIDT+1);
                        return deref.promise;
                    }
                    
                    
                    function saveUTablici(uIDT) {
                       
                        var query=breeze.EntityQuery.from(objektZaTerminoloske.newTermIDTablica())
                        .where("ID", "eq", objektZaTerminoloske.newTermID())

                            return my.em.executeQuery(query)
                                    .then(querySucceeded)
                                    .fail(queryFailed);
                            function querySucceeded(data) {
                                return data.results[0][objektZaTerminoloske.newTermPolje()](uIDT);
                            }
                            function queryFailed(error) {
                                alert("Query failed: " + error.message);
                            }

                         }      
                        
  
                    
            }
         

            var loadTerminologyWebWorker = function () {
                var myWorker = new Worker("../App/services/webWorker.js"); // Init Worker
                myWorker.onmessage = function (oEvent) { // On worker job finished
                    var tmpSelects = JSON.parse(oEvent.data);
                    my.vm.SelectsPretrazivanje = tmpSelects;
                    myWorker.terminate();
                    loadedTerminologyUpiti(true);
                }
                myWorker.postMessage('WORK!');
            }

            var loadTerminologyWebWorkerUpis = function () {
                var myWorker = new Worker("../App/services/webWorkerUpis.js"); // Init Worker
                myWorker.onmessage = function (oEvent) { // On worker job finished
                    var tmpSelects = JSON.parse(oEvent.data);
                    //my.vm.Selects = tmpSelects;
                    my.vm.Selects(tmpSelects);
                    myWorker.terminate();
                    loadedTerminologyUpis(true);
                }
                myWorker.postMessage('WORK!');
            }


            var getFullTblSkp = function (brojid, tablica) {
                var feder = Q.defer();
                //alert("dataS" + tablica);
                var orderBy = 'ID_Broj';
                if(tablica=="tbl_Media_collector"){orderBy="ID_Sub_Broj";}
                var query = breeze.EntityQuery.from(tablica)
                    .where('ID_Broj', 'eq', brojid)
                    .orderBy(orderBy);

                my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {
                   // transferObject(data.results);
                    feder.resolve(data.results);
                }
                function queryFailed(error) {
                    feder.resolve(false);
                    alert("Query failed (" + tablica + "): " + error.message);
                }
                return feder.promise;

            }


            // izbrisano getFullInventarizacija
            // isbrisano getFullOcuvanost

        
            var getDefForme = function () {
                var ber = Q.defer();
                var query = breeze.EntityQuery.from("tbl_Def_Forme");

                my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {
                   // my.vm.protoForme(data.results);
                    ber.resolve(data.results);
                }
                function queryFailed(error) {
                    ber.resolve(false);
                    alert("Query failed(def forme): " + error.message);
                }
                return ber.promise;

            }


            //izbrisano getAutori

           var load = function () {
                console.log('load kontekst');
                return 'eee';
            }

            //izbrisano getUpitAutori


            var isAuthenticatedLocal=function () {


                var deferred = $.Deferred();
                //logger.logError(data.userName() + ' Nedopušten pristup', null, title, true);
                if (!realIsAuth()) {
                    //if (data.userName() == 'neprijavljen') {
                    deferred.resolve(false);
                } else {
                    deferred.resolve(true);
                }
                return deferred.promise();
            }


            //izbrisan getJsonAutocompleteER




            var getJson = function (address) {

                var req = $.ajax({
                    type: 'GET',
                    url: address,
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (response, text) {

 
                    },
                    error: function (text, error) {
                        // alert('!!!!!!greška pri dohvatu podataka' + error + text);
                        alert(error);
                        // that._deactivateLoader();
                    },
                    cancel: function () {
                        //that._deactivateLoader();
                    }
                });



                //req.then(function (resp) { rezultati(resp) });
                return req;
            }



            var getNavRecordsTOP = function (zbirka, tmpNavRecords) {

                if (navigacijaIzPretrazivanja() == "-1") {
                    return getNavRecords(zbirka, tmpNavRecords);
                } else {
                    return getNavRecordsUpit(tmpNavRecords);
                }

            }

            var getNavRecords = function (zbirka, tmpNavRecords) {
                var query = breeze.EntityQuery.from("tbl_Kartica")
                    .where('KRT_IDT_Zbirka', 'eq', zbirka)
                    .select('ID_Broj,KRT_Inventarni_broj')
                    .orderBy('KRT_SORT_Inv_br')
                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {
                    if (data.results.length > 0) {
                        tmpNavRecords(data.results);
                        //console.log(tmpNavRecords()[0]['ID_Broj']);
                    }
                }
                function queryFailed(error) {
                    alert("Query failed(getnavrec): " + error.message);
                }
            }


            var getNavRecordsUpit = function (tmpNavRecords) {
                var tmp = null;
                var fed = Q.defer();
                getWebAPISQL(6,-1, tmp).then(function (b)
                {
                    tmpNavRecords(b);
                    fed.resolve(b);
                })
                return fed.promise;

            }

            function getWebAPISQL(vrstaPoziva,parametar, returnValue) {
                //i1
                //if (i1 == 1)//defStruktura
                //if (i1 == 2)//defVrijeme
                //if (i1 == 3)//getUpiti
                //if (i1 == 4)//getRefiners
                //if (i1 == 5)//gettermBucket
                //if (i1 == 6)//getnavigacijaPretrazivanje
                //if (i1 == 7)//Registracija iz Pretrazivanja
                //if (i1 == 8)//zbirkeZa Homepage
                //if (i1 == 9)//registracija po zbirci
                //if (i1 == 10)//gettermBucketUpis
                //if (i1 == 11)//getrefinerspovrsti
                var outParametar = "3";
                if (vrstaPoziva == 6 || vrstaPoziva == 7) outParametar = navigacijaIzPretrazivanja();
                if (vrstaPoziva == 9 || vrstaPoziva==11) outParametar = parametar;
                var req = $.ajax({
                    type: 'GET',
                    url: adresaAPI + '?i1=' + vrstaPoziva + '&i2=2&i3=' + outParametar,
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (response, text) {
                        returnValue = response;
                    },
                    error: function (text, error) {

                        alert(error);
                        // that._deactivateLoader();
                    },
                    cancel: function () {
                        //that._deactivateLoader();
                    }
                });

                return req;
            }


            function getWebAPIAccounts(opcija, paramUserName, returnValue) {

    //          0  isAuthenticated,
      //        1 logout,
        //      2  currentUserName,
          //    3  rolesForUser
                //  4 userExists 
                //5 username test
                var req = $.ajax({
                    type: 'GET',
                    url: adresaAccount + '?opcija=' + opcija + '&paramUserName=' + paramUserName,
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (response, text) {
                        returnValue = response;
                    },
                    error: function (text, error) {

                        alert(error);
                        // that._deactivateLoader();
                    },
                    cancel: function () {
                        //that._deactivateLoader();
                    }
                });

                return req;
            }


            // izbrisan getDefNOEF

            //izbrisan getJsonTermBucket
            // izbrisan getFullKljucneRijeci
            //izbrisan getJsonPOSTPromijeniIdentity


            var postCreateNoviZapis = function (zbirka,invBroj) {

                var req = $.ajax({
                    type: 'POST',
                    url: '/api/NoviZapis',
                    dataType: 'json',
                    data: JSON.stringify({ 'KRT_IDT_Zbirka': zbirka, 'KRT_Inventarni_broj': invBroj }),
                    contentType: 'application/json',
                    success: function (response, text) {

                        //ko.mapping.fromJS(response["VratiNazive"], that.viewModel.taDa);

                        //return rezultati(response);
                        // rezultati(response.data);
                        console.log(response);
                        //alert("getjsonpostnovizapis");
                    },
                    error: function (text, error) {
                        // alert('!!!!!!greška pri dohvatu podataka' + error + text);
                        alert(error);
                        // that._deactivateLoader();
                    },
                    cancel: function () {
                        //that._deactivateLoader();
                    }
                });



                //req.then(function (resp) { rezultati(resp) });
                return req;
            }

            //izbrisano delJSON


            function redakUpitaModel() {
                this.poljeIDT = ko.observable(null);
                this.polje = ko.observable(null);
                this.tablica = ko.observable(null);
                this.vrijednost1 = ko.observable(null);
                this.vrijednost2 = ko.observable(null);
                this.vrijednost3 = ko.observable(null);
                this.term = ko.observableArray([]);
                this.upitOperator = ko.observable("=");
                this.redOperator = ko.observable(" AND ");
                this.operatori = ko.observableArray([]);
                this.combo = ko.observable(true);
                this.podZapisi = ko.observable(false);
            }

            var getJsonPOST = function (redakUpiti) {
                var nx = ko.observableArray([]);
                //nx(redakUpiti);
                //console.log(redakUpiti);
                //console.log(nx);
                $.each(redakUpiti, function (index, data) {
                    var z = new redakUpitaModel();
                    z.polje(data.polje());
                    z.poljeIDT(data.poljeIDT());
                    z.vrijednost1(data.vrijednost1());
                    z.vrijednost2(data.vrijednost2());
                    z.vrijednost3(data.vrijednost3());
                    z.tablica(data.tablica());
                    z.upitOperator(data.upitOperator());
                    z.podZapisi(data.podZapisi());
                    //alert(data.redOperator());
                    z.redOperator(data.redOperator());
                    if (!data.vrijednost1() && !data.vrijednost2() && data.upitOperator()!='upisan') {
                        console.log("nnn");
                    } else {
                        nx.push(z);
                    }
                });
                //$.each(nx(), function (index, data) {
                //    data.term(null);
                //});
                var t1=ko.observable();
                t1({'tip':"1",'upiti':nx});
                var xd = ko.toJSON(t1);
                //console.log(xd);
                var req = $.ajax({
                    type: 'POST',
                    url: '/api/Values',
                    dataType: 'json',
                    data:xd,// JSON.stringify(redakUpiti),
                    contentType: 'application/json',
                    success: function (response, text) {

                        //ko.mapping.fromJS(response["VratiNazive"], that.viewModel.taDa);

                        //return rezultati(response);
                        // rezultati(response.data);
                        // console.log(response);
                    },
                    error: function (text, error) {
                        // alert('!!!!!!greška pri dohvatu podataka' + error + text);
                        alert(error);
                        // that._deactivateLoader();
                    },
                    cancel: function () {
                        //that._deactivateLoader();
                    }
                });



                //req.then(function (resp) { rezultati(resp) });
                return req;
            }



            var getJsonPOSTALT = function (redakUpiti,staraSifra,pageSize) {
                var nx = ko.observableArray([]);
                //nx(redakUpiti);
                //console.log(redakUpiti);
                //console.log(nx);
                $.each(redakUpiti, function (index, data) {
                    var z = new redakUpitaModel();
                    z.polje(data.polje());
                    z.poljeIDT(data.poljeIDT());
                    z.vrijednost1(data.vrijednost1());
                    z.vrijednost2(data.vrijednost2());
                    z.vrijednost3(data.vrijednost3());
                    z.tablica(data.tablica());
                    z.upitOperator(data.upitOperator());
                    z.podZapisi(data.podZapisi());
                    //alert(data.redOperator());
                    z.redOperator(data.redOperator());
                    if (!data.vrijednost1() && !data.vrijednost2() && data.upitOperator() != 'upisan') {
                        console.log("nnn");
                    } else {
                        nx.push(z);
                    }
                });
                //$.each(nx(), function (index, data) {
                //    data.term(null);
                //});
                var t1 = ko.observable();
                t1({ 'staraSifra': staraSifra,'pageSize':pageSize, 'upiti': nx });
                var xd = ko.toJSON(t1);
                //console.log(xd);
                var req = $.ajax({
                    type: 'POST',
                    url: '/api/ALTValues',
                    dataType: 'json',
                    data: xd,// JSON.stringify(redakUpiti),
                    contentType: 'application/json',
                    success: function (response, text) {

                        //ko.mapping.fromJS(response["VratiNazive"], that.viewModel.taDa);

                        //return rezultati(response);
                        // rezultati(response.data);
                        // console.log(response);
                    },
                    error: function (text, error) {
                        // alert('!!!!!!greška pri dohvatu podataka' + error + text);
                        alert(error);
                        // that._deactivateLoader();
                    },
                    cancel: function () {
                        //that._deactivateLoader();
                    }
                });



                //req.then(function (resp) { rezultati(resp) });
                return req;
            }



            var getJsonPOSTALTNOEF = function (redakUpiti, staraSifra, pageSize) {
                var nx = ko.observableArray([]);
                //nx(redakUpiti);
                //console.log(redakUpiti);
                //console.log(nx);
                $.each(redakUpiti, function (index, data) {
                    var z = new redakUpitaModel();
                    z.polje(data.polje());
                    z.poljeIDT(data.poljeIDT());
                    z.vrijednost1(data.vrijednost1());
                    z.vrijednost2(data.vrijednost2());
                    z.vrijednost3(data.vrijednost3());
                    z.tablica(data.tablica());
                    z.upitOperator(data.upitOperator());
                    z.podZapisi(data.podZapisi());
                    //alert(data.redOperator());
                    z.redOperator(data.redOperator());
                    if (!data.vrijednost1() && !data.vrijednost2() && data.upitOperator() != 'upisan') {
                        console.log("nnn");
                    } else {
                        nx.push(z);
                    }
                });
                //$.each(nx(), function (index, data) {
                //    data.term(null);
                //});
                var t1 = ko.observable();
                t1({ 'staraSifra': staraSifra, 'pageSize': pageSize, 'upiti': nx });
                var xd = ko.toJSON(t1);
                //console.log(xd);
                var req = $.ajax({
                    type: 'POST',
                    url: '/api/ALTValuesNOEF',
                    dataType: 'json',
                    data: xd,// JSON.stringify(redakUpiti),
                    contentType: 'application/json',
                    success: function (response, text) {

                        //ko.mapping.fromJS(response["VratiNazive"], that.viewModel.taDa);

                        //return rezultati(response);
                        // rezultati(response.data);
                        // console.log(response);
                    },
                    error: function (text, error) {
                        // alert('!!!!!!greška pri dohvatu podataka' + error + text);
                        alert(error);
                        // that._deactivateLoader();
                    },
                    cancel: function () {
                        //that._deactivateLoader();
                    }
                });



                //req.then(function (resp) { rezultati(resp) });
                return req;
            }











            var getJsonNovaNavigacija = function (redakUpiti) {

                var req = $.ajax({
                    type: 'POST',
                    url: '/api/NavigacijaPlus',
                    dataType: 'json',
                    data: JSON.stringify(redakUpiti),
                    contentType: 'application/json',
                    success: function (response, text) {

                    },
                    error: function (text, error) {
                        // alert('!!!!!!greška pri dohvatu podataka' + error + text);
                        alert(error);
       
                    },
                    cancel: function () {
                        //that._deactivateLoader();
                    }
                });

                return req;
            }


            var login = function (userName,password) {
            
                var req = $.ajax({
                    type: 'POST',
                    url: '/api/Account',
                    dataType: 'json',
                    data: JSON.stringify({ 'userName': userName, 'password': password }),
                    contentType: 'application/json',
                    success: function (response, text) {
                    },
                    error: function (text, error) {
                        // alert('!!!!!!greška pri dohvatu podataka' + error + text);
                        alert(error);
                    },
                    cancel: function () {

                    }
                });

                return req.promise();
            }

            var isAuthenticated = function (userName) {
                var returnObject;

                getWebAPIAccounts(0,"prazno",returnObject).then(
                    function (response) {
                        realIsAuth(response);
                    })
            }


            var getUserName = function () {
                var returnObject;
                var defer = Q.defer();
                getWebAPIAccounts(2, "prazno", returnObject).then(
                    function (response) {
                        realUserName(response);
                        defer.resolve(true);
                    }).fail(function () {
                        defer.resolve(false);
                    })
                return defer.promise;
            }




               var getUserRoles = function () {

                    var returnObject;
                    var defer = Q.defer();
                    getWebAPIAccounts(3, "prazno", returnObject).then(
                        function (response) {
                            realUserRoles([]);
                            for (var i = 0; i < response.length; i++) {
                                realUserRoles.push(response[i]);
                                //alert(data[i]);
                            }
                            defer.resolve(true);
                        }).fail(function () {
                            defer.resolve(false);
                        })
                    return defer.promise;


 
                }



                var logout = function () {

                    var returnObject;
                    var defer = Q.defer();
                    getWebAPIAccounts(1, "prazno", returnObject).then(
                        function (response) {
                             defer.resolve(true);
                        }).fail(function () {
                            defer.resolve(false);
                        })
                    return defer.promise;
                }





            var changePassword = function (userName, password) {

                var req = $.ajax({
                    type: 'POST',
                    url: '/api/Account?password=hubabuba',
                    dataType: 'json',
                    data: JSON.stringify({ 'userName': userName, 'password': password }),
                    contentType: 'application/json',
                    success: function (response, text) {
                    },
                    error: function (text, error) {
                        // alert('!!!!!!greška pri dohvatu podataka' + error + text);
                        alert(error);
                    },
                    cancel: function () {
                    }
                });
                return req;
            }

            var userExists = function (userName) {

                var req = $.ajax({
                    type: 'GET',
                    url: '/api/Account?y=' + userName ,
                    dataType: 'json',
                    //data: JSON.stringify(new String(userName)),
                    contentType: 'application/json',
                    success: function (response, text) {
                    },
                    error: function (text, error) {
                        // alert('!!!!!!greška pri dohvatu podataka' + error + text);
                        alert(error);
                    },
                    cancel: function () {
                    }
                });
                return req;
            }


            //za izbrisati
            var getFullKartica = function (brojid) {
                var query = breeze.EntityQuery.from("tbl_Kartica")
                    .where('ID_Broj', 'eq', brojid)
                    .expand('tbl_Izrada,tbl_Naslovi,tbl_Nazivi,tbl_Mjere,tbl_U_Materijali_u_dijelovima,tbl_Sadrzaj')
            
                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {

                    my.vm.fullkartica(data.results);

                    my.vm.selPodaciZaForme.selMjere(my.vm.fullkartica()[0]['tbl_Mjere']());

                    my.vm.selMjere(my.vm.fullkartica()[0]['tbl_Mjere']());
                    my.vm.selIzrada(my.vm.fullkartica()[0]['tbl_Izrada']());
                    my.vm.selMat(my.vm.fullkartica()[0]['tbl_U_Materijali_u_dijelovima']());
                    my.vm.selNazivi(my.vm.fullkartica()[0]['tbl_Nazivi']());
                    my.vm.selNaslovi(my.vm.fullkartica()[0]['tbl_Naslovi']());
                    //my.vm.selPodOznake(my.vm.fullkartica()[0]['tbl_Pod_Oznake']());
                    //my.vm.selSadrzaj(my.vm.fullkartica()[0]['tbl_Naslovi']());

                }
                function queryFailed(error) {
                    alert("Query failed (getfullkartica): " + error.message);
                }
            }



            //izbrisan getFullIzrada



            var getFullMmedia = function (brojid, tmpMmedia) {
                var query = breeze.EntityQuery.from("tbl_Media_collector")
                    .where('ID_Broj', 'eq', brojid)
                    .orderBy('ID_Sub_Broj');
                //.select('ID_Broj,KRT_Inventarni_broj,KRT_IDT_Zbirka,tbl_Izrada,tbl_Naslovi,tbl_Nazivi,tbl_Mjere,tbl_U_Materijali_u_dijelovima')
                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {
                
                    tmpMmedia(data.results);
                    //console.log(data.results);
                }
                function queryFailed(error) {
                    alert("Query failed(getfullmedia): " + error.message);
                }
            }


            function stripSlashes(x) {
                var y = "";
                if (x) {
                    for (i = 0; i < x.length; i++) {
                        if (x.charAt(i) == "\\") {
                            y += "/";
                        }
                        else {
                            y += x.charAt(i);
                        }

                    }
                }
                return y;
            }


            function stazaSlike(data) {

                var tmpslik = "";

                if (ko.isObservable(data)) {
                    tmpslik = data();
                } else {
                    tmpslik = data;
                }
                
                var slikPath = "../Content/images/fotonijepridruzen.png";
                if (tmpslik != "") {
                    var n = stripSlashes(tmpslik);
                    //slikPath = "../../media/Mmedia" + n.substr(15);
                    slikPath = "../Mmedia" + n.substr(15); //AMZ!!!
                }

                return slikPath;
            }




            var getPrviIzZbirke = function (zbirka) {
                //alert("zbirka" + zbirka);
                var query = breeze.EntityQuery.from("tbl_Kartica")
                    .where('KRT_IDT_Zbirka', 'eq', zbirka)
                    .select('ID_Broj')
                    .orderBy('KRT_SORT_Inv_br')
                    .take(1);
                    //.skip(1);
                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {
                    //  alert("prvibroj:" + data.results[0]['ID_Broj']);
                    var prviIzZbirke = -1;
                    if (data.results.length > 0) {
                        prviIzZbirke = data.results[0]['ID_Broj'];
                    }
                    return prviIzZbirke;
                    //console.log(tmpNavRecords()[0]['ID_Broj']);
                }
                function queryFailed(error) {
                    alert("Query failed(getprviIzZbirke): " + error.message);
                }
            }


            
            var getZbirka = function (zbirka) {
                var ber = Q.defer();
                var query = breeze.EntityQuery.from("tbl_Kartica")
                    .where('ID_Broj', 'eq', zbirka)
                    .select('KRT_IDT_Zbirka')
                    .take(1);

                my.em.executeQuery(query)
                       .then(querySucceeded)
                       .fail(queryFailed);
                function querySucceeded(data) {

                    var retVal = data.results[0]['KRT_IDT_Zbirka'];
                    ber.resolve(retVal);

                }
                function queryFailed(error) {
                    alert("Query failed(getZbirka): " + error.message);
                    ber.resolve(false);
                }
                return ber.promise;
            }


            var getExportFullKarticaoldnolocal = function (brojid, karticaFull) {
                karticaFull([]);
                //nazivi([]);
                var query = breeze.EntityQuery.from("tbl_Kartica")
                    .where('ID_Broj', 'eq', brojid)
                    //.expand('tbl_Media_collector,tbl_Kljucne_rijeci,tbl_Inventarizacija,tbl_Izrada,tbl_Naslovi,tbl_Nazivi,tbl_Mjere,tbl_U_Materijali_u_dijelovima,tbl_Kataloska_jedinica,tbl_Sadrzaj')
                //.select('ID_Broj,KRT_Inventarni_broj,KRT_IDT_Zbirka,tbl_Izrada,tbl_Naslovi,tbl_Nazivi,tbl_Mjere,tbl_U_Materijali_u_dijelovima')
                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {
                    my.vm.fullkartica(data.results);
                    karticaFull(my.vm.fullkartica()[0]);
                    // nazivi(karticaFull()[0]['tbl_Nazivi']());
                    //alert('kartica Export');

                }
                function queryFailed(error) {
                    alert("Query failed(getExportFullKartica): " + error.message);
                }
            }


            var getExportFullKartica = function (brojid, karticaFull) {
                karticaFull([]);
                //nazivi([]);
                
                //setTimeout(function(){console.log("w");},1000);
                return my.em.fetchEntityByKey('tbl_Kartica', brojid, true)
                
                // var query = breeze.EntityQuery.from("tbl_Kartica")
                //     .where('ID_Broj', 'eq', brojid)
                //     //.expand('tbl_Media_collector,tbl_Kljucne_rijeci,tbl_Inventarizacija,tbl_Izrada,tbl_Naslovi,tbl_Nazivi,tbl_Mjere,tbl_U_Materijali_u_dijelovima,tbl_Kataloska_jedinica,tbl_Sadrzaj')
                // //.select('ID_Broj,KRT_Inventarni_broj,KRT_IDT_Zbirka,tbl_Izrada,tbl_Naslovi,tbl_Nazivi,tbl_Mjere,tbl_U_Materijali_u_dijelovima')
                // 
                // var tryLocal=my.em.executeQueryLocally(query);
                // if (tryLocal.length > 0) {
                //     karticaFull(tryLocal[0]());
                //     var n=Q.defer();
                //     n.resolve(karticaFull());
                //     return n.promise; 
                // }                    
                
                //return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {
                    //my.vm.fullkartica(data.entity);
                    karticaFull(data.entity);
                    console.log(karticaFull());
                    // nazivi(karticaFull()[0]['tbl_Nazivi']());
                    //alert('kartica Export');

                }
                function queryFailed(error) {
                    alert("Query failed(getExportFullKartica): " + error.message);
                }
            }



            //var getKartica = function () {
            //    var query = breeze.EntityQuery.from("tbl_Kartica")
            //        .select('ID_Broj,KRT_Inventarni_broj')
            //        .where('ID_Broj', 'lt', 1000)
            //         .orderBy('KRT_SORT_Inv_br');

            //    return my.em.executeQuery(query)
            //            .then(querySucceeded)
            //            .fail(queryFailed);
            //    function querySucceeded(data) {

            //        my.vm.selKartica(data.results);
            //    }
            //    function queryFailed(error) {
            //        alert("Query failed(getKartica): " + error.message);
            //    }
            //}



            ////za grid?
            //izbrisano getMjesta


            //izbrisano getDef

            //izbrisano getSel


            //izbrisano getGrid

            //izbrisano getTerminoloskeNad

            //izbrisano getTerminoloske



            var getImeZbirke = function (brojid,imeZbirke) {
                var query = breeze.EntityQuery.from('ImeZbirke')
                         .select('Zbirka')
                         .where('ID_Broj','eq',brojid)

                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {
                    imeZbirke(data.results);

                }
                function queryFailed(error) {
                    alert("Query failed: " + error.message);
                }
            }

            //izbrisan getTerminoloskeListe

            //izbrisan getJedinice

            //izbrisan autoComp

            //izbrisan getDimenzije

            //izbrisan getMjestaZaTreeview

            //izbrisan getZbirkeZaTreeView


            //izbrisan createEntityDetatchedold


            //izbrisan createEntityDetatched   za batchUpdate
            var createEntityDetatched = function (templ) {
                var newCust = null;
                var EntityState = breeze.EntityState;
                if (templ == 'smlZbirka') {
                    newCust = { 'zbIndex': '2' }
                } else {
                    $.each(defPoljaTablice, function (index, item) {
                        if (templ == item.templ) {
                            newCust = my.em.createEntity(item.tablica, null, EntityState.Detached);//.then(function(z){feder.resolve(z);});
                            $.each(item.polja, function (findex, fitem) {
                                newCust.setProperty(fitem.imePolja, fitem.vrijednost);
                            });
                            console.log(newCust);
                        }
                    });
                }
                return newCust;
            }

            var getKarticaSaveZbirka = function (brojid, zbirID) {
                var query = breeze.EntityQuery.from("tbl_Kartica")
                    .where('ID_Broj', 'eq', brojid)

                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {
                    var kartica=data.results[0];
                    kartica['KRT_IDT_Zbirka'](zbirID);
                }
                function queryFailed(error) {
                    alert("Query failed: " + error.message);
                }
            }

            var createEntityBatch = function (templ,brojid) {

                var defPoljaLen = defPoljaTablice.length - 1;
                var tLen = templ.length - 1;
                var newCust = null;
                $.each(templ,function(index,data){
                    if (data.templRow() == "smlZbirka") {
                        getKarticaSaveZbirka(brojid, data.entity()['zbIndex']);
                    }
                    else
                    {
                        $.each(defPoljaTablice, function (index, item) {
                            if (data.templRow() == item.templ) {
                                newCust = my.em.createEntity(item.tablica, { ID_Broj: brojid });//.then(function(z){feder.resolve(z);});
                                $.each(item.polja, function (findex, fitem) {
                                    newCust.setProperty(fitem.imePolja, data.entity()[fitem.imePolja]());
                                });
                                console.log(newCust);
                            }
                            if (index == defPoljaLen) { alert("deferInner"); }
                        });
                    }
                    if (index == tLen) { alert("deferOuter"); }
                });
                return newCust;
            }

            //batchUpdate/save

            //izbrisan createMjere
 

            //izbrisan JQcreateInvBroj

            //izbrisan createInvBroj

            //izbrisan createInvBrojx


            //var createZapis = function (entity, brojid) {
            //    var newCust = my.em.createEntity(entity, { ID_Broj: brojid() });
            //    if (entity === 'tbl_Mjere') my.vm.selMjere.push(newCust);
            //    if (entity === 'tbl_Izrada') my.vm.selIzrada.push(newCust);
            //    if (entity === 'tbl_U_Materijali_u_dijelovima') my.vm.selMat.push(newCust);
            //    if (entity === 'tbl_Naslovi') my.vm.selNaslovi.push(newCust);
            //    if (entity === 'tbl_Nazivi') my.vm.selNazivi.push(newCust);
            //    if (entity === 'tbl_Sadrzaj') my.vm.selSadrzaj.push(newCust);
            //    if (entity === 'tbl_Pod_Oznake') my.vm.selPodOznake.push(newCust);
            //    return newCust;
            //}

            var createZapisExt = function (entity, brojid, transferObservable) {

                return Q.fcall(function () { return my.em.createEntity(entity, { ID_Broj: brojid }); }).then(saveWorked).fail(saveFailed);


                function saveWorked(newCust) {
                    if (entity === 'tbl_Mjere') {
                        newCust['MJR_IDT_Dimenzija'](17);
                        newCust['MJR_IDT_Jedinica_mjere'](1);
                        newCust['MJR_IDT_Mjereni_dio'](49);
                    }
                
                    if (entity === 'tbl_Sadrzaj') {
                        newCust['SDR_IDT_Vrsta'](6);

                    }

 
                    if (entity === 'tbl_Izrada') {
                        newCust['IZR_IDT_Vrsta_odgovornosti'](1);
                        newCust['IZR_Vrijeme_jedinica']('g.');
                        newCust['IZR_Vrijeme_jedinica2']('g.');
                    }
                    if (entity === 'tbl_U_Materijali_u_dijelovima') {
                        newCust['U_IDT_Dio_predmeta'](49);
                    }
                    if (entity === 'tbl_Naslovi') {
                        newCust['NSL_IDT_Vrsta_naslova'](1);
                        newCust['NSL_IDT_Jezik_naslova'](1);
                    }
                    if (entity === 'tbl_Nazivi') {
                        newCust['NAZ_IDT_Vrsta_naziva'](1);
                    }

                    if (entity === 'tbl_Pod_Oznaka') {
                    }

                    transferObservable.push(newCust);
                    return newCust;
                }
                function saveFailed(error) {
                    alert("Query failed: " + error.message);
                }
            }
 
            var undoTermin = function (entity, ID) {

                var query = breeze.EntityQuery.from(entity)
                    .where("ID", "eq", ID);

                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {

                    return data.results[0].entityAspect.rejectChanges();

                }
                function queryFailed(error) {
                    alert("Query failed: " + error.message);
                }

            }
            var dMax = function (polje, ime) {
            
                var query = breeze.EntityQuery.from(ime)
                    .select(polje)
                    .orderBy(polje + ' desc')
                    .take(1);


                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {

                    my.vm.zadnjiIDT = data.results[0][polje] ;
                    return data.results[0][polje] ;

                }
                function queryFailed(error) {
                    alert("Query failed: " + error.message);
                }

            }


            var rejectSejv = function () {
                alert('REJECTED!!!');
                my.em.rejectChanges();
            }


            //izbrisan createOsobaWorx

            var createOsoba = function (entity, pojam, ime) {

                return imePrez(pojam)
                    .then(function (imPr) {
                        return vratiObjekt(-1,imPr)
                        .then(function (temp) {
                            if (temp.IDT < 0) {
                                return dMax('IDT', ime)
                                .then(function (nIDT) {
                                    return imePrez(pojam).then(function (imPr) {
                                        return makeItSo(nIDT, imPr);
                                    });
                                })
                                .then(function (nIDT) {
                                    return imePrez(pojam).then(function (imPr) {
                                        return vratiObjekt(nIDT, imPr);
                                    });
                                })
                            } else {
                                return { IDT: temp.ID, Pojam: temp.Prezime }
                            }
                        });
                    });

                function makeItSo(nIDT, pojam) {
                    var deferred = Q.defer();
                    var xPre = '';
                    var xIme = '';
                    xPre = pojam.xPre;
                    xIme = pojam.xIme;
                    var newCust = my.em.createEntity(entity, { Prezime: xPre, Ime: xIme });
                    my.em.saveChanges()
                        .then(
                            function () {
                                deferred.resolve({ ID: nIDT + 1, Prezime: xPre, Ime: xIme });
                            })
                        .fail(
                            function () {
                                deferred.resolve({ ID: nIDT + 1, Prezime: xPre, Ime: xIme });
                        });

                    return deferred.promise;

                }

                function vratiObjekt(nIDT, prezime) {
                    var deferred = Q.defer();
                    var vratiID = ko.observable(-1);
                    var retVal = ko.observable("");
                    var prom = Q.fcall(function () { return osobaExists(entity, prezime, vratiID, retVal); });
                    prom.then(function () { deferred.resolve({ IDT: vratiID(), Pojam: retVal() }); }, function () { deferred.reject(); });
                    return deferred.promise;
                }


                function imePrez(prezime) {
                    var deferred = Q.defer();
                    var xPre = '';
                    var xIme = '';

                    var nind = prezime.indexOf(',');
                    if (nind > 0) {
                        xPre = prezime.substring(0, nind);
                        xIme = prezime.substring(nind + 1);
                    }
                    else {
                        var nind2 = prezime.indexOf(' ');
                        if (nind2 > 0) {
                            xIme = prezime.substring(0, nind2);
                            xPre = prezime.substring(nind2 + 1);
                        }
                        else {
                            xPre = prezime;
                            xIme = null;
                        }
                    }
                    deferred.resolve({ xPre: xPre.trim(), xIme: !xIme? null:xIme.trim() });
                    return deferred.promise;
                }


            }


            var osobaExists = function (entity, prezime,vratiID,retVal) {
                var xPre = '';
                var xIme = '';
                var tablica = "";
                if (entity == "tbl_T_Autori") tablica = "Autori";
                if (entity == "tbl_T_Osobe_i_inst_odrednice") tablica = "Osobe_i_inst_odrednice";
                if (entity == "tbl_T_Sakupljaci") tablica = "Sakupljaci";
                if (entity == "tbl_T_Izvori_nabave") tablica = "Izvori_nabave";

                xPre = prezime.xPre;
                xIme = prezime.xIme;

                var p1 = breeze.Predicate.create('Prezime', 'Eq', xPre);
                var p2 = breeze.Predicate.create('Ime', 'Eq', xIme);
            

                if (xIme === null) {
                    p2 = breeze.Predicate.create('IDT', 'gt', -1);
                }


                var pred = breeze.Predicate.and([p1, p2]);
                //alert("tablica " + tablica);
                var query = breeze.EntityQuery.from(tablica)
                    .select("IDT,Pojam")
                    .where(pred)


                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {
                    if (data.results[0] !== undefined) {
                        vratiID(data.results[0]['IDT']);
                        retVal(data.results[0]['Pojam']);
                    } else {

                        vratiID(-1);
                        retVal("x");
                        //alert(vratiID());
                    }
                
                    return true;


                }
                function queryFailed(error) {
                    alert("Query failed: " + error.message);
                }

            }

            var createTerminOld = function (entity, pojam, ime) {

                return dMax('IDT', ime)
                .then(function (nIDT) { return Q.fcall(function () { return makeItSo(nIDT); }) });

                function makeItSo(nIDT) {
                    var newCust = my.em.createEntity(entity, { IDT: nIDT + 1, Pojam: pojam });
                    my.em.saveChanges();
                    return { IDT: nIDT + 1, Pojam: pojam }
                }
            }




            var createTermin = function (entity, pojam, ime) {
            
                return dMax('IDT', ime)
                .then(function (nIDT) {return Q.fcall(function () { return makeItSo(nIDT); })});

                    function makeItSo(nIDT) {
                        var newCust = my.em.createEntity(entity, { IDT: nIDT + 1, Pojam: pojam });
                        var z = [];
                        z.push(newCust);
                        my.em.saveChanges(z);
                        //return { IDT: nIDT + 1, Pojam: pojam }
                        return nIDT + 1;
                    }
                }
        
            //izbrisan getLocalRefresh

            //izbrisan getDijelovi


            var createMmediju = function (id_Broj, path,photke) {
                var query = breeze.EntityQuery.from('tbl_Media_collector')
                    .where('ID_Broj', 'eq', id_Broj)
                    .orderBy('ID_Sub_Broj');
                return my.em.executeQuery(query)
                    .then(querySucceeded)
                    .fail(queryFailed);
                function querySucceeded(data) {
                    var ber = Q.defer();
                    var stal=0;
                    if (data.results[0] !== undefined) {
                        var lun = data.results.length;
                        stal = data.results[lun - 1]['ID_Sub_Broj']();
                        console.log(stal + ' ' + photke().length);
                    }
                        for (var i = 0; i < photke().length; i++) {
                            if (photke()[i]['odabrano']()) {
                                stal++;

                                var identus = stal == 1 ? true : false;
                                my.em.createEntity('tbl_Media_collector', {
                                    ID_Broj: id_Broj,
                                    ID_Sub_Broj: stal,
                                    MC_Staza_slike: "m:\\muzej\\mmedia\\" + path + "\\" + photke()[i].imageFile(),
                                    MC_TMF: 'F',
                                    MC_Tip: 'g',
                                    MC_Identity: identus,
                                    MC_rv: false,
                                    MC_Web: false
                                });
                            }
                        }
                        my.em.saveChanges().then(function() {ber.resolve(true);});
                        console.log("sejvano");
                        //data.results[0].entityAspect.setDeleted();
                   // } //else { ber.resolve(true); alert('cmm nema rezultata!'); }
                    //data.results[0].hasChangesChanged();
                        console.log('resolved cMM');
                    
                        return ber.promise;
                }
                function queryFailed(error) {
                    alert("Query failed: " + error.message);
                }
            }


            var fixMmediju = function (id_Broj) {
                var query = breeze.EntityQuery.from('tbl_Media_collector')
                    .where('ID_Broj', 'eq', id_Broj)
                    .orderBy('ID_Sub_Broj');
                return my.em.executeQuery(query)
                    .then(querySucceeded)
                    .fail(queryFailed);
                function querySucceeded(data) {
                    var ber = Q.defer();
                    var tmp = ko.observableArray([]);
                    console.log('started fMM');
                    if (data.results[0] !== undefined) {
                       // console.log(data.results[0]);
                        var lun = data.results.length;

                        for (var i = 0; i < lun; i++) {
                             if (data.results[i]['ID_Slike']() === null) {
                            console.log(data.results[i]['ID_Slike']() + ' ' + data.results[i]['AutoBroj']());
                            data.results[i]['ID_Slike'](data.results[i]['AutoBroj']());
                             }
                             tmp.push(data.results[i]);
                        }
                        my.em.saveChanges().then(function () { console.log(tmp());ber.resolve(tmp);});
                        //data.results[0].entityAspect.setDeleted();
                    } else { ber.resolve(true);alert('nema rezultata!'); }
                
                    return ber.promise;
                    //data.results[0].hasChangesChanged();
                }
                function queryFailed(error) {
                    alert("Query failed: " + error.message);
                }
            }



            var delRowsByID = function (tablica, id) {
                var query = breeze.EntityQuery.from(tablica)
                        .where('ID_Broj', 'eq', id);

                return my.em.executeQuery(query)
                    .then(querySucceeded)
                    .fail(queryFailed);
                function querySucceeded(data) {
                    if (data.results[0] !== undefined) {
                        for (var i = 0; i < data.results.length;i++){
                            data.results[i].entityAspect.setDeleted();
                        }
                    }
                }
                function queryFailed(error) {
                    alert("Query failed: " + error.message);
                }
            }

            ///////////////brisi zapis!!
            var delRowByID = function (tablica, id) {
                var query = breeze.EntityQuery.from(tablica)
                        .where('ID', 'eq', id);
                if (tablica === 'tbl_Media_collector') {
                    query = breeze.EntityQuery.from(tablica)
                            .where('AutoBroj', 'eq', id);
                }
                if (tablica === 'tbl_Kartica') {
                    query = breeze.EntityQuery.from('tbl_Kartica')
                            .where('ID_Broj', 'eq', id);
                }
                if (id < 0) {
                    var query = query.using(breeze.FetchStrategy.FromLocalCache);
                }
                return my.em.executeQuery(query)
                    .then(querySucceeded)
                    .fail(queryFailed);
                function querySucceeded(data) {
                    if (data.results[0] !== undefined) {
                        data.results[0].entityAspect.setDeleted();
                    }
                }
                function queryFailed(error) {
                    alert("Query failed: " + error.message);
                }
            }
  
            //izbrisan setBrojid

            function setIdentity(brojid, id) {
                var query = breeze.EntityQuery.from('tbl_Media_collector')
                    .where('ID_Broj', 'eq', brojid)
                    .orderBy('ID_Sub_Broj');
                return my.em.executeQuery(query)
                    .then(querySucceeded)
                    .fail(queryFailed);
                function querySucceeded(data) {
                    var ber = Q.defer();
                    var tmp = ko.observableArray([]);
                    console.log('started XXXfMM');
                    if (data.results[0] !== undefined) {
                        console.log(data.results);
                        var lun = data.results.length;
                        var i=0;
                        var x = 1002;
                        my.em.saveChanges().then(function (){
                            data.results[0]['ID_Sub_Broj'](3333);
                            data.results[0]['MC_Identity'](false);
                        }).then(function () {
                            alert('sejn nula');
                                my.em.saveChanges();})
                        .then(function () {
                           while ( i < lun) {


                                if (data.results[i]['AutoBroj']() == id) {
                                    data.results[i]['MC_Identity'](true);
                                    data.results[i]['ID_Sub_Broj'](1);
                                    tmp.push(data.results[i]);
                                    my.em.saveChanges().then(function() {i++;});
                                } else {
                                    data.results[i]['ID_Sub_Broj'](x);
                                    data.results[i]['MC_Identity'](false);
                                    //tmp.push(data.results[i]);
                                    my.em.saveChanges().then(function () { i++;x++ });
                                    //x++;
                                }


                            }
                            //console.log(tmp());
                            for (var i = 0; i < lun; i++) {
                                if (data.results[i]['ID_Sub_Broj']() > 1000) {
                                    var ccc = data.results[i]['ID_Sub_Broj']()
                                    data.results[i]['ID_Sub_Broj'](ccc - 1000);
                                    alert(data.results[i]['ID_Sub_Broj']());
                                    my.em.saveChanges();
                                    tmp.push(data.results[i]);
                                }
                                if (i == lun - 1) { ber.resolve(tmp); }
                            }
                        });
                        //console.log(tmp());
                        /////my.em.saveChanges().then(function () { console.log(tmp()); ber.resolve(tmp); });
                    
                        //data.results[0].entityAspect.setDeleted();
                    } else { ber.resolve(true); alert('nema rezultata!'); }

                    return ber.promise;
                    //data.results[0].hasChangesChanged();
                }
                function queryFailed(error) {
                    alert("Query failed: " + error.message);
                }



            }


    /////za pogledat promjene!
                my.em.entityChanged.subscribe(function (changeArgs) {
                    var action = changeArgs.entityAction;

                    if (action === breeze.EntityAction.PropertyChange) {
                        var entity = changeArgs.entity;
                    
                        var propertyName = changeArgs.args.propertyName;
                        if (propertyName == 'IZR_Vrijeme_vrijednost2') {
                            //alert(entity[propertyName]());
                            if (parseInt(entity[propertyName]()) < 22) {
                                entity['IZR_Vrijeme_jedinica2']("st.");
                            } else {
                                entity['IZR_Vrijeme_jedinica2']("g.");
                            }


                        }
                        if (propertyName == 'IZR_Vrijeme_vrijednost') {
                            //alert(entity[propertyName]());
                            if (parseInt(entity[propertyName]()) < 22) {
                                entity['IZR_Vrijeme_jedinica']("st.");
                            } else {
                                entity['IZR_Vrijeme_jedinica']("g.");
                            }

                        }
                        if (propertyName == '!!!MC_Identity' && !lockedMmedia) {
                             alert(entity['MC_Identity']());
                            lockedMmedia = true;
                            setIdentity(entity['ID_Broj'](), entity['AutoBroj']())
                            .then(function () { alert(lockedMmedia);lockedMmedia=false}).fail(function(){lockedMmedia=false;});
                        }
                    }
            });


                function getJsonRefreshGridPage(sifra, pageSize, pageIndex) {
                    var t1 = ko.observable();
                    t1({ 'sifra': sifra, 'pageSize': pageSize, 'pageIndex': pageIndex });
                    var xd = ko.toJSON(t1);
                    var req = $.ajax({
                        type: 'GET',
                        url: adresaAPI + '?sifra=' + sifra + '&pageSize=' + pageSize + '&pageIndex=' + pageIndex,
                        dataType: 'json',
                        contentType: 'application/json',
                        success: function (response, text) {
                        },
                        error: function (text, error) {
                            // alert('!!!!!!greška pri dohvatu podataka' + error + text);
                            alert(error);
                        },
                        cancel: function () {
                            //that._deactivateLoader();
                        }
                    });
                    return req;
                }


                var saveChanges = function () {
                    var ber = Q.defer();
                    my.em.saveChanges().then(function(){ber.resolve(true);}).fail(function (error) { alert("Failed save to server: " + error.message); });
                    return ber.promise;
                }

                var saveChangesLimited = function (n) {
                    var ber = Q.defer();
                    my.em.saveChanges(n).then(function () { ber.resolve(true); }).fail(function (error) { alert("Failed save to server: " + error.message); });
                    return ber.promise;
                }

                var undoChanges = function () {
                    my.em.rejectChanges();
                }


            var dataService= {
                autori: autori,
                
                // rezultati: rezultati,
                getFullTblSkp:getFullTblSkp,
                postCreateNoviZapis: postCreateNoviZapis,
                load: load,
                undoChanges:undoChanges,
                getJson: getJson,
                fullkartica: fullkartica,
                //getFullKartica: getFullKartica,
                currentAutor: currentAutor,
                primeData: primeData,
                //getKartica: getKartica,
                currentBrojid: currentBrojid,
                //createZapis: createZapis,
                createTermin: createTermin,

                Selects: Selects,
                SelectsPretrazivanje:SelectsPretrazivanje,
                //SelectsArrays: SelectsArrays,
                getExportFullKartica: getExportFullKartica,
                isLoaded: isLoaded,
                saveChanges: saveChanges,
                defStruktura: defStruktura,
                testLoader: testLoader,
                rejectSejv: rejectSejv,
                getNavRecords: getNavRecords,
                createZapisExt: createZapisExt,
                dMax: dMax,
                delRowByID:delRowByID,
                createOsoba: createOsoba,
                mijenjanoFlag: mijenjanoFlag,
                createMmediju: createMmediju,
                fixMmediju: fixMmediju,
                getPrviIzZbirke: getPrviIzZbirke,
                getJsonNovaNavigacija: getJsonNovaNavigacija,
                getFullMmedia: getFullMmedia,
                saveChangesLimited: saveChangesLimited,
                userName: userName,
                password: password,
                login: login,
                userExists: userExists,
                changePassword: changePassword,
                isAuthenticated: isAuthenticated,
                logout: logout,
                realUserName: realUserName,
                realUserRoles: realUserRoles,
                getUserRoles:getUserRoles,
                getUserName: getUserName,
                realIsAuth: realIsAuth,
                isAuthenticatedLocal: isAuthenticatedLocal,
                createEntityDetatched: createEntityDetatched,
                createEntityBatch: createEntityBatch,
                Vremena: Vremena,
                VrijemeOpis: VrijemeOpis,
                VrijemeJedinica: VrijemeJedinica,
                delRowsByID: delRowsByID,

                parametri: parametri,
                //parametriZaKorisnika: parametriZaKorisnika,
                getDefForme: getDefForme,
                //protoForme: protoForme,
                //upisiParametar: upisiParametar,
                getImeZbirke: getImeZbirke,
                getWebAPISQL: getWebAPISQL,
                getWebAPIAccounts: getWebAPIAccounts,
                loadedTerminologyUpiti: loadedTerminologyUpiti,
                loadedTerminologyUpis: loadedTerminologyUpis,
                navigacijaIzPretrazivanja: navigacijaIzPretrazivanja,
                getNavRecordsUpit: getNavRecordsUpit,
                loadTerminologyWebWorker: loadTerminologyWebWorker,
                loadTerminologyWebWorkerUpis: loadTerminologyWebWorkerUpis,
                stripSlashes: stripSlashes,
                stazaSlike: stazaSlike,
                getJsonRefreshGridPage: getJsonRefreshGridPage,
                getZbirka: getZbirka,
                getPocetnaZbirka: getPocetnaZbirka,
                undoTermin: undoTermin,
                openNewTermDialog:openNewTermDialog,
                spremiTerminPopUp:spremiTerminPopUp,
                objektZaTerminoloske:objektZaTerminoloske
            }

            return dataService;
      

        }();
 

    my.em.fetchMetadata().then(my.vm.load());
    
 
});
return my.vm;
});