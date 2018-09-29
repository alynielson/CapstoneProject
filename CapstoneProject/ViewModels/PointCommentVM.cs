using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CapstoneProject.ViewModels
{
    public class PointCommentVM
    {
        public string note { get; set; }

        public PointCoord pointCoordinates { get; set; }

        public string author { get; set; }
    }

    public class PointCoord
    {
        public string lat { get; set; }
        public string lng { get; set; }
    }
}
