using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CapstoneProject.ViewModels
{
    public class LoggedInUserVM
    {
        public string first_name { get; set; }

        public string last_name { get; set; }

        public string location { get; set; }

        public int id { get; set; }
    }

    public class LogInAttempt
    {
        public string email { get; set; }
        public string password { get; set; }
    }
}
