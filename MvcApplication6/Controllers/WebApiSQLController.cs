using System.Collections.Generic;
using System.Configuration;
using System.Web.Http;


namespace WMpp.Controllers
{
    public class WebAPISQLController : ApiController
    {

        //if (i1 == 1)//defStruktura
        //if (i1 ==2)//defVrijeme
        //if (i1 == 3)//getUpiti
        //if (i1 == 4)//getRefiners
        //if (i1 == 5)//gettermBucketUpiti
        //if (i1 == 6)//getnavigacijaPretrazivanje
        //if (i1 == 7)//Registracija iz Pretrazivanja
        //if (i1 == 8)//zbirke
        //if (i1 == 9)//registracija po zbirci
        //if (i1 == 10)//gettermBucketUpis
        //if (i1 == 11)//getRefinerePoKategoriji

        public enum getApiOpcije
        {
            defStruktura=1,
            defVrijeme,
            getUpiti,
            getRefiners,
            getTermBucket,
            getNavigacijaPretrazivanje,
            getRegistracijaPretrazivanje,
            getZbirkeZaHome,
            getRegistracijaPoZbirci,
            getTermBucketUpis,
            getRefinerePoKategoriji
        }

        string conn = ConfigurationManager.ConnectionStrings["M_DATA"].ToString();

        SEClasses SEC = new SEClasses();
        zaPDF zPDF = new zaPDF();
        mDoc msDoc = new mDoc();

        [HttpGet]
        public string AutocompleteDLookup(string tablica, int IDT,int i2, int i3,int i4,int i5,int i6,int i7,int i8)
        {
            var s1 = SEC.GetAutocompleteDLookup(conn, tablica, IDT);
            return s1;
        }

        [HttpGet]
      public List<SEClasses.termDropDown> zaAutocomplete(string tablica, string term)
        {
            var s1 = new List<SEClasses.termDropDown>();
            s1 = SEC.GetAutocomplete(conn,tablica,term);
            return s1;
        }

        [HttpGet]
        public string GetDoc(int i1, int i2, int i3, int i4, int i5, int i6,int i7, string sifra)
        {

            var s1 = new List<SEClasses.rezultati>();

            s1 = SEC.GetMPageChecked(conn, sifra, i1, i2);


            string datoteka = "slikTestTab2.docx";
            msDoc.openWord(s1);


            return datoteka;


        }

        //[HttpGet]
        //public HttpResponseMessage OLDGetDoc(int i1, int i2, int i3, int i4, int i5, int i6, int i7, string sifra)
        //{




        //    var s1 = new List<SEClasses.rezultati>();

        //    s1 = SEC.GetMPageChecked(conn, sifra, i1, i2);


        //    string datoteka = "slikTestTab2.docx";
        //    msDoc.openWord(s1);


        //    var path = System.Web.HttpContext.Current.Server.MapPath("~/Content/" + datoteka);
        //    HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
        //    var stream = new FileStream(path, FileMode.Open);
        //    result.Content = new StreamContent(stream);
        //    result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
        //    result.Content.Headers.ContentDisposition.FileName = Path.GetFileName(path);
        //    result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
        //    result.Content.Headers.ContentLength = stream.Length;
        //    return result;


        //}

        //[HttpGet]
        //public HttpResponseMessage OLDGetPdf(int i1, int i2, int i3, int i4, int i5, int i6, string sifra)
        //{

        //    var s1 = new List<SEClasses.rezultati>();

        //    s1 = SEC.GetMPage(conn, sifra, i1, i2);


        //    string datoteka = "nekiPdf.pdf";
        //    zPDF.MakePdf(datoteka, s1);


        //    var path = System.Web.HttpContext.Current.Server.MapPath("~/Content/" + datoteka);
        //    HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
        //    var stream = new FileStream(path, FileMode.Open);
        //    result.Content = new StreamContent(stream);
        //    result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
        //    result.Content.Headers.ContentDisposition.FileName = Path.GetFileName(path);
        //    result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
        //    result.Content.Headers.ContentLength = stream.Length;
        //    return result;


        //}
        [HttpGet]
        public string GetPdf(int i1, int i2, int i3, int i4, int i5, int i6, string sifra)
        {

            var s1 = new List<SEClasses.rezultati>();

            s1 = SEC.GetMPage(conn, sifra,i1,i2); 


            string datoteka = "nekiPdf.pdf";
            zPDF.MakePdf(datoteka,s1);

            return datoteka;   

            
        }

        [HttpPost]
        public object Post(SEClasses.praviUpitTip upit,int  upitID, string zzz,string saveAZ)
        {
            int s1 = -1;
            if (upitID < 0)
            {
                s1 = SEC.NoviUpit(conn);
            }
            else
            {
                s1 = SEC.KopirajUpit(conn,upitID,upit);
            }
            var upiti = new List<SEClasses.saveUpit>();
            upiti = SEC.UcitajUpite(conn);

            return new { upitID = s1, upitiLista = upiti };//qry.Take(30).ToList();
        }

        [HttpPost]
        public object Post(int upitID,string zzz)
        {
            int s1 = -1;
            if (upitID < 0)
            {
                s1 = SEC.NoviUpit(conn);
            }

            var upiti = new List<SEClasses.saveUpit>();
            upiti = SEC.UcitajUpite(conn);
            
            return new {upitID=s1,upitiLista=upiti};//qry.Take(30).ToList();
        }

        [HttpPost]
        public object Post(int upitID)
        {

