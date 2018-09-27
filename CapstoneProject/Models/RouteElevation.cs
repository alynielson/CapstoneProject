using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CapstoneProject.Models
{
    public class RouteElevation
    {   [Key]
        public int Id { get; set; }

        public string Up { get; set; }

        public string Down { get; set; }

        public string SortOrder { get; set; }
        [ForeignKey("Route")]
        public int RouteId { get; set; }
        public Route Route { get; set; }
    }
}
