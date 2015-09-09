using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WMpp.Core.DB.Query.IncludeParentDataQuery
{
    public class UpdatePagingInfoForItem : IncludeParentDataQueryBase
    {
        private int idt;
        public UpdatePagingInfoForItem(QueryTable queryTable1, QueryTable queryTable2, QueryTable queryTable3, PagingInfo pagingInfo, int idt) : base(queryTable1, queryTable2, queryTable3, pagingInfo)
        {
            this.idt = idt;
        }

        private const string numberColumnName = "Number";

        protected override string getSelectClause()
        {
            return string.Format("ROW_NUMBER() OVER ({0}) AS {1}, {2}.{3}", this.orderByManager.ExpressionWithOrderBy,
                numberColumnName,
                this.QueryTable1.Alias, this.QueryTable1.Table.Metadata.IDT);
        }

        protected override void readData(SqlDataReader reader)
        {
            int currentIndex = -1;

            while (reader.Read())
            {
                currentIndex++;

                if (getCurrentIDT(reader) == this.idt)
                {
                    PagingInfo.PageNumber = getPageNumber(currentIndex);
                    return;
                }

            }

            PagingInfo.PageNumber = -1;
        }

        private int getPageNumber(int currentIndex)
        {
            return (int)((double)currentIndex) / PagingInfo.ItemsPerPage + 1;
        }

        private int getCurrentIDT(SqlDataReader reader)
        {
            return reader.GetInt32(reader.GetOrdinal(this.QueryTable1.Table.Metadata.IDT));
        }
    }
}