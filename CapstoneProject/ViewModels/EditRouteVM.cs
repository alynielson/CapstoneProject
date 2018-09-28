using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CapstoneProject.ViewModels
{
    public class EditRouteVM
    {
        public string name { get; set; }
        public string description { get; set; }
        public string city { get; set; }
        public string state { get; set; }

        public string ownerName { get; set; }
        public string totalDistance { get; set; }
        public string totalElevationGain { get; set; }
        public string totalElevationLoss { get; set; }

        public RouteCoords[] coordinates { get; set; }
    }
}
