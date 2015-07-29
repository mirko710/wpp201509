define(['plugins/http', 'durandal/app', 'services/dataService', 'services/logger', 'plugins/router', 'services/upisNavigator', 'services/registracijaNavigator'],
    function (http, app, data, logger, router, upisNavigator, regNav) {
    //Note: This module exports an object.
    //That means that every module that "requires" it will get the same object instance.
    //If you wish to be able to create multiple instances, instead export a function.
    //See the "welcome" module for an example of function export.

    //var podaciZaRegistraciju = ko.observableArray([]);
        //var cTest = ko.observable();
    var komboIDBroj = ko.observable(null);
    var fauxElement = ko.observable('');
    var selK1 = ko.observable('');
    var adresaZaUpis = "upisPodataka";
    var katalogMode = false;
    var dialogNewRecord = null;
    var selMmedia = ko.observableArray([]);
    var selPodOznake = ko.observableArray([]);
    var fullKartica = ko.observableArray([]);
    var transferKartica = ko.observableArray([]);
    var selZaKomboOdabirInvBroja = ko.observableArray([]);
    var mmediaFormaIndex =-1;
    var currentBrojid = ko.observable(43);
    
    
    var recIndex = ko.observable(0);
    var recMax = ko.observable(0);
    var zbIndex = ko.observable(-1);
    var dodajTerm = ko.observable('');
    var dodajTermTablica = ko.observable('');
    var prijedlogInvBroja = ko.observable('');
    //var prijedlogInvBroja = ko.observable('noviBroj...');
    var curBrojidUndo = 43;
    var isLoading = ko.observable(false);
    var startID = ko.observable(-1);
   // var zbNewIndex = ko.observable(null);
    var forceSrediZbirka=ko.observable(true);
    //var Selects = [];
    var kojeVrijeme = ko.observable('Vrijeme:');
    var prefForme =  "1#2#3#4#5#6#8#9#7";

    var daNeUmjestoCheck = [{ 'tekst': 'NE', 'vrijednost': false }, { 'tekst': 'DA', 'vrijednost': true }];
    var manualNav = false;
    var neIdiNaPrvi = false;
    var displayName= 'upisPodataka';
    var firstLoad = true;
    var forme = ko.observableArray([]);
    var photke = ko.observableArray([]);
    var title = 'WM++';
    var vm = {
        
        selK1 : selK1,
        // selKataloska: selKataloska,
        selMmedia:selMmedia,
        kojiSadrzaj:kojiSadrzaj,
        komboZbirkaChanged:komboZbirkaChanged,
        promjenaIdentity: promjenaIdentity,
        photke: photke,

        postaviFokus: postaviFokus,
        postaviFokusUDF: postaviFokusUDF,

        uploadImage: uploadImage,

        uploadStart:uploadStart,
        forme: forme,

        Vremena: data.Vremena,
        VrijemeOpis: data.VrijemeOpis,
        VrijemeJedinica: data.VrijemeJedinica,
        kojeVrijeme: kojeVrijeme,

        minimize:minimize,
        stazaSlike: data.stazaSlike,


        dodajTermTablica: dodajTermTablica,
        dodajTerm: dodajTerm,
       
        zbNewIndex: upisNavigator.currentZbirkaIDT,

        navFirst: navFirst,
        navLast:navLast,
        navPrev: navPrev,
        navNext: navNext,
        delRecord: delRecord,
        saveChanges: data.saveChanges,
        undoChanges: undoChanges,

        isLoading: isLoading,


        canDeactivate: canDeactivate,
        canActivate: canActivate,
        activate: activate,


        fullKartica: fullKartica,

        currentBrojid: currentBrojid,

        Selects: data.Selects,


        newRec: newRec,

        //createZapisExt: data.createZapisExt,

        

        refreshNavigacijuZaRegistraciju: refreshNavigacijuZaRegistraciju,
        
        regPrev:regPrev,
        regNext: regNext,
        //getMjesta: data.getMjesta,

       
        
        selZaKomboOdabirInvBroja: upisNavigator.selZaKomboOdabirInvBroja,

        title: title,

        komboIDBroj:komboIDBroj,

        nextRow: nextRow,
        prevRow: prevRow,
        firstRow: firstRow,
        lastRow: lastRow,

        prijedlogInvBroja: prijedlogInvBroja,
        recMax: upisNavigator.recMax,
        recIndex: upisNavigator.recIndex,
        zbIndex: zbIndex,
        delRowByID:data.delRowByID,
        createZapis: data.createZapis,

        createZapisSubform:createZapisSubform,
        createTermin: data.createTermin,
        //selectMaterijali: selectMaterijali,

        
        mijenjanoFlag: data.mijenjanoFlag,

        //setSelected: setSelected,


        deleteZapisSubform: deleteZapisSubform,


        //upload:upload,
        displayName: displayName,

        daNeUmjestoCheck: daNeUmjestoCheck,

        podaciZaRegistraciju: regNav.podaciZaRegistraciju,

        retTrue: retTrue,
        
        //selKljucneRijeci: selKljucneRijeci,
        spremiForme: spremiForme,
        formModel: formModel,
        bindingComplete:bindingComplete,

        userName: data.userName,
        router: router,
        userName: data.userName,
        password: data.password,
        loginTry: loginTry,
        isAuth: isAuth,
        logout: logout,
        rUserName: data.realUserName,
        rIsAuth: data.realIsAuth,
        rUserRoles: data.realUserRoles,
        attached: attached,
        compositionComplete: compositionComplete,
        openNewRecordDialog: openNewRecordDialog
    }
    return vm;

    function loginTry() {
        data.login(data.userName(), data.password()).then(function () {
            data.getUserName();
            data.parametri.ucitajParametre();
        })
        .then(function () { data.isAuthenticated(); })
        .then(function () { getRoles(); });
        return true;
    };
    function getRoles() {
        console.log(data.getUserRoles());
        return true;
    };
    function isAuth() {
        console.log(data.isAuthenticated());
        return true;
    };
    function logout() {
        data.logout()
        .then(function () { data.isAuthenticated(); });
        return true;
    };


 
    function formModel(ID,title,tmpl,tablica,imaFokus,odabrano,recordCount,buttonBox,cont,data) {
        var that = this;
        that.ID = ko.observable(ID || null);
        that.title = ko.observable(title || null);
        that.tmpl = ko.observable(tmpl|| null);
        that.tablica = ko.observable(tablica || null);
        that.imaFokus = ko.observable(imaFokus || null);
        that.odabrano = ko.observable(odabrano || 0);
        that.recordCount = ko.observable(recordCount || 0);
        that.buttonBox = ko.observable(buttonBox || true);
        that.cont = ko.observable(cont || true);

        that.data = ko.observableArray(data || []);
        
    };
    ///za registracija Navigator


///u upis navigator
    function komboZbirkaChanged() {
        var berko = upisNavigator.currentZbirkaIDT();
       // zbNewIndex(null);
        //alert(zbNewIndex());
        if (upisNavigator.currentZbirkaIDT() != zbIndex()) {
            forceSrediZbirka(true);
        }
        //delayChange().then(function () { zbIndex(berko); });
        zbIndex(berko);
        
    }


///u upis navigator
    function delayChange() {
        var ber = Q.defer();
        Q.delay(1000);
        if (upisNavigator.currentZbirkaIDT()) {
            ber.resolve(true);
        } else {
            //zbNewIndex(null);
            ber.resolve(true);
        };
        return ber.promise;
    }






    function undoChanges() {
        data.undoChanges();
        getKartica();

    }

    function canDeactivate() {
        //the router's activator calls this function to see if it can leave the screen
        logger.log(title + ' View DEActivated', null, title, true);
        data.rejectSejv;
        return true;//app.showMessage('Are you sure you want to leave this page?', 'Navigate', ['Yes', 'No']);
    }




    function openNewRecordDialog() {
        if (!katalogMode) {
            $("#addNewZapis").modal('show');
        }
        //dialogNewRecord.show();
    }



    function lockInput() {

        if (katalogMode) {
            var inputi = $("#glavniUpis :input");
            inputi.prop("disabled", true);
        }
 
    }


    function CallsaveChanges() {

        data.saveChanges();

    }


    function compositionComplete() {

        katalogMode = data.parametri.Vrijednost("B_KATALOG_MODE");

        lockInput();


         $(window).on('beforeunload', function (e) {
             // nothing to confirm/alert

             CallsaveChanges();

                var hasUnsaveds = ko.observable(false);
                if (!hasUnsaveds()) {
                    return;
                }

                // For IE and Firefox prior to version 4
                var e = e || window.event;
                if (e) {
                    e.returnValue = ('yourOnBeforeUnloadMessageText');
                }
                return lo.text('yourOnBeforeUnloadMessageText');
            });


        


        //dialogNewRecord = $("#addNewZapis");
       // console.log("ww");

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
            }
            return deferred.promise();
        }));

    }


    function bindingComplete() {
        //console.log(data.Selects);
    }

    function attached() {
        if (true) {
            //console.log('atačed');
            //console.log($(".sidebar-wrapper"));
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
        }
    }



    ///rafaktorirat
    function ucitajParametreZaKorisnike() {

 
        //def zbirka i za forme
        var prefForm = null;
        var prefFormKOD = null;
        var pocZbirka = null;

        prefForm = data.parametri.Vrijednost("S_WEB_FORME");
        pocZbirka = data.parametri.Vrijednost("S_default_zbirka");
        

  


        if (!pocZbirka) {
            zbIndex(231);
        } else {
            if (pocZbirka.substr(0, 1) == "*") {
                zbIndex(parseInt(pocZbirka.substr(1)));
            }
            else {
                zbIndex(parseInt(pocZbirka.split('#')[1]));
            }
        }

        if (!prefForm) {
            prefForm = prefFormKOD;
        }
        if (!prefForm) {
            prefForm = "14#2#1#4#5#8#6#9#3#10#11#12#13#7";

        }

        ////
        postaviForme(prefForm);


    }

    function postaviForme(prefForm) {

 

        var redoslijedFormi = prefForm.split("#");

        $.each(redoslijedFormi, function (index, value) {
            var tmpForm = ko.utils.arrayFirst(data.protoForme(), function (kitem) {
                return kitem.ID() == value;
            });

            var tmpFormE = new vm.formModel(tmpForm.ID(),                                            
                                            tmpForm.title(),
                                            tmpForm.tmpl(),
                                            tmpForm.tablica(),
                                            tmpForm.imaFokus(),
                                            tmpForm.odabrano(),
                                            tmpForm.recordCount(),
                                            tmpForm.buttonBox());

            vm.forme.push(tmpFormE);
            //alert(tmpForm().title);
            
        })


}



    function activate(id) {
        self = this;
        
        //var startID=43;
        if (firstLoad) {
            if (upisNavigator.firstLoad) {
                upisNavigator.init();
            }
            if (regNav.firstLoad) {
                regNav.init();
            }

            firstLoad = false;
            //console.log(data.Selects.Kljucne_rijeci[0]);

            ucitajParametreZaKorisnike();

            zbIndex.subscribe(function (newValue) {
                isLoading(false);
                //console.log('promjena zbirke');
                if (newValue && newValue != -1) {
                    return data.getPrviIzZbirke(newValue)
                        .then(function (data) {
                            if (data > 0) {
                                currentBrojid(data);
                                upisNavigator.ulazIDBroj(data);
                                
                            }
                            //regNav.ulazIDBroj(data);
                        })
                    

                }

            })

            komboIDBroj.subscribe(function(newValue){
                if (newValue && newValue>-1)  {
                    currentBrojid(newValue);
                    upisNavigator.ulazIDBroj(newValue);
                    regNav.ulazIDBroj(newValue);
                    setTimeoutKomboIDBroj();
                    //komboIDBroj(-1);
                }

            })

            currentBrojid.subscribe(function (newValue) {

                if (!isLoading()) {
                    isLoading(true); console.log('subscribe' + newValue);
                    if (!newValue) {
                        currentBrojid(curBrojidUndo);
                    } else {
                        if (newValue != undefined) {
                            //data.rejectSejv;///// or save or check and ask to be saved
                            data.saveChanges();
                            if (!isNaN(parseInt(newValue))) {
                                //alert(parseInt(id) + ' ' + currentBrojid());
                                startID(parseInt(newValue));
                                curBrojidUndo = startID();
                            }
                        };
                        //alert(parseInt(id) + ' testttZero');
                        $(".Overlay").addClass("visible");
                        return data.getExportFullKartica(startID(), transferKartica)
                            .then(function () {
                                getKartica(startID()).then(function () {

                                    router.navigate(adresaZaUpis + +startID(), false);
                                    lockInput();
                                    $(".Overlay").removeClass("visible");
                                })
                            })
                            .fail(function (error) { alert("Query failed1: " + error.message); });
                    }
               
                }
            });

 

     
            
            if (id != undefined) {
               
                
                if (!isNaN(parseInt(id))) {

                    
                    startID(parseInt(id));
                    // alert(parseInt(id) + ' uno');
                    currentBrojid(startID());
                    upisNavigator.ulazIDBroj(startID());
                    regNav.ulazIDBroj(startID());
                    //promijeniZapis(startID(), "error2");

                } else {
                    if (startID() == -1) {
                        var prviIzZbirke = data.getPrviIzZbirke(zbIndex()).
                            then(function (ydata) {

                                currentBrojid(ydata);
                                upisNavigator.ulazIDBroj(ydata);
                                regNav.ulazIDBroj(startID());
                            })
                    }
                    else {
                        upisNavigator.ulazIDBroj(startID());
                        regNav.ulazIDBroj(startID());
                        promijeniZapis(startID(), "error4");
                    }

                }
            } else {
                upisNavigator.ulazIDBroj(startID());
                regNav.ulazIDBroj(startID());
                promijeniZapis(startID(),"error5");
            }
 
            upisNavigator.currentZbirkaIDT(zbIndex);

        } else {






            katalogMode = data.parametri.Vrijednost("B_KATALOG_MODE");
            
            if (id != undefined) {
               
                if (data.navigacijaIzPretrazivanja() != "-1") {
                //alert(newValue);
                        data.getNavRecordsUpit(selZaKomboOdabirInvBroja).then(function(){
                            recMax(selZaKomboOdabirInvBroja().length);
                            recIndex(1);
//                            upisNavigator.currentZbirkaIDT(zbIndex);
                            upisNavigator.ulazIDBroj(parseInt(id))
                            regNav.ulazIDBroj(parseInt(id))

                    })

                //return true;

                }

                if (!isNaN(parseInt(id))) {
                    // alert(parseInt(id) + ' testtt');
                   // zbNewIndex(null);
                    data.saveChanges();
                    currentBrojid(parseInt(id));
                    //upisNavigator.currentZbirkaIDT(zbIndex);
                    upisNavigator.ulazIDBroj(parseInt(id))
                    regNav.ulazIDBroj(parseInt(id))
                    //return data.getExportFullKartica(startID, fullKartica).then(getKartica);
                } else {
                    return;
                }
            }
        }

 
    }

    //function refresh() {
            
    //     return data.getExportFullKartica(43,fullKartica);

        //}


    function setTimeoutKomboIDBroj() {
            setTimeout(function () {
                komboIDBroj(null);
            }, 0);
    }

    //function setTimeoutZbIndex() {
    //    setTimeout(function () {
    //        zbIndex('');
    //    }, 0);
        
    //}

    function promijeniZapis(noviIDBroj, funkError) {
        $(".Overlay").addClass("visible");
        data.saveChanges();
        currentBrojid(noviIDBroj);
        return data.getExportFullKartica(noviIDBroj, transferKartica)
            .then(function () {
                getKartica(noviIDBroj).then(function () {
                    router.navigate(adresaZaUpis + noviIDBroj, false);
                    lockInput();
                    $(".Overlay").removeClass("visible");
                })
            })
            .fail(function (error) { alert(funkError + ": " + error.message); });
    }
    
    /// za upload
    function slotModel  () {
        var that = {};
        that.imageFile = ko.observable();
        that.imageObjectURL = ko.observable();
        that.imageBinary = ko.observable();
        that.theFile = ko.observable();
        that.odabrano = ko.observable();

        that.fileSize = ko.computed(function () {
            var file = this.imageFile();
            return file ? file.size : 0;
        }, that);

        that.firstBytes = ko.computed(function () {
            if (that.imageBinary()) {
                var buf = new Uint8Array(that.imageBinary());
                var bytes = [];
                for (var i = 0; i < Math.min(10, buf.length) ; ++i) {
                    bytes.push(buf[i]);
                }
                return '[' + bytes.join(', ') + ']';
            } else {
                return '';
            }
        }, that);

        return that;
    }



    ///// za upis navigator
    function navFirst() {
        //manualNav = true;
        //recIndex(0);
        //currentBrojid(selZaKomboOdabirInvBroja()[recIndex()]['ID_Broj']);
        upisNavigator.navFirst().then(function (brojid) {
            currentBrojid(brojid);
            regNav.ulazIDBroj(brojid);
        })

    }
    ///// za upis navigator
    function navLast() {
        upisNavigator.navLast().then(function (brojid) {
            currentBrojid(brojid);
            regNav.ulazIDBroj(brojid);
        })
    }
    ///// za upis navigator
    function navPrev() {
        upisNavigator.navPrev().then(function (brojid) {
            currentBrojid(brojid);
            regNav.ulazIDBroj(brojid);
        })
    }
    ///// za upis navigator
    function navNext() {
        upisNavigator.navNext().then(function (brojid) {
            currentBrojid(brojid);
            regNav.ulazIDBroj(brojid);
        })
    }




    function regPrev() {
        
        regNav.regPrev().then(function (brojid) {
            currentBrojid(brojid);
            upisNavigator.ulazIDBroj(brojid);
        })
    }
        ///// za upis navigator
    function regNext() {
        regNav.regNext().then(function (brojid) {
            currentBrojid(brojid);
            upisNavigator.ulazIDBroj(brojid);
        })
    }


    ////////////////////////////////////////////////////////////
    function getKartica(y) {
        var ber = Q.defer();
        var brojid = y;
       
        console.log('getKartica' + currentBrojid());
        ////u upisNavigator!!
        if (currentBrojid() != undefined) {
            if (!isNaN(parseInt(currentBrojid()))) {
              
                brojid = parseInt(currentBrojid());
              // alert("parseInt " + brojid);
            }
        } else {
            //alert("startid");
            brojid = y;// startID();
        }

 

 

        ///Napuni podatke za forme
        ////sve kaj je vezano za tbl_Kartica ide preko nje...
        $.each(vm.forme(), function (i, p) {
            //alert(i + vm.forme()[i]['title']());

            if (p['tablica']() != "tbl_Kartica") {
                p['data'](transferKartica()[0][p['tablica']()]());
                if (p['tablica']() == "tbl_Media_collector") {
                    selMmedia(p['data']());//posebno za identity fotku sa strane
                }
                p['recordCount'](p['data']().length);
            } else {
                    p['recordCount'](1);

            }

        });

        //posebno za K1 katalošku
        if (!transferKartica()[0]['tbl_Kataloska_jedinica']()) {
            var k1=ko.observable('');
            selK1('');
        } else {
            selK1(transferKartica()[0]['tbl_Kataloska_jedinica']().k1());
        }

 //// dio ua upis Navigaciju
        if (selZaKomboOdabirInvBroja().length == 0 || !selZaKomboOdabirInvBroja) {
            //alert("getnavrekordz" + zbIndex());
            data.getNavRecords(zbIndex(), selZaKomboOdabirInvBroja).then(function () { recMax(selZaKomboOdabirInvBroja().length); });
        };



        //// dio ua upis Navigaciju
       // alert(manualNav);
        if (!manualNav) {
            //alert('ček malo broj zapisa...');
            recIndex(findFirst(selZaKomboOdabirInvBroja(), currentBrojid()));
        };



        manualNav = false;

        fullKartica(transferKartica());
        isLoading(false);
        if (fullKartica().length > 0) {
            ber.resolve(true)
        } else {
            ber.resolve(false);
        }


        return ber.promise;
    }

    /// u upisNavigaciju






    /// ne znam još...
    function findFirst(aray, term) {
        
        var brojid = ko.utils.arrayFirst(selZaKomboOdabirInvBroja(), function (item) {
            return item.ID_Broj == term;
        })

        return selZaKomboOdabirInvBroja.indexOf(brojid);
    }

    ///sredit refreshanje za upisNavigaciju i regNavigaciju
    function newRec(zb) {
        var inv = prijedlogInvBroja();
        var neIdiNaPrvi = true;
        //alert(!neIdiNaPrvi + " st1");
            
        data.postCreateNoviZapis(zb, inv)
        .then(function (noviIDBroj) {
            //alert('gotov dataservice');
            forceSrediZbirka(true);
            zbIndex(zb);
            
            currentBrojid(noviIDBroj);

            
        }).then(function () { neIdiNaPrvi = false; });


    }


    function postaviFokusUDF(tmpl,fild) {
        //$('html, body').animate({
        //alert(tmpl + ' ' +fild);
        var p1 = $('#divScroll').height();
        var p3 = $('#divScroll').scrollTop();
        var p2 = $('#sidro' + tmpl).offset().top + $('#sidro' + tmpl).height();
        //alert(p1 + ' ' + p2 + ' ' + p3);


        var pRez = -1;

        if (p2 > p3 && p2 <= 0) {
            pRez = p2 - p3;
        } else {
            pRez = p3 + p2;
        }

        $('#divScroll').animate({
            scrollTop: pRez - (p1 / 2)
        }, 700);


        //if (p2 > p1) {
        //    $('#divScroll').animate({
        //        scrollTop: p2
        //    }, 1300)
        //}
        if (tmpl != 'tmpIzrada') {
            $('#sidro' + tmpl).siblings().find('input:first').focus();
        } else {
            $('#sidro' + tmpl).siblings().find('input[id*=' + fild + ']').first().focus();
        }

    }

    function postaviFokus(item,event){
        var p1 = $('#divScroll').height();
        var p3 = $('#divScroll').scrollTop();
        var p2 = $('#sidro' + item.tmpl()).offset().top + $('#sidro' + item.tmpl()).height();
        //alert(p1 + ' ' + p2 + ' ' + p3);

        var pRez = -1;

        if (p2 > p3 && p2 <= 0) {
            pRez = p2 - p3;
        } else {
            pRez = p3 + p2;
        }

        $('#divScroll').animate({
            scrollTop: pRez - (p1 / 2)
        }, 700);

        //if (p2 > p1) {
        //    $('#divScroll').animate({
        //        scrollTop: p2
        //    }, 1300);
        //}
        

        //$('html, body').animate({
        //    scrollTop: $('#sidro' + item.tmpl()).offset().top
        //}, 1000);
        var tmpInput = $('#sidro' + item.tmpl()).siblings().find('input:first');
        if (tmpInput.length >0) {
            $('#sidro' + item.tmpl()).siblings().find('input:first').focus();
        } else {
            tmpInput = $('#sidro' + item.tmpl()).siblings().find('textarea:first');
            if (tmpInput.length>0) {
                $('#sidro' + item.tmpl()).siblings().find('textarea:first').focus();
            }
        }
    }


    function minimize(item, event) {
        event.stopPropagation();
        var togClass = $(event.target).attr('class');
        if (togClass === 'glyphicon glyphicon-chevron-down buttonSecondary hideIt') {
            togClass = 'glyphicon glyphicon-chevron-up buttonSecondary hideIt';
            $(event.target).attr('class', togClass);
            $(event.target).css('color', 'silver');
        } else {
            togClass = 'glyphicon glyphicon-chevron-down buttonSecondary hideIt';
            $(event.target).attr('class', togClass);
            $(event.target).css('color', 'silver');
        };
        var wB = $(event.target).parent().siblings(".contentBoxBody");
        wB.slideToggle();
        event.preventDefault();
    }







    //staro... možda će se još koristiti
    function firstRow(x) {
        vm.forme()[x].odabrano(0);

        // alert(x + ' ' + vm.forme()[x].odabrano() + ' ' + t);
        return true;
    }

    function lastRow(x) {
        vm.forme()[x].odabrano(vm.forme()[x].recordCount()-1);
        // alert(x + ' ' + vm.forme()[x].odabrano() + ' ' + t);
        return true;
    }

    function nextRow(x) {
        if (vm.forme()[x].odabrano()+1 < vm.forme()[x].recordCount()) {
            var t = vm.forme()[x].odabrano();
            t++;
            vm.forme()[x].odabrano(t);
        }
        // alert(x + ' ' + vm.forme()[x].odabrano() + ' ' + t);
        return true;
    }

    function prevRow(x) {
        if (vm.forme()[x].odabrano() > 0) {
            var t = vm.forme()[x].odabrano();
            t--;
            vm.forme()[x].odabrano(t);
        }
        // alert(x + ' ' + vm.forme()[x].odabrano() + ' ' + t);
        return true;
    }

    ///staro??
    function delRecord(x, y) {
        if (katalogMode || upisNavigator.recMax()==1) return false;
        var x = confirm('Želite li izbrisati zapis?');
        if (x) {
            var oldIDBroj = currentBrojid();

            if (upisNavigator.recIndex() > 1) {
                navPrev();
            } else {
                navNext();
            }
 
            var tablice = ['tbl_Izrada', 'tbl_Mjere', 'tbl_Nazivi', 'tbl_Inventarizacija', 'tbl_Kataloska_jedinica', 'tbl_Kljucne_rijeci', 'tbl_Knjiga_ulaska', 'tbl_Media_collector', 'tbl_Naslovi', 'tbl_Natpisi_i_oznake', 'tbl_Ocuvanost', 'tbl_Pripadnosti', 'tbl_Reference', 'tbl_Sadrzaj', 'tbl_Vrijednosti', 'tbl_U_Materijali_u_dijelovima'];
            $.each(tablice, function (indes,pData) {
                data.delRowsByID(pData, oldIDBroj);
            })

            data.delRowByID("tbl_Kartica", oldIDBroj).then(function () {
                data.saveChanges().then(function () {
                    upisNavigator.forceRefreshPoIDBroju();
                })
            })
        }
        



    }


    function deleteZapisSubform(x) {
        if (katalogMode) return false;
        if (x.data().length > 0) {
            var tablica = x.tablica();
            var odabrano = x.odabrano();

            return brisiZapis(x).then(function () {


                x.recordCount(x.data().length);
                if (odabrano + 1 >= x.recordCount()) {
                    x.odabrano(x.recordCount() - 1);
                }
                x.data.valueHasMutated();
            })
        } else {
            return false;
        }



        
        function brisiZapis(x) {
            var ber = Q.defer();


            var id=-1;//x()['data'](x()['odabrano']())['ID']();
            if (tablica == 'tbl_Media_collector') {
                id = x.data()[odabrano]['AutoBroj']();
            } else {
                id = x.data()[odabrano]['ID']();
            }
            data.delRowByID(tablica, id).then(function () { ber.resolve(true) });

            return ber.promise;
        }

    }




    function refreshNavigacijuZaRegistraciju() {
        return regNav.navigacijaZaRegistraciju(zbIndex()).then(function () {
            regNav.podaciZaRegistraciju()[0].sync(currentBrojid());
        })


    }





    /// u upload...
   function upload  (data) {
        //alert(data.imageFile());
        var url = 'api/FileUpload';

        imeZbirke().then(function (imeZ) {

            var formData = new FormData();
            formData.append("file", data);
            formData.append("pather", imeZ[0]['Zbirka']);
            return $.ajax({
                url: url,
                type: 'POST',
                // Form data
                data: formData,
                //Options to tell JQuery not to process data or worry about content-type
                cache: false,
                contentType: false,
                processData: false
            }).success(function () { console.log('didit'); });


        })
        //console.log(formData[0]);

    }


    /// možda u dataService...
   function promjenaIdentity (obj, event) {

       if (event.originalEvent) { //user changed
           //if (obj['MC_Identity']()) {
           //    return data.getJsonPOSTPromijeniIdentity(obj['ID_Broj'](), obj['ID_Sub_Broj']())
           //   // .then(function () { selMmedia([]);return data.getFullMmedia(currentBrojid(), selMmedia); }).then(function () { postaviPrviMedia(); return true; });
           //}

           if (obj['MC_Identity']()) {
               
               //saveChanges(selMmedia).then(function(){return prviDio();}).then(function () { return saveChanges(selMmedia); })
               //.then(function () { return drugiDio(); }).then(function () { return saveChanges(selMmedia); });

               return prviDio()
                   .then(function (x) { return saveX(x); })
                   .then(function (x) { return drugiDio(x); })
                   .then(function (x) { return saveX(x); })
                   //.then(function (x) { return treciDio(x); })
                   //.then(function (x) { return saveX(x); })
                   .then(function () { return data.getFullMmedia(currentBrojid(), selMmedia); }).then(function () { postaviPrviMedia();return true; });
            }


           } else { // program changed
           alert('nekaj drugo');
       }

       function postaviPrviMedia() {
           var x = 0;
           $.each(forme(), function (index,value) {
               //alert(index + ' ' + value.title());
               if (value.title() == "Media") {
                   x = index;
               }
           })
           forme()[x]['odabrano'](0);
       }

       function getEntities() {
           var pro = Q.defer();
           var y = selMmedia().length;
           var n = new Array();
           for (var i = 0; i < y; i++) {
               n.push(selMmedia()[i]);
               if (i == y - 1) {
                   pro.resolve(n);
                   //console.log(n);
               };

           };
           //alert('getEnt' + ' ' + y + ' ' + n.length);
           
           return pro.promise;
       }

       function saveX(x) {
           var pro = Q.defer();
           //alert('saveX');
           getEntities().then(function (n) {
               data.saveChangesLimited(n).then(function () {
                   pro.resolve(x);
               });
           }).fail(function () { alert('kriivoo'); });
           return pro.promise;
       }

       function treciDio(x) {
           console.log('trechy');
           var pro = Q.defer();
           selMmedia()[x]['ID_Sub_Broj'](1);
           pro.resolve(x);
           return pro.promise;
       }

       function prviDio() {
           var pro = Q.defer();
           var x = -1;
           
           var y = selMmedia().length;
           var xMax = selMmedia()[y-1]['ID_Sub_Broj']();
           var zz = 0;
           for (var i = y-1; i > -1; i--) {
               zz = selMmedia()[i]['ID_Sub_Broj']();
               if (selMmedia()[i]['AutoBroj']() == obj['AutoBroj']()) {
                   selMmedia()[i]['MC_Identity'](true);
                   x = i;
                   selMmedia()[i]['ID_Sub_Broj'](i +xMax+ 22);
               } else {
                   selMmedia()[i]['MC_Identity'](false);
                       selMmedia()[i]['ID_Sub_Broj'](i +xMax+ 22);
               }

               if (i == 0) {
                   pro.resolve(x);
               }
           }
           return pro.promise;
       }
       function drugiDio(x) {
           var pro = Q.defer();
           var n = 2;
           var y = selMmedia().length;
 
           for (var i = 0; i < y; i++) {

               if (i != x) {
                   selMmedia()[i]['ID_Sub_Broj'](n);
                   n++;
               } else {
                   selMmedia()[i]['ID_Sub_Broj'](1);
               }

               if (i == y-1) {
                 
                   pro.resolve(x);
                   
               }
           }

           
           return pro.promise;
       }

       return true;
   }


    /// možda u uploadModul...
    function uploadImage(file) {

 
        console.log(file);
 
        for (var i = 0; i < file.length; i++) {
            var x = new slotModel();
            x.imageFile(file[i].name);
            x.imageObjectURL(window.URL.createObjectURL(file[i]));
            x.fileSize = file[i].size;
            x.theFile(file[i]);
            x.odabrano(true);
            photke.push(x);
        }
        
    };

    /// možda u uploadModul...
    function uploadStart() {
        return uploadaj()
            .then(function () {
                spremiMmediju()
                    .then(function () {
                        popraviMmediju()
                            .then(function (reza) {
                                postaviMmediju(reza)
                                    .then(function () {
                                        //brojKomadaZaSubform('tmpMedia');
                                        photke.removeAll();
                                    })
                            })
                    })
                    
            })

        function postaviMmediju(reza) {
            var ber = Q.defer();
            //alert('idempopravljat' + reza());
            selMmedia(reza());
            forme()[mmediaFormaIndex]["data"](reza());
            forme()[mmediaFormaIndex]["recordCount"](reza().length);
            //console.log(selMmedia().length + ' ' + reza().length);
            if (selMmedia().length == reza().length) {
                ber.resolve(selMmedia().length);
            }
            while (selMmedia().length != reza().length) {
                //
                if (selMmedia().length == reza().length) {
                    ber.resolve(selMmedia().length);
                }
            }

            return ber.promise;
        }

        function popraviMmediju() {
            var ber = Q.defer();
            //alert('idempopravljat');
            data.fixMmediju(currentBrojid()).then(function (reza) {  ber.resolve(reza); }).fail(function () { alert('nijeprošo'); });
            return ber.promise;
        }

        function spremiMmediju() {
            var ber = Q.defer();
            // alert('idemspremat');
            imeZbirke().then(function (imeZ) {
                data.createMmediju(currentBrojid(), imeZ[0]['Zbirka'], photke)
                    .then(function () { ber.resolve(true); })
                    .fail(function () { alert('nijeprošo'); });
            })
            return ber.promise;
        }

        function uploadaj() {
            var ber = Q.defer();
            for (var i = 0; i < photke().length; i++) {
                if (photke()[i]['odabrano']()) {
                    upload(photke()[i]['theFile']());
                }
            }
            ber.resolve(true);
            return ber.promise;
        }


    }



    function spremiForme(xdata) {
        //spremi parametar
        var tmpForme = "";
        var i = 0;
        ko.utils.arrayForEach(forme(), function (item) {
            if (i > 0) {
                tmpForme +=  "#" + item['ID']() ;
            }else{
                tmpForme +=  item['ID']() ;
            }
            i++;
        })

        data.parametri.upisiParametar("S_WEB_FORME", tmpForme);

        lockInput();
    }




    /// možda upload..
    function imeZbirke() {
        var ferd = Q.defer();
        var imeZ=ko.observable("");
        data.getImeZbirke(currentBrojid(), imeZ)
        .then(function () { ferd.resolve(imeZ()); })
        

        return ferd.promise;
    }



    function kojiSadrzaj(p1, data) {
        var retVar = false;
        //alert(p1 + data);
        console.log(data);
        if (p1 == 'mjesto' && data['SDR_IDT_Vrsta']() == 3) retVar = true;
        if (p1 == 'sadrzaj' && data['SDR_IDT_Vrsta']() == 6) retVar = true;
        if (p1 == 'vremenska' && data['SDR_IDT_Vrsta']() == 2) retVar = true;
        if (p1 == 'oiio' && data['SDR_IDT_Vrsta']() == 1) retVar = true;
        if (p1 == 'oiio' && data['SDR_IDT_Vrsta']() == 4) retVar = true;
        if (p1 == 'oiio' && data['SDR_IDT_Vrsta']() == 5) retVar = true;
        
        return retVar;

    }

    ///??
    function retTrue(data) {
        alert(data['MC_Identity']() + "retTrue");
        data['MC_Identity'](data['MC_Identity']());
        return true;
    }



    ///za brisanje
    function ZaBrisat_brojKomadaZaSubform(x) {
        var y = 0;
        //alert('prošo za broj');
        var frmOdabrano = -1;
        // alert(x + vm.selNazivi().length);
        for (var i = 0; i < forme().length; i++) {
            
            if (forme()[i]['tmpl']() == x) {
                frmOdabrano = i;//alert(forme()[i]['tmpl']() + ' ' + x);
            }
        }


        switch (x) {
            case 'tmpNazivi':
                //alert(x + vm.selNazivi().length);
                y = vm.selNazivi().length;
                break;
            case 'tmpNaslovi':
                //alert(x + vm.selNaslovi().length);
                y = vm.selNaslovi().length;
                break;
            case 'tmpPodOznake':
                //alert(x + vm.selNaslovi().length);
                y = vm.selPodOznake().length;
                break;
            case 'tmpIzrada':
                //alert(x + vm.selIzrada().length);
                y = vm.selIzrada().length;
                break;
            case 'tmpMaterijali':
                //alert(x + vm.selMat().length);
                y = vm.selMat().length;
                break;
            case 'tmpMjere':
                //alert(x + vm.selMjere().length);
                y = vm.selMjere().length;
                break;
            case 'tmpMedia':
                //alert(x + vm.selMjere().length);
                y = vm.selMmedia().length;
                break;
            case 'tmpNalazista':
                //alert(x + vm.selMjere().length);
                y = 1;
                break;
            case 'tmpInventarizacija':
                //alert(x + vm.selMjere().length);
                y = vm.selInventarizacija().length;
                break;
            case 'tmpStanje':
                //alert(x + vm.selMjere().length);
                y = vm.selOcuvanost().length;
                break;
            case 'tmpOpis':
                //alert(x + vm.selMjere().length);
                y = 1;
                break;
            case 'tmpNabava':
                //alert(x + vm.selMjere().length);
                y = 1;
                break;
            case 'tmpSmjestaj':
                //alert(x + vm.selMjere().length);
                y = 1;
                break;
            case 'tmpRazdoblje':
                //alert(x + vm.selMjere().length);
                y = vm.selKljucneRijeci().length;
                break;

            default:
                alert('defo');
                y = 0;
        }

        if (frmOdabrano > -1 && y > 0) {
           // alert(frmOdabrano);
            forme()[frmOdabrano]['recordCount'](y);
        }
        return y;
    }

    ////ostaje
    function createZapisSubform(x) {
        //console.log(x);
        if (katalogMode) return false;
        return napraviZapis(x).then(function () {
            x['recordCount'](x['data']().length);
            //alert("gotohfofo");
        }).then(function () {
            x.odabrano(x['recordCount']()-1);
        });

        function napraviZapis(x) {
            var ber = Q.defer();
            if (x.tablica() == 'tbl_Media_collector') {
                //data.createZapisExt(opcija, currentBrojid(), selMjere).then(ber.resolve(true));
                mmediaFormaIndex=forme.indexOf(x);
                
                
                $("#uploadStart").modal('show');
                ber.resolve(false);
            } else {
                data.createZapisExt(x.tablica(), currentBrojid(), x.data).then(ber.resolve(true));
            }
            return ber.promise;
        }
    }


    ////maknut??
        function setSelected(x, y) {
            //if (vm.forme()[y].cont(x)) {
                vm.forme()[y].odabrano(x);
            //}
            //alert(vm.forme()[y].odabrano());
        };



    ///maknut??
        function select(item) {
            //the app model allows easy display of modal dialogs by passing a view model
            //views are usually located by convention, but you an specify it as well with viewUrl
            item.viewUrl = 'views/detail';
            app.showDialog(item);
        }


    }
);