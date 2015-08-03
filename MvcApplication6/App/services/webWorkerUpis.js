
//importScripts('../../Scripts/breeze.debug.js');
importScripts('../../Scripts/jqueydemo.js', '../../Scripts/q.js', '../../Scripts/require2.js');
define('jquery', function () { return jQuery; });
require(
{
    baseUrl: "..",
},
function(){
    var my = my || {}; // root namespace for my stuff
    


    var Selects = {};
    var adresaAPI = '../../api/WebAPISQL';
    
       
    var unoTest = "";


    function getWebAPISQL(i1, returnValue) {
        //i1
        //if (i1 == 1)//defStruktura
        //if (i1 ==2)//defVrijeme
        //if (i1 == 3)//getUpiti
        //if (i1 == 4)//getRefiners
        //if (i1 == 5)//gettermBucket
        var req = $.ajax({
            type: 'GET',
            url: adresaAPI + '?i1=' + i1 + '&i2=2&i3=3',
            dataType: 'json',
            contentType: 'application/json',
            success: function (response, text) {
                //returnValue = response;
                Selects = response;
            },
            error: function (text, error) {

                console.log(error);
               
            },
            cancel: function () {
               
            }
        })

        return req;
    }

    var load = function () {

        return getWebAPISQL(10,Selects);
      
    }

 

    var toRet = {
        unoTest: unoTest,
        load:load
    }
        
    load().then(function () {
        var tranny = JSON.stringify(Selects);
        postMessage(tranny);
    })



})





   
