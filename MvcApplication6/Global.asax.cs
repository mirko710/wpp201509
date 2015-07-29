﻿using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.Security;
using WebMatrix.WebData;


namespace WMpp
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {



        protected void Application_Start()
        {
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            WebSecurity.InitializeDatabaseConnection("M_DATA_HPMEntitiesMembers", "tbl_T_Kustosi", "ID", "username", true);

            //var AccountsTxtLoader = new AccountsByTxt();
            AccountsByTxt.ucitajKorisnike();
            
            // WebSecurity.ChangePassword("gzlodi","impulse","mpp4web.1");

            //Roles.CreateRole("gost");
            //Roles.CreateRole("kustos");

            //WebSecurity.CreateAccount("gzlodi", "mpp4web.1");
            //WebSecurity.CreateAccount("dzrilic", "test109");
            //WebSecurity.CreateAccount("nsukovic", "test130");
            
            //Roles.AddUserToRole("dzrilic", "kustos");
            //Roles.AddUserToRole("nsukovic", "gost");
            
            
           // Roles.CreateRole("Administrator");
           // Roles.AddUserToRole("gzlodi", "Administrator");
           //Roles.AddUserToRole("gzlodi", "kustos");
        }
    }
}