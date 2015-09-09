using System.Reflection.Emit;

namespace WMpp.Core.DB
{
    public class TableMetadata
    {
        public readonly string IDT = "IDT";
        public readonly string NAD_IDT = "NAD_IDT";
        public readonly string Preporuceni_IDT = "Preporuceni_IDT";
        public readonly string Pojam = "Pojam";
        public readonly string Napomena = "Napomena";
        public readonly string Ucestalost = "Ucestalost";
        public readonly string Biljeske = "Biljeske";
        public readonly string Reference = "Reference";
        public readonly string Odgovornost = "Odgovornost";

        public readonly string AutoBroj = "AutoBroj";

        private readonly string tableName;

        public TableMetadata(string tableName)
        {
            this.tableName = tableName;
        }

        public string GetSelectColumns()
        {
            return GetSelectColumns(tableName);
        }

        public string GetSelectColumns(string alias)
        {
            return string.Format("{0}.{1}, {0}.{2}, {0}.{3}, {0}.{4}, {0}.{5}, {0}.{6}, {0}.{7}, {0}.{8}, {0}.{9}, {0}.{10}",
                 alias, IDT, NAD_IDT, Preporuceni_IDT, Pojam, Napomena, Ucestalost, Biljeske, Odgovornost, AutoBroj, Reference);
        }

        public string GetSelectStatement()
        {
            return string.Format("SELECT {0} FROM {1}", GetSelectColumns(), tableName);
        }

        public string GetSelectStatement(string alias)
        {
            return string.Format("SELECT {0} FROM {1} AS {2}", GetSelectColumns(alias), tableName, alias);
        }
    }
}