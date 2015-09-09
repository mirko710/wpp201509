using System.Text;

namespace WMpp.Core.DB.Query.IncludeParentDataQuery
{
    public class AllColumnsSearchFilter : IFilter
    {
        private IncludeParentDataQueryBase query;
        private readonly string searchExpression;
        
        public AllColumnsSearchFilter(IncludeParentDataQueryBase query, string searchExpression)
        {
            this.query = query;
            this.searchExpression = searchExpression;
        }

        public string Expression
        {
            get
            {
                return getExpression();
            }
        }

        private string getExpression()
        {
            StringBuilder expression = new StringBuilder();
            string concatenationOperator = "OR";

            tryAddToFinalExpression(expression, SearchExpressionBuilder.GetForString(query.QueryTable1.Alias, query.QueryTable1.Table.Metadata.Pojam, searchExpression), null);
            tryAddToFinalExpression(expression, SearchExpressionBuilder.GetForString(query.QueryTable2.Alias, query.QueryTable1.Table.Metadata.Pojam, searchExpression), concatenationOperator);
            tryAddToFinalExpression(expression, SearchExpressionBuilder.GetForString(query.QueryTable3.Alias, query.QueryTable1.Table.Metadata.Pojam, searchExpression), concatenationOperator);
            tryAddToFinalExpression(expression, SearchExpressionBuilder.GetForString(query.QueryTable1.Alias, query.QueryTable1.Table.Metadata.Napomena, searchExpression), concatenationOperator);
            tryAddToFinalExpression(expression, SearchExpressionBuilder.GetForString(query.QueryTable1.Alias, query.QueryTable1.Table.Metadata.Odgovornost, searchExpression), concatenationOperator);

            string ucestalostExpression = SearchExpressionBuilder.GetForInt(query.QueryTable1.Alias,
                query.QueryTable1.Table.Metadata.Ucestalost, searchExpression);

            if (ucestalostExpression != null)
            {
                if (expression.Length > 0)
                expression.AppendFormat(" {0} ", concatenationOperator);
                tryAddToFinalExpression(expression, ucestalostExpression, null);
            }

            return expression.ToString();
        }

        private void tryAddToFinalExpression(StringBuilder finalExpression, string columnExpression, string concatenationOperator)
        {
            if (columnExpression == null)
                return;

            if (concatenationOperator != null && finalExpression.Length > 0)
            {
                finalExpression.Append(" ");
                finalExpression.Append(concatenationOperator);
                finalExpression.Append(" ");
            }

            finalExpression.Append(columnExpression);
        }

        public bool HasFilter
        {
            get { return searchExpression != null; }
        }

        public string ExpressionWithWhere
        {
            get { return string.Format("WHERE {0}", Expression); }
        }
    }
}