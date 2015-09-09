define(function () {
    // Varijable
    var title = 'Grid';
    var adressTerminology = 'api/Terminology';
    var tables = ko.observableArray([]);
    var currentTable = ko.observable();
    var orderByChoice = [{ label: 'Pojam ASC', term: 'T.Pojam ASC' }, { label: 'Pojam DESC', term: 'T.Pojam DESC' },
                         { label: 'NadPojam ASC', term: 'TParent.Pojam ASC' }, { label: 'NadPojam DESC', term: 'TParent.Pojam DESC' },
                         { label: 'PreporuceniPojam ASC', term: 'TRecommended.Pojam ASC' }, { label: 'PreporuceniPojam DESC', term: 'TRecommended.Pojam DESC' },
                         { label: 'Napomena ASC', term: 'T.Napomena ASC' }, { label: 'Napomena DESC', term: 'T.Napomena DESC' },
                         { label: 'Ucestalost ASC', term: 'T.Ucestalost ASC' }, { label: 'Ucestalost DESC', term: 'T.Ucestalost DESC' },
                         { label: 'Odgovornost ASC', term: 'T.Odgovornost ASC' }, { label: 'Odgovornost DESC', term: 'T.Odgovornost DESC' }];

    var currentOrderByColumn = ko.observable("Pojam").extend({ notify: 'always' });
    var currentOrderByDirection = ko.observable("ASC");
    var lastOrderByColumn = 'Pojam';
    var backLoad = ko.observableArray([]);
    var recordCount = ko.observable(0);
    var treeView = ko.observableArray([]);

    var tableView = ko.observableArray([]);
    var tableZaKombo = ko.observableArray([]);
    var firstLoad = true;
    var currentIDT = ko.observable(null);
    var filterText = ko.observable("");
    var currentAction = ko.observable("");

    // filterModel start
    var filterModel = function() {
        var that = this;

        console.log('filterModel');
        that.Pojam = ko.observable();
        that.NadPojam = ko.observable();
        that.PreporuceniPojam = ko.observable();
        that.Napomena = ko.observable();
        that.Ucestalost = ko.observable();
        that.Odgovornost = ko.observable();

        that.FilterText = ko.observable();

        var separator = ',';

        function getExpression(name, value) {
            if (value == null)
                return name + "=";
            return name + '=' + value.replace(',', ',,').replace('=', '==');
        }

        function shouldRefresh(text) {
            return text.length >= 2;
        }

        function checkAndRefreshTable(changedText) {
            //if (!shouldRefresh(changedText))
            //    return;

            var newFilterText = '';
            newFilterText += getExpression('Pojam', that.Pojam()) + separator;
            newFilterText += getExpression('NadPojam', that.NadPojam()) + separator;
            newFilterText += getExpression('PreporuceniPojam', that.PreporuceniPojam()) + separator;
            newFilterText += getExpression('Napomena', that.Napomena()) + separator;
            newFilterText += getExpression('Ucestalost', that.Ucestalost()) + separator;
            newFilterText += getExpression('Odgovornost', that.Odgovornost());
            that.FilterText(newFilterText);
            filterText(newFilterText);
        }

        that.Pojam.subscribe(checkAndRefreshTable);
        that.NadPojam.subscribe(checkAndRefreshTable);
        that.PreporuceniPojam.subscribe(checkAndRefreshTable);
        that.Napomena.subscribe(checkAndRefreshTable);
        that.Ucestalost.subscribe(checkAndRefreshTable);
        that.Odgovornost.subscribe(checkAndRefreshTable);
    }
    var filter = ko.observable();
    // filterModel end

    // pagingModel start
    var pagingModel = function () {
        var that = this;

        that.InitialPageNumber = ko.observable(1);
        that.MaxPageNumber = ko.observable(1);
        that.CurrentPages = ko.observableArray();
        that.ItemsPerPage = ko.observable(100);
        that.FromNumber = ko.observable();
        that.ToNumber = ko.observable();
        that.TotalNumber = ko.observable();
        that.IsVisible = ko.observable(false);

        that.AvailableItemsPerPage = ko.observableArray([{ value: 5 }, { value: 10 }, { value: 50 }, { value: 100 }, { value: 500 }, { value: 1000 }]);
        that.CurrentPageNumber = ko.observable(1);

        that.MaxPageNumber.subscribe(function (newValue) {
            if (that.CurrentPages)
                that.CurrentPages.removeAll();
            if (that.MaxPageNumber() == 0)
                return;
            that.CurrentPages.push('Prethodna');
            that.CurrentPages.push('Sljedeća');
        });

        that.ChangeCurrentPageNumber = function (value) {

            if (value == 'Prethodna') {
                if (that.CurrentPageNumber() > 1) {
                    that.CurrentPageNumber(that.CurrentPageNumber() - 1);
                    refreshTable();
                }
            }
            else if (value == 'Sljedeća') {
                if (that.CurrentPageNumber() < that.MaxPageNumber()) {
                    that.CurrentPageNumber(that.CurrentPageNumber() + 1);
                    refreshTable();
                }
            }
            else {
                that.CurrentPageNumber(value);
            }
        }

        that.ItemsPerPage.subscribe(function (oldValue) {
            that.CurrentPageNumber(1);
            refreshTable();
        });

        that.ChangeItemsPerPage = function (value) {
            that.CurrentPageNumber(1);
            refreshTable();
        }
    }

    var paging = ko.observable();
    // pagingModel end

    // termModel start
    var termModel = function (IDT, Pojam, Nad_IDT, Preporuceni_IDT, Ucestalost, Napomena, Biljeske, Reference, Odgovornost) {
        var that = this;
        that.IDT = ko.observable(IDT || null);
        that.Nad_IDT = ko.observable(Nad_IDT || null);
        that.Preporuceni_IDT = ko.observable(Preporuceni_IDT || null);
        that.Pojam = ko.observable(Pojam || null);
        that.Napomena = ko.observable(Napomena || null);
        that.Ucestalost = ko.observable(Ucestalost);
        that.Biljeske = ko.observable(Biljeske || null);
        that.Reference = ko.observable(Reference || null);
        that.Odgovornost = ko.observable(Odgovornost || null);
        that.Tablica = ko.observable(currentTable());

        that.podTermini = ko.observableArray([]);
        that.NadPojmovi = ko.observableArray();

        return that;
    }
    // termModel end

    // treeModel start
    var treeModel = function (IDT, Pojam, Roditelj, ImaDjecu) {
        var that = this;
        that.IDT = ko.observable(IDT);
        that.IsRoot = ko.observable(false);
        that.OriginalniPojam = ko.observable(Pojam);
        that.OriginalniRoditelj = ko.observable(Roditelj);
        that.ImaDjecu = ko.observable(ImaDjecu);
        that.Djeca = ko.observableArray(null);
        that.DjecaInicijalizirana = ko.observable(false);
        that.Rasireno = ko.observable(false);

        that.IsCurrent = ko.computed(function () {
            return that.IDT() == currentIDT();
        }, that);

        that.PostojeDjeca = ko.computed(function () {
            if (that.Djeca().length > 0)
                return true;
            if (!that.DjecaInicijalizirana()) {
                return that.ImaDjecu();
            }
            return that.Djeca().length > 0;
        }, that);

        that.Ikona = ko.computed(function () {
            if (!that.PostojeDjeca())
                return '';
            return that.Rasireno() ? '../../Content/images/toggle-collapse-icon.png' : '../../Content/images/toggle-expand-icon.png';
        }, that);

        that.Toggle = function () {
            console.log('Toggle');
            if (!that.Rasireno()) {
                if (!that.DjecaInicijalizirana()) {
                    ucitajDjecu(that);
                    that.DjecaInicijalizirana(true);
                }
            }

            that.Rasireno(!that.Rasireno());
        }

        that.Roditelj = ko.computed({
            read: that.OriginalniRoditelj,
            write: function (newValue) {

                if (that.OriginalniRoditelj() != null && that.OriginalniRoditelj().Djeca != null)
                    that.OriginalniRoditelj().Djeca.remove(that);
                that.OriginalniRoditelj(newValue);
                that.DodajUDjecu(that.Roditelj(), that);
            }
        });

        that.Pojam = ko.computed({
            read: that.OriginalniPojam,
            write: function (newValue) {
                that.OriginalniPojam(newValue);

                that.DodajUDjecu(that.Roditelj(), that);
            }
        });

        that.DodajUDjecu = function (roditelj, stavka) {
            log('DodajUDjecu');
            if (roditelj.Djeca != null)
                roditelj.Djeca.remove(stavka);
            if (!roditelj.DjecaInicijalizirana()) {
                roditelj.ImaDjecu(true);
                return;
            }
            var minIndex = 0;
            var maxIndex = roditelj.Djeca().length - 1;
            var currentIndex;
            var checkString = 0;

            while (minIndex <= maxIndex) {
                currentIndex = (minIndex + maxIndex) / 2 | 0;
                checkString = roditelj.Djeca()[currentIndex].Pojam().localeCompare(stavka.Pojam(), "hr", { caseFirst: 'false' });

                if (checkString < 0) {
                    minIndex = currentIndex + 1;
                }
                else if (checkString > 0) {
                    maxIndex = currentIndex - 1;
                }
                else
                    break;
            }

            console.log('Pronađeni indeks je ' + minIndex);
            roditelj.Djeca.splice(minIndex, 0, stavka);
        }
    }

    // treeModel end

    // tableModel start
    var tableModel = function (IDT, Pojam, Nad_IDT, Ucestalost, Napomena, NadPojam, PreporuceniPojam, Odgovornost) {
        var that = this;
        that.IDT = ko.observable(IDT);
        that.Pojam = ko.observable(Pojam);
        that.Nad_IDT = ko.observable(Nad_IDT);
        that.Ucestalost = ko.observable(Ucestalost);
        that.Odgovornost = ko.observable(Odgovornost || null);
        that.Napomena = ko.observable(Napomena);
        that.NadPojam = ko.observable(NadPojam);
        that.PreporuceniPojam = ko.observable(PreporuceniPojam);
        
        that.IsCurrent = ko.computed(function () {
            return that.IDT() == currentIDT();
        }, that);
    }

    var rootTreeViewItem = ko.observable();
    var currentItem = ko.observable();
    var tekstNadredeniPojam = ko.observable("");
    var stavkeNadredeniPojam = ko.observableArray();
    var tekstPreporuceniPojam = ko.observable("");
    var stavkePreporuceniPojam = ko.observableArray();
    var minimalnaDuljinaAutoComplete = 3;

    var vm = {
        tableZaKombo: tableZaKombo,
        currentOrderByColumn: currentOrderByColumn,
        currentOrderByDirection: currentOrderByDirection,
        orderByChoice: orderByChoice,
        filterText: filterText,
        firstLoad: firstLoad,
        backLoad: backLoad,
        title: title,
        recordCount: recordCount,
        tables: tables,
        activate: activate,
        currentTable: currentTable,
        rootTreeViewItem: rootTreeViewItem,
        treeView: treeView,
        tableView: tableView,
        currentIDT: currentIDT,
        currentItem: currentItem,
        saveLocal: saveLocal,
        createNew: createNew,
        deleteCurrentItem: deleteCurrentItem,
        paging: paging,
        tekstNadredeniPojam: tekstNadredeniPojam,
        stavkeNadredeniPojam: stavkeNadredeniPojam,
        tekstPreporuceniPojam: tekstPreporuceniPojam,
        stavkePreporuceniPojam: stavkePreporuceniPojam,
        btnFilterClick: btnFilterClick,
        filter: filter,
        currentAction: currentAction
    };

    return vm;


    function getTerm() {
        var searchFor = currentOrderByColumn() + ' ' + currentOrderByDirection();
        for (var i = 0; i < orderByChoice.length; i++) {
            if (orderByChoice[i].label == searchFor) {
                return orderByChoice[i].term;
            }
        }
    }

    function getControllerName() {
        for (var i = 0; i < tables.length; i++) {
            if (tables[i].name == currentTable()) {
                return tables[i].controllerName;
            }
        }
    }

    function getControllerAddress() {
        return adressTerminology;
    }

    function getOrderByDirection(column) {
        console.log('lastOrderByColumn:' + lastOrderByColumn + '. column:' + column);
        console.log('currentOrderByDirection:' + currentOrderByDirection());
        if (lastOrderByColumn == column) {
            if (currentOrderByDirection() == "ASC")
                return "DESC";
            else
                return "ASC";
        }
        else {
            return "ASC";
        }
    }

    // log and notify

    function log(text, object) {
        var json = ko.toJSON(object, function (key, value) {
            if (key == 'Roditelj' || key == 'OriginalniRoditelj') { return ""; }
            else { return value; }
        });
        console.log(text + ': ' + json);
    }

    function notifySuccess(text) {
        toastr.success(text);
    }

    function notifyWarning(text) {
        toastr.warning(text.replace('\r\n', '</br>'), "Upozorenje");
    }

    function notifyError(text) {
        toastr.error(text, "Pogreška");
    }


    function saveLocal() {

        console.log('saveLocal. currentIDT: ' + currentIDT());
        if (!currentIDT()) {
            return;
        }

        if (currentIDT() == -1) {
            if (insertItem()) {
                var dijete = new treeModel(currentIDT(), currentItem().Pojam, rootTreeViewItem(), false);
                rootTreeViewItem().Djeca.push(dijete);
            }
            else
                return;
        }
        else {
            if (!updateItem())
                return;
        }

        notifySuccess('Promjene su uspješno spremljene.');

        //edit treeView
        var targetEL = document.getElementById('tree_IDT' + currentIDT());
        if (targetEL != null) {

            var context = ko.contextFor(targetEL);
            log('context', context.$data);
            var originalContext = ko.contextFor(targetEL);
            // ---------------- Pojam ---------------------------
            if (context.$data.Pojam() != currentItem().Pojam()) {
                console.log('Promijenio se pojam');
                context.$data.Pojam(currentItem().Pojam());
            }
            // ---------------- End Pojam ---------------------------

            console.log('context.$data.Roditelj().IDT():' + context.$data.Roditelj().IDT());
            console.log('currentItem().Nad_IDT():' + currentItem().Nad_IDT());
            // ---------------- Nadređeni pojam ---------------------------
            if (context.$data.Roditelj().IDT() != currentItem().Nad_IDT()) {
                console.log('Promijenio se nadređeni pojam');

                var parentEL = document.getElementById('tree_IDT' + currentItem().Nad_IDT());
                if (parentEL != null) {
                    var parentContext = ko.contextFor(parentEL);
                    log('novi roditelj je ', parentContext.$data);
                    //parentContext.$data.Roditelj().Djeca.remove(context.$data);
                    context.$data.Roditelj(parentContext.$data);
                }
                else {
                    context.$data.Roditelj(rootTreeViewItem());
                }

            }
            // ---------------- End Nadređeni pojam --------------------------- 
        }

        //edit tableView
        var targetEL = document.getElementById('table_IDT' + currentIDT());
        
        dohvatiIPostaviFokusTable(true);
        dohvatiIPostaviFokusTree();
        getCurrentItem(true);

        return true;
    }

    function btnFilterClick() {
        console.log('btn-filter.click');

        var $panel = $('.btn-filter').parents('.filterable'),
            $filters = $panel.find('.filters input'),
            $tbody = $panel.find('.table tbody');

        console.log($('#filterPojam'));
        console.log($('#filterPojam').css("display"));

        if ($filters.css('display') == 'none') {
            $filters.css('display', '');
            $filters.first().focus();
        } else {
            //$filters.val('').prop('disabled', true);
            //$tbody.find('.no-result').remove();
            $filters.css('display', 'none');
            $tbody.find('tr').show();
        }
    }

    // Inicijalno start
    function activate() {

        if (firstLoad) {

            firstLoad = false;
            rootTreeViewItem(new treeModel(-1, "", null, true));
            rootTreeViewItem().IsRoot(true);
            rootTreeViewItem().DjecaInicijalizirana(true);
            paging(new pagingModel());
            filter(new filterModel());

            currentIDT.subscribe(function(newValue) {
                console.log('currentIDT se promijenio u:' + newValue);

                if (newValue == 0 || newValue == -1)
                    return;

                if (newValue > 0) {
                    dohvatiIPostaviFokusTable();

                    getCurrentItem().then(function() {

                        dohvatiIPostaviFokusTree();
                    });
                } else
                    getCurrentItem();
            });

            filterText.subscribe(function(newValue) {
                if (newValue.length > 1 || newValue == "") {

                    paging().ChangeCurrentPageNumber(1);
                    refreshTable();
                }

            });

            currentOrderByColumn.subscribe(function(newValue) {
                currentOrderByDirection(getOrderByDirection(newValue));
                lastOrderByColumn = newValue;
                refreshTable();
            });

            currentTable.subscribe(function (newValue) {
                console.log('currentTable: ' + currentTable());
                paging().IsVisible(false);
                paging().CurrentPages.removeAll();
                paging().CurrentPageNumber(1);
                refreshTree();
                if (currentTable() != null) {
                    refreshTable().then(function() {
                        tableZaKombo(tableView());
                        paging().IsVisible(true);
                    });
                }
                currentIDT(null);
            });


            tekstNadredeniPojam.subscribe(function (newValue) {
                // kad je duljina = minimalnaDuljinaAutoComplete radi se upit na server.
                // kad je duljina veća, kontrola sama radi filter
                if (tekstNadredeniPojam().length != minimalnaDuljinaAutoComplete)
                    return;

                var req = $.ajax({
                    type: 'GET',
                    url: adressTerminology + '?mode=Table&tableName=' + currentTable() + '&orderBy=' + getTerm() + '&filterBy=' + tekstNadredeniPojam() + '&pageNumber=1&itemsPerPage=10000000&id=-1',
                    dataType: 'json',
                    contentType: 'application/json',
                    async: false,
                    success: function (response, text) {
                        stavkeNadredeniPojam(response.Items);
                        console.log('tekstNadredeniPojam.changeValue: ' + ko.toJSON(response.Items));
                    },
                    error: function (xhr, textStatus, err) {
                        notifyError(xhr.responseText);
                    },
                    cancel: function () {
                    }
                });
                return req;
            });

            tekstPreporuceniPojam.subscribe(function (newValue) {
                // kad je duljina = minimalnaDuljinaAutoComplete radi se upit na server.
                // kad je duljina veća, kontrola sama radi filter
                if (tekstPreporuceniPojam().length != minimalnaDuljinaAutoComplete)
                    return;

                var req = $.ajax({
                    type: 'GET',
                    url: adressTerminology + '?mode=Table&tableName=' + currentTable() + '&orderBy=' + getTerm() + '&filterBy=' + tekstPreporuceniPojam() + '&pageNumber=1&itemsPerPage=' + paging().ItemsPerPage() + '&id=-1',
                    dataType: 'json',
                    contentType: 'application/json',
                    async: false,
                    success: function (response, text) {
                        stavkePreporuceniPojam(response.Items);
                    },
                    error: function (xhr, textStatus, err) {
                        notifyError(xhr.responseText);
                    },
                    cancel: function () {
                    }
                });
                return req;
            });

            loadTables();
        }

        if (treeView().length == 0) {
            if (currentTable() != null) {
                refreshTree();
                refreshTable().then(function() {
                    tableZaKombo(tableView());
                });
            }
        }

        return true;
    }
    function loadTables() {
        var req = $.ajax({
            type: 'GET',
            url: adressTerminology,
            dataType: 'json',
            contentType: 'application/json',
            success: function (response, text) {
                tables(response);
            },
            error: function (xhr, textStatus, err) {
                notifyError(xhr.responseText);
            },
            cancel: function () {
            }
        });
    }

    // Inicijalno end

    // Database functions start
    function getCurrentItem(paramGetOnlyRelationshipData) {
        var getOnlyRelationshipData = paramGetOnlyRelationshipData || false;
        if (!currentIDT()) {
            currentItem(null);
            return;
        }
        // insert
        if (currentIDT() == -1) {
            return;
        }
        var req = $.ajax({
            type: 'GET',
            url: getControllerAddress() + '?mode=Item&tableName=' + currentTable() + '&id=' + currentIDT(),
            dataType: 'json',
            contentType: 'application/json',
            success: function (response, text) {
                if (!getOnlyRelationshipData)
                    currentItem(new termModel(response.IDT, response.Pojam, response.Nad_IDT, response.Preporuceni_IDT, response.Ucestalost, response.Napomena, response.Biljeske, response.Reference, response.Odgovornost));

                console.log(response.Pojam);
                if (currentItem().NadPojmovi != null)
                    currentItem().NadPojmovi.removeAll();

                if (response.NadredeniPojmovi) {
                    var nadredeniPojam = response.NadredeniPojmovi[0];
                    stavkeNadredeniPojam.push(nadredeniPojam);
                    if (response.NadredeniPojmovi)
                        tekstNadredeniPojam(nadredeniPojam.Pojam);
                    
                    currentItem().NadPojmovi(response.NadredeniPojmovi)
                    console.log('NadPojmovi: ' + ko.toJSON(response.NadredeniPojmovi));
                }

                if (response.PreporuceniPojam) {
                    stavkePreporuceniPojam.push(response.PreporuceniPojam);
                    if (response.NadredeniPojam)
                        tekstPreporuceniPojam(response.PreporuceniPojam.Pojam);
                }

                if (currentItem() != null)
                    currentAction(currentItem().Pojam());
            },
            error: function (xhr, textStatus, err) {
                notifyError(xhr.responseText);
            },
            cancel: function () {
            }
        });

        return req;
    }

    function createNew() {
        console.log('createNew');
        console.log('currentIDT: ' + currentIDT());
        currentAction('Novi pojam');
        console.log(currentAction());
        currentItem(new termModel(-1, '', '', '', '', '', '', '', ''));
        currentIDT(-1);
        console.log('currentIDT: ' + currentIDT());
    }

    function deleteCurrentItem() {

        console.log('deleteCurrentItem. currentIDT ' + currentIDT());
        if (!currentIDT()) {
            currentItem(null);
            return;
        }
        if (currentIDT() == -1) {
            currentIDT(null);
            currentItem(null);
            return;
        }

        var children = 0;
        var recommended = null;
        $.ajax({
            type: 'GET',
            url: getControllerAddress() + '?mode=CheckDelete&tableName=' + currentTable() + '&id=' + currentIDT(),
            dataType: 'json',
            contentType: 'application/json',
            async: false,
            success: function (response, text) {
                children = response.Children;
                recommended = response.Recommended;
            },
            error: function (xhr, textStatus, err) {
                if (xhr.statusText == 'Message')
                    notifyWarning(xhr.responseText);
                else
                    notifyError(xhr.responseText);
            },
            cancel: function () {
            }
        });

        var message1 = '';
        var message2 = '';
        if (children > 0)
            message1 = 'Ukupan broj podređenih stavki: ' + children + '. Najprije obrišite podređene stavke.';
        if (recommended.length > 0) {
            message2 = 'Broj stavki za koje je odabrana stavka preporučena: ' + recommended.length + '. Uklonite preporučenu stavku za: ';
            for (var i = 0; i < recommended.length; i++)
                message2 += '</br>' + recommended[i];

        }


        var message = '';
        if (message1.length > 0 && message2.length > 0)
            message = 'Brisanje nije moguće jer postoje vezane stavke.</br>' + message1 + '</br>' + message2;
        else if (message1.length > 0)
            message = 'Brisanje nije moguće jer postoje vezane stavke.</br>' + message1;
        else if (message2.length > 0)
            message = 'Brisanje nije moguće jer postoje vezane stavke.</br>' + message2;
        if (message.length > 0) {
            notifyWarning(message);
            return;
        }

        if (!confirm('Jesti li sigurni da želite obrisati stavku?'))
            return;

        var result = false;
        var req = $.ajax({
            type: 'GET',
            url: getControllerAddress() + '?mode=Delete&tableName=' + currentTable() + '&id=' + currentIDT(),
            dataType: 'json',
            contentType: 'application/json',
            async: false,
            success: function (response, text) {
                var targetEl = document.getElementById('tree_IDT' + currentIDT());
                if (targetEl != null) {

                    var context = ko.contextFor(targetEl);
                    context.$data.Roditelj().Djeca.remove(context.$data);
                }

                // ako nema podelemenata, obriši u tablici. Inače učitaj stranicu (u protivnom bi se prvo trebali dohvatiti podelementi, pa tražiti po tablici i micati ih).
                if (children == 0) {
                    var targetEL = document.getElementById('table_IDT' + currentIDT());
                    if (targetEL != null) {
                        var context = ko.contextFor(targetEL);

                        var chItem = context.$data;
                        var chIndex = tableView.indexOf(chItem);

                        tableView.splice(chIndex, 1);
                    }
                    paging().ToNumber(paging().ToNumber() - 1);
                    paging().TotalNumber(paging().TotalNumber() - 1);
                    if (paging().ToNumber() == 0)
                        paging().FromNumber(0);
                }
                else
                    refreshTable();
                //TODO: izbaciti iz tableZaKombo
                //tableZaKombo.find()
                currentIDT(null);
                result = true;
                notifySuccess('Podatak je uspješno obrisan');
            },
            error: function (xhr, textStatus, err) {
                console.log('xhr:' + ko.toJSON(xhr))
                if (xhr.statusText == 'Message')
                    notifyWarning(xhr.responseText);
                else
                    notifyError(xhr.responseText);
            },
            cancel: function () {
            }
        });

        return result;
    }

    function insertItem() {
        console.log('insertItem');
        
        var result = false;
        console.log('before insert: ' + ko.toJSON(currentItem()));
        var req = $.ajax({
            type: 'POST',
            url: getControllerAddress(),
            dataType: 'json',
            data: ko.toJSON(currentItem()),
            contentType: 'application/json',
            async: false,
            success: function (response, text) {
                currentItem(new termModel(response.IDT, response.Pojam, response.Nad_IDT, response.Preporuceni_IDT, response.Ucestalost, response.Napomena, response.Biljeske, response.Reference, response.Odgovornost));
                console.log('after insert: ' + ko.toJSON(currentItem()));
                currentIDT(currentItem().IDT());
                console.log('IDT after insert: ' + currentIDT());
                result = true;
            },
            error: function (xhr, textStatus, err) {
                if (xhr.statusText == 'Message')
                    notifyWarning(xhr.responseText);
                else
                    notifyError(xhr.responseText);
            },
            cancel: function () {
            }
        });

        return result;
    }

    function updateItem() {
        console.log('updateItem');
        var controllerName = getControllerName(currentTable());
        console.log('before update: ' + ko.toJSON(currentItem()));

        var result = false;

        var req = $.ajax({
            type: 'PUT',
            url: getControllerAddress() + '/' + currentIDT(),
            data: ko.toJSON(currentItem()),
            contentType: 'application/json',
            async: false,
            success: function (response, text) {
                result = true;
            },
            error: function (xhr, textStatus, err) {
                if (xhr.statusText == 'Message')
                    notifyWarning(xhr.responseText);
                else
                    notifyError(xhr.responseText);
            },
            cancel: function () {
            }
        });

        return result;
    }

    // Database functions end

    // Fokus table & tree start
    function dohvatiIPostaviFokusTable(alwaysGetPageForCurrentIDT) {
        var targetEL = $('#table_IDT' + currentIDT());
        if (targetEL.length == 0 || alwaysGetPageForCurrentIDT) {
            // redak nije na trenutnoj stranici
            var result = getPageForCurrentIDT();

            if (result == null || result <= 0) {
                notifyWarning('Element se ne može prikazati u tablici zbog postavljenog filtera.')
            }
            else {
                paging().ChangeCurrentPageNumber(result);
                refreshTable(postaviFokusTable);
            }
        }
        else {
            postaviFokusTable();
        }
    }
    function postaviFokusTable() {

        var targetEL = $('#table_IDT' + currentIDT());
        if (targetEL.length == 0)
            return false;

        console.log('postaviFokusTable.1.');
        var p1 = $('#divScroll').height();
        var p3 = $('#divScroll').scrollTop();
        var p2 = targetEL.offset().top + targetEL.height() / 2;

        var pRez = -1;

        if (p2 > p3 && p2 <= 0) {
            pRez = p2 - p3;
        } else {
            pRez = p3 + p2;
        }

        $('#divScroll').animate({
            scrollTop: pRez - (p1)
        }, 700);



    }

    function dohvatiIPostaviFokusTree() {
        console.log('dohvatiIPostaviFokusTree');
        var targetEL = document.getElementById('tree_IDT' + currentIDT());
        if (targetEL == null) {
            // element nije učitan u treeview
            var i = 0;
            var nadPojmovi = currentItem().NadPojmovi.slice(0);
            nadPojmovi.reverse();
            for (; i < nadPojmovi.length; i++) {
                console.log('Pojam: ' + nadPojmovi[i].Pojam);
                targetEL = document.getElementById('tree_IDT' + nadPojmovi[i].IDT);
                if (targetEL != null) {
                    var context = ko.contextFor(targetEL);
                    if (context.$data.DjecaInicijalizirana())
                        continue;
                    else
                        break;
                }
                else
                    break;
            }

            ucitajDjecuRekurzivno(i);
        }

        postaviFokusTree();
    }

    function postaviFokusTree() {
        var targetEL = $('#tree_IDT' + currentIDT());
        if (targetEL.length == 0) return false;

        var p1 = $('#treeScroll').height();
        var p3 = $('#treeScroll').scrollTop();
        var p2 = targetEL.offset().top + targetEL.height() / 2;

        var pRez = -1;

        if (p2 > p3 && p2 <= 0) {
            pRez = p2 - p3;
        } else {
            pRez = p3 + p2;
        }

        $('#treeScroll').animate({
            scrollTop: pRez - (p1 / 2.2)
        }, 600);

    }
    // Fokus table & tree end

    function ucitajDjecu(stavka) {

        var req = $.ajax({
            type: 'GET',
            url: adressTerminology + '?mode=TreeView&tableName=' + currentTable() + '&id=' + stavka.IDT(),
            dataType: 'json',
            contentType: 'application/json',
            success: function (response, text) {
                $.each(response, function (index, element) {
                    stavka.Djeca.push(new treeModel(element.IDT, element.Pojam, stavka, element.ImaDjecu));
                });
            },
            error: function (text, error) {

                notifyError(xhr.responseText);
            },
            cancel: function () {

            }
        });

        return req;
    }

    function ucitajDjecuRekurzivno(i) {
        var nadPojmovi = currentItem().NadPojmovi.slice(0);
        nadPojmovi.reverse();
        if (i >= nadPojmovi.length) {
            postaviFokusTree();
            return;
        }
        //for (; i < nadPojmovi.length ; i++) {
        console.log('Trenutni indeks: ' + i);
        log('Trenutni pojam', nadPojmovi[i]);
        console.log('Trenutni IDT: ' + nadPojmovi[i].IDT);
        var targetEL = document.getElementById('tree_IDT' + nadPojmovi[i].IDT);
        log('targetEL', targetEL == null ? 'null' : 'not null');
        var context = ko.contextFor(targetEL);
        //log('context', context);
        //if (context.$data.DjecaInicijalizirana()) {
        //    ucitajDjecuRekurzivno(i + 1);
        //}
        //else {
        ucitajDjecu(context.$data).then(function () {
            context.$data.Rasireno(true);
            context.$data.DjecaInicijalizirana(true);
            //postaviFokusTree(currentIDT());
            ucitajDjecuRekurzivno(i + 1);
        }
        );
        //}
        //}
    }

    // refresh tree and data start
    function refreshTree() {
        if (currentTable() == null)
            return;
        var req = $.ajax({
            type: 'GET',
            url: adressTerminology + '?mode=TreeView&tableName=' + currentTable() + '&id=-1',
            dataType: 'json',
            contentType: 'application/json',
            success: function (response, text) {

                rootTreeViewItem().Djeca.removeAll();
                var temp = [];
                $.each(response, function (index, element) {
                    var dijete = new treeModel(element.IDT, element.Pojam, rootTreeViewItem(), element.ImaDjecu);
                    temp.push(dijete);
                });
                if (temp.length > 100) {
                    rootTreeViewItem().Djeca.push.apply(rootTreeViewItem().Djeca, temp.slice(0, 100));
                    rootTreeViewItem().Djeca.push.apply(rootTreeViewItem().Djeca, temp.slice(101));
                }
                else
                    rootTreeViewItem().Djeca.push.apply(rootTreeViewItem().Djeca, temp);

            },
            error: function (xhr, textStatus, err) {

                notifyError(xhr.responseText);
            },
            cancel: function () {

            }
        });

        return req;
    }

    function refreshTable(callback) {
        if (currentTable() == null)
            return;
        var filter = "";

        if (filterText() != "") filter = filterText();
        console.log(paging().ItemsPerPage());
        var req = $.ajax({
            type: 'GET',
            url: adressTerminology + '?mode=Table&tableName=' + currentTable() + '&orderBy=' + getTerm() + '&filterBy=' + filter + '&pageNumber=' + paging().CurrentPageNumber() + '&itemsPerPage=' + paging().ItemsPerPage() + '&id=-1',
            dataType: 'json',
            contentType: 'application/json',
            success: function (response, text) {

                tableView.removeAll();
                var temp = [];
                $.each(response.Items, function (index, element) {
                    var dijete = new tableModel(element.IDT, element.Pojam, element.Nad_IDT, element.Ucestalost, element.Napomena, element.NadPojam, element.PreporuceniPojam, element.Odgovornost);
                    temp.push(dijete);
                });

                tableView.push.apply(tableView, temp);

                paging().MaxPageNumber(response.MaxPageNumber);
                paging().FromNumber(response.FromNumber);
                paging().ToNumber(response.ToNumber);
                paging().TotalNumber(response.TotalNumber);

                console.log('maxPageNumber: ' + paging().MaxPageNumber());
                if (
                    filterText() == "") {
                    //$('#treeScroll').animate({
                    //    scrollTop: 0
                    //}, 600);
                }
                if (callback)
                    callback();
            },
            error: function (xhr, textStatus, err) {
                notifyError(xhr.responseText);
            },
            cancel: function () {
            }
        });
        return req;
    }

    // refresh tree and data end

    function getPageForCurrentIDT() {
        var filter = "";

        var result = -1;
        if (filterText() != "") filter = filterText();
        console.log("filter: " + filter);
        var req = $.ajax({
            type: 'GET',
            url: adressTerminology + '?mode=PageNumber&tableName=' + currentTable() + '&orderBy=' + getTerm() + '&filterBy=' + filter + '&pageNumber=' + paging().CurrentPageNumber() + '&itemsPerPage=' + paging().ItemsPerPage() + '&id=' + currentIDT(),
            dataType: 'json',
            async: false,
            contentType: 'application/json',
            success: function (response, text) {
                console.log('stavka se nalazi na stranici: ' + response.PageNumber);
                result = response.PageNumber;
            },
            error: function (xhr, textStatus, err) {
                notifyError(xhr.responseText);
            },
            cancel: function () {
            }
        });
        return result;
    }
})