using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CapstoneProject.ViewModels
{
    public class GroupSnapshotVM
    {
        public string Name { get; set; }

        public int Id { get; set; }
    }

    public class GroupSnapshotVMs
    {
        public List<GroupSnapshotVM> groupsIn { get; set; }
        public List<GroupSnapshotVM> groupsOwn { get; set; }
    }
}
