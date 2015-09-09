using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WMpp.Core.DB.Query
{
    public class OrderByColumns : IEnumerable<OrderByColumn>
    {
        private readonly IList<OrderByColumn> columns;

        public OrderByColumns()
        {
            this.columns = new List<OrderByColumn>();
        }

        public void Add(OrderByColumn column)
        {
            columns.Add(column);
        }

        public bool Contains(OrderByColumn column)
        {
            return columns.Contains(column);
        }

        public IEnumerator<OrderByColumn> GetEnumerator()
        {
            return columns.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return columns.GetEnumerator();
        }
    }
}