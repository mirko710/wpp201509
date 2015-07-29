using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;
using System.Web.Http;
using System.Web.Http.OData;
using Breeze.WebApi;
using Newtonsoft.Json.Linq;
using Breeze.WebApi.EF;
using EFDL;


namespace WMpp.Controllers
{


    public class MppContextProvider : EFContextProvider<M_DATA_PPMHP_WEBEntities>
    {

        public MppContextProvider() : base() { }

        protected override bool BeforeSaveEntity(EntityInfo entityInfo) {
      // return false if we don't want the entity saved.
      // prohibit any additions of entities of type 'Role'
            var SEC = new SEClasses();
            bool isKatalogMode=SEC.GetParametar("B_KATALOG_MODE")=="DA"?true:false;
            if(isKatalogMode)
            {
                if (entityInfo.Entity.GetType() != typeof(tbl_Parametri_za_korisnike))//&& entityInfo.EntityState == EntityState.Modified)
                {
                    //entityInfo.EntityState = EntityState.Unchanged;
                    return false;
                }
                else
                {
                    return true;
                }
            }
            else
            {
                return true;
            }
        }
 
   

        protected override Dictionary<Type, List<EntityInfo>> BeforeSaveEntities(Dictionary<Type, List<EntityInfo>> saveMap)
        {
            // return a map of those entities we want saved.
            return saveMap;
        }
    }


    [BreezeController]
    public class BreezeController : ApiController
    {

        public class nodesModel 
        {
            public int? IDT { get; set; }
            public String Pojam { get; set; }
            public Boolean isExpanded { get; set; }
            public Boolean hasChildren { get; set; }
            public int? Nivo { get; set; }
            public int? Nad_IDT { get; set; }
            //public Boolean pocetna { get; set; }
            public String prviZapis { get; set; }
            public String zadnjiZapis { get; set; }
            public int? brojZapisa { get; set; }
            public int? brojPodZapisa { get; set; }
            public virtual ICollection<nodesModel> podNodes {get; set;}
        };


        readonly EFContextProvider<M_DATA_PPMHP_WEBEntities> _contextProvider = new MppContextProvider(); 
               // new EFContextProvider<M_DATA_HPMEntities>();

            // ~/breeze/Zza/Metadata
            [HttpGet]
            public string Metadata()
            {
                return _contextProvider.Metadata();
            }

            // ~/breeze/Zza/Customers








            [HttpGet]
            public object TreeViewTry3()
            {

                var customers = _contextProvider.Context.tbl_T_Mjesta;

                var toppers = customers.Where(y => y.Nad_IDT.Equals(null)).ToList(); 
                var nadIDTz=toppers.Select(x=>x.IDT).ToList();
               
               // var secunders=customers.Where(y=> y.Nad_IDT.);

                return null;
            }


            //[HttpGet]
            //public object ZbirkeZaTreeView()
            //{
            //    var customers = _contextProvider.Context.usp_Zbirke_DohvatiSve();
            //    var vvv = customers.ToList();
            //    List<nodesModel> zzz = new List<nodesModel>();
            //    List<zbirkePrviZadnjiZbroj_Result> zbirr = new List<zbirkePrviZadnjiZbroj_Result>();
            //    zbirr = _contextProvider.Context.zbirkePrviZadnjiZbroj().ToList();
            //    string adresaZaUpis = "#upisPodataka";
            //    foreach (var x in vvv)
            //    {
            //        //zzz.Add(new nodesModel() { IDT = x.IDT, Pojam = x.Pojam, Nivo = x.Nivo, Nad_IDT = x.Nad_IDT, pocetna=iPocetna==x.IDT });
            //        zbirkePrviZadnjiZbroj_Result tmpZ = zbirr.Find(z => z.KRT_IDT_Zbirka == x.IDT);
            //        if (tmpZ != null)
            //        {
            //            zzz.Add(new nodesModel() { IDT = x.IDT, Pojam = x.Pojam, Nivo = x.Nivo, Nad_IDT = x.Nad_IDT, prviZapis = adresaZaUpis + tmpZ.prvi, zadnjiZapis = adresaZaUpis + tmpZ.zadnji, brojPodZapisa = 0, brojZapisa = tmpZ.zbroj });
            //        }
            //        else
            //        {
            //            zzz.Add(new nodesModel() { IDT = x.IDT, Pojam = x.Pojam, Nivo = x.Nivo, Nad_IDT = x.Nad_IDT, prviZapis = adresaZaUpis + -1, zadnjiZapis = adresaZaUpis + -1, brojPodZapisa = 0, brojZapisa = 0 });
            //        }
            //    }

