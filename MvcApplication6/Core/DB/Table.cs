using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text.RegularExpressions;
using WMpp.Core.DB.Operation;

namespace WMpp.Core.DB
{
    public class Table
    {
        public string Name { get; }
        public string DisplayName { get; }

        public TableMetadata Metadata { get; }

        public Table(string name, string displayName)
        {
            Name = name;
            DisplayName = displayName;
            this.Metadata = new TableMetadata(name);
        }

        public override int GetHashCode()
        {
            return this.Name.GetHashCode();
        }

        public List<int> GetChildrenIDsRecursively(int TargetIDT)
        {
            GetChildrenIDsRecursivelyOperation operation = new GetChildrenIDsRecursivelyOperation(this, TargetIDT);
            operation.Execute();
            return operation.Result;
        }

        public void Delete(int IDT)
        {
            new DeleteOperation(this, IDT).Execute();
        }

        public TableRow FindByIDT(int IDT)
        {
            FindByIDTOperation operation = new FindByIDTOperation(this, IDT);
            operation.Execute();
            return operation.Result;
        }

    }
}