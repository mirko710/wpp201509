using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;

namespace WMpp.Core.DB.Operation
{
    public abstract class OperationBase
    {
        protected SqlTransaction transaction;
        protected readonly bool inheritedTransaction;

        protected SqlConnection connection
        {
            get { return this.transaction.Connection; }
        }

        protected OperationBase()
        {
            this.beginTransaction();
        }
        protected OperationBase(OperationBase callingOperation)
        {
            if (callingOperation != null)
            {
                this.transaction = callingOperation.transaction;
                this.inheritedTransaction = true;
            }
            else
                this.beginTransaction();
        }

        private void beginTransaction()
        {
            SqlConnection newConnection = new SqlConnection(Database.ConnectionString);
            newConnection.Open();
            transaction = newConnection.BeginTransaction();
        }

        protected SqlCommand createCommand()
        {
            SqlCommand result = connection.CreateCommand();
            result.Transaction = transaction;
            return result;
        }

        public void Execute()
        {
            try
            {
                execute();

                if (!inheritedTransaction)
                    transaction.Commit();
            }
            catch (Exception)
            {
                if (!inheritedTransaction)
                {
                    transaction.Rollback();
                    if (connection.State == ConnectionState.Open)
                        connection.Close();
                }
                throw;
            }
        }

        protected abstract void execute();
    }
}