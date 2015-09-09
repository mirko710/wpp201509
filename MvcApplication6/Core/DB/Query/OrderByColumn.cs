using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Permissions;
using System.Web;

namespace WMpp.Core.DB.Query
{
    public class OrderByColumn : IEquatable<OrderByColumn>
    {
        public bool Equals(OrderByColumn other)
        {
            return this.getExpressionWithDirection() == other.getExpressionWithDirection();
        }

        public string ColumnName { get; private set; }
        public OrderByDirection Direction { get; private set; }
        public string Alias { get; private set; }
        public OrderByColumn(string alias, string columnName, OrderByDirection direction)
        {
            Alias = alias;
            ColumnName = columnName;
            Direction = direction;
        }

        private string getExpressionWithDirection()
        {
            if (this.Alias == null)
                return this.ColumnName;
            return string.Format("{0}.{1}", this.Alias, this.ColumnName);
        }

        public string GetExpression()
        {
            return string.Format("{0} {1}", ColumnName, Direction);
        }
        public string GetFullExpression()
        {
            if (Alias == null)
                return GetExpression();
            return string.Format("{0}.{1}", Alias, GetExpression());
        }

        public static OrderByColumn Create(string alias, string columnName, OrderByDirection direction)
        {
            return new OrderByColumn(alias, columnName, direction);
        }
    }
}