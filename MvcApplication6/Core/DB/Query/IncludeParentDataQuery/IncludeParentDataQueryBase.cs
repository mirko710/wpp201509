using System;
using System.Data.SqlClient;
using System.Drawing;
using WMpp.Core.DB.Operation;

namespace WMpp.Core.DB.Query.IncludeParentDataQuery
{
    public abstract class IncludeParentDataQueryBase : OperationBase
    {
        protected IncludeParentDataQueryBase()
        {
        }

        protected IncludeParentDataQueryBase(OperationBase callingOperation) : base(callingOperation)
        {
        }

        public QueryTable QueryTable1 { get; private set; }
        public QueryTable QueryTable2 { get; private set; }

        public QueryTable QueryTable3 { get; private set; }

        protected IFilter filter;
        protected OrderByManager orderByManager;
        public PagingInfo PagingInfo { get; private set; }

        protected IncludeParentDataQueryBase(QueryTable queryTable1, QueryTable queryTable2, QueryTable queryTable3, PagingInfo pagingInfo)
        {
            this.QueryTable1 = queryTable1;
            this.QueryTable2 = queryTable2;
            this.QueryTable3 = queryTable3;
            this.PagingInfo = pagingInfo;
        }

        public void InitializeFilter(IFilter filter)
        {
            this.filter = filter;
        }

        public void InitializeOrderBy(OrderByColumns columns)
        {
            this.orderByManager = new OrderByManager(this, columns);
        }

        protected abstract string getSelectClause();
        protected abstract void readData(SqlDataReader reader);

        protected override void execute()
        {
            SqlCommand command = createCommand();

            prepareCommand(command);

            SqlDataReader reader = command.ExecuteReader();

            try
            {
                readData(reader);
            }
            finally
            {
                if (!reader.IsClosed)
                    reader.Close();
            }
        }

        private void prepareCommand(SqlCommand command)
        {
            string select = string.Format("SELECT {0}", getSelectClause());

            string fromParent = string.Format("{0} as {1} Left join {2} as {3} on ({1}.{4}={3}.{5})",
                this.QueryTable1.Table.Name, this.QueryTable1.Alias,
                this.QueryTable2.Table.Name, this.QueryTable2.Alias,
                this.QueryTable1.Table.Metadata.NAD_IDT, this.QueryTable2.Table.Metadata.IDT);

            string fromRecommended = string.Format("Left join {0} as {1} on ({1}.{2}={3}.{4})",
                this.QueryTable3.Table.Name, this.QueryTable3.Alias,
                this.QueryTable3.Table.Metadata.IDT, this.QueryTable1.Alias, 
                this.QueryTable1.Table.Metadata.Preporuceni_IDT);

            string from = string.Format("FROM {0} {1}", fromParent, fromRecommended);
            string where = "";
            if (filter != null && filter.HasFilter)
                @where = filter.ExpressionWithWhere;

            string orderBy = "";
            if (orderByManager != null)
                orderBy = orderByManager.ExpressionWithOrderBy;

            string commandText = string.Format("{0} {1} {2} {3}", @select, @from, @where, orderBy);

            command.CommandText = commandText;
        }
    }
}