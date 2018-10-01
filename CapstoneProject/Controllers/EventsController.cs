using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CapstoneProject.Models;
using CapstoneProject.Operations;
using CapstoneProject.ViewModels;
using IntegrationProject.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CapstoneProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public EventsController(ApplicationDbContext context)
        {
            _context = context;
        }
        

        // POST: api/Events
        [HttpPost("[action]")]
        public IActionResult CreateNewEvent([FromBody] InitialEventVM data)
        {
            Event vent = new Event();
            DateTime date = DateTime.Parse(data.date);
            DateTime time = DateTime.Parse(data.time);
            vent.Name = data.name;
            vent.Description = data.description;
            vent.UserId = data.userId;
            vent.Date = date;
            vent.Time = time;
            _context.Events.Add(vent);
            _context.SaveChanges();
            int ventId = _context.Events.OrderByDescending(a => a.Id).FirstOrDefault(a => a.Name == data.name).Id;
            foreach(GroupSnapshotVM group in data.groups)
            {
                var members = _context.GroupMembers.Where(a => a.GroupId == group.Id).Join(_context.Users, a => a.UserId, b => b.Id, (a,b) => new { a,b}).Select(c => c.b.Id).ToList();
                foreach(int memberId in members)
                {
                    Invite invite = new Invite();
                    invite.EventId = ventId;
                    invite.UserId = memberId;
                    _context.Invites.Add(invite);
                }
            }
            _context.SaveChanges();
            EventSnapshotVM result = new EventSnapshotVM();
            result.id = ventId;
            return Ok(result);
        }

        [HttpPost("[action]")]
        public IActionResult AddDetails([FromBody] EventSubmitVM data)
        {
            var vent = _context.Events.Find(data.eventId);

                EventRoute route = new EventRoute();
                route.RouteId = data.routeId1;
                route.EventId = data.eventId;
                route.Details = data.routeDetails1;
            _context.EventRoutes.Add(route);
            _context.SaveChanges();
            if (data.routeId2 > 0)
            {
                EventRoute route2 = new EventRoute();
                route2.RouteId = data.routeId2;
                route2.EventId = data.eventId;
                route2.Details = data.routeDetails2;
                _context.EventRoutes.Add(route2);
                _context.SaveChanges();
            }
            if (data.addressCoords != null)
            {
                string addressEst = Geocoder.FullAddressReverseGeocoder(data.addressCoords.lat, data.addressCoords.lng);
                vent.Address = addressEst;
                vent.LatitudeStart = data.addressCoords.lat;
                vent.LongitudeStart = data.addressCoords.lng;
               
            }
            else
            {
                vent.Address = data.address;
                
            }
            _context.Update(vent);
            _context.SaveChanges();
            return Ok();
        }


        // PUT: api/Events/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
