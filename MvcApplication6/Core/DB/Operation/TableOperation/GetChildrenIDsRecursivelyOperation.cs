using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WMpp.Core.DB.Operation
{
    public class GetChildrenIDsRecursivelyOperation : TableOperationBase
    {
        private int idt;
        public GetChildrenIDsRecursivelyOperation(Table table, int idt) : this(table, null, idt)
        {
        }

        public GetChildrenIDsRecursivelyOperation(Table table, OperationBase callingOperation, int idt) : base(table, callingOperation)
        {
            this.idt = idt;
        }

        public List<int> Result
        {
            get; private set;
        }
        protected override void execute()
        {
            Stack<int> result = new Stack<int>();
            Stack<int> dynamicItems = new Stack<int>();
            dynamicItems.Push(idt);

            while (dynamicItems.Count > 0)
            {
                loadChildrenForNext(dynamicItems, result);
            }
            this.Result = result.ToList();
        }

        private void loadChildrenForNext(Stack<int> dynamicItems, Stack<int> items)
        {
            int currentIDT = dynamicItems.Pop();

            SqlCommand command = createCommand();
            prepareCommand(command, currentIDT);

            SqlDataReader reader = command.ExecuteReader();

            while (reader.Read())
            {
                int id = reader.GetInt32(0);
                dynamicItems.Push(id);
                items.Push(id);
            }

            reader.Close();
        }

        private void prepareCommand(SqlCommand command, int currentIDT)
        {
            command.CommandText = selectCommandText;
            command.Parameters.Add("@" + table.Metadata.IDT, SqlDbType.Int).Value = currentIDT;
        }

        private string selectCommandText
        {
            get
            {
                return string.Format("SELECT {0} FROM {1} WHERE {2} = @{0}", table.Metadata.IDT, table.Name,
                    table.Metadata.NAD_IDT);
            }
        }
    }
}