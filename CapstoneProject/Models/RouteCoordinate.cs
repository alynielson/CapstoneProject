using CapstoneProject.Helpers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CapstoneProject.Models
{
    public class RouteCoordinate : IMappable
    {
        [Key]
        public int Id { get; set; }
        
        public int SortOrder { get; set; }

        public string Latitude1 { get; set; }

        public string Longitude1 { get; set; }

        [ForeignKey("Route")]
        public int RouteId { get; set; }
        public Route Route { get; set; }
    }
}
