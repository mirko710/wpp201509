using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace WMpp.Core.DB.Query
{
    public class OrderByColumnsBuilder
    {
        private const string columnWithAliasPattern = "((?<alias>.+)\\.(?<column>.+) (?<direction>(ASC|DESC)))";
        private const string columnWithoutAliasPattern = "((?<column>.+) (?<direction>(ASC|DESC)))";
        private const string expressionPattern = "(?<expression>[^,]+)";
        public static OrderByColumns BuildFromString(string orderByClause)
        {
            OrderByColumns result = new OrderByColumns();

            Regex regexExpression = new Regex(expressionPattern);
            Regex regexWithAlias = new Regex(columnWithAliasPattern);
            Regex regexWithoutAlias = new Regex(columnWithoutAliasPattern);

            foreach (Match match in regexExpression.Matches(orderByClause))
            {
                string expression = match.Groups["expression"].Value;
                Match columnMatch1 = regexWithAlias.Match(expression);
                if (columnMatch1.Success)
                {
                    addToResultWithAlias(columnMatch1, result);
                    continue;
                }
                Match columnMatch2 = regexWithoutAlias.Match(expression);
                if (columnMatch2.Success)
                {
                    addToResult(columnMatch2, result);
                    continue;
                }
            }

            return result;
        }

        private static void addToResult(Match columnMatch2, OrderByColumns result)
        {
            string column = columnMatch2.Groups["column"].Value;
            string direction = columnMatch2.Groups["direction"].Value;

            try
            {
                result.Add(OrderByColumn.Create(null, column,
                    (OrderByDirection) Enum.Parse(typeof (OrderByDirection), direction)));
            }
            catch (Exception)
            {
            }
        }

        private static void addToResultWithAlias(Match columnMatch1, OrderByColumns result)
        {
            string alias = columnMatch1.Groups["alias"].Value;
            string column = columnMatch1.Groups["column"].Value;
            string direction = columnMatch1.Groups["direction"].Value;

            try
            {
                result.Add(OrderByColumn.Create(alias, column,
                    (OrderByDirection) Enum.Parse(typeof (OrderByDirection), direction)));
            }
            catch (Exception)
            {
            }
        }
    }
}