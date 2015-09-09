using System.Text;

namespace WMpp.Core.DB.Query.IncludeParentDataQuery
{
    public class SpecificColumnsSearchFilter : IFilter
    {
        private const string collation = "COLLATE Latin1_General_CI_AI";
        private IncludeParentDataQueryBase query;
        private readonly TableFilter tableFilter;

        public SpecificColumnsSearchFilter(IncludeParentDataQueryBase query, TableFilter tableFilter)
        {
            this.query = query;
            this.tableFilter = tableFilter;
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
            string concatenationOperator="AND";

            tryAddToFinalExpression(expression, SearchExpressionBuilder.GetForString(query.QueryTable1.Alias, query.QueryTable1.Table.Metadata.Pojam, tableFilter.Pojam), null);
            tryAddToFinalExpression(expression, SearchExpressionBuilder.GetForString(query.QueryTable2.Alias, query.QueryTable1.Table.Metadata.Pojam, tableFilter.NadPojam), concatenationOperator);
            tryAddToFinalExpression(expression, SearchExpressionBuilder.GetForString(query.QueryTable3.Alias, query.QueryTable1.Table.Metadata.Pojam, tableFilter.PreporuceniPojam), concatenationOperator);
            tryAddToFinalExpression(expression, SearchExpressionBuilder.GetForString(query.QueryTable1.Alias, query.QueryTable1.Table.Metadata.Napomena, tableFilter.Napomena), concatenationOperator);
            tryAddToFinalExpression(expression, SearchExpressionBuilder.GetForString(query.QueryTable1.Alias, query.QueryTable1.Table.Metadata.Odgovornost, tableFilter.Odgovornost), concatenationOperator);

            if (tableFilter.Ucestalost.HasValue)
            {
                if (expression.Length > 0)
                    expression.AppendFormat(" {0} ", concatenationOperator);
                tryAddToFinalExpression(expression,
                    SearchExpressionBuilder.GetForInt(query.QueryTable1.Alias,
                        query.QueryTable1.Table.Metadata.Ucestalost, tableFilter.Ucestalost.Value.ToString()), null);
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
            get { return tableFilter != null; }
        }

        public string ExpressionWithWhere
        {
            get { return string.Format("WHERE {0}", Expression); }
        }
    }
}