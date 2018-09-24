using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CapstoneProject.ViewModels
{
    public class UserVM
    {
        public string first_name { get; set; }
        public string last_name { get; set; }
        public string password { get; set; }
        public string email { get; set; }
    }

    public class UserLocationVM
    {
        public int id { get; set; }
        public string city { get; set; }
        public string state { get; set; }
    }
    
}
