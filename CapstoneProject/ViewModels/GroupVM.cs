using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CapstoneProject.ViewModels
{
    public class GroupVM
    {
        public string name { get; set; }

        public string city { get; set; }

        public string state { get; set; }

        public string description { get; set; }

        public int[] members { get; set; }

        public int userId { get; set; }
      
    }
}
