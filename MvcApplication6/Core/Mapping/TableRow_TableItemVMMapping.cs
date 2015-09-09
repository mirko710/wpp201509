using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WMpp.Core.DB;
using WMpp.Core.VM;
using WebGrease.Css.Extensions;

namespace WMpp.Core.Mapping
{
    public class TableRow_TableItemVMMapping
    {
        public static TableRowVM GetTableItemVM(TableRow tableRow)
        {
            if (tableRow == null)
                return null;
            return new TableRowVM(
                tableRow.IDT.Value, tableRow.Pojam, tableRow.Nad_IDT, tableRow.Ucestalost, tableRow.Napomena, tableRow.Odgovornost
                );
        }
    }
}