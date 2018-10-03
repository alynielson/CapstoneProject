using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CapstoneProject.ViewModels
{
    public class PointCommentVM
    {
        public string note { get; set; }

        public RouteCoords pointCoordinates { get; set; }

        public string author { get; set; }
        public int routeId { get; set; }
        public int userId { get; set; }
    }

   
}
