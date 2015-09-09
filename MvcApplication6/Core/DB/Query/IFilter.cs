namespace WMpp.Core.DB.Query
{
    public interface IFilter
    {
        string Expression { get; }
        bool HasFilter { get; }
        string ExpressionWithWhere { get; }
    }
}