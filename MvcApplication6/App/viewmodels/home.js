define(['services/logger', 'services/dataService', 'plugins/router'], function (logger, data, router,upisNavigator) {
    var title = 'Početna';

	
	
	
    var treeNodes = ko.observableArray([]);

    var cTest = ko.observableArray();
    var pocetnaZbirka = ko.observable(-1);
    var firstLoad = true;
    var sekFondovi = ko.observableArray([]);

    var self = {};


    var nodeModel = function () {
        var that = this;
        that.IDT = ko.observable();
        that.Pojam = ko.observable();
        that.podNodes = ko.observableArray([]);
        that.isExpanded = ko.observable();
        that.pocetna = ko.observable();
        that.prviZapis = ko.observable();
        that.zadnjiZapis = ko.observable();
        that.brojZapisa = ko.observable();
        that.brojPodZapisa = ko.observable();
        that.toggleVisibility = function () {
            that.isExpanded(!that.isExpanded());
        };
    };




    var toggleVisibility = function (data) {
        console.log(data);
        if (ko.isObservable(data['isExpanded'])){
            data.isExpanded(!data.isExpanded);
        }else {
            var c = ko.observable(!data.isExpanded);
            data.isExpanded=c;
        }
        return treeNodes.valueHasMutated();
    };



    var testCLR = function () {
        //alert('ffgf');
        var url = 'api/GetRowNumber';

        //var formData = new FormData();
        //formData.append("file", data.imageFile());

        $.ajax({
            type: 'POST',
            url: url,
            dataType: 'json',
            //int nID, String arrParamPolje, string sNazivPolja, string sKategorija, string vVrstaOdgovornosti, Boolean B_PREZIME_IME,int L_SORT_IZRADA
            data: JSON.stringify({ 'nID': '117', 'arrParamPolje': 'r#,{razmak}#{NoviRed}#r#r#r#r#r#r#r#r#r#r#r#r#r#r#r#r', 'sNazivPolja': 'IZR_IDT_Mjesto_Pojam', 'sKategorija': 'ktg_osb', 'vVrstaOdgovornosti': 'hhh', 'B_PREZIME_IME': true, 'L_SORT_IZRADA': 1 }),
            contentType: 'application/json',
        }).success(function () { alert('didit'); });
    };



    var setPocetnaZbirka = function (pdata) {

        if (!pdata.IDT != pocetnaZbirka()) {

            //var mijenjaj = ko.observableArray([]);
            //data.postaviPocetnuZbirku(pdata.IDT,mijenjaj)
            //alert(pocetnaZbirka() + "   " + pdata.IDT());
            pocetnaZbirka(pdata.IDT);
            //alert(pocetnaZbirka());
            var tempPZ = "";
            var zaSejvat = ko.observableArray([]);
            $.each(data.parametriZaKorisnika(), function (index, pdata) {
                //alert(pdata.Parametar());S_DEFAULT_ZBIRKA
                //console.log( "S_DEFAULT_ZBIRKA" ==pdata.Parametar());
                if (pdata.Parametar().toUpperCase() == "S_DEFAULT_ZBIRKA") {
                    tempPZ = pdata.Vrijednost();
                    //alert('prijeE! ' + tempPZ);
                    if (tempPZ.substr(0, 1) == "*") {
                        pdata.Vrijednost('*' + pocetnaZbirka());
                        zaSejvat.push(pdata);
                        data.saveChangesLimited(zaSejvat());

                    }
                    else {
                        var pLok = tempPZ.indexOf('#' + pocetnaZbirka() + '#');
                        if (pLok > -1) {
                            //alert(tempPZ + ' prije');
                            pdata.Vrijednost('#' + pocetnaZbirka() + tempPZ.split('#' + pocetnaZbirka() + '#')[0] + '#' + tempPZ.split('#' + pocetnaZbirka() + '#')[1]);
                            //alert(pdata.Vrijednost() + ' poslije');
                            zaSejvat.push(pdata);
                            data.saveChangesLimited(zaSejvat());

                        } else {
                            var xtmp=pdata.Vrijednost();
                            pdata.Vrijednost('#' + pocetnaZbirka() + xtmp);
                            zaSejvat.push(pdata);
                            data.saveChangesLimited(zaSejvat());
                        }
                    }
                }
            })
        }
    }


 
    var FisExpanded = function (data, event) {
        event = event || window.event;
        var target = $(event.currentTarget) || $(event.srcElement);
        //var target = $(event.target);
        if (target.is("li")) {
            //console.log("LI");
            //target.children().find("ul").toggle();
            target.find("ul").toggle();
        }
        event.stopPropagation();

    }

    //$("ul").click(handler).find("ul").hide();




    var gotoZapis = function (zaLinkID) {
        var adresaZaUpis = "upisPodataka";
        var adresa = "#" + adresaZaUpis + zaLinkID;
        router.navigate(adresa, true);
        return true;

    };


    var fillTreeNodes = function () {
        var tempPZ = "";

        var tempNodes;

        data.getWebAPISQL(8,-1, tempNodes).then(
            function (tempNodes) {
                treeNodes(tempNodes);
            })


        if (tempPZ.substr(0, 1) == "*")
        {
            pocetnaZbirka(tempPZ.substr(1));
        }
        else
        {
            pocetnaZbirka(tempPZ.split('#')[1]);
        }        
    }

    var testPodnodes=function(){
        podNodes(treeNodes, 2);
    }

    var podNodes = function (tada,nad) {
        var a = ko.utils.arrayFilter(tada, function (item) {
            return item.Nad_IDT == nad;
        })
        if (a.length > 0) {
            $each(a(), function (index, data) {
                console.log(a);
                podNodes(a, data['IDT']);
            })
        }
    }

    var compositionComplete = function () {
        // alert("cmpaGotov");
        logger.log(title + ' View compcomplActivated', null, title, true);
        if (firstLoad) {
            //data.loadedTerminology(true);
            data.loadTerminologyWebWorker();
            firstLoad = false;
        }
        fillTreeNodes();
    }
 
   
    var vm = {
           
        activate: activate,
        canDeactivate: canDeactivate,
        testCLR:testCLR,
        Selects: data.Selects,
        getTerminoloskeNad: data.getTerminoloskeNad,
        cTest: cTest,
        treeNodes: treeNodes,
        fillTreeNodes: fillTreeNodes,
        mjestaZaTreeView: data.getMjestaZaTreeView,
        getZbirkeZaTreeView: data.getZbirkeZaTreeView,
        toggleVisibility: toggleVisibility,
        FisExpanded: FisExpanded,
        title: title,
        testPodnodes: testPodnodes,
        pocetnaZbirka:pocetnaZbirka,
        setPocetnaZbirka:setPocetnaZbirka,
        gotoZapis:gotoZapis,
        compositionComplete: compositionComplete,
        sekFondovi:sekFondovi,

        router: router,
        userName: data.userName,
        password: data.password,
        loginTry: loginTry,
        isAuth: isAuth,
        logout: logout,
        rUserName: data.realUserName,
        rIsAuth: data.realIsAuth,
        rUserRoles: data.realUserRoles
    };

    return vm;


    function loginTry() {
        data.login(data.userName(), data.password()).then(function () {
            data.getUserName();
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

    function compositionComplete() {
 
    }
    //#region Internal Methods
    function activate() {
        logger.log(title + ' View Activated', null, title, true);
        return true;
    }




    function canDeactivate() {
        //the router's activator calls this function to see if it can leave the screen
        ////logger.log(title + ' View DEActivated', null, title, true);
        //if (data.loadedTerminology()) {
            return true;//app.showMessage('Are you sure you want to leave this page?', 'Navigate', ['Yes', 'No']);
        //} else {
        //    return false;
        //}
    }
    //#endregion
});