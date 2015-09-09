using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.UI.WebControls;
using WMpp.Core.VM;

namespace WMpp.Core.DB.Operation
{
    public class GetTreeViewStructureOperation : TableOperationBase
    {
        private int? idt;

        public GetTreeViewStructureOperation(Table table, int? idt) : this(table, null, idt)
        {
        }

        public GetTreeViewStructureOperation(Table table, OperationBase callingOperation, int? idt)
            : base(table, callingOperation)
        {
            this.idt = idt;
        }

        public List<TreeItemVM> Result
        {
            get; private set;
        }
        protected override void execute()
        {
            Result = new List<TreeItemVM>();

            SqlCommand command = getCommand();
            SqlDataReader reader = command.ExecuteReader();

            while (reader.Read())
            {
                TreeItemVM tmp = new TreeItemVM
                {
                    IDT = reader.GetInt32(reader.GetOrdinal(table.Metadata.IDT)),
                    Pojam = reader[table.Metadata.Pojam].ToString(),
                    ImaDjecu = int.Parse(reader[countColumnName].ToString()) > 0
                };

                Result.Add(tmp);
            }

            reader.Close();
        }

        private const string countColumnName = "NumberOfChildren";

        private SqlCommand getCommand()
        {
            SqlCommand command = createCommand();

            string subquery = string.Format("SELECT COUNT(*) FROM dbo.{0} TChildren WHERE dbo.{0}.{1} = TChildren.{2}",
                this.table.Name, table.Metadata.IDT, table.Metadata.NAD_IDT);

            command.CommandText = string.Format("SELECT {0},{1},{2}, ({3}) AS {4} from dbo.{5} WHERE {6} ORDER BY {7}",
                table.Metadata.IDT, table.Metadata.NAD_IDT, table.Metadata.Pojam, subquery, countColumnName, table.Name, whereClause,
                table.Metadata.Pojam);

            return command;
        }

        private string whereClause
        {
            get
            {
                string whereClause = string.Format("{0} IS NULL", table.Metadata.NAD_IDT);

                if (idt.HasValue && idt.Value != -1)
                    whereClause = string.Format("{0} = {1}", table.Metadata.NAD_IDT, idt);
                return whereClause;
            }
        }
    }
}