using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WMpp.Core.DB.Operation
{
    public class CheckCircularReferenceOperation : TableRowOperationBase
    {
        public CheckCircularReferenceOperation(TableRow tableRow) : this(tableRow, null)
        {
        }

        public CheckCircularReferenceOperation(TableRow tableRow, OperationBase callingOperation) : base(tableRow, callingOperation)
        {
        }

        public bool Result
        {
            get; private set;
        }
        protected override void execute()
        {
            if (!tableRow.Nad_IDT.HasValue)
            {
                Result = false;
                return;
            }
            if (tableRow.IDT == tableRow.Nad_IDT)
            {
                Result = true;
                return;
            }

            int nad_IDT = tableRow.Nad_IDT.Value;
            while (true)
            {
                SqlCommand command = getParentIDTCommand(nad_IDT);
                object commandResult = command.ExecuteScalar();
                if (commandResult == null)
                {
                    Result = false;
                    return;
                }

                nad_IDT = (int)commandResult;

                if (isRoot(nad_IDT))
                {
                    Result = false;
                    return;
                }

                if (nad_IDT == tableRow.IDT)
                {
                    Result = true;
                    return;
                }
            }
        }

        private bool isRoot(int nad_IDT)
        {
            return nad_IDT == parentNotExistsIDT;
        }

        private SqlCommand getParentIDTCommand(int nad_IDT)
        {
            SqlCommand result = createCommand();

            result.CommandText = getParentIDTCommandText;

            if (tableRow.Nad_IDT == null)
                result.Parameters.Add("@" + tableRow.Table.Metadata.IDT, SqlDbType.Int).Value = DBNull.Value;
            else
                result.Parameters.Add("@" + tableRow.Table.Metadata.IDT, SqlDbType.Int).Value = nad_IDT;

            return result;
        }

        private readonly int parentNotExistsIDT = -1;

        private string getParentIDTCommandText
        {
            get
            {
                return string.Format("SELECT ISNULL({0}, {1}) FROM {2} WHERE {3}=@{3}",
                    tableRow.Table.Metadata.NAD_IDT, parentNotExistsIDT, tableRow.Table.Name, tableRow.Table.Metadata.IDT);
            }
        }
    }
}