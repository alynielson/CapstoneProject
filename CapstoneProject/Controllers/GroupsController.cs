using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CapstoneProject.Models;
using CapstoneProject.ViewModels;
using IntegrationProject.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CapstoneProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public GroupsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Create([FromBody] GroupVM data)
        {
            if (data != null)
            {
                try
                {
                    Group group = CreateNewGroup(data);
                    _context.Groups.Add(group);
                    await _context.SaveChangesAsync();
                    int thisGroupId = FindGroupIdByName(data.name);
                    CreateNewGroupMembers(thisGroupId, data.members);
                    CreateGroupMember(thisGroupId, data.userId);
                    return Ok();
                }
                catch
                {
                    throw new System.Web.Http.HttpResponseException(System.Net.HttpStatusCode.InternalServerError);
                }
            }
            else
            {
                return NoContent();
            }
        }

        private Group CreateNewGroup(GroupVM data)
        {
            Group group = new Group()
            {
                Name = data.name,
                City = data.city,
                State = data.state,
                Description = data.description,
                UserId = data.userId
            };
            return group;
        }

        private void CreateGroupMember(int groupId, int memberId)
        {
            GroupMember groupMember = new GroupMember()
            {
                GroupId = groupId,
                UserId = memberId
            };
            _context.GroupMembers.Add(groupMember);
            _context.SaveChanges();
        }

        private void CreateNewGroupMembers(int groupId, IEnumerable<int> memberIds)
        {
            foreach (int memberId in memberIds)
            {
                CreateGroupMember(groupId, memberId);
            }
        }

        private int FindGroupIdByName(string name)
        {
            var thisGroup = _context.Groups.Where(a => a.Name == name);
            if (thisGroup.Count() > 1)
            {
                thisGroup = thisGroup.OrderByDescending(a => a.Id);
            }
            int thisGroupId = thisGroup.First().Id;
            return thisGroupId;
        }

        [HttpGet("[action]")]
        public GroupSnapshotVMs GetGroups(int id)
        {
            var groups = GetGroupsByUserId(id);
            List<GroupSnapshotVM> groupsIn = CreateGroupsInSnapshotForClient(groups);
            List<GroupSnapshotVM> ownGroups = GetGroupsOwned(id);
            GroupSnapshotVMs all = new GroupSnapshotVMs();
            all.groupsIn = groupsIn;
            all.groupsOwn = ownGroups;
            return all;
        }

        private List<GroupSnapshotVM> CreateGroupsInSnapshotForClient(List<Group> groups)
        {
            List<GroupSnapshotVM> snapshots = new List<GroupSnapshotVM>();
            foreach (Group group in groups)
            {
                GroupSnapshotVM snapshot = new GroupSnapshotVM();
                snapshot.Id = group.Id;
                snapshot.Name = group.Name;
                snapshots.Add(snapshot);
            }
            return snapshots;
        }

        private List<Group> GetGroupsByUserId(int id)
        {
            return _context.GroupMembers.Where(a => a.UserId == id)
                .Join(_context.Groups, a => a.GroupId, b => b.Id, (a, b) => new { a, b })
                .Select(c => c.b).ToList();
        }
        
        [HttpGet("[action]")]
        public GroupVM GetGroupDetails(int id)
        {
            var group = _context.Groups.Find(id);
            GroupVM data = new GroupVM();
            data.name = group.Name;
            data.city = group.City;
            data.description = group.Description;
            data.state = group.State;
            data.userId = group.UserId;
            User groupOwner = _context.Users.Find(group.UserId);
            data.owner = $"{groupOwner.FirstName} {groupOwner.LastName}";
            var members = _context.GroupMembers.Where(a => a.GroupId == id);
            data.members = members.Select(a => a.UserId).ToArray();
            data.memberNames = GetMemberNames(id, members);
            return data;
        }

        private List<string> GetMemberNames(int groupId, IQueryable<GroupMember> members)
        {
            var membersWithUsers = members.Join(_context.Users, a => a.UserId, b => b.Id, (a, b) => new { a, b }).Select(c => c.b).ToList();
            List<string> memberNames = new List<string>();
            foreach (User member in membersWithUsers)
            {
                string name = $"{member.FirstName} {member.LastName}";
                memberNames.Add(name);
            }
            return memberNames;
        }

        public List<GroupSnapshotVM> GetGroupsOwned(int id)
        {
            var groups = _context.Groups.Where(a => a.UserId == id).ToList();
            List<GroupSnapshotVM> snapshots = CreateGroupsInSnapshotForClient(groups);
            return snapshots;
        }

        [HttpPost("[action]")]
        public IActionResult DeleteMember(int userId, int groupId)
        {
            var member = _context.GroupMembers.SingleOrDefault(a => a.UserId == userId && a.GroupId == groupId);
            if (member != null)
            {
                _context.GroupMembers.Remove(member);
                _context.SaveChanges();
            }
            return Ok();
        }

        [HttpPost("[action]")]
        public IActionResult EditGroup([FromBody] GroupVM data)
        {
            var group = _context.Groups.Find(data.groupId);
            group.Name = data.name;
            group.Description = data.description;
            group.City = data.city;
            group.State = data.state;
            _context.Update(group);
            _context.SaveChanges();
            CreateNewGroupMembers(data.groupId, data.members);
            return Ok();
        }
    }
}
