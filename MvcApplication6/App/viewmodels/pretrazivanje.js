define(['durandal/app', 'services/logger', 'services/dataService', 'plugins/router', 'viewmodels/popupVrijeme', 'viewmodels/popupMjere'],
    function (app, logger, data, router, popupVrijeme, popupMjere) {

    var my = this || {};

    var modalMjere = new popupMjere("Mjere modal");

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

    var refinerPodaciModel = function () {
        this.kategorija = '';
        this.Pojam = '';
        this.IDT = -1;
        this.brojZapisa = -1;
        this.odabrano = false;
        this.checked = ko.observable(false);
    }




    var saveUpitModel = function () {
        var that = this;
        that.ID =-1;
        that.sifra = "";
        that.ime = "";
        that.opis = "";
        that.redoviUpita = [];
    }

    var odabranUpitID=ko.observable(-1);
    var test= ko.observable(false);
    var rowOpenDialog = ko.observable(-1);

    var firstPass = true;

    var brojOdabranih=ko.observable();
    var zoomItem= ko.observable();


    var promjenaMenuUpiti= ko.observable(0);
    var upitiMenu= [{ ID: 1, label: 'Novi' }, { ID: 2, label: 'Briši' }, { ID: 3, label: 'Save as...' }, { ID: 4, label: 'Spremi' }];
    var Dimenzije= ko.observableArray([]);
    var Jedinice= ko.observableArray([]);
    var Dijelovi=ko.observableArray([]);
    

    var DaNeOperators = ['DA', 'NE'];

    var redakUpita= ko.observableArray([]);

    var selectUpit=ko.observableArray([]);
    var imeUpita=ko.observable("prviNovi");
    var opisUpita=ko.observable("opisNovi");


    var tipRezultata= ko.observable(1);
    var redakKombo= ko.observableArray([]);

    var testAuto = ko.observable(222);


    var viewMode= ko.observable(1);
    //1 - listView
    //2 - gridView


    var defStruktura= ko.observableArray([]);
    var pageSize= ko.observable(10);
    var pageMax= ko.observable(-1);
    var pageIndex= ko.observable(0);
    var recordCount= ko.observable(0);
    var sifra= ko.observable("x");
    var refinersLinkovi= ko.observableArray([]);
    var polja= ['tbl_Izrada.IZR_IDT_Mjesto', 'tbl_Nazivi.NAZ_IDT_Naziv_predmeta', 'tbl_Inventarizacija.INV_ID_Inventirao'];
    var operatori= ['<', '>', '=', '<=', '=>', 'sadrži'];
    
    var redOperatori = [' AND ', ' OR '];
    var currentPolje= ko.observable('tbl_Izrada.IZR_IDT_Mjesto');
    var currentVrijednost= ko.observableArray([]);
    var currentTTablica= ko.observable('Mjesta');
    var vrijednostPolja= ko.observable(7510);
    var rezultati= ko.observableArray([]);
    var totalCount= ko.observable(0);
    var tabIndex= ko.observable(1);
    var checkAll= ko.observable(true);
    var firstload= true;
    var odabrano= ko.observableArray([]);
    var podIDT= ko.observableArray([]);
    var refiners= ko.observableArray([]);

    var paginationColCount = ko.observable(4);
    var paginationColWidth = ko.observable(11);


    var searchHistoryOpened= ko.observable(false);
    var myMessage = ko.observable("Spremljeni upiti"); // Initially blank

    //adresaAPI: 'http://localhost:61950/api/DVALTValuesNOEF',
    //var adresaAPI = 'api/DVALTValuesNOEF';
    var adresaAPI = 'api/WebApiSQL';

    var title = 'Pretraživanje';
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
        zoomItem: zoomItem,
        activate: activate,
        canActivate: canActivate,
        compositionComplete: compositionComplete,

        testTablica:testTablica,
        testAutocomplete:data.getJsonAutocompleteER,
        testAuto:testAuto,
        totalCount: totalCount,
        brojOdabranih: brojOdabranih,
        imeUpita: imeUpita,
        opisUpita: opisUpita,
        kopirajUpit: kopirajUpit,
        spremiUpit: spremiUpit,
        brisiUpit: brisiUpit,
        noviUpit: noviUpit,

        skiniDoc: skiniDoc,
        skiniPDF:skiniPDF,
        downloadURLOLD: downloadURLOLD,
        downloadURL:downloadURL,
        
        showModalMjere: showModalMjere,
        showModalVrijeme:showModalVrijeme,
        odabrano: odabrano,

        userName: data.userName,
        password: data.password,
        rUserName: data.realUserName,
        rIsAuth: data.realIsAuth,
        rUserRoles: data.realUserRoles,
        router: router,
        logout: logout,

        realFakeMjere: popupMjere.realFakeMjere,
        Dijelovi: Dijelovi,
        Dimenzije: Dimenzije,
        MjereOperatori: popupMjere.MjereOperatori,
        Jedinice: Jedinice,




        refiners: refiners,
        minimize: minimize,

        dodajRedakUpitaRefinerAND: dodajRedakUpitaRefinerAND,
        dodajRedakUpitaRefinerOR: dodajRedakUpitaRefinerOR,
        refinerToggle: refinerToggle,

        redakUpita: redakUpita,
        redakKombo: redakKombo,
        promjenaPolja: promjenaPolja,
        changeOperator: changeOperator,
        changePod: changePod,

        zoviDialog: zoviDialog,
        DaNeOperators: DaNeOperators,
        noviRedak: noviRedak,
        brisiRedak: brisiRedak,
        selectUpit: selectUpit,
        upitiMenu: upitiMenu,
        promjenaMenuUpiti: promjenaMenuUpiti,
 

        odabranUpitID: odabranUpitID,
        pretrazi: pretrazi,

        viewMode: viewMode,

        zaCheckAll: zaCheckAll,
        checkAll: checkAll,

        pageChangeFL: pageChangeFL,
        pageMax: pageMax,
        pageIndex: pageIndex,
        pageChange: pageChange,
        pageSize: pageSize,
        refreshPageSize: refreshPageSize,

        rezultati: rezultati,
        vidiOdabrano: vidiOdabrano,

        openBigPicture: openBigPicture,

        makniCrticu: makniCrticu,

        stazaSlike: data.stazaSlike,


        Selects: data.Selects,//[],
        upitiMenu: upitiMenu,

        attached: attached,
        searchHistoryOpened: searchHistoryOpened,
        myMessage: myMessage,

        openSearchHistory: openSearchHistory,

        promjeniSelectUpit: promjeniSelectUpit,

        paginationColCount: paginationColCount,
        paginationColWidth: paginationColWidth,

        gotoZapis: gotoZapis,
        msDoc: msDoc,
        redOperatori: redOperatori,
        provjeriZagrade: provjeriZagrade,
        postaviNavigaciju: postaviNavigaciju
    }


    function postaviNavigaciju() {
        if (data.navigacijaIzPretrazivanja() == "-1") {
            data.navigacijaIzPretrazivanja(sifra());
        } else {
            if (data.navigacijaIzPretrazivanja() != sifra()) {
                data.navigacijaIzPretrazivanja(sifra());
            } else {
                data.navigacijaIzPretrazivanja("-1");
            }
        }
        return true;
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


    function skiniDoc() {

        generirajDoc().then(
            function(datoteka){
                downloadURL(datoteka);
            })
    }

    function skiniPDF() {

        generirajPDF().then(
            function (datoteka) {
                downloadURL(datoteka);
            })
    }

    function generirajPDF() {
        var feder = Q.defer()
        var req = $.ajax({
            type: 'GET',
            url: adresaAPI + '?i1=' + 1 + '&i2=' + totalCount() + '&i3=3&i4=4&i5=5&i6=6&sifra=' + sifra(),
            dataType: 'json',
            contentType: 'application/json',
            success: function (response, text) {
                feder.resolve(response);

            },
            error: function (text, error) {
                feder.resolve(false)

                console.log(error);

            }
        })

        return feder.promise;
    }


    function generirajDoc() {
        var feder=Q.defer()
        var req = $.ajax({
            type: 'GET',
            url: adresaAPI + '?i1=' + 1 + '&i2=' + totalCount() + '&i3=3&i4=4&i5=5&i6=6&i7=7&sifra=' + sifra(),
            dataType: 'json',
            contentType: 'application/json',
            success: function (response, text) {
                feder.resolve(response);

            },
            error: function (text, error) {
                feder.resolve(false)
                
                console.log(error);
                
            }
        })
        
        return feder.promise;
    }


    function msDoc() {
        var oReq = new XMLHttpRequest();
        //oReq.open("GET", adresaAPI + '?i1=' + pageSize() + '&i2=' + pageIndex() + '&i3=3&i4=4&i5=5&i6=6&i7=7&sifra=' + sifra(), true);
        oReq.open("GET", adresaAPI + '?i1=' + 1 + '&i2=' + totalCount() + '&i3=3&i4=4&i5=5&i6=6&i7=7&sifra=' + sifra(), true);
        oReq.responseType = "blob";

        oReq.onload = function (oEvent) {
            var blob = oReq.response;
            window.navigator.msSaveBlob(blob, 'msSaveBlob_testFile.doc');

            // var URI = window.URL.createObjectURL(blob);
            //downloadURI(URI, "SKINIVECH.pdf");

            // ...
        };

        oReq.send();


    }


    function gotoZapis (hash) {
        router.navigate("#" + hash, true);
        return true;
    }

    function refreshPageSize() {

        var xiv = Math.floor((recordCount() - 1) / pageSize());

        pageMax(xiv + 1);


        if (pageMax() == 1) {
            paginationColCount(100 / 3);
            paginationColWidth(3);
        }
        if (pageMax() > 1) {
            paginationColCount(100 / 5);
            paginationColWidth(5);
        }
        if (pageMax() > 10) {
            paginationColCount(100 / 7);
            paginationColWidth(8);
        }
        if (pageMax() > 100) {
            paginationColCount(100 / 9);
            paginationColWidth(11);
        }


        rezultati([]);
        pageIndex(1);
        refreshGrid();
        return false;//deferFunc.promise;

    }
    function openSearchHistory  () {
        //var visina = $("#tabPretrazivanje").innerHeight() - $(".tabHeader ").innerHeight();
        var visina = $("#tabPretrazivanje").innerHeight();
        if (searchHistoryOpened()) {

            $(".searchHistoryBox").animate({
                'min-height': "0",
                'height': "0"
            }, 500,
                function () {
                    myMessage("spremljene pretrage");
                    searchHistoryOpened(false);
                    $(".searchHistoryBox").hide();
                })

            $(".searchHistoryBox").parent().animate({
                'min-height': "0",
            }, 500)
        }
        else {

            $(".searchHistoryBox").show().animate({
                'min-height': "350px",
                'height': visina + 'px'
            }, 500,
                function () {
                    myMessage("zatvori");
                    searchHistoryOpened(true);
                })

            $(".searchHistoryBox").parent().animate({
                'min-height': "352px",
            }, 500)
        }

        return;
    }

    function finisher() {
        //rezultati(data.rezultati);
        console.log(rezultati());
    }



    function loginTry() {
        data.login(data.userName(), data.password()).then(function () {
            data.getUserName();
        })
        .then(function () { data.isAuthenticated(); })
        .then(function () { getRoles(); });
        return true;
    }

    function   getRoles() {
        console.log(data.getUserRoles());
        return true;
    }

    function  isAuth() {
        console.log(data.isAuthenticated());
        return true;
    }

    function  logout() {
        data.logout()
        .then(function () { data.isAuthenticated(); });
        return true;
    }



    function attached() {
        if (true) {

            $(".sidebar-wrapper").slimScroll({
                scrollSize: '7px',
                scrollPosition: '250px',
                scrollTopPosition: '48px',
                size: "7px",
                opacity: "0.2",
                position: "right",
                alwaysVisible: true,
                //railVisible: true,
                disableFadeOut: true,
                width: '7px',
                distance: 0,
                wheelStep: 1,
                height: 'auto'
            });
            $('.container').on('mouseenter', 'td.imgCell', function () {
                $(this).children().children().children().children("div:first").hide();
                $(this).children().children().children().children("div:last").show();
            });
            $('.container').on('mouseleave', 'td.imgCell', function () {
                $(this).children().children().children().children("div:last").hide();
                $(this).children().children().children().children("div:first").show();
            });
        }
    }



    function compositionComplete() {
        $(".page-title").click(function () {
            $(this).addClass("active");
            $(this).siblings().removeClass("active");
        })
        var wHeight = window.innerHeight;
        var topHeight = $(".page-content-wrapper").children("div:first-child").innerHeight() + parseInt($(".page-content-wrapper").children("div:first-child").css("marginBottom"));
        $(".container.glavni.scrollable").height(wHeight - topHeight);


        dialogZoom = $("#dialog-BigPicture").dialog({
            autoOpen: false,
            height: 600,
            width: 800,
            modal: true,


            close: function () {
            }
        })

       

 

        $("#hardLoad").on("click", (function (event) {
            event.stopPropagation();
        }))


    }



    function   canActivate() {
        //alert($('input[name=__RequestVerificationToken]').val());
        var deferred = $.Deferred();
        return deferred.then(data.isAuthenticatedLocal().done(function (response) {
            if (response) {
                deferred.resolve(response);
            } else {
                logger.logError('Ulogirajte se...', null, title, true);
                deferred.resolve({ 'redirect': '/' });
            }
            return deferred.promise();
        }))

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

    function  openBigPicture(index,data) {
        zoomItem(data);
        dialogZoom.dialog("open");

    }

    function zoviDialog(index, upitRedak) {
        
        if (upitRedak.poljeIDT() == 9999) {
            //upitRedak.combo(1);
            rowOpenDialog(index);
            //dialog.dialog("open");
            if (!popupVrijeme.otvoreno()) {
                showModalVrijeme();
            }
        }
        if (upitRedak.poljeIDT() == 8888) {
            rowOpenDialog(index);
            upitRedak.combo(1);
            showModalMjere();
            //dialog2.dialog("open");
        }
    }

    function showModalVrijeme() {
        
        popupVrijeme.show(redakUpita()[rowOpenDialog()]).then(function (response) {
            popupVrijeme.otvoreno(false);
            if (response) {
                //redakUpita()[rowOpenDialog()](response);
                redakUpita()[rowOpenDialog()]=response;
            }
        })
        return true;

    }

    function showModalMjere() {

            modalMjere.show(redakUpita()[rowOpenDialog()]).then(function (response) {
                if (response) {
                    redakUpita()[rowOpenDialog()] = response;
                }
            })
    }



    function  activate() {

        if (firstPass) {
            
            firstPass = false;
            
            
            

            if (modalMjere.firstLoad) {
                modalMjere.init();
            }
 
            if (popupVrijeme.firstLoad) {
                popupVrijeme.init();
            }


            //dialogTest=new 


            // alert(this.firstload);

            //refinersi
            data.getWebAPISQL(4,-1, returnValue).then(function (b) {
            //getDefRefNOEF().then(function (b) {
                $.each(b, function (i, p) {
                    var tmpRefiner = new refinerModel(p['title'], p['filter'], p['template'],false,0,0,p['fieldIDT']);
                   
                    refiners.push(tmpRefiner);
                })
            })

            sloziForme();


            odabranUpitID.subscribe(function (newValue) {
                zaOdabranUpitSubscribe(newValue)
            })

            pageIndex.subscribe(function (newValue) {
                //alert("pejgsjc");
                refreshGrid();
            })




            currentPolje.subscribe(function (newValue) {
                //logger.log('subscribe' + newValue, null, title, true);
                currentTTablica('Nazivi');
                //currentVrijednost(data.Selects[currentTTablica()]);
                currentVrijednost(Selects[currentTTablica()]);

            })
            // return data.getDef().then(data.getTerminoloske('Mjesta')).then(data.getTerminoloske('Nazivi')).then(function(){setVrijednost().then(function(x){vidiIzbor(x);});});




            var returnValue;
            //var pare = ty;
            return data.getWebAPISQL(1,-1,returnValue).then(function (b) {
            //return getDefNOEF(returnValue).then(function (b) {
                defStruktura(b);
            })
            .then(function () {
                data.getWebAPISQL(5,-1,returnValue).then(function (b) {
                //getJsonTermBucket(returnValue).then(function (b) {
                    //$.each(my.SelectsArrays, function (i, p) {
                    Selects = b;
                    //})
                })
                  .then(function () {
                      data.getWebAPISQL(3, -1, returnValue)
                          .then(function (b) {
                                //getUpitiNOEF(returnValue).then(function (b) {
                                    selectUpit(b);
                                    //alert(b[0].ime);
                                })
                                setVrijednost()
                                    .then(function (x) {
                                        promjenaPolja(0, x);
                                        compositionComplete();
                                    })
                            })
                  })
         }

            
    }




    function zaOdabranUpitSubscribe(newValue) {
       
        redakUpita([]);
        if (newValue != -1 && newValue) {
            var upitIndex = ko.utils.arrayFirst(selectUpit(), function (item) {
                return item.ID == newValue;
            });

            if (upitIndex) {
                sifra(upitIndex.sifra);
                imeUpita(upitIndex.ime);
                opisUpita(upitIndex.opis);
                pageIndex(1);
                $.each(upitIndex.upiti, function (index, data) {

                    //var temp = ko.utils.arrayFirst(defStruktura(), function (item) {
                    //    return item.IDT === data.poljeIDT;
                    //})
                    var xdata = mapRedakUpita(data);
                    if (xdata.combo() == 2 && xdata.vrijednost2() != null) {
                        redakUpita.push(xdata);
                    }

                })
                refreshGrid();
            }
        }
    }



    function mapRedakUpita(inputData) {

        
        var defStrukturaRedak = ko.utils.arrayFirst(defStruktura(), function (item) {
            return item.IDT === inputData.poljeIDT;
        })
        var redakUpita = new redakUpitaModel();

        var operatori = defStrukturaRedak.Napomena.split(";");
        var testOperatori = ko.observableArray([]);

        $.each(operatori, function (index, data) {
            testOperatori.push(data);
        })

        if (testOperatori() != redakUpita.operatori()) {
            redakUpita.operatori(testOperatori());
        }


        redakUpita.combo(inputData.combo);
        redakUpita.poljeIDT(inputData.poljeIDT);
        redakUpita.polje(inputData.polje);
        redakUpita.tablica(inputData.tablica);
        redakUpita.vrijednost1(inputData.vrijednost1);
        redakUpita.vrijednost2(inputData.vrijednost2);
        redakUpita.vrijednost3(inputData.vrijednost3);
        redakUpita.vrijednost4(inputData.vrijednost4);

        if (redakUpita.combo() == 2 && typeof redakUpita.vrijednost2() != "number") {
            //alert("null nema kajsadovo?");
            redakUpita.vrijednost2(null);
        }

        if (defStrukturaRedak.T_Tbl) {
            redakUpita.termTablica(defStrukturaRedak.T_Tbl);
        } else {
            redakUpita.termTablica("tbl_T_Zbirke");
        }

        redakUpita.upitOperator(inputData.upitOperator);
        redakUpita.redOperator(inputData.redOperator);
        redakUpita.podZapisi(inputData.podZapisi);
        redakUpita.zagradaOtvorena(inputData.zagradaOtvorena || null);
        redakUpita.zagradaZatvorena(inputData.zagradaZatvorena || null);

        redakUpita.vrijemeRedak(null);
        if (inputData.vrijemeRedak != undefined && inputData.vrijemeRedak != null && inputData.vrijemeRedak != "" && inputData.vrijemeRedak != "null") {
            redakUpita.vrijemeRedak(popupVrijeme.mapVrijemeRedak(inputData.vrijemeRedak));
        }

        redakUpita.mjereRedak(null);
        if (inputData.mjereRedak != undefined && inputData.mjereRedak != null && inputData.mjereRedak != "" && inputData.mjereRedak != "null") {
            redakUpita.mjereRedak(modalMjere.mapMjereRedak(inputData.mjereRedak));
        }


        return redakUpita;

    }






    function  vidiOdabrano (data, event) {
        //console.log(odabrano());
        //console.log(data.odabranoX);
        var odabrano;
        if (data.odabranoX() === event.currentTarget.checked) {
            data.odabranoX(!event.currentTarget.checked);
            SetOdabranoPOST(!event.currentTarget.checked, data.invBroj, false, odabrano).then(function (b) {
                brojOdabranih(b);
            })

        } else {
            data.odabranoX(event.currentTarget.checked);
            SetOdabranoPOST(event.currentTarget.checked, data.invBroj, false, odabrano).then(function (b) {
                brojOdabranih(b);
            })

        }
        //brojOdabranih(tmp);


        return true;
    }

    function  zaCheckAll(data,event) {
        //console.log(odabrano());
        //alert(data.odabranoX);
        var odabrano;
        checkAll(event.currentTarget.checked);
        SetOdabranoPOST(event.currentTarget.checked, 692, true, odabrano)
        .then(function(b){ 
            brojOdabranih(b);

            ko.utils.arrayForEach(rezultati(), function (p) {
                p.odabranoX( event.currentTarget.checked);
            });

        })
        //brojOdabranih(tmp);


        return true;
    }

    function  noviUpit() {
        var returnValue;
        getJsonPOSTNoviUpit(-1,returnValue).then(function (rez) {
            selectUpit(rez.upitiLista);
            odabranUpitID(rez.upitID);
        })

    }




    function  SetOdabranoPOST(odabranoValue, ID_Broj,sveIliNe,returnValue) {
        //console.log(xd);
        var xd = null;
        var odV = 0;
        if (odabranoValue) odV = 1;
        var sIN=0;
        if (sveIliNe) sIN = 1;

        var req = $.ajax({
            type: 'POST',
            url: adresaAPI + '?sifra=' + sifra() + '&ID_Broj=' + ID_Broj +'&odabrano=' + odV + '&sve=' + sIN,
            dataType: 'json',
            data: xd,// JSON.stringify(redakUpiti),
            contentType: 'application/json',
            success: function (response, text) {
                returnValue = response;

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



    function  getJsonPOSTNoviUpit(copyID, returnValue) {
        //console.log(xd);
        var xd = null;
        var req = $.ajax({
            type: 'POST',
            url: adresaAPI +'?upitID=' + copyID + '&zzz=noviupit',
            dataType: 'json',
            data: xd,// JSON.stringify(redakUpiti),
            contentType: 'application/json',
            success: function (response, text) {
                returnValue = response;

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

    function promjeniSelectUpit(data) {
        openSearchHistory();
        odabranUpitID(data.ID);
    }

    function  kopirajUpit () {
        var returnValue;

        if (odabranUpitID()) {
            return getJsonPOSTSpremiASUpit(redakUpita(), odabranUpitID(), returnValue)
                .then(function (rez) {
                    selectUpit(rez.upitiLista);
                    odabranUpitID(rez.upitID);
                })
        }

 
                
    }


    function  getJsonPOSTSpremiASUpit(redakUpiti, upitID,returnValue) {
        var xd = pripremiRedakZaSpremanje();
        //console.log(xd);
        var req = $.ajax({
            type: 'POST',
            url:  adresaAPI + '?zzz=zzz&saveAZ=saveaz&upitID=' + upitID,
            dataType: 'json',
            data: xd,// JSON.stringify(redakUpiti),
            contentType: 'application/json',
            success: function (response, text) {
                returnValue = response;

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

        return req;
    }

    function  spremiUpit() {

        $(".Overlay").addClass("visible");

        //return data.getJsonPOSTALT(redakUpita(),sifra(),pageSize()).then(function (rez) { mapToRez(rez); });
        var returnObject;//novi ili stari ID upita
        return getJsonPOSTSpremiUpit(redakUpita(), imeUpita(), opisUpita(), odabranUpitID(),returnObject)
            .then(function (returnObject) {
                var returnValue;
                data.getWebAPISQL(3,-1, returnValue).then(function (b) {
                    //getUpitiNOEF(returnValue).then(function (b) {
                    selectUpit(b);
                    return returnObject;
                })
                .then(function (returnObject) {
                    odabranUpitID(returnObject);
                });

                $(".Overlay").removeClass("visible");
            })

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


        var t1 = ko.observable();
        t1({ 'staraSifra': opisUpita(), 'pageSize': recordCount(), 'upiti': nx });
        var xd = ko.toJSON(t1);
        
        return xd;
    }





    function  getJsonPOSTSpremiUpit(redakUpiti, ime,opis,upitID,returnObject) {
        //console.log(xd);
        if (upitID == undefined) upitID = -1;
        var xd = pripremiRedakZaSpremanje();
        var req = $.ajax({
            type: 'POST',
            url: adresaAPI + '?ime=' + ime + '&upitID=' + upitID,
            dataType: 'json',
            data: xd,// JSON.stringify(redakUpiti),
            contentType: 'application/json',
            success: function (response, text) {
                    
                if (upitID == -1) {
                    //odabranUpitID(response);
                    returnObject = response;
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

        return req;
    }


    //function brisiUpit() {
      function  brisiUpit(data) {

        $(".Overlay").addClass("visible");
        //console.log(redakUpita());
        //return data.getJsonPOSTALT(redakUpita(),sifra(),pageSize()).then(function (rez) { mapToRez(rez); });
          //return getJsonPOSTBrisiUpit(odabranUpitID())
        return getJsonPOSTBrisiUpit(data.ID)
            .then(function () {
                var returnValue;
                //getUpitiNOEF(returnValue).then(function (b) {
                data.getWebAPISQL(3,-1,returnValue).then(function (b) {
                    selectUpit(b);
                });

                odabranUpitID(selectUpit()[0]["ID"]);

                $(".Overlay").removeClass("visible");
            });


    }


    function  getJsonPOSTBrisiUpit(upitID) {
        //console.log(xd);
        var xd = null;
        var req = $.ajax({
            type: 'POST',
            url: adresaAPI + '?upitID=' + upitID,
            dataType: 'json',
            data: xd,// JSON.stringify(redakUpiti),
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


    function pretrazi() {

        if (provjeriZagrade()) {

            //var z = $(".Overlay");

            $(".Overlay").addClass("visible");

            //console.log(redakUpita());

            return postJsonPretrazivanje(redakUpita(), sifra(), pageSize())
                .then(function (rez) {
                    mapToRez(rez)
                    .then(function () {
                        // $("#traziIkona").removeClass("fa fa-spinner fa-spin").addClass("glyphicon glyphicon-search");
                        $(".Overlay").removeClass("visible");
                        checkAll(false);
                    });
                });
        } else {
            alert("nesparene zagrade");
        }

    }

        




    function  izgskiniPDF() {

        //$(".Overlay").addClass("visible");
        //console.log(redakUpita());
        //return data.getJsonPOSTALT(redakUpita(),sifra(),pageSize()).then(function (rez) { mapToRez(rez); });
        return getJsonPOSTskiniPDF()
        //.then(function () {
        //    $(".Overlay").removeClass("visible");
        //    //var iframe = document.getElementById("downloadFrame");
        //    //iframe.src = "Content/nekiPDF.pdf";
        //    //$('#downloadFrame').attr('src', 'Content/nekiPDF.pdf');
        //    //downloadURI('Content/nekiPDF.pdf', "nekoime");
        //    //window.location.href = 'Content/nekiPDF.pdf';
        //});


    }

    function  getJsonPOSTskiniPDF(sifra, pageSize, pageIndex) {

        var oReq = new XMLHttpRequest();
        oReq.open("GET", adresaAPI + '?i1=' + pageSize() + '&i2=' + pageIndex() + '&i3=3&i4=4&i5=5&i6=6&sifra=' + sifra(), true);
        oReq.responseType = "blob";

        oReq.onload = function(oEvent) {
            var blob = oReq.response;
            window.navigator.msSaveBlob(blob, 'msSaveBlob_testFile.pdf');
                
            // var URI = window.URL.createObjectURL(blob);
            //downloadURI(URI, "SKINIVECH.pdf");

            // ...
        };

        oReq.send();
    }


    function  OLDgetJsonPOSTskiniPDF(sifra, pageSize, pageIndex) {
        var params = "c";
        //console.log(xd);
        var req = $.ajax({
            type: 'GET',
            url: adresaAPI + '?i1=' + pageSize + '&i2=' + pageIndex + '&i3=3&i4=4&i5=5&i6=6&sifra=' + sifra,
            //dataType: 'json',
            //contentType: 'application/json',
            contentType: 'application/pdf',
            success: function (response, text) {
                var dpf = [];
                //dpf.push(response);
                //var lobb = new Blob(response, { type: "application/pdf" });

                //cross browser
                window.URL = window.URL || window.webkitURL;

                var blob = new Blob(['body { background-color: yellow; }'], { type: 'text/css' });

                var link = document.createElement('link');
                link.rel = 'stylesheet';
                //createObjectURL returns a blob URL as a string.
                link.href = window.URL.createObjectURL(blob);
                document.body.appendChild(link);

            },



            //     var disp = request.getResponseHeader('Content-Disposition');
            //     if (disp && disp.search('attachment') != -1) {
            //         var form = $('<form method="POST" action="' + '/api/ALTValuesNOEF?i1=2&i2=2&i3=3&i4=4&i5=5&i6=6&i7=7' + '">');
            ////         $.each(params, function (k, v) {
            // //            form.append($('<input type="hidden" name="' + k +
            //  //                   '" value="' + v + '">'));
            //   //      });
            //         $('body').append(form);
            //         form.submit();
            //         //ko.mapping.fromJS(response["VratiNazive"], that.viewModel.taDa);

            //         //return rezultati(response);
            //         // rezultati(response.data);
            //         //console.log(response);
            //         // window.location.href = 'Content/nekiPDF.pdf';
            //     };
            //},
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




    function  downloadURI(uri, name) {
        //var link = $("#hardLoad");
        $("#hardLoad").attr("download", name);
        $("#hardLoad").attr("href", uri);
        //alert($("#hardLoad").attr("href"));
        $("#hardLoad").click();
    }

    function downloadURL(datoteka) {
        var url = "Content/" + datoteka;
        if ($('#idown').length) {
            $('#idown').attr('src', url);
        } else {
            $('<iframe>', { id: 'idown', src: url }).hide().appendTo('body');
        }
    }

    function downloadURLOLD() {
        var url = "Content/nekiPdf.pdf";
        if ($('#idown').length) {
            $('#idown').attr('src', url);
        } else {
            $('<iframe>', { id: 'idown', src: url }).hide().appendTo('body');
        }
    }

    function postJsonPretrazivanje(redakUpiti, staraSifra, pageSize) {


        var xd=pripremiRedakZaSpremanje();

        //console.log(xd);
        var req = $.ajax({
            type: 'POST',
            url:  adresaAPI ,
            dataType: 'json',
            data: xd,// JSON.stringify(redakUpiti),
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



    function  rezLink(x) {
        //var hash = '#test' + x.ID_Broj;
        var odabranoX = ko.observable(x.odabrano);
        var adresaZaUpis = "upisPodataka";
        return {
            hash: "#" + adresaZaUpis + x.ID_Broj,
            invBroj: x.ID_Broj,
            KRT_IDT_Zbirka: x.KRT_IDT_Zbirka,
            KRT_Inventarni_broj: x.KRT_Inventarni_broj,
            MC_Staza_slike: data.stazaSlike(x.MC_Staza_slike),
            zbirka: x.zbirka,
            Datacija: makniCrticu(x.Datacija),
            Autori: x.Autori,
            naslovi: x.naslovi,
            nazivi: x.nazivi,
            Mjesta: x.Mjesta,
            Mjere: x.Mjere,
            Mit: x.Mit,
            odabranoX:odabranoX,
            kataloskaJedinica: ReplaceStuff(x.kataloskaJedinica)
        }

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
        //redakUpita.push(xupit);
        promjenaPolja(0, redakUpitaNew);
        //redakUpita.push(new redakUpitaModel());
    }


    ////???
    function  podNodes(tada, nad) {

        var podTermini = ko.observableArray(tada);


        var a = ko.utils.arrayFilter(podTermini(), function (item) {
            return item.Nad_IDT == nad;
        });
        // console.log(a);
        if (a.length > 0) {
            $.each(a, function (index, data) {
                //                console.log(a);
                podIDT.push(data['IDT']);
                podNodes(podTermini(), data['IDT']);
            });
        };

    }


    function changeRedoperator(data, event) {
 
        data.redoOperator(event.currentTarget.checked);
        return true;
    }

    function  changePod(data,event) {
            data.podZapisi(event.currentTarget.checked);
        return true;
    }

    function  podIDT(data, IDT) {
        var ostatak = ko.observableArray([IDT]);

        var temp = ko.utils.arrayFilter(data, function (item) {
            return item.Nad_IDT in ostatak()

        });

        console.log(temp);
    }


    function  promjenaPolja(index,tmpRedakUpita) {
        //console.log(tada);

        if (!tmpRedakUpita) {
            return false;
        }
  
        var defStrukturaRedak = ko.utils.arrayFirst(defStruktura(), function (item) {
            return item.IDT === tmpRedakUpita.poljeIDT();
        })


        tablicaDef = defStrukturaRedak.T_Tbl;

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
        



        tmpRedakUpita.vrijednost2(null);
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
        
       // changeOperator(index, redakUpita);

        return true;
    }

    //function openDialog(poljeIDT,index) {
    //    if (poljeIDT == 9999) {
    //        rowOpenDialog(index);
    //        dialog.dialog("open");
    //    }
    //    if (poljeIDT == 8888) {
    //        dialog2.dialog("open");
    //    }
    //}

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
                            //if (data.fieldIDT() == rData.poljeIDT() && rData.vrijednost2() == item.IDT && rData.redOperator() == " AND ") {
                            //    rfP.odabrano = true;
                            //}
                            //if (data.fieldIDT() == rData.poljeIDT() && rData.vrijednost2() == item.IDT && rData.redOperator() == " OR ") {
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
        // console.log(refinersLinkovi());
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
        //console.log(refiners());
        return deferFunc.promise;
        //alert(refiners()[0]['podaci']());
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
        //        pretrazi();
        return true;
    }


    function  postaviViewMode(x) {
        return viewMode(x);
    }


    


    function  setVrijednost() {
        //console.log(data.defStruktura());
        redakKombo([]);
        redakKombo(defStruktura);
            

        var ferd = Q.defer()
        var xupit = new redakUpitaModel()
        xupit.combo(2);
        xupit.podZapisi(false);
        xupit.vrijednost1(null);
        xupit.vrijednost2(null);
        xupit.vrijednost3(null);
        xupit.vrijednost4(null);
        xupit.upitOperator("=");
        xupit.polje("Zbirka");
        xupit.poljeIDT(131);
        redakUpita.push(xupit);

        ferd.resolve(xupit);

        return ferd.promise;
    }



    function  pageChangeFL(modifier) {

        if (modifier == -100) {
            pageIndex(1);
        }

        if (modifier == 100) {
            pageIndex(pageMax());
        }
    }

    function  pageChange (modifier) {
        var tmp = pageIndex();
        if (modifier > 0) {
            if (tmp + modifier <= pageMax()) {
                tmp = tmp + modifier;
            }
        }
        if (modifier < 0) {
            if (tmp + modifier > 0) {
                tmp = tmp + modifier;
            }
        }
        pageIndex(tmp);
    }


    function  refreshGrid() {

        return data.getJsonRefreshGridPage(sifra(), pageSize(), pageIndex()).then(function (rez) {
            mapToRezALT(rez);
        })

    }



    function  mapToRezALT(BIGrez) {
        rezultati([]);

        for (var i = 0; i < BIGrez.length ; i++) {
            if (BIGrez[i]) {
                rezultati.push(new rezLink(BIGrez[i]));
            }
        }
        //console.log(rezultati);

        return true;
    }



    function  mapToRez(rezultatiPlusRefineri) {
        //console.log(rez);

        

        rezultatiPretrazivanja = rezultatiPlusRefineri['part1'];

        sifra(rezultatiPlusRefineri['sifra']);

        recordCount(rezultatiPlusRefineri['brojZapisa']);

        //pageMax(recordCount() / pageSize());
        var xiv = Math.floor((recordCount() - 1) / pageSize());

        pageMax(xiv + 1);


        if (pageMax() == 1) {
            paginationColCount(100 / 3);
            paginationColWidth(3);
        }
        if (pageMax() > 1) {
            paginationColCount(100 / 5);
            paginationColWidth(5);
        }
        if (pageMax() > 10) {
            paginationColCount(100 / 7);
            paginationColWidth(8);
        }
        if (pageMax() > 100) {
            paginationColCount(100 / 9);
            paginationColWidth(11);
        }



        // alert(recordCount());
        refinersLinkovi(rezultatiPlusRefineri['part2']);


        rezultati([]);
        totalCount(rezultatiPlusRefineri['brojZapisa']);

        //brojOdabranih(BIGrez['brojZapisa']);
        brojOdabranih(0);
        var tmp = [];
        var deferFunc = Q.defer();
        for (var i = 0; i < pageSize() ; i++) {
            if (rezultatiPretrazivanja[i]) {
                rezultati.push(new rezLink(rezultatiPretrazivanja[i]));
            }
        }

        fillRefiners()
        .then(function () {
            deferFunc.resolve(true);
        })

        pageIndex(1);

        return deferFunc.promise;

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



    function  minimizeSearchBox(event) {
        var togClass = $(".slideUp").attr('class');
        if (togClass === 'glyphicon glyphicon-chevron-down slideUp') {
            togClass = 'glyphicon glyphicon-chevron-up slideUp';
            $(".slideUp").attr('class', togClass);
        } else {
            togClass = 'glyphicon glyphicon-chevron-down slideUp';
            $(".slideUp").attr('class', togClass);
        };
        var searchBox = $("#tabPretrazivanje");
        searchBox.slideToggle();

    }

    function   minimize (item, event) {
        event.stopPropagation();
        var togClass = $(event.target).attr('class');
        if (togClass === 'glyphicon glyphicon-chevron-down') {
            togClass = 'glyphicon glyphicon-chevron-up';
            $(event.target).attr('class', togClass);
        } else {
            togClass = 'glyphicon glyphicon-chevron-down';
            $(event.target).attr('class', togClass);
        }
        var wB = $(event.target).parent().parent().parent().parent().find(".widnowBox");
        wB.slideToggle();
        event.preventDefault();
    }



    function finisher() {
        //rezultati(data.rezultati);
        console.log(rezultati());
    }
   
    //#endregion


    //activate();

 


    function sloziForme () {

    }


    return vm;



    
});