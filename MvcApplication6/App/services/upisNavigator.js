define(['services/dataService', 'services/registracijaNavigator'],
    function (data,regNav) {


        var firstLoad = true;
        
        var ulazIDBroj = ko.observable(88);
        var currentIDBroj = ko.observable(88);

        var currentZbirkaIDT = ko.observable(88);
        var ulazZbirkaIDT = ko.observable(88);

        var ulazSifraUpita = ko.observable(88);
        var currentSifraUpita = ko.observable(88);

        var forceSrediZbirka = ko.observable(false);

        //1 zbirka
        //2 upit
        var currentMode = 1;

        var recIndex = ko.observable(88);
        var recMax = ko.observable(99);


        var selZaKomboOdabirInvBroja = ko.observableArray([]);
        var internalNavigator = ko.observableArray([]);
        var forceSrediZbirka = ko.observable(true);
        var manualNav = false;

        var upisNavigator = {
            selZaKomboOdabirInvBroja:selZaKomboOdabirInvBroja,
            recIndex: recIndex,
            recMax: recMax,
            currentZbirkaIDT:currentZbirkaIDT,
            firstLoad:firstLoad,
            ulazIDBroj: ulazIDBroj,
            ulazSifraUpita: ulazSifraUpita,
            init: init,
            navFirst: navFirst,
            navLast: navLast,
            navPrev: navPrev,
            navNext: navNext,
            forceRefreshPoIDBroju:forceRefreshPoIDBroju
        };
       // data.navigacijaIzPretrazivanja() == "-1")
        return upisNavigator;

        function init() {
            if (firstLoad) {

                ulazIDBroj.subscribe(function (newValue) {
                    if (newValue != currentIDBroj()) {
                        promjenaPoIDBroju().then(function(){
                            currentIDBroj(ulazIDBroj());
                        })
                    }
                    ///
                })

                ulazZbirkaIDT.subscribe(function (newValue) {
                    ///
                    if (newValue != currentZbirkaIDT()) {
                        promjenaPoIDZbirci();
                    }

                })
                ulazSifraUpita.subscribe(function (newValue) {
                    ///
                    if (newValue != currentSifraUpita()) {
                        promjenaPoSifriUpita();
                    }

                })

                firstLoad = false;
            }
        }


        function findIndex(brojid) {
            var tmpIndex = -1;
            var nadjeno = ko.utils.arrayFirst(internalNavigator(), function (item) {
                return item.ID_Broj == brojid;
            })
            if (nadjeno) {
                tmpIndex = internalNavigator.indexOf(nadjeno);
            }

            return tmpIndex;
        }





        function forceRefreshPoIDBroju() {

            var feder = Q.defer();
            //var tmpIndex = findIndex(ulazIDBroj());

            //if (tmpIndex < 0) {
                data.getZbirka(currentIDBroj()).then(function (promjenaZbirke) {
                    currentZbirkaIDT(promjenaZbirke);
                    data.getNavRecords(promjenaZbirke, internalNavigator).then(function () {
                        recIndex(findIndex(currentIDBroj()));
                        recMax(internalNavigator().length);
                        selZaKomboOdabirInvBroja(internalNavigator());
                        feder.resolve(true);
                    })
                })
            //} else {
            //    recIndex(tmpIndex);
            //    feder.resolve(true);
           // }


            return feder.promise;


        }



        function promjenaPoIDBroju() {

            var feder = Q.defer();
            var tmpIndex = findIndex(ulazIDBroj());

            if (tmpIndex < 0) {
                data.getZbirka(ulazIDBroj()).then(function (promjenaZbirke) {
                    currentZbirkaIDT(promjenaZbirke);
                    data.getNavRecords(promjenaZbirke, internalNavigator).then(function () {
                        recIndex(findIndex(ulazIDBroj()));
                        recMax(internalNavigator().length);
                        selZaKomboOdabirInvBroja(internalNavigator());
                        feder.resolve(true);
                    })
                })
            } else {
                recIndex(tmpIndex);
                feder.resolve(true);
            }


            return feder.promise;


        }


        function promjenaPoSifriUpita() {
            if (currentMode == 1) {
                currentMode = 2;
            }
            //puniNavigator
            //postavi prvi ili 

        }

        function setupNavigator() {


        }


        function srediZbirku() {

            if (fullKartica()[0]['KRT_IDT_Zbirka']() != zbNewIndex() || forceSrediZbirka()) {

                zbNewIndex(fullKartica()[0]['KRT_IDT_Zbirka']());
                if (data.navigacijaIzPretrazivanja() == "-1") {
                    navigacijaZaRegistraciju(fullKartica()[0]['KRT_IDT_Zbirka']())
                    .then(function () {
                        return data.getNavRecords(zbNewIndex(), selZaKomboOdabirInvBroja)
                            .then(function () {
                                recMax(selZaKomboOdabirInvBroja().length);
                                recIndex(findFirst(selZaKomboOdabirInvBroja(), currentBrojid()));

                                podaciZaRegistraciju()[0].sync(currentBrojid());
                                isLoading(false);
                                forceSrediZbirka(false);
                            })
                    })


                } else {
                    navigacijaZaRegistracijuSifra()

                    .then(function () {
                        return data.getNavRecordsUpit(selZaKomboOdabirInvBroja)
                            .then(function () {
                                recMax(selZaKomboOdabirInvBroja().length);
                                recIndex(findFirst(selZaKomboOdabirInvBroja(), currentBrojid()));
                                podaciZaRegistraciju()[0].sync(currentBrojid());
                                isLoading(false);
                                forceSrediZbirka(false);
                            })
                    })
                }
                //    data.getNavRecords(zbIndex(), selZapisi).then(function () { recMax(selZapisi().length); });
                //}

                //data.getNavRecords(zbNewIndex(), selZapisi).then(function () { recMax(selZapisi().length); recIndex(findFirst(selZapisi(), currentBrojid())); cTest()[0].sync(currentBrojid()); });
            } else {

                if (podaciZaRegistraciju()[0].realData()[podaciZaRegistraciju()[0]['pozicija']()]['ID_Broj'] != currentBrojid()) { podaciZaRegistraciju()[0].sync(currentBrojid()); };
                isLoading(false);
                forceSrediZbirka(false);
            }
        }



        function navFirst() {
            var feder = Q.defer();
            manualNav = true;
            recIndex(0);
            var tmpBrojid = internalNavigator()[recIndex()]['ID_Broj'];
            currentIDBroj(tmpBrojid);
            feder.resolve(tmpBrojid);
            return feder.promise;
        };

        function navLast() {

            var feder = Q.defer();
            manualNav = true;
            recIndex(recMax() - 1);
            var tmpBrojid = internalNavigator()[recIndex()]['ID_Broj'];
            currentIDBroj(tmpBrojid);
            feder.resolve(tmpBrojid);
            return feder.promise;
        }

        function navPrev() {
            var feder = Q.defer();
            if (recIndex() > 0) {
                var tmp = recIndex();

                tmp--;
                recIndex(tmp);
                manualNav = true;
                var tmpBrojid = internalNavigator()[recIndex()]['ID_Broj'];
                currentIDBroj(tmpBrojid);
                if (manualNav) {
                    while (currentIDBroj() != internalNavigator()[recIndex()]['ID_Broj']) {
                        alert("rutzmanuva" + manualNav);
                    }
                    feder.resolve(tmpBrojid);
                }
                if (!manualNav) {
                    console.log("GOTOFrutzmanuva");
                    feder.resolve(tmpBrojid);
                }

            } else {
                feder.resolve(-1);
            }
            return feder.promise;
        }

        function navNext() {
            var feder = Q.defer();
            if (recIndex() < recMax()-1) {
                var tmp = recIndex();
                tmp++;
                recIndex(tmp);
                var tmpBrojid = internalNavigator()[recIndex()]['ID_Broj'];
                manualNav = true;
                currentIDBroj(tmpBrojid);
                feder.resolve(tmpBrojid);
                //activate(selZapisi()[recIndex()]['ID_Broj']);
            } else {
                feder.resolve(currentIDBroj());
            }
            return feder.promise;
        }



        function komboZbirkaChanged() {
            var berko = zbNewIndex();
            zbNewIndex(-1);
            //alert(zbNewIndex());
            forceSrediZbirka(true);
            //delayChange().then(function () { zbIndex(berko); });
            zbIndex(berko);

        };



        function delayChange() {
            var ber = Q.defer();
            Q.delay(1000);
            if (zbNewIndex() == -1) {
                ber.resolve(true);
            } else {
                zbNewIndex(-1);
                ber.resolve(true);
            };
            return ber.promise;
        };


    });