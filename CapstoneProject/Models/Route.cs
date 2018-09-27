﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CapstoneProject.Models
{
    public class Route
    {   [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        
        public string City { get; set; }

        public string State { get; set; }

        public string TotalDistance { get; set; }

        public string TotalElevationGain { get; set; }

        public string TotalElevationLoss { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }

        public User User { get; set; }
    }
}
