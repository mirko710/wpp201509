using System.Collections.Generic;
using System.Linq;
using WMpp.Core.VM;

namespace WMpp.Core.DB
{
    public class TableManager
    {
        private Dictionary<string, Table> tables;

        private TableManager()
        {
            this.tables = new Dictionary<string, Table>();
            this.initializeTables();
        }
        
        private void initializeTables()
        {
            this.addToTables("tbl_T_Materijali", "Materijali");
            this.addToTables("tbl_T_Mjesta", "Mjesta" );
            this.addToTables("tbl_T_Nazivi", "Nazivi");
            this.addToTables("tbl_T_Tehnike", "Tehnike");
        }

        private void addToTables(string name, string displayName)
        {
            this.tables.Add(name, new Table(name, displayName));
        }

        public bool TableExists(string tableName)
        {
            return this.tables.ContainsKey(tableName);
        }

        public Table this[string tableName]
        {
            get { return this.tables[tableName]; }
        }

        public IList<Table> GetListOfTables()
        {
            return this.tables.Values.ToList();
        }

        private static object syncRoot = new object();
        private static TableManager _Singleton;
        public static TableManager Singleton
        {
            get
            {
                lock (syncRoot)
                {
                    return _Singleton ?? (_Singleton = new TableManager());
                }
            }
        }
    }
}