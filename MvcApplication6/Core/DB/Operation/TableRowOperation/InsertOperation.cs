using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WMpp.Core.DB.Operation
{
    public class InsertOperation : TableRowOperationBase
    {
        public InsertOperation(TableRow tableRow) : base(tableRow)
        {
        }

        protected override void execute()
        {
            tableRow.IDT = vratiPrivremeniIDT();

            SqlCommand command = getInsertCommand();

            try
            {
                command.ExecuteNonQuery();
            }
            catch (SqlException sex)
            {
                sanitizeAndRethrow(sex);
            }

            FindByIDTOperation findByIDTOperation = new FindByIDTOperation(tableRow.Table, this, tableRow.IDT.Value);
            findByIDTOperation.Execute();

            TableRow tableRowFromDB = findByIDTOperation.Result;

            new ChangeIDTOperation(tableRowFromDB, this, tableRowFromDB.AutoBroj).Execute();
            tableRowFromDB.IDT = tableRowFromDB.AutoBroj;

            tableRow.IDT = tableRowFromDB.IDT;
            tableRow.AutoBroj = tableRowFromDB.AutoBroj;
        }

        private void sanitizeAndRethrow(SqlException sex)
        {
            if (sex.Errors[0].Number == 2601)
                throw new UserException(string.Format("Pojam \"{0}\" već postoji u tablici {1}", tableRow.Pojam,
                    tableRow.Table.Name));
            throw sex;
        }

        private SqlCommand getInsertCommand()
        {
            SqlCommand result = createCommand();

            result.CommandText = insertCommandText;

            TableRow_SqlCommandMapping.Map(tableRow, result);

            return result;
        }

        private string insertCommandText
        {
            get
            {
                TableMetadata metadata = tableRow.Table.Metadata;

                return string.Format(@"INSERT INTO {0} 
    ({1}, {2}, {3}, {4}, {5}, {6}, {7}, {8}, {9})
    VALUES
    (@{1}, @{2}, @{3}, @{4}, @{5}, @{6}, @{7}, @{8}, @{9})", tableRow.Table.Name,
                    metadata.IDT, metadata.NAD_IDT, metadata.Preporuceni_IDT, metadata.Pojam, metadata.Napomena,
                    metadata.Ucestalost, metadata.Biljeske, metadata.Odgovornost, metadata.Reference
                    );
            }
        }

        Random random = new Random();
        private int vratiPrivremeniIDT()
        {
            return -this.random.Next() / 2;
        }
    }
}