            //    for (int? i = 6; i > 0; i--)
            //    {
            //        List<nodesModel> results = zzz.FindAll(
            //        delegate(nodesModel bk)
            //        {
            //            return bk.Nivo == i;
            //        }
            //        );
            //        if (results.Count != 0)
            //        {
            //            foreach (nodesModel nM1 in results)
            //            {
            //                List<nodesModel> rez2 = zzz.FindAll(
            //                delegate(nodesModel bk2)
            //                {
            //                    return nM1.IDT == bk2.Nad_IDT;
            //                }
            //                );
            //                //nM1.hasChildren = false;
            //                if (rez2.Count != 0)
            //                {
            //                    nM1.podNodes = rez2;
            //                    nM1.brojPodZapisa =nM1.brojZapisa + rez2.Sum(yyyy => yyyy.brojZapisa);
            //                    //nM1.hasChildren = true;
            //                }
            //            }

            //        }
            //    }

            //    List<nodesModel> realKopy = zzz.FindAll(
            //    delegate(nodesModel bk)
            //    {
            //        return bk.Nivo == 1;
            //    }
            //    );


            //    return realKopy;

            //}

            [HttpGet]
            public IQueryable<vw_T_Sakupljaci> vw_T_Sakupljaci()
            {
                var customers = _contextProvider.Context.vw_T_Sakupljaci;
                return customers;
            }

            [HttpGet]
            public IQueryable<tbl_T_Sakupljaci> tbl_T_Sakupljaci()
            {
                var customers = _contextProvider.Context.tbl_T_Sakupljaci;
                return customers;
            }


            [HttpGet]
            public IQueryable<tbl_T_Smjestaj_stalni> tbl_T_Smjestaj_stalni()
            {
                var customers = _contextProvider.Context.tbl_T_Smjestaj_stalni;
                return customers;
            }

            [HttpGet]
            public IQueryable<tbl_T_Smjestaj_privremeni> tbl_T_Smjestaj_privremeni()
            {
                var customers = _contextProvider.Context.tbl_T_Smjestaj_privremeni;
                return customers;
            }

            [HttpGet]
            public IQueryable<tbl_T_Smjestaj_privremeni_vrsta> tbl_T_Smjestaj_privremeni_vrsta()
            {
                var customers = _contextProvider.Context.tbl_T_Smjestaj_privremeni_vrsta;
                return customers;
            }


            [HttpGet]
            public IQueryable<tbl_T_Ocuvanosti> tbl_T_Ocuvanosti()
            {
                var customers = _contextProvider.Context.tbl_T_Ocuvanosti;
                return customers;

            }

            [HttpGet]
            public IQueryable<tbl_Ocuvanost> tbl_Ocuvanost()
            {
                var customers = _contextProvider.Context.tbl_Ocuvanost;
                return customers;

            }


            [HttpGet]
            public IQueryable<tbl_T_Pribavljanje> tbl_T_Pribavljanje()
            {
                var customers = _contextProvider.Context.tbl_T_Pribavljanje;
                return customers;

            }

            [HttpGet]
            public IQueryable<tbl_T_Valute> tbl_T_Valute()
            {
                var customers = _contextProvider.Context.tbl_T_Valute;
                return customers;

            }



            [HttpGet]
            public IQueryable<vw_Kartica> ImeZbirke()
            {
                var customers = _contextProvider.Context.vw_Kartica;
                return customers;

            }





        /// <summary>
        /// izvori nabave  T u vw_T
        /// </summary>
        /// <returns></returns>
 
            [HttpGet]
            public IQueryable<vw_T_Izvori_nabave> vw_T_Izvori_nabave()
            {
                var customers = _contextProvider.Context.vw_T_Izvori_nabave;
                return customers;

            }

            [HttpGet]
            public IQueryable<tbl_T_Izvori_nabave> tbl_T_Izvori_nabave()
            {
                var customers = _contextProvider.Context.tbl_T_Izvori_nabave;
                return customers;

            }

            [HttpGet]
            public IQueryable<tbl_Def_Forme> tbl_Def_Forme()
            {
                var customers = _contextProvider.Context.tbl_Def_Forme;
                return customers;

            }
            [HttpGet]
            public IQueryable<tbl_T_Nacini_prikupljanja> tbl_T_Nacini_prikupljanja()
            {
                var customers = _contextProvider.Context.tbl_T_Nacini_prikupljanja;
                return customers;

            }

