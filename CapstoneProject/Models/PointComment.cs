using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CapstoneProject.Models
{
    public class PointComment : Comment
    {
     

        public string Latitude { get; set; }

        public string Longitude { get; set; }
        

    }
}
