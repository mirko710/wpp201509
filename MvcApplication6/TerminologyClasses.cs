using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Configuration;
using System.Web.Script.Serialization;


namespace WMpp
{

    public class TerminologyClasses
    {

        string conn = ConfigurationManager.ConnectionStrings["M_DATA"].ToString();

        public class treeItem
        {
            public int IDT { get; set; }
            public string Pojam { get; set; }
            public Nullable<int> Nad_IDT { get; set; }
            public virtual ICollection<treeItem> podTermini { get; set; }
        }

        public class tableItem
        {
            public int IDT { get; set; }
            public string Pojam { get; set; }
            public Nullable<int> Nad_IDT { get; set; }
            public Nullable<int> Ucestalost { get; set; }
            public string Napomena { get; set; }
            public string NadPojam { get; set; }
            public string Biljeske { get; set; }
            public bool Odabrano { get; set; }

        }



        public List<tableItem> getDataTable(string tableName, string orderBy, string filterBy)
        {


            string sqlString = string.Format("Select T.*,T1.Pojam as NadPojam FROM {0} as T Left join {0} as T1 on (T.Nad_IDT=T1.IDT) order by {1}",tableName, orderBy);
            if (!String.IsNullOrEmpty(filterBy) && filterBy != "true")
            {
                sqlString = string.Format("Select T.*,T1.Pojam as NadPojam FROM {0} as T Left join {0} as T1 on (T.Nad_IDT=T1.IDT) Where (T.Pojam LIKE @filterBy OR  T1.Pojam LIKE @filterBy OR T.Napomena LIKE @filterBy) order by {1}", tableName, orderBy);
            }


            var podaci = new List<tableItem>();
            using (SqlConnection scon = new SqlConnection(conn))
            {
                using (SqlCommand scom = new SqlCommand())
                {
                    scom.Connection = scon;
                    scon.Open();


                    scom.CommandText = @sqlString;
                    scom.Parameters.AddWithValue("@filterBy", '%' + filterBy + '%');
                   


                    try
                    {

                        SqlDataReader dr = scom.ExecuteReader();
                        while (dr.Read())
                        {
                            var tmp = new tableItem();

                            tmp.IDT = dr.GetInt32(dr.GetOrdinal("IDT"));

                            tmp.Ucestalost = dr.GetInt32(dr.GetOrdinal("Ucestalost"));
                            tmp.Napomena =dr["Napomena"].ToString();
                            tmp.Biljeske = dr["Biljeske"].ToString();


                            if (!dr.IsDBNull(dr.GetOrdinal("Nad_IDT")))
                            {
                                tmp.Nad_IDT = dr.GetInt32(dr.GetOrdinal("Nad_IDT"));
                                tmp.NadPojam = dr["NadPojam"].ToString() ;
                            }
                            //tmp.Nad_IDT = dr.GetInt32(dr.GetOrdinal("Nad_IDT"));
                            tmp.Pojam = dr["Pojam"].ToString();
                            //var tmp2 = dr.Cast<List<tableItem>>();

                            //tmp.upiti =new JavaScriptSerializer().Deserialize<upiti>(dr["upiti"].ToString());
                            podaci.Add(tmp);
                        }
                        dr.Close();

                    }
                    catch (SqlException e)
                    {
                        System.Diagnostics.Debug.WriteLine(e);
                    }
                }
            }
            return podaci;



        }

        public List<treeItem> getData(string sql)
        {

            var upits = new List<treeItem>();
            using (SqlConnection scon = new SqlConnection(conn))
            {
                using (SqlCommand scom = new SqlCommand())
                {
                    scom.Connection = scon;
                    scon.Open();


                    scom.CommandText = @sql;


                    try
                    {

                        SqlDataReader dr = scom.ExecuteReader();
                        while (dr.Read())
                        {
                            var tmp = new treeItem();

                            tmp.IDT = dr.GetInt32(dr.GetOrdinal("IDT"));
                            if (!dr.IsDBNull(dr.GetOrdinal("Nad_IDT")))
                            {
                                tmp.Nad_IDT = dr.GetInt32(dr.GetOrdinal("Nad_IDT"));
                            }
                            //tmp.Nad_IDT = dr.GetInt32(dr.GetOrdinal("Nad_IDT"));
                            tmp.Pojam = dr["Pojam"].ToString();
                            //var tmp2 = dr.Cast<List<tableItem>>();

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

        public List<treeItem> TreeViewStructure(string tableName)
        {
            List<treeItem> TI = new List<treeItem>();

            List<treeItem> firstLevel = new List<treeItem>();
            List<treeItem> underLevel = new List<treeItem>();
            firstLevel=getData(@"Select IDT,Nad_IDT,Pojam from dbo." + tableName + " where Nad_IDT IS NULL order by Pojam");
            underLevel = getData(@"Select IDT,Nad_IDT,Pojam from dbo." + tableName + " where Nad_IDT IS NOT NULL order by Pojam");


            List<List<treeItem>> hierarchyTemp = new List<List<treeItem>>();

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


                        hierarchyTemp[i][j].podTermini = z;
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
    }   
}