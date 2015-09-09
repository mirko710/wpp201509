using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WMpp.Core.DB
{
    public class TableRow_SqlCommandMapping
    {
        public static void Map(TableRow tableRow, SqlCommand command)
        {
            if (tableRow.Nad_IDT == null)
                command.Parameters.Add("@" + tableRow.Table.Metadata.NAD_IDT, SqlDbType.Int).Value = DBNull.Value;
            else
                command.Parameters.Add("@" + tableRow.Table.Metadata.NAD_IDT, SqlDbType.Int).Value = tableRow.Nad_IDT;

            if (tableRow.Preporuceni_IDT == null)
                command.Parameters.Add("@" + tableRow.Table.Metadata.Preporuceni_IDT, SqlDbType.Int).Value = DBNull.Value;
            else
                command.Parameters.Add("@" + tableRow.Table.Metadata.Preporuceni_IDT, SqlDbType.Int).Value = tableRow.Preporuceni_IDT;

            if (tableRow.Pojam == null)
                command.Parameters.Add("@" + tableRow.Table.Metadata.Pojam, SqlDbType.NVarChar).Value = DBNull.Value;
            else
                command.Parameters.Add("@" + tableRow.Table.Metadata.Pojam, SqlDbType.NVarChar).Value = tableRow.Pojam;

            if (tableRow.Napomena == null)
                command.Parameters.Add("@" + tableRow.Table.Metadata.Napomena, SqlDbType.NVarChar).Value = DBNull.Value;
            else
                command.Parameters.Add("@" + tableRow.Table.Metadata.Napomena, SqlDbType.NVarChar).Value = tableRow.Napomena;

            if (tableRow.Ucestalost == null)
                command.Parameters.Add("@" + tableRow.Table.Metadata.Ucestalost, SqlDbType.Int).Value = DBNull.Value;
            else
                command.Parameters.Add("@" + tableRow.Table.Metadata.Ucestalost, SqlDbType.Int).Value = tableRow.Ucestalost;

            if (tableRow.Biljeske == null)
                command.Parameters.Add("@" + tableRow.Table.Metadata.Biljeske, SqlDbType.NVarChar).Value = DBNull.Value;
            else
                command.Parameters.Add("@" + tableRow.Table.Metadata.Biljeske, SqlDbType.NVarChar).Value = tableRow.Biljeske;

            if (tableRow.Reference == null)
                command.Parameters.Add("@" + tableRow.Table.Metadata.Reference, SqlDbType.NVarChar).Value = DBNull.Value;
            else
                command.Parameters.Add("@" + tableRow.Table.Metadata.Reference, SqlDbType.NVarChar).Value = tableRow.Reference;

            if (tableRow.Odgovornost == null)
                command.Parameters.Add("@" + tableRow.Table.Metadata.Odgovornost, SqlDbType.NVarChar).Value = DBNull.Value;
            else
                command.Parameters.Add("@" + tableRow.Table.Metadata.Odgovornost, SqlDbType.NVarChar).Value = tableRow.Odgovornost;

            command.Parameters.Add("@" + tableRow.Table.Metadata.IDT, SqlDbType.Int).Value = tableRow.IDT;
        }
    }
}