using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using WMpp.Core.Mapping;
using WMpp.Core.VM;

namespace WMpp.Core.DB.Query.IncludeParentDataQuery
{
    public class GetDataQuery : IncludeParentDataQueryBase
    {
        private int idt;

        int firstIndex;
        int lastIndex;

        public GetDataQuery(QueryTable queryTable1, QueryTable queryTable2, QueryTable queryTable3, PagingInfo pagingInfo, int idt) : base(queryTable1, queryTable2, queryTable3, pagingInfo)
        {
            this.idt = idt;
            firstIndex = pagingInfo.FirstIndex;
            lastIndex = pagingInfo.LastIndex;
        }

        private const string parentColumnName = "ParentName";
        private const string recommendedColumnName = "RecommendedName";

        protected override string getSelectClause()
        {
            return string.Format("{0}, {1}.{2} AS {3}, {4}.{5} AS {6}", 
                QueryTable1.Table.Metadata.GetSelectColumns(QueryTable1.Alias), 
                QueryTable2.Alias, QueryTable2.Table.Metadata.Pojam, parentColumnName,
                QueryTable3.Alias, QueryTable3.Table.Metadata.Pojam, recommendedColumnName);
        }

        public TableDataVM Result { get; private set; }

        

        protected override void readData(SqlDataReader reader)
        {
            Result = new TableDataVM();
            IList<TableRowVM> items = new List<TableRowVM>();

            int currentIndex = 0;
            int totalNumberOfRows = 0;

            

            while (reader.Read())
            {
                totalNumberOfRows++;
                if (shouldSkipRow(currentIndex))
                {
                    currentIndex++;
                    continue;
                }

                var item = getTableItemVM(reader);

                items.Add(item);
                currentIndex++;
            }

            correctLastIndexWith(currentIndex);
            correctPagingInfoWith(totalNumberOfRows);

            initializeResult(totalNumberOfRows, items);
        }

        private TableRowVM getTableItemVM(SqlDataReader reader)
        {
            TableRowReader tableRowReader = new TableRowReader(QueryTable1.Table, reader);
            TableRow tableRow = tableRowReader.GetRow();
            TableRowVM item = TableRow_TableItemVMMapping.GetTableItemVM(tableRow);

            if (tableRow.Nad_IDT.HasValue)
                item.NadPojam = reader[parentColumnName].ToString();
            if (tableRow.Preporuceni_IDT.HasValue)
                item.PreporuceniPojam = reader[recommendedColumnName].ToString();
            return item;
        }

        private void initializeResult(int totalNumberOfRows, IList<TableRowVM> items)
        {
            Result = new TableDataVM()
            {
                PageNumber = PagingInfo.PageNumber,
                MaxPageNumber = PagingInfo.GetMaxPageNumber(totalNumberOfRows),
                Items = items.ToArray(),
                FromNumber = firstIndex + 1,
                ToNumber = lastIndex,
                TotalNumber = totalNumberOfRows
            };
        }

        private void correctPagingInfoWith(int totalNumberOfRows)
        {
            if (PagingInfo.PageNumber > PagingInfo.GetMaxPageNumber(totalNumberOfRows))
                PagingInfo.PageNumber = PagingInfo.GetMaxPageNumber(totalNumberOfRows);
        }

        private void correctLastIndexWith(int currentIndex)
        {
            if (currentIndex < lastIndex)
                lastIndex = currentIndex;
        }

        private bool shouldSkipRow(int currentIndex)
        {
            return currentIndex < firstIndex || currentIndex >= lastIndex;
        }
    }
}