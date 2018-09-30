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
        // GET: api/Groups
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Groups/5
        [HttpGet("{id}", Name = "Get")]
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Groups
        [HttpPost("[action]")]
        public async Task<IActionResult> Create([FromBody] GroupVM data)
        {
            if (data != null)
            {
                try
                {
                    Group group = new Group();
                    group.Name = data.name;
                    group.City = data.city;
                    group.State = data.state;
                    group.Description = data.description;
                    group.UserId = data.userId;
                    _context.Groups.Add(group);
                    await _context.SaveChangesAsync();
                    var thisGroup = _context.Groups.Where(a => a.Name == data.name).ToList();
                    
                    if (thisGroup.Count() > 1)
                    {
                        thisGroup = thisGroup.OrderByDescending(a => a.Id).ToList();
                        
                    }
                    int thisGroupId = thisGroup[0].Id;
                    foreach (int memberId in data.members)
                    {
                        GroupMember groupMember = new GroupMember();
                        groupMember.GroupId = thisGroupId;
                        groupMember.UserId = memberId;
                        _context.GroupMembers.Add(groupMember);
                    }
                    await _context.SaveChangesAsync();
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

        // PUT: api/Groups/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
        [HttpGet("[action]")]
        public GroupSnapshotVMs GetGroups(int id)
        {
            var groups = _context.GroupMembers.Where(a => a.UserId == id)
                .Join(_context.Groups, a => a.GroupId, b => b.Id, (a, b) => new { a, b })
                .Select(c => c.b).ToList();
            List<GroupSnapshotVM> snapshots = new List<GroupSnapshotVM>();
            foreach (Group group in groups)
            {
                GroupSnapshotVM snapshot = new GroupSnapshotVM();
                snapshot.Id = group.Id;
                snapshot.Name = group.Name;
                snapshots.Add(snapshot);
            }
            List<GroupSnapshotVM> ownGroups = GetGroupsOwned(id);
            GroupSnapshotVMs all = new GroupSnapshotVMs();
            all.groupsIn = snapshots;
            all.groupsOwn = ownGroups;
            return all;
            
        }
        

        public List<GroupSnapshotVM> GetGroupsOwned(int id)
        {
            var groups = _context.Groups.Where(a => a.UserId == id).ToList();
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
    }
}
