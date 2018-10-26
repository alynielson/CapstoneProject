using System.Collections.Generic;

namespace CapstoneProject.ViewModels
{
    public class GroupVM
    {
        public string name { get; set; }

        public string city { get; set; }

        public string state { get; set; }

        public string description { get; set; }

        public IEnumerable<int> members { get; set; }

        public int userId { get; set; }

        public string owner { get; set; }

        public IEnumerable<string> memberNames { get; set; }

        public int groupId { get; set; }
      
    }
}
