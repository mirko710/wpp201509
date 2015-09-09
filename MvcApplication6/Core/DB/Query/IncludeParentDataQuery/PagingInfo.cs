using System;

namespace WMpp.Core.DB.Query.IncludeParentDataQuery
{
    public class PagingInfo
    {
        public int PageNumber { get; set; }
        public int ItemsPerPage { get; set; }

        public int FirstIndex
        {
            get
            {
                return (PageNumber - 1) * ItemsPerPage;
            }
        }

        public int LastIndex
        {
            get { return PageNumber * ItemsPerPage; }
        }

        public int GetMaxPageNumber(int numberOfRows)
        {
            return (int) Math.Ceiling((double)numberOfRows / ItemsPerPage);
        }
    }
}