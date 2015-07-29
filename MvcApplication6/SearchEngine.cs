using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WMpp
{
    public class SearchEngine
    {

        public class podzapisiHelper
        {
            public string sifra { get; set; }
            public string tablica { get; set; }
            public int? IDT { get; set; }
        }

        public class vratiStringIPH
        {
            public string sqlString { get; set; }
            public virtual List<podzapisiHelper> PH { get; set; }
        }

        public class upiti
        {
            public int poljeIDT { get; set; }
            public string polje { get; set; }
            public string tablica { get; set; }
            public string vrijednost1 { get; set; }
            public int? vrijednost2 { get; set; }
            public string vrijednost3 { get; set; }
            public string upitOperator { get; set; }
            public string redOperator { get; set; }
            public Boolean podZapisi { get; set; }
        }

        public class praviUpitTip
        {
            public upiti[] upiti { get; set; }
            public string staraSifra { get; set; }
            public int pageSize { get; set; }
        }


        public string inv2str(string x)
        {
            if (String.IsNullOrEmpty(x))
            {
                x = "";
            }
            string mali = x.Substring(0, 1);
            string veliki = "";

            for (int i = 1; i < x.Count(); i++)
            {
                if (("0123456789".Contains(x.Substring(i, 1)) && "0123456789".Contains(mali.Substring(mali.Count() - 1, 1))) || (!"0123456789".Contains(x.Substring(i, 1)) && !"0123456789".Contains(mali.Substring(mali.Count() - 1, 1))))
                {
                    mali += x.Substring(i, 1);
                }
                else
                {
                    if (mali.IndexOfAny(new char[] { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' }) > -1)
                    {
                        veliki += mali.PadLeft(10, '*');
                        mali = x.Substring(i, 1);
                    }
                    else
                    {
                        veliki += mali;
                        mali = x.Substring(i, 1);
                    }
                }
            }

            if (mali.Count() > 0)
            {

                if (mali.IndexOfAny(new char[] { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' }) > -1)
                {
                    veliki += mali.PadLeft(10, '*');

                }
                else
                {
                    veliki += mali;

                }

            }
            return veliki;
        }

        public string termTablicaZaPolje(int poljeIDT)
        {
            string tablica = "";
            switch (poljeIDT)
            {
                case 462:
                    tablica = "tbl_T_Nazivi";
                    break;
                case 299:
                    tablica = "tbl_T_Materijali";
                    break;

                case 300:
                    tablica = "tbl_T_Tehnike";
                    break;

                case 116:
                    tablica = "tbl_T_Mjesta";
                    break;

                case 131:
                    tablica = "tbl_T_Zbirke";
                    break;

                case 146:
                    tablica = "tbl_T_Nalaziste";
                    break;

                case 183:
                    tablica = "tbl_T_Kljucne_rijeci";
                    break;


                default:
                    break;
            }

            return tablica;


        }


        public vratiStringIPH Enginate(praviUpitTip upit,System.Guid sifra)
        {
            string extraOperator = "";
            string dUpitOperator = "";
            string dUpitVrijednost = "";
            int? dUpitVrijednost2 = -1;
            string dTablica = "";
            string T_tablica = "";
            string dPolje = "";

            List<podzapisiHelper> PH = new List<podzapisiHelper>();

            string value = "";// "select * from dbo.vw_Stuff_ALL ";

            for (int i = 0; i < upit.upiti.Length; i++)
            {
                dUpitVrijednost2 = -1;
                T_tablica = termTablicaZaPolje(upit.upiti[i].poljeIDT);

                if (upit.upiti[i].upitOperator == "sadrži")
                {
                    dUpitOperator = "LIKE";
                }
                else
                {
                    dUpitOperator = upit.upiti[i].upitOperator;
                }
                if (dUpitOperator == "=")
                {
                    dUpitVrijednost2 = upit.upiti[i].vrijednost2;
                }

                if (dUpitOperator == "LIKE")
                {
                    dUpitVrijednost = upit.upiti[i].vrijednost1;
                }
                if (dUpitOperator == "upisan")
                {
                    dUpitVrijednost = upit.upiti[i].vrijednost3;
                }

                dTablica = upit.upiti[i].tablica;
                dPolje = upit.upiti[i].polje;


                if ((dUpitOperator == "<" || dUpitOperator == ">") && dPolje == "KRT_Inventarni_broj")
                {
                    dPolje = "KRT_SORT_Inv_br";
                    dUpitVrijednost = inv2str(upit.upiti[i].vrijednost1);
                }



                extraOperator = i == 0 ? " where " : " " + upit.upiti[i].redOperator + " ";


                if (dUpitOperator == "LIKE" || dUpitOperator == "upisan")
                {
                    if (dUpitOperator == "LIKE") { dUpitVrijednost = "'%" + dUpitVrijednost + "%'"; };
                    // if (dUpitOperator == "upisan") { dUpitVrijednost=dUpitVrijednost =="DA": "NOT IS NULL":"IS };
                    dTablica = "vw_Stuff_ALL";
                    switch (upit.upiti[i].polje)
                    {
                        case "NSL_Naslov":
                            dPolje = "naslovi";
                            break;
                        case "IZR_IDT_Mjesto":
                            dPolje = "Mjesta";
                            break;

                        case "IZR_ID_Autor":
                            dPolje = "Autori";
                            break;

                        case "NAZ_IDT_Naziv_predmeta":
                            dPolje = "nazivi";
                            break;

                        case "IZR_Vrijeme_vrijednost":
                            dPolje = "Datacija";
                            break;

                        case "U_IDT_Materijal":
                            dPolje = "Mit";
                            break;

                        case "U_IDT_Tehnika":
                            dPolje = "Mit";
                            break;

                        case "MJR_Mjera":
                            dPolje = "Mjere";
                            break;


                        default:
                            break;
                    }
                    //dPolje = "";
                };



                if (dTablica != "vw_Stuff_ALL")
                {
                    //VextraOperator = "";
                    //if (value != "") { VextraOperator = extraOperator; }
                    if (dUpitVrijednost2 != -1)
                    {
                        if (!upit.upiti[i].podZapisi)
                        {
                            value += extraOperator + " ID_Broj IN ( Select ID_Broj From dbo." + upit.upiti[i].tablica + " where dbo." + dTablica + "." + dPolje + " " + dUpitOperator + " " + dUpitVrijednost2 + ")";
                        }
                        else
                        {//za podzapise
                            value += extraOperator + " ID_Broj IN ( Select ID_Broj From dbo." + upit.upiti[i].tablica + " where dbo." + dTablica + "." + dPolje + " IN (SELECT ID_Broj as IDT from tbl_temp_pretrazivanje where sifra='" + sifra + dUpitVrijednost2.ToString() + "' and tablica='" + T_tablica + "'))";
                            podzapisiHelper tph = new podzapisiHelper();
                            tph.sifra = sifra + dUpitVrijednost2.ToString();
                            tph.tablica = T_tablica;
                            tph.IDT = dUpitVrijednost2;
                            PH.Add(tph);

                        }
                    }
                    else
                    {
                        if (dPolje == "KRT_SORT_Inv_br")
                        {
                            value += extraOperator + " ID_Broj IN ( Select ID_Broj From dbo." + upit.upiti[i].tablica + " where dbo." + dTablica + "." + dPolje + " " + dUpitOperator + " '" + dUpitVrijednost + "')";
                        }
                        else
                        {
                            value += extraOperator + " ID_Broj IN ( Select ID_Broj From dbo." + upit.upiti[i].tablica + " where dbo." + dTablica + "." + dPolje + " " + dUpitOperator + " " + dUpitVrijednost + ")";
                        }
                    }
                }
                else
                {
                    if (dUpitOperator == "upisan")
                    {
                        if (dUpitVrijednost == "NE")
                        {
                            if (dPolje == "SveUpisano")
                            {
                                value += extraOperator + " ( dbo.vw_Stuff_ALL.naslovi is null OR dbo.vw_Stuff_ALL.Datacija is null OR dbo.vw_Stuff_ALL.nazivi is null OR dbo.vw_Stuff_ALL.Mit is null OR dbo.vw_Stuff_ALL.Mjere is null )";
                            }
                            else
                            {
                                value += extraOperator + " ( dbo." + dTablica + "." + dPolje + " is null )";
                            }
                        }
                        else
                        {
                            if (dPolje == "SveUpisano")
                            {
                                value += extraOperator + " ( not dbo.vw_Stuff_ALL.naslovi is null AND not dbo.vw_Stuff_ALL.Datacija is null AND not dbo.vw_Stuff_ALL.nazivi is null AND not dbo.vw_Stuff_ALL.Mit is null AND not dbo.vw_Stuff_ALL.Mjere is null )";
                            }
                            else
                            {

                                value += extraOperator + " ( not dbo." + dTablica + "." + dPolje + " is null )";
                            }
                        }
                    }
                    else
                    {
                        if (dPolje == "SveUpisano")
                        {
                            value += extraOperator + " ( dbo.vw_Stuff_ALL.naslovi LIKE" + dUpitVrijednost + " OR dbo.vw_Stuff_ALL.Datacija LIKE" + dUpitVrijednost + " OR dbo.vw_Stuff_ALL.nazivi LIKE" + dUpitVrijednost + " OR dbo.vw_Stuff_ALL.Mit LIKE" + dUpitVrijednost + " OR dbo.vw_Stuff_ALL.Mjere LIKE" + dUpitVrijednost + "  )";
                        }
                        else
                        {
                            value += extraOperator + " ( dbo." + dTablica + "." + dPolje + " " + dUpitOperator + " " + dUpitVrijednost + ")";
                        }
                    }
                }
            }

            vratiStringIPH x = new vratiStringIPH();
            x.sqlString = value;
            x.PH = PH;

            return x;
        }

    }
}