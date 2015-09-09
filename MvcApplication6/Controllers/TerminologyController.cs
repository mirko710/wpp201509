using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WMpp.Core;
using WMpp.Core.DB;
using WMpp.Core.DB.Query.IncludeParentDataQuery;
using WMpp.Core.Mapping;
using WMpp.Core.VM;

namespace TerminologyEdit.Controllers
{
    public class TerminologyController : ApiController
    {
        #region Helper methods
        private TerminologyService getService(string tableName)
        {
            if (!TableManager.Singleton.TableExists(tableName))
                throw new UserException("Tražena tablica ne postoji ili nije dozvoljen rad.");

            return new TerminologyService(TableManager.Singleton[tableName]);
        }

        private void throwCritical (string Content)
        {
            throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.InternalServerError)
            {
                Content = new StringContent(Content),
                ReasonPhrase = "Critical Exception"
            });
        }

        private void throwMessage(string Content)
        {
            throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.InternalServerError)
            {
                Content = new StringContent(Content),
                ReasonPhrase = "Message"
            });
        }

        #endregion

        #region Select & Delete

        // vraća popis terminoloških tablica
        public object GetTablice ()
        {
            try
            {
                return Table_TableVMMapping.GetIListTableVM(TableManager.Singleton.GetListOfTables());
            }
            catch (Exception ex)
            {
                this.throwCritical("Pogreška kod učitavanja tablica");
            }
            return null;
        }

        [HttpGet]
        
        // mode=TreeView. Ako je id=-1, vraća vršne pojmove. Inače vraća djecu
        // mode=Item. Vraća sve podatke za id
        // mode=Delete. Briše redak s idom id
        public object Get(string mode, string tableName, int id)
        {
            if (mode == "TreeView")
            {
                try
                {
                    return getService(tableName).TreeViewStructure(id);
                }
                catch (Exception ex)
                {
                    this.throwCritical("Pogreška kod učitavanja strukture podataka");
                }
            }
            else if (mode == "Item")
            {
                try
                {
                    return getService(tableName).Select(id);
                }
                catch
                {
                    this.throwCritical("Pogreška kod učitavanja stavke");
                }
            }
            else if (mode == "Delete")
            {
                try
                {
                    getService(tableName).Delete(id);
                }
                catch (UserException uex)
                {
                    this.throwMessage(uex.Message);
                }
                catch
                {
                    this.throwCritical("Pogreška kod brisanja stavke");
                }
            }
            else if (mode == "CheckDelete")
            {
                try
                {
                    return new { Children = getService(tableName).Table.GetChildrenIDsRecursively(id).Count,
                        Recommended = getService(tableName).GetTermsForWhichTheTermIsRecommended(id) };
                }
                catch (UserException uex)
                {
                    this.throwMessage(uex.Message);
                }
                catch (Exception ex)
                {
                    this.throwCritical("Pogreška kod provjere mogućnosti brisanja");
                }
            }

            return Request.CreateResponse(HttpStatusCode.OK, "");

        }

        // Vraća tablicu
        // ako je pageNumber -1, vraća sve retke
        // inače vraća samo zahtijevanu stranicu
        public object Get(string mode, string tableName, string orderBy, string filterBy, int pageNumber, int itemsPerPage, int id)
        {
            if (mode == "Table")
            {
                try
                {
                    PagingInfo pagingInfo = new PagingInfo() {PageNumber = pageNumber, ItemsPerPage = itemsPerPage};

                    return getService(tableName).getDataTable(orderBy, filterBy, pagingInfo, id);
                }
                catch (Exception ex)
                {
                    this.throwCritical("Pogreška kod učitavanja tablice s podacima");
                }
            }
                
            if (mode == "PageNumber")
                try
                {
                    return new TableDataVM() { PageNumber = getService(tableName).getPageNumber(orderBy, filterBy, id, itemsPerPage) };
                }
                catch (Exception ex)
                {
                    this.throwCritical("Pogreška kod dohvaćanja stranice");
                }
            return null;
        }
        #endregion

        #region Update

        public HttpResponseMessage PutDataItem(int id, TableRowEM dataItem)
        {
            try
            {
                getService(dataItem.Tablica).Update(dataItem);
            }
            catch (UserException uex)
            {
                this.throwMessage(uex.Message);
            }
            catch (Exception ex)
            {
                this.throwCritical("Pogreška kod ažuriranja stavke");
            }

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        #endregion

        #region Insert
        public HttpResponseMessage PostDataItem(TableRowEM dataItem)
        {
            try
            {
                getService(dataItem.Tablica).Insert(dataItem);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, dataItem);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = dataItem.IDT }));
                return response;
            }
            catch (UserException uex)
            {
                this.throwMessage(uex.Message);
            }
            catch (Exception ex)
            {
                this.throwCritical("Pogreška kod umetanja stavke");
            }
            return null;
        }

        #endregion
    }
}
