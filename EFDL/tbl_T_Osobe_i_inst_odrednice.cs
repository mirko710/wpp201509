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
    
    public partial class tbl_T_Osobe_i_inst_odrednice
    {
        public int ID { get; set; }
        public string Ime { get; set; }
        public string Prezime { get; set; }
        public string Napomena { get; set; }
        public Nullable<bool> Zasticeni_pojam { get; set; }
        public Nullable<int> Preporuceni_ID { get; set; }
        public Nullable<int> IDT_Mjesto { get; set; }
        public string Adresa { get; set; }
        public Nullable<int> Ucestalost { get; set; }
        public Nullable<bool> Nevidljiv { get; set; }
        public Nullable<bool> Odabir { get; set; }
        public string Odgovornost { get; set; }
        public string Reference { get; set; }
        public string Biljeske { get; set; }
        public Nullable<int> ID_Tablice { get; set; }
        public Nullable<int> ID_leksikon { get; set; }
        public Nullable<double> Sort { get; set; }
    }
}
