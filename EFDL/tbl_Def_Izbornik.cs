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
    
    public partial class tbl_Def_Izbornik
    {
        public int IDT { get; set; }
        public string Pojam { get; set; }
        public string Tip { get; set; }
        public string Podtip { get; set; }
        public string Vrsta { get; set; }
        public string Param1 { get; set; }
        public string Param2 { get; set; }
        public string Param3 { get; set; }
        public Nullable<bool> Nevidljiv { get; set; }
        public string Napomena { get; set; }
        public Nullable<int> Nad_IDT { get; set; }
        public Nullable<int> Preporuceni_IDT { get; set; }
        public int AutoBroj { get; set; }
        public Nullable<bool> Zasticeni_pojam { get; set; }
        public Nullable<int> Ucestalost { get; set; }
        public Nullable<float> Sort { get; set; }
    }
}