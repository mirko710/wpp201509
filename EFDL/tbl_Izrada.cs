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
    
    public partial class tbl_Izrada
    {
        public int ID { get; set; }
        public Nullable<int> ID_Broj { get; set; }
        public Nullable<int> IZR_IDT_Mjesto { get; set; }
        public Nullable<int> IZR_ID_Autor { get; set; }
        public Nullable<int> IZR_IDT_Uloga { get; set; }
        public string IZR_Vrijeme_opis { get; set; }
        public string IZR_Vrijeme_vrijednost { get; set; }
        public string IZR_Vrijeme_jedinica { get; set; }
        public Nullable<int> IZR_Vrijeme_od { get; set; }
        public Nullable<int> IZR_Vrijeme_do { get; set; }
        public string IZR_Vrijeme_opis2 { get; set; }
        public string IZR_Vrijeme_vrijednost2 { get; set; }
        public string IZR_Vrijeme_jedinica2 { get; set; }
        public Nullable<bool> IZR_Period { get; set; }
        public Nullable<bool> IZR_Period_do { get; set; }
        public Nullable<int> IZR_IDT_Vrsta_odgovornosti { get; set; }
        public Nullable<float> Sort_polje { get; set; }
    
        public virtual tbl_Kartica tbl_Kartica { get; set; }
        public virtual tbl_T_Autori tbl_T_Autori { get; set; }
        public virtual tbl_T_Mjesta tbl_T_Mjesta { get; set; }
        public virtual tbl_T_Uloge_autora tbl_T_Uloge_autora { get; set; }
        public virtual tbl_T_Vrste_odgovornosti tbl_T_Vrste_odgovornosti { get; set; }
    }
}