using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WMpp.Core.DB.Query
{
    public class QueryTable
    {
        private Table table;
        private string alias;

        public QueryTable(Table table, string alias)
        {
            this.table = table;
            this.alias = alias;
        }

        public Table Table
        {
            get { return table; }
        }

        public string Alias
        {
            get { return alias; }
        }
    }
}