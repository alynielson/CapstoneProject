using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CapstoneProject.ViewModels
{
    public class EventSubmitVM
    {
        public string address { get; set;}

        public int routeId1 { get; set; }

        public int routeId2 { get; set; }

        public string routeDetails1 { get; set; }

        public string routeDetails2 { get; set; }
        public PointVM addressCoords { get; set;}
        public int eventId { get; set; }
    }
}
