namespace WMpp.Core.VM
{
    public class TableDataVM
    {
        public int PageNumber { get; set; }
        public int MaxPageNumber { get; set; }
        public int FromNumber { get; set; }
        public int ToNumber { get; set; }
        public int TotalNumber { get; set; }
        public TableRowVM[] Items { get; set; }

        public TableDataVM()
        {
            this.Items = new TableRowVM[0];
        }
    }
}