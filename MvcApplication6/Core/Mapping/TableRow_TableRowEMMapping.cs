using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WMpp.Core.DB;
using WMpp.Core.VM;
using WebGrease.Css.Extensions;

namespace WMpp.Core.Mapping
{
    public class TableRow_TableRowEMMapping
    {
        public static TableRow GetTableRow(TableRowEM dataItemVm)
        {
            if (dataItemVm == null)
                return null;

            return new TableRow(
                TableManager.Singleton[dataItemVm.Tablica],
                dataItemVm.IDT, dataItemVm.Preporuceni_IDT, dataItemVm.Nad_IDT, dataItemVm.Pojam,
                dataItemVm.Napomena, dataItemVm.Ucestalost, dataItemVm.Biljeske, dataItemVm.Reference, dataItemVm.Odgovornost
                );
        }

        public static TableRowEM GetTableRowEM(TableRow tableRow)
        {
            if (tableRow == null)
                return null;
            return new TableRowEM(
                tableRow.Table.Name,
                tableRow.IDT, tableRow.Preporuceni_IDT, tableRow.Nad_IDT, tableRow.Pojam,
                tableRow.Napomena, tableRow.Ucestalost, tableRow.Biljeske, tableRow.Reference, tableRow.Odgovornost
                );
        }

        public static List<TableRowEM> GetListDataItemVM(IList<TableRow> tableRows)
        {
            if (tableRows == null)
                return null;

            List<TableRowEM> result = new List<TableRowEM>();

            tableRows.ForEach(o=>result.Add(GetTableRowEM(o)));

            return result;
        }
    }
}