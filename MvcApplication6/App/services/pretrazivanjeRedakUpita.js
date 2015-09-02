define(['durandal/app', 'services/logger', 'services/dataService', 'plugins/router', 'viewmodels/popupVrijeme', 'viewmodels/popupMjere'],
    function (app, logger, data, router, popupVrijeme, popupMjere) {

    var my = this || {};

    var modalMjere = new popupMjere("Mjere modal");
    var otvoreneMjere = false;
    var redakUpitaModel = function () {
        this.poljeIDT = ko.observable(null);
        this.polje = ko.observable(null);
        this.tablica = ko.observable(null);
        this.vrijednost1 = ko.observable(null);
        this.vrijednost2 = ko.observable(null);
        this.vrijednost3 = ko.observable(null);
        this.vrijednost4 = ko.observable(null);
        this.termTablica = ko.observable(null);
        this.upitOperator = ko.observable("=");
        this.redOperator = ko.observable(' AND ');
        this.operatori = ko.observableArray([]);
        this.combo = ko.observable(1);
        this.podZapisi = ko.observable(false);
        this.vrijemeRedak = ko.observable(null);
        this.mjereRedak = ko.observable(null);
        this.zagradaOtvorena= ko.observable(null);
        this.zagradaZatvorena=ko.observable(null);
    }


    var rowOpenDialog = ko.observable(-1);

    var DaNeOperators = ['DA', 'NE'];

    var redakUpita= ko.observableArray([]);

    var redakKombo= ko.observableArray([]);

    var defStruktura= ko.observableArray([]);
    var polja= ['tbl_Izrada.IZR_IDT_Mjesto', 'tbl_Nazivi.NAZ_IDT_Naziv_predmeta', 'tbl_Inventarizacija.INV_ID_Inventirao'];
    var operatori= ['<', '>', '=', '<=', '=>', 'sadrži'];
    
    var redOperatori = [' AND ', ' OR '];

    var firstLoad= true;

 

    //adresaAPI: 'http://localhost:61950/api/DVALTValuesNOEF',
    //var adresaAPI = 'api/DVALTValuesNOEF';
    var adresaAPI = 'api/WebApiSQL';

    var title = 'Pretraživanje';


    /////////////////////////////////////////////////////////////////////////////počinje VM
    var vm = {
        title: title,

        init: init,

        firstLoad:firstLoad,
        showModalMjere: showModalMjere,
        showModalVrijeme:showModalVrijeme,

        mapRedakUpita: mapRedakUpita,
        setVrijednost: setVrijednost,

        realFakeMjere: popupMjere.realFakeMjere,

        //dodajRedakUpitaRefinerAND: dodajRedakUpitaRefinerAND,
        //dodajRedakUpitaRefinerOR: dodajRedakUpitaRefinerOR,

        dodajRedakUpitaRefiner: dodajRedakUpitaRefiner,

        redakUpita: redakUpita,
        redakKombo: redakKombo,
        promjenaPolja: promjenaPolja,
        changeOperator: changeOperator,

        noviRedak:noviRedak,
        zoviDialog: zoviDialog,

        pripremiRedakZaSpremanje:pripremiRedakZaSpremanje,

        redOperatori: redOperatori,
        provjeriZagrade: provjeriZagrade

    }

    function init() {

        if (firstLoad) {

            firstLoad = false;

            if (modalMjere.firstLoad) {
                modalMjere.init();
            }

            if (popupVrijeme.firstLoad) {
                popupVrijeme.init();
            }


            var returnValue;
            //var pare = ty;
            return data.getWebAPISQL(1, -1, returnValue).then(function (b) {
                defStruktura(b);
            })


        }

    }

    function provjeriZagrade() {
        var zagO = [];
        var brejker = -1;
        var retVal = true;
        ko.utils.arrayForEach(redakUpita(), function (item, index) {
            if (brejker == -1) {
                var numbP = 0;
                var numbM = 0;
                if (item.zagradaOtvorena() == '(') numbP = 1;
                if (item.zagradaOtvorena() == '((') numbP = 2;
                if (item.zagradaOtvorena() == '(((') numbP = 3;

                for (var i = 0; i <= numbP; i++) {
                    zagO.push(index);
                }

                if (item.zagradaZatvorena() == ')') numbM = 1;
                if (item.zagradaZatvorena() == '))') numbM = 2;
                if (item.zagradaZatvorena() == ')))') numbM = 3;
                for (var i = 0; i <= numbM; i++) {
                    if (zagO.length > 0) {
                        zagO.pop();
                    } else {
                        brejker = index;
                        break;
                    }
                }
            }
            $("#zagZ_" + index).css("background-color", "");
            $("#zagO_" + index).css("background-color", "");
        })


        if (brejker > -1) {
            $("#zagZ_" + brejker).css("background-color", "red");
            retVal = false;
        }
        if (zagO.length > 0) {
            for (var i = 0; i <= zagO.length; i++) {
                $("#zagO_" + zagO[i]).css("background-color", "red");
            }
            retVal = false;
        }

        return retVal;
            

    }




 
    function  changeOperator(upitRedak,event) {
        
        index = redakUpita.indexOf(upitRedak);


        if (upitRedak.upitOperator() == "=") {
            if (upitRedak.poljeIDT() != 132) {
                upitRedak.combo(2);
            } else {
                upitRedak.combo(1);
            }
        }

        if (upitRedak.upitOperator() == "sadrži" || upitRedak.upitOperator() == "<" || upitRedak.upitOperator() == ">" || upitRedak.upitOperator() == "<>") {
            upitRedak.combo(1);
        }

        if (upitRedak.upitOperator() == "upisan" || upitRedak.upitOperator() == "pridružena") {
            upitRedak.combo(3);
        }

        //if (data.upitOperator() == "prije" || data.upitOperator() == "poslije" || data.upitOperator() == "između" || VrijemeOperators.indexOf(data.upitOperator())>0) {

        rowOpenDialog(index);
        // alert("changeOperator");
//        upitRedak.vrijednost1(null);
        upitRedak.vrijednost2(null);


        if (upitRedak.poljeIDT() == 9999 || upitRedak.poljeIDT() == 8888) {
            upitRedak.combo(1);
            zoviDialog(index, upitRedak);
        } else {
            upitRedak.vrijednost1(null);
        }
        return true;

    }


    function zoviDialog(index, upitRedak) {
        
        if (upitRedak.poljeIDT() == 9999) {
            //upitRedak.combo(1);
            rowOpenDialog(index);
            if (!popupVrijeme.otvoreno()) {
                showModalVrijeme();
            }
        }
        if (upitRedak.poljeIDT() == 8888) {
            rowOpenDialog(index);
            upitRedak.combo(1);
            if (!modalMjere.otvoreno()) {
                showModalMjere();
            }
            //showModalMjere();
        }
    }

    function showModalVrijeme() {
        
        popupVrijeme.show(redakUpita()[rowOpenDialog()]).then(function (response) {
            popupVrijeme.otvoreno(false);
            if (response) {
                //redakUpita()[rowOpenDialog()](response);
                redakUpita()[rowOpenDialog()] = response;
                if (response['vrijemeRedak']()['IZR_Period']() == 3) {
                    redakUpita()[rowOpenDialog()]['upitOperator']("između");
                }
                
            }
        })
        return true;

    }

    function showModalMjere() {
        if (!otvoreneMjere) {
            otvoreneMjere = true;
            modalMjere.show(redakUpita()[rowOpenDialog()]).then(function (response) {
                modalMjere.otvoreno(false);
                otvoreneMjere = false;
                if (response) {
                    redakUpita()[rowOpenDialog()] = response;
                }
            })
        }
    }


    function mapRedakUpita(inputData) {

        
        var defStrukturaRedak = ko.utils.arrayFirst(defStruktura(), function (item) {
            return item.IDT === inputData.poljeIDT;
        })
        var redakUpitaEx = new redakUpitaModel();

        var operatori = defStrukturaRedak.Napomena.split(";");
        var testOperatori = ko.observableArray([]);

        $.each(operatori, function (index, data) {
            testOperatori.push(data);
        })

        if (testOperatori() != redakUpitaEx.operatori()) {
            redakUpitaEx.operatori(testOperatori());
        }


        redakUpitaEx.combo(inputData.combo);
        redakUpitaEx.poljeIDT(inputData.poljeIDT);
        redakUpitaEx.polje(inputData.polje);
        redakUpitaEx.tablica(inputData.tablica);
        redakUpitaEx.vrijednost1(inputData.vrijednost1);
        redakUpitaEx.vrijednost2(inputData.vrijednost2);
        redakUpitaEx.vrijednost3(inputData.vrijednost3);
        redakUpitaEx.vrijednost4(inputData.vrijednost4);

        if (redakUpitaEx.combo() == 2 && typeof redakUpitaEx.vrijednost2() != "number") {
            //alert("null nema kajsadovo?");
            redakUpitaEx.vrijednost2(null);
        }

        if (defStrukturaRedak.T_Tbl) {
            redakUpitaEx.termTablica(defStrukturaRedak.T_Tbl);
        } else {
            redakUpitaEx.termTablica("tbl_T_Zbirke");
        }

        redakUpitaEx.upitOperator(inputData.upitOperator);
        redakUpitaEx.redOperator(inputData.redOperator);
        redakUpitaEx.podZapisi(inputData.podZapisi);
        redakUpitaEx.zagradaOtvorena(inputData.zagradaOtvorena || null);
        redakUpitaEx.zagradaZatvorena(inputData.zagradaZatvorena || null);

        redakUpitaEx.vrijemeRedak(null);
        if (inputData.vrijemeRedak != undefined && inputData.vrijemeRedak != null && inputData.vrijemeRedak != "" && inputData.vrijemeRedak != "null") {
            redakUpitaEx.vrijemeRedak(popupVrijeme.mapVrijemeRedak(inputData.vrijemeRedak));
        }

        redakUpitaEx.mjereRedak(null);
        if (inputData.mjereRedak != undefined && inputData.mjereRedak != null && inputData.mjereRedak != "" && inputData.mjereRedak != "null") {
            redakUpitaEx.mjereRedak(modalMjere.mapMjereRedak(inputData.mjereRedak));
        }


        return redakUpitaEx;

    }


    function  pripremiRedakZaSpremanje(){
        var nx = ko.observableArray([]);

        $.each(redakUpita(), function (index, data) {
            var z = mapRedakUpita(ko.toJS(data));
            //new redakUpitaModel();
            z.vrijemeRedak(ko.toJSON(data.vrijemeRedak()));
            z.mjereRedak(ko.toJSON(data.mjereRedak()));


            if (!data.vrijednost1() && (!data.vrijednost2() || typeof data.vrijednost2()!="number") && data.upitOperator() != 'upisan' && data.upitOperator() != 'pridružena') {
                //console.log("nnn");  ne pretražuj
            } else {
                nx.push(z);
            }
        })
        //$.each(nx(), function (index, data) {
        //    data.term(null);
        //});
        if (nx().length == 0) {
            var z = new redakUpitaModel();
            z.polje("KRT_Inventarni_broj");
            z.poljeIDT(132);
            z.vrijednost1("xyzxyz999");
            z.vrijednost2(null);
            z.vrijednost3(null);
            z.vrijednost4(null);
            z.tablica("tbl_Kartica");
            z.upitOperator("=");
            z.podZapisi(false);
            z.combo(1);
            z.vrijemeRedak(null);
            z.mjereRedak(null);
            nx.push(z);
        }


        //var t1 = ko.observable();
        //t1({ 'staraSifra': opisUpita(), 'pageSize': recordCount(), 'upiti': nx });
        //var xd = ko.toJSON(t1);
        
        return nx;
    }


    function  brisiRedak(tada) {
        redakUpita.remove(tada);
    }

    function  ReplaceStuff (tekst) {
        var tekst2 = tekst.replace(/\r\n/g, '<br/>');
        return tekst2;
    }

    function noviRedak(inputData) {

        var index = redakUpita.indexOf(inputData);
        var redakUpitaNew = new redakUpitaModel()
        redakUpitaNew.upitOperator("=");
        redakUpitaNew.vrijednost1(null);
        redakUpitaNew.vrijednost2(null);
        redakUpitaNew.vrijednost3("NE");
        redakUpitaNew.vrijednost4(null);
        redakUpitaNew.redOperator(' AND ');
        redakUpitaNew.combo(2);

        redakUpita.splice(index + 1, 0, redakUpitaNew);
        
        promjenaPolja(0, redakUpitaNew);
        
    }





    function changeRedoperator(data, event) {
 
        data.redoOperator(event.currentTarget.checked);
        return true;
    }

    function changePod(data, event) {
        data.podZapisi(event.currentTarget.checked);
        return true;
    }

    function  promjenaPolja(index,tmpRedakUpita,vrijednost2) {
        //console.log(tada);
        var ferd = Q.defer()
        
        if (!tmpRedakUpita) {
            ferd.resolve(false);
        } else {

            var defStrukturaRedak = ko.utils.arrayFirst(defStruktura(), function (item) {
                return item.IDT === tmpRedakUpita.poljeIDT();
            })


            var tablicaDef = defStrukturaRedak.T_Tbl;

            tmpRedakUpita.tablica(defStrukturaRedak.Tablica);
            tmpRedakUpita.polje(defStrukturaRedak.Naziv);
            //redakUpita.operatori([]);

            var operatori = defStrukturaRedak.Napomena.split(";");
            var testOperatori = ko.observableArray([]);

            $.each(operatori, function (index, data) {
                testOperatori.push(data);
            })

            if (testOperatori() != tmpRedakUpita.operatori()) {
                tmpRedakUpita.operatori(testOperatori());
                tmpRedakUpita.operatori.valueHasMutated();
            }




            tmpRedakUpita.vrijednost2(vrijednost2 || null);
            tmpRedakUpita.vrijednost4(null);
            tmpRedakUpita.vrijemeRedak(null);
            tmpRedakUpita.mjereRedak(null);

            if (defStrukturaRedak.T_Tbl) {
                tmpRedakUpita.termTablica(defStrukturaRedak.T_Tbl);
                //$("#redakUpita_" + index)
            } else {
                tmpRedakUpita.termTablica("tbl_T_Zbirke");
            }
            // alert("changePolje");
            if (tmpRedakUpita.poljeIDT() == 8888) {
                rowOpenDialog(index());
                showModalMjere();
            }
            //zoviDialog(index(), redakUpita);
            //redakUpita.valueHasMutated();
            // changeOperator(index, redakUpita);
            ferd.resolve(true);
        }
        return ferd.promise;
    }


 



    function dodajRedakUpitaRefiner(odabraniRefiner, operator) {


        //var odabraniRefinerNad = ko.utils.arrayFirst(refiners(), function (item) {
        //    return item.filter() === odabraniRefiner.kategorija;
        //})

        var defStrukturaRedak = ko.utils.arrayFirst(defStruktura(), function (item) {
            //return item.IDT === odabraniRefinerNad.fieldIDT();
            return item.IDT === odabraniRefiner.nadIDT;
        })

        var noviRedakUpita = new redakUpitaModel();

        noviRedakUpita.poljeIDT(odabraniRefiner.nadIDT);
        
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


    function  setVrijednost(pocetnaZbirka) {
        //console.log(data.defStruktura());
        redakKombo([]);
        redakKombo(defStruktura);

        var ferd = Q.defer()
        var xupit = new redakUpitaModel()
        xupit.combo(2);
        xupit.podZapisi(false);
        xupit.vrijednost1(null);
        xupit.vrijednost2(pocetnaZbirka || null);
        xupit.vrijednost3(null);
        xupit.vrijednost4(null);
        xupit.upitOperator("=");
        xupit.operatori(["=","<>"]);//.push("=");
        xupit.polje("KRT_IDT_Zbirka");
        xupit.poljeIDT(131);
        xupit.tablica("tbl_Kartica");
        xupit.termTablica("tbl_T_Zbirke");
        redakUpita.push(xupit);

        ferd.resolve(xupit);

        return ferd.promise;
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