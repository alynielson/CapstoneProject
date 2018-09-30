using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CapstoneProject.Models
{
    public class EventRoute
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Event")]
        public int EventId { get; set; }
        public Event Event { get; set; }

        [ForeignKey("Route")]
        public int RouteId { get; set; }
        public Route Route { get; set; }
    }
}
