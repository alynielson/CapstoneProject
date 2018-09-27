using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CapstoneProject.ViewModels
{
    public class CreateRouteVM
    {
        public string name { get; set; }

        public string description { get; set; }

        public string city { get; set; }

        public string state { get; set; }

        public decimal  totalDistance { get; set; }

        public decimal totalElevationGain { get; set; }

        public decimal totalElevationLoss { get; set; }

        public int userId { get; set; }

        public RouteCoords coordinates { get; set; }
        public decimal[] distances { get; set; }
        public ElevationVals elevations { get; set; }


    }

    public class RouteCoords
    {
        public decimal lat { get; set; }

        public decimal lng { get; set; }
    }

    public class ElevationVals
    {
        public decimal up { get; set; }
        public decimal down { get; set; }
    }
}
