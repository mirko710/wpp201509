using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.Security;
using WebMatrix.WebData;
using System.Configuration;


namespace WMpp
{
    public static class AccountsByTxt
    {

        public static int getUserID()
        {
            var userID = WebSecurity.CurrentUserId;
            return userID;
        }

        public static string getUserName()
        {
            var userName = WebSecurity.CurrentUserName;
            return userName;
        }
        public static void ucitajKorisnike()
        {
            //WebSecurity.InitializeDatabaseConnection("M_DATA_HPMEntitiesMembers", "tbl_T_Kustosi", "ID", "username", true);


            string[] zaSplit = { "#" };
            List<string> korisniciIzBaze = new List<string>();
            string conn = ConfigurationManager.ConnectionStrings["M_DATA"].ToString();
            korisniciIzBaze = SEClasses.GetUserNames(conn);

            
            string pathConfig = HttpContext.Current.Server.MapPath("userConfig.txt");
            if (File.Exists(pathConfig))
            {

                using (StreamReader sr = new StreamReader(pathConfig))
                {
                    while (!sr.EndOfStream)
                    {
                        string rdLn = sr.ReadLine();
                        
                        if (!String.IsNullOrWhiteSpace(rdLn))
                        {

                            string[] podaci = rdLn.Split(zaSplit, StringSplitOptions.RemoveEmptyEntries);
                            string userName = podaci[0];

                            if (korisniciIzBaze.Contains(userName))
                            {


                                try
                                {
                                    WebSecurity.CreateAccount(userName, podaci[1]);
                                }
                                catch (System.Web.Security.MembershipCreateUserException ex)
                                {
                                    Console.WriteLine("većpostoji" + ex.Message);
                                }
                                //if (!WebSecurity.UserExists(userName))
                                //{

                                //    WebSecurity.CreateUserAndAccount(userName, podaci[1]);
                                //}


                                for (int i = 2; i < podaci.Length; i++)
                                {
                                    var rola = podaci[i];
                                    provjeriDaLiPostojiRola(rola);
                                    string[] korisniciURoli = Roles.GetUsersInRole(rola);


                                    if (!Array.Exists(korisniciURoli, s => s == userName))
                                    {
                                        Roles.AddUserToRole(userName, rola);
                                    }

                                }
                            }
                            Console.WriteLine(podaci[0]);
                        }
                    }
                }
            }
        }

        private static void provjeriDaLiPostojiRola(string rola)
        {
            if (!Roles.RoleExists(rola))
            {
                Roles.CreateRole(rola);
            }
        }

    }
}
