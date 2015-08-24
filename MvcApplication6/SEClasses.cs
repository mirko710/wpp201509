using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Configuration;
using System.Web.Script.Serialization;


namespace WMpp
{

    public class SEClasses
    {
        public static List<upitiDefinicije> upitiPravilaM = new List<upitiDefinicije>();
        public static List<upitiDefinicije> upitiPravilaS = new List<upitiDefinicije>();
        public static List<defStrukt> poljaUpit = new List<defStrukt>();
        public static int brojParametara = 0;
        public static List<SqlParameter> parametriZaUpit = new List<SqlParameter>();
        public static Guid currentSifra = new Guid();

        public static string sessID = "";


        public class homeTreeZbirke
        {
            public homeTreeZbirke()
            {
            }
            public homeTreeZbirke(SqlDataReader dr)
            {
                setData(dr);
            }

            public int IDT { get; set; }
            public int brojZapisa { get; set; }
            public int brojPodZapisa { get; set; }
            public int prviZapis { get; set; }
            public int zadnjiZapis { get; set; }
            public string Pojam { get; set; }
            public Nullable<int> Nad_IDT { get; set; }
            public virtual List<homeTreeZbirke> podNodes { get; set; }

            public void setData(SqlDataReader dr)
            {
                this.Pojam = dr["Pojam"].ToString();
                //this.Nad_IDT = dr.GetInt32(dr.GetOrdinal("Nad_IDT"));
                if (dr.IsDBNull(dr.GetOrdinal("Nad_IDT")))
                {
                    this.Nad_IDT = null;
                }
                else
                {
                    this.Nad_IDT = dr.GetInt32(dr.GetOrdinal("Nad_IDT"));
                }

                if (dr.IsDBNull(dr.GetOrdinal("prvi")))
                {
                    this.prviZapis = -1;
                }
                else
                {
                    this.prviZapis = dr.GetInt32(dr.GetOrdinal("prvi"));
                }

                if (dr.IsDBNull(dr.GetOrdinal("zadnji")))
                {
                    this.zadnjiZapis = -1;
                }
                else
                {
                    this.zadnjiZapis = dr.GetInt32(dr.GetOrdinal("zadnji"));
                }

                if (dr.IsDBNull(dr.GetOrdinal("zbroj")))
                {
                    this.brojZapisa = 0;
                }
                else
                {
                    this.brojZapisa = dr.GetInt32(dr.GetOrdinal("zbroj"));
                }


                //this.prviZapis = dr.GetInt32(dr.GetOrdinal("prvi"));
                // this.zadnjiZapis = dr.GetInt32(dr.GetOrdinal("zadnji"));
                //this.brojZapisa = dr.GetInt32(dr.GetOrdinal("zbroj"));
                this.IDT = dr.GetInt32(dr.GetOrdinal("IDT"));
            }

        }

        public class zaRegistraciju
        {
            public int KRT_IDT_Zbirka { get; set; }
            public int ID_Broj { get; set; }
            public string KRT_Inventarni_broj { get; set; }
            public bool imaDataciju { get; set; }
            public bool imaFotku { get; set; }
            public bool imaAutora { get; set; }
            public bool imaMjesta { get; set; }
            public bool imaNaziv { get; set; }
            public bool imaNaslov { get; set; }
            public bool imaMjera { get; set; }
            public bool imaMaterijala { get; set; }

        }

        public class saveUpit
        {
            public int ID { get; set; }
            public Guid sifra { get; set; }
            public string ime { get; set; }
            public string opis { get; set; }
            public upiti[] upiti { get; set; }
        }


        public class upitiDefinicije
        {
            public upitiDefinicije()
            {
            }

            public upitiDefinicije(SqlDataReader dr)
            {
                setData(dr);
            }
            public int poljeIDT { get; set; }
            public string Soperator { get; set; }
            public string funkVrijednost { get; set; }
            public string fullString { get; set; }
            public string fullStringNE { get; set; }
            public string poljeIme { get; set; }
            public string tablica { get; set; }
            public string preString { get; set; }
            public string postString { get; set; }
            public int kojaVrijednost { get; set; }

            public void setData(SqlDataReader dr)
            {
                this.fullString = dr["fullString"].ToString();
                this.fullStringNE = dr["fullStringNE"].ToString();
                this.funkVrijednost = dr["funkVrijednost"].ToString();
                this.poljeIme = dr["poljeIme"].ToString();
                this.postString = dr["postString"].ToString();
                this.preString = dr["preString"].ToString();
                this.Soperator = dr["operator"].ToString();
                this.poljeIDT = dr.GetInt32(dr.GetOrdinal("poljeIDT"));
                this.tablica = dr["tablica"].ToString();
                this.kojaVrijednost = dr.GetInt32(dr.GetOrdinal("kojaVrijednost"));
            }

        }

        public class refinerModel
        {
            public string title { get; set; }
            public string filter { get; set; }
            public string template { get; set; }
            public int fieldIDT { get; set; }
        };

        public class defStrukt
        {
            public int IDT { get; set; }
            public string Pojam { get; set; }
            public string Naziv { get; set; }
            public string T_Tbl { get; set; }
            public string Tablica { get; set; }
            public string Napomena { get; set; }
            public string ime { get; set; }
        }

        public class termDropDown
        {
            public int IDT { get; set; }
            public int? Nad_IDT { get; set; }
            public string Pojam { get; set; }
        }


        public class termDropDownJQ
        {
            public int value { get; set; }
            public string actualValue { get; set; }
            public string label { get; set; }
        }

        public class navigacijaDropDown
        {
            public int ID_Broj { get; set; }
            public string KRT_Inventarni_broj { get; set; }
            //public int KRT_IDT_Zbirka { get; set; }
        }

        public class podzapisiHelper
        {
            public string sifra { get; set; }
            public string tablica { get; set; }
            public int? IDT { get; set; }
        }


        public class defVrijeme
        {
            public string DFV_Opis {get; set;}
            public string DFV_St_od {get; set;}
            public string DFV_St_do {get; set;}
            public string DFV_G_od {get; set;}
            public string DFV_G_do {get; set;}
            public Boolean DFV_St_plus {get; set;}
            public string DFV_Mj_od {get; set;}
            public string DFV_Mj_do {get; set;}
            public Boolean Vidljiv { get; set; }
        }

        public class rezultatiSEK
        {
            public int ID { get; set; }
            public string SEK_Inventarna_oznaka { get; set; }
            public string SEK_Godina { get; set; }
            public string SEK_Naslov { get; set; }
            public string SEK_Identifikator { get; set; }
            public string Pojam { get; set; }
            public string MC_Staza_slike { get; set; }
            public string SEK_Sort_Inv_br { get; set; }
            public int SEK_IDT_Fond { get; set; }
            public string Datacija { get; set; }
            public string Autori { get; set; }
            public string izdavac { get; set; }
            public string publikacija { get; set; }
            public string vrsta_izdanja { get; set; }
            public string vrsta_clanka { get; set; }
            public string vrsta_dokumentacije { get; set; }
            public string medij { get; set; }
            public string format { get; set; }
            public string VIZ_Predmet_snimanja { get; set; }
            public string VIZ_Trajanje_priloga { get; set; }
        }

        public class  rezultati
        {
            public int ID_Broj { get; set; }
            public string KRT_Inventarni_broj { get; set; }
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
            public string Mat { get; set; }
            public string teh { get; set; }
            public string kataloskaJedinica { get; set; }
            public bool odabrano { get; set; }

        }

        public class getPage
        {
            public int pageSize { get; set; }
            public int pageIndex { get; set; }
            public System.Guid sifra { get; set; }

        }

        public class praviUpitTip
        {
            public upiti[] upiti { get; set; }
            public string staraSifra { get; set; }
            public int pageSize { get; set; }
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
            public string Pojam { get; set; }
            public int? IDT { get; set; }
            public int? brojZapisa { get; set; }
        }

        public class doubleLoad
        {
            public virtual ICollection<rezultati> part1 { get; set; }
            public virtual ICollection<refiner> part2 { get; set; }
            public int brojZapisa { get; set; }
            public System.Guid sifra { get; set; }
        }

