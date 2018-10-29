using System;

namespace CapstoneProject.ViewModels
{
    public class UserEventVM
    {
        public DateTime date { get; set; }

        public string name { get; set; }

        public DateTime time { get; set; }
      

        public string organizer { get; set; }

        public bool going { get; set; }

        public int eventId { get; set; }
    }
}
