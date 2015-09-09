using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using WMpp.Core.DB.Operation;
using WMpp.Core.DB.Operation.TableRowOperation;
using WMpp.Core.VM;

namespace WMpp.Core.DB
{
    public class TableRow
    {
        public Table Table { get; }
        public int? IDT { get; set; }
        public int? Nad_IDT { get; set; }
        public int? Preporuceni_IDT { get; set; }
        public string Pojam { get; set; }
        public string Napomena { get; set; }
        public int? Ucestalost { get; set; }

        public string Odgovornost { get; set; }
        public string Biljeske { get; set; }
        public string Reference { get; set; }

        public int AutoBroj { get; set; }

        public TableRow(Table table, int? idt, int? preporuceniIDT, int? nadIDT, string pojam, string napomena, int? ucestalost, string biljeske, string reference, string odgovornost)
        {
            this.Table = table;
            IDT = idt;
            Preporuceni_IDT = preporuceniIDT;
            Nad_IDT = nadIDT;
            Pojam = pojam;
            Napomena = napomena;
            Ucestalost = ucestalost;
            Biljeske = biljeske;
            Reference = reference;
            Odgovornost = odgovornost;
        }

        public TableRow(Table table, int? idt)
        {
            this.Table = table;
            IDT = idt;
        }

        public bool ContainsCircularReference()
        {
            CheckCircularReferenceOperation operation = new CheckCircularReferenceOperation(this);
            operation.Execute();
            return operation.Result;
        }

        public void Insert()
        {
            new InsertOperation(this).Execute();
        }

        public void Update()
        {
            new UpdateOperation(this).Execute();
        }

        public void ChangeIDT(int newIDT)
        {
            ChangeIDTOperation operation = new ChangeIDTOperation(this, newIDT);
            operation.Execute();
            this.IDT = newIDT;
        }

        public IList<TableRow> GetParents()
        {
            GetParentsOperation operation = new GetParentsOperation(this);
            operation.Execute();
            return operation.Result;
        }

        public TableRow GetRecommendedTerms()
        {
            if (!this.Preporuceni_IDT.HasValue)
                return null;

            return Table.FindByIDT(Preporuceni_IDT.Value);
        }

        public IList<TableRow> GetTermsForWhichTheTermIsRecommended()
        {
            GetTermsForWhichTheTermIsRecommended operation = new GetTermsForWhichTheTermIsRecommended(this);
            operation.Execute();

            return operation.Result;
        }

        
    }
}