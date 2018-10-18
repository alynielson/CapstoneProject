using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CapstoneProject.ViewModels
{
    public class EditRouteVM : CreateRouteVM
    {
        public string city { get; set; }
        public string state { get; set; }

        public string ownerName { get; set; }

        public List<string> pointCommentAuthors { get; set; }

        public RouteCoords[] pointCoordinates { get; set; }

        public List<string> pointComments { get; set; }

        public List<string> pathCommentAuthors { get; set; }

        public List<RouteCoords[]> pathCoordinates { get; set; }

        public List<string> pathComments { get; set; }
    }
}
