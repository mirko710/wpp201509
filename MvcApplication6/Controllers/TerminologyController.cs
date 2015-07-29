using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace WMpp.Controllers
{
    public class TerminologyController : ApiController
    {
        public static TerminologyClasses TCInstance = new TerminologyClasses();


        [HttpGet]
        public IEnumerable<string> GetRealValue()
        {
            //var context = new M_DATA_HPMEntities();
            //var qry=context.Database.SqlQuery<Int64>("SELECT ID_Broj from dbo.tbl_Kartica where ID_Broj IN (select id_broj from tbl_Izrada where IZR_IDT_Mjesto=
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [HttpGet]
        public object Get(int poljeID, int i2,string tableName)
        {
            //podzapisi

            var resultTreeView = new List<WMpp.TerminologyClasses.treeItem>();
            resultTreeView = TCInstance.TreeViewStructure(tableName);


            return resultTreeView;



           // return "value";
        }

        [HttpGet]
       // public List<TerminologyClasses.treeItem> GetTreeView(string tableName)
        public object Get(string tableName)
        {


            
            var resultTreeView = TCInstance.TreeViewStructure(tableName);//new List<WMpp.TerminologyClasses.treeItem>();
            //resultTreeView = T


            return resultTreeView;


        }

        public object Get(string tableName,string orderBy,string filterBy)
        {
            //ovo treba bolje napraviti, sa parametrima...
            var resultTableView = TCInstance.getDataTable(tableName,orderBy,filterBy);
            //resultTreeView = TCInstance.getDataTable(@"Select * FROM " + tableName + " WHERE " + filterBy + " OrderBy " + orderBy );

            return resultTableView;


        }
 

            //return true;
    }
}
