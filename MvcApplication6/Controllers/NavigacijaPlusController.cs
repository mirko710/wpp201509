using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WMpp;
using EFDL;

namespace WMpp.Controllers
{
    public class NavigacijaPlusController : ApiController
    {


        public class parametarZaZbirku
        {
            public int zbirka { get; set; }
        }

        public class NovaNavigacija
        {
            public int KRT_IDT_Zbirka { get; set; }
            public int ID_Broj { get; set; }
            public string KRT_Inventarni_broj { get; set; }
            public string imaDataciju { get; set; }
            public string imaFotku { get; set; }
            public string imaAutora { get; set; }
            public string imaMjesta { get; set; }
            public string imaNaziv { get; set; }
            public string imaNaslov { get; set; }
            public string imaMjera { get; set; }
            public string imaMaterijala { get; set; }

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




        // POST api/NavigacijaPlus
        //public NovaNavigacija[] Post(int zbirka)
        public object Post(parametarZaZbirku xZbirka)
        {

            object x = new object();
            var context = new M_DATA_PPMHP_WEBEntities();

            //var nn= context.neupisaniRegistracijaWrapper2(xZbirka.zbirka, -1);
            var nn = context.tbl_T_Ocuvanosti.Select(z=>z.IDT >0);
                //brojid = context.tbl_Kartica.Where(k => k.ID_Broj == maxIDT).FirstOrDefault().AutoBroj;


            x = nn.ToList();

                context.Dispose();
            


            return x;

        }

        //// PUT api/values/5
        //public void Put(int id, [FromBody]string value)
        //{
        //}

        //// DELETE api/values/5
        //public void Delete(int id)
        //{
        //}
    }
}