            [HttpGet]
            public IQueryable<tbl_T_Nalaziste> tbl_T_Nalaziste()
            {
                var customers = _contextProvider.Context.tbl_T_Nalaziste;
                return customers;

            }

            [HttpGet]
            public IQueryable<vw_T_Autori> vw_T_Autori()
            
            {
                var customers = _contextProvider.Context.vw_T_Autori;
                return customers;
                
            }


            [HttpGet]
            public List<tbl_Parametri_za_korisnike> Parametri_za_korisnika()
            {
                //var tmpABT = new AccountsByTxt();
                string userName = AccountsByTxt.getUserName();
                var customers = _contextProvider.Context.tbl_Parametri_za_korisnike.Where(k => k.Korisnik_UserName == "KOD").ToList();
                var customers2 = _contextProvider.Context.tbl_Parametri_za_korisnike.Where(k => k.Korisnik_UserName == userName).ToList();
                foreach(var c in customers2)
                {
                    if (customers.Any(f => f.Parametar.ToUpper() == c.Parametar.ToUpper()))
                    {
                        var cTemp = customers.First(f => f.Parametar.ToUpper() == c.Parametar.ToUpper());
                        customers.Remove(cTemp);
                    }
                    customers.Add(c);
                }

                return customers;

            }


            [HttpGet]
            public IQueryable<tbl_Parametri_za_korisnike> tbl_Parametri_za_korisnike()
            {
                var customers = _contextProvider.Context.tbl_Parametri_za_korisnike;
                return customers;

            }


            [HttpGet]
            public object upitAutori()
            {
                var customers = _contextProvider.Context.vw_T_Autori.OrderBy(y=>y.Pojam);
                return customers;

            }


            [HttpGet]
            public object DefStruktura()
            {
                string[] table={"tbl_T_Mjesta","tbl_T_Materijali","tbl_T_Nazivi","tbl_T_Tehnike"};
                int[] idtz = { 131, 204, 191, 118, 300, 462, 116, 299, 193, 188, 187, 185, 298, 117, 186, 190,132,5555,146,183 };
                var defstruktura = _contextProvider.Context.tbl_Def_Struktura_plus.Where(c => idtz.Contains(c.IDT)).Select(c => new { c.IDT, c.Pojam, c.Naziv, c.T_Tbl, c.Tablica,c.Napomena }).OrderBy(c=> c.Pojam);
                return defstruktura;
            }


           [HttpGet]
            public IQueryable<tbl_Kartica> tbl_Kartica()
            {
                
                var kartica = _contextProvider.Context.tbl_Kartica.Include(t=> t.tbl_Inventarizacija)
                                                                  .Include(t=> t.tbl_Izrada)
                                                                  .Include(t => t.tbl_Kataloska_jedinica)
                                                                  .Include(t => t.tbl_Kljucne_rijeci)
                                                                  .Include(t => t.tbl_Media_collector)
                                                                  .Include(t => t.tbl_Mjere)
                                                                  .Include(t => t.tbl_Naslovi)
                                                                  .Include(t => t.tbl_Nazivi)
                                                                  .Include(t => t.tbl_Ocuvanost)
                                                                  .Include(t => t.tbl_Sadrzaj)
                                                                  .Include(t => t.tbl_U_Materijali_u_dijelovima);
                return kartica;
            }


           [HttpGet]
           public IQueryable<tbl_Kartica> FullKartica()
           {
               var kartica = _contextProvider.Context.tbl_Kartica.Include("tbl_Izrada").Include("tbl_Nazivi").Include("tbl_Naslovi").Include("tbl_Mjere").Include("tbl_U_Materijali_u_dijelovima").Include("tbl_Kataloska_jedinica").Include("tbl_Media_collector").Include("tbl_Sadrzaj");
               return kartica;
           }



            [HttpGet]
            public IQueryable<tbl_Izrada> tbl_Izrada()
            {
                var izrada = _contextProvider.Context.tbl_Izrada.Include("tbl_T_Mjesta").Include("tbl_T_Autori");
                return izrada;
            }

            [HttpGet]
            public IQueryable<tbl_Media_collector> tbl_Media_collector()
            {
                var media = _contextProvider.Context.tbl_Media_collector;
                return media;
            }



            [HttpGet]
            public IQueryable<tbl_Mjere> tbl_Mjere()
            {
                var mjere = _contextProvider.Context.tbl_Mjere;
                return mjere;
            }

