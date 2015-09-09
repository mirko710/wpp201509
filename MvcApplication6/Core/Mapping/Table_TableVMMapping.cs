using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WMpp.Core.DB;
using WMpp.Core.VM;

namespace WMpp.Core.Mapping
{
    public class Table_TableVMMapping
    {
        public static TableVM GetTableVM(Table table)
        {
            return new TableVM(table.Name, table.DisplayName);
        }

        public static IList<TableVM> GetIListTableVM(IList<Table> tables)
        {
            if (tables == null)
                return null;

            IList<TableVM> result = new List<TableVM>();

            tables.ToList().ForEach(o => result.Add(GetTableVM(o)));

            return result;
        }

        public static Table GetTable(TableVM tableVM)
        {
            return new Table(tableVM.Name, tableVM.DisplayName);
        }
    }
}