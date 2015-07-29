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
    public class regRezController : ApiController
    {


 
        public class upiti
        {
            public int idtZbirka { get; set; }
            public string polje { get; set; }
   
        }

        public class rezultati 
        {
            public int ID_Broj {get; set;}
            public string KRT_Inventarni_broj {get; set;}
            public int KRT_IDT_Zbirka { get; set; }
            public string MC_Staza_slike { get; set; }
            public bool imaDataciju { get; set; }
            public bool imaFotku { get; set; }
            public bool imaAutora { get; set; }
            public bool imaNaziv { get; set; }
            public bool imaNaslov { get; set; }
            public bool imaMjera { get; set; }
            public bool imaMaterijala { get; set; }
            public bool odabrano { get; set; }


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
        public object Post(upiti upit)
        {

            string value = "select k.*,x.*,0 as odabrano from dbo.vw_Web_Rezultati k left join (SELECT * FROM [M_DATA_HPM].[dbo].[neupisaniRegistracijaWrapper] (" + upit.idtZbirka + ",-1)) x ";
                    value+=" on k.ID_Broj=x.ID_Broj ";
                    value+=" where k.KRT_IDT_Zbirka=12 and x.imaDataciju=1 ";
                    value += " order by k.KRT_SORT_Inv_br; ";



           using( var context = new M_DATA_PPMHP_WEBEntities())
           {
            var qry = context.Database.SqlQuery<rezultati>(value);
               
            return qry.ToList();
           }

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
