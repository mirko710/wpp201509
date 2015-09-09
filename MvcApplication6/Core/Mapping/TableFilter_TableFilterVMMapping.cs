using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WMpp.Core.DB;
using WMpp.Core.VM;

namespace WMpp.Core.Mapping
{
    public class TableFilter_TableFilterVMMapping
    {
        public static TableFilter GetTableFilter(TableFilterVM tableFilterVM)
        {
            if (tableFilterVM == null || !tableFilterVM.HasData)
                return null;
            int? ucestalost=null;
            int tempucestalost;
            if (int.TryParse(tableFilterVM.Ucestalost, out tempucestalost))
                ucestalost = tempucestalost;

            TableFilter result = new TableFilter(tableFilterVM.Pojam, tableFilterVM.PreporuceniPojam,
                tableFilterVM.NadPojam, tableFilterVM.Napomena, ucestalost, tableFilterVM.Odgovornost);

            return result;
        }
    }
}