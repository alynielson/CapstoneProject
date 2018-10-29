using System.Collections.Generic;

namespace CapstoneProject.ViewModels
{
    public class InitialEventVM
    {
        public string name { get; set; }

        public string description { get; set; }

        public string date { get; set; }

        public string time { get; set; }

        public int userId { get; set; }

        public List<GroupSnapshotVM> groups { get; set; }
    }




}