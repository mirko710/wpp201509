define(['durandal/app', 'services/logger', 'services/dataService', 'plugins/router', 'services/pretrazivanjeRedakUpita', 'services/pretrazivanjeRefineri', 'services/pretrazivanjeAlati'],
    function (app, logger, data, router, redakUpitaService, refinersService,alati) {

    var my = this || {};

 
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

    //var redakUpita= ko.observableArray([]);

    var selectUpit=ko.observableArray([]);
    var imeUpita=ko.observable("prviNovi");
    var opisUpita=ko.observable("opisNovi");


    var tipRezultata= ko.observable(1);
   // var redakKombo= ko.observableArray([]);

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

        skiniDoc: alati.skiniDoc,
        skiniPDF: alati.skiniPDF,
        downloadURLOLD: alati.downloadURLOLD,
        downloadURL: alati.downloadURL,
        
        //showModalMjere: showModalMjere,
        //showModalVrijeme:showModalVrijeme,
        odabrano: odabrano,

        userName: data.userName,
        password: data.password,
        rUserName: data.realUserName,
        rIsAuth: data.realIsAuth,
        rUserRoles: data.realUserRoles,
        router: router,
        logout: logout,

       
        Dijelovi: Dijelovi,
        Dimenzije: Dimenzije,
       
        Jedinice: Jedinice,

        refinerToggle: refinersService.refinerToggle,
        refiners: refinersService.refiners,
        minimize: minimize,

        //dodajRedakUpitaRefinerAND: redakUpitaService.dodajRedakUpitaRefinerAND,
        //dodajRedakUpitaRefinerOR: redakUpitaService.dodajRedakUpitaRefinerOR,

        dodajRedakUpitaRefinerAND: dodajRedakUpitaRefinerAND,
        dodajRedakUpitaRefinerOR: dodajRedakUpitaRefinerOR,

        redakUpita: redakUpitaService.redakUpita,
        redakKombo: redakUpitaService.redakKombo,
        promjenaPolja: redakUpitaService.promjenaPolja,
        changeOperator: redakUpitaService.changeOperator,
        changePod: redakUpitaService.changePod,

        DaNeOperators: redakUpitaService.DaNeOperators,
        noviRedak: redakUpitaService.noviRedak,
        brisiRedak: redakUpitaService.brisiRedak,

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


        Selects: data.SelectsPretrazivanje,//[],
        upitiMenu: upitiMenu,

        attached: attached,
        searchHistoryOpened: searchHistoryOpened,
        myMessage: myMessage,

        openSearchHistory: openSearchHistory,

        promjeniSelectUpit: promjeniSelectUpit,

        paginationColCount: paginationColCount,
        paginationColWidth: paginationColWidth,

        gotoZapis: gotoZapis,
        msDoc: alati.msDoc,
        redOperatori: redakUpitaService.redOperatori,
        provjeriZagrade: redakUpitaService.provjeriZagrade,
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

    function dodajRedakUpitaRefinerOR(odabraniRefiner, event) {
        event.stopPropagation();
        odabraniRefiner.checked(!odabraniRefiner.checked());
        zapamtiRefiner = odabraniRefiner.IDT + '%' + odabraniRefiner.kategorija;
        var odabraniRefinerNad = ko.utils.arrayFirst(refinersService.refiners(), function (item) {
            return item.filter() === odabraniRefiner.kategorija;
        })

        redakUpitaService.dodajRedakUpitaRefiner(odabraniRefiner, " OR ",odabraniRefinerNad);

        return true;
    }

    function dodajRedakUpitaRefinerAND(odabraniRefiner, event) {
        var odabraniRefinerNad = ko.utils.arrayFirst(refinersService.refiners(), function (item) {
            return item.filter() === odabraniRefiner.kategorija;
        })

        //odabraniRefiner.checked(!odabraniRefiner.checked());
        zapamtiRefiner = odabraniRefiner.IDT + '%' + odabraniRefiner.kategorija;

        redakUpitaService.dodajRedakUpitaRefiner(odabraniRefiner, " AND ",odabraniRefinerNad);

        pretrazi();

        return true;
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



    function canActivate() {
        //alert($('input[name=__RequestVerificationToken]').val());
        var deferred = $.Deferred();
        return deferred.then(data.isAuthenticatedLocal().done(function (response) {
            if (response) {
                deferred.resolve(response);
            } else {
                logger.logError('Ulogirajte se...', null, title, true);
                deferred.resolve({ 'redirect': '/' });
                $("#userName").focus();
            }
            return deferred.promise();
        }))

    }


 

    function  openBigPicture(index,data) {
        zoomItem(data);
        dialogZoom.dialog("open");

    }




    function  activate() {

        if (firstPass) {
            
            firstPass = false;
            
            if (refinersService.firstLoad) {
                refinersService.init();
            }

            if (redakUpitaService.firstLoad) {
                redakUpitaService.init();
            }


            //dialogTest=new 


            // alert(this.firstload);

            ////refinersi
            //data.getWebAPISQL(4,-1, returnValue).then(function (b) {
            ////getDefRefNOEF().then(function (b) {
            //    $.each(b, function (i, p) {
            //        var tmpRefiner = new refinerModel(p['title'], p['filter'], p['template'],false,0,0,p['fieldIDT']);
                   
            //        refiners.push(tmpRefiner);
            //    })
            //})

            sloziForme();


            odabranUpitID.subscribe(function (newValue) {
                zaOdabranUpitSubscribe(newValue)
            })

            pageIndex.subscribe(function (newValue) {
                //alert("pejgsjc");
                refreshGrid();
            })

            var returnValue;
            //var pare = ty;
            return data.getWebAPISQL(1,-1,returnValue).then(function (b) {
                defStruktura(b);
            })
            .then(function () {
                data.getWebAPISQL(5,-1,returnValue).then(function (b) {
                //getJsonTermBucket(returnValue).then(function (b) {
                    //$.each(my.SelectsArrays, function (i, p) {
                    data.SelectsPretrazivanje = b;
                    //})
                })
                  .then(function () {
                      data.getWebAPISQL(3, -1, returnValue)
                          .then(function (b) {
                                //getUpitiNOEF(returnValue).then(function (b) {
                                    selectUpit(b);
                                    //alert(b[0].ime);
                                })
                                redakUpitaService.setVrijednost()
                                    .then(function (x) {
                                        redakUpitaService.promjenaPolja(0, x);
                                        compositionComplete();
                                    })
                            })
                  })
         }

            
    }




    function zaOdabranUpitSubscribe(newValue) {
       
        redakUpitaService.redakUpita([]);
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
                    var xdata = redakUpitaService.mapRedakUpita(data);
                    if (xdata.combo() == 2 && xdata.vrijednost2() != null) {
                        redakUpitaService.redakUpita.push(xdata);
                    }

                })
                refreshGrid();
            }
        }
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
            return getJsonPOSTSpremiASUpit(redakUpitaService.redakUpita(), odabranUpitID(), returnValue)
                .then(function (rez) {
                    selectUpit(rez.upitiLista);
                    odabranUpitID(rez.upitID);
                })
        }

 
                
    }


    function  getJsonPOSTSpremiASUpit(redakUpiti, upitID,returnValue) {
        var xd = redakUpitaService.pripremiRedakZaSpremanje();
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
        return getJsonPOSTSpremiUpit(redakUpitaService.redakUpita(), imeUpita(), opisUpita(), odabranUpitID(), returnObject)
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













    function  getJsonPOSTSpremiUpit(redakUpiti, ime,opis,upitID,returnObject) {
        //console.log(xd);
        if (upitID == undefined) upitID = -1;
        var xd = redakUpitaService.pripremiRedakZaSpremanje();
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

        if (redakUpitaService.provjeriZagrade()) {

            //var z = $(".Overlay");

            $(".Overlay").addClass("visible");

            //console.log(redakUpita());

            return postJsonPretrazivanje(redakUpitaService.redakUpita(), sifra(), pageSize())
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

  
    function postJsonPretrazivanje(redakUpiti, staraSifra, pageSize) {

        var nx = redakUpitaService.pripremiRedakZaSpremanje();

        var t1 = ko.observable();
        t1({ 'staraSifra': opisUpita(), 'pageSize': recordCount(), 'upiti': nx });
        var upitParametri = ko.toJSON(t1);
        //console.log(xd);
        var req = $.ajax({
            type: 'POST',
            url:  adresaAPI ,
            dataType: 'json',
            data: upitParametri,// JSON.stringify(redakUpiti),
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


    function  ReplaceStuff (tekst) {
        var tekst2 = tekst.replace(/\r\n/g, '<br/>');
        return tekst2;
    }

 
    function  postaviViewMode(x) {
        return viewMode(x);
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

        var rezultatiPretrazivanja = rezultatiPlusRefineri['part1'];

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
        refinersService.refinersLinkovi(rezultatiPlusRefineri['part2']);


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

        refinersService.fillRefiners(redakUpitaService.redakUpita())
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