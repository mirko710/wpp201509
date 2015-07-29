using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WMpp;

namespace WMpp.Controllers
{
    public class BrisiZapisController : ApiController
    {


        public class noviZapis
        {
            public int ID { get; set; }
            public string tablica { get; set; }

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



 
        
        public int Post(noviZapis zapis)
        {
            
            int rows=-1;
            string query = "";
            //var context = new M_DATA_HPMEntities();

            using (var context = new M_DATA_HPMEntities())
            {
                if (zapis.tablica == "tblNazivi") { 
                    //query = "DELETE FROM [dbo].[tbl_Nazivi] WHERE [ID]={0}";
                    tbl_Nazivi rez1=context.tbl_Nazivi.FirstOrDefault(x=> x.ID ==zapis.ID)  ;
                    context.tbl_Nazivi.Remove(rez1);
                }
                if (zapis.tablica == "Mjere")
                {
                    query = "DELETE FROM [dbo].[tbl_Mjere] WHERE [ID]={0}";
                }

                if (zapis.tablica == "tblNaslovi")
                {
                    query = "DELETE FROM [dbo].[tbl_Naslovi] WHERE [ID]={0}";
                }

                if (zapis.tablica == "tblMiT")
                {
                    query = "DELETE FROM [dbo].[tbl_U_Materijali_u_dijelovima] WHERE [ID]={0}";
                }

                if (zapis.tablica == "Izrada")
                {
                    query = "DELETE FROM [dbo].[tbl_Naslovi] WHERE [ID]={0}";
                }

                //rows = context.Database.ExecuteSqlCommand(query, zapis.ID);
                // rows >= 1 - count of deleted rows,
                // rows = 0 - nothing to delete.
                try
                {
                    context.SaveChanges();
                    // brojid=fixID_Broj(maxIDT);
                    
                }
                catch
                {
                    string errooorrr = "GREŠKQ";
                }
            }



            return rows;

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
