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
    
    public partial class tbl_Pripadnosti
    {
        public Nullable<int> ID_Broj { get; set; }
        public Nullable<int> PRI_IDT_Pripadnost { get; set; }
        public int ID { get; set; }
    
        public virtual tbl_Kartica tbl_Kartica { get; set; }
        public virtual tbl_T_Pripadnosti tbl_T_Pripadnosti { get; set; }
    }
}
