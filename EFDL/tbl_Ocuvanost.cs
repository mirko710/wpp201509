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
    
    public partial class tbl_Ocuvanost
    {
        public Nullable<int> ID_Broj { get; set; }
        public Nullable<int> OCU_IDT_Ocuvanost { get; set; }
        public string OCU_Ocuvanost_sazetak { get; set; }
        public string OCU__Ocuvanost_datum { get; set; }
        public Nullable<System.DateTime> OCU_Ocuvanost_datum { get; set; }
        public string OCU_Vrijeme_opis { get; set; }
        public string OCU_Vrijeme_vrijednost { get; set; }
        public string OCU_Vrijeme_jedinica { get; set; }
        public Nullable<int> OCU_Vrijeme_od { get; set; }
        public Nullable<int> OCU_Vrijeme_do { get; set; }
        public string OCU_Vrijeme_opis2 { get; set; }
        public string OCU_Vrijeme_vrijednost2 { get; set; }
        public string OCU_Vrijeme_jedinica2 { get; set; }
        public Nullable<bool> OCU_Period { get; set; }
        public Nullable<bool> OCU_Period_do { get; set; }
        public int ID { get; set; }
    
        public virtual tbl_Kartica tbl_Kartica { get; set; }
        public virtual tbl_T_Ocuvanosti tbl_T_Ocuvanosti { get; set; }
    }
}
