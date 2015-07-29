using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WMpp;

namespace WMpp.Controllers
{
    public class ValuesController : ApiController
    {



        public class podzapisiHelper
        {
            public string sifra { get; set; }
            public string tablica { get; set; }
            public int? IDT { get; set; }
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
            public string tip { get; set; }
            public upiti[] upiti { get; set; }
        }


        public class rezultati 
        {
            public int ID_Broj {get; set;}
            public string KRT_Inventarni_broj {get; set;}
            public int KRT_IDT_Zbirka { get; set; }
            public string MC_Staza_slike { get; set; }
            public string naslovi { get; set; }
            public string nazivi { get; set; }
            public string Autori { get; set; }
            public string Mjere { get; set; }
            public string Mjesta { get; set; }
            public string Datacija { get; set; }
            public string zbirka { get; set; }
            public string Mit { get; set; }
            public string kataloskaJedinica {get; set;}

        }

        public class rezultatiKJ
        {
            public int ID_Broj { get; set; }
            public string KRT_Inventarni_broj { get; set; }
            public int KRT_IDT_Zbirka { get; set; }
            public string MC_Staza_slike { get; set; }
            public string K1 { get; set; }

        }

        public class refiner
        {
            public string kategorija { get; set; }
            public string Pojam {get; set;}
            public int? IDT { get; set; }
            public int? brojZapisa { get; set; }
        }

        public class doubleLoad
        {
            
            public virtual ICollection<rezultati> part1 { get; set; }
            public virtual ICollection<refiner> part2 { get; set; }
            public virtual ICollection<rezultatiKJ> part3 { get; set; }
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

        // GET api/values
        public IEnumerable<string> GetRealValue()
        {
            //var context = new M_DATA_HPMEntities();
            //var qry=context.Database.SqlQuery<Int64>("SELECT ID_Broj from dbo.tbl_Kartica where ID_Broj IN (select id_broj from tbl_Izrada where IZR_IDT_Mjesto=
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        public string Get(int poljeID,int IDT)
        {
            //podzapisi





            return "value";
        }


        public string termTablicaZaPolje(int poljeIDT)
        {
            string tablica="";
                   switch (poljeIDT)
                    {
                        case 462:
                            tablica="tbl_T_Nazivi";
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



        // POST api/values
        public object Post(praviUpitTip upit)
        {
            string extraOperator = "";
            string dUpitOperator = "";
            string dUpitVrijednost="";
            int? dUpitVrijednost2 = -1;
            string dTablica = "";
            string T_tablica="";
            string dPolje = "";

            List<podzapisiHelper> PH= new List<podzapisiHelper>();


            Guid sifra = new Guid(); //"9998hhh11";
            sifra = Guid.NewGuid();

            string value = "";// "select * from dbo.vw_Stuff_ALL ";
            string value3 = "";// "select * from dbo.vw_Stuff_KJ ";
            for (int i=0; i < upit.upiti.Length;i++ )
            {
                dUpitVrijednost2 = -1;
                T_tablica=termTablicaZaPolje(upit.upiti[i].poljeIDT);



                if (upit.upiti[i].upitOperator == "sadrži")
                {
                    dUpitOperator = "LIKE";
                }else
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


                if (dUpitOperator=="LIKE" || dUpitOperator=="upisan")  {
                    if (dUpitOperator == "LIKE") { dUpitVrijednost = "'%" + dUpitVrijednost + "%'"; };
                   // if (dUpitOperator == "upisan") { dUpitVrijednost=dUpitVrijednost =="DA": "NOT IS NULL":"IS };
                    dTablica = "vw_Stuff_ALL";
                    switch (upit.upiti[i].polje)
                    {
                        case "NSL_Naslov":
                            dPolje="naslovi";
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
                            tph.tablica  = T_tablica;
                            tph.IDT  = dUpitVrijednost2;
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
                    if (dUpitOperator == "upisan"){
                        if(dUpitVrijednost=="NE"){
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


      
            string xValue="INSERT INTO tbl_temp_pretrazivanje SELECT '" + sifra + "' as sifra,dbo.vw_Stuff_ALL.ID_Broj,'0' as odabrano, 0 as sort from dbo.vw_Stuff_ALL " + value;
            if (upit.tip == "1")//oriđi
            {
                value = "select * from dbo.vw_Stuff_ALL " + value;
                value3 = "select * from dbo.vw_Stuff_KJ where id_broj=-1";
            }

            if (upit.tip == "2")//kj plus slika
            {
                value = "select * from dbo.vw_Stuff_ALL where id_broj=-1";
                value3 = "select * from dbo.vw_Stuff_KJ where ID_Broj IN (select ID_Broj from tbl_temp_pretrazivanje WHERE sifra='" + sifra + "')";
            } 

            string refinerQry = "SELECT * FROM [dbo].[naziviRefiner] (N'" +  sifra + "')";
            
            //string xValue="INSERT INTO tbl_temp_pretrazivanje SELECT " + sifra + " as sifra,dbo.vw_Stuff_ALL.ID_Broj, '0' as odabrano from dbo.vw_Stuff_ALL " + value;
            doubleLoad s1 = new doubleLoad();
           using( var context = new EFDL.M_DATA_PPMHP_WEBEntities())
           {
               if (PH.Count>0)
               {
                   for (int i = 0; i < PH.Count; i++)
                   {
                       var inq = context.testREK2(PH[i].tablica, PH[i].sifra, PH[i].IDT);
                   }
               }

               		

                   //context.testREK2()
                var qry = context.Database.SqlQuery<rezultati>(value);
                //var qry3 = context.Database.SqlQuery<rezultatiKJ>(value3);
                context.Database.ExecuteSqlCommand(xValue);
                var  zzz = context.Database.SqlQuery<refiner>(refinerQry).ToList();
                var qry3 = context.Database.SqlQuery<rezultatiKJ>(value3);
                
                //s1.part1 = qry.Take(30).ToList();
                if (qry.Count() > 2500)
                {
                    s1.part1 = qry.Take(2500).ToList();
                }
                else
                {
                    s1.part1 = qry.ToList();
                }
                s1.part3 = qry3.ToList();
                if (zzz.Count() > 1000)
                {
                    List<refiner> xxx=new List<refiner>(zzz);
                  
                    int katCount = 0;
                    string katCur = "";
                    foreach (refiner z in xxx)
                    {
                        if (katCur != z.kategorija)
                        {
                            
                            katCur =z.kategorija;
                            katCount = 0;
                        }
                        else
                        {
                            katCount++;
                            if (katCount >50) {
                                
                                zzz.Remove(z); };
                        }
                        
                        
                    }
                }

                s1.part2 = zzz;// zzz.ToList();
                context.Database.ExecuteSqlCommand("DELETE tbl_temp_pretrazivanje WHERE sifra='" + sifra +"'");
                if (PH.Count > 0)
                {
                    for (int i = 0; i < PH.Count; i++)
                    {
                        //var inq = context.testREK2(PH[i].tablica, PH[i].sifra, PH[i].IDT);
                        context.Database.ExecuteSqlCommand("DELETE tbl_temp_pretrazivanje WHERE sifra='" + PH[i].sifra + "' and tablica='" + PH[i].tablica + "'");
                    }
                }
            
           }
            return s1;//qry.Take(30).ToList();
        }


 
        

        // PUT api/values/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }
    }
}
