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
    
    public partial class tbl_T_Povezanosti
    {
        public tbl_T_Povezanosti()
        {
            this.tbl_Povijest_predmeta = new HashSet<tbl_Povijest_predmeta>();
        }
    
        public int IDT { get; set; }
        public string Pojam { get; set; }
        public string Napomena { get; set; }
        public Nullable<int> Nad_IDT { get; set; }
        public Nullable<int> Preporuceni_IDT { get; set; }
        public int AutoBroj { get; set; }
        public Nullable<bool> Zasticeni_pojam { get; set; }
        public Nullable<int> Ucestalost { get; set; }
        public Nullable<bool> Nevidljiv { get; set; }
        public Nullable<bool> Odabir { get; set; }
        public string Odgovornost { get; set; }
        public string Reference { get; set; }
        public string Biljeske { get; set; }
        public Nullable<int> ID_Tablice { get; set; }
        public Nullable<int> ID_leksikon { get; set; }
        public Nullable<double> Sort { get; set; }
        public string Pojam2 { get; set; }
    
        public virtual ICollection<tbl_Povijest_predmeta> tbl_Povijest_predmeta { get; set; }
    }
}
