using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WMpp.Core.DB.Operation
{
    public abstract class TableRowOperationBase : OperationBase
    {
        protected TableRow tableRow;

        protected TableRowOperationBase(TableRow tableRow)
        {
            this.tableRow = tableRow;
        }

        protected TableRowOperationBase(TableRow tableRow, OperationBase callingOperation) : base (callingOperation)
        {
            this.tableRow = tableRow;
        }
    }
}