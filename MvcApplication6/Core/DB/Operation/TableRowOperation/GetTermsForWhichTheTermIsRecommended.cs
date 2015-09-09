using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WMpp.Core.DB.Operation.TableRowOperation
{
    public class GetTermsForWhichTheTermIsRecommended : TableRowOperationBase
    {
        public GetTermsForWhichTheTermIsRecommended(TableRow tableRow) : base(tableRow)
        {
        }

        public GetTermsForWhichTheTermIsRecommended(TableRow tableRow, OperationBase callingOperation) : base(tableRow, callingOperation)
        {
        }

        public IList<TableRow> Result { get; private set; }
        protected override void execute()
        {
            var command = getCommand();

            SqlDataReader reader = command.ExecuteReader();

            Result = new TableRowReader(tableRow.Table, reader).ReadAll();
        }

        private SqlCommand getCommand()
        {
            SqlCommand command = createCommand();

            command.CommandText = string.Format("{0} WHERE {1}=@{2}",
                tableRow.Table.Metadata.GetSelectStatement(), tableRow.Table.Metadata.Preporuceni_IDT,
                tableRow.Table.Metadata.IDT);

            command.Parameters.Add("@" + tableRow.Table.Metadata.IDT, SqlDbType.Int).Value = tableRow.IDT;
            return command;
        }
    }
}