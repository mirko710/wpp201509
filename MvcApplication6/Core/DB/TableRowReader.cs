using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WMpp.Core.DB
{
    public class TableRowReader
    {
        private SqlDataReader reader;
        private Table table;
        public TableRowReader(Table table, SqlDataReader reader)
        {
            this.table = table;
            this.reader = reader;
        }

        public TableRow ReadRow()
        {
            if (!reader.Read())
                return null;

            return GetRow();
        }

        public TableRow GetRow()
        {
            int idt = reader.GetInt32(reader.GetOrdinal(table.Metadata.IDT));

            TableRow item = new TableRow(table, idt);

            if (!reader.IsDBNull(reader.GetOrdinal(table.Metadata.NAD_IDT)))
                item.Nad_IDT = reader.GetInt32(reader.GetOrdinal(table.Metadata.NAD_IDT));
            if (!reader.IsDBNull(reader.GetOrdinal(table.Metadata.Preporuceni_IDT)))
                item.Preporuceni_IDT = reader.GetInt32(reader.GetOrdinal(table.Metadata.Preporuceni_IDT));

            item.Pojam = reader[table.Metadata.Pojam].ToString();

            if (!reader.IsDBNull(reader.GetOrdinal(table.Metadata.Napomena)))
                item.Napomena = reader[table.Metadata.Napomena].ToString();

            if (!reader.IsDBNull(reader.GetOrdinal(table.Metadata.Ucestalost)))
                item.Ucestalost = reader.GetInt32(reader.GetOrdinal(table.Metadata.Ucestalost));

            if (!reader.IsDBNull(reader.GetOrdinal(table.Metadata.Biljeske)))
                item.Biljeske = reader[table.Metadata.Biljeske].ToString();

            if (!reader.IsDBNull(reader.GetOrdinal(table.Metadata.Reference)))
                item.Reference = reader[table.Metadata.Reference].ToString();

            if (!reader.IsDBNull(reader.GetOrdinal(table.Metadata.Odgovornost)))
                item.Odgovornost = reader[table.Metadata.Odgovornost].ToString();

            if (!reader.IsDBNull(reader.GetOrdinal(table.Metadata.AutoBroj)))
                item.AutoBroj = reader.GetInt32(reader.GetOrdinal(table.Metadata.AutoBroj));

            return item;
        }

        public IList<TableRow> ReadAll()
        {
            IList<TableRow> result = new List<TableRow>();

            while (reader.Read())
            {
                result.Add(GetRow());
            }

            reader.Close();

            return result;
        }
    }
}