            [HttpGet]
            public IQueryable<tbl_Naslovi> tbl_Naslovi()
            {
                var nazivi = _contextProvider.Context.tbl_Naslovi;
                return nazivi;
            }

            [HttpGet]
            public IQueryable<tbl_Nazivi> tbl_Nazivi()
            {
                var nazivi = _contextProvider.Context.tbl_Nazivi;
                return nazivi;
            }

            [HttpGet]
            public IQueryable<tbl_U_Materijali_u_dijelovima> tbl_U_Materijali_u_dijelovima()
            {
                var nazivi = _contextProvider.Context.tbl_U_Materijali_u_dijelovima;
                return nazivi;
            }


            [HttpGet]
            public IQueryable<tbl_Inventarizacija> tbl_Inventarizacija()
            {
                var dimenzije = _contextProvider.Context.tbl_Inventarizacija;
                return dimenzije;
            }

            [HttpGet]
            public IQueryable<vw_T_Kustosi> vw_T_Kustosi()
            {
                var dimenzije = _contextProvider.Context.vw_T_Kustosi;
                return dimenzije;
            }


            [HttpGet]
            public IQueryable<tbl_Vrijednosti> tbl_Vrijednosti()
            {
                var dimenzije = _contextProvider.Context.tbl_Vrijednosti;
                return dimenzije;
            }

            [HttpGet]
            public IQueryable<tbl_Sadrzaj> tbl_Sadrzaj()
            {
                var dimenzije = _contextProvider.Context.tbl_Sadrzaj;
                return dimenzije;
            }

 

            [HttpGet]
            public IQueryable<tbl_Kataloska_jedinica> tbl_Kataloska_jedinica()
            {
                var dimenzije = _contextProvider.Context.tbl_Kataloska_jedinica;
                return dimenzije;
            }

            [HttpGet]
            public IQueryable<tbl_Knjiga_ulaska> tbl_Knjiga_ulaska()
            {
                var dimenzije = _contextProvider.Context.tbl_Knjiga_ulaska;
                return dimenzije;
            }


            [HttpGet]
            public IQueryable<tbl_Natpisi_i_oznake> tbl_Natpisi_i_oznake()
            {
                var dimenzije = _contextProvider.Context.tbl_Natpisi_i_oznake;
                return dimenzije;
            }



            [HttpGet]
            public IQueryable<tbl_Pripadnosti> tbl_Pripadnosti()
            {
                var dimenzije = _contextProvider.Context.tbl_Pripadnosti;
                return dimenzije;
            }

            [HttpGet]
            public IQueryable<tbl_Reference> tbl_Reference()
            {
                var dimenzije = _contextProvider.Context.tbl_Reference;
                return dimenzije;
            }

            [HttpGet]
            public IQueryable<tbl_Kljucne_rijeci> tbl_Kljucne_rijeci()
            {
                var dimenzije = _contextProvider.Context.tbl_Kljucne_rijeci;
                return dimenzije;
            }


            [HttpGet]
            public IQueryable<tbl_T_Dimenzije> tbl_T_Dimenzije()
            {
                var dimenzije = _contextProvider.Context.tbl_T_Dimenzije.OrderBy(d => d.Pojam);
                return dimenzije;
            }

            [HttpGet]
            public IQueryable<tbl_T_Dijelovi> tbl_T_Dijelovi()
            {
                var dijelovi = _contextProvider.Context.tbl_T_Dijelovi.OrderBy(d => d.Pojam);
                return dijelovi;
            }

            [HttpGet]
            public IQueryable<tbl_T_Jedinice_Mjere> tbl_T_Jedinice_Mjere()
            {
                var jedinice = _contextProvider.Context.tbl_T_Jedinice_Mjere.OrderBy(d => d.Pojam);
                return jedinice;
            }

            [HttpGet]
            public IQueryable<tbl_T_Zbirke> tbl_T_Zbirke()
            {
                var zbirke = _contextProvider.Context.tbl_T_Zbirke.OrderBy(d => d.Pojam);
                return zbirke;
            }

            [HttpGet]
            public IQueryable<tbl_T_Vrste_naziva> tbl_T_Vrste_naziva()
            {
                var vrste_naziva = _contextProvider.Context.tbl_T_Vrste_naziva.OrderBy(d => d.Pojam);
                return vrste_naziva;
            }

            [HttpGet]
            public IQueryable<tbl_T_Kljucne_rijeci> tbl_T_Kljucne_rijeci()
            {
                var kljucne_rijeci = _contextProvider.Context.tbl_T_Kljucne_rijeci.OrderBy(d => d.Pojam);
                return kljucne_rijeci;
            }