            int s1 = SEC.BrisiUpit(conn, upitID);

            return s1;//qry.Take(30).ToList();
        }
        

        [HttpPost]
        public int Post(string sifra,int ID_Broj, int odabrano,int sve)
        {

            int brojOdabranih=SEC.SetOdabrano(conn, sifra, ID_Broj, odabrano,sve==1?true:false);

            return brojOdabranih;//qry.Take(30).ToList();
        }


        [HttpPost]
        public int Post(SEClasses.praviUpitTip upit, string ime, int upitID)
        {

            int s1 = SEC.SpremiUpit(conn, ime, upit, upitID);

            return s1;//qry.Take(30).ToList();
        }



        // POST api/values
        [HttpPost]
        public object Post(SEClasses.praviUpitTip upit)
        {
            var s1 = new SEClasses.doubleLoad();
            
            s1 = SEC.MPretrazivanje(conn, upit); 

            return s1;//qry.Take(30).ToList();
        }


        //[HttpGet]
        //public object GetTerms(int nemaVeze, string tablice)
        //{

        //    var bucket = new Dictionary<string, List<SEClasses.termDropDown>>();
        //    bucket = SEC.GetTerms(conn); 
        //    return bucket;
        //}


        [HttpGet]
        public object GetStruktura(int i1, int i2, string i3)
        {
            object returnObject = new object();
            getApiOpcije gAO = (getApiOpcije)i1;
            if (gAO == getApiOpcije.defStruktura)//defStruktura
            {
                var poljaUpit = new List<SEClasses.defStrukt>();
                poljaUpit = SEC.GetStruktura(conn);
                SEC.LoadUpitiPravila();
                returnObject= poljaUpit;
            }
            if (gAO == getApiOpcije.defVrijeme)
            {
                var poljaVrijeme = new List<SEClasses.defVrijeme>();
                poljaVrijeme = SEC.GetDefVrijeme(conn);
                returnObject= poljaVrijeme;
            }

            if (gAO == getApiOpcije.getUpiti)
            {
                var upiti = new List<SEClasses.saveUpit>();
                upiti = SEC.UcitajUpite(conn);
                returnObject= upiti;
            }

            if (gAO == getApiOpcije.getRefinerePoKategoriji)
            {
                var zzz = new List<SEClasses.refiner>();
                zzz = SEC.GetRefinerePoKategoriji(conn,  i3);
                returnObject = zzz;
            }

            if (gAO == getApiOpcije.getRefiners)
            {
                var zzz = new List<SEClasses.refinerModel>();
                zzz = SEC.GetRefiners(conn);
                returnObject= zzz;
            }

            if (gAO == getApiOpcije.getTermBucket)
            {
                var bucket = new Dictionary<string, List<SEClasses.termDropDown>>();
                bucket = SEC.GetTerms(conn," loadTable='upitSelect'");
                returnObject= bucket;
            }
            if (gAO == getApiOpcije.getTermBucketUpis)
            {
                var bucket = new Dictionary<string, List<SEClasses.termDropDown>>();
                bucket = SEC.GetTerms(conn, " 1=1 ");
                returnObject = bucket;
            }


            if (gAO == getApiOpcije.getNavigacijaPretrazivanje)
            {
                var navigacija = new List<SEClasses.navigacijaDropDown>();
                navigacija = SEC.GetNavigacija(conn,i3);
                returnObject = navigacija;
            }

            if (gAO == getApiOpcije.getRegistracijaPretrazivanje)
            {
                var navigacija = new List<SEClasses.zaRegistraciju>();
                navigacija = SEC.GetNavigacijaRegistracijaSifra(conn, i3,-1);
                returnObject = navigacija;
            }

            if (gAO == getApiOpcije.getZbirkeZaHome)
            {
                var navigacija = new List<SEClasses.homeTreeZbirke>();
                navigacija = SEC.GetZbirkeZaHome(conn);
                returnObject = navigacija;
            }

            if (gAO == getApiOpcije.getRegistracijaPoZbirci)
            {
                var navigacija = new List<SEClasses.zaRegistraciju>();
                navigacija = SEC.GetNavigacijaRegistracijaSifra(conn, "-1",int.Parse(i3));
                returnObject = navigacija;
            }

            return returnObject;
        }

        //[HttpGet]
        //public object GetDefVremena(int i1, int i2, int i3,int i4,int i5)
        //{
        //    var poljaVrijeme = new List<SEClasses.defVrijeme>();
        //    poljaVrijeme = SEC.GetDefVrijeme(conn);
        //    return poljaVrijeme;
        //}

        //[HttpGet]
        //public object GetUpiti(int i1, int i2, int i3, int i4, int i5,int i6)
        //{
        //    var upiti = new List<SEClasses.saveUpit>();
        //    upiti = SEC.UcitajUpite(conn);
        //    return upiti;
        //}

        //[HttpGet]
        //public object GetRefiners(int i1, int i2, int i3, int i4)
        //{
        //    var zzz = new List<SEClasses.refinerModel>();
        //    zzz = SEC.GetRefiners(conn);
        //    return zzz;

        //}

        [HttpGet]
        public List<SEClasses.rezultati> GetPage(string sifra, int pageSize, int pageIndex)
        {
            var zzz = new List<SEClasses.rezultati>();
            zzz = SEC.GetMPage(conn, sifra, pageSize, pageIndex);
            return zzz;

        }


        //var c = UcitajUpite(conn);



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
