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
    
    public partial class tbl_Knjiga_ulaska
    {
        public Nullable<int> ID_Broj { get; set; }
        public string Broj_ulaska { get; set; }
        public string KUL_Datum_ulaska { get; set; }
        public Nullable<int> KUL_ID_Osoba_koja_predaje { get; set; }
        public string KUL_Urbr_dokumenta_o_ulasku { get; set; }
        public Nullable<int> KUL_ID_Vlasnistvo { get; set; }
        public string KUL_Svrha_ulaska { get; set; }
        public Nullable<int> KUL_ID_Osoba_odgovorna_za_predmet { get; set; }
        public string KUL_Datum_povrata_predmeta { get; set; }
        public string KUL_Napomena { get; set; }
        public Nullable<int> KUL_Inventirao { get; set; }
        public string KUL_Broj_ulaska_sort { get; set; }
        public string Broj_izlaska { get; set; }
        public string KIZ_Datum_izlaska { get; set; }
        public Nullable<int> KIZ_ID_Osoba_koja_predaje { get; set; }
        public string KIZ_Broj_akta { get; set; }
        public Nullable<int> KIZ_ID_Vlasnistvo { get; set; }
        public string KIZ_Svrha_izlaska { get; set; }
        public Nullable<int> KIZ_ID_Osoba_odgovorna_za_predmet { get; set; }
        public string KIZ_Datum_povrata_predmeta { get; set; }
        public string KIZ_Napomena { get; set; }
        public string KIZ_Promjena_stanja { get; set; }
        public string KIZ_Podaci_o_fotografiji { get; set; }
        public Nullable<int> KIZ_Inventirao { get; set; }
        public string KIZ_Broj_izlaska_sort { get; set; }
        public string Broj_pohrane { get; set; }
        public string KPO_Podaci_o_vlasniku { get; set; }
        public string KPO_Svrha_pohrane { get; set; }
        public string KPO_Datum_ulaska { get; set; }
        public string KPO_Akt_o_preuzimanju { get; set; }
        public string KPO_Datum_povrata_predmeta { get; set; }
        public string KPO_Akt_o_povratu_predmeta { get; set; }
        public Nullable<int> KPO_ID_Vlasnistvo { get; set; }
        public string KPO_Napomena { get; set; }
        public Nullable<int> KPO_Inventirao { get; set; }
        public string KPO_Broj_pohrane_sort { get; set; }
        public Nullable<int> KUL_ID_Osoba_koja_preuzima_predmet { get; set; }
        public Nullable<int> KPO_IDT_Osoba_koja_predaje { get; set; }
        public Nullable<int> KIZ_ID_Osoba_koja_preuzima_predmet { get; set; }
        public int ID { get; set; }
        public string KUL_Godina { get; set; }
        public string KUL_inventarna_oznaka { get; set; }
        public bool KIZ_Vraceno { get; set; }
        public bool KUL_Vraceno { get; set; }
        public bool KPO_Vraceno { get; set; }
        public Nullable<int> KIZ_Datum_izlaska_SORT { get; set; }
        public Nullable<int> KIZ_Datum_povrata_predmeta_SORT { get; set; }
        public Nullable<int> KUL_Datum_ulaska_SORT { get; set; }
        public Nullable<int> KUL_Datum_povrata_predmeta_SORT { get; set; }
        public Nullable<int> KPO_Datum_ulaska_SORT { get; set; }
        public Nullable<int> KPO_Datum_povrata_predmeta_SORT { get; set; }
    
        public virtual tbl_Kartica tbl_Kartica { get; set; }
        public virtual tbl_Knjiga_ulaska tbl_Knjiga_ulaska1 { get; set; }
        public virtual tbl_Knjiga_ulaska tbl_Knjiga_ulaska2 { get; set; }
    }
}
