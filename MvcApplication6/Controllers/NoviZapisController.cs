using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Net.Http;
using System.Web.Http;
using WMpp;
using EFDL;

namespace WMpp.Controllers
{
    public class NoviZapisController : ApiController
    {


        public class noviZapis
        {
            public int KRT_IDT_Zbirka { get; set; }
            public string KRT_Inventarni_broj { get; set; }

        }

        public string inv2str(string x)
        {

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
        public string Get(string id)
        {
            return "value";
        }


        [HttpPost]
        public int SrediIdentity(int idBroj, int idSubBroj)
        {
            
            using (var context =new  M_DATA_PPMHP_WEBEntities())
            {
                context.postaviIdentity(idBroj, idSubBroj);
                
            }

            return 1;
        }
 

        public int Post(noviZapis zapis)
        {
            int maxIDT = -1;
            int brojid=-1;
            var context = new M_DATA_PPMHP_WEBEntities();
            
                maxIDT = context.tbl_Kartica.Max(i => i.AutoBroj) + 123;
                //brojid = context.tbl_Kartica.Where(k => k.ID_Broj == maxIDT).FirstOrDefault().AutoBroj;


                var rezultat = new tbl_Kartica();
               // context.Entry<tbl_Kartica>(rezultat).Reload();
                rezultat.ID_Broj = maxIDT;
                rezultat.KRT_IDT_Zbirka = zapis.KRT_IDT_Zbirka;
                rezultat.KRT_Inventarni_broj = zapis.KRT_Inventarni_broj;
                rezultat.KRT_SORT_Inv_br = inv2str(zapis.KRT_Inventarni_broj);
                //context.Database.
                context.tbl_Kartica.Add(rezultat);
                try
                {
                    context.SaveChanges();
                   // brojid=fixID_Broj(maxIDT);

                }
                catch
                {
                    Console.WriteLine("greška");
                }


                //context.Entry<tbl_Kartica>(rezultat).Reload();
            //context.Dispose();
            //context = new M_DATA_HPMEntities();
            
                brojid= context.tbl_Kartica.Where(k => k.ID_Broj == maxIDT).FirstOrDefault().AutoBroj;//(from k in context.tbl_Kartica where k.ID_Broj == maxIDT select k).FirstOrDefault();//context.tbl_Kartica.FirstOrDefault(i => i.ID_Broj == aBroj);
                //brojid = contextnrez.AutoBroj;
                //context2.Entry<tbl_Kartica>(nrez).Property("ID_Broj").CurrentValue = brojid;
                //context2.Entry<tbl_Kartica>(nrez).Property("ID_Broj").IsModified = true;
                //nrez.ID_Broj = nrez.AutoBroj;
                //nrez.KRT_SORT_Inv_br = "***ccc***";

                var test = context.Database.ExecuteSqlCommand("UPDATE dbo.tbl_Kartica SET ID_Broj=AutoBroj where ID_Broj={0}", maxIDT);     
                
                //context.tbl_Kartica.
               // try
               // {
               //     context.SaveChanges();
               // }
               // catch
               // {
               //     string errooorr2r = "GREŠKQ";
               // }


                var naslov = new tbl_Naslovi();
                naslov.ID_Broj = brojid;
                naslov.NSL_IDT_Jezik_naslova = 1;
                naslov.NSL_IDT_Vrsta_naslova = 1;
                context.tbl_Naslovi.Add(naslov);

                try
                {
                    context.SaveChanges();
                    // brojid=fixID_Broj(maxIDT);

                }
                catch
                {
                    Console.WriteLine("greška");
                }


                var naziv = new tbl_Nazivi();
                naziv.ID_Broj = brojid;
               
                naziv.NAZ_IDT_Vrsta_naziva = 1;

                context.tbl_Nazivi.Add(naziv);

                try
                {
                    context.SaveChanges();
                    // brojid=fixID_Broj(maxIDT);

                }
                catch
                {
                    Console.WriteLine("greška");
                }




                var mat = new tbl_U_Materijali_u_dijelovima();
                mat.ID_Broj = brojid;
                mat.U_IDT_Dio_predmeta = 49;
                mat.U_IDT_Materijal = 1;
                mat.U_IDT_Tehnika = 1;
                context.tbl_U_Materijali_u_dijelovima.Add(mat);

                try
                {
                    context.SaveChanges();
                    // brojid=fixID_Broj(maxIDT);

                }
                catch
                {
                    Console.WriteLine("greška");
                }

                var izrada = new tbl_Izrada();
                izrada.ID_Broj = brojid;
                izrada.IZR_IDT_Vrsta_odgovornosti = 1;
                context.tbl_Izrada.Add(izrada);

                try
                {
                    context.SaveChanges();
                    // brojid=fixID_Broj(maxIDT);

                }
                catch
                {
                    Console.WriteLine("greška");
                }

                var mjere = new tbl_Mjere();
                mjere.ID_Broj = brojid;
                mjere.MJR_IDT_Dimenzija = 17;
                mjere.MJR_IDT_Jedinica_mjere = 1;
                mjere.MJR_IDT_Mjereni_dio = 49;
                context.tbl_Mjere.Add(mjere);


                try
                {
                    context.SaveChanges();
                    // brojid=fixID_Broj(maxIDT);

                }
                catch
                {
                    Console.WriteLine("greška");
                }

                var kataloska = new tbl_Kataloska_jedinica();
                kataloska.ID_Broj = brojid;
                kataloska.k1 = "novi zapis";
                kataloska.K1_Vrsta_ispisa = 3;
                

                context.tbl_Kataloska_jedinica.Add(kataloska);

                try
                {
                    context.SaveChanges();
                    // brojid=fixID_Broj(maxIDT);

                }
                catch
                {
                    Console.WriteLine("greška");
                }


                var inventarizacija = new tbl_Inventarizacija();
                inventarizacija.ID_Broj = brojid;
                inventarizacija.INV_Datum_inventiranja = DateTime.Today.Day.ToString() + "." + DateTime.Today.Month.ToString() + "." + DateTime.Today.Year.ToString();
                inventarizacija.INV_Datum_inventiranja_SORT = DateTime.Today.Year * 10000 + DateTime.Today.Month * 100 + DateTime.Today.Day;
                inventarizacija.INV_ID_Inventirao = WebMatrix.WebData.WebSecurity.CurrentUserId;
                


                context.tbl_Inventarizacija.Add(inventarizacija);

                try
                {
                    context.SaveChanges();
                    // brojid=fixID_Broj(maxIDT);

                }
                catch
                {
                    Console.WriteLine("greška");
                }


                var sadrzaj = new tbl_Sadrzaj();
                sadrzaj.ID_Broj = brojid;
                sadrzaj.SDR_IDT_Vrsta = 6;


                context.tbl_Sadrzaj.Add(sadrzaj);

                try
                {
                  
                    context.SaveChanges();
                    // brojid=fixID_Broj(maxIDT);

                }
                catch
                {
                    Console.WriteLine("greška");
                }




                context.Dispose();



            return brojid;

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
