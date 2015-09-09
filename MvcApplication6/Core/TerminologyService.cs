using System;
using System.Collections.Generic;
using Microsoft.Ajax.Utilities;
using WMpp.Core.DB;
using WMpp.Core.DB.Operation;
using WMpp.Core.DB.Query;
using WMpp.Core.DB.Query.IncludeParentDataQuery;
using WMpp.Core.Mapping;
using WMpp.Core.VM;

namespace WMpp.Core
{

    public class TerminologyService
    {
        private readonly Table table;
        public TerminologyService(Table table)
        {
            this.table = table;

        }

        public Table Table
        {
            get { return table; }
        }

        #region Select

        public int getPageNumber(string orderBy, string filterBy, int id, int itemsPerPage)
        {
            PagingInfo pagingInfo = new PagingInfo() {ItemsPerPage = itemsPerPage};

            IncludeParentDataQueryBase query = new UpdatePagingInfoForItem(new QueryTable(table, "T"), new QueryTable(table, "TParent"), new QueryTable(table, "TRecommended"), pagingInfo, id);
            initializeIncludeParentDataQuery(orderBy, filterBy, query);

            return pagingInfo.PageNumber;
        }

        public TableDataVM getDataTable(string orderBy, string filterBy, PagingInfo pagingInfo, int id)
        {
            if (pagingInfo.PageNumber <= 0 && id < 0)
                throw new Exception("Page number has invalid value");

            GetDataQuery query = new GetDataQuery(new QueryTable(table, "T"), new QueryTable(table, "TParent"), new QueryTable(table, "TRecommended"), pagingInfo, id);
            initializeIncludeParentDataQuery(orderBy, filterBy, query);

            return query.Result;
        }

        private void initializeIncludeParentDataQuery(string orderBy, string filterBy, IncludeParentDataQueryBase query)
        {
            IFilter filter = getIncludeParentDataQueryFilter(filterBy, query);

            query.InitializeFilter(filter);
            query.InitializeOrderBy(OrderByColumnsBuilder.BuildFromString(orderBy));
            query.Execute();
        }

        private static IFilter getIncludeParentDataQueryFilter(string filterBy, IncludeParentDataQueryBase query)
        {
            TableFilterVM tableFilterVM = new TableFilterVM(filterBy);

            TableFilter tableFilter = TableFilter_TableFilterVMMapping.GetTableFilter(tableFilterVM);

            IFilter filter = new SpecificColumnsSearchFilter(query, tableFilter);
            return filter;
        }

        public TableRowEM Select(int IDT)
        {
            TableRow tableRow = table.FindByIDT(IDT);

            TableRowEM result = TableRow_TableRowEMMapping.GetTableRowEM(tableRow);
            result.NadredeniPojmovi = TableRow_TableRowEMMapping.GetListDataItemVM(tableRow.GetParents());
            result.PreporuceniPojam = TableRow_TableRowEMMapping.GetTableRowEM(tableRow.GetRecommendedTerms()) ?? new TableRowEM();

            return result;
        }

        public List<string> GetTermsForWhichTheTermIsRecommended(int IDT)
        {
            List<string> result = new List<string>();

            TableRow tableRow = table.FindByIDT(IDT);

            IList<TableRow> tableRows = tableRow.GetTermsForWhichTheTermIsRecommended();

            tableRows.ForEach(o => result.Add(o.Pojam));

            return result;
        }

        public List<TreeItemVM> TreeViewStructure(int? idt = null)
        {
            GetTreeViewStructureOperation operation =
                new GetTreeViewStructureOperation(table, idt);
            operation.Execute();

            return operation.Result;
        }

        #endregion

        #region Insert, Update & Delete
        public void Insert(TableRowEM dataItem)
        {
            TableRow tableRow = TableRow_TableRowEMMapping.GetTableRow(dataItem);

            tableRow.Insert();

            dataItem.IDT = tableRow.IDT;
        }

        public void Update(TableRowEM dataItem)
        {
            TableRow tableRow = TableRow_TableRowEMMapping.GetTableRow(dataItem);

            if (tableRow.ContainsCircularReference())
                throw new UserException("Promjena nadređenog pojma kreirala bi cirkularnu referencu.");

            tableRow.Update();
        }

        public void Delete(int IDT)
        {
            this.table.Delete(IDT);
        }
        #endregion
    }
}