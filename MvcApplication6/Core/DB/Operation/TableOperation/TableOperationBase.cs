using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WMpp.Core.DB.Operation
{
    public abstract class TableOperationBase : OperationBase
    {
        protected Table table;

        protected TableOperationBase(Table table, OperationBase callingOperation)
            : base(callingOperation)
        {
            this.table = table;
        }

        protected TableOperationBase(Table table)
        {
            this.table = table;
        }
    }
}