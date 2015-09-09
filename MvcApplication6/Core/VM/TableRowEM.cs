using System.Collections.Generic;

namespace WMpp.Core.VM
{
    public class TableRowEM
    {
        public int? IDT { get; set; }
        public int? Nad_IDT { get; set; }
        public List<TableRowEM> NadredeniPojmovi { get; set; }
        public int? Preporuceni_IDT { get; set; }
        public TableRowEM PreporuceniPojam { get; set; }
        public string Pojam { get; set; }
        public string Napomena { get; set; }
        public int? Ucestalost { get; set; }

        public string Odgovornost { get; set; }
        public string Biljeske { get; set; }
        public string Reference { get; set; }
        public string Tablica { get; set; }

        public TableRowEM()
        {
            
        }

        public TableRowEM(string tablica, int? idt, int? preporuceniIDT, int? nadIDT, string pojam, string napomena, int? ucestalost, string biljeske, string reference, string odgovornost)
        {
            Tablica = tablica;
            IDT = idt;
            Preporuceni_IDT = preporuceniIDT;
            Nad_IDT = nadIDT;
            Pojam = pojam;
            Napomena = napomena;
            Ucestalost = ucestalost;
            Biljeske = biljeske;
            Reference = reference;
            Odgovornost = odgovornost;
        }
    }
}