        public class doubleLoadSEK
        {
            public virtual ICollection<rezultatiSEK> part1 { get; set; }
            public virtual ICollection<refiner> part2 { get; set; }
            public int brojZapisa { get; set; }
            public System.Guid sifra { get; set; }
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
            public string vrijednost4 { get; set; }
            public string upitOperator { get; set; }
            public string redOperator { get; set; }
            public int? combo { get; set; }
            public string mjereRedak { get; set; }
            public string vrijemeRedak { get; set; }
            public Boolean podZapisi { get; set; }
            public string zagradaOtvorena { get; set; }
            public string zagradaZatvorena { get; set; }
        }
        //        this.poljeIDT = ko.observable(null);
        //this.polje = ko.observable(null);
        //this.tablica = ko.observable(null);
        //this.vrijednost1 = ko.observable(null);
        //this.vrijednost2 = ko.observable(null);
        //this.vrijednost3 = ko.observable(null);
        //this.vrijednost4 = ko.observable(null);
        //this.term = ko.observableArray([]);   ///MAKNUT
        //this.termTablica = ko.observable(null); //dodat u kodu
        //this.upitOperator = ko.observable("=");
        //this.redOperatorOld = ko.observable(true);//maknut
        //this.redOperator = ko.observable(' AND ');
        //this.operatori = ko.observableArray([]); //dodat u kodu
        //this.combo = ko.observable(1);
        //this.podZapisi = ko.observable(false);
        //this.vrijemeRedak = ko.observable(null);
        //this.mjereRedak = ko.observable(null);
        //this.zagradaOtvorena= ko.observable(null);
        //this.zagradaZatvorena=ko.observable(null);


        public List<homeTreeZbirke> GetZbirkeZaHome(string conn)
        {
            var zbirke = new List<homeTreeZbirke>();
            using (SqlConnection scon = new SqlConnection(conn))
            {
                using (SqlCommand scom = new SqlCommand())
                {
                    scom.Connection = scon;
                    scon.Open();
                    scom.CommandText = "Select * from dbo.vw_Zbirke_prva_zadnja_zbroj_novo order by Pojam";
                    SqlDataReader dr = scom.ExecuteReader();
                    while (dr.Read())
                    {
                        var tmp = new homeTreeZbirke(dr);

                        zbirke.Add(tmp);
                    }
                }
            }
            //sredi podzbirke


            zbirke=srediPodZbirke(zbirke);


            return zbirke;
        }


        public List<homeTreeZbirke> srediPodZbirke(List<homeTreeZbirke> zbirke)
        {


            var TI = new List<homeTreeZbirke>();

            var  firstLevel = new List<homeTreeZbirke>();
            var  underLevel = new List<homeTreeZbirke>();
            firstLevel = zbirke.Where(z => z.Nad_IDT == null).OrderBy(p => p.Pojam).ToList();
            underLevel = zbirke.Where(z => z.Nad_IDT != null).OrderBy(p => p.Pojam).ToList();


            List<List<homeTreeZbirke>> hierarchyTemp = new List<List<homeTreeZbirke>>();

            hierarchyTemp.Add(firstLevel);
            hierarchyTemp.Add(underLevel);

            int zbroj = 0;
            do
            {

                var lowerLevels = underLevel.Where(y => firstLevel.Any(x => x.IDT == y.Nad_IDT)).OrderBy(z => z.Nad_IDT).OrderBy(z => z.Pojam).ToList();
                zbroj = lowerLevels.Count();
                if (zbroj > 0) hierarchyTemp.Add(lowerLevels);
                firstLevel = lowerLevels;

            } while (zbroj > 0);

            for (var i = hierarchyTemp.Count - 1; i >= 0; i--)
            {
                for (var j = 0; j < hierarchyTemp[i].Count; j++)
                {
                    if (i == hierarchyTemp.Count - 1)
                    {

                        TI.Add(hierarchyTemp[i][j]);
                    }
                    else
                    {
                        var z = TI.FindAll(tt => tt.Nad_IDT == hierarchyTemp[i][j].IDT);

                        if (z.Count > 0)
                        {
                            Console.WriteLine(z.Count);
                        }


                        hierarchyTemp[i][j].podNodes = z;
                        TI.Add(hierarchyTemp[i][j]);


                    }


                }
                if (i < hierarchyTemp.Count - 1)
                {
                    TI.RemoveRange(0, hierarchyTemp[i + 1].Count);
                }
            }


            return TI;
        }



        public SqlParameter DodajParametar()
        {
            brojParametara++;
            var sp = new SqlParameter();
            sp.ParameterName = "@param_" + brojParametara;
            return sp;
        }

        public string Inv2str(string x)
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



        public string GetParametar(string imeParametra)
        {
            string vrijednost = "NE";
            //var ABT = new AccountsByTxt();
            string userName = AccountsByTxt.getUserName();
            string kodVrijednost = null;
            string userVrijednost = null;

            string conn = ConfigurationManager.ConnectionStrings["M_DATA"].ToString();
            using (SqlConnection scon = new SqlConnection(conn))
            {
                using (SqlCommand scom = new SqlCommand())
                {
                    scom.Connection = scon;
                    scon.Open();
                    // using( var context = new M_DATA_HPMEntities())
                    // {
                    //context.Database.ExecuteSqlCommand("DELETE tbl_temp_pretrazivanje WHERE sifra='" + upit.staraSifra + "'");

                    scom.CommandText = @"SELECT Korisnik_UserName,Vrijednost FROM tbl_Parametri_za_korisnike WHERE Parametar=@parameterName AND (Korisnik_UserName=@kod OR  Korisnik_UserName=@userName)";
                    scom.Parameters.AddWithValue("@kod", "KOD");
                    scom.Parameters.AddWithValue("@userName", userName);
                    scom.Parameters.AddWithValue("@parameterName",imeParametra);

                    
                    var dr=  scom.ExecuteReader();
                    if (dr.HasRows)
                    {
                        while (dr.Read())
                        {
                            string tmpKorisnik = dr["Korisnik_UserName"].ToString();
                            string tmpVrijednost = dr["Vrijednost"].ToString();
                            if (tmpKorisnik == userName)
                            {
                                userVrijednost = tmpVrijednost;
                            }
                            if (tmpKorisnik == "KOD")
                            {
                                kodVrijednost = tmpVrijednost;
                            }

                        }
                    }
                }
            }

            vrijednost =String.IsNullOrEmpty(userVrijednost) ? (String.IsNullOrEmpty(kodVrijednost) ?"NE" : kodVrijednost): userVrijednost;
            

            return vrijednost;

        }



        public List<refiner> FillRefiner(SqlDataReader dr)
        {
            List<refiner> refi = new List<refiner>();
            while (dr.Read())
            {
                SEClasses.refiner tmp = new SEClasses.refiner();
                tmp.kategorija = dr["kategorija"].ToString();
                tmp.Pojam = dr["Pojam"].ToString();

                if (dr.IsDBNull(dr.GetOrdinal("IDT")))
                {
                    tmp.IDT = -1;
                }
                else
                {
                    tmp.IDT = dr.GetInt32(dr.GetOrdinal("IDT"));
                }

                if (dr.IsDBNull(dr.GetOrdinal("brojZapisa")))
                {
                    tmp.brojZapisa = -1;
                }
                else
                {
                    tmp.brojZapisa = dr.GetInt32(dr.GetOrdinal("brojZapisa"));
                }

                refi.Add(tmp);
            }
            return refi;
        }

        public string TermTablicaZaPolje(int poljeIDT)//deprecated
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

        public void TempPretLOG(string conn, Guid sifra,int brojZapisa)
        {
            using (SqlConnection scon = new SqlConnection(conn))
            {
                using (SqlCommand scom = new SqlCommand())
                {
                    scom.Connection = scon;
                    scon.Open();
                    // using( var context = new M_DATA_HPMEntities())
                    // {
                        //context.Database.ExecuteSqlCommand("DELETE tbl_temp_pretrazivanje WHERE sifra='" + upit.staraSifra + "'");
                    
                    scom.CommandText = @"INSERT INTO tbl_Temp_pretrazivanje_LOG (sifra,sessionID,vrijeme,brojZapisa) VALUES (@sifra,@sessID,@time,@brojZapisa)";
                    scom.Parameters.AddWithValue("@sifra", sifra);
                    scom.Parameters.AddWithValue("@sessID", sessID);
                    scom.Parameters.AddWithValue("@time", DateTime.Now.ToLocalTime());
                    scom.Parameters.AddWithValue("@brojZapisa", brojZapisa);
                        scom.ExecuteNonQuery();
                }
            }
        }