            [HttpGet]
            public IQueryable<tbl_T_Vrste_naslova> tbl_T_Vrste_naslova()
            {
                var vrste_naslova = _contextProvider.Context.tbl_T_Vrste_naslova.OrderBy(d => d.Pojam);
                return vrste_naslova;
            }

            [HttpGet]
            public IQueryable<tbl_T_Vrste_odgovornosti> tbl_T_Vrste_odgovornosti()
            {
                var vrste_odgovornosti = _contextProvider.Context.tbl_T_Vrste_odgovornosti.OrderBy(d => d.Pojam);
                return vrste_odgovornosti;
            }

            [HttpGet]
            public IQueryable<tbl_T_Uloge_autora> tbl_T_Uloge_autora()
            {
                var uloge_autora = _contextProvider.Context.tbl_T_Uloge_autora.OrderBy(d => d.Pojam);
                return uloge_autora;
            }

            [HttpGet]
            public IQueryable<tbl_T_Jezici> tbl_T_Jezici()
            {
                var jezici = _contextProvider.Context.tbl_T_Jezici.OrderBy(d => d.Pojam);
                return jezici;
            }

            [HttpGet]
            public IQueryable<tbl_T_Materijali> tbl_T_Materijali()
            {
                var materijali = _contextProvider.Context.tbl_T_Materijali.OrderBy(d => d.Pojam);
                return materijali;
            }

            [HttpGet]
            public IQueryable<tbl_T_Tehnike> tbl_T_Tehnike()
            {
                var tehnike = _contextProvider.Context.tbl_T_Tehnike.OrderBy(d => d.Pojam);
                return tehnike;
            }


            [HttpGet]
            public IQueryable<tbl_T_Mjesta> tbl_T_Mjesta()
            {
                var mjesta = _contextProvider.Context.tbl_T_Mjesta.Include("tbl_T_Mjesta1").OrderBy(d => d.Pojam);
                return mjesta;
            }

            [HttpGet]
            public IQueryable<tbl_T_Nazivi> tbl_T_Nazivi()
            {
                var nazivi = _contextProvider.Context.tbl_T_Nazivi.OrderBy(d => d.Pojam);
                return nazivi;
            }

//sadrzaj
            [HttpGet]
            public IQueryable<tbl_T_Sadrzaj_predmet> tbl_T_Sadrzaj_predmet()
            {
                var sadrzaj = _contextProvider.Context.tbl_T_Sadrzaj_predmet.OrderBy(d => d.Pojam);
                return sadrzaj;
            }

            [HttpGet]
            public IQueryable<tbl_T_Vremenske_odrednice> tbl_T_Vremenske_odrednice()
            {
                var sadrzaj = _contextProvider.Context.tbl_T_Vremenske_odrednice.OrderBy(d => d.Pojam);
                return sadrzaj;
            }

            [HttpGet]
            public IQueryable<tbl_T_Vrste_sadrzaja> tbl_T_Vrste_sadrzaja()
            {
                var sadrzaj = _contextProvider.Context.tbl_T_Vrste_sadrzaja.Where(d => d.Sort > 0).OrderBy(d => d.Sort);
                return sadrzaj;
            }

            [HttpGet]
            public IQueryable<vw_T_Osobe_i_inst_odrednice> vw_T_Osobe_i_inst_odrednice()
            {
                var sadrzaj = _contextProvider.Context.vw_T_Osobe_i_inst_odrednice.OrderBy(y => y.Pojam);
                return sadrzaj;
            }


         
          //public object Liste()
          //  {
          //      var dimenzije = _contextProvider.Context.tbl_T_Dimenzije.OrderBy(d=>d.Pojam).Select(d=> new {d.IDT,d.Pojam});
          //      var dijelovi = _contextProvider.Context.tbl_T_Dijelovi.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam });
          //      var jedinice = _contextProvider.Context.tbl_T_Jedinice_Mjere.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam });
          //      var zbirke = _contextProvider.Context.tbl_T_Zbirke.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam });
          //      var vrste_naziva = _contextProvider.Context.tbl_T_Vrste_naziva.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam });
          //      var vrste_naslova = _contextProvider.Context.tbl_T_Vrste_naslova.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam });
          //      var vrste_odgovornosti = _contextProvider.Context.tbl_T_Vrste_odgovornosti.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam });
          //      var uloge_autora = _contextProvider.Context.tbl_T_Uloge_autora.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam });
          //      var jezici = _contextProvider.Context.tbl_T_Jezici.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam });
          //      var materijali = _contextProvider.Context.tbl_T_Materijali.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam });
          //      var tehnike = _contextProvider.Context.tbl_T_Tehnike.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam });
          //      var mjesta = _contextProvider.Context.tbl_T_Mjesta.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam });
          //      var nazivi = _contextProvider.Context.tbl_T_Nazivi.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam });
          //      return new { dimenzije, dijelovi, jedinice, zbirke, vrste_naslova, vrste_naziva, vrste_odgovornosti, uloge_autora, jezici, materijali, tehnike, mjesta, nazivi };
          //  }
            [HttpGet]
            public object ListeLight()
            {

