namespace WMpp.Core.DB
{
    public class TableFilter
    {
        public string Pojam { get; set; }
        public string PreporuceniPojam { get; set; }
        public string NadPojam { get; set; }
        public string Napomena { get; set; }
        public int? Ucestalost { get; set; }
        public string Odgovornost { get; set; }

        public TableFilter(string pojam, string preporuceniPojam, string nadPojam, string napomena, int? ucestalost, string odgovornost)
        {
            Pojam = pojam;
            PreporuceniPojam = preporuceniPojam;
            NadPojam = nadPojam;
            Napomena = napomena;
            Ucestalost = ucestalost;
            Odgovornost = odgovornost;
        }

    }
}