        public static List<string> GetUserNames(string conn)
        {
            var korisnici = new List<string>();


            using (SqlConnection scon = new SqlConnection(conn))
            {
                using (SqlCommand scom = new SqlCommand())
                {
                    scom.Connection = scon;
                    scon.Open();
                    scom.CommandText = @"Select username from dbo.tbl_T_Kustosi where username is not null";
                    SqlDataReader dr = scom.ExecuteReader();
                    while (dr.Read())
                    {
                        korisnici.Add(dr["username"].ToString());
                    }
                    dr.Close();
                }
                scon.Close();
            }
            return korisnici;

        }



        public List<SEClasses.refinerModel> GetRefiners(string conn)
        {
            List<refinerModel> zzz = new List<refinerModel>();


            using (SqlConnection scon = new SqlConnection(conn))
            {
                using (SqlCommand scom = new SqlCommand())
                {
                    scom.Connection = scon;
                    scon.Open();
                    scom.CommandText = @"Select IDT,title,filter,template from dbo.tbl_Def_struktura_upiti_refiners where refiner='True' ORDER BY refinerSort";
                    SqlDataReader dr = scom.ExecuteReader();
                    zzz = GetRefinerModel(dr);
                    dr.Close();
                }
                scon.Close();
            }
            return zzz;

        }

        public List<refinerModel> GetRefinerModel(SqlDataReader dr)
        {
            List<refinerModel> zzz = new List<refinerModel>();
            while (dr.Read())
            {
                refinerModel tmp = new refinerModel();
                tmp.filter = dr["filter"].ToString();
                tmp.title = dr["title"].ToString();
                tmp.template = dr["template"].ToString();
                tmp.fieldIDT = dr.GetInt32(dr.GetOrdinal("IDT"));
                zzz.Add(tmp);
            }
            return zzz;
        }

        public List<rezultati> GetRez(SqlDataReader dr)
        {
            List<rezultati> wry = new List<rezultati>();
            while (dr.Read())
            {
                rezultati tmp = new rezultati();
                tmp.Autori = dr["Autori"].ToString();
                tmp.Datacija = dr["Datacija"].ToString();
                tmp.ID_Broj = dr.GetInt32(dr.GetOrdinal("ID_Broj"));
                tmp.kataloskaJedinica = dr["kataloskaJedinica"].ToString();
                tmp.KRT_IDT_Zbirka = dr.GetInt32(dr.GetOrdinal("KRT_IDT_Zbirka"));
                tmp.KRT_Inventarni_broj = dr["KRT_Inventarni_broj"].ToString();
                tmp.MC_Staza_slike = dr["MC_Staza_slike"].ToString();
                tmp.Mit = dr["Mit"].ToString();
                tmp.Mjere = dr["Mjere"].ToString();
                tmp.Mjesta = dr["Mjesta"].ToString();
                tmp.naslovi = dr["Naslovi"].ToString();
                tmp.nazivi = dr["nazivi"].ToString();
                tmp.zbirka = dr["zbirka"].ToString();
                tmp.Mat = dr["Mat"].ToString();
                tmp.teh = dr["teh"].ToString();
                tmp.odabrano = dr.GetBoolean(dr.GetOrdinal("odabrano"));

                wry.Add(tmp);
            }
            return wry;
        }

        public int SetOdabrano(string conn,string sifra, int ID_Broj, int odabrano,bool sve)
        {
            int brojOdabranih = 0;
            using (SqlConnection scon = new SqlConnection(conn))
            {
                using (SqlCommand scom = new SqlCommand())
                {
                    scom.Connection = scon;
                    scon.Open();

                    if (!sve)
                    {
                        scom.CommandText = @"UPDATE tbl_temp_pretrazivanje_odabrano SET odabrano=@odabrano WHERE sifra=@sifra and ID_Broj=@ID_Broj";
                        scom.Parameters.Clear();
                        scom.Parameters.AddWithValue("@sifra", sifra);
                        scom.Parameters.AddWithValue("@ID_Broj", ID_Broj);
                    }
                    else
                    {
                        scom.CommandText = @"UPDATE tbl_temp_pretrazivanje_odabrano SET odabrano=@odabrano  WHERE sifra=@sifra";
                        
                        scom.Parameters.AddWithValue("@sifra", sifra);
                    }

                    scom.Parameters.AddWithValue("@odabrano", odabrano);
                    scom.ExecuteNonQuery();


                    scom.Parameters.Clear();
                    scom.CommandText = @"Select count(*) from tbl_temp_pretrazivanje_odabrano WHERE odabrano=1 AND sifra=@sifra ";
                    scom.Parameters.AddWithValue("@sifra", sifra);
                    brojOdabranih=(int)scom.ExecuteScalar();

                }
                scon.Close();
            }

            return brojOdabranih;
        }


        public string GetAutocompleteDLookup(string conn, string tablica, int IDT)
        {
            string termFound=null;
            if (!string.IsNullOrEmpty(tablica))
            {

                using (SqlConnection scon = new SqlConnection(conn))
                {
                    using (SqlCommand scom = new SqlCommand())
                    {
                        scom.Connection = scon;
                        scon.Open();
                        scom.CommandType = CommandType.StoredProcedure;
                        scom.CommandText = "dbo.usp_zaAutocompleteDlookup";
                        scom.Parameters.AddWithValue("@tablica", tablica);
                        scom.Parameters.AddWithValue("@IDT", IDT);
                        var tmp = scom.ExecuteScalar();
                        if (tmp != DBNull.Value && tmp != null)
                        {
                            termFound = tmp.ToString();
                        }
                        else
                        {
                            termFound = "nije našao";
                        }
                    }
                    scon.Close();
                }
            }

            return termFound;
        }


        public List<termDropDown> GetAutocomplete(string conn,string tablica,string term)
        {
            var termList = new List<termDropDown>();
            if (!string.IsNullOrEmpty(tablica) && !string.IsNullOrEmpty(term))
                //provjerit da li je pravo ime tablice, očistit term (drop, delete, -- ;
            {

                using (SqlConnection scon = new SqlConnection(conn))
                {
                    using (SqlCommand scom = new SqlCommand())
                    {
                        scom.Connection = scon;
                        scon.Open();
                        scom.CommandType = CommandType.StoredProcedure;
                        scom.CommandText = "dbo.usp_zaAutocomplete";
                        scom.Parameters.AddWithValue("@tablica", tablica);
                        scom.Parameters.AddWithValue("@trazi", term);
                        SqlDataReader dr = scom.ExecuteReader();
                        while (dr.Read())
                        {
                            var tmp = new termDropDown();
                            tmp.Pojam = dr["Pojam"].ToString();
                            tmp.IDT = dr.GetInt32(dr.GetOrdinal("IDT"));
                            if (dr.IsDBNull(dr.GetOrdinal("Nad_IDT")))
                            {
                                tmp.Nad_IDT = null;
                            }
                            else
                            {
                                tmp.Nad_IDT = dr.GetInt32(dr.GetOrdinal("Nad_IDT"));
                            }
                            termList.Add(tmp);
                        }
                        dr.Close();

                    }
                    scon.Close();
                }
            }
        
            return termList;
        }

        public Dictionary<string, List<termDropDown>> GetTerms(string conn,string uvjet)
        {
            var bucket = new Dictionary<string, List<termDropDown>>();

            using (SqlConnection scon = new SqlConnection(conn))
            {
                using (SqlCommand scom = new SqlCommand())
                {
                    scom.Connection = scon;
                    scon.Open();
                    scom.CommandText = "Select DISTINCT ime,T_Tbl from tbl_Def_struktura_upiti_refiners where " + uvjet + " and not ime is null Order by ime";
                    SqlDataReader dr = scom.ExecuteReader();
                    var ntablice = new Dictionary<string, string>();
                    while (dr.Read())
                    {
                        ntablice.Add(dr["ime"].ToString(), dr["T_Tbl"].ToString());
                    }
                    dr.Close();


                    foreach (KeyValuePair<string, string> y in ntablice)
                    {
                        //http://localhost:61950/api/altValuesNOEF?nemaVeze=5&tablice=ttt
                        scom.CommandText = "Select IDT,Pojam,Nad_IDT from " + y.Value.ToString() + " Order by Pojam";
                        dr = scom.ExecuteReader();
                        List<termDropDown> tempList = new List<termDropDown>();
                        while (dr.Read())
                        {
                            termDropDown tmp = new termDropDown();
                            tmp.Pojam = dr["Pojam"].ToString();
                            tmp.IDT = dr.GetInt32(dr.GetOrdinal("IDT"));
                            if (dr.IsDBNull(dr.GetOrdinal("Nad_IDT")))
                            {
                                tmp.Nad_IDT = null;
                            }
                            else
                            {
                                tmp.Nad_IDT = dr.GetInt32(dr.GetOrdinal("Nad_IDT"));
                            }
                            tempList.Add(tmp);
                        }
                        dr.Close();
                        //bucket.Add(y.Key.ToString(), tempList);
                        bucket.Add(y.Value.ToString(), tempList);
                    }
                }
                scon.Close();
            }
            return bucket;
        }



