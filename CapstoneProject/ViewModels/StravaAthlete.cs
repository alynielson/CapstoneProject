using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CapstoneProject.ViewModels
{
    public class StravaAthlete
    {
        public string access_token { get; set; }

        public string token_type { get; set; }

        public Athlete athlete { get; set; }
        
    }

    public class Athlete
    {
 
        public int id { get; set; }

        public string username { get; set; }

        public int resource_state { get; set; }

        public string firstname { get; set; }

        public string lastname { get; set; }

        public string city { get; set; }

        public string state { get; set; }

        public string country { get; set; }

        public string sex { get; set; }

        public bool premium { get; set; }

        public string created_at { get; set; }

        public string updated_at { get; set; }
    }
}
