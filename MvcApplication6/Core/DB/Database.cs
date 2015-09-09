using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace WMpp.Core.DB
{
    public class Database
    {
        public static string ConnectionString = ConfigurationManager.ConnectionStrings["M_DATA"].ToString();
    }
}