        public List<rezultatiSEK> GetSPage(string conn, string sifra, int pageSize, int pageIndex)
        {
            List<rezultatiSEK> zzz = new List<rezultatiSEK>();
            int odRec = pageSize * (pageIndex - 1) + 1;
            int doRec = pageSize * (pageIndex);

            using (SqlConnection scon = new SqlConnection(conn))
            {
                using (SqlCommand scom = new SqlCommand())
                {
                    scom.Connection = scon;
                    scon.Open();
                    scom.CommandText = "Select * from dbo.funk_rez_page ('" + sifra + "'," + odRec + "," + doRec + ")";
                    SqlDataReader dr = scom.ExecuteReader();

                    zzz = GetSekRez(dr);

                    dr.Close();

                }
                scon.Close();
            }
            return zzz;

        }


        public List<zaRegistraciju> GetNavigacijaRegistracijaSifra(string conn, string sifra,int IDT_Zbirka)
        {
            var zzz = new List<zaRegistraciju>();

            using (SqlConnection scon = new SqlConnection(conn))
            {
                using (SqlCommand scom = new SqlCommand())
                {
                    scom.Connection = scon;
                    scon.Open();
                    scom.CommandType = CommandType.Text;
                    scom.CommandText = "SELECT * FROM [dbo].[neupisaniRegistracijaWrapperSifra] (@IDT_Zbirka,@ID_Broj,@sifra)";
                    scom.Parameters.AddWithValue("@sifra", sifra);
                    scom.Parameters.AddWithValue("@IDT_Zbirka", IDT_Zbirka);
                    scom.Parameters.AddWithValue("@ID_Broj", -1);

                    

                    SqlDataReader dr = scom.ExecuteReader();
                    while (dr.Read())
                    {
                        var tmp = new zaRegistraciju();
                        tmp.ID_Broj = dr.GetInt32(dr.GetOrdinal("ID_Broj"));
                        tmp.KRT_Inventarni_broj = dr["KRT_Inventarni_broj"].ToString();
                        tmp.KRT_IDT_Zbirka = dr.GetInt32(dr.GetOrdinal("KRT_IDT_Zbirka"));
                        tmp.imaAutora = dr.GetBoolean(dr.GetOrdinal("imaAutora"));
                        tmp.imaDataciju = dr.GetBoolean(dr.GetOrdinal("imaDataciju"));
                        tmp.imaFotku = dr.GetBoolean(dr.GetOrdinal("imaFotku"));
                        tmp.imaMaterijala = dr.GetBoolean(dr.GetOrdinal("imaMaterijala"));
                        tmp.imaMjera = dr.GetBoolean(dr.GetOrdinal("imaMjera"));
                        tmp.imaMjesta = dr.GetBoolean(dr.GetOrdinal("imaMjesta"));
                        tmp.imaNaslov = dr.GetBoolean(dr.GetOrdinal("imaNaslov"));
                        tmp.imaNaziv = dr.GetBoolean(dr.GetOrdinal("imaNaziv"));
                        

                        zzz.Add(tmp);
                    }

                    dr.Close();


                }
                scon.Close();
            }
            return zzz;

        }


        public List<navigacijaDropDown> GetNavigacija(string conn, string sifra)
        {
            var zzz = new List<navigacijaDropDown>();

            using (SqlConnection scon = new SqlConnection(conn))
            {
                using (SqlCommand scom = new SqlCommand())
                {
                    scom.Connection = scon;
                    scon.Open();
                    scom.CommandText = "Select ID_Broj,KRT_Inventarni_broj from dbo.tbl_Kartica where ID_Broj IN (Select ID_Broj from tbl_temp_pretrazivanje_odabrano where sifra=@sifra) order by KRT_SORT_Inv_br";
                    scom.Parameters.AddWithValue("@sifra", sifra);

                    SqlDataReader dr = scom.ExecuteReader();
                    while (dr.Read())
                    {
                        zzz.Add(new navigacijaDropDown { ID_Broj = dr.GetInt32(dr.GetOrdinal("ID_Broj")), KRT_Inventarni_broj = dr["KRT_Inventarni_broj"].ToString() });
                    }

                    dr.Close();


                }
                scon.Close();
            }
            return zzz;

        }


        public List<rezultati> GetMPage(string conn, string sifra, int pageSize, int pageIndex)
        {
            var zzz = new List<rezultati>();
            int odRec = pageSize * (pageIndex - 1) + 1;
            int doRec = pageSize * (pageIndex);

            using (SqlConnection scon = new SqlConnection(conn))
            {
                using (SqlCommand scom = new SqlCommand())
                {
                    scom.Connection = scon;
                    scon.Open();
                    scom.CommandText = "Select * from dbo.funk_rez_page_odabrano ('" + sifra + "'," + odRec + "," + doRec + ")";
                    SqlDataReader dr = scom.ExecuteReader();

                    zzz = GetRez(dr);

                    dr.Close();


                }
                scon.Close();
            }
            return zzz;

        }

        //testchangez
        public List<rezultati> GetMPageChecked(string conn, string sifra, int pageSize, int pageIndex)
        {
            var zzz = new List<rezultati>();
            int odRec = pageSize;// pageSize * (pageIndex - 1) + 1;
            int doRec = pageIndex;// pageSize * (pageIndex);

            using (SqlConnection scon = new SqlConnection(conn))
            {
                using (SqlCommand scom = new SqlCommand())
                {
                    scom.Connection = scon;
                    scon.Open();
                    scom.CommandText = "Select * from dbo.funk_rez_page_odabrano_checked ('" + sifra + "'," + odRec + "," + doRec + ")";
                    SqlDataReader dr = scom.ExecuteReader();

                    zzz = GetRez(dr);

                    dr.Close();


                }
                scon.Close();
            }
            return zzz;

        }



        public List<defVrijeme> GetDefVrijeme(string conn)
        {
            var poljaVrijeme = new List<defVrijeme>();
            using (SqlConnection scon = new SqlConnection(conn))
            {
                using (SqlCommand scom = new SqlCommand())
                {
                    scom.Connection = scon;
                    scon.Open();
                    //(715, 191, 188, 758, 2287,3603,4 )
                    scom.CommandText = "SELECT * FROM tbl_Def_Vrijeme  ORDER BY DFV_Opis";
                    //var defstruktura = _contextProvider.Context.tbl_Def_Struktura_plus.Where(c => idtz.Contains(c.IDT)).Select(c => new { c.IDT, c.Pojam, c.Naziv, c.T_Tbl, c.Tablica, c.Napomena }).OrderBy(c => c.Pojam);

                    using (SqlDataReader dr = scom.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            defVrijeme tmp = new defVrijeme();
                            tmp.DFV_G_do = dr["DFV_G_do"].ToString();
                            tmp.DFV_G_od = dr["DFV_G_od"].ToString();
                            tmp.DFV_St_do = dr["DFV_St_do"].ToString();
                            tmp.DFV_St_od = dr["DFV_St_od"].ToString();
                            tmp.DFV_Mj_do  = dr["DFV_Mj_do"].ToString();
                            tmp.DFV_Mj_od = dr["DFV_Mj_od"].ToString();
                            tmp.DFV_Opis = dr["DFV_Opis"].ToString();
                            tmp.DFV_St_plus = dr.GetBoolean(dr.GetOrdinal("DFV_St_plus"));
                            tmp.Vidljiv = dr.GetBoolean(dr.GetOrdinal("Vidljiv"));
                            poljaVrijeme.Add(tmp);
                        }
                        dr.Close();
                    }


                }
                scon.Close();
            }
            return poljaVrijeme;
        }


        public List<defStrukt> GetStruktura(string conn)
        {
            poljaUpit.Clear();
            using (SqlConnection scon = new SqlConnection(conn))
            {
                using (SqlCommand scom = new SqlCommand())
                {
                    scom.Connection = scon;
                    scon.Open();
                    //(715, 191, 188, 758, 2287,3603,4 )
                    scom.CommandText = "SELECT IDT, Pojam, Naziv, T_Tbl, Tablica, Napomena,ime FROM tbl_Def_struktura_upiti_refiners  ORDER BY Pojam";
                    //var defstruktura = _contextProvider.Context.tbl_Def_Struktura_plus.Where(c => idtz.Contains(c.IDT)).Select(c => new { c.IDT, c.Pojam, c.Naziv, c.T_Tbl, c.Tablica, c.Napomena }).OrderBy(c => c.Pojam);

                    using (SqlDataReader dr = scom.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            defStrukt tmp = new defStrukt();
                            tmp.Pojam = dr["Pojam"].ToString();
                            tmp.IDT = dr.GetInt32(dr.GetOrdinal("IDT"));
                            tmp.Napomena = dr["Napomena"].ToString();
                            tmp.Tablica = dr["Tablica"].ToString();
                            tmp.Naziv = dr["Naziv"].ToString();
                            tmp.T_Tbl = dr["T_Tbl"].ToString();
                            tmp.ime = dr["ime"].ToString();
                            poljaUpit.Add(tmp);
                        }
                        dr.Close();
                    }


                }
                scon.Close();
            }
            return poljaUpit;
        }


        public doubleLoad MPretrazivanje(string conn, praviUpitTip upit)
        {
            var s1 = new doubleLoad();

            Guid sifra = new Guid(); //"9998hhh11";
            sifra = Guid.NewGuid();
            currentSifra = sifra;
            var PH = new List<podzapisiHelper>();
            var VSIPH = new vratiStringIPH();

            brojParametara = 0;
            parametriZaUpit.Clear();

            VSIPH = MGenerirajUpitString(upit, sifra);
            string value = VSIPH.sqlString;
            PH = VSIPH.PH;

            //string xValue="INSERT INTO tbl_temp_pretrazivanje SELECT '" + sifra + "' as sifra,dbo.vw_Stuff_ALL.ID_Broj, '0' as odabrano from dbo.vw_Stuff_ALL " + value;
            //string xValue = "INSERT INTO tbl_temp_pretrazivanje SELECT '" + sifra + "' as sifra,dbo.vw_Stuff_ALL.ID_Broj, '0' as tablica,row_number() over(order by KRT_Sort_inv_br) as sort,'" + sessID + "' as ssID from dbo.vw_Stuff_ALL " + value ;
            string xValue = "INSERT INTO tbl_temp_pretrazivanje_odabrano SELECT '" + sifra + "' as sifra,dbo.vw_Stuff_ALL.ID_Broj, '0' as tablica,row_number() over(order by KRT_Sort_inv_br) as sort,0 as odabrano from dbo.vw_Stuff_ALL " + value;
            //value = "select TOP " + upit.pageSize + " * from dbo.vw_Stuff_ALL " + value;



            using (SqlConnection scon = new SqlConnection(conn))
            {
                using (SqlCommand scom = new SqlCommand())
                {
                    scom.Connection = scon;
                    scon.Open();
                    // using( var context = new M_DATA_HPMEntities())
                    // {
                    if (!string.IsNullOrEmpty(upit.staraSifra))
                    {
                        //context.Database.ExecuteSqlCommand("DELETE tbl_temp_pretrazivanje WHERE sifra='" + upit.staraSifra + "'");
                        scom.CommandText = @"DELETE tbl_temp_pretrazivanje_odabrano WHERE sifra=@sifra";
                        scom.Parameters.AddWithValue("@sifra", upit.staraSifra);
                        scom.ExecuteNonQuery();
                    }

                    if (PH.Count > 0)
                    {
                        for (int i = 0; i < PH.Count; i++)
                        { 
                            scom.Parameters.Clear();
                            scom.CommandText = "dbo.testREK2_odabrano";
                            scom.CommandType = CommandType.StoredProcedure;
                            scom.Parameters.Add("@tablica", SqlDbType.NVarChar).Value = PH[i].tablica;
                            scom.Parameters.Add("@sifra", SqlDbType.NVarChar).Value = PH[i].sifra;
                            scom.Parameters.Add("@IDT", SqlDbType.Int).Value = PH[i].IDT;
                            
                            scom.ExecuteNonQuery();
                        }
                    }


                    //xValue	"INSERT INTO tbl_temp_pretrazivanje SELECT 'ffec6874-7788-45df-8664-3b97d0665f5a' as sifra,dbo.vw_Stuff_ALL.ID_Broj, '0' as tablica,row_number() over(order by KRT_Sort_inv_br) as sort from dbo.vw_Stuff_ALL  where  ID_Broj IN ( Select ID_Broj From dbo.tbl_Kartica where dbo.tbl_Kartica.KRT_IDT_Zbirka = 59)"	string

                    //context.testREK2()

                    SqlDataReader dr;
                    scom.CommandType = CommandType.Text;
                    scom.CommandText = xValue;
                    scom.Parameters.AddRange(parametriZaUpit.ToArray());
                    s1.brojZapisa = scom.ExecuteNonQuery();


                    string refinerQry = "SELECT * FROM [dbo].[naziviRefiner_odabrano] (N'" + sifra + "')";
                    var refi = new List<refiner>();
                    scom.CommandText = refinerQry;
                    dr = scom.ExecuteReader();
                    refi = FillRefiner(dr);
                    dr.Close();


                    TempPretLOG(conn, sifra,s1.brojZapisa);

                    //value = "select * from dbo.vw_Stuff_ALL WHERE ID_Broj IN (SELECT TOP " + upit.pageSize + " ID_Broj FROM dbo.tbl_temp_pretrazivanje_odabrano WHERE sifra=N'" + sifra + "' ORDER BY sort )";
                    //scom.CommandType = CommandType.Text;
                    //scom.CommandText = value;
                    //dr = scom.ExecuteReader();
                    var wry = new List<rezultati>();
                    //wry = GetRez(dr);
                    //dr.Close();

                    wry=GetMPage(conn, sifra.ToString(), 10, 1);


                    s1.part1 = wry;// qry.Take(upit.pageSize).ToList();
                    s1.sifra = sifra;

                    if (refi.Count() > 1000)
                    {
                        var xxx = new List<refiner>(refi);
                        int katCount = 0;
                        string katCur = "";
                        foreach (refiner z in xxx)
                        {
                            if (katCur != z.kategorija)
                            {
                                katCur = z.kategorija;
                                katCount = 0;
                            }
                            else
                            {
                                katCount++;
                                if (katCount > 50)
                                {
                                    refi.Remove(z);
                                };
                            }
                        }
                    }

                    s1.part2 = refi;// zzz.ToList();

                    if (PH.Count > 0)
                    {
                        for (int i = 0; i < PH.Count; i++)
                        {
                            scom.CommandText = "DELETE tbl_temp_pretrazivanje_odabrano WHERE sifra='" + PH[i].sifra + "' and tablica='" + PH[i].tablica + "'";
                            scom.ExecuteNonQuery();
                        }
                    }

                    //}
                }
                scon.Close();
            }
            return s1;
        }



        public int BrisiUpit(string conn,  int upitID)
        {
            using (SqlConnection scon = new SqlConnection(conn))
            {
                using (SqlCommand scom = new SqlCommand())
                {
                    scom.Connection = scon;
                    scon.Open();
                    // using( var context = new M_DATA_HPMEntities())
                    // {
                    //context.Database.ExecuteSqlCommand("DELETE tbl_temp_pretrazivanje WHERE sifra='" + upit.staraSifra + "'");

                    scom.CommandText = @"DELETE FROM tbl_Web_Upiti WHERE ID=@upitID";
                    //scom.CommandText = @"UPDATE tbl_Web_Upiti SET sifra=@sifra,sessionID=@sessionID,vrijeme=@vrijeme,brojZapisa=@brojZapisa,imeUpita=@imeUpita,opis=@opis,redoviUpitaJSON=@redoviUpitaJSON,userID=@userID WHERE ID=@upitID";
                    scom.Parameters.AddWithValue("@upitID", upitID);

                    try
                    {
                        scom.ExecuteNonQuery();
                    }
                    catch (SqlException e)
                    {
                        System.Diagnostics.Debug.WriteLine(e);
                    }
                }
            }


            return 99;
        }


        public int SpremiUpit(string conn, string imeUpita,praviUpitTip redoviUpitaJSON,int upitID)
        {
            int noviID = -1;
            //var zaUserID =new AccountsByTxt();
            using (SqlConnection scon = new SqlConnection(conn))
            {
                using (SqlCommand scom = new SqlCommand())
                {
                    scom.Connection = scon;
                    scon.Open();
                    // using( var context = new M_DATA_HPMEntities())
                    // {
                    //context.Database.ExecuteSqlCommand("DELETE tbl_temp_pretrazivanje WHERE sifra='" + upit.staraSifra + "'");
                    if (upitID == -1)
                    {
                        scom.CommandText = @"INSERT INTO tbl_Web_Upiti (sifra,sessionID,vrijeme,brojZapisa,imeUpita,opis,redoviUpitaJSON,userID) VALUES (@sifra,@sessionID,@vrijeme,@brojZapisa,@imeUpita,@opis,@redoviUpitaJSON,@userID); SELECT SCOPE_IDENTITY() as noviID ;";
                    }
                    else
                    {

                        //scom.CommandText = @"UPDATE tbl_Web_Upiti (sifra,sessionID,vrijeme,brojZapisa,imeUpita,opis,redoviUpitaJSON,userID) VALUES (@sifra,@sessID,@time,@brojZapisa,@imeUpita,@opis,@redoviUpitaJSON,@userID) WHERE ID=@upitID";
                        scom.CommandText = @"UPDATE tbl_Web_Upiti SET sifra=@sifra,sessionID=@sessionID,vrijeme=@vrijeme,brojZapisa=@brojZapisa,imeUpita=@imeUpita,opis=@opis,redoviUpitaJSON=@redoviUpitaJSON,userID=@userID WHERE ID=@upitID";
                    }
                    scom.Parameters.AddWithValue("@sifra", currentSifra);
                    scom.Parameters.AddWithValue("@sessionID", sessID);
                    scom.Parameters.AddWithValue("@vrijeme", DateTime.Now.ToLocalTime());
                    scom.Parameters.AddWithValue("@brojZapisa", redoviUpitaJSON.pageSize);
                    scom.Parameters.AddWithValue("@imeUpita", imeUpita);
                    scom.Parameters.AddWithValue("@opis", redoviUpitaJSON.staraSifra);
                    scom.Parameters.AddWithValue("@redoviUpitaJSON",new JavaScriptSerializer().Serialize(redoviUpitaJSON.upiti));
                    scom.Parameters.AddWithValue("@userID", AccountsByTxt.getUserID());
                    scom.Parameters.AddWithValue("@upitID", upitID);

                    string strID = "";
                    if (upitID == -1)
                    {

                        try
                        {
                            strID = scom.ExecuteScalar().ToString();
                        }
                        catch (SqlException e)
                        {
                            System.Diagnostics.Debug.WriteLine(e);
                        }
                        noviID = Int32.Parse(strID);
                    }
                    else
                    {
                        try
                        {
                            scom.ExecuteNonQuery();
                        }
                        catch (SqlException e)
                        {
                            System.Diagnostics.Debug.WriteLine(e);
                        }
                    }
                }
            }

            
            return noviID;
        }

        public int NoviUpit(string conn)//, string imeUpita, praviUpitTip redoviUpitaJSON, int upitID)
        {   
            int noviID=-1;
            using (SqlConnection scon = new SqlConnection(conn))
            {
                using (SqlCommand scom = new SqlCommand())
                {
                    scom.Connection = scon;
                    scon.Open();
                    // using( var context = new M_DATA_HPMEntities())
                    // {
                    //context.Database.ExecuteSqlCommand("DELETE tbl_temp_pretrazivanje WHERE sifra='" + upit.staraSifra + "'");


                    //scom.CommandText="SELECT IDENT_CURRENT('tbl_Web_upiti') + IDENT_INCR('tbl_Web_upiti') AS noviID;";
                    scom.CommandText = "SELECT MAX(ID) as noviID FROM tbl_Web_upiti ;";
                    SqlDataReader dr=scom.ExecuteReader();
                    
                    while (dr.Read())
                       {
                           noviID = dr.GetInt32(dr.GetOrdinal("noviID"));
                       }
                    dr.Close();

                    var d = new List<upiti>();
                    var c= new upiti();
                    c.redOperator = " AND ";
                    c.poljeIDT = 131;
                    c.polje = "KRT_IDT_Zbirka";
                    c.tablica = "tbl_Kartica";
                    c.vrijednost3 = "DA";
                    c.vrijednost1 =null;
                    c.vrijednost2 = 1;//zbirkaZaNoviRed;
                    c.upitOperator = "=";
                    c.combo = 2;
                    d.Add(c);

                    scom.CommandText = @"INSERT INTO tbl_Web_Upiti (sifra,sessionID,vrijeme,brojZapisa,imeUpita,opis,redoviUpitaJSON,userID) VALUES (@sifra,@sessID,@vrijeme,@brojZapisa,@imeUpita,@opis,@redoviUpitaJSON,@userID); SELECT SCOPE_IDENTITY() as noviID ;";
                    //scom.CommandText = @"UPDATE tbl_Web_Upiti SET sifra=@sifra,sessionID=@sessionID,vrijeme=@vrijeme,brojZapisa=@brojZapisa,imeUpita=@imeUpita,opis=@opis,redoviUpitaJSON=@redoviUpitaJSON,userID=@userID WHERE ID=@upitID";
                    scom.Parameters.AddWithValue("@sifra", currentSifra);
                    scom.Parameters.AddWithValue("@sessID", sessID);
                    scom.Parameters.AddWithValue("@vrijeme", DateTime.Now.ToLocalTime());
                    scom.Parameters.AddWithValue("@brojZapisa", 0);
                    scom.Parameters.AddWithValue("@imeUpita", "novi upit" + (noviID + 12) );
                    scom.Parameters.AddWithValue("@opis", "novi upit...");
                    scom.Parameters.AddWithValue("@redoviUpitaJSON", new JavaScriptSerializer().Serialize(d));
                    scom.Parameters.AddWithValue("@userID", 23);
                    

                    string strID = "";
                    try
                    {
                        strID = scom.ExecuteScalar().ToString();
                    }
                    catch (SqlException e)
                    {
                        System.Diagnostics.Debug.WriteLine(e);
                    }
                    noviID = Int32.Parse(strID);

                }
            }


            return noviID;
        }



        public int KopirajUpit(string conn, int copyID, praviUpitTip redoviUpitaJSON)//, string imeUpita, praviUpitTip redoviUpitaJSON, int upitID)
        {
            ////ako je save as  spremi _tmp_upit u redoviJSON
            int noviID = -1;
            using (SqlConnection scon = new SqlConnection(conn))
            {
                using (SqlCommand scom = new SqlCommand())
                {
                    scom.Connection = scon;
                    scon.Open();


 


                    scom.CommandText = @"INSERT INTO tbl_Web_Upiti (sifra,sessionID,vrijeme,brojZapisa,imeUpita,opis,redoviUpitaJSON,userID) SELECT sifra,sessionID,@vrijeme as vrijeme,brojZapisa,imeUpita + '(kopija)' as imeUpita,opis,@redoviUpitaJSON as redoviUpitaJSON,userID FROM tbl_Web_upiti WHERE ID=@upitID; SELECT SCOPE_IDENTITY() as noviID ;";
                    //scom.CommandText = @"UPDATE tbl_Web_Upiti SET sifra=@sifra,sessionID=@sessionID,vrijeme=@vrijeme,brojZapisa=@brojZapisa,imeUpita=@imeUpita,opis=@opis,redoviUpitaJSON=@redoviUpitaJSON,userID=@userID WHERE ID=@upitID";
                    scom.Parameters.AddWithValue("@vrijeme", DateTime.Now.ToLocalTime());
                    scom.Parameters.AddWithValue("@upitID", copyID);
                    scom.Parameters.AddWithValue("@redoviUpitaJSON",new JavaScriptSerializer().Serialize(redoviUpitaJSON.upiti));
                    //scom.Parameters.AddWithValue("@userID", 23);  MOzE SE JOs DODATI za upite po userima


                    string strID = "";
                    try
                    {
                        strID = scom.ExecuteScalar().ToString();
                    }
                    catch (SqlException e)
                    {
                        System.Diagnostics.Debug.WriteLine(e);
                    }
                    noviID = Int32.Parse(strID);




                }
            }


            return noviID;
        }


        public List<saveUpit> UcitajUpite(string conn)
        {
            var upits = new List<saveUpit>();
            using (SqlConnection scon = new SqlConnection(conn))
            {
                using (SqlCommand scom = new SqlCommand())
                {
                    scom.Connection = scon;
                    scon.Open();


                    scom.CommandText = @"SELECT * FROM tbl_Web_Upiti ORDER BY vrijeme DESC";

                    try
                    {
                       
                       SqlDataReader dr= scom.ExecuteReader();
                       while (dr.Read())
                       {
                           var tmp = new saveUpit();
                           tmp.ID = dr.GetInt32(dr.GetOrdinal("ID"));
                           tmp.ime = dr["imeUpita"].ToString();
                           tmp.opis = dr["opis"].ToString();
                           tmp.sifra = Guid.Parse(dr["sifra"].ToString());
                           var xtemp = new JavaScriptSerializer().Deserialize<List<upiti>>(dr["redoviUpitaJSON"].ToString());
                           tmp.upiti = xtemp.ToArray<upiti>();

                           //tmp.upiti =new JavaScriptSerializer().Deserialize<upiti>(dr["upiti"].ToString());
                           upits.Add(tmp);
                       }
                       dr.Close();

                    }
                    catch (SqlException e)
                    {
                        System.Diagnostics.Debug.WriteLine(e);
                    }
                }
            }
            return upits;
        }



        public string GetUpitString(upiti redak)
        {
            string value = "";
            string vrijednost = "";
            var uD = new upitiDefinicije();
            uD = upitiPravilaM.Find(x => x.poljeIDT == redak.poljeIDT && x.Soperator == redak.upitOperator);
            if (uD != null)
            {
                if (uD.kojaVrijednost == 1 || uD.kojaVrijednost == 4)
                {
                    if (uD.kojaVrijednost == 1)
                    {
                        vrijednost = redak.vrijednost1;
                        if (uD.funkVrijednost == "inv2str")
                        {
                            vrijednost = Inv2str(vrijednost);
                        }

                        var sp1 = DodajParametar();
                        value = uD.fullString.Replace("QVRIJ1Q", sp1.ParameterName);
                        if (redak.upitOperator == "sadrži")
                        {
                            sp1.SqlValue ="%" +  vrijednost + "%";
                        }
                        else
                        {
                            sp1.SqlValue =  vrijednost ;
                        }
                        parametriZaUpit.Add(sp1);
                    }

                    if (uD.kojaVrijednost == 4)
                    {
                        if (uD.funkVrijednost == "zaIzmedju")
                        {
                            //vrijednost = redak.vrijednost4;
                            var sp1 = DodajParametar();
                            vrijednost = redak.vrijednost4.Split('-')[0];
                            value = uD.fullString.Replace("QVRIJ1Q", sp1.ParameterName);
                            sp1.SqlValue = vrijednost;
                            parametriZaUpit.Add(sp1);

                            if (redak.vrijednost4.IndexOf('-') > 0)
                            {
                                sp1 = DodajParametar();
                                string v2 = redak.vrijednost4.Split('-')[1];
                                value = value.Replace("QVRIJ2Q", sp1.ParameterName);
                                sp1.SqlValue = v2;
                                parametriZaUpit.Add(sp1);
                            }
                        }
                        if (uD.funkVrijednost == "zaMjere")
                        {
                            //vrijednost = redak.vrijednost4;
                            string dio = redak.vrijednost4.Split(';')[0];
                            string dimenzija = redak.vrijednost4.Split(';')[1];
                            string mj1= redak.vrijednost4.Split(';')[2];
                            string mj2 = redak.vrijednost4.Split(';')[3];
                            string jedinica = redak.vrijednost4.Split(';')[4];
                            double faktor = DlookupInt("Select Sort From dbo.tbl_T_Jedinice_mjere where idt=" + jedinica);
                            double Mjera1 = double.Parse(mj1) / faktor;
                            double Mjera2 = double.Parse(mj2) / faktor;

                            value = uD.fullString;
                            var sp1 = DodajParametar();
                            value = value.Replace("QVRIJ1Q", sp1.ParameterName);
                            sp1.SqlValue = dio;
                            parametriZaUpit.Add(sp1);

                            sp1 = DodajParametar();
                            value = value.Replace("QVRIJ2Q", sp1.ParameterName);
                            sp1.SqlValue = dimenzija;
                            parametriZaUpit.Add(sp1);

                            sp1 = DodajParametar();
                            value = value.Replace("QVRIJ3Q", sp1.ParameterName);
                            sp1.SqlValue = Mjera1.ToString().Replace(',', '.');
                            parametriZaUpit.Add(sp1);

                            sp1 = DodajParametar();
                            value = value.Replace("QVRIJ4Q", sp1.ParameterName);
                            sp1.SqlValue = Mjera2.ToString().Replace(',', '.');
                            parametriZaUpit.Add(sp1);

                        }

                    }
   
                }

                if (uD.kojaVrijednost == 3)
                {
                    vrijednost = redak.vrijednost3;
                    if (vrijednost == "DA")
                    {
                        value = uD.fullString;
                    }
                    else
                    {
                        value = uD.fullStringNE;
                    }
                }

            }


            return value;
        }


        


        public double DlookupInt(string sqlString)
        {
            double tmp = -1;
            using (SqlConnection scon = new SqlConnection(ConfigurationManager.ConnectionStrings["M_DATA"].ToString()))
            {
                using (SqlCommand scom = new SqlCommand())
                {
                    scom.Connection = scon;
                    scon.Open();
                    scom.CommandText = sqlString;
                    SqlDataReader dr = scom.ExecuteReader();
                    while (dr.Read())
                    {
                        tmp = dr.GetDouble(0);
                    }
                    dr.Close();
                    scon.Close();
                }
            }
          

            return tmp;
        }

        public List<upitiDefinicije> GetPravila(string conn)
        {
            var pravila = new List<upitiDefinicije>();
            using (SqlConnection scon = new SqlConnection(conn))
            {
                using (SqlCommand scom = new SqlCommand())
                {
                    scom.Connection = scon;
                    scon.Open();
                    scom.CommandText = "Select * from tbl_Def_Polja_Upiti_Extra";
                    SqlDataReader dr = scom.ExecuteReader();
                    while (dr.Read())
                    {
                        var tmp = new upitiDefinicije(dr);

                        pravila.Add(tmp);
                    }
                }
            }
            return pravila;
        }



        




        public void LoadUpitiPravila()
        {

            string conn = ConfigurationManager.ConnectionStrings["M_DATA"].ToString();
            upitiPravilaM = GetPravila(conn);

            //conn = ConfigurationManager.ConnectionStrings["M_SEK_DATA"].ToString();
            //upitiPravilaS = getPravila(conn);

        }


        public List<rezultatiSEK> GetSekRez(SqlDataReader dr)
        {


            List<rezultatiSEK> zzz = new List<rezultatiSEK>();
            while (dr.Read())
            {
                rezultatiSEK tmp = new rezultatiSEK();
                tmp.MC_Staza_slike = dr["MC_Staza_slike"].ToString();
                tmp.Pojam = dr["Pojam"].ToString();
                tmp.ID = dr.GetInt32(dr.GetOrdinal("ID"));
                tmp.SEK_Godina = dr["SEK_Godina"].ToString();
                tmp.SEK_IDT_Fond = dr.GetInt32(dr.GetOrdinal("SEK_IDT_Fond"));
                tmp.SEK_Identifikator = dr["SEK_Identifikator"].ToString();
                tmp.SEK_Inventarna_oznaka = dr["SEK_Inventarna_oznaka"].ToString();
                tmp.SEK_Naslov = dr["SEK_Naslov"].ToString();
                tmp.SEK_Sort_Inv_br = dr["SEK_Sort_Inv_br"].ToString();

                tmp.Datacija = dr["Datacija"].ToString();
                tmp.Autori = dr["Autori"].ToString();
                tmp.izdavac = dr["izdavac"].ToString();
                tmp.publikacija = dr["publikacija"].ToString();
                tmp.vrsta_izdanja = dr["vrsta_izdanja"].ToString();
                tmp.vrsta_clanka = dr["vrsta_clanka"].ToString();
                tmp.vrsta_dokumentacije = dr["vrsta_dokumentacije"].ToString();
                tmp.medij = dr["medij"].ToString();
                tmp.format = dr["format"].ToString();
                tmp.VIZ_Predmet_snimanja = dr["VIZ_Predmet_snimanja"].ToString();
                tmp.VIZ_Trajanje_priloga = dr["VIZ_Trajanje_priloga"].ToString();

                zzz.Add(tmp);
            }

            return zzz;
        }


                    public vratiStringIPH SEnginate(praviUpitTip upit, System.Guid sifra)
            {
                string extraOperator = "";
                string dUpitOperator = "";
                string dUpitVrijednost = "";
                int? dUpitVrijednost2 = -1;
                string dTablica = "";
                string T_tablica = "";
                string dPolje = "";
                string IDPolje = "ID";

                List<podzapisiHelper> PH = new List<podzapisiHelper>();


                //Guid sifra = new Guid(); //"9998hhh11";
                //sifra = Guid.NewGuid();

                string value = "";// "select * from dbo.vw_Stuff_ALL ";
                
                for (int i = 0; i < upit.upiti.Length; i++)
                {
                    IDPolje = "ID";
                    dUpitVrijednost2 = -1;
                    T_tablica = TermTablicaZaPolje(upit.upiti[i].poljeIDT);



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
                        dUpitVrijednost = upit.upiti[i].vrijednost1;
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
                        dUpitVrijednost = Inv2str(upit.upiti[i].vrijednost1);
                    }



                    extraOperator = i == 0 ? " where " : " " + upit.upiti[i].redOperator + " ";

                    if (upit.upiti[i].polje == "ID_IZL_organizator") { IDPolje = "IDT_Izlozbe as ID"; }
                    if (dUpitOperator == "LIKE" || dUpitOperator == "upisan")
                    {
                        if (dUpitOperator == "LIKE") { dUpitVrijednost = "'%" + dUpitVrijednost + "%'"; };
                        // if (dUpitOperator == "upisan") { dUpitVrijednost=dUpitVrijednost =="DA": "NOT IS NULL":"IS };
                        if (upit.upiti[i].polje == "SEK_Naslov") { dTablica = "vw_BFQ_lite"; }
                        //dPolje = "";
                    };



                    if (dTablica != "vw_qry_BFQ_lite")
                    {
                        //VextraOperator = "";
                        //if (value != "") { VextraOperator = extraOperator; }
                        if (dUpitVrijednost2 != -1 && dUpitVrijednost2.HasValue)
                        {
                            if (!upit.upiti[i].podZapisi)
                            {
                                value += extraOperator + " ID IN ( Select "+ IDPolje + " From dbo." + upit.upiti[i].tablica + " where dbo." + dTablica + "." + dPolje + " " + dUpitOperator + " " + dUpitVrijednost2 + ")";
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
                            if (dPolje == "SEK_SORT_Inv_br" || dPolje == "SEK_Godina")
                            {
                                value += extraOperator + " ID IN ( Select ID From dbo." + upit.upiti[i].tablica + " where dbo." + dTablica + "." + dPolje + " " + dUpitOperator + " '" + dUpitVrijednost + "')";
                            }
                            else
                            {
                                    value += extraOperator + " ( " + dPolje + " " + dUpitOperator + " " + dUpitVrijednost + ")";

                            }
                        }


                    }
                    else
                    {
                        if (dUpitVrijednost2 != -1 && dUpitVrijednost2.HasValue)
                        {
                            value += extraOperator + " ( " + dPolje + " " + dUpitOperator + " " + dUpitVrijednost2 + ")";
                        }
                        else
                        {
                            value += extraOperator + " ( " + dPolje + " " + dUpitOperator + " " + dUpitVrijednost + ")";
                        }
                    }
                }

                vratiStringIPH x = new vratiStringIPH();
                x.sqlString = value;
                x.PH = PH;

                return x;
            }

         public vratiStringIPH stariMEnginate(praviUpitTip upit, System.Guid sifra)
        {
            string extraOperator = "";
            string dUpitOperator = "";
            string dUpitVrijednost = "";
            int? dUpitVrijednost2 = -1;
            string dTablica = "";
            string T_tablica = "";
            string dPolje = "";
            string dValue = "";

            List<podzapisiHelper> PH = new List<podzapisiHelper>();

            string value = "";// "select * from dbo.vw_Stuff_ALL ";

            for (int i = 0; i < upit.upiti.Length; i++)
            {
                extraOperator = i == 0 ? " where " : " " + upit.upiti[i].redOperator + " ";
                dValue = GetUpitString(upit.upiti[i]);

                if (dValue == "")
                {

                    dUpitVrijednost2 = -1;
                    T_tablica = TermTablicaZaPolje(upit.upiti[i].poljeIDT);

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
                }
                else
                {
                    value += extraOperator + dValue;
                }
            }

            vratiStringIPH x = new vratiStringIPH();
            x.sqlString = value;
            x.PH = PH;

            return x;
        }      

        public vratiStringIPH MGenerirajUpitString(praviUpitTip upit, System.Guid sifra)
        {
            string extraOperator = "";
            string dUpitOperator = "";
            string dUpitVrijednost = "";
            int? dUpitVrijednost2 = -1;
            string dTablica = "";
            string T_tablica = "";
            string dPolje = "";
            string dValue = "";
            var provjeriOperator = false;

            List<podzapisiHelper> PH = new List<podzapisiHelper>();

            string value = "";// "select * from dbo.vw_Stuff_ALL ";

            for (int i = 0; i < upit.upiti.Length; i++)
            {
                extraOperator = i == 0 ? " where " : " " + upit.upiti[i].redOperator + " ";
                dValue = GetUpitString(upit.upiti[i]);

                if (dValue == "")
                {

                    dUpitVrijednost2 = -1;
                    //T_tablica = TermTablicaZaPolje(upit.upiti[i].poljeIDT);

                    T_tablica = poljaUpit.First(xy => xy.IDT == upit.upiti[i].poljeIDT).T_Tbl.ToString();

                    dTablica = poljaUpit.First(xy => xy.Tablica == upit.upiti[i].tablica).Tablica.ToString();
                    dPolje = poljaUpit.First(xy => xy.Naziv == upit.upiti[i].polje).Naziv.ToString();


                    provjeriOperator = poljaUpit.First(xy => xy.Napomena.Contains(upit.upiti[i].upitOperator)).IDT > -1;

                    if (!provjeriOperator || String.IsNullOrEmpty(dTablica)  || String.IsNullOrEmpty(dPolje))
                    {
                        value= "ID_Broj=-1";
                        var yy=new vratiStringIPH();
                        yy.sqlString=value;
                        yy.PH=null;
                        return yy;
                    }


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





 

                    //VextraOperator = "";
                    //if (value != "") { VextraOperator = extraOperator; }
                    if (dUpitVrijednost2 != -1)
                    {
                        if (!upit.upiti[i].podZapisi)
                        {
                            //value += extraOperator + " ID_Broj IN ( Select ID_Broj From dbo." + upit.upiti[i].tablica + " where dbo." + dTablica + "." + dPolje + " " + dUpitOperator + " " + dUpitVrijednost2 + ")";
                            brojParametara++;
                            value += extraOperator + upit.upiti[i].zagradaOtvorena + " ID_Broj IN ( Select ID_Broj From dbo." + upit.upiti[i].tablica + " where dbo." + dTablica + "." + dPolje + " " + dUpitOperator + " " + "@param_" + brojParametara + ")" + upit.upiti[i].zagradaZatvorena;
                            var p = new SqlParameter();
                            p.ParameterName = "@param_" + brojParametara;
                            p.SqlValue = dUpitVrijednost2;
                            parametriZaUpit.Add(p);
                        }
                        else
                        {//za podzapise
                            brojParametara++;
                            //value += extraOperator + " ID_Broj IN ( Select ID_Broj From dbo." + upit.upiti[i].tablica + " where dbo." + dTablica + "." + dPolje + " IN (SELECT ID_Broj as IDT from tbl_temp_pretrazivanje where sifra='" + sifra + dUpitVrijednost2.ToString() + "' and tablica='" + T_tablica + "'))";
                            value += extraOperator + upit.upiti[i].zagradaOtvorena + " ID_Broj IN ( Select ID_Broj From dbo." + upit.upiti[i].tablica + " where dbo." + dTablica + "." + dPolje + " IN (SELECT ID_Broj as IDT from tbl_temp_pretrazivanje_odabrano where sifra=" + "@param_" + brojParametara + " and tablica='" + T_tablica + "')) " + upit.upiti[i].zagradaZatvorena;
                            var p = new SqlParameter();
                            p.ParameterName = "@param_" + brojParametara;
                            p.SqlValue = sifra + dUpitVrijednost2.ToString();
                            parametriZaUpit.Add(p);

                            podzapisiHelper tph = new podzapisiHelper();
                            tph.sifra = sifra + dUpitVrijednost2.ToString();
                            tph.tablica = T_tablica;
                            tph.IDT = dUpitVrijednost2;
                            PH.Add(tph);

                        }
                    }
                }
                else
                {
                    value += extraOperator + upit.upiti[i].zagradaOtvorena + dValue + upit.upiti[i].zagradaZatvorena;
                }
            }

            var x = new vratiStringIPH();
            x.sqlString = value;
            x.PH = PH;

            return x;
        }
    }
    
}