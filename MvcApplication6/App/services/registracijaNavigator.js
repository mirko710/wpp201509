define(['services/dataService'],
    function (data) {

        var recIndex = ko.observable(88);
        var recMax = ko.observable(99);
        var zbIndex = ko.observable(45);
        var podaciZaRegistraciju = ko.observableArray([]);
        var currentIDBroj = ko.observable(99);
        var ulazIDBroj = ko.observable(99);
        var currentZbirkaIDT=ko.observable(99);
        var firstLoad = true;
        var registracijaNavigator = {
            init:init,
            recIndex: recIndex,
            regPrev: regPrev,
            regNext:regNext,
            recMax: recMax,
            zbIndex: zbIndex,
            ulazIDBroj: ulazIDBroj,
            firstLoad:firstLoad,
            podaciZaRegistraciju: podaciZaRegistraciju,
            navigacijaZaRegistracijuSifra: navigacijaZaRegistracijuSifra,
            navigacijaZaRegistraciju: navigacijaZaRegistraciju,
            //refreshNavigacijuZaRegistraciju: refreshNavigacijuZaRegistraciju
        }

        return registracijaNavigator;


        function init() {
            if (firstLoad) {
                ulazIDBroj.subscribe(function (newValue) {
                    if (newValue != currentIDBroj()) {
                        promjenaPoIDBroju().then(function () {
                            currentIDBroj(ulazIDBroj());
                        })
                    }


                    //postaviNaZapis();
                })
                firstLoad = false;
            }
        }


        function findIndex(brojid) {
            var tmpIndex = -1;
            if (podaciZaRegistraciju().length > 0) {
                var nadjeno = ko.utils.arrayFirst(podaciZaRegistraciju()[0].realData(), function (item) {
                    return item.ID_Broj == brojid;
                })
                if (nadjeno) {
                    tmpIndex = podaciZaRegistraciju()[0].realData().indexOf(nadjeno);
                }
            }

            return tmpIndex;
        }

        function promjenaPoIDBroju() {

            var feder = Q.defer();
            var tmpIndex = findIndex(ulazIDBroj());

            if (tmpIndex < 0) {
                data.getZbirka(ulazIDBroj()).then(function (promjenaZbirke) {
                    currentZbirkaIDT(promjenaZbirke);
                    navigacijaZaRegistraciju(promjenaZbirke).then(function () {
                        podaciZaRegistraciju()[0].sync(ulazIDBroj());
                        feder.resolve(true);
                    })
                })
            } else {
                podaciZaRegistraciju()[0].sync(ulazIDBroj());
                feder.resolve(true);
            }


            return feder.promise;


        }


        function regPrev() {
            var ber = Q.defer();
            podaciZaRegistraciju()[0].movePrevNotPerfect().then(function (retVal) {
                ber.resolve(retVal)
            })
            return ber.promise;
        }


        function regNext() {

            var ber = Q.defer();
            podaciZaRegistraciju()[0].moveNextNotPerfect().then(function (retVal) {
                ber.resolve(retVal)
            })
            return ber.promise;
        }

        function newNavModel() {
            var that = {};
            //imaDataciju] [bit],[imaFotku] [bit],[imaAutora] [bit],[imaMjesta] [bit],[imaNaziv] [bit],[imaNaslov] [bit],[imaMjera] [bit],[imaMaterijala] [bit])
            that.pozicija = ko.observable(0);
            that.imePolja = ['imaDataciju', 'imaFotku', 'imaAutora', 'imaMjesta', 'imaNaziv', 'imaNaslov', 'imaMjera', 'imaMaterijala'];
            that.imeLabel = ['Datacija', 'Fotografija', 'Autor', 'Mjesto', 'Naziv', 'Naslov', 'Mjere', 'Materijal'];
            that.imeTmpl = ['tmpIzrada', 'tmpMedia', 'tmpIzrada', 'tmpIzrada', 'tmpNazivi', 'tmpNaslovi', 'tmpMjere', 'tmpMaterijali'];
            that.imeFld = ['inputVrijeme_', 'imaFotku', 'selectAutor_', 'inputMjesto_', 'imaNaziv', 'imaNaslov', 'imaMjera', 'imaMaterijala'];
            that.counters = [];
            that.cUkupno = ko.observable(0);
            that.cPerfect = ko.observable(0);

            that.movePozicija = function (x) {

                if (that.pozicija() + x < that.cUkupno() && that.pozicija() + x > -1) {
                    var tmp = that.pozicija();
                    tmp = tmp + x;

                    that.pozicija(tmp);
                }
            }

            that.sync = function (x) {
                //alert(x);
                var tmp = 0;

                while (that.realData()[tmp]['ID_Broj'] != x && tmp < that.cUkupno() - 1) {

                    tmp++;
                }


                if (tmp < that.cUkupno() && tmp > -1) {
                    that.pozicija(tmp);
                }
                return that.realData()[tmp]['ID_Broj'];
            }


            that.movePrevNotPerfect = function () {
                var ber = Q.defer();
                var tmp = that.pozicija() - 1;
                //alert(that.realData()[tmp][x]);
                while ((that.realData()[tmp].imaMaterijala && that.realData()[tmp].imaMjera && that.realData()[tmp].imaNaslov && that.realData()[tmp].imaNaziv && that.realData()[tmp].imaFotku && that.realData()[tmp].imaDataciju) && (tmp > 0)) {
                    //if ((that.realData()[tmp].imaMaterijala && that.realData()[tmp].imaMjera && that.realData()[tmp].imaNaslov && that.realData()[tmp].imaNaziv && that.realData()[tmp].imaFotku && that.realData()[tmp].imaDataciju)) {
                    //if (that.realData()[tmp][x]);
                    tmp--;
                    //};
                }

                if (tmp < that.cUkupno() && tmp > -1) {
                    that.pozicija(tmp);
                    ber.resolve(that.realData()[tmp]['ID_Broj']);
                }
                return ber.promise;
            }

            that.moveNextNotPerfect = function () {
                var ber = Q.defer();
                var tmp = that.pozicija() + 1;
                var nextNotPerfect=true;
                //alert(that.realData()[tmp][x]);
                while (nextNotPerfect && (tmp < that.cUkupno() - 1)) {
                    nextNotPerfect = (that.realData()[tmp].imaMaterijala && that.realData()[tmp].imaMjera && that.realData()[tmp].imaNaslov && that.realData()[tmp].imaNaziv && that.realData()[tmp].imaFotku && that.realData()[tmp].imaDataciju);
                    //if ((that.realData()[tmp].imaMaterijala && that.realData()[tmp].imaMjera && that.realData()[tmp].imaNaslov && that.realData()[tmp].imaNaziv && that.realData()[tmp].imaFotku && that.realData()[tmp].imaDataciju)) {
                    //if (that.realData()[tmp][x]);
                    tmp++;
                    //};
                }


                if (tmp < that.cUkupno() && tmp > -1) {
                    that.pozicija(tmp);
                    ber.resolve(that.realData()[tmp]['ID_Broj']);
                }
                return ber.promise;
            }

            that.moveNext = function (x) {
                //alert(x);
                var tmp = that.pozicija() + 1;
                //alert(that.realData()[tmp][x]);
                while (that.realData()[tmp][x] && tmp < that.cUkupno() - 1) {
                    //if (that.realData()[tmp][x]);
                    tmp++;
                }


                if (tmp < that.cUkupno() && tmp > -1) {
                    that.pozicija(tmp);
                }
                return that.realData()[tmp]['ID_Broj'];
            }

            that.realData = ko.observableArray();
            return that;
        }


        function navigacijaZaRegistracijuSifra() {
  
            var url = 'api/WebApiSQL';
            var returnVal = ko.observableArray([]);
            var ber = Q.defer();
  

            data.getWebAPISQL(7,-1, returnVal)
                .then(function (response) {

                    var bar = Q.defer();
                    getRegistracijaPodaci(response).then(function () {
                        bar.resolve(true);
                    })

                    return bar.promise;



                }).then(function () { ber.resolve(true); });
            return ber.promise;

        }


        function navigacijaZaRegistraciju(zbirka) {

            var url = 'api/WebApiSQL';
            var returnVal = ko.observableArray([]);
            var ber = Q.defer();


            data.getWebAPISQL(9, zbirka, returnVal)
                .then(function (response) {

                    var bar = Q.defer();
                    getRegistracijaPodaci(response).then(function () {
                        bar.resolve(true);
                    })

                    return bar.promise;



                }).then(function () { ber.resolve(true); });
            return ber.promise;

        }




        function OLDnavigacijaZaRegistraciju(zbirka) {
            //alert('ffgf');
            var url = 'api/NavigacijaPlus';
            var ber = Q.defer();


            $.ajax({
                type: 'POST',
                url: url,
                dataType: 'json',
                //int nID, String arrParamPolje, string sNazivPolja, string sKategorija, string vVrstaOdgovornosti, Boolean B_PREZIME_IME,int L_SORT_IZRADA
                data: JSON.stringify({ 'zbirka': zbirka }),// JSON.stringify({ 'nID': '117', 'arrParamPolje': 'r#,{razmak}#{NoviRed}#r#r#r#r#r#r#r#r#r#r#r#r#r#r#r#r', 'sNazivPolja': 'IZR_IDT_Mjesto_Pojam', 'sKategorija': 'ktg_osb', 'vVrstaOdgovornosti': 'hhh', 'B_PREZIME_IME': true, 'L_SORT_IZRADA': 1 }),
                contentType: 'application/json',
            }).success(function (response, text) {

             
                getRegistracijaPodaci(response).then(function () {
                     ber.resolve(true);
                })

               


            })

            return ber.promise;

        }

        function getRegistracijaPodaci(response) {
            var bar = Q.defer();
            var d = new ko.observableArray([]);
            var c = new newNavModel();
            c.realData(response);
            c.cUkupno(response.length);
            var cDat;
            //imaDataciju] [bit],[imaFotku] [bit],[imaAutora] [bit],[imaMjesta] [bit],[imaNaziv] [bit],[imaNaslov] [bit],[imaMjera] [bit],[imaMaterijala] [bit])
            for (var i = 0; i < c.imePolja.length; i++) {

                cDat = ko.utils.arrayFilter(c.realData(), function (item) {
                    return item[c.imePolja[i]];
                });

                c.counters[c.imePolja[i]] = cDat.length;

            }

            cDat = ko.utils.arrayFilter(c.realData(), function (item) {
                return item.imaMaterijala && item.imaMjera && item.imaNaslov && item.imaNaziv && item.imaFotku && item.imaDataciju;
            });
            c.cPerfect(cDat.length);


            d.push(c);

            podaciZaRegistraciju(d());
            if (d().length > 0) {
                bar.resolve(true);
            }

            return bar.promise;
        }

    });