using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace WMpp.Core.DB.Operation
{
    public class ChangeIDTOperation : TableRowOperationBase
    {
        private int newIDT;
        public ChangeIDTOperation(TableRow tableRow, int newIDT) : this(tableRow, null, newIDT)
        {
        }

        public ChangeIDTOperation(TableRow tableRow, OperationBase callingOperation, int newIDT) : base(tableRow, callingOperation)
        {
            this.newIDT = newIDT;
        }


        protected override void execute()
        {
            SqlCommand command = createCommand();

            string newIDTParameterName = "New" + tableRow.Table.Metadata.IDT;


            command.CommandText = string.Format("UPDATE {0} SET IDT=@{1} WHERE {2}=@{2}",
                tableRow.Table.Name, newIDTParameterName,
                tableRow.Table.Metadata.IDT);
            command.Parameters.Add(new SqlParameter("@" + newIDTParameterName, this.newIDT));
            command.Parameters.Add(new SqlParameter("@" + tableRow.Table.Metadata.IDT, tableRow.IDT));
            command.ExecuteNonQuery();
        }
    }
}