using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CapstoneProject.Models
{
    public class Event
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }

        public string Description { get; set; }

        public DateTime Date { get; set; }

        public DateTime Time { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        public User User { get; set; }

        public string Address { get; set; }

       
    }
}
