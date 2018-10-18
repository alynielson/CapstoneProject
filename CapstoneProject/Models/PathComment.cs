using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CapstoneProject.Models
{
    public class PathComment : Comment
    {

    

        public string Latitude2 { get; set; }

        public string Longitude2 { get; set; }
    }
}
