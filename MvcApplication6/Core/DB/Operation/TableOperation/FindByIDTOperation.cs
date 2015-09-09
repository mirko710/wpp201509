using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using WMpp.Core.VM;

namespace WMpp.Core.DB.Operation
{
    public class FindByIDTOperation : TableOperationBase
    {
        private int idt;
        public FindByIDTOperation(Table table, int idt) : this(table, null, idt)
        {
        }

        public FindByIDTOperation(Table table, OperationBase callingOperation, int idt) : base(table, callingOperation)
        {
            this.idt = idt;
        }

        public TableRow Result { get; private set; }
        protected override void execute()
        {
            SqlCommand command = getCommand();

            SqlDataReader dr = command.ExecuteReader();
            
            Result = new TableRowReader(table, dr).ReadRow();

            dr.Close();
        }

        private SqlCommand getCommand()
        {
            SqlCommand result = createCommand();
            result.CommandText = selectCommandText;

            result.Parameters.Add(new SqlParameter("@" + table.Metadata.IDT, idt));

            return result;
        }

        private string selectCommandText
        {
            get
            {
                return string.Format("{0} WHERE {1}=@{1}", table.Metadata.GetSelectStatement(), table.Metadata.IDT);
            }
        }
    }
}