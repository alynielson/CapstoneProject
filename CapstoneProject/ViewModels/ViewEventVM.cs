using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CapstoneProject.ViewModels
{
    public class ViewEventVM
    {
        public string description { get; set; }
        public string address { get; set; }

        public PointVM startPoint { get; set; }

        public EditRouteVM route1 { get; set; }

        public EditRouteVM route2 { get; set; }

        public string route1Details { get; set; }

        public string route2Details { get; set; }

        public List<string> goingNames { get; set; }
    }

  
}
