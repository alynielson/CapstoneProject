using System.Collections.Generic;

namespace CapstoneProject.ViewModels
{
    public class EditRouteVM : CreateRouteVM
    {
        public string city { get; set; }
        public string state { get; set; }

        public string ownerName { get; set; }

        public List<string> pointCommentAuthors { get; set; }

        public PointVM[] pointCoordinates { get; set; }

        public List<string> pointComments { get; set; }

        public List<string> pathCommentAuthors { get; set; }

        public List<PointVM[]> pathCoordinates { get; set; }

        public List<string> pathComments { get; set; }
    }
}
