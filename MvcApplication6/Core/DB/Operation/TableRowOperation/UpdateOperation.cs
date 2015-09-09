using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WMpp.Core.DB.Operation
{
    public class UpdateOperation : TableRowOperationBase
    {
        public UpdateOperation(TableRow tableRow) : base(tableRow)
        {
        }

        public UpdateOperation(TableRow tableRow, OperationBase callingOperation) : base(tableRow, callingOperation)
        {
        }

        protected override void execute()
        {
            SqlCommand command = getCommand();
            try
            {
                command.ExecuteNonQuery();
            }
            catch (SqlException sex)
            {
                sanitizeAndRethrow(sex);
            }
        }

        private void sanitizeAndRethrow(SqlException sex)
        {
            if (sex.Errors[0].Number != 2601)
                throw sex;

            throw new UserException(string.Format("Pojam \"{0}\" već postoji u tablici {1}", tableRow.Pojam,
                tableRow.Table.Name));
        }

        private SqlCommand getCommand()
        {
            SqlCommand result = createCommand();

            result.CommandText = updateCommandText;

            TableRow_SqlCommandMapping.Map(tableRow, result);

            return result;
        }



        private string updateCommandText
        {
            get
            {
                return string.Format(@"UPDATE {0}
    SET {1}=@{1}, {2}=@{2}, {3}=@{3}, {4}=@{4}, {5}=@{5}, {6}=@{6}, {7}=@{7}, {8}=@{8}
    WHERE {9}=@{9}", tableRow.Table.Name,
                    tableRow.Table.Metadata.NAD_IDT, tableRow.Table.Metadata.Preporuceni_IDT, tableRow.Table.Metadata.Pojam,
                    tableRow.Table.Metadata.Napomena, tableRow.Table.Metadata.Ucestalost, tableRow.Table.Metadata.Biljeske, tableRow.Table.Metadata.Odgovornost, tableRow.Table.Metadata.Reference,
                    tableRow.Table.Metadata.IDT);
            }
        }
    }
}