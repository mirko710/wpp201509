define(function () {


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
            adresaAccount ='api/Account',
            lockedMmedia = false,
            userName = ko.observable(null),
            realIsAuth = ko.observable(false),
            realUserName = ko.observable(''),
            realUserRoles = ko.observableArray([]),
            password = ko.observable(''),
            selMjere = ko.observableArray([]),
            selInventarizacija = ko.observableArray([]),
            selOcuvanost = ko.observableArray([]),
            selIzrada = ko.observableArray([]),
            selKljucneRijeci = ko.observableArray([]),
            selMat = ko.observableArray([]),
            selNazivi = ko.observableArray([]),
            selNaslovi = ko.observableArray([]),
            selKartica = ko.observableArray([]),
            selSadrzaj = ko.observableArray([]),
            selPodOznake = ko.observableArray([]),
            dimenzije = ko.observableArray([]),
            dijelovi = ko.observableArray([]),
            jedinice = ko.observableArray([]),
            fullkartica = ko.observableArray([]),
            defStruktura = ko.observableArray([]),
           // protoForme = ko.observableArray([]),
            mijenjanoFlag = ko.observable(false),
            autori = ko.observableArray([]),
            currentAutor = ko.observable(),
            currentBrojid = ko.observable(),
            isLoaded = false,
            testLoader = ko.observable(88),
            tempBrojid = ko.observable(-1),
            Selects = [];

            var parametriModel = function () {
                that = this;
                this.parametriZaKorisnika = [];


                this.Vrijednost = function (imeParametra) {
                    var returnValue = false;//možda -1 ako ne nađe parametar
                    $.each(that.parametriZaKorisnika, function (i, v) {
                        if (v.Parametar().toUpperCase() === imeParametra.toUpperCase()) {
                            returnValue = v.Vrijednost();
                            if (returnValue === 'DA') {
                                returnValue = true;
                            }
                            if (returnValue === 'NE') {
                                returnValue = false;
                            }
                           return false;
                        }
                    
                    });
                    return returnValue;
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
            var parametri = new parametriModel();

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
                                      { 'imePolja': 'IZR_Vrijeme_jedinica2', 'vrijednost': null },
                                      { 'imePolja': 'IZR_Period', 'vrijednost': null },
                                      { 'imePolja': 'IZR_Period_do', 'vrijednost': null }
                            ]
            }

            ];
    //{ U_IDT_Materijal: 1, U_IDT_Tehnika: 1, U_IDT_Dio_predmeta: 49 }
            var SelectsArrays = [{ 'dIme': 'zbirke', 'ime': 'Zbirke', 'izvor': 'tbl_T_Zbirke' },
                               { 'dIme': 'jedinice', 'ime': 'Jedinice', 'izvor': 'tbl_T_Jedinice_mjere' },
                               {'dIme': 'dijelovi', 'ime': 'Dijelovi', 'izvor': 'tbl_T_Dijelovi' },
                               { 'dIme': 'vrste_naziva', 'ime': 'Vrste_naziva', 'izvor': 'tbl_T_Vrste_naziva' },
                               {'dIme': 'vrste_naslova', 'ime': 'Vrste_naslova', 'izvor': 'tbl_T_Vrste_naslova' },
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
                               { 'dIme': 'smjestaj_stalni', 'ime': 'Smjestaj_stalni', 'izvor': 'tbl_T_Smjestaj_stalni' },
                               { 'dIme': 'smjestaj_privremeni', 'ime': 'Smjestaj_privremeni', 'izvor': 'tbl_T_Smjestaj_privremeni' },
                               { 'dIme': 'smjestaj_privremeni_vrsta', 'ime': 'Smjestaj_privremeni_vrsta', 'izvor': 'tbl_T_Smjestaj_privremeni_vrsta' },
                               { 'dIme': 'kustosi', 'ime': 'Kustosi', 'izvor': 'vw_T_Kustosi' },
                               { 'dIme': 'izvori_nabave', 'ime': 'Izvori_nabave', 'izvor': 'vw_T_Izvori_nabave' },
                               { 'dIme': 'ocuvanosti', 'ime': 'Ocuvanosti', 'izvor': 'tbl_T_Ocuvanosti' },
                               { 'dIme': 'valute', 'ime': 'Valute', 'izvor': 'tbl_T_Valute' },
                               { 'dIme': 'pribavljanje', 'ime': 'Pribavljanje', 'izvor': 'tbl_T_Pribavljanje' }, //{"pribavljanje","tbl_T_Pribavljanje"}
                               { 'dIme': 'dimenzije', 'ime': 'Dimenzije', 'izvor': 'tbl_T_Dimenzije' }];


            my.em.hasChangesChanged.subscribe(function (eventArgs) {
                //alert(my.em.hasChanges());
                //console.log(eventArgs);
                mijenjanoFlag(my.em.hasChanges());

                });

            var primeData = function () {
            
               // var promise = Q.all([
                //console.log(my.vm.testLoader()),getAutori(),getUpitAutori(),getDefForme(),
               // console.log(my.vm.testLoader()), getDefForme(), my.vm.getKartica()]);
               return getUserName().then(function () {
                    parametri.ucitajParametre()
                    .then(function(){
                        console.log(parametri.Vrijednost("S_DEFAULT_ZBIRKA"));
                    });
                    //getUserRoles();
                });
            
            
                //return promise.then(success);

                function success() {
                    return true;
                    if (true) {//primjer za webWorkera i terminološke
                        var myWorker = new Worker("../App/services/webWorker.js"); // Init Worker

                        myWorker.onmessage = function (oEvent) { // On worker job finished
                            var tmpSelects = JSON.parse(oEvent.data);

                            my.vm.Selects = tmpSelects;

                            myWorker.terminate();
                            loadedTerminologyUpiti(true);
                        }


                        myWorker.postMessage('WORK!');
                    } else {

                        var transferObject;
                        getWebAPISQL(1,-1, transferObject).then(function (b) {
                        //getDefNOEF(transferObject).then(function (b) {
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


            var loadTerminologyWebWorker = function () {
                var myWorker = new Worker("../App/services/webWorker.js"); // Init Worker
                myWorker.onmessage = function (oEvent) { // On worker job finished
                    var tmpSelects = JSON.parse(oEvent.data);
                    my.vm.Selects = tmpSelects;
                    myWorker.terminate();
                    loadedTerminologyUpiti(true);
                }
                myWorker.postMessage('WORK!');
            }

            var loadTerminologyWebWorkerUpis = function () {
                var myWorker = new Worker("../App/services/webWorkerUpis.js"); // Init Worker
                myWorker.onmessage = function (oEvent) { // On worker job finished
                    var tmpSelects = JSON.parse(oEvent.data);
                    my.vm.Selects = tmpSelects;
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



            var getFullInventarizacija = function (brojid,tmpInventarizacija) {
                var query = breeze.EntityQuery.from("tbl_Inventarizacija")
                    .where('ID_Broj', 'eq', brojid)

                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {
                    tmpInventarizacija(data.results);
                }
                function queryFailed(error) {
                    alert("Query failed (inv): " + error.message);
                }

            }

            var getFullOcuvanost = function (brojid, tmpOcuvanost) {
                var query = breeze.EntityQuery.from("tbl_Ocuvanost")
                .where('ID_Broj', 'eq', brojid)

                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {
                   tmpOcuvanost(data.results);
                }
                function queryFailed(error) {
                    alert("Query failed (ocuvanost): " + error.message);
                }

            }

        
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



            var getAutori = function () {
                var query = breeze.EntityQuery.from("wv_T_Autori")
                                    .select('IDT,Pojam')
                                    .orderBy('Pojam');

                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {
                    var maper = ko.observableArray([]);
                   // for (i = 0; i < data.results.length; i++) {
                   //     var zime=data.results[i].Prezime;
                   ///     if(data.results[i].Ime){
                   //         zime+=', ' + data.results[i].Ime ; 
                  //      }
                  //      maper.push({ 'ID': data.results[i].ID, 'Prezime': zime });
                  //  }
                    //console.log(maper());
                    my.vm.Selects['Autori'] = data.results;//maper;
                    my.vm.autori(data.results);
                }
                function queryFailed(error) {
                    alert("Query failed (getAutori): " + error.message);
                }

            }
            load = function () {
                console.log('load kontekst');
                return 'eee';
            }

            var getUpitAutori = function () {
                var query = breeze.EntityQuery.from("wv_T_Autori")
                                    .select('IDT,Pojam');

                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {
                    var maper = ko.observableArray([]);
                    // for (i = 0; i < data.results.length; i++) {
                    //     var zime=data.results[i].Prezime;
                    ///     if(data.results[i].Ime){
                    //         zime+=', ' + data.results[i].Ime ; 
                    //      }
                    //      maper.push({ 'ID': data.results[i].ID, 'Prezime': zime });
                    //  }
                    console.log(data.results);
                    my.vm.Selects['upitAutori'] = data.results;//maper;
                   // my.vm.upitAutori(data.results);
                }
                function queryFailed(error) {
                    alert("Query failed (getUpitAutori): " + error.message);
                }

            }
            load = function () {
                console.log('load kontekst');
                return 'eee';
            }

 

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



            var getJsonAutocompleteER= function (tablicaPojam,returnVal) {
                
                //tablica = 'tbl_T_Nazivi';
                var req = $.ajax({
                    type: 'GET',
                    url: adresaAPI + "?tablica=" + tablicaPojam.tablica + "&term=" + tablicaPojam.pojam,
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (response, text) {
                        returnVal(response);
 
                    },
                    error: function (text, error) {
                       
                        console.log(error);
 
                    },
                    cancel: function () {
                       
                    }
                })
                return req;
            }



            var getJson = function (address) {

                var req = $.ajax({
                    type: 'GET',
                    url: address,
                    dataType: 'json',
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
                var outParametar = "3";
                if (vrstaPoziva == 6 || vrstaPoziva == 7) outParametar = navigacijaIzPretrazivanja();
                if (vrstaPoziva == 9) outParametar = parametar;
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


            var getDefNOEF = function (transferObject) {

                var req = $.ajax({
                    type: 'GET',
                    //url: '/api/ALTValuesNOEF?i1=2&i2=2&i3=3',
                    url: adresaAPI + '?i1=2&i2=2&i3=3',
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (response, text) {

                        //ko.mapping.fromJS(response["VratiNazive"], that.viewModel.taDa);

                        transferObject = response;
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


            var getJsonTermBucket = function (transferObject) {

                var req = $.ajax({
                    type: 'GET',
                    //url: '/api/ALTValuesNOEF?nemaVeze=2&tablice=rrr',
                    //url: '/api/DVALTValuesNOEF?nemaVeze=2&tablice=rrr',
                    url: adresaAPI + '?nemaVeze=2&tablice=rrr',
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (response, text) {

                        //ko.mapping.fromJS(response["VratiNazive"], that.viewModel.taDa);

                        transferObject =response;
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

            var getJsonPOSTPromijeniIdentity = function (idBroj, idSubBroj) {

                var req = $.ajax({
                    type: 'POST',
                    url: '/api/NoviZapis?idBroj=' + idBroj + '&idSubBroj=' + idSubBroj,
                    dataType: 'json',
                    //data: JSON.stringify({ 'KRT_IDT_Zbirka': zbirka, 'KRT_Inventarni_broj': invBroj }),
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


            var delJSON = function (tablica, id) {

                var req = $.ajax({
                    type: 'POST',
                    url: '/api/BrisiZapis',
                    dataType: 'json',
                    data: JSON.stringify({ 'tablica': tablica, 'ID': id }),
                    contentType: 'application/json',
                    success: function (response, text) {

                        //ko.mapping.fromJS(response["VratiNazive"], that.viewModel.taDa);

                        //return rezultati(response);
                        // rezultati(response.data);
                        console.log(response);
                        alert("delJSON");
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




            var getJsonPOSTPager = function (sifra,pageSize,pageIndex) {
                var t1 = ko.observable();
                t1({ 'sifra': sifra, 'pageSize': pageSize,'pageIndex':pageIndex });
                var xd = ko.toJSON(t1);
                //console.log(xd);
                var req = $.ajax({
                    type: 'GET',
                    url: '/api/ALTValues?sifra=' + sifra +'&pageSize='+ pageSize +'&pageIndex=' + pageIndex,
                    dataType: 'json',
                    //data: xd,// JSON.stringify(redakUpiti),
                    contentType: 'application/json',
                    success: function (response, text) {
                        //passObject=response.data;
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


            var getJsonPOSTPagerNOEF = function (sifra, pageSize, pageIndex) {
                var t1 = ko.observable();
                t1({ 'sifra': sifra, 'pageSize': pageSize, 'pageIndex': pageIndex });
                var xd = ko.toJSON(t1);
                //console.log(xd);
                var req = $.ajax({
                    type: 'GET',
                    url: '/api/ALTValuesNOEF?sifra=' + sifra + '&pageSize=' + pageSize + '&pageIndex=' + pageIndex,
                    dataType: 'json',
                    //data: xd,// JSON.stringify(redakUpiti),
                    contentType: 'application/json',
                    success: function (response, text) {
                        //passObject=response.data;
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



            var getJsonPOSTREG = function (redakUpiti) {
                var nx = ko.observableArray([]);
                //nx(redakUpiti);
                //console.log(redakUpiti);
                //console.log(nx);
                $.each(redakUpiti, function (index, data) {
                    var z = new redakUpitaModel();
                    z.polje(data.polje());
                    z.poljeIDT(data.poljeIDT());
                    z.vrijednost(data.vrijednost());
                    z.tablica(data.tablica());
                    z.upitOperator(data.upitOperator());
                    nx.push(z);
                });
                //$.each(nx(), function (index, data) {
                //    data.term(null);
                //});

                var xd = ko.toJSON(nx);
                //console.log(xd);
                var req = $.ajax({
                    type: 'POST',
                    url: '/api/regRez',
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
                        // that._deactivateLoader();
                    },
                    cancel: function () {
                        //that._deactivateLoader();
                    }
                });



                //req.then(function (resp) { rezultati(resp) });
                //console.log(req);
               // req.then(isAuthenticated());
                return req.promise();
            }

            var isAuthenticated = function (userName) {
                var returnObject;

                getWebAPIAccounts(0,"prazno",returnObject).then(
                    function (response) {
                        realIsAuth(response);
                    })
            }

            var isAuthenticatedOld = function (userName) {
               // alert("log3");
                var req = $.ajax({
                    type: 'GET',
                    url: '/api/Account',
                    dataType: 'json',
                    //data: JSON.stringify(new String(userName)),
                    contentType: 'application/json',
                    success: function (response, text) {
                        realIsAuth(response);

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

                var getUserNameOLD = function () {

                    var req = $.ajax({
                        type: 'GET',
                        url: '/api/Account?x=1&y=2&z=3&w=4',
                        dataType: 'json',
                        //data: JSON.stringify(new String(userName)),
                        contentType: 'application/json',
                        success: function (data) {
                            realUserName(data);
                            //alert(data);
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


                var getSecurityWithParameters = function (i) {


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

                var getUserRolesOLD = function () {

                    var req = $.ajax({
                        type: 'GET',
                        url: '/api/Account?x=1&y=2&z=3&w=4&q=5',
                        dataType: 'json',
                        //data: JSON.stringify(new String(userName)),
                        contentType: 'application/json',
                        success: function (data) {

                            realUserRoles([]);
                            for (var i = 0; i < data.length; i++) {
                                realUserRoles.push(data[i]);
                                //alert(data[i]);
                            }
                        
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


                var logoutOLD = function () {
                    //alert("log2");
                    var req = $.ajax({
                        type: 'GET',
                        url: '/api/Account?x=1&y=2&z=3',
                        dataType: 'json',
                        //data: JSON.stringify(new String(userName)),
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
                    //req.then(isAuthenticated());
                return req.promise();
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
                        // that._deactivateLoader();
                    },
                    cancel: function () {
                        //that._deactivateLoader();
                    }
                });



                //req.then(function (resp) { rezultati(resp) });
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
                        // that._deactivateLoader();
                    },
                    cancel: function () {
                        //that._deactivateLoader();
                    }
                });



                //req.then(function (resp) { rezultati(resp) });
                return req;
            }


            var getQueryResults = function (p1, p2, rezultat) {
                //var pred = new breeze.Predicate(p1, "==", p2);
                var query = breeze.EntityQuery.from("tbl_Kartica")
                    .where(p1, "==", p2)
                    //.expand('tbl_Izrada,tbl_Naslovi,tbl_Nazivi,tbl_Mjere,tbl_U_Materijali_u_dijelovima')
                    .select('ID_Broj,KRT_Inventarni_broj,KRT_IDT_Zbirka')
                    .take(20)
                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {
                    rezultat([]);
                    rezultat(data.results);


                }
                function queryFailed(error) {
                    alert("Query failed (getQresults): " + error.message);
                }
            }



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

            var getFullKljucneRijeci = function (brojid, tmpIzrada) {
                //alert("evoizrade " + brojid);
                var query = breeze.EntityQuery.from("tbl_Kljucne_rijeci")
                    .where('ID_Broj', 'eq', brojid)
                
                //.select('ID_Broj,KRT_Inventarni_broj,KRT_IDT_Zbirka,tbl_Izrada,tbl_Naslovi,tbl_Nazivi,tbl_Mjere,tbl_U_Materijali_u_dijelovima')
                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {

                    tmpIzrada(data.results);
                    //console.log(data.results);
                }
                function queryFailed(error) {
                    alert("Query failed (getKljucnerijeci): " + error.message);
                }
            }



            var getFullIzrada = function (brojid, tmpIzrada) {
                //alert("evoizrade " + brojid);
                var query = breeze.EntityQuery.from("tbl_Izrada")
                    .where('ID_Broj', 'eq', brojid)
                    //.expand('tbl_T_Mjesta,tbl_T_Autori')
                //.select('ID_Broj,KRT_Inventarni_broj,KRT_IDT_Zbirka,tbl_Izrada,tbl_Naslovi,tbl_Nazivi,tbl_Mjere,tbl_U_Materijali_u_dijelovima')
                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {
                
                    tmpIzrada(data.results);
                    //console.log(data.results);
                 }
                function queryFailed(error) {
                    alert("Query failed(getfullizrada): " + error.message);
                }
            }


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

                var tmpslik = data;
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
                //alert("getzbirka" + zbirka);
                var ber = Q.defer();
                var query = breeze.EntityQuery.from("tbl_Kartica")
                    .where('ID_Broj', 'eq', zbirka)
                    .select('KRT_IDT_Zbirka')
                    .take(1);
                    //.orderBy('KRT_SORT_Inv_br')
                
                //.skip(1);
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


            var getExportFullKartica = function (brojid, karticaFull) {
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
                    karticaFull(my.vm.fullkartica());
                    // nazivi(karticaFull()[0]['tbl_Nazivi']());
                    //alert('kartica Export');

                }
                function queryFailed(error) {
                    alert("Query failed(getExportFullKartica): " + error.message);
                }
            }
               //getFullKartica = function (brojid) {
               //    var query = breeze.EntityQuery.from("FullKartica")
               //        //.select('ID_Broj,KRT_Inventarni_broj,KRT_IDT_Zbirka,tbl_Izrada,tbl_Naslovi,tbl_Nazivi,tbl_Mjere,tbl_U_Materijali_u_dijelovima')
               //    .where('ID_Broj', 'eq', brojid)
               //    .expand('tbl_Izrada,tbl_Naslovi,tbl_Nazivi,tbl_Mjere,tbl_U_Materijali_u_dijelovima');

               //    return my.em.executeQuery(query)
               //            .then(querySucceeded)
               //            .fail(queryFailed);
               //    function querySucceeded(data) {

               //        my.vm.fullkartica(data.results);
               //        my.vm.selMjere(my.vm.fullkartica()[0]['tbl_Mjere']());
               //        my.vm.selIzrada(my.vm.fullkartica()[0]['tbl_Izrada']());
               //        my.vm.selMat(my.vm.fullkartica()[0]['tbl_U_Materijali_u_dijelovima']());
               //        my.vm.selNazivi(my.vm.fullkartica()[0]['tbl_Nazivi']());
               //        my.vm.selNaslovi(my.vm.fullkartica()[0]['tbl_Naslovi']());

               //    }
               //    function queryFailed(error) {
               //        alert("Query failed: " + error.message);
               //    }
               //},
            var getKartica = function () {
                var query = breeze.EntityQuery.from("tbl_Kartica")
                    .select('ID_Broj,KRT_Inventarni_broj')
                    .where('ID_Broj', 'lt', 1000)
                     .orderBy('KRT_SORT_Inv_br');

                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {

                    my.vm.selKartica(data.results);
                }
                function queryFailed(error) {
                    alert("Query failed(getKartica): " + error.message);
                }
            }



            ////za grid?
            var getMjesta = function (fraz, middleArray) {
                var query = breeze.EntityQuery.from("tbl_Mjesta")
                    .select("IDT,Pojam")
                    .where("Pojam", breeze.FilterQueryOp.Contains, fraz)
                     .orderBy('Pojam');

                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {

                    // my.vm.Selects['Mjesta'] = data.results;
                    // console.log(middleArray());
                    middleArray.push(data.results);
                    //console.log(middleArray());
                }
                function queryFailed(error) {
                    alert("Query failed: " + error.message);
                }


            }


            var getDef = function () {
                var query = breeze.EntityQuery.from("tbl_Def_Struktura")
                     .orderBy('Naziv');

                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {

                    my.vm.defStruktura(data.results);
                }
                function queryFailed(error) {
                    alert("Query failed(getDef): " + error.message);
                }
            }

            var getSel = function (karticaObservable) {
                karticaObservable([]);
                var query = breeze.EntityQuery.from("tbl_Kartica")
                    .select('ID_Broj,KRT_Inventarni_broj')
                    .where('ID_Broj', 'lt', 90000)
                     .orderBy('KRT_SORT_Inv_br');

                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {

                    my.vm.selKartica(data.results);
                    karticaObservable(my.vm.selKartica());

                }
                function queryFailed(error) {
                    alert("Query failed(getSel): " + error.message);
                }
            }




            var getGrid = function (tablica, pagesize, pageindex, filteri, sortevi, backLoad,recordCount) {
                //alert(pageindex * pagesize);
                var query = breeze.EntityQuery.from(tablica)
              //.select("IDT,Pojam")
                
              .orderBy('Pojam')
              .take(pagesize)
              .skip(pageindex * pagesize)
              .inlineCount();
               //.expand("tbl_T_Mjesta1");



                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {
                    backLoad(data.results);
                
                    recordCount(data.inlineCount);
                }
                function queryFailed(error) {
                    alert("Query failed(getGrid): " + error.message);
                }


            }

            var getTerminoloskeNad = function (ime, murky) {
                var query = breeze.EntityQuery.from(ime)
                         .select("IDT,Pojam,Nad_IDT")
                         .orderBy('Nad_IDT,Pojam')
                         .take(18000);

                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {
                    //console.log(data.results);
                    murky(data.results);
                }
                function queryFailed(error) {
                    alert("Query failed: " + error.message);
                }
            }

            var getTerminoloske = function (ime) {
                var query = breeze.EntityQuery.from(ime)
                         .select("IDT,Pojam,Nad_IDT")
                         //.orderBy('Sort')
                         .take(18000);



                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {
                
                    my.vm.Selects[ime] = data.results;
 
                }
                function queryFailed(error) {
                    alert("Query failed: " + error.message);
                }
            }



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


            var getTerminoloskeListe = function () {
                var query = breeze.EntityQuery.from('Liste')
                         .select('IDT,Pojam,Nad_IDT');


                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {
                    var tempListe = data.results;
                    $.each(my.vm.SelectsArrays, function (i, p) {
                        //console.log('liste' + tempListe[0][p.dIme]);
                        my.vm.Selects[p.ime] = tempListe[0][p.dIme];
                        //    my.vm.getTerminoloske(p.ime);
                    })

                }
                function queryFailed(error) {
                    alert("Query failed: " + error.message);
                }
            }



            var getJedinice = function () {
                var query = breeze.EntityQuery.from("tbl_T_Jedinice_mjere")

                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {

                    my.vm.jedinice(data.results);
                }
                function queryFailed(error) {
                    alert("Query failed: " + error.message);
                }
            }

            var autoComp = function (tablica, jampo, ime) {

                var query = breeze.EntityQuery.from(tablica)
                                 .where('Pojam', FilterQueryOp.Contains, jampo)
                                 .select('Pojam,IDT')
                                 .orderBy('Pojam');


                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {

                    my.vm.Selects[ime] = data.results;
                }
                function queryFailed(error) {
                    alert("Query failed: " + error.message);
                }

            }

            var getDimenzije = function () {
                var query = breeze.EntityQuery.from("tbl_T_Dimenzije")


                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {

                    my.vm.dimenzije(data.results);
                }
                function queryFailed(error) {
                    alert("Query failed: " + error.message);
                }
            }


        
      



            var ucitajParametreOLD = function () {
                //alert(realUserName());
                var p1 = breeze.Predicate.create('Korisnik_UserName', 'Eq', realUserName());
                var p2 = breeze.Predicate.create('Korisnik_UserName', 'Eq', 'KOD');
            

                var pred = breeze.Predicate.or([p1, p2]);
                var query = breeze.EntityQuery.from("tbl_Parametri_za_korisnike")
                    .where(pred);


                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {

                    parametriZaKorisnika(data.results);
                }
                function queryFailed(error) {
                    alert("Query failed: " + error.message);
                }
            }



       


            var getMjestaZaTreeView = function (z,retval) {
                var query = breeze.EntityQuery.from("MjestaZaTreeView")

                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {

                    retval(data.results);
                }
                function queryFailed(error) {
                    alert("Query failed: " + error.message);
                }
            }

            var getZbirkeZaTreeView = function (z, retval) {
                var query = breeze.EntityQuery.from("ZbirkeZaTreeView")

                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {

                    retval(data.results);
                }
                function queryFailed(error) {
                    alert("Query failed: " + error.message);
                }
            }

            var createEntityDetatchedold = function (templ) {
                var feder = Q.defer();
                var EntityState = breeze.EntityState;
                if (templ == 'smlNazivi') {
                   // alert("budenaziva");
                    var newCust = my.em.createEntity('tbl_Nazivi', {  NAZ_IDT_Vrsta_naziva: 1 }, EntityState.Detached);//.then(function(z){feder.resolve(z);});
                }

                if (templ == 'smlNaslovi') {
                    var newCust = my.em.createEntity('tbl_Naslovi', { NSL_IDT_Vrsta_naslova: 1, NSL_IDT_Jezik_naslova: 1 }, EntityState.Detached);//.then(function (z) { feder.resolve(z); });
                }
                if (templ == 'smlMaterijali') {
                    var newCust = my.em.createEntity('tbl_U_Materijali_u_dijelovima', { U_IDT_Materijal: 1, U_IDT_Tehnika: 1, U_IDT_Dio_predmeta: 49 }, EntityState.Detached);//.then(function (z) { feder.resolve(z); });
                }

                //my.vm.selMjere.push(newCust);
                //alert("PAUZA!");
                return newCust;

            }




            var createEntityDetatched = function (templ) {
                //var feder = Q.defer();
                var newCust = null;
                var EntityState = breeze.EntityState;
                if (templ == 'smlZbirka') {
                    newCust = { 'zbIndex': '2' }
                } else {

                    $.each(defPoljaTablice, function (index, item) {

                        if (templ == item.templ) {
                            //alert(templ);
                            newCust = my.em.createEntity(item.tablica, null, EntityState.Detached);//.then(function(z){feder.resolve(z);});
                            $.each(item.polja, function (findex, fitem) {
                                //alert(fitem.imePolja + fitem.vrijednost);
                                newCust.setProperty(fitem.imePolja, fitem.vrijednost);
                            });
                            console.log(newCust);
                        }


                    });
                }
                //my.vm.selMjere.push(newCust);
                //alert("PAUZA!");
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
               // var feder = Q.defer();
                // var EntityState = breeze.EntityState;
                //alert(brojid);
                var defPoljaLen = defPoljaTablice.length - 1;
                var tLen = templ.length - 1;
                var newCust = null;
                $.each(templ,function(index,data){
               
                    if (data.templRow() == "smlZbirka") {
                        ////nadjiii
                        //alert(data.entity()['zbIndex']);
                        getKarticaSaveZbirka(brojid, data.entity()['zbIndex']);
                    }
                    else
                    {

                        $.each(defPoljaTablice, function (index, item) {

                            if (data.templRow() == item.templ) {

                                newCust = my.em.createEntity(item.tablica, { ID_Broj: brojid });//.then(function(z){feder.resolve(z);});
                                $.each(item.polja, function (findex, fitem) {
                                    //alert(fitem.imePolja + fitem.vrijednost);
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




            var createMjere = function (brojid) {

                var newCust = my.em.createEntity('tbl_Mjere', { ID_Broj: brojid() });
                my.vm.selMjere.push(newCust);

                return newCust;

            }


            var JQcreateInvBroj = function (invBroj, zbirka) {
                var ber = postCreateNoviZapis(zbirka, invBroj);
                $.when(ber).done(function (a) { alert('gotov dataservice');return a;});
            }

            var createInvBroj = function (invBroj, zbirka) {
            
                var ber = Q.defer();

                var rez = postCreateNoviZapis(zbirka, invBroj);

                ber.resolve(rez);
                alert('gotov dataservice');
                return ber.promise;
            }


            var createInvBrojx = function (invBroj, zbirka) {
                var newCust = ko.observable();
                var promo = dMax('AutoBroj', 'Kartica')
                .then(makeItSo)
                .then(function () { return my.vm.saveChanges(); })
                //.then(provjeriDaLiJeSpremljeno)
                 .then(srediID_Broj)
                 //.then(srediID_BrojLokalno)
                .then(function () { if (newCust()[0].ID_Broj() === newCust()[0].AutoBroj()) { return my.vm.saveChanges; } });

                function makeItSo(reza) {
                    alert(reza);
                    var newCust = my.em.createEntity('tbl_Kartica', { ID_Broj: reza + 999, KRT_Inventarni_broj: invBroj, KRT_IDT_Zbirka: zbirka });
                    //.then(function () { my.vm.saveChanges(); });
                
                   // prelazIDBroj = reza;
                    //my.vm.fullkartica.push(newCust);
                    //alert(prelazIDBroj);
                    tempBrojid(reza);
                    return reza;
                }
                function provjeriDaLiJeSpremljeno() {

                    
                }
                function srediID_Broj() {
                
                    var query = breeze.EntityQuery.from("tbl_Kartica")
                    .where('ID_Broj', 'eq', tempBrojid() + 999);


                    return my.em.executeQuery(query)
                            .then(querySucceeded)
                            .fail(queryFailed);
                    function querySucceeded(data) {
                        if (data.results!=[]) {
                            newCust(data.results);
                            console.log(newCust());
                            //alert(newCust()[0]['ID_Broj']() + ' www ' + newCust()[0].AutoBroj());
                            newCust()[0].ID_Broj(newCust()[0].AutoBroj());
                            //alert(newCust()[0]['ID_Broj']());
                        } else {
                            alert('nešto je zeznuo');
                            srediID_Broj;
                        }

                    }
                    function queryFailed(error) {
                        alert("Query failed: " + error.message);
                    }
                    //var newCust = my.em.fetchEntityByKey('Kartica', tempBrojid() + 999);

                }

                function srediID_BrojLokalno() {

                    var query = breeze.EntityQuery.from("tbl_Kartica")
                    .where('ID_Broj', 'eq', tempBrojid() + 999)
                    .using(breeze.FetchStrategy.FromLocalCache);


                    return my.em.executeQuery(query)
                            .then(querySucceeded)
                            .fail(queryFailed);
                    function querySucceeded(data) {

                        newCust(data.results);
                        console.log(newCust());
                        alert(newCust()[0]['ID_Broj']() + ' www ' + newCust()[0].AutoBroj());
                        newCust()[0].ID_Broj(newCust()[0].AutoBroj());
                        alert(newCust()[0]['ID_Broj']());

                    }
                    function queryFailed(error) {
                        alert("Query failed: " + error.message);
                    }
                    //var newCust = my.em.fetchEntityByKey('Kartica', tempBrojid() + 999);

                }




                return promo;
            }

            var createZapis = function (entity, brojid) {
                var newCust = my.em.createEntity(entity, { ID_Broj: brojid() });
                if (entity === 'tbl_Mjere') my.vm.selMjere.push(newCust);
                if (entity === 'tbl_Izrada') my.vm.selIzrada.push(newCust);
                if (entity === 'tbl_U_Materijali_u_dijelovima') my.vm.selMat.push(newCust);
                if (entity === 'tbl_Naslovi') my.vm.selNaslovi.push(newCust);
                if (entity === 'tbl_Nazivi') my.vm.selNazivi.push(newCust);
                if (entity === 'tbl_Sadrzaj') my.vm.selSadrzaj.push(newCust);
                if (entity === 'tbl_Pod_Oznake') my.vm.selPodOznake.push(newCust);
                return newCust;
            }

            var createZapisExt = function (entity, brojid, transferObservable) {
                //alert(brojid + 'createzapisext ' + entity);
                return Q.fcall(function () { return my.em.createEntity(entity, { ID_Broj: brojid }); }).then(saveWorked).fail(saveFailed);
                //return Q.fcall(function () { return my.em.createEntity(entity); }).then(saveWorked).fail(saveFailed);

                function saveWorked(newCust) {
                    //alert(entity);
                    if (entity === 'tbl_Mjere') {
                        //console.log(newCust);
                        newCust['MJR_IDT_Dimenzija'](17);
                        newCust['MJR_IDT_Jedinica_mjere'](1);
                        newCust['MJR_IDT_Mjereni_dio'](49);
                        //console.log(newCust);
                        //my.vm.selMjere.push(newCust);
                    }
                
                    if (entity === 'tbl_Sadrzaj') {
                        //console.log(newCust);
                        newCust['SDR_IDT_Vrsta'](6);

                        my.vm.selSadrzaj.push(newCust);
                    }

 
                    if (entity === 'tbl_Izrada') {
                        newCust['IZR_IDT_Vrsta_odgovornosti'](1);
                        newCust['IZR_Vrijeme_jedinica']('g.');
                        newCust['IZR_Vrijeme_jedinica2']('g.');
                        my.vm.selIzrada.push(newCust);
                    }
                    if (entity === 'tbl_U_Materijali_u_dijelovima') {
                        newCust['U_IDT_Dio_predmeta'](49);
                        my.vm.selMat.push(newCust);
                    }
                    if (entity === 'tbl_Naslovi') {
                        newCust['NSL_IDT_Vrsta_naslova'](1);
                        newCust['NSL_IDT_Jezik_naslova'](1);
                        my.vm.selNaslovi.push(newCust);
                    }
                    if (entity === 'tbl_Nazivi') {
                        newCust['NAZ_IDT_Vrsta_naziva'](1);
                        my.vm.selNazivi.push(newCust);
                    }

                    if (entity === 'tbl_Pod_Oznaka') {
                        my.vm.selPodOznake.push(newCust);
                    }

                    transferObservable.push(newCust);
                    return newCust;
                }
                function saveFailed(error) {
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
                    //alert('dmax:' + my.vm.zadnjiIDT);
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



            var createOsobaWorx = function (entity, pojam, ime) {

                return dMax('ID', ime)
                .then(function (nIDT) { return imePrez(pojam).then(function (imPr) { return makeItSo(nIDT, imPr); }); })
                .then(function (nIDT) { return imePrez(pojam).then(function (imPr) { return vratiObjekt(nIDT, imPr); }); })
 
                function makeItSo(nIDT, pojam) {
                    var deferred = Q.defer();
                    console.log(pojam);

                    var xPre = '';
                    var xIme = '';

                    xPre = pojam.xPre ;
                    xIme = pojam.xIme;
 
                    var newCust = my.em.createEntity(entity, { Prezime: xPre,Ime:xIme });


                    my.em.saveChanges();
 
                    deferred.resolve({ ID: nIDT + 1, Prezime: xPre, Ime: xIme });

                    return deferred.promise;

                }

                function vratiObjekt(nIDT, prezime) {
                   // alert('poceo vartiobjekt');
                    var deferred = Q.defer();
                    var vratiID = ko.observable(-1);
                    var retVal = ko.observable("");
                    var prom = Q.fcall(function () { return osobaExists('Autori', prezime, vratiID,retVal); });
                    prom.then(function () { deferred.resolve({ ID: vratiID(), Prezime: retVal() }); }, function () { deferred.reject(); });
 


                    return deferred.promise;
                }

 
                function imePrez (prezime) {
                    //alert('imeprezstart');
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

                    deferred.resolve({ xPre: xPre.trim(), xIme: xIme.trim() });
                   // alert(xPre + 'imepre end');
                    return deferred.promise;
                }


            }


            var createOsoba = function (entity, pojam, ime) {


                return imePrez(pojam)
                    .then(function (imPr) {
                        //alert('IMPR:' + imPr);
                        //console.log( imPr);
                        return vratiObjekt(-1,imPr)
                        .then(function (temp) {
                            //alert("temp: "  + temp.IDT);
                            //console.log(temp);
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
                                //alert('našotemp?' + temp.ID)
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
                          //      alert("sejved");
                                //deferred.resolve({ ID: nIDT + 1, Prezime: xPre, Ime: xIme });
                                deferred.resolve({ ID: nIDT + 1, Prezime: xPre, Ime: xIme });
                            })
                        .fail(
                            function () {
                            //    alert("NOTsejved");
                                deferred.resolve({ ID: nIDT + 1, Prezime: xPre, Ime: xIme });
                        });

                    return deferred.promise;

                }

                function vratiObjekt(nIDT, prezime) {
                     //alert('poceo vartiobjekt');
                    var deferred = Q.defer();
                    var vratiID = ko.observable(-1);
                    var retVal = ko.observable("");
                    var prom = Q.fcall(function () { return osobaExists(entity, prezime, vratiID, retVal); });
                    prom.then(function () { deferred.resolve({ IDT: vratiID(), Pojam: retVal() }); }, function () { deferred.reject(); });



                    return deferred.promise;
                }


                function imePrez(prezime) {
                    //alert('imeprezstart');
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
                    // alert(xPre + 'imepre end');
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
           
                //console.log( prezime);
                //var preIme = imePrez(prezime);
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


            var createTermin = function (entity, pojam, ime) {
            
                return dMax('IDT', ime)
                .then(function (nIDT) {return Q.fcall(function () { return makeItSo(nIDT); })});

                    //                return my.vm.zadnjiIDT + 1;
                    //});

                    //alert(my.vm.zadnjiIDT);
                    function makeItSo(nIDT) {
                        //console.log(my.vm.zadnjiIDT);
                        //alert('createTermin:' + nIDT);
                        //var newCust = my.em.createEntity(entity, { IDT: my.vm.zadnjiIDT + 1, Pojam: pojam });
                        var newCust = my.em.createEntity(entity, { IDT: nIDT + 1, Pojam: pojam });
                        //alert(entity);
                        //console.log(newCust)
                        //my.vm.Selects[ime].push(newCust);
                        my.em.saveChanges();
                        //console.log(my.vm.Selects[ime]);
                        //return Q.fcall(function () { return my.vm.zadnjiIDT + 1; });
                        return { IDT: nIDT + 1, Pojam: pojam }
                    }
                }
        

            var getLocalRefresh = function (brojid,entity) {
                var query = breeze.EntityQuery.from(entity).where('ID_Broj','eq',brojid);


                return my.em.executeQueryLocally(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {

                    return data.results;
                }
                function queryFailed(error) {
                    alert("Query failed: " + error.message);
                }
            }

            var getDijelovi = function () {
                var query = breeze.EntityQuery.from("tbl_T_Dijelovi")


                return my.em.executeQuery(query)
                        .then(querySucceeded)
                        .fail(queryFailed);
                function querySucceeded(data) {

                    my.vm.dijelovi(data.results);
                }
                function queryFailed(error) {
                    alert("Query failed: " + error.message);
                }
            }


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
                        //delJSON(tablica, id);
                        //alert(data.results.length);
                        for (var i = 0; i < data.results.length;i++){
                            data.results[i].entityAspect.setDeleted();
                        }
                    }
                    //data.results[0].hasChangesChanged();

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
                        //delJSON(tablica, id);
                        //alert("delrow");
                        data.results[0].entityAspect.setDeleted();
                    }
                    //data.results[0].hasChangesChanged();

                }
                function queryFailed(error) {
                    alert("Query failed: " + error.message);
                }


            }
  





            setBrojid = function (brojid) {
                return currentBrojid(brojid);
            }


            function setIdentity(brojid, id) {
                alert('pozvano');
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
                            //alert(propertyName);
                            //alert('sadćepozvat' );
                            //alert(entity['ID_Broj']());
                            //alert(entity['AutoBroj']());
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
                    //console.log(xd);
                    var req = $.ajax({
                        type: 'GET',
                        url: adresaAPI + '?sifra=' + sifra + '&pageSize=' + pageSize + '&pageIndex=' + pageIndex,
                        dataType: 'json',
                        //data: xd,// JSON.stringify(redakUpiti),
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


                saveChanges = function () {
                    var ber = Q.defer();
                    //alert("sejvč");
                    my.em.saveChanges().then(function(){ber.resolve(true);}).fail(function (error) { alert("Failed save to server: " + error.message); });
                    return ber.promise;
                }

                saveChangesLimited = function (n) {
                    var ber = Q.defer();
                    my.em.saveChanges(n).then(function () { ber.resolve(true); }).fail(function (error) { alert("Failed save to server: " + error.message); });
                    return ber.promise;
                }

                undoChanges = function () {

                    my.em.rejectChanges();
                }

            var dataService= {
                autori: autori,
                getGrid:getGrid,
                // rezultati: rezultati,
                getFullTblSkp:getFullTblSkp,
                postCreateNoviZapis: postCreateNoviZapis,
                load: load,
                undoChanges:undoChanges,
                createInvBroj:createInvBroj,
                getJson: getJson,
                getJsonPOST: getJsonPOST,
                fullkartica: fullkartica,
                getFullKartica: getFullKartica,
                jedinice: jedinice,
                dijelovi: dijelovi,
                dimenzije: dimenzije,
                selMjere: selMjere,
                selKartica: selKartica,
                currentAutor: currentAutor,
                primeData: primeData,
                getTerminoloskeListe: getTerminoloskeListe,
                getTerminoloske: getTerminoloske,
                getKartica: getKartica,
                getJedinice: getJedinice,
                getDimenzije: getDimenzije,
                getDijelovi: getDijelovi,
                currentBrojid: currentBrojid,
                createMjere: createMjere,
                createZapis: createZapis,
                createTermin: createTermin,
                selIzrada: selIzrada,
                getFullIzrada:getFullIzrada,
                getSel: getSel,
                selMat: selMat,
                selNazivi: selNazivi,
                selNaslovi: selNaslovi,
                selPodOznake:selPodOznake,
                selKljucneRijeci:selKljucneRijeci,
                Selects: Selects,
                SelectsArrays: SelectsArrays,
                getExportFullKartica: getExportFullKartica,
                isLoaded: isLoaded,
                setBrojid: setBrojid,
                getQueryResults:getQueryResults,
                saveChanges: saveChanges,
                getDef: getDef,
                getMjesta: getMjesta,
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
                getTerminoloskeNad: getTerminoloskeNad,
                getMjestaZaTreeView: getMjestaZaTreeView,
                getZbirkeZaTreeView: getZbirkeZaTreeView,
                userName: userName,
                password: password,
                SelectsArrays: SelectsArrays,
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
                getTerminoloskeNad: getTerminoloskeNad,
                createEntityDetatched: createEntityDetatched,
                createEntityBatch: createEntityBatch,
                Vremena: Vremena,
                VrijemeOpis: VrijemeOpis,
                VrijemeJedinica: VrijemeJedinica,
                getZbirka: getZbirka,
                delRowsByID: delRowsByID,
                selSadrzaj: selSadrzaj,
                parametri: parametri,
                //parametriZaKorisnika: parametriZaKorisnika,
                getFullKljucneRijeci: getFullKljucneRijeci,
                getJsonPOSTPager: getJsonPOSTPager,
                getJsonPOSTALT: getJsonPOSTALT,
                getDefForme: getDefForme,
                //protoForme: protoForme,
                //upisiParametar: upisiParametar,
                getJsonPOSTALTNOEF: getJsonPOSTALTNOEF,
                getJsonPOSTPagerNOEF: getJsonPOSTPagerNOEF,
                getJsonTermBucket: getJsonTermBucket,
                getDefNOEF: getDefNOEF,
                getFullInventarizacija: getFullInventarizacija,
                getFullOcuvanost: getFullOcuvanost,
                getJsonPOSTPromijeniIdentity: getJsonPOSTPromijeniIdentity,
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
                getJsonAutocompleteER: getJsonAutocompleteER
            }

            return dataService;
      

        }();
 

    my.em.fetchMetadata().then(my.vm.load());
    
 

 


  

});
return my.vm;
});