                // { 'dIme': 'zbirke', 'ime': 'Zbirke', 'izvor': 'tbl_T_Zbirke' },
                //{ 'dIme': 'jedinice', 'ime': 'Jedinice', 'izvor': 'tbl_T_Jedinice_mjere' },
                //{ 'dIme': 'dijelovi', 'ime': 'Dijelovi', 'izvor': 'tbl_T_Dijelovi' },
                //{ 'dIme': 'vrste_naziva', 'ime': 'Vrste_naziva', 'izvor': 'tbl_T_Vrste_naziva' },
                //{ 'dIme': 'vrste_naslova', 'ime': 'Vrste_naslova', 'izvor': 'tbl_T_Vrste_naslova' },
                //{ 'dIme': 'vrste_odgovornosti', 'ime': 'Vrste_odgovornosti', 'izvor': 'tbl_T_Vrste_odgovornosti' },
                //{ 'dIme': 'uloge_autora', 'ime': 'Uloge_autora', 'izvor': 'tbl_T_Uloge_Autora' },
                //{ 'dIme': 'jezici', 'ime': 'Jezici', 'izvor': 'tbl_T_Jezici' },
                //{ 'dIme': 'materijali', 'ime': 'Materijali', 'izvor': 'tbl_T_Materijali' },
                //{ 'dIme': 'tehnike', 'ime': 'Tehnike', 'izvor': 'tbl_T_Tehnike' },
                //{ 'dIme': 'mjesta', 'ime': 'Mjesta', 'izvor': 'tbl_T_Mjesta' },
                //{ 'dIme': 'nazivi', 'ime': 'Nazivi', 'izvor': 'tbl_T_Nazivi' },
                //{ 'dIme': 'sadrzaj_predmet', 'ime': 'Sadrzaj_predmet', 'izvor': 'tbl_T_Sadrzaj_predmet' },
                //{ 'dIme': 'vrste_sadrzaja', 'ime': 'Vrste_sadrzaja', 'izvor': 'tbl_T_Vrste_sadrzaja' },
                //{ 'dIme': 'vremenske_odrednice', 'ime': 'Vremenske_odrednice', 'izvor': 'tbl_T_Vremenske_odrednice' },
                //{ 'dIme': 'osobe_i_inst_odrednice', 'ime': 'Osobe_i_inst_odrednice', 'izvor': 'vw_T_Osobe_i_inst_odrednice' },
                //{ 'dIme': 'sakupljaci', 'ime': 'Sakupljaci', 'izvor': 'vw_T_Sakupljaci' },
                //{ 'dIme': 'nacini_prikupljanja', 'ime': 'Nacini_prikupljanja', 'izvor': 'tbl_T_Nacini_prikupljanja' },
                //{ 'dIme': 'nalaziste', 'ime': 'Nalaziste', 'izvor': 'tbl_T_Nalaziste' },
                //{ 'dIme': 'kljucne_rijeci', 'ime': 'Kljucne_rijeci', 'izvor': 'tbl_T_Kljucne_rijeci' },
                //{ 'dIme': 'dimenzije', 'ime': 'Dimenzije', 'izvor': 'tbl_T_Dimenzije' }];
                var jedinice = _contextProvider.Context.tbl_T_Jedinice_Mjere.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam,d.Nad_IDT });
                var dijelovi = _contextProvider.Context.tbl_T_Dijelovi.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam,d.Nad_IDT });
                var vrste_naziva = _contextProvider.Context.tbl_T_Vrste_naziva.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam,d.Nad_IDT });
                var vrste_naslova = _contextProvider.Context.tbl_T_Vrste_naslova.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam,d.Nad_IDT });
                var vrste_odgovornosti = _contextProvider.Context.tbl_T_Vrste_odgovornosti.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam,d.Nad_IDT });
                var uloge_autora = _contextProvider.Context.tbl_T_Uloge_autora.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam,d.Nad_IDT });
                var jezici = _contextProvider.Context.tbl_T_Jezici.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam,d.Nad_IDT });
                var materijali = _contextProvider.Context.tbl_T_Materijali.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam,d.Nad_IDT });
                var tehnike = _contextProvider.Context.tbl_T_Tehnike.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam,d.Nad_IDT });
                var mjesta = _contextProvider.Context.tbl_T_Mjesta.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam,d.Nad_IDT });
                var nazivi = _contextProvider.Context.tbl_T_Nazivi.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam,d.Nad_IDT });
                var sadrzaj_predmet = _contextProvider.Context.tbl_T_Sadrzaj_predmet.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam,d.Nad_IDT });
                var vremenske_odrednice = _contextProvider.Context.tbl_T_Vremenske_odrednice.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam,d.Nad_IDT });
                var osobe_i_inst_odrednice = _contextProvider.Context.vw_T_Osobe_i_inst_odrednice.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam,d.Nad_IDT });
                var sakupljaci = _contextProvider.Context.vw_T_Sakupljaci.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam,d.Nad_IDT });
                var nacini_prikupljanja = _contextProvider.Context.tbl_T_Nacini_prikupljanja.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam,d.Nad_IDT });
                var nalaziste = _contextProvider.Context.tbl_T_Nalaziste.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam,d.Nad_IDT });
                var kljucne_rijeci = _contextProvider.Context.tbl_T_Kljucne_rijeci.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam,d.Nad_IDT });
                var dimenzije = _contextProvider.Context.tbl_T_Dimenzije.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam,d.Nad_IDT });
                var zbirke = _contextProvider.Context.tbl_T_Zbirke.OrderBy(d => d.Pojam).Select(d => new { d.IDT, d.Pojam, d.Nad_IDT });
                return new
                {
                    zbirke,
                    dimenzije,
                    dijelovi,
                    jedinice,
                    vrste_naslova,
                    vrste_naziva,
                    vrste_odgovornosti,
                    uloge_autora,
                    jezici,
                    materijali,
                    tehnike,
                    mjesta,
                    nazivi,
                    sadrzaj_predmet,
                    vremenske_odrednice,
                    osobe_i_inst_odrednice,
                    nacini_prikupljanja,
                    nalaziste,
                    kljucne_rijeci
                };
            }  


        [HttpGet]
         public object Liste()
         {

                       // { 'dIme': 'zbirke', 'ime': 'Zbirke', 'izvor': 'tbl_T_Zbirke' },
                       //{ 'dIme': 'jedinice', 'ime': 'Jedinice', 'izvor': 'tbl_T_Jedinice_mjere' },
                       //{ 'dIme': 'dijelovi', 'ime': 'Dijelovi', 'izvor': 'tbl_T_Dijelovi' },
                       //{ 'dIme': 'vrste_naziva', 'ime': 'Vrste_naziva', 'izvor': 'tbl_T_Vrste_naziva' },
                       //{ 'dIme': 'vrste_naslova', 'ime': 'Vrste_naslova', 'izvor': 'tbl_T_Vrste_naslova' },
                       //{ 'dIme': 'vrste_odgovornosti', 'ime': 'Vrste_odgovornosti', 'izvor': 'tbl_T_Vrste_odgovornosti' },
                       //{ 'dIme': 'uloge_autora', 'ime': 'Uloge_autora', 'izvor': 'tbl_T_Uloge_Autora' },
                       //{ 'dIme': 'jezici', 'ime': 'Jezici', 'izvor': 'tbl_T_Jezici' },
                       //{ 'dIme': 'materijali', 'ime': 'Materijali', 'izvor': 'tbl_T_Materijali' },
                       //{ 'dIme': 'tehnike', 'ime': 'Tehnike', 'izvor': 'tbl_T_Tehnike' },
                       //{ 'dIme': 'mjesta', 'ime': 'Mjesta', 'izvor': 'tbl_T_Mjesta' },
                       //{ 'dIme': 'nazivi', 'ime': 'Nazivi', 'izvor': 'tbl_T_Nazivi' },
                       //{ 'dIme': 'sadrzaj_predmet', 'ime': 'Sadrzaj_predmet', 'izvor': 'tbl_T_Sadrzaj_predmet' },
                       //{ 'dIme': 'vrste_sadrzaja', 'ime': 'Vrste_sadrzaja', 'izvor': 'tbl_T_Vrste_sadrzaja' },
                       //{ 'dIme': 'vremenske_odrednice', 'ime': 'Vremenske_odrednice', 'izvor': 'tbl_T_Vremenske_odrednice' },
                       //{ 'dIme': 'osobe_i_inst_odrednice', 'ime': 'Osobe_i_inst_odrednice', 'izvor': 'vw_T_Osobe_i_inst_odrednice' },
                       //{ 'dIme': 'sakupljaci', 'ime': 'Sakupljaci', 'izvor': 'vw_T_Sakupljaci' },
                       //{ 'dIme': 'nacini_prikupljanja', 'ime': 'Nacini_prikupljanja', 'izvor': 'tbl_T_Nacini_prikupljanja' },
                       //{ 'dIme': 'nalaziste', 'ime': 'Nalaziste', 'izvor': 'tbl_T_Nalaziste' },
                       //{ 'dIme': 'kljucne_rijeci', 'ime': 'Kljucne_rijeci', 'izvor': 'tbl_T_Kljucne_rijeci' },
                       //{ 'dIme': 'dimenzije', 'ime': 'Dimenzije', 'izvor': 'tbl_T_Dimenzije' }];
             var jedinice = _contextProvider.Context.tbl_T_Jedinice_Mjere.OrderBy(d => d.Pojam);
             var dijelovi = _contextProvider.Context.tbl_T_Dijelovi.OrderBy(d => d.Pojam);
             var vrste_naziva = _contextProvider.Context.tbl_T_Vrste_naziva.OrderBy(d => d.Pojam);
             var vrste_naslova = _contextProvider.Context.tbl_T_Vrste_naslova.OrderBy(d => d.Pojam);
             var vrste_odgovornosti = _contextProvider.Context.tbl_T_Vrste_odgovornosti.OrderBy(d => d.Pojam);
             var uloge_autora = _contextProvider.Context.tbl_T_Uloge_autora.OrderBy(d => d.Pojam);
             var jezici = _contextProvider.Context.tbl_T_Jezici.OrderBy(d => d.Pojam);
             var materijali = _contextProvider.Context.tbl_T_Materijali.OrderBy(d => d.Pojam);
             var tehnike = _contextProvider.Context.tbl_T_Tehnike.OrderBy(d => d.Pojam);
             var mjesta = _contextProvider.Context.tbl_T_Mjesta.OrderBy(d => d.Pojam);
             var nazivi = _contextProvider.Context.tbl_T_Nazivi.OrderBy(d => d.Pojam);
             var sadrzaj_predmet = _contextProvider.Context.tbl_T_Sadrzaj_predmet.OrderBy(d => d.Pojam);
             var vremenske_odrednice = _contextProvider.Context.tbl_T_Vremenske_odrednice.OrderBy(d => d.Pojam);
             var osobe_i_inst_odrednice = _contextProvider.Context.vw_T_Osobe_i_inst_odrednice.OrderBy(d => d.Pojam);
             var sakupljaci = _contextProvider.Context.vw_T_Sakupljaci.OrderBy(d => d.Pojam);
             var nacini_prikupljanja = _contextProvider.Context.tbl_T_Nacini_prikupljanja.OrderBy(d => d.Pojam);
             var nalaziste = _contextProvider.Context.tbl_T_Nalaziste.OrderBy(d => d.Pojam);
             var kljucne_rijeci = _contextProvider.Context.tbl_T_Kljucne_rijeci.OrderBy(d => d.Pojam);
             var dimenzije = _contextProvider.Context.tbl_T_Dimenzije.OrderBy(d => d.Pojam);
            // var zbirke = _contextProvider.Context.tbl_T_Zbirke.OrderBy(d => d.Pojam);
             return new { dimenzije,
                            dijelovi,
                            jedinice,
            //                zbirke,
                            vrste_naslova,
                            vrste_naziva,
                            vrste_odgovornosti,
                            uloge_autora,
                            jezici,
                            materijali,
                            tehnike,
                            mjesta,
                            nazivi,
                            sadrzaj_predmet,
                            vremenske_odrednice,
                            osobe_i_inst_odrednice,
                            nacini_prikupljanja,
                            nalaziste,
                            kljucne_rijeci
             };
         }

            // ~/breeze/Zza/SaveChanges
            [HttpPost]
            public SaveResult SaveChanges(JObject saveBundle)
            {
                return _contextProvider.SaveChanges(saveBundle);
            }
       
    }
}