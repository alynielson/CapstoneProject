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

        public string  totalDistance { get; set; }

        public string totalElevationGain { get; set; }

        public string totalElevationLoss { get; set; }

        public string userId { get; set; }

        public PointVM[] coordinates { get; set; }
        public string[] distances { get; set; }
        public ElevationVals[] elevations { get; set; }


    }

    public class RouteCoords
    {
        public string lat { get; set; }

        public string lng { get; set; }
    }

    public class ElevationVals
    {
        public string up { get; set; }
        public string down { get; set; }
    }
}
