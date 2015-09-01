define(['durandal/app', 'services/logger', 'services/dataService'],
    function (app, logger, dataService) {

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
        this.nadIDT = -1;
        this.brojZapisa = -1;
        this.odabrano = false;
        this.checked = ko.observable(false);
    }

    var tmpRedakUpita = ko.observableArray([]);
    var refinersLinkovi= ko.observableArray([]);
 
    var firstLoad= true;
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
        init: init,
        firstLoad:firstLoad,
        fillRefiners:fillRefiners,
        refinersLinkovi:refinersLinkovi,
        refiners: refiners,
        refinerToggle: refinerToggle,
    }



    function  init() {

        if (firstLoad) {

            firstLoad = false;

            var returnValue;
            //refinersi
            dataService.getWebAPISQL(4, -1, returnValue).then(function (b) {
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
                        $.each(tmpRedakUpita(), function (index, rData) {
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


    function fillRefinerSkraceno(refiner,poljeIDT,i) {
        var deferFunc = Q.defer();
        var n=0
        ko.utils.arrayForEach(refiner, function (item) {
                    var rfP = new refinerPodaciModel()
                    rfP.IDT = item.IDT;
                    rfP.nadIDT = poljeIDT;
                    rfP.Pojam = item.Pojam;
                    rfP.brojZapisa = item.brojZapisa;
                    rfP.odabrano = false;
                    rfP.checked(false);
                    $.each(tmpRedakUpita(), function (index, rData) {
                        if (poljeIDT == rData.poljeIDT() && rData.vrijednost2() == item.IDT) {
                            rfP.checked(true);
                        }
                    });
                    n++;
                    if (n == refiner.length - 1) {
                        deferFunc.resolve(true);
                    }
                    refiners()[i].podaci.push(rfP);
                
        })
        return deferFunc.promise;
    }


    function fillRefiners(tmpUpiti) {
        
        tmpRedakUpita(tmpUpiti);

        var deferFunc = Q.defer();
        var lastIndex = refiners().length;

        for (var i = 0; i < lastIndex; i++) {
            refiners()[i].podaci([]);
            fillRefinerSkraceno(refinersLinkovi()[i].podaci,refiners()[i].fieldIDT(),i);
            //refiners()[i].podaci(filRefTemp);
            refiners()[i].recordCount(refinersLinkovi()[i].recordCount);
            if (refiners()[i].recordCount() > 5) {
                refiners()[i].plus10(false);
            }
            if (i == lastIndex - 1) {
                deferFunc.resolve(true);
            }
        }



        //$.each(refiners(), function (index, data) {
        //    data.podaci([]);
        //    data.recordCount(0);
        //    fillRefiner(data);
        //    if (index == lastIndex - 1) {
        //        deferFunc.resolve(true);
        //    }
        //})
        
        return deferFunc.promise;
    }




    function  refinerToggle(data) {
        var tmp = data.plus10();
        var overlay = $(".Overlay");
        data.plus10(!tmp);
        if (data.plus10()) {
            if (data.recordCount() != data.podaci().length) {
                overlay.addClass("visible");
                var retVal;
                dataService.getWebAPISQL(11, data.filter(), retVal).then(
                    function (podaci) {
                        var i = refiners().indexOf(data);
                        refiners()[i].podaci([]);
                        fillRefinerSkraceno(podaci, data.fieldIDT(), i)
                        //fillRefiner(data);
                    })
                    .then(function () {
                        overlay.removeClass("visible");
                    })
            }
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