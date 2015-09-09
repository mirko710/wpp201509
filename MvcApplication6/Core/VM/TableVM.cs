namespace WMpp.Core.VM
{
    public class TableVM
    {
        public string Name { get; set; }
        public string DisplayName { get; set; }

        public TableVM(string name, string displayName)
        {
            Name = name;
            DisplayName = displayName;
        }

        public override int GetHashCode()
        {
            return this.Name.GetHashCode();
        }
    }
}