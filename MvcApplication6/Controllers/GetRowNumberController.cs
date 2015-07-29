using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WMpp;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using Microsoft.SqlServer.Server;
using System.Configuration;

namespace WMpp.Controllers
{
    public class getRowNumberController : ApiController
    {



        public class izradaParametri
        {
            public int nID { get; set; }
            public String arrParamPolje { get; set; }
            public string sNazivPolja { get; set; }
            public string sKategorija { get; set; }
            public string vVrstaOdgovornosti { get; set; }
            public Boolean B_PREZIME_IME { get; set; }
            public int L_SORT_IZRADA { get; set; }
        }


        // GET api/values
        public IEnumerable<string> GetRealValue()
        {
            //var context = new M_DATA_HPMEntities();
            //var qry=context.Database.SqlQuery<Int64>("SELECT ID_Broj from dbo.tbl_Kartica where ID_Broj IN (select id_broj from tbl_Izrada where IZR_IDT_Mjesto=
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        public String Post(izradaParametri izrPar)
        {
            Boolean B_PREZIME_IME = izrPar.B_PREZIME_IME;
            int L_SORT_IZRADA = izrPar.L_SORT_IZRADA;
            String sKategorija = izrPar.sKategorija;
            int nID = izrPar.nID;

            String sSprPolja;
            String sSprZapisa;
            String sSZ = "";
            Int16 t = 0;
            String sVrijeme;
            String sSQL;
            String sVratiIzradu = "";
            String sAutor;
            String sMjesto;
            String sUloga="";
            String sTxt;
            Boolean bJedinica;
            Boolean bUloga;
            Boolean bPolje;
            String sTxtPolje = "";
            String sLblVrijeme="";
            String sLblMjesto="";
            String sTmpVrijeme="";
            String sTmpMjesto="";
            String sTxtVrijeme="";
            String sTxtMjesto="";
            String sKat = "";
            Boolean bAutorInv;
            Boolean bHijerTez;
            String sTxtTemp;
            Boolean bPrvaJedinica;
            Boolean bSamoAutori;
            String tmp;
            int p1=0;
            Boolean bAutorInvRazmak;
            Boolean bMSU=false;
            int i;
            String[] avrm = new String[10];
            String[] SarrParamPolje;

            String sPUloga;
            String tmpUloga;

            String tmp_pdtk;
            String sPrezime="";
            String sIme="";
            String sNazivPolja = izrPar.sNazivPolja;

            String[] repp;

            IDataRecord[] tada = new IDataRecord[6];
            Boolean svijednaki=false;

            tmpUloga = "";
            bPrvaJedinica = true;
            bMSU = true;

            bPolje = String.IsNullOrEmpty(sNazivPolja) ? svijednaki : true;

            svijednaki = false;

            SarrParamPolje = izrPar.arrParamPolje.Split('#');



            // ' 01_S_Znakovi razdvajanja polja
            sSprPolja = ", ";
            sSprPolja = Konv_ParamPolje(SarrParamPolje[1]);


            //' 02_S_Znakovi razdvajanja zapisa (ponovljivost)
            sSprZapisa = "\r\n";
            sSprZapisa = Konv_ParamPolje(SarrParamPolje[2]);
            //If Not IsMissing(arrParamPolje) Then If UBound(arrParamPolje) >= 2 Then If Not IsNull(arrParamPolje(2)) Then sSprZapisa = Konv_ParamPolje((arrParamPolje(2))) Else sSprZapisa = Chr(13) & Chr(10) Else sSprZapisa = Chr(13) & Chr(10) Else sSprZapisa = Chr(13) & Chr(10)
            //' Znakovi razdvajanja autora i suradnika        __NE_KORISTI_SE
            //' If Not IsMissing(arrParamPolje) Then If UBound(arrParamPolje) >= 3 Then If Not IsNull(arrParamPolje(3)) Then bMjernaJed = Da2True(arrParamPolje(3)) Else bMjernaJed = True Else bMjernaJed = True Else bMjernaJed = True
            //'+++++++ Ispis samo autora                NESURADNICCI

            bSamoAutori = Da2True(SarrParamPolje[4]);
            //If Not IsMissing(arrParamPolje) Then If UBound(arrParamPolje) >= 4 Then If Not IsNull(arrParamPolje(4)) Then bSamoAutori = Da2True((arrParamPolje(4))) Else bSamoAutori = False Else bSamoAutori = False Else bSamoAutori = False
            //' 05_L_Oblik ispisa: Autor; suradnik/ci         __NE_KORISTI_SE??
            //' If Not IsMissing(arrParamPolje) Then If UBound(arrParamPolje) >= 5 Then If Not IsNull(arrParamPolje(5)) Then sZnPrijeMjera = Konv_ParamPolje((arrParamPolje(5))) Else sZnPrijeMjera = ": " Else sZnPrijeMjera = ": " Else sZnPrijeMjera = ": "

            //' 06_L_Ispis jedinice vremena+++++

            bJedinica = Da2True(SarrParamPolje[6]);

            //If Not IsMissing(arrParamPolje) Then
            //    If UBound(arrParamPolje) >= 6 Then
            //        If Not IsNull(arrParamPolje(6)) Then
            //            bJedinica = Da2True((arrParamPolje(6)))
            //        Else
            //            bJedinica = True
            //        End If
            //    Else
            //        bJedinica = True
            //    End If
            //Else
            //    bJedinica = True
            //End If
            //' 07_L_Ispis uloge autora+++
            bUloga = Da2True(SarrParamPolje[7]);
            //If Not IsMissing(arrParamPolje) Then If UBound(arrParamPolje) >= 7 Then If Not IsNull(arrParamPolje(7)) Then bUloga = Da2True((arrParamPolje(7))) Else bUloga = False Else bUloga = False Else bUloga = False
            //' 08_L_Ispis_hijerarhije_tezaurusa               __DODATI_PARAM_ISPIS
            bHijerTez = Da2True(SarrParamPolje[8]);
            //'If Not IsMissing(arrParamPolje) Then If UBound(arrParamPolje) >= 8 Then If Not IsNull(arrParamPolje(8)) Then bUloga = Da2True((arrParamPolje(8))) Else bHijerTez = False Else bHijerTez = False Else bUloga = bHijerTez
            //' 09_L_Oblik ispisa: Prezime, Ime+++
            bAutorInv = Da2True(SarrParamPolje[9]);
            //If Not IsMissing(arrParamPolje) Then If UBound(arrParamPolje) >= 9 Then If Not IsNull(arrParamPolje(9)) Then bAutorInv = Da2True((arrParamPolje(9))) Else bAutorInv = False Else bAutorInv = False Else bAutorInv = False
            //' 11_L_Oblik ispisa: Prezime Ime+++
            bAutorInvRazmak = Da2True(SarrParamPolje[11]);
            //If Not IsMissing(arrParamPolje) Then If UBound(arrParamPolje) >= 11 Then If Not IsNull(arrParamPolje(11)) Then bAutorInvRazmak = Da2True((arrParamPolje(11))) Else bAutorInvRazmak = False Else bAutorInvRazmak = False Else bAutorInvRazmak = False


            //' 10_L_PrvaJedinica za period

            bPrvaJedinica = Da2True(SarrParamPolje[10]);
            //If Not IsMissing(arrParamPolje) Then
            //    If UBound(arrParamPolje) >= 10 Then
            //        If Not IsNull(arrParamPolje(10)) Then
            //            bPrvaJedinica = Da2True((arrParamPolje(10)))
            //        Else
            //            bPrvaJedinica = True
            //        End If
            //    Else
            //        bPrvaJedinica = True
            //    End If
            //Else
            //    bPrvaJedinica = True
            //End If
            //' 12_L_Ispis_Odgovornosti_i_Autora
            bMSU = Da2True(SarrParamPolje[12]);
            //If Not IsMissing(arrParamPolje) Then If UBound(arrParamPolje) >= 12 Then If Not IsNull(arrParamPolje(12)) Then bMSU = Da2True((arrParamPolje(12))) Else bMSU = False Else bMSU = False Else bMSU = False

            //'If bUloga Then bPolje = False

            bAutorInv = izrPar.B_PREZIME_IME;

            sSQL = "SELECT     dbo.tbl_Izrada.ID, dbo.tbl_Izrada.ID_Broj, dbo.tbl_Izrada.IZR_IDT_Mjesto, dbo.tbl_Izrada.IZR_ID_Autor, dbo.tbl_Izrada.IZR_IDT_Uloga, dbo.tbl_Izrada.IZR_Vrijeme_opis, ";

            sSQL += "dbo.tbl_Izrada.IZR_Vrijeme_vrijednost, dbo.tbl_Izrada.IZR_Vrijeme_jedinica, dbo.tbl_Izrada.IZR_Vrijeme_od, dbo.tbl_Izrada.IZR_Vrijeme_do, dbo.tbl_Izrada.IZR_Vrijeme_opis2, ";
            sSQL += "                      dbo.tbl_Izrada.IZR_Vrijeme_vrijednost2, dbo.tbl_Izrada.IZR_Vrijeme_jedinica2, dbo.tbl_Izrada.IZR_Period, dbo.tbl_Izrada.IZR_Period_do, dbo.tbl_Izrada.IZR_IDT_Vrsta_odgovornosti, ";
            sSQL += "                      dbo.tbl_Izrada.Sort_polje, dbo.tbl_T_Mjesta.Pojam AS IZR_IDT_Mjesto_Pojam, dbo.tbl_T_Mjesta.Nad_IDT AS Nad_IDT_Mjesto, dbo.tbl_T_Uloge_autora.Pojam AS IZR_IDT_Uloga_Pojam, ";
            sSQL += "                      dbo.tbl_T_Autori.Ime, dbo.tbl_T_Autori.Prezime,dbo.tbl_T_Vrste_odgovornosti.Pojam as IZR_IDT_Vrsta_odgovornosti_Pojam  ";
            sSQL += "FROM         dbo.tbl_Izrada INNER JOIN ";
            sSQL += "                      dbo.tbl_T_Uloge_autora ON dbo.tbl_Izrada.IZR_IDT_Uloga = dbo.tbl_T_Uloge_autora.IDT LEFT OUTER JOIN";
            sSQL += "                      dbo.tbl_T_Mjesta ON dbo.tbl_Izrada.IZR_IDT_Mjesto = dbo.tbl_T_Mjesta.IDT LEFT OUTER JOIN ";
            sSQL += "                      dbo.tbl_T_Vrste_odgovornosti ON dbo.tbl_Izrada.IZR_IDT_Vrsta_odgovornosti = dbo.tbl_T_Vrste_odgovornosti.IDT LEFT OUTER JOIN ";
            sSQL += "                      dbo.tbl_T_Autori ON dbo.tbl_Izrada.IZR_ID_Autor = dbo.tbl_T_Autori.ID ";
            sSQL += "WHERE     (dbo.tbl_Izrada.ID_Broj = " + nID + ")";

            if (bMSU)
            {
                sSQL += " ORDER BY dbo.tbl_Izrada.IZR_IDT_Vrsta_odgovornosti,dbo.tbl_Izrada.IZR_IDT_uloga, dbo.tbl_Izrada.IZR_Vrijeme_od,dbo.tbl_izrada.ID;";
            }
            else
            {
                if (L_SORT_IZRADA == 1)
                {
                    sSQL += " ORDER BY dbo.tbl_Izrada.IZR_IDT_Vrsta_odgovornosti,dbo.tbl_Izrada.IZR_IDT_uloga, dbo.tbl_Izrada.IZR_Vrijeme_od,dbo.tbl_izrada.ID;";
                };
                if (L_SORT_IZRADA == 2)
                {
                    sSQL += " ORDER BY dbo.tbl_izrada.ID,dbo.tbl_Izrada.IZR_IDT_Vrsta_odgovornosti, dbo.tbl_Izrada.IZR_Vrijeme_od;";
                }
                if (L_SORT_IZRADA == 3)
                {
                    sSQL += " ORDER BY dbo.tbl_izrada.Sort_polje,dbo.tbl_Izrada.IZR_IDT_Vrsta_odgovornosti, dbo.tbl_Izrada.IZR_Vrijeme_od;";
                }
            };
            //sSQL = "SELECT dbo.tbl_Izrada.ID, dbo.tbl_Izrada.ID_Broj, dbo.tbl_Izrada.IZR_IDT_Mjesto, dbo.tbl_Izrada.IZR_ID_Autor, dbo.tbl_Izrada.IZR_IDT_Uloga, dbo.tbl_Izrada.IZR_Vrijeme_opis, ";
            SqlConnection sqlConnection1 = new SqlConnection(ConfigurationManager.ConnectionStrings["M_DATA_HPM_ADO"].ConnectionString);
            SqlCommand cmd = new SqlCommand();
            SqlDataReader rsIzrada;

            cmd.CommandText = sSQL;
            cmd.CommandType = CommandType.Text;
            cmd.Connection = sqlConnection1;

            sqlConnection1.Open();
            sTxt = "";


            i = 0;


            rsIzrada = cmd.ExecuteReader();

            
            while (rsIzrada.Read())
            {
                            sPrezime = rsIzrada.IsDBNull(rsIzrada.GetOrdinal("Prezime")) ? "" : (string)rsIzrada["Prezime"];
                            sIme = rsIzrada.IsDBNull(rsIzrada.GetOrdinal("Ime")) ? "" : (string)rsIzrada["Ime"];
#region samoAutori
                if (bSamoAutori)
                {
                    if ((int)rsIzrada["IZR_IDT_Vrsta_odgovornosti"] != 1)
                    {
                        rsIzrada.Read();
                        goto TheLine;
                    }
                };
#endregion 
                if (bPolje)
                #region bPolje
                {
                    if (bPolje)
                    {
                        sSprZapisa = "; ";
                    };

                    sKat = sKategorija.Substring(0, 7);

                    switch (sKat)
                    {
                        case "ktg_txt":
                            sTxtPolje += Podatak(sSprZapisa, (string)rsIzrada[sNazivPolja], "");
                            break;
                        case "ktg_vrm":
                            //tmp_pdtk = Podatak(sSZ, Sazeto_vrijeme((Boolean)rsIzrada["IZR_Period"], (string)rsIzrada["IZR_Vrijeme_opis"], (string)rsIzrada["IZR_Vrijeme_vrijednost"], (string)rsIzrada["IZR_Vrijeme_jedinica"], (string)rsIzrada["IZR_Vrijeme_opis2"], (string)rsIzrada["IZR_Vrijeme_vrijednost2"], (string)rsIzrada["IZR_Vrijeme_jedinica2"], (string)rsIzrada["IZR_Vrijeme_od"], (string)rsIzrada["IZR_Vrijeme_do"], bJedinica, bPrvaJedinica), "");
                            tmp_pdtk = Podatak(sSZ, Sazeto_vrijeme((Boolean)rsIzrada["IZR_Period"],
                                rsIzrada.IsDBNull(rsIzrada.GetOrdinal("IZR_Vrijeme_opis")) ? "" : (string)rsIzrada["IZR_Vrijeme_opis"],
                                rsIzrada.IsDBNull(rsIzrada.GetOrdinal("IZR_Vrijeme_vrijednost")) ? "" : (string)rsIzrada["IZR_Vrijeme_vrijednost"],
                                rsIzrada.IsDBNull(rsIzrada.GetOrdinal("IZR_Vrijeme_jedinica")) ? "" : (string)rsIzrada["IZR_Vrijeme_jedinica"],
                                rsIzrada.IsDBNull(rsIzrada.GetOrdinal("IZR_Vrijeme_opis2")) ? "" : (string)rsIzrada["IZR_Vrijeme_opis2"],
                                rsIzrada.IsDBNull(rsIzrada.GetOrdinal("IZR_Vrijeme_vrijednost2")) ? "" : (string)rsIzrada["IZR_Vrijeme_vrijednost2"],
                                rsIzrada.IsDBNull(rsIzrada.GetOrdinal("IZR_Vrijeme_jedinica2")) ? "" : (string)rsIzrada["IZR_Vrijeme_jedinica2"],
                                (int)rsIzrada["IZR_Vrijeme_od"],
                                (int)rsIzrada["IZR_Vrijeme_do"],
                                bJedinica, bPrvaJedinica), "");

                            sTxtPolje += tmp_pdtk;

                            avrm[t] = sTxtPolje;
                            break;
                        case "ktg_mjs":
                            tmp_pdtk = Podatak(sSZ, rsIzrada.IsDBNull(rsIzrada.GetOrdinal("IZR_IDT_Mjesto_Pojam")) ? "" : (string)rsIzrada["IZR_IDT_Mjesto_Pojam"], "");

                            sTxtPolje += tmp_pdtk;
                            break;
                        case "ktg_osb":

                            if (bUloga)
                            {
                                if (bMSU)
                                {
                                    if (!rsIzrada.IsDBNull(rsIzrada.GetOrdinal("IZR_IDT_Uloga_Pojam")))
                                    {
                                        //sPUloga = Podatak(TermPojam(sqlConnection1,"tbl_T_Vrste_odgovornosti", (int)rsIzrada["IZR_IDT_Vrsta_odgovornosti"]) + " (", (string)rsIzrada["IZR_IDT_Uloga_Pojam"], "): ");
                                        //sPUloga = Podatak(sVrsteOdgovornosti[(int)rsIzrada["IZR_IDT_Vrsta_odgovornosti"]] + " (", (string)rsIzrada["IZR_IDT_Uloga_Pojam"], "): ");
                                        sPUloga = Podatak((string)rsIzrada["IZR_IDT_Vrsta_odgovornosti_Pojam"] + " (", (string)rsIzrada["IZR_IDT_Uloga_Pojam"], "): ");
                                    }
                                    else
                                    {
                                        //sPUloga = TermPojam(sqlConnection1, "tbl_T_Vrste_odgovornosti", (int)rsIzrada["IZR_IDT_Vrsta_odgovornosti"]) + ": ";
                                        //sPUloga = sVrsteOdgovornosti[(int)rsIzrada["IZR_IDT_Vrsta_odgovornosti"]] + ": ";
                                        sPUloga = (string)rsIzrada["IZR_IDT_Vrsta_odgovornosti_Pojam"] + ": ";

                                    }

                                }
                                else
                                {
                                    sPUloga = Podatak("", rsIzrada.IsDBNull(rsIzrada.GetOrdinal("IZR_IDT_Uloga_Pojam")) ? "" : (string)rsIzrada["IZR_IDT_Uloga_Pojam"], "");
                                }

                                sUloga = sPUloga.Trim();
                                if (tmpUloga == sPUloga)
                                {
                                    sUloga = "";
                                }
                                tmpUloga = sPUloga;

                                if (bAutorInv)
                                {
                                    if (bAutorInvRazmak)
                                    {
                                        sTxtPolje += sSZ + sUloga + Podatak(" ", Podatak("", sPrezime, " ") + sIme, "");
                                    }
                                    else
                                    {
                                        sTxtPolje += sSZ + sUloga + Podatak(" ", Podatak("", sPrezime, sIme == "" ? " " : ", ") + sIme, "");
                                    }
                                }
                                else
                                {
                                    if (bAutorInvRazmak)
                                    {
                                        sTxtPolje += sSZ + sUloga + Podatak(" ", Podatak("", sPrezime, " ") + sIme, "");
                                    }
                                    else
                                    {
                                        sTxtPolje += sSZ + sUloga + Podatak(" ", Podatak("", sIme, " ") + sPrezime, "");
                                    }

                                }

                            }
                            else
                            {
                                sUloga = "";
                                if (bAutorInv)
                                {
                                    if (bAutorInvRazmak)
                                    {
                                        sTxtPolje += sSZ + sUloga + Podatak(" ", Podatak("", sPrezime, " ") + sIme, "");
                                    }
                                    else
                                    {
                                        sTxtPolje += sSZ + sUloga + Podatak(" ", Podatak("", sPrezime, sIme == "" ? " " : ", ") + sIme, "");
                                    }
                                }
                                else
                                {
                                    if (bAutorInvRazmak)
                                    {
                                        sTxtPolje += sSZ + sUloga + Podatak(" ", Podatak("", sPrezime, " ") + sIme, "");
                                    }
                                    else
                                    {
                                        sTxtPolje += sSZ + sUloga + Podatak(" ", Podatak("", sIme, " ") + sPrezime, "");
                                    }

                                }

                            }

                            break;

                        default:

                            sTxtTemp = Podatak(sSZ, (string)rsIzrada[sNazivPolja + "_Pojam"], "");
                            //sTxtTemp = Podatak(sSZ, .Fields(sNazivPolja & "_Pojam"), "")
                            if (sTxtTemp == sTxtPolje)
                            {
                                sTxtTemp += Podatak(sSZ, (string)rsIzrada[sNazivPolja + "_Pojam"], "");
                            }

                            //sTxtPolje="nema kategorije";
                            break;

                    };


                #endregion
                }
                else
                {
                    #region ostalo
                if (bMSU)  {
                    sLblVrijeme = "Vrijeme: ";
                }else{
                    sLblVrijeme = ", ";
                }
                if (bMSU){
                    sLblMjesto = "Mjesto: ";
                }
                else
                {
                    sLblMjesto = ", ";
                }

                sAutor = Podatak("", Podatak("", sIme, " ") + sPrezime, sSprPolja);

                if (!rsIzrada.IsDBNull(rsIzrada.GetOrdinal("IZR_IDT_Mjesto_Pojam"))){
                    sMjesto = (string)rsIzrada["IZR_IDT_Mjesto_Pojam"];// da li se to uopće koristi? + IIf(bHijerTez, Podatak(", ", TermPojam("tbl_T_Mjesta", !Nad_IDT_Mjesto), ""), "")
                    sMjesto = Podatak("", sMjesto, sSprPolja);
                } else {
                    sMjesto = "";
                }
                if (sMjesto != ""){
                    if (sTmpMjesto == sMjesto){
                        sTxtMjesto = sMjesto;
                    } else {
                        sTxtMjesto = Podatak("", sTxtMjesto, "; ") + sMjesto;
                    }
                }
                sTmpMjesto = sMjesto;

                sVrijeme = Sazeto_vrijeme((Boolean)rsIzrada["IZR_Period"],
                                rsIzrada.IsDBNull(rsIzrada.GetOrdinal("IZR_Vrijeme_opis")) ? "" : (string)rsIzrada["IZR_Vrijeme_opis"],
                                rsIzrada.IsDBNull(rsIzrada.GetOrdinal("IZR_Vrijeme_vrijednost")) ? "" : (string)rsIzrada["IZR_Vrijeme_vrijednost"],
                                rsIzrada.IsDBNull(rsIzrada.GetOrdinal("IZR_Vrijeme_jedinica")) ? "" : (string)rsIzrada["IZR_Vrijeme_jedinica"],
                                rsIzrada.IsDBNull(rsIzrada.GetOrdinal("IZR_Vrijeme_opis2")) ? "" : (string)rsIzrada["IZR_Vrijeme_opis2"],
                                rsIzrada.IsDBNull(rsIzrada.GetOrdinal("IZR_Vrijeme_vrijednost2")) ? "" : (string)rsIzrada["IZR_Vrijeme_vrijednost2"],
                                rsIzrada.IsDBNull(rsIzrada.GetOrdinal("IZR_Vrijeme_jedinica2")) ? "" : (string)rsIzrada["IZR_Vrijeme_jedinica2"],
                                (int)rsIzrada["IZR_Vrijeme_od"],
                                (int)rsIzrada["IZR_Vrijeme_do"],
                                bJedinica, bPrvaJedinica);
                if(sTmpVrijeme == sVrijeme) {
                    sTxtVrijeme = sVrijeme;
                }
                else
                {
                    sTxtVrijeme = Podatak("", sTxtVrijeme, "; ") + sVrijeme;
                }
                sTmpVrijeme = sVrijeme;
                sUloga="";
                if(!rsIzrada.IsDBNull(rsIzrada.GetOrdinal("IZR_IDT_Uloga_Pojam"))){
                    if (bUloga){
                        if(bMSU){
                            sUloga = Podatak((string)rsIzrada["IZR_IDT_Vrsta_odgovornosti_Pojam"] + " (", (string)rsIzrada["IZR_IDT_Uloga_Pojam"], "): ");
                        }else{
                            sUloga = Podatak("", (string)rsIzrada["IZR_IDT_Uloga_Pojam"], " ");
                        }
                    }
                    sTxt = sTxt + sUloga + sAutor + (bMSU ? "" : sMjesto + sVrijeme);
                }

                    #endregion
                };


            TheLine:
                t++;
                sSZ = sSprZapisa;

                sTxt = sTxt + sSprZapisa;
            }
            //sTxt = tada["IZR_IDT_Mjesto_Pojam"].ToString().Trim();
            sqlConnection1.Close();


            if (bPolje)
            {
                i++;
                avrm[i] = "Mpp_NULL";
            }

            if (bMSU)
            {
                sTxt = sTxt + Podatak(sSprZapisa + sLblMjesto, sTxtMjesto, "") + Podatak(sSprZapisa + sLblVrijeme, sTxtVrijeme, "");
            }

            if (sTxtPolje != "")
            {
                if (sTxtPolje.IndexOf(sSZ) > 0)
                {
                    repp = sTxtPolje.Split(sSZ.ToCharArray());
                    svijednaki = true;
                    for (int x = 1; x < repp.Length; x++)
                    {
                        if (repp[x] != repp[0])
                        {
                            svijednaki = false;
                        }
                    }
                }
            }


            tmp = bPolje ? sTxtPolje : sTxt;
            sVratiIzradu = bPolje ? sTxtPolje : sTxt;
            p1 = tmp.IndexOf("-te 20. st.");
            if(p1>-1){
                tmp=tmp.Substring(0,p1-3) + "19" + tmp.Substring(p1-2,5) + tmp.Substring(p1+11);

            }
                                    //''''''''''''''
                                    //tmp = IIf(bPolje, sTxtPolje, sTxt)
                                    //Isp_Izrada = IIf(bPolje, sTxtPolje, sTxt)
    
                                    //p1 = InStr(1, tmp, "-te 20. st.", vbTextCompare)
                                    //If p1 > 0 Then
                                    //    tmp = Left(tmp, p1 - 3) & "19" & Mid(tmp, p1 - 2, 5) & Mid(tmp, p1 + 11)
                                    //End If
    
                                    //Isp_Izrada = Replace(tmp, "  ", " ")


            sVratiIzradu = tmp.Replace("  ", " ");



            



            // Put your code here
            return sVratiIzradu;
        }


        public static string Konv_ParamPolje(string sVrijednost)
        {

            String sTmp;
            sTmp = sVrijednost.Replace("{razmak}", " ");
            sTmp = sTmp.Replace("{}", "");
            sTmp = sTmp.Replace("{NoviRed}", "\r\n");




            return sTmp;
        }
        public static Boolean Da2True(string sVrijednost)
        {

            Boolean sTmp;
            sTmp = sVrijednost == "DA" ? true : false;

            return sTmp;
        }

        public static String Podatak(String sP, String sPolje, String sK)
        {


            String tmp = "";
            try
            {
                if (!String.IsNullOrEmpty(sPolje))
                {
                    tmp = sP + sPolje + sK;
                }

            }
            catch
            {

                tmp = "greška";

            }
            return tmp;

        }


        public static String Sazeto_vrijeme(Boolean Period, String Opis, String vVrijednost, String JEDINICA, String Opis2, String Vrijednost2, String Jedinica2, int vrijeme_od, int vrijeme_do, Boolean bJedinica, Boolean bPrvaJedinica)
        {
            String myVr;


            if (Period)
            {
                if (!bPrvaJedinica)
                {
                    if (object.Equals(JEDINICA, Jedinica2))
                    {
                        JEDINICA = "";
                    };
                };
                myVr = Podatak("", Opis.ToString(), " ") + Podatak("", vVrijednost.ToString(), " ") + JEDINICA;
                Vrijednost2 = Sredi_tocku_za_vrijeme(Vrijednost2);
                myVr += "-" + Opis2 + " " + Vrijednost2 + " " + Jedinica2;

            }
            else
            {
                myVr = Podatak("", Opis.ToString(), " ") + Podatak("", vVrijednost.ToString(), " ") + JEDINICA;
            };
            return myVr;
        }

        public static String TermPojam(String sTablica, int sID)
        {
            String tmp = "";
            SqlConnection sqlConnection1 = new SqlConnection(ConfigurationManager.ConnectionStrings["M_DATA_HPM_ADO"].ConnectionString);
            SqlCommand cmd = new SqlCommand();
            SqlDataReader rsTerm;

            cmd.CommandText = "SELECT * FROM dbo." + sTablica + " WHERE IDT=" + sID ;
            cmd.CommandType = CommandType.Text;
            cmd.Connection = sqlConnection1;

            sqlConnection1.Open();

                       rsTerm = cmd.ExecuteReader();


                       if (rsTerm.HasRows)
                       {
                           rsTerm.Read();
                           tmp = (string)rsTerm["Pojam"];
                       }
                       sqlConnection1.Close();

            return tmp;

            
        }

        public static String Sredi_tocku_za_vrijeme(string vVrijednost)
        {
            String tmp;

            if (String.IsNullOrEmpty(vVrijednost.ToString()))
            {
                tmp = "";
            }
            else
            {
                tmp = vVrijednost.ToString().Trim();
                if (tmp.Substring(tmp.Length - 1, 1) != ".")
                {
                    tmp = tmp + ".";
                }
            }

            return tmp;

        }

        
    }
}

