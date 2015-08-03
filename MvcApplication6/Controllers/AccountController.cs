using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Security;
using WebMatrix.WebData;


namespace WMpp.Controllers
{
    public class AccountController : ApiController
    {
        public class loginInfo
        {
            public string userName { get; set; }
            public string password { get; set; }

        }

        public enum getParametri
        {
            isAuthenticated,
            logout,
            currentUserName,
            rolesForUser,
            userExists,
            testUserName
        }




        // POST api/account
        [HttpPost]

        public Boolean Login(loginInfo x)
        {



            //var ABT = new AccountsByTxt();
            AccountsByTxt.ucitajKorisnike();


            string chPass = x.password ?? "krivipas";
            if (chPass == "") { chPass = "krivipas"; };
            WebSecurity.Login(x.userName, chPass, true);
           // var zzz = new System.Web.HttpContext.Current.Session();
            //System.Web.HttpContext.Current.Session.Add("USID", WebSecurity.CurrentUserId + "###");//System.Web.HttpContext.Current.Session.SessionID);
            
            
            
            //int userID = WebSecurity.CurrentUserId;
            //M_DATA_HPMEntities context = new M_DATA_HPMEntities();
            //string d=context.tbl_Inventarizacija.Where(y=>y.INV_ID_Inventirao==userID).OrderByDescending(y=>y.ID_Broj).Select(y=>y.ID_Broj).Take(1).ToString();
            
            return true;
            //return c;
            
        }

        //[HttpPost]
        //public Boolean passwordChange(loginInfo x,string oldPassword)
        //{

        //    //return WebSecurity.ChangePassword(x.userName, oldPassword,x.password);
        //}


        [HttpGet]
        public object Gets(int opcija,string paramUserName)
        {
            getParametri i = (getParametri)opcija;
            object returnObject=new object();

            if (i == getParametri.userExists)
            {
                returnObject = WebSecurity.UserExists(paramUserName);
            }

            if (i == getParametri.logout)
            {
                WebSecurity.Logout();
                returnObject= true;
            }

            if (i == getParametri.currentUserName)
            {
                returnObject= WebSecurity.CurrentUserName;
            }

            if (i == getParametri.rolesForUser)
            {
                returnObject = Roles.GetRolesForUser();
            }

            if (i == getParametri.isAuthenticated)
            {
                returnObject = WebSecurity.IsAuthenticated;
            }

            if (i == getParametri.testUserName)
            {
               // HSS.Add("USID", WebSecurity.CurrentUserId + HSS.SessionID);
                returnObject = WebSecurity.CurrentUserId;
            }

            return returnObject;
        }



        [HttpGet]
        public Boolean Get3(string x,string y,string z)
        {

            WebSecurity.Logout();
            return true;
        }
        [HttpGet]
        public string Get4(string x, string y, string z,string w)
        {

            return WebSecurity.CurrentUserName;
        }


        [HttpGet]
        public string[] Get5(string x, string y, string z, string w,string q)
        {

            return Roles.GetRolesForUser();
        }

        //CurrentUserName

        [HttpGet]
        public Boolean Get(string x)
        {

            return WebSecurity.UserExists(x);
        }

        [HttpGet]
        public Boolean Get2()
        {

            return WebSecurity.IsAuthenticated;
        }

        // PUT api/account/5
    }
}
