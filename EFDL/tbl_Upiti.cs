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
    
    public partial class tbl_Upiti
    {
        public tbl_Upiti()
        {
            this.tbl_Upiti_redci = new HashSet<tbl_Upiti_redci>();
        }
    
        public int ID_Upita { get; set; }
        public Nullable<int> ID_redka { get; set; }
        public string Naziv { get; set; }
        public string Opis { get; set; }
    
        public virtual ICollection<tbl_Upiti_redci> tbl_Upiti_redci { get; set; }
    }
}
