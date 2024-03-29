//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace EFDL
{
    using System;
    using System.Collections.Generic;
    
    public partial class tbl_T_Autori
    {
        public tbl_T_Autori()
        {
            this.tbl_Autori_Discipline = new HashSet<tbl_Autori_Discipline>();
            this.tbl_Autori_Grupe = new HashSet<tbl_Autori_Grupe>();
            this.tbl_Autori_Grupe1 = new HashSet<tbl_Autori_Grupe>();
            this.tbl_Autori_Pseudonimi = new HashSet<tbl_Autori_Pseudonimi>();
            this.tbl_Autori_Pseudonimi1 = new HashSet<tbl_Autori_Pseudonimi>();
            this.tbl_Izrada = new HashSet<tbl_Izrada>();
        }
    
        public int ID { get; set; }
        public string Ime { get; set; }
        public string Prezime { get; set; }
        public string Napomena { get; set; }
        public Nullable<bool> Zasticeni_pojam { get; set; }
        public Nullable<int> Preporuceni_ID { get; set; }
        public Nullable<int> IDT_Mjesto { get; set; }
        public string Adresa { get; set; }
        public string Vrsta_autor { get; set; }
        public string R_Vrijeme_opis { get; set; }
        public string R_Vrijeme_vrijednost { get; set; }
        public string R_Vrijeme_jedinica { get; set; }
        public Nullable<int> R_Vrijeme_od { get; set; }
        public Nullable<int> R_Vrijeme_do { get; set; }
        public string S_Vrijeme_opis { get; set; }
        public string S_Vrijeme_vrijednost { get; set; }
        public string S_Vrijeme_jedinica { get; set; }
        public Nullable<int> S_Vrijeme_od { get; set; }
        public Nullable<int> S_Vrijeme_do { get; set; }
        public Nullable<int> R_IDT_Mjesto { get; set; }
        public Nullable<int> R_IDT_Drzava { get; set; }
        public Nullable<int> S_IDT_Mjesto { get; set; }
        public Nullable<int> S_IDT_Drzava { get; set; }
        public string Spol { get; set; }
        public Nullable<int> Ucestalost { get; set; }
        public Nullable<bool> Odabir { get; set; }
        public Nullable<bool> Nevidljiv { get; set; }
        public string Odgovornost { get; set; }
        public string Reference { get; set; }
        public string Biljeske { get; set; }
        public Nullable<int> ID_Tablice { get; set; }
        public Nullable<int> ID_leksikon { get; set; }
        public Nullable<double> Sort { get; set; }
        public string Telefon { get; set; }
        public string Mobitel { get; set; }
        public string Email { get; set; }
        public string URL { get; set; }
        public string Bibliografija { get; set; }
        public string Kustoska_izjava { get; set; }
        public string CV { get; set; }
        public bool S { get; set; }
    
        public virtual ICollection<tbl_Autori_Discipline> tbl_Autori_Discipline { get; set; }
        public virtual ICollection<tbl_Autori_Grupe> tbl_Autori_Grupe { get; set; }
        public virtual ICollection<tbl_Autori_Grupe> tbl_Autori_Grupe1 { get; set; }
        public virtual ICollection<tbl_Autori_Pseudonimi> tbl_Autori_Pseudonimi { get; set; }
        public virtual ICollection<tbl_Autori_Pseudonimi> tbl_Autori_Pseudonimi1 { get; set; }
        public virtual ICollection<tbl_Izrada> tbl_Izrada { get; set; }
        public virtual tbl_T_Mjesta tbl_T_Mjesta { get; set; }
        public virtual tbl_T_Mjesta tbl_T_Mjesta1 { get; set; }
        public virtual tbl_T_Mjesta tbl_T_Mjesta2 { get; set; }
    }
}
