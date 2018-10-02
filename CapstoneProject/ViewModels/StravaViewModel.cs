using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CapstoneProject.ViewModels
{
    public class StravaViewModel
    {
        List<Activity> activities { get; set; }
    }

    public class BaseInfo
    {
        public int id { get; set; }
        public int resource_state { get; set; }
    }
    public class Map
    {
        public string id { get; set; }
        public string summary_polyline { get; set; }
        public int resource_state { get; set; }
    }
    public class Activity
    {
        public int resource_state { get; set; }

        public BaseInfo athlete { get; set; }

        public string name { get; set; }

        public string distance { get; set; }

        public int moving_time { get; set; }
        public int elapsed_time { get; set; }

        public int total_elevation_gain { get; set; }

        public string type { get; set; }

        public string workout_type { get; set; }

        public int id { get; set; }
        public string external_id { get; set; }
        public int upload_id { get; set; }
        public DateTime start_date { get; set; }
        public DateTime start_date_local { get; set; }
        public string timezone { get; set; }
        public int utc_offset { get; set; }
        public string start_latlng { get; set; }
        public string end_latlng { get; set; }
        public string location_city { get; set; }
        public string location_state { get; set; }
        public string location_country { get; set; }
        public string start_latitude { get; set; }
        public string start_longitude { get; set; }
        public int achievement_count { get; set; }
        public int kudos_count { get; set; }
        public int comment_count { get; set; }
        public int athlete_count { get; set; }
        public int photo_count { get; set; }
        public Map map { get; set; }
        public bool trainer { get; set; }
        public bool commute { get; set; }
        public bool manual { get; set; }
        public bool Private { get; set; }
        public bool flagged { get; set; }
        public string gear_id { get; set; }
        public bool from_accepted_tag {get; set;}
        public decimal average_speed { get; set; }
        public decimal max_speed { get; set; }
        public decimal average_cadence { get; set; }
        public decimal average_watts { get; set; }
        public decimal weighted_average_watts { get; set; }
        public decimal kilojoules { get; set; }
        public bool device_watts { get; set; }
        public bool has_heartrate { get; set; }
        public decimal average_heartrate { get; set; }
        public decimal max_heartrate { get; set; }
        public decimal max_watts { get; set; }
        public int pr_count { get; set; }
        public int total_photo_count { get; set; }
        public bool has_kudoed { get; set; }
        public int suffer_score { get; set; }

    }
}
