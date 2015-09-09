using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace WMpp.Core.DB.Operation
{
    public class DeleteOperation : TableOperationBase
    {
        private int idt;
        public DeleteOperation(Table table, int idt) : this(table, null, idt)
        {
        }

        public DeleteOperation(Table table, OperationBase callingOperation, int idt) : base(table, callingOperation)
        {
            this.idt = idt;
        }

        protected override void execute()
        {
            List<int> items = table.GetChildrenIDsRecursively(idt);
            items.Add(idt);
            this.deleteItems(items);
        }

        private void deleteItems(List<int> items)
        {
            foreach (int currentID in items)
            {
                deleteItem(currentID);
            }
        }

        private void deleteItem(int currentID)
        {
            SqlCommand command = getCommand(currentID);

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
            if (sex.Errors[0].Number != 547)
                throw sex;

            var tableNameWithConflict = getTableNameWithConflict(sex);

            throw new UserException(
                "Brisanje nije moguće jer postoje vezane stavke.\r\nObrišite potrebne stavke iz tablice " +
                tableNameWithConflict);
        }

        private SqlCommand getCommand(int currentID)
        {
            SqlCommand command = createCommand();

            command.CommandText = deleteCommandText;
            command.Parameters.Add(new SqlParameter("@" + this.table.Metadata.IDT, currentID));
            return command;
        }

        private string deleteCommandText
        {
            get { return string.Format("DELETE FROM {0} WHERE {1}=@{1}", this.table.Name, this.table.Metadata.IDT); }
        }

        private string getTableNameWithConflict(SqlException sex)
        {
            Regex regex = new Regex("The conflict occurred in database .+?, table \\\"(dbo.)?(?<TableName>.+?)\\\"");
            Match match = regex.Match(sex.Errors[0].Message);
            return match.Groups["TableName"].Value;
        }
    }
}