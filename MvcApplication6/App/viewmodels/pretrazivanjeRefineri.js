define(['durandal/app', 'services/logger', 'services/dataService'],
    function (app, logger, data) {

    var my = this || {};

    var refinerModel = function (title, filter, template, imaFokus, odabrano, recordCount, fieldIDT) {
        this.title = ko.observable(title);
        this.filter = ko.observable(filter);
        this.template = ko.observable(template);
        this.imaFokus = ko.observable(imaFokus);
        this.odabrano = ko.observable(odabrano);
        this.recordCount = ko.observable(recordCount);
        this.fieldIDT = ko.observable(fieldIDT);
        this.podaci = ko.observableArray([]);
        this.plus10 = ko.observable(false);
        this.cont = ko.observable(true);
    }



    var refinerPodaciModel = function () {
        this.kategorija = '';
        this.Pojam = '';
        this.IDT = -1;
        this.brojZapisa = -1;
        this.odabrano = false;
        this.checked = ko.observable(false);
    }




    var firstPass = true;


    var refinersLinkovi= ko.observableArray([]);
 
    var firstload= true;
    var refiners= ko.observableArray([]);


    var searchHistoryOpened= ko.observable(false);
    var myMessage = ko.observable("Spremljeni upiti"); // Initially blank

    //adresaAPI: 'http://localhost:61950/api/DVALTValuesNOEF',
    //var adresaAPI = 'api/DVALTValuesNOEF';
    var adresaAPI = 'api/WebApiSQL';

    var title = 'Pretraživanje - Refiners';
    var testTablica = ko.observable("tbl_T_Mjesta");
    var jqAS = ko.observableArray([]);
    function chTab() {
         testTablica("tbl_T_Nazivi");
    }
    /////////////////////////////////////////////////////////////////////////////počinje VM
    var vm = {
        jqAS:jqAS,
        chTab:chTab,
        title: title,
        activate: activate,


        refiners: refiners,
        dodajRedakUpitaRefinerAND: dodajRedakUpitaRefinerAND,
        dodajRedakUpitaRefinerOR: dodajRedakUpitaRefinerOR,
        refinerToggle: refinerToggle,

    }



    function  activate() {

        if (firstPass) {

            firstPass = false;


            //refinersi
            data.getWebAPISQL(4, -1, returnValue).then(function (b) {
                //getDefRefNOEF().then(function (b) {
                $.each(b, function (i, p) {
                    var tmpRefiner = new refinerModel(p['title'], p['filter'], p['template'], false, 0, 0, p['fieldIDT']);
                    refiners.push(tmpRefiner);
                })
            })
        }
            
    }


    function fillRefiner(refiner) {
        // console.log(refinersLinkovi());
        var deferFunc = Q.defer();
        var tmpPlus10=refiner.plus10();
        var brojZapisa = 5;
        if (refiner.recordCount() > 0) {
            if (refiner.recordCount() != refiner.podaci().length && refiner.plus10()) {
                brojZapisa = refiner.recordCount();
            } else {
                deferFunc.resolve(true);
                return deferFunc.promise;
            }
        }

            var xtemp = ko.observableArray([]);
            var i = 0;
            var tmpData = ko.utils.arrayFilter(refinersLinkovi(), function (item) {
                return item.kategorija === refiner.filter();
            })

            ko.utils.arrayForEach(tmpData, function (item) {
                
                if (i < brojZapisa) {
                    if (item.kategorija === refiner.filter()) {
                        var rfP = new refinerPodaciModel()
                        
                        rfP.IDT = item.IDT;
                        rfP.kategorija = item.kategorija;
                        rfP.Pojam = item.Pojam;
                        rfP.brojZapisa = item.brojZapisa;
                        rfP.odabrano = false;
                        rfP.checked(false);
                        $.each(redakUpita(), function (index, rData) {
                            if (refiner.fieldIDT() == rData.poljeIDT() && rData.vrijednost2() == item.IDT) {
                                rfP.checked(true);
                            }
                        });
                        xtemp().push(rfP);
                    };
                }
                i++;

                if (i == tmpData.length ) {
                    refiner.podaci(xtemp());
                    refiner.recordCount(tmpData.length);
                    deferFunc.resolve(true);
                }
            })
        return deferFunc.promise;
     }

    function fillRefiners() {
        
        var deferFunc = Q.defer();
        var lastIndex = refiners().length;

        $.each(refiners(), function (index, data) {
            data.podaci([]);
            data.recordCount(0);
            fillRefiner(data);
            if (index == lastIndex - 1) {
                deferFunc.resolve(true);
            }
        })
        
        return deferFunc.promise;
    }


    function  refinerToggle(data) {
        var tmp = data.plus10();
        var overlay = $(".Overlay");
        data.plus10(!tmp);
        if (data.plus10()) {
            overlay.addClass("visible");
            fillRefiner(data)
                .then(function () {
                    overlay.removeClass("visible");
                })
        }
        return true;
    }

 
    function dodajRedakUpitaRefinerOR(odabraniRefiner, event) {
        event.stopPropagation();
        odabraniRefiner.checked(!odabraniRefiner.checked());
        zapamtiRefiner = odabraniRefiner.IDT + '%' + odabraniRefiner.kategorija;

        dodajRedakUpitaRefiner(odabraniRefiner, " OR ");
    
        return true;
    }

    function dodajRedakUpitaRefinerAND(odabraniRefiner, event) {

        //odabraniRefiner.checked(!odabraniRefiner.checked());
        zapamtiRefiner = odabraniRefiner.IDT + '%' + odabraniRefiner.kategorija;

        dodajRedakUpitaRefiner(odabraniRefiner, " AND ");

        pretrazi();

        return true;
    }



    function dodajRedakUpitaRefiner(odabraniRefiner, operator) {


        var odabraniRefinerNad = ko.utils.arrayFirst(refiners(), function (item) {
            return item.filter() === odabraniRefiner.kategorija;
        })

        var defStrukturaRedak = ko.utils.arrayFirst(defStruktura(), function (item) {
            return item.IDT === odabraniRefinerNad.fieldIDT();
        })

        var noviRedakUpita = new redakUpitaModel();

        noviRedakUpita.poljeIDT(odabraniRefinerNad.fieldIDT());
        
        noviRedakUpita.combo(2);
        noviRedakUpita.vrijednost2(odabraniRefiner['IDT']);//alert(tada.poljeIDT());

        noviRedakUpita.tablica(defStrukturaRedak.Tablica);
        noviRedakUpita.polje(defStrukturaRedak.Naziv);

        noviRedakUpita.operatori([]);
        var operatori = defStrukturaRedak.Napomena.split(";");
        $.each(operatori, function (index, data) {
            noviRedakUpita.operatori.push(data);
        })

        if (defStrukturaRedak.T_Tbl) {
            noviRedakUpita.termTablica(defStrukturaRedak.T_Tbl);
        } else {
            noviRedakUpita.termTablica("tbl_T_Zbirke");
        }

        noviRedakUpita.redOperator(operator);


        var zaBrisanjeAkoVecPostoji = false;
        if (zaBrisanjeAkoVecPostoji) {
            var zzz = ko.utils.arrayFirst(redakUpita(), function (item) {
                return item.poljeIDT() == noviRedakUpita.poljeIDT() && item.vrijednost2() == noviRedakUpita.vrijednost2();
            })

            var indexUpita = redakUpita.indexOf(zzz);
            if (indexUpita > -1) {
                redakUpita.splice(indexUpita, 1);
            } else {
                redakUpita.push(noviRedakUpita);
            }
        } else {
            redakUpita.push(noviRedakUpita);
        }

        return true;
    }




    











    function  makniCrticu(x) {
        var tmp = "";
        if (x) {
            tmp = x.trim();
            if (tmp.charAt(tmp.length - 1) == '-') {
                tmp = tmp.substr(0, tmp.length - 2);
            }
        }
        return tmp;
    }






    return vm;

    
});