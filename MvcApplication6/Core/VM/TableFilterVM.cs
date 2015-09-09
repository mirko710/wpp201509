using System.Text.RegularExpressions;

namespace WMpp.Core.VM
{
    public class TableFilterVM
    {
        public string Pojam { get; set; }
        public string PreporuceniPojam { get; set; }
        public string NadPojam { get; set; }
        public string Napomena { get; set; }
        public string Ucestalost { get; set; }
        public string Odgovornost { get; set; }

        public bool HasData { get; private set; }


        public TableFilterVM(string filterBy)
        {
            this.create(filterBy);
        }

        Regex regexGlobal = new Regex("(?<expression>([^,]|(,,))+)");
        Regex regexExpression = new Regex("(?<name>([^=]|(==))+)=(?<value>([^=]|(==))+)");
        private void create(string filterBy)
        {
            if (filterBy == null)
                return;

            foreach (Match expressionMatch in regexGlobal.Matches(filterBy))
            {
                if (!expressionMatch.Success)
                    continue;

                processExpression(expressionMatch);
            }
        }

        private void processExpression(Match expressionMatch)
        {
            string expressionValue = expressionMatch.Groups["expression"].Value;
            expressionValue = expressionValue.Replace(",,", ",");

            Match match = regexExpression.Match(expressionValue);
            if (!match.Success)
                return;

            string name = match.Groups["name"].Value;
            string value = match.Groups["value"].Value;

            assignValueToProperty(name, value);
            HasData = true;
        }

        private void assignValueToProperty(string name, string value)
        {
            switch (name)
            {
                case "Pojam":
                    Pojam = value;
                    break;
                case "PreporuceniPojam":
                    PreporuceniPojam = value;
                    break;
                case "NadPojam":
                    NadPojam = value;
                    break;
                case "Napomena":
                    Napomena = value;
                    break;
                case "Ucestalost":
                    Ucestalost = value;
                    break;
                case "Odgovornost":
                    Odgovornost = value;
                    break;
            }
        }
    }
}