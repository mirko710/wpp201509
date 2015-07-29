define(['services/logger','services/dataService'], function (logger,data) {
    var title = 'Grid';
    var adressTerminology = 'api/Terminology';
    var tableChoice = ['tbl_T_Nazivi', 'tbl_T_Mjesta', 'tbl_T_Tehnike', 'tbl_T_Materijali'];
    var currentTable = ko.observable('tbl_T_Mjesta');
    var orderByChoice = [{ 'label': 'Pojam', 'term': 'T.Pojam' }, { 'label': 'Pojam DESC', 'term': 'T.Pojam DESC' }, { 'label': 'Nad pojam', 'term': 'T1.Pojam' }, { 'label': 'Nad pojam DESC', 'term': 'T1.Pojam DESC' },  { 'label': 'Ucestalost DESC', 'term': 'T.Ucestalost DESC' }];
    var currentOrderBy = ko.observable('Pojam');
    
    var backLoad = ko.observableArray([]);
    var pageSize = ko.observable(15);
    var pageIndex = ko.observable(1);
    var pageMax = ko.observable(6);
    var recordCount = ko.observable(0);
    var treeView = ko.observableArray([]);
    var tableView = ko.observableArray([]);
    var zaNadTerm = [];
    var firstLoad = true;
    var currentIDT = ko.observable(0);
    var filterText = ko.observable("");

    var termModel = function (IDT, Pojam, Nad_IDT, Ucestalost, Napomena, Biljeska) {
        that = this;
        that.IDT = ko.observable(IDT || null);
        that.Nad_IDT = ko.observable(Nad_IDT || null);
        that.Pojam = ko.observable(Pojam || null);
        that.Napomena = ko.observable(Napomena || null);
        that.Biljeska = ko.observable(Biljeska || null);
        return that;
    }


    var currentItem = ko.observable();

    var vm = {
        currentOrderBy: currentOrderBy,
        orderByChoice:orderByChoice,
        filterText:filterText,
        zaNadTerm:zaNadTerm,
        firstLoad:firstLoad,
        pageChange: pageChange,
        pageChangeFL: pageChangeFL,
        refreshGrid:refreshGrid,
        backLoad: backLoad,
        pageSize: pageSize,
        pageIndex: pageIndex,
        pageMax: pageMax,
        title: title,
        recordCount:recordCount,
        tableChoice: tableChoice,
        activate: activate,
        //bindingComplete:bindingComplete,
        Selects:data.Selects,
        currentTable: currentTable,
        nodeExpander: nodeExpander,
        treeView: treeView,
        tableView:tableView,
        gotoZapis: gotozapis,
        currentIDT: currentIDT,
        currentItem:currentItem
       // canActivate:canActivate

    };

    return vm;

    var gotozapis = function (IDT) {
        console.log(IDT);
        return true;
    }

    function nodeExpander (data, event) {
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

    function postaviFokusTable(tmpl) {
        //$('html, body').animate({
        //alert(tmpl + ' ' +fild);
        if ($('#table_IDT' + tmpl).length == 0) return false;
        var p1 = $('#divScroll').height();
        var p3 = $('#divScroll').scrollTop();
        var p2 = $('#table_IDT' + tmpl).offset().top + $('#table_IDT' + tmpl).height()/2;
        //alert(p1 + ' ' + p2 + ' ' + p3);
        var pRez = -1;//-(p3);

        if (p2 > p3 && p2 <= 0) {
            pRez = p2 - p3;
        } else {
            pRez = p3 + p2;
        }


            $('#divScroll').animate({
                scrollTop: pRez - (p1 / 2)
            }, 700);

 

    }


    function postaviFokusTree(tmpl) {
        //$('html, body').animate({
        //alert(tmpl + ' ' +fild);

        if ($('#tree_IDT' + tmpl).length == 0) return false;

        var p1 = $('#treeScroll').height();
        var p3 = $('#treeScroll').scrollTop();
        var p2 = $('#tree_IDT' + tmpl).offset().top + $('#tree_IDT' + tmpl).height() / 2;

        var pRez = -1;

        if (p2 > p3 && p2 <= 0) {
            pRez = p2 - p3;
        } else {
            pRez = p3 + p2;
        }
        
        $('#treeScroll').animate({
            scrollTop: pRez - (p1 / 2)
        }, 600);
        


    }


   
    function refreshTree() {
 
        var req = $.ajax({
            type: 'GET',
            url:adressTerminology  + '?tableName=' + currentTable() ,
                dataType: 'json',
                contentType: 'application/json',
                success: function (response, text) {
                    treeView(response);
                },
                error: function (text, error) {

                    alert(error);
                    // that._deactivateLoader();
                },
                cancel: function () {
                    //that._deactivateLoader();
                }
            });

            return req;
        }
    
    function activate() {

        if (firstLoad) {
            
            firstLoad = false;
            pageIndex.subscribe(function (newValue) {
                //refreshGrid();
            })

            currentIDT.subscribe(function (newValue) {
                postaviFokusTable(currentIDT());
                postaviFokusTree(currentIDT());
                mapCurrentItem();

            })
            filterText.subscribe(function (newValue) {
                if (newValue.length > 2 || newValue=="") {
                    refreshTable();
                }

            })
            currentOrderBy.subscribe(function (newValue) {
                    refreshTable();
            })

            currentTable.subscribe(function (newValue) {
                //  refreshGrid();
                refreshTable()
                refreshTree();
               // pageIndex(1);
            })


        }
       




        logger.log(title + ' View Activated', null, title, true);
        
        if (treeView().length == 0) {
            //refreshGrid();
            refreshTree();
            refreshTable()
        }


         
        return Q.fcall(function () { return true; });
    }


    function mapCurrentItem() {
         var temp = ko.utils.arrayFirst(tableView(), function (item) {
           return item.IDT == currentIDT();
         });
         currentItem(temp);
         console.log(currentItem());

    }

    function refreshTable() {
        var filter = "true";
        if (filterText() != "") filter = filterText();

        var req = $.ajax({
            type: 'GET',
            url:adressTerminology  + '?tableName=' + currentTable() + '&orderBy=' + currentOrderBy() + '&filterBy=' + filter,
            dataType: 'json',
            contentType: 'application/json',
            success: function (response, text) {
                tableView(response);
            },
            error: function (text, error) {

                alert(error);
                // that._deactivateLoader();
            },
            cancel: function () {
                //that._deactivateLoader();
            }
        });

        return req;
    }
    


    function refreshGrid() {
        
        var gridder=Q.fcall(function(){return data.getGrid(currentTable(), pageSize(), pageIndex() - 1, '', '', backLoad,recordCount);});
        //alert(recordCount());
        //console.log(backLoad());
        // return Q.fcall(function () { return true; });
        
        Q.when(gridder, function () {
            
            var xiv = Math.floor(recordCount() / pageSize());
            console.log("heheh" + xiv);
            pageMax(xiv);
        })
        
       // pageMax(6);
    }

    function pageChangeOld(modifier) {
        if (modifier == -100) {
            pageIndex(1);
        }
        if (modifier == 100) {
            pageIndex(pageMax());
        }
        if (modifier == 1) {
            var tmp = pageIndex();
            if (tmp < pageMax()) {
                tmp++;
                pageIndex(tmp);
            }
        }
        if (modifier == -1) {
            var tmp = pageIndex();
            if (tmp > 1) {
                tmp--;
                pageIndex(tmp);
            }
        }

    }


    function pageChangeFL(modifier) {
        if (modifier == -100) {
            pageIndex(1);
        }
        if (modifier == 100) {
            pageIndex(pageMax());
        }
    }

    function pageChange(modifier) {
        var tmp = pageIndex();
        if (modifier > 0) {
            if (tmp+modifier < pageMax()) {
                tmp=tmp+modifier;
            }
        }
        if (modifier < 0) {
            if (tmp+modifier > 1) {
                tmp=tmp+modifier;
            }
        }
        pageIndex(tmp);
    }
})