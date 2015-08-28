define(['durandal/app', 'services/logger', 'services/dataService', 'plugins/router', 'viewmodels/popupVrijeme', 'viewmodels/popupMjere','services/pretrazivanjeRefineri'],
    function (app, logger, data, router, popupVrijeme, popupMjere,refinersService) {

    var my = this || {};


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
 
    var sifra= ko.observable("x");

    var currentPolje= ko.observable('tbl_Izrada.IZR_IDT_Mjesto');
    var currentVrijednost= ko.observableArray([]);
    var currentTTablica= ko.observable('Mjesta');
    var vrijednostPolja= ko.observable(7510);
    var rezultati= ko.observableArray([]);
    var totalCount= ko.observable(0);
    var tabIndex= ko.observable(1);
    var checkAll= ko.observable(true);
    var firstLoad= true;
    var odabrano= ko.observableArray([]);
    var podIDT= ko.observableArray([]);



    var searchHistoryOpened= ko.observable(false);
    var myMessage = ko.observable("Spremljeni upiti"); // Initially blank

    //adresaAPI: 'http://localhost:61950/api/DVALTValuesNOEF',
    //var adresaAPI = 'api/DVALTValuesNOEF';
    var adresaAPI = 'api/WebApiSQL';

    var title = 'Pretraživanje';

    /////////////////////////////////////////////////////////////////////////////počinje VM
    var vm = {
 
        title: title,
 

 
        imeUpita: imeUpita,
        opisUpita: opisUpita,
        kopirajUpit: kopirajUpit,
        spremiUpit: spremiUpit,
        brisiUpit: brisiUpit,
        

        skiniDoc: skiniDoc,
        skiniPDF:skiniPDF,
        downloadURLOLD: downloadURLOLD,
        downloadURL:downloadURL,




       
       
        selectUpit: selectUpit,

        odabranUpitID: odabranUpitID,

        msDoc: msDoc

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


    return vm;

    
});