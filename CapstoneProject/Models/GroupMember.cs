using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CapstoneProject.Models
{
    public class GroupMember
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Group")]
        public int GroupId { get; set; }

        public Group Group { get; set; }

        [ForeignKey("User")]

        public int UserId { get; set; }

        public User User { get; set; }
    }
}
