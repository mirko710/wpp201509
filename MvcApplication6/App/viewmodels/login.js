define(['durandal/system', 'plugins/router', 'services/logger','services/dataService'],
    function (system, router, logger, dataService) {
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
            testUserName: testUserName
           
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
 


            return false;
        }


        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(shell), showToast);
        }

        function logError(msg, data, showToast) {
            logger.logError(msg, data, system.getModuleId(shell), showToast);
        }
        //#endregion
    });