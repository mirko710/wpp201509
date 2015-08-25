define(['plugins/dialog', 'services/dataService'], function (dialog, data) {

    var realFakeMjere = ko.observableArray([]);
    var fakeUpitRow;
    function fakeMjere(mjera, mjera2, operator, id, jedinica, dio, dimenzija) {
        this.MJR_Mjera = ko.observable(mjera || 0);
        this.MJR_Mjera2 = ko.observable(mjera2 || 0);
        this.MJR_Operator = ko.observable(operator || 0);
        this.ID = ko.observable(id || 334);
        this.MJR_IDT_Jedinica_mjere = ko.observable(jedinica || null);
        this.MJR_IDT_Mjereni_dio = ko.observable(dio || 49);
        this.MJR_IDT_Dimenzija = ko.observable(dimenzija || null);
    }

    var MjereOperatori = [{ 'tekst': '=', 'vrijednost': 0 }, { 'tekst': 'manje od', 'vrijednost': 1 }, { 'tekst': 'veće od', 'vrijednost': 2 }, { 'tekst': 'između', 'vrijednost': 3 }];
    var MjereOperators = ['=', 'manje od', 'veće od', 'između'];

    var opened = false;
    //var dialog2;
    var alertModel=function(){
        this.poruka = ko.observable('');
        this.visible = ko.observable(false);
    }
    var alertMjereModel = function (errorArray) {
        
        $.each(errorArray,function(i,p){
            var tmp = new alertModel();
            tmp.poruka(p);
            alertMjere.push(tmp);
        })
    }
    var alertMjere = ko.observableArray([])
    var firstLoad = true;


    var popupMjere = function (title) {
        this.title = title;
        this.init = init;
        this.firstLoad = firstLoad;
        this.provjeriMjere = provjeriMjere;
        this.MjereOperatori= MjereOperatori;
        this.MjereOperators=MjereOperators;
        this.fakeMjere=fakeMjere;
        this.realFakeMjere=realFakeMjere;
        this.mapMjereRedak=mapMjereRedak;
        this.provjeriMjere = provjeriMjere;
        this.Selects = data.Selects;
        this.alertMjere = alertMjere;
        this.opened = opened;
    }


    function init() {
        if (firstLoad) {
            fejk = new fakeMjere();
            realFakeMjere.push(fejk);
            realFakeMjere()[0]['MJR_IDT_Mjereni_dio'](49);
            alertMjereModel(['','','','','','']);
            firstLoad = false;
            opened = false;
        }
    }


    function mapMjereRedak(mjereRedak) {
        var z = null;
        if (typeof mjereRedak === 'string') {
            z = JSON.parse(mjereRedak);
        } else {
            z = mjereRedak;
        }
        //var z = JSON.parse(mjereRedak);
        var tmpM = new fakeMjere(z.MJR_Mjera,
                                z.MJR_Mjera2,
                                z.MJR_Operator,
                                z.ID,
                                z.MJR_IDT_Jedinica_mjere,
                                z.MJR_IDT_Mjereni_dio,
                                z.MJR_IDT_Dimenzija);

        return tmpM;
    }



    //function provjeriMjere(redakUpitaMjere) {
    function provjeriMjere() {
        var valid = true;
        //dio,dim,mjera,mjera2,jedinica,mjera2manjaod mjere1
        var validBinary = 0;
        var regMjere = /^[+-]?((\d+(\.\d*)?)|(\.\d+))$/;
        var tmp = realFakeMjere()[0];
        var rez = 3;
        var V4 = '';
        var V1 = '';

        if (tmp['MJR_IDT_Mjereni_dio']() == null || tmp['MJR_IDT_Mjereni_dio']() < 1) {
            validBinary += 1
        }
        if (tmp['MJR_IDT_Dimenzija']() == null || tmp['MJR_IDT_Dimenzija']() < 1) {
            validBinary += 2
        }


        //rez = isValidDate(realFakeMjere()[0]);
        valid = rez != -1;
        if (!regMjere.test(tmp['MJR_Mjera']()) || tmp['MJR_Mjera']() <= 0) {
            validBinary += 4
        }
        if (tmp['MJR_Operator']() == 3) {
            if (!regMjere.test(tmp['MJR_Mjera2']()) || tmp['MJR_Mjera2']() <= 0) {
                validBinary += 8
            }
        }

        if (tmp['MJR_IDT_Jedinica_mjere']() == null || tmp['MJR_IDT_Jedinica_mjere']() < 1) {
            validBinary += 16
        }
        if (tmp['MJR_Operator']() == 3) {
            if (validBinary == 0) {
                //alert((tmp['MJR_Mjera2']()+1).toString() + " %%% " + (tmp['MJR_Mjera']()+1).toString());
                if (parseInt(tmp['MJR_Mjera2']()) <= parseInt(tmp['MJR_Mjera']())) {
                    //alert(tmp['MJR_Mjera2']() + " %%% " + tmp['MJR_Mjera']());
                    validBinary += 32
                }
            }
        }

        for (var i = 0; i < 6; i++) {
            //if (validStr.charAt(i) == '1') {
            //if (dialog2 != undefined) {
               $("#mjeraAlert" + (6 - i).toString()).css('visibility', 'hidden').text("");
            //}
            //}
        }


        valid = validBinary == 0;

        if (valid) {

            //redakUpitaMjere.mjereRedak(tmp);


            //redakUpita()[rowOpenDialog()].mjereRedak(tmp);
            V4 += tmp['MJR_IDT_Mjereni_dio']() + ";";
            V4 += tmp['MJR_IDT_Dimenzija']() + ";";
            //V4 += tmp['MJR_Operator']() + ";";
            V4 += tmp['MJR_Mjera']().replace(".", ",") + ";";
            if (tmp['MJR_Mjera2']() > 0) {
                V4 += tmp['MJR_Mjera2']().replace(".", ",") + ";";
            } else {
                V4 += "0;";
            }
            V4 += tmp['MJR_IDT_Jedinica_mjere']();

            //dbo.vw_Stuff_ALL.ID_Broj IN (select ID_Broj FROM dbo.vw_Mjere_faktor WHERE MJR_IDT_Mjereni_dio = QVRIJ1Q  and MJR_IDT_Dimenzija=QVRIJ2Q AND MJR_Mjera>QVRIJ3Q * (jediniceFaktor)

            // redakUpitaMjere.vrijednost4(V4);


            fakeUpitRow.vrijednost4(V4);
            var dio = ko.utils.arrayFirst(data.Selects['tbl_T_Dijelovi'], function (item) {
                return item.IDT === tmp['MJR_IDT_Mjereni_dio']()
            })
            var dimenzija = ko.utils.arrayFirst(data.Selects['tbl_T_Dimenzije'], function (item) {
                return item.IDT === tmp['MJR_IDT_Dimenzija']()
            })
            var jedinica = ko.utils.arrayFirst(data.Selects['tbl_T_Jedinice_Mjere'], function (item) {
                return item.IDT === tmp['MJR_IDT_Jedinica_mjere']()
            })
//            redakUpita()[rowOpenDialog()].mjereRedak(response.r1);
  //          var tmpOperator = response.r1['MJR_Operator']();
    //        var tmpOperatorString = redakUpita()[rowOpenDialog()].operatori()[tmpOperator];
      //      redakUpita()[rowOpenDialog()].upitOperator(tmpOperatorString);
        //    redakUpita()[rowOpenDialog()].vrijednost1(response.vrijednost1);
          //  redakUpita()[rowOpenDialog()].vrijednost4(response.vrijednost4);


            V1 += dio.Pojam + " ";
            V1 += dimenzija.Pojam + " ";
            V1 += MjereOperators[tmp['MJR_Operator']()] + " ";
            V1 += tmp['MJR_Mjera']() + " ";
            if (tmp['MJR_Operator']() > 2) {
                V1 += '- ' + realFakeMjere()[0]['MJR_Mjera2']() + " ";
            }
            V1 += jedinica.Pojam;
            fakeUpitRow.vrijednost1(V1);
            fakeUpitRow.combo(1);
            fakeUpitRow.mjereRedak(realFakeMjere()[0]);
            //realFakeMjere([]);
            //fejk = new fakeMjere();
            //realFakeMjere.push(fejk);
            opened = false;
            dialog.close(this, fakeUpitRow);
            //dialog.close(this, realFakeMjere);

        } else {

            var validStr = validBinary.toString(2);
            while (validStr.length < 6) {
                validStr = "0" + validStr;
            }
            var poruka = ["do manji od od", "fali jedinica mjere", "do mjera je null ili manja od nule", "mjera je null ili manja od nule", "nije upisana dimenzija", "nije upisan mjereni dio"];
            for (var i = 0; i < 6; i++) {
                if (validStr.charAt(i) == '1') {
                    alertMjere()[5 - i].poruka(poruka[i]);
                    alertMjere()[5 - i].visible(true);
                } else {
                    alertMjere()[5 - i].poruka('');
                    alertMjere()[5 - i].visible(false);
                }
            }
        }

        return valid;
    }


   var mapFejkRow = function (nesto) {

        var fejk=null;
        realFakeMjere([]);
        if (nesto.mjereRedak()) {
            fejk = nesto.mjereRedak();
        } else {
            fejk = new fakeMjere();
        }
                    //fejk['MJR_IDT_Mjereni_dio'](49);
                    //fejk['MJR_Operator'](ind);
                    realFakeMjere.push(fejk);
                    return true;
   }


   popupMjere.prototype.ok = function () {
        opened = false;
        dialog.close(this,null);
    }

 

   popupMjere.prototype.show = function (nesto) {
       opened = true;
       fakeUpitRow = nesto;
       mapFejkRow(nesto);
       
        return dialog.show(this);
    }

   return popupMjere;
})