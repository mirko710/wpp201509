using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WMpp.Core.DB
{
    public class SearchExpressionBuilder
    {
        private const string collation = "COLLATE Latin1_General_CI_AI";

        public static string GetForString(string alias, string column, string value)
        {
            if (value == null)
                return null;
            string sanitizedExpression = value.Replace("'", "''");
            return string.Format("{0}.{1} LIKE '%{2}%' {3}", alias, column, sanitizedExpression, collation);
        }

        public static string GetForInt(string alias, string column, string value)
        {
            int intValue;
            if (!int.TryParse(value, out intValue))
                return null;
            return string.Format("{0}.{1} = {2}", alias, column, value);
        }
    }
}