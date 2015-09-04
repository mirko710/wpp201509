define(['durandal/system', 'plugins/router', 'services/logger','services/dataService','plugins/dialog'],
    function (system, router, logger, dataService,dialog) {
        var shell = {
            activate: activate,
            router: router,
            userName: dataService.userName,
            password: dataService.password,
            loginTry: loginTry,
            isAuth: isAuth,
            logout: logout,
            rUserName: dataService.realUserName,
            rIsAuth: dataService.realIsAuth,
            rUserRoles: dataService.realUserRoles,
            enterLogin: enterLogin,
            testUserName: testUserName,
            loadedTerminologyUpiti: dataService.loadedTerminologyUpiti,
            loadedTerminologyUpis: dataService.loadedTerminologyUpis,
           
        };
        
        return shell;





        function testUserName() {
            var b=null;
            return testUserNameAJAX().
            then(function(b){alert(b);})

        }



        function testUserNameAJAX() {
            var returnObject;
            var defer = Q.defer();
            dataService.getWebAPIAccounts(5, "prazno", returnObject).then(
                function (response) {
                    //realUserName(response);
                    defer.resolve(response);
                }).fail(function () {
                    defer.resolve(false);
                })
            return defer.promise;
        
        }

        function loginTry() {
            //alert(dataService.changePassword(dataService.userName(), dataService.password()));
            //alert(dataService.userExists(dataService.userName()));
            dataService.login(dataService.userName(), dataService.password())
                .then(function () {
                    dataService.getUserName();
                    
                })
                .then(function () {
                    dataService.isAuthenticated();
                })
                .then(function () {
                    getRoles();
                    dataService.parametri.ucitajParametre();
                });
            //console.log(dataService.login(dataService.userName(), dataService.password()));
            return true;
        }
        function getRoles() {
            //alert(dataService.changePassword(dataService.userName(), dataService.password()));
            //alert(dataService.userExists(dataService.userName()));
            console.log(dataService.getUserRoles());
            return true;

        }
        function isAuth() {
            //alert(dataService.changePassword(dataService.userName(), dataService.password()));
            //alert(dataService.userExists(dataService.userName()));
            console.log(dataService.isAuthenticated());
            return true;

        }


        function enterLogin(d, e) {
            
            if (e.keyCode == 13) {
                //d.valueHasMutated();
                    loginTry();
                }
               // e.preventDefault();
                return true;
        }

        function logout() {
            //alert(dataService.changePassword(dataService.userName(), dataService.password()));
            //alert(dataService.userExists(dataService.userName()));
           // alert("logStart");
            dataService.logout()
            .then(function () { dataService.isAuthenticated(); });
            return true;

        }
        //#region Internal Methods
        function activate() {

            dataService.isAuthenticated();
            var ulogan = dataService.realIsAuth();
            if (ulogan) {
                //console.log(dataService.realUserName(dataService.getUserName()));
                console.log(dataService.realUserName());
                
            } else {
                dataService.realUserName('');
            }




            // za dodat bootstrap dialog
            //dialog.addContext('bootstrap', {
            //    addHost: function (dialogInstance) {
            //        var body = $('body'),
            //            host = $('<div class="modal fade"><div class="modal-dialog"><div class="modal-content"></div></div></div>');
            //        host.appendTo(body);
            //        dialogInstance.host = host.find('.modal-content').get(0);
            //        dialogInstance.modalHost = host;
            //    },
            //    removeHost: function (dialogInstance) {
            //        $(dialogInstance.modalHost).modal('hide');
            //        $('body').removeClass('modal-open');
            //        $('.modal-backdrop').remove();
            //    },
            //    compositionComplete: function (child, parent, context) {
            //        var dialogInstance = dialog.getDialog(context.model),
            //            $child = $(child);
            //        $(dialogInstance.modalHost).modal({ backdrop: 'static', keyboard: false, show: true });
            //        //Setting a short timeout is need in IE8, otherwise we could do this straight away
            //        setTimeout(function () {
            //            $child.find('.autofocus').first().focus();
            //        }, 1);
            //        if ($child.hasClass('autoclose') || context.model.autoclose) {
            //            $(dialogInstance.blockout).click(function () {
            //                dialogInstance.close();
            //            });
            //        }
            //    }
            //});
            ////rebind dialog.show to default to a new context
            //var oldShow = dialog.show;
            //dialog.show = function (obj, data, context) {
            //    return oldShow.call(dialog, obj, data, context || 'bootstrap');
            //};


            //jqAuto -- main binding (should contain additional options to pass to autocomplete)
            //jqAutoSource -- the array to populate with choices (needs to be an observableArray)
            //jqAutoQuery -- function to return choices
            //jqAutoValue -- where to write the selected value
            //jqAutoSourceLabel -- the property that should be displayed in the possible choices
            //jqAutoSourceInputValue -- the property that should be displayed in the input box
            //jqAutoSourceValue -- the property to use for the value
            ko.bindingHandlers.jqAuto = {
                init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                    var options = valueAccessor() || {},
                        allBindings = allBindingsAccessor(),
                        unwrap = ko.utils.unwrapObservable,
                        modelValue = allBindings.jqAutoValue,
                        source = allBindings.jqAutoSource,
                        query = allBindings.jqAutoQuery,
                        dodajTerm = allBindings.jqTerm,
                        dodajTermTablica = allBindings.jqTermTablica,
                        imeTablice = allBindings.jqTablica,
                        imeModula = allBindings.jqModul,
                        valueProp = allBindings.jqAutoSourceValue,
                        inputValueProp = allBindings.jqAutoSourceInputValue || valueProp,
                        labelProp = allBindings.jqAutoSourceLabel || inputValueProp;

                    //function that is shared by both select and change event handlers
                    function writeValueToModel(valueToWrite) {

                        if (ko.isWriteableObservable(modelValue)) {
                            //alert('ritetomodl1   ' + valueToWrite);
                            modelValue(valueToWrite);
                        } else {  //write to non-observable
                            //alert('ritetomodl2    ' + valueToWrite);
                            if (allBindings['_ko_property_writers'] && allBindings['_ko_property_writers']['jqAutoValue']) {
                                allBindings['_ko_property_writers']['jqAutoValue'](valueToWrite);
                            }
                        }
                        //alert('ritetomodl3    ' + valueToWrite);
                    }

                    function intraFix() {
                        //return funk('tbl_T_Materijali', $(element).val(), 'Materijali');
                        //return Q.fcall(function () { dataService.dMax('IDT', 'Materijali'); });
                        if (imeTablice != 'tbl_T_Autori') {
                            return Q.fcall(function () { return dataService.createTermin(imeTablice, $(element).val(), imeModula); });
                        } else {
                            //alert('idemo Autori');
                            return Q.fcall(function () { return dataService.createOsoba(imeTablice, $(element).val(), imeModula); });
                            //return Q.fail();
                        }
                    }


                    options.response = function (event, ui) {

                        if (ui.content.length === 0 && imeTablice) {
                            $(element).css('background-color', 'red');
                            $(element).css('font-weight', 'bold');



                            var noviTemp = { actualValue: 999999, label: 'Nije u Terminološkoj! ' + $(element).val(), value: $(element).val() };
                            ui.content.push(noviTemp);
                            dodajTerm();
                            dodajTermTablica(imeTablice);
                        } else {
                            $(element).css('background-color', '');
                            $(element).css('font-weight', 'normal');
                        }
                    };

                    //on a selection write the proper value to the model
                    options.select = function (event, ui) {

                        if (ui.item.actualValue == 999999) {
                            ////alert('nijenašo');

                            dodajTerm('');
                            dodajTermTablica('');
                            //$("#dodajTerm").modal('show');
                            var x = confirm('Želite li spremiti ' + $(element).val() + ' u terminološku?');
                            if (x) {

                                intraFix().then(function (n) {
                                    //console.log(n);
                                    console.log(n);
                                    source.push(n);
                                    if (imeTablice != 'tbl_T_Autori') {
                                        writeValueToModel(n.IDT);
                                    } else {
                                        //alert('idemo Autori');
                                        writeValueToModel(n.ID);
                                        //return Q.fail();
                                    }
                                    $(element).css('background-color', '');
                                    $(element).css('font-weight', 'normal');
                                }).fail(function () { alert('nespremaj'); });
                            }
                            else {
                                writeValueToModel(null);
                                $(element).val(null);
                                //alert('upiši null1');
                            }
                        } else {
                            writeValueToModel(ui.item ? ui.item.actualValue : null);
                            //alert('upiši null2' + ' ' + ui.item.actualValue);
                        }

                        //writeValueToModel(ui.item ? ui.item.actualValue : null);
                    };

                    //on a change, make sure that it is a valid value or clear out the model value
                    options.change = function (event, ui) {
                        var currentValue = $(element).val();
                        var matchingItem = ko.utils.arrayFirst(unwrap(source), function (item) {
                            //alert('spremio');
                            return unwrap(inputValueProp ? item[inputValueProp] : item) === currentValue;
                        });
                        //alert($(element).val());
                        if (!matchingItem && $(element).val() != '') {

                            $(element).css('background-color', 'red');
                            $(element).css('font-weight', 'bold');
                        } else {
                            $(element).css('background-color', '');
                            $(element).css('font-weight', 'normal');

                            if (matchingItem === null) {
                                writeValueToModel(null);

                            };
 
                        };
                    }


                    //hold the autocomplete current response
                    var currentResponse = null;

                    //handle the choices being updated in a DO, to decouple value updates from source (options) updates
                    var mappedSource = ko.dependentObservable({
                        read: function () {
                            mapped = ko.utils.arrayMap(unwrap(source), function (item) {
                                var result = {};
                                result.label = labelProp ? unwrap(item[labelProp]) : unwrap(item).toString();  //show in pop-up choices
                                result.value = inputValueProp ? unwrap(item[inputValueProp]) : unwrap(item).toString();  //show in input box
                                result.actualValue = valueProp ? unwrap(item[valueProp]) : item;  //store in model
                                return result;
                            });
                            return mapped;
                        },
                        write: function (newValue) {
                            source(newValue);  //update the source observableArray, so our mapped value (above) is correct
                            if (currentResponse) {
                                currentResponse(mappedSource());
                            }
                        },
                        disposeWhenNodeIsRemoved: element
                    });

                    if (query) {
                        options.source = function (request, response) {
                            currentResponse = response;
                            query.call(this, request.term, mappedSource);
                        }
                    } else {
                        //whenever the items that make up the source are updated, make sure that autocomplete knows it
                        mappedSource.subscribe(function (newValue) {
                            //alert('updejted');
                            $(element).autocomplete("option", "source", newValue);
                        });

                        options.source = mappedSource();
                    }


                    //initialize autocomplete
                    $(element).autocomplete(options);
                },



                update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                    //update value based on a model change
                    var allBindings = allBindingsAccessor(),
                        unwrap = ko.utils.unwrapObservable,
                        modelValue = unwrap(allBindings.jqAutoValue) || '',
                        valueProp = allBindings.jqAutoSourceValue,
                        inputValueProp = allBindings.jqAutoSourceInputValue || valueProp;

                    //if we are writing a different property to the input than we are writing to the model, then locate the object
                    if (valueProp && inputValueProp !== valueProp) {
                        var source = unwrap(allBindings.jqAutoSource) || [];
                        var modelValue = ko.utils.arrayFirst(source, function (item) {
                            return unwrap(item[valueProp]) === modelValue;
                        }) || {};
                    }

                    //update the element with the value that should be shown in the input
                    $(element).val(modelValue && inputValueProp !== valueProp ? unwrap(modelValue[inputValueProp]) : modelValue.toString());
                }
            };

 

            //jqAuto -- main binding (should contain additional options to pass to autocomplete)
            //jqAutoSource -- the array of choices
            //jqAutoValue -- where to write the selected value
            //jqAutoSourceLabel -- the property that should be displayed in the possible choices
            //jqAutoSourceInputValue -- the property that should be displayed in the input box
            //jqAutoSourceValue -- the property to use for the value

            ko.bindingHandlers.autoCompleteCatchUpdate = {
                init: function (element, valueAccessor) {
                    $(element).change(function () {
                        capitalize(element);
                        var value = valueAccessor()
                        value($(element).val());
                    });
            
                },
                update: function (element, valueAccessor) {
                    $(element).val(ko.unwrap(valueAccessor()));
                    capitalize(element);
                }
            };


            ko.bindingHandlers.jqAutoUpit = {
                init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                    var options = valueAccessor() || {},
                        allBindings = allBindingsAccessor(),
                        unwrap = ko.utils.unwrapObservable,
                        modelValue = allBindings.jqAutoValue,
                        source = allBindings.jqAutoSource,
                        valueProp = allBindings.jqAutoSourceValue,
                        inputValueProp = allBindings.jqAutoSourceInputValue || valueProp,
                        labelProp = allBindings.jqAutoSourceLabel || valueProp,
                        selectsSource = allBindings.jqAutoSelectsSource;
                    

                    //function that is shared by both select and change event handlers
                    function writeValueToModel(valueToWrite) {
                        if (ko.isWriteableObservable(modelValue)) {
                            modelValue(valueToWrite);
                        } else {  //write to non-observable
                            if (allBindings['_ko_property_writers'] && allBindings['_ko_property_writers']['jqAutoValue'])
                                allBindings['_ko_property_writers']['jqAutoValue'](valueToWrite);
                        }
                    }

                    //on a selection write the proper value to the model
                    options.select = function (event, ui) {
                        writeValueToModel(ui.item ? ui.item.actualValue : null);
                    };


                    options.open = function (event) {
                        // console.log("open_resizeMenu");
                    }

                    //on a change, make sure that it is a valid value or clear out the model value
                    options.change = function (event, ui) {
                        var currentValue = $(element).val();
                        var kSource = selectsSource[source()];// my.vm.Selects[source()];
                        var matchingItem = ko.utils.arrayFirst(unwrap(kSource), function (item) {
                            return unwrap(item[inputValueProp]) === currentValue;
                        });

                        if (!matchingItem) {
                            writeValueToModel(null);
                        }
                    }


                    //handle the choices being updated in a DO, to decouple value updates from source (options) updates
                    var mappedSource = ko.dependentObservable(function () {
                        var kSource = selectsSource[source()]; //my.vm.Selects[source()];
                        mapped = ko.utils.arrayMap(unwrap(kSource), function (item) {
                            var result = {};
                            result.label = labelProp ? unwrap(item[labelProp]) : unwrap(item).toString();  //show in pop-up choices
                            result.value = inputValueProp ? unwrap(item[inputValueProp]) : unwrap(item).toString();  //show in input box
                            result.actualValue = valueProp ? unwrap(item[valueProp]) : item;  //store in model
                            return result;
                        });
                        return mapped;
                    }, null, { disposeWhenNodeIsRemoved: element });

                    //whenever the items that make up the source are updated, make sure that autocomplete knows it
                    mappedSource.subscribe(function (newValue) {
                        $(element).autocomplete("option", "source", newValue);
                    });

                    options.source = mappedSource();

                    //initialize autocomplete
                    $(element).autocomplete(options);





                },
                update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                    //update value based on a model change
                    var allBindings = allBindingsAccessor(),
                        unwrap = ko.utils.unwrapObservable,
                        modelValue = unwrap(allBindings.jqAutoValue) || '',
                        valueProp = allBindings.jqAutoSourceValue,
                        inputValueProp = allBindings.jqAutoSourceInputValue || valueProp;

                    //if we are writing a different property to the input than we are writing to the model, then locate the object
                    if (valueProp && inputValueProp !== valueProp) {
                        //my.vm.Selects[source()]
                        var source = unwrap(selectsSource[allBindings.jqAutoSource()]) || []; //unwrap(my.vm.Selects[allBindings.jqAutoSource()]) || [];
                        var modelValue = ko.utils.arrayFirst(source, function (item) {

                            return unwrap(item[valueProp]) === modelValue;
                        }) || {};  //probably don't need the || {}, but just protect against a bad value          
                    }

                    //update the element with the value that should be shown in the input
                    $(element).val(modelValue && inputValueProp !== valueProp ? unwrap(modelValue[inputValueProp]) : modelValue.toString());
                }
            };


            ko.bindingHandlers.upitiAutocomplete = {
                init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    var allBindings = allBindingsAccessor();
                    var bigTablica = ko.observable();
                    var bigZbirkaIDT = ko.observable();
                    var poZbirci = allBindings.upitiAutocomplete.poZbirci || false;
                    var afterUpdate= null;
                    if(allBindings.upitiAutocomplete.options){
                         afterUpdate=allBindings.upitiAutocomplete.options.afterUpdate || null;
                    }
                    if (ko.isObservable(allBindings.upitiAutocomplete.tablica)) {
                        bigTablica(allBindings.upitiAutocomplete.tablica() || 'tbl_T_Nazivi');
                        allBindings.upitiAutocomplete.tablica.subscribe(function (newValue) {
                            bigTablica(newValue);
                        })
                    } else {
                        bigTablica(allBindings.upitiAutocomplete.tablica);
                    }


                    if (poZbirci) {

                        if (ko.isObservable(allBindings.upitiAutocomplete.zbirkaIDT)) {
                            bigZbirkaIDT(allBindings.upitiAutocomplete.zbirkaIDT() || -1);
                            allBindings.upitiAutocomplete.zbirkaIDT.subscribe(function (newValue) {
                                bigZbirkaIDT(newValue);
                            })

                        } else {
                            bigZbirkaIDT(allBindings.upitiAutocomplete.zbirkaIDT);
                        }
                    }
 

                    var accValue = allBindings.upitiAutocomplete.accValue || '';


                    var dodajTermin = function (tablicaPojam, returnVal) {
                        var x = confirm('Želite li spremiti ' + $(element).val() + ' u terminološku?');
                        if (x) {
                            if (bigTablica() != 'wv_T_Autori') {
                                return dataService.createTermin(bigTablica(), tablicaPojam, bigTablica());
                            } else {

                                return dataService.createOsoba(bigTablica(), tablicaPojam, bigTablica());

                            }
                        }
                    }

                    var getJsonAutocomplete = function (tablicaPojam, returnVal) {

                        var tmpUrl = "/api/WebApiSQL/?tablica=" + bigTablica() + "&term=" + encodeURIComponent(tablicaPojam.pojam);
                        if (poZbirci) {
                            tmpUrl = "/api/WebApiSQL/?tablica=" + bigTablica() + "&term=" + encodeURIComponent(tablicaPojam.pojam) + "&zbirkaIDT=" + bigZbirkaIDT();
                        }
                        //tablica = 'tbl_T_Nazivi';"Content-Type", "text/plain;charset=UTF-8"
                        var req = $.ajax({
                            type: 'GET',
                            url: tmpUrl,
                            dataType: 'json',
                            contentType: 'application/json;charset=UTF-8',
                            success: function (response, text) {
                                returnVal(response);
                            },
                            error: function (text, error) {
                                console.log(error);
                            },
                            cancel: function () {
                            }
                        })
                        return req;
                    }

                    
                    var getJsonDlookup = function (IDT, returnVal) {
                        //console.log("dlookup " + bigTablica());
                        var propIDT = -1;
                        //tablica = 'tbl_T_Nazivi';
                        if (ko.isObservable(IDT)) {
                            propIDT = IDT();
                        }
                        else {
                            propIDT = IDT;
                        }
                        propIDT = propIDT || -1;
                        var req = $.ajax({
                            type: 'GET',
                            url: "/api/WebApiSQL/?tablica=" + bigTablica() + "&IDT=" + propIDT + "&i2=2&i3=2&i4=2&i5=2&i6=2&i7=2&i8=2",
                            dataType: 'json',
                            contentType: 'application/json',
                            success: function (response, text) {
                                returnVal(response);
                            },
                            error: function (text, error) {
                                console.log(error);
                            },
                            cancel: function () {
                            }
                        })
                        return req;
                    }
                    ko.applyBindingAccessorsToNode(element, {
                        jqAutoComplete: function () {
                            return {
                                source: getJsonAutocomplete,
                                options: {
                                    dodajTermin: dodajTermin,
                                    dlookup: getJsonDlookup,
                                    afterUpdate:afterUpdate,
                                    tablica: bigTablica || 'tbl_T_Nazivi'
                                },
                                value: accValue,
                                inputProp: 'Pojam',
                                labelProp: 'Pojam',
                                valueProp: 'IDT'}
                        }
                    }, bindingContext);

                    return { controlsDescendantBindings: true };
                }
            
            }
            


 


           

            ko.bindingHandlers.jqAutoAJAX = {
                init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                    var options = valueAccessor() || {},
                        allBindings = allBindingsAccessor(),
                        unwrap = ko.utils.unwrapObservable,
                        modelValue = allBindings.jqAutoValue,
                        source = ko.observableArray([]),
                        query = allBindings.jqAutoQuery,
                        valueProp = allBindings.jqAutoSourceValue,
                        inputValueProp = allBindings.jqAutoSourceInputValue || valueProp,
                        labelProp = allBindings.jqAutoSourceLabel || inputValueProp;
                        tablica = allBindings.jqAutoTablica;
                    //function that is shared by both select and change event handlers
                    function writeValueToModel(valueToWrite) {
                        if (ko.isWriteableObservable(modelValue)) {
                            modelValue(valueToWrite);
                        } else {  //write to non-observable
                            if (allBindings['_ko_property_writers'] && allBindings['_ko_property_writers']['jqAutoValue'])
                                allBindings['_ko_property_writers']['jqAutoValue'](valueToWrite);
                        }
                    }

                    tablica.subscribe(function (newValue) {
                        //alert("watafaka");
                    })
                    //on a selection write the proper value to the model
                    options.select = function (event, ui) {
                        writeValueToModel(ui.item ? ui.item.actualValue : null);
                    };

                    //on a change, make sure that it is a valid value or clear out the model value
                    options.change = function (event, ui) {
                        var currentValue = $(element).val();
                        var matchingItem = ko.utils.arrayFirst(unwrap(source), function (item) {
                            return unwrap(item[inputValueProp]) === currentValue;
                        });

                        if (!matchingItem) {
                            writeValueToModel(null);
                        }
                    }

                    //hold the autocomplete current response
                    var currentResponse = null;

                    //handle the choices being updated in a DO, to decouple value updates from source (options) updates
                    var mappedSource = ko.dependentObservable({
                        read: function () {
                            mapped = ko.utils.arrayMap(unwrap(source), function (item) {
                                var result = {};
                                result.label = labelProp ? unwrap(item[labelProp]) : unwrap(item).toString();  //show in pop-up choices
                                result.value = inputValueProp ? unwrap(item[inputValueProp]) : unwrap(item).toString();  //show in input box
                                result.actualValue = valueProp ? unwrap(item[valueProp]) : item;  //store in model
                                return result;
                            });
                            return mapped;
                        },
                        write: function (newValue) {
                            source(newValue);  //update the source observableArray, so our mapped value (above) is correct
                            if (currentResponse) {
                                currentResponse(mappedSource());
                            }
                        }
                    });

                    if (query) {
                        options.source = function (request, response) {
                            currentResponse = response;
                            query.call(this, { tablica: tablica(), pojam: request.term }, mappedSource);
                        }
                    } else {
                        //whenever the items that make up the source are updated, make sure that autocomplete knows it
                        mappedSource.subscribe(function (newValue) {
                            $(element).autocomplete("option", "source", newValue);
                        });

                        options.source = mappedSource();
                    }

                    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                        $(element).autocomplete("destroy");
                    });


                    //initialize autocomplete
                    $(element).autocomplete(options);
                },
                update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                    //update value based on a model change
                    var allBindings = allBindingsAccessor(),
                        unwrap = ko.utils.unwrapObservable,
                        modelValue = unwrap(allBindings.jqAutoValue) || '',
                        valueProp = allBindings.jqAutoSourceValue,
                        inputValueProp = allBindings.jqAutoSourceInputValue || valueProp;

                    //if we are writing a different property to the input than we are writing to the model, then locate the object
                    if (valueProp && inputValueProp !== valueProp) {
                        var source = unwrap(allBindings.jqAutoSource) || [];
                        var modelValue = ko.utils.arrayFirst(source, function (item) {
                            return unwrap(item[valueProp]) === modelValue;
                        }) || {};
                    }

                    //update the element with the value that should be shown in the input
                    $(element).val(modelValue && inputValueProp !== valueProp ? unwrap(modelValue[inputValueProp]) : modelValue.toString());
                }
            };





//jqAuto -- main binding (should contain additional options to pass to autocomplete)
//jqAutoSource -- the array of choices
//jqAutoValue -- where to write the selected value
//jqAutoSourceLabel -- the property that should be displayed in the possible choices
//jqAutoSourceInputValue -- the property that should be displayed in the input box
//jqAutoSourceValue -- the property to use for the value
ko.bindingHandlers.jqAutoOG = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var options = valueAccessor() || {},
            allBindings = allBindingsAccessor(),
            unwrap = ko.utils.unwrapObservable,
            modelValue = allBindings.jqAutoValue,
            source = allBindings.jqAutoSource,
            valueProp = allBindings.jqAutoSourceValue,
            inputValueProp = allBindings.jqAutoSourceInputValue || valueProp,
            labelProp = allBindings.jqAutoSourceLabel || valueProp;

        //function that is shared by both select and change event handlers
        function writeValueToModel(valueToWrite) {
            if (ko.isWriteableObservable(modelValue)) {
               modelValue(valueToWrite );  
            } else {  //write to non-observable
               if (allBindings['_ko_property_writers'] && allBindings['_ko_property_writers']['jqAutoValue'])
                        allBindings['_ko_property_writers']['jqAutoValue'](valueToWrite );    
            }
        }
        
        //on a selection write the proper value to the model
        options.select = function(event, ui) {
            writeValueToModel(ui.item ? ui.item.actualValue : null);
            //alert("option.select");
        };
            
        //on a change, make sure that it is a valid value or clear out the model value
        options.change = function(event, ui) {
            var currentValue = $(element).val();
            var matchingItem =  ko.utils.arrayFirst(unwrap(source), function(item) {
               return unwrap(item[inputValueProp]) === currentValue;  
            });
            
            if (!matchingItem) {
               writeValueToModel(131);
               $(element).val(modelValue && inputValueProp !== valueProp ? unwrap(modelValue[inputValueProp]) : modelValue.toString());
               //alert("upiši null");
            }    
            //alert("option.change");
        }
        
        
        //handle the choices being updated in a DO, to decouple value updates from source (options) updates
        var mappedSource = ko.dependentObservable(function() {
                mapped = ko.utils.arrayMap(unwrap(source), function(item) {
                    var result = {};
                    result.label = labelProp ? unwrap(item[labelProp]) : unwrap(item).toString();  //show in pop-up choices
                    result.value = inputValueProp ? unwrap(item[inputValueProp]) : unwrap(item).toString();  //show in input box
                    result.actualValue = valueProp ? unwrap(item[valueProp]) : item;  //store in model
                    return result;
            });
            return mapped;                
        });
        
        //whenever the items that make up the source are updated, make sure that autocomplete knows it
        mappedSource.subscribe(function(newValue) {
           $(element).autocomplete("option", "source", newValue); 
        });
        modelValue.subscribe(function(newValue){
            // alert($(element).val());
            if (newValue) {
                $(element).trigger("change");
            }
        });
        
           $(element).click(function() {
 
                        if ($(element).autocomplete("widget").is(":visible")) {
                             $(element).autocomplete( "close" );
                            return;
                        }
                        $(element).autocomplete("search", " ");
                        $(element).focus(); 
                    });
        
        
        options.source = mappedSource();
        
        //initialize autocomplete
        $(element).autocomplete(options);
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
       //update value based on a model change
       var allBindings = allBindingsAccessor(),
           unwrap = ko.utils.unwrapObservable,
           modelValue = unwrap(allBindings.jqAutoValue) || '', 
           valueProp = allBindings.jqAutoSourceValue,
           inputValueProp = allBindings.jqAutoSourceInputValue || valueProp;
        
       //if we are writing a different property to the input than we are writing to the model, then locate the object
       if (valueProp && inputValueProp !== valueProp) {
           var source = unwrap(allBindings.jqAutoSource) || [];
           var modelValue = ko.utils.arrayFirst(source, function(item) {
                 return unwrap(item[valueProp]) === modelValue;
           }) || {};  //probably don't need the || {}, but just protect against a bad value          
       } 

       //update the element with the value that should be shown in the input
       $(element).val(modelValue && inputValueProp !== valueProp ? unwrap(modelValue[inputValueProp]) : modelValue.toString());    
    }
};

  

            ko.bindingHandlers.file = {
                init: function (element, valueAccessor) {
                    $(element).change(function () {
                        var file = this.files[0];
                        if (ko.isObservable(valueAccessor())) {
                            valueAccessor()(file);
                        }
                    });
                },

                update: function (element, valueAccessor, allBindingsAccessor) {
                    var file = ko.utils.unwrapObservable(valueAccessor());
                    var bindings = allBindingsAccessor();

                    if (bindings.fileObjectURL && ko.isObservable(bindings.fileObjectURL)) {
                        var oldUrl = bindings.fileObjectURL();
                        if (oldUrl) {
                            window.URL.revokeObjectURL(oldUrl);
                        }
                        bindings.fileObjectURL(file && window.URL.createObjectURL(file));
                    }

                    if (bindings.fileBinaryData && ko.isObservable(bindings.fileBinaryData)) {
                        if (!file) {
                            bindings.fileBinaryData(null);
                        } else {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                bindings.fileBinaryData(e.target.result);
                            };
                            reader.readAsArrayBuffer(file);
                        }
                    }
                }
            };






            return dataService.primeData()
                .then(boot());
        }

        function boot() {
            log('M++ Loaded!', null, true);

            router.on('router:route:not-found', function (fragment) {
                logError('No Route Found', fragment, true);
            });

            var routes = [
                //{ route: '', moduleId: 'shell', title: 'Login', nav: true },
                { route: '', moduleId: 'home', title: 'Početna stranica', nav: true },
                { route: 'upisPodataka:id', moduleId: 'upisPodataka', title: 'Upis podataka', nav: true },

                { route: 'pretrazivanje', moduleId: 'pretrazivanje', title: 'Pretraživanje', nav: true }
                //{ route: 'grid', moduleId: 'grid', title: 'Grid', nav: true },

                
            ];


            return router.makeRelative({ moduleId: 'viewmodels' }) // router will look here for viewmodels by convention
                .map(routes)            // Map the routes
                .buildNavigationModel()
                //.then(function () // Finds all nav routes and readies them
                //{

                //    router.guardRoute = function (routeInfo, params, instance) {
                //        logger.log({
                //            message: "Access denied. Navigation cancelled.",
                //            showToast: true,
                //            type: "warning"
                //        });
                //        return false;
                //    };
                //})
                    
            

                .activate();            // Activate the router
        }

        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(shell), showToast);
        }

        function logError(msg, data, showToast) {
            logger.logError(msg, data, system.getModuleId(shell), showToast);
        }
        //#endregion
    });