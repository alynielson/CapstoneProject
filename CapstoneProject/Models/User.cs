using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CapstoneProject.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        
        public string HashedPassword { get; set; }

        public string City { get; set; }

        public string State { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }

        public string StravaAccessTokenHashed { get; set; }
    }
}
