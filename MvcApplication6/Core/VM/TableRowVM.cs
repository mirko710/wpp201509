namespace WMpp.Core.VM
{
    public class TableRowVM
    {
        public int IDT { get; set; }
        public string Pojam { get; set; }
        public int? Nad_IDT { get; set; }

        public int? Ucestalost { get; set; }
        public string Napomena { get; set; }
        public string NadPojam { get; set; }

        public string PreporuceniPojam { get; set; }
        public string Odgovornost { get; set; }
        public bool Odabrano { get; set; }

        public TableRowVM(int idt, string pojam, int? nadIdt, int? ucestalost, string napomena, string nadPojam, string preporuceniPojam, string odgovornost) : this(idt, pojam, nadIdt, ucestalost, napomena, odgovornost)
        {
            NadPojam = nadPojam;
            this.PreporuceniPojam = preporuceniPojam;
        }

        public TableRowVM(int idt, string pojam, int? nadIdt, int? ucestalost, string napomena, string odgovornost)
        {
            IDT = idt;
            Pojam = pojam;
            Ucestalost = ucestalost;
            Nad_IDT = nadIdt;
            Napomena = napomena;
            Odgovornost = odgovornost;
        }
    }
}