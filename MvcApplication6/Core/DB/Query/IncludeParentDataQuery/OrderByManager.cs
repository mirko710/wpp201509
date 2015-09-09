using System.Drawing;
using System.Linq;
using System.Text;

namespace WMpp.Core.DB.Query.IncludeParentDataQuery
{
    public class OrderByManager
    {
        private readonly OrderByColumns availableOrderByColumns;

        private OrderByColumn defaultOrderByColumn;

        private readonly IncludeParentDataQueryBase query;
        private readonly OrderByColumns originalOrderBy;
        private readonly OrderByColumns processedOrderBy;
        public OrderByManager(IncludeParentDataQueryBase query, OrderByColumns orderBy)
        {
            this.availableOrderByColumns=new OrderByColumns();
            this.query = query;
            this.originalOrderBy = orderBy;
            this.processedOrderBy = new OrderByColumns();

            this.initialize();
            this.initializeProcessedOrderBy();
        }

        private void initialize()
        {
            this.defaultOrderByColumn = OrderByColumn.Create(query.QueryTable1.Alias, query.QueryTable1.Table.Metadata.Pojam, OrderByDirection.ASC);

            availableOrderByColumns.Add(OrderByColumn.Create(query.QueryTable1.Alias, query.QueryTable1.Table.Metadata.Pojam, OrderByDirection.ASC));
            availableOrderByColumns.Add(OrderByColumn.Create(query.QueryTable1.Alias, query.QueryTable1.Table.Metadata.Pojam, OrderByDirection.DESC));
            availableOrderByColumns.Add(OrderByColumn.Create(query.QueryTable2.Alias, query.QueryTable2.Table.Metadata.Pojam, OrderByDirection.ASC));
            availableOrderByColumns.Add(OrderByColumn.Create(query.QueryTable2.Alias, query.QueryTable2.Table.Metadata.Pojam, OrderByDirection.DESC));
            availableOrderByColumns.Add(OrderByColumn.Create(query.QueryTable3.Alias, query.QueryTable3.Table.Metadata.Pojam, OrderByDirection.ASC));
            availableOrderByColumns.Add(OrderByColumn.Create(query.QueryTable3.Alias, query.QueryTable3.Table.Metadata.Pojam, OrderByDirection.DESC));

            availableOrderByColumns.Add(OrderByColumn.Create(query.QueryTable1.Alias, query.QueryTable1.Table.Metadata.Napomena, OrderByDirection.ASC));
            availableOrderByColumns.Add(OrderByColumn.Create(query.QueryTable1.Alias, query.QueryTable1.Table.Metadata.Napomena, OrderByDirection.DESC));
            availableOrderByColumns.Add(OrderByColumn.Create(query.QueryTable1.Alias, query.QueryTable1.Table.Metadata.Ucestalost, OrderByDirection.ASC));
            availableOrderByColumns.Add(OrderByColumn.Create(query.QueryTable1.Alias, query.QueryTable1.Table.Metadata.Ucestalost, OrderByDirection.DESC));
            availableOrderByColumns.Add(OrderByColumn.Create(query.QueryTable1.Alias, query.QueryTable1.Table.Metadata.Odgovornost, OrderByDirection.ASC));
            availableOrderByColumns.Add(OrderByColumn.Create(query.QueryTable1.Alias, query.QueryTable1.Table.Metadata.Odgovornost, OrderByDirection.DESC));
        }

        private void initializeProcessedOrderBy()
        {
            sanitizeOriginalOrderBy();

            tryAddDefaultOrderBy();
        }

        private void tryAddDefaultOrderBy()
        {
            if (!processedOrderBy.Contains(this.defaultOrderByColumn))
                processedOrderBy.Add(defaultOrderByColumn);
        }

        private void sanitizeOriginalOrderBy()
        {
            foreach (OrderByColumn column in originalOrderBy)
            {
                if (availableOrderByColumns.Contains(column))
                    processedOrderBy.Add(column);
            }
        }

        public string Expression
        {
            get
            {
                StringBuilder sb = new StringBuilder();
                foreach (OrderByColumn column in processedOrderBy)
                {
                    sb.Append(column.GetFullExpression());
                    sb.Append(",");
                }
                string result = sb.ToString();
                if (result.EndsWith(","))
                    result = result.Substring(0, result.Length - 1);

                return result;
            }
        }

        public string ExpressionWithOrderBy
        {
            get { return string.Format("ORDER BY {0}", Expression); }
        }


    }
}