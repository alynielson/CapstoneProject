

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

        public bool summit { get; set;}

        public int badge_type_id { get; set; }

        public string profile_medium { get; set; }

        public string profile { get; set; }

        public string friend { get; set; }
        public string follower { get; set; }

        public string email { get; set; }

    }
}
