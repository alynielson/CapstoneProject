﻿using System;
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
                    int thisGroupId = FindGroupIdByName(data.name);
                    CreateNewGroupMembers(thisGroupId, data.members);
                    AddOrganizerAsMember(thisGroupId, data.userId);
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

        private void AddOrganizerAsMember(int groupId, int memberId)
        {
            GroupMember groupMember = new GroupMember();
            groupMember.GroupId = groupId;
            groupMember.UserId = memberId;
            _context.GroupMembers.Add(groupMember);
            _context.SaveChanges();
        }

        private void CreateNewGroupMembers(int id, int[] memberIds)
        {
            foreach (int memberId in memberIds)
            {
                GroupMember groupMember = new GroupMember();
                groupMember.GroupId = id;
                groupMember.UserId = memberId;
                _context.GroupMembers.Add(groupMember);
                _context.SaveChanges();
            }
        }

        private int FindGroupIdByName(string name)
        {
            var thisGroup = _context.Groups.Where(a => a.Name == name).ToList();
            if (thisGroup.Count() > 1)
            {
                thisGroup = thisGroup.OrderByDescending(a => a.Id).ToList();
            }
            int thisGroupId = thisGroup[0].Id;
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
            string ownerFirstName = _context.Users.Find(group.UserId).FirstName;
            string ownerLastName = _context.Users.Find(group.UserId).LastName;
            data.owner = $"{ownerFirstName} {ownerLastName}";
            data.members = _context.GroupMembers.Where(a => a.GroupId == id).Select(a => a.UserId).ToArray();
            data.memberNames = GetMemberNames(id);
            return data;
        }

        private string[] GetMemberNames(int groupId)
        {
            var members = _context.GroupMembers.Where(a => a.GroupId == groupId).Join(_context.Users, a => a.UserId, b => b.Id, (a, b) => new { a, b }).Select(c => c.b).ToList();
            List<string> memberNames = new List<string>();
            foreach (User member in members)
            {
                string name = $"{member.FirstName} {member.LastName}";
                memberNames.Add(name);
            }
            return memberNames.ToArray();
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
