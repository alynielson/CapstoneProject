using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CapstoneProject.ViewModels
{
    public class PathCommentVM
    {
        public string notes { get; set; }

        public RouteCoords[] pathCoordinates { get; set; }

        public string author { get; set; }

        public int userId { get; set; }

        public int routeId { get; set; }
    }

  
}
