using System.Collections.Generic;

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
