﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CapstoneProject.Models
{
    public class PathComment
    {
        [Key]
        public int Id { get; set; }

        public string Note { get; set; }

        public string Latitude1 { get; set; }

        public string Longitude1 { get; set; }

        public string Latitude2 { get; set; }

        public string Longitude2 { get; set; }
        public int SortOrder { get; set; }

        public string Writer { get; set; }

        [ForeignKey("Route")]

        public int RouteId { get; set; }

        public Route Route { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }

        public User User { get; set; }
    }
}
