using System;

namespace WMpp.Core
{
    public class UserException : Exception
    {
        public UserException(string message, Exception innerException)
            : base(message, innerException)
        {

        }

        public UserException(string message)
            : this(message, null)
        {

        }
    }
}