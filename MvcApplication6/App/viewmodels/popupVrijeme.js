define(['plugins/dialog', 'services/dataService'],
    function (dialog,data) {

        var otvoreno = ko.observable(false);
        var fakeUpitRow;
        var vrijemeSetupParam = {
            Vremena: [{ 'tekst': 'prije', 'vrijednost': 1 }, { 'tekst': 'poslije', 'vrijednost': 2 }, { 'tekst': 'od', 'vrijednost': 3 }],
            VrijemeDefGod: [],
            VrijemeOperators: ['prije', 'poslije', 'izmeðu'],
            VrijemeOpisSt: [''],
            VrijemeOpisGod: [''],
            VrijemeOpisOstalo: [''],
            VrijemeJedinica: ['g.', 'g. pr. Kr.', 'st.', 'st. pr. Kr.', 'tis. pr. Kr.'],
            VrijemeDefSt: []
        }


        var realFakeVrijeme = ko.observableArray([]);
        var vremenaDef = ko.observableArray([]);
        var postaviOpis1 = ko.observableArray();
        var postaviOpis2 = ko.observableArray();



        var setOpis = function (redakFake, m) {
            //alert(n.IZR_Vrijeme_jedinica());

            var tmp = ko.observableArray([]);
            if (redakFake.IZR_Vrijeme_jedinica() == 'g.') {
                $.each(vrijemeSetupParam.VrijemeOpisGod, function (index, data) {
                    tmp.push(data);
                })
            } else {
                if (redakFake.IZR_Vrijeme_jedinica() == 'st.') {
                    $.each(vrijemeSetupParam.VrijemeOpisSt, function (index, data) {
                        tmp.push(data);
                    })
                } else {
                    $.each(vrijemeSetupParam.VrijemeOpisOstalo, function (index, data) {
                        tmp.push(data);
                    })

                }
            }
            if (m == 1 || m == 3) {
                postaviOpis1([]);
                postaviOpis1(tmp.slice());
            }
            if (m > 1) {
                postaviOpis2([]);
                postaviOpis2(tmp.slice());
            }

        }



        function fakeVrijeme(period, id, vrijednost, opis, jedinica, vrijemeOd, vrijemeDO, vrijednost2, opis2, jedinica2) {
            this.IZR_Period = ko.observable(period || false);
            this.ID = ko.observable(id || 333);
            this.IZR_Vrijeme_vrijednost = ko.observable(vrijednost || null);
            this.IZR_Vrijeme_opis = ko.observable(opis || "");
            this.IZR_Vrijeme_jedinica = ko.observable(jedinica || "g.");
            this.IZR_Vrijeme_od = ko.observable(vrijemeOd || 0);
            this.IZR_Vrijeme_do = ko.observable(vrijemeDO || 0);

            this.IZR_Vrijeme_vrijednost2 = ko.observable(vrijednost2 || null);
            this.IZR_Vrijeme_opis2 = ko.observable(opis2 || "");
            this.IZR_Vrijeme_jedinica2 = ko.observable(jedinica2 || "g.");
        }

        var firstLoad = true;

        var popupVrijeme = {
            vrijemeSetupParam:vrijemeSetupParam,
            fakeVrijeme:fakeVrijeme,
            realFakeVrijeme:realFakeVrijeme,
            postaviOpis1:postaviOpis1,
            postaviOpis2:postaviOpis2,
            setOpis:setOpis,
            provjeriVrijeme:provjeriVrijeme,
            mapVrijemeRedak:mapVrijemeRedak,
            isValidDate:isValidDate,
            firstLoad:firstLoad,
            init:init,
            ok:ok,
            otvoreno:otvoreno,
            show:show
        }
       


        return popupVrijeme;

        function init() {
            if (firstLoad) {
                var returnValue;
                data.getWebAPISQL(2,-1, returnValue).then(function (defVremena) {
                    //getDefVrijemeNOEF(returnValue).then(function (b) {
                    //$.each(my.SelectsArrays, function (i, p) {
                    //vremenaDef(b);

                    $.each(defVremena, function (i, p) {
                        if (p["DFV_St_od"] != "") {
                            vrijemeSetupParam.VrijemeDefSt.push({ "DFV_Opis": p["DFV_Opis"], "DFV_St_od": p["DFV_St_od"], "DFV_St_do": p["DFV_St_do"] })
                            vrijemeSetupParam.VrijemeOpisSt.push(p["DFV_Opis"]);
                        }
                        if (p["DFV_G_od"] != "") {
                            vrijemeSetupParam.VrijemeDefGod.push({ "DFV_Opis": p["DFV_Opis"], "DFV_G_od": p["DFV_G_od"], "DFV_G_do": p["DFV_G_do"] })
                            vrijemeSetupParam.VrijemeOpisGod.push(p["DFV_Opis"]);
                        }
                    })
                    //})
                })
                firstLoad = false;
            }
        }

        function mapVrijemeRedak(vrijemeRedak) {
            if (typeof vrijemeRedak === 'string') {
                var z = JSON.parse(vrijemeRedak);
            } else {
                var z = vrijemeRedak;
            }
            var tmpV = new fakeVrijeme(z.IZR_Period,
                                    z.ID,
                                    z.IZR_Vrijeme_vrijednost,
                                    z.IZR_Vrijeme_opis,
                                    z.IZR_Vrijeme_jedinica,
                                    z.IZR_Vrijeme_od,
                                    z.IZR_Vrijeme_do,
                                    z.IZR_Vrijeme_vrijednost2,
                                    z.IZR_Vrijeme_opis2,
                                    z.IZR_Vrijeme_jedinica2);

             return tmpV;
        }

        function isValidDate(n) {
            var vrijOd = -1;
            var vrijDo = -1;

            var vrijOd2 = -1;
            var vrijDo2 = -1;
            var regXfull = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d*)$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d*)$/;
            var regXmonat = /^(?:([0]*[1-9]|1[0-2]))(?:\.)(?:[1-9]|[1-9]\d|\d?\d{3})$/;
            var regXgod = /^(?:[1-9]|[1-9]\d|\d?\d{3})$/;
            //var regXgod = /^(?:\d{0,3})/;
            var regXst = /^(?:[1-9]|[1-9]\d|\d?\d{3})$/;
            var valid = true;
            var validGod = false;
            var validSt = false;
            var validMnt = false;
            var validFull = false;
            var valid2 = true;
            var validGod2 = false;
            var validSt2 = false;
            var validMnt2 = false;
            var validFull2 = false;

            //regX = /[0-9]?[0-9].[0-9]?[0-9].[0-9][0-9][0-9][0-9]./i;
            //alert('full ' + regXfull.test(d));

            var d = n.IZR_Vrijeme_vrijednost();

            if (d == null || d == 'undefined' || d == "") {
                return -1;
            }


            if (d.charAt(d.length - 1) == '.') {
                d = d.substring(0, d.length - 1);
                //vm.realFakeRow()[0]['IZR_Vrijeme_vrijednost'](vrijeme1);
            }

            if (n.IZR_Vrijeme_jedinica() == 'g.') {
                validGod = regXgod.test(d);
                if (validGod) {
                    vrijOd = parseInt(d) * 10000;
                    vrijDo = parseInt(d) * 10000;
                    if (n.IZR_Vrijeme_opis() != "") {
                        $.each(vrijemeSetupParam.VrijemeDefGod, function (index, data) {
                            var uvjet = true;
                            if (data.DFV_Opis == n.IZR_Vrijeme_opis()) {
                                vrijOd += parseInt(data.DFV_G_od);
                                vrijDo += parseInt(data.DFV_G_do);
                                uvjet = false;
                            };
                            return uvjet;
                        });
                    } else {
                        vrijOd = parseInt(d) * 10000 + 101;
                        vrijDo = parseInt(d) * 10000 + 1231;
                    };
                };
                if (n.IZR_Vrijeme_opis() == "") {
                    validMnt = regXmonat.test(d);
                    if (validMnt) {
                        vrijOd = parseInt(d.split('.')[1]) * 10000 + parseInt(d.split('.')[0]) * 100;
                        vrijDo = parseInt(d.split('.')[1]) * 10000 + parseInt(d.split('.')[0]) * 100;
                    };
                    validFull = regXfull.test(d);
                    if (validFull) {
                        vrijOd = parseInt(d.split('.')[2]) * 10000 + parseInt(d.split('.')[1]) * 100 + parseInt(d.split('.')[0]);
                        vrijDo = parseInt(d.split('.')[2]) * 10000 + parseInt(d.split('.')[1]) * 100 + parseInt(d.split('.')[0]);
                    };
                };
            }

            if (n.IZR_Vrijeme_jedinica() == 'st.') {
                validSt = regXst.test(d);
                if (validSt) {
                    vrijOd = (parseInt(d) - 1) * 1000000;

                    if (n.IZR_Vrijeme_opis() != "") {
                        $.each(vrijemeSetupParam.VrijemeDefSt, function (index, data) {
                            var uvjet = true;
                            if (data.DFV_Opis == n.IZR_Vrijeme_opis()) {
                                vrijDo = vrijOd + parseInt(data.DFV_St_do);
                                vrijOd += parseInt(data.DFV_St_od);
                                uvjet = false;
                            };
                            return uvjet;
                        });
                    } else {
                        vrijDo = vrijOd + 1001231;
                        vrijOd += 10101;
                    }
                }
            }
            if (n.IZR_Period() == 3) {
                var d2 = n.IZR_Vrijeme_vrijednost2();
                if (d2.charAt(d2.length - 1) == '.') {
                    d2 = d2.substring(0, d2.length - 1);
                    //vm.realFakeRow()[0]['IZR_Vrijeme_vrijednost'](vrijeme1);
                }

                if (n.IZR_Vrijeme_jedinica2() == 'g.') {
                    validGod2 = regXgod.test(d2);
                    if (validGod2) {
                        vrijOd2 = parseInt(d2) * 10000;
                        vrijDo2 = parseInt(d2) * 10000;
                        if (n.IZR_Vrijeme_opis2() != "") {
                            $.each(vrijemeSetupParam.VrijemeDefGod, function (index, data) {
                                var uvjet = true;
                                if (data.DFV_Opis == n.IZR_Vrijeme_opis2()) {
                                    vrijOd2 += parseInt(data.DFV_G_od);
                                    vrijDo2 += parseInt(data.DFV_G_do);
                                    uvjet = false;
                                };
                                return uvjet;
                            });
                        } else {
                            vrijOd2 = parseInt(d2) * 10000 + 101;
                            vrijDo2 = parseInt(d2) * 10000 + 1231;
                        }

                    }
                    if (n.IZR_Vrijeme_opis() == "") {
                        validMnt2 = regXmonat.test(d2);
                        if (validMnt2) {
                            vrijOd2 = parseInt(d2.split('.')[1]) * 10000 + parseInt(d2.split('.')[0]) * 100;
                            vrijDo2 = parseInt(d2.split('.')[1]) * 10000 + parseInt(d2.split('.')[0]) * 100;
                        }
                        validFull2 = regXfull.test(d2);
                        if (validFull2) {
                            vrijOd2 = parseInt(d2.split('.')[2]) * 10000 + parseInt(d2.split('.')[1]) * 100 + parseInt(d2.split('.')[0]);
                            vrijDo2 = parseInt(d2.split('.')[2]) * 10000 + parseInt(d2.split('.')[1]) * 100 + parseInt(d2.split('.')[0]);
                        }
                    }
                }
                if (n.IZR_Vrijeme_jedinica2() == 'st.') {
                    validSt2 = regXst.test(d2);
                    if (validSt2) {
                        vrijOd2 = (parseInt(d2) - 1) * 1000000;

                        if (n.IZR_Vrijeme_opis2() != "") {
                            $.each(vrijemeSetupParam.VrijemeDefSt, function (index, data) {
                                var uvjet = true;
                                if (data.DFV_Opis == n.IZR_Vrijeme_opis2()) {
                                    vrijDo2 = vrijOd2 + parseInt(data.DFV_St_do);
                                    vrijOd2 += parseInt(data.DFV_St_od);
                                    uvjet = false;
                                };
                                return uvjet;
                            });
                        } else {
                            vrijDo2 = vrijOd2 + 1001231;
                            vrijOd2 += 10101;
                        }
                    }
                }
            }


            if (n.IZR_Vrijeme_jedinica2() == 'st. pr. Kr.') {
                validSt2 = regXst.test(d2);
                if (validSt2) {
                    vrijOd2 = (parseInt(d2) - 1) * -1000000;

                    // if (n.IZR_Vrijeme_opis2() != "") {
                    //   $.each(VrijemeDefSt, function (index, data) {
                    //         if (data.DFV_Opis == n.IZR_Vrijeme_opis2()) {
                    //           vrijDo2 = vrijOd2 + parseInt(data.DFV_St_do);
                    //          vrijOd2 += parseInt(data.DFV_St_od);
                    //    };
                    //});
                    //} else {
                    vrijDo2 = vrijOd2 + 1001231;
                    vrijOd2 += 10101;
                    //}
                }
            }

            if (n.IZR_Vrijeme_jedinica2() == 'g. pr. Kr.') {
                validSt2 = regXst.test(d2);
                if (validSt2) {
                    vrijOd2 = (parseInt(d2) - 1) * -10000;

                    //if (n.IZR_Vrijeme_opis2() != "") {
                    //    $.each(VrijemeDefSt, function (index, data) {
                    //        if (data.DFV_Opis == n.IZR_Vrijeme_opis2()) {
                    //            vrijDo2 = vrijOd2 + parseInt(data.DFV_St_do);
                    //            vrijOd2 += parseInt(data.DFV_St_od);
                    //        };
                    //    });
                    //} else {
                    vrijDo2 = vrijOd2 + 1231;
                    vrijOd2 += 101;
                    //}
                }
            }

            if (vrijDo2 == -1) {
                vrijDo2 = vrijDo;
            }
            realFakeVrijeme()[0]['IZR_Vrijeme_od'](vrijOd);
            realFakeVrijeme()[0]['IZR_Vrijeme_do'](vrijDo2);


            return vrijOd;


        }

        function provjeriVrijeme() {
            var valid = true;
            var tmp = realFakeVrijeme()[0];

            var vrijeme1 = tmp['IZR_Vrijeme_opis']() + ' ' + tmp['IZR_Vrijeme_vrijednost']() + ' ' + tmp['IZR_Vrijeme_jedinica']();
            var vrijeme2 = tmp['IZR_Vrijeme_opis2']() + ' ' + tmp['IZR_Vrijeme_vrijednost2']() + ' ' + tmp['IZR_Vrijeme_jedinica2']();
            var rez;

            rez = isValidDate(realFakeVrijeme()[0]);
            valid = rez != -1;

            if (valid) {


                fakeUpitRow.vrijemeRedak(realFakeVrijeme()[0]);
                fakeUpitRow.vrijednost4(rez);
                fakeUpitRow.vrijednost1(vrijeme1);
                if (realFakeVrijeme()[0]['IZR_Period']() == 1) {
                    fakeUpitRow.upitOperator("prije");
                    fakeUpitRow.vrijednost4(realFakeVrijeme()[0]['IZR_Vrijeme_od']());
                }

                if (realFakeVrijeme()[0]['IZR_Period']() == 2) {
                    fakeUpitRow.upitOperator("poslije");
                    fakeUpitRow.vrijednost4(realFakeVrijeme()[0]['IZR_Vrijeme_do']());
                }

                if (realFakeVrijeme()[0]['IZR_Period']() == 3) {
                    fakeUpitRow.upitOperator("izmeðu");
                    //                alert(realFakeRow()[0]['IZR_Vrijeme_od']() + '-' + realFakeRow()[0]['IZR_Vrijeme_do2']());
                    fakeUpitRow.vrijednost4(realFakeVrijeme()[0]['IZR_Vrijeme_od']() + '-' + realFakeVrijeme()[0]['IZR_Vrijeme_do']());
                    fakeUpitRow.vrijednost1(vrijeme1 + ' - ' + vrijeme2);
                }


                // alert(redakUpita()[rowOpenDialog()].vrijemeRedak());
                dialog.close(popupVrijeme, fakeUpitRow);
                //realFakeVrijeme([]);
                //fejk = new fakeVrijeme();
                //realFakeVrijeme.push(fejk);
                //dialog.dialog("close");
            } else {
                $("#vrijemeAlert").css('visibility', 'visible');
            }
            
            return valid;
        }


        function mapFakeVrijeme(nesto) {
            
            var fejk = null;
            realFakeVrijeme([]);
            if (nesto.vrijemeRedak()) {
                fejk = nesto.vrijemeRedak();
            } else {
                fejk = new fakeVrijeme();
            }
           
            realFakeVrijeme.push(fejk);
            
            setOpis(realFakeVrijeme()[0], 1);
            setOpis(realFakeVrijeme()[0], 2);
            
            return true;
        }




        function ok() {
            dialog.close(popupVrijeme, null);
        }



        function show (nesto) {
            //opened = true;
            otvoreno(true);
            fakeUpitRow = nesto;
            mapFakeVrijeme(nesto);
            return dialog.show(popupVrijeme);
        }
    });