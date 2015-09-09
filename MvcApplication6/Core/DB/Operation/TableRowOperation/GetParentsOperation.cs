using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WMpp.Core.DB.Operation.TableRowOperation
{
    public class GetParentsOperation : TableRowOperationBase
    {
        public GetParentsOperation(TableRow tableRow) : this(tableRow, null)
        {
        }

        public GetParentsOperation(TableRow tableRow, OperationBase callingOperation) : base(tableRow, callingOperation)
        {
        }

        public IList<TableRow> Result
        {
            get; private set;
        }

        protected override void execute()
        {
            if (!tableRow.Nad_IDT.HasValue)
                return;

            Result = new List<TableRow>();

            TableRow item = tableRow;
            while (true)
            {
                item = item.Table.FindByIDT(item.Nad_IDT.Value);
                Result.Add(item);
                if (!item.Nad_IDT.HasValue)
                    break;
            }
        }
    }
}