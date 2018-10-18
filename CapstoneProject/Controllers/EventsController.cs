using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using CapstoneProject.Models;
using CapstoneProject.Operations;
using CapstoneProject.ViewModels;
using IntegrationProject.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

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
        [HttpGet("[action]")]
        public List<UserEventVM> GetUserEvents(int userId)
        {
            List<UserEventVM> results = new List<UserEventVM> { };
            var eventsInvites = _context.Invites.Join(_context.Events, a => a.EventId, b => b.Id, (a, b) => new { a, b }).Where(c => c.a.UserId == userId)
                .Where(c => c.a.Going == true || c.b.Date >= DateTime.Now).ToList();
            List<Event> events = eventsInvites.Select(c => c.b).ToList();
            List<User> eventsOrganizers = events.Join(_context.Users, a => a.UserId, b => b.Id, (a, b) => new { a, b }).Select(c => c.b).ToList();
            List<string> eventsOrgsFirstName = eventsOrganizers.Select(f => f.FirstName).ToList();
            List<string> eventsOrgsLastName = eventsOrganizers.Select(f => f.LastName).ToList();
            for (int i = 0; i < eventsInvites.Count(); i++)
            {
                UserEventVM vent = new UserEventVM();
                vent.date = events[i].Date;
                vent.eventId = events[i].Id;
                vent.going = eventsInvites[i].a.Going;
                vent.name = events[i].Name;
                vent.organizer = $"{eventsOrgsFirstName[i]} {eventsOrgsLastName[i]}";
                vent.time = events[i].Time;
                results.Add(vent);
            }
            var resultsToSend = results.OrderByDescending(a => a.date).ToList();
            return resultsToSend;


        }

       
        public static double DateTimeToUnixTimestamp(DateTime dateTime)
        {
            DateTime unixStart = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
            long unixTimeStampInTicks = (dateTime.ToUniversalTime() - unixStart).Ticks;
            return (double)unixTimeStampInTicks / TimeSpan.TicksPerSecond;
        }

        [HttpGet("[action]")]
        public List<StravaViewModel> GetStravaData(int eventId, DateTime date, DateTime time, string lat1, string lng1, string lat2, string lng2)
        {
            string before = DateTimeToUnixTimestamp(date.AddHours(12)).ToString();
            string after = DateTimeToUnixTimestamp(date.AddHours(-12)).ToString();
            var athletes = _context.Invites.Where(a => a.EventId == eventId && a.Going == true).Join(_context.Users, a => a.UserId, b => b.Id, (a, b) => new { a, b }).ToList();
            List<string> requests = new List<string> { };
            List<StravaViewModel> results = new List<StravaViewModel>();
            int i = 0;
            while (i < athletes.Count())
            {
                if (athletes[i].b.StravaAccessTokenHashed != null)
                {
                    string username = $"{athletes[i].b.FirstName} {athletes[i].b.LastName}";
                    string token = PasswordConverter.Decrypt(athletes[i].b.StravaAccessTokenHashed);
                    string url = $"https://www.strava.com/api/v3/athlete/activities?access_token={token}&before={before}&after={after}&page=1&per_page=1";
                    HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                    request.Method = "GET";
                    WebResponse response = request.GetResponse();
                    string responseString = null;
                    Stream stream = response.GetResponseStream();
                    StreamReader streamReader = new StreamReader(stream);
                    responseString = streamReader.ReadToEnd();
                    List<Activity> activities = new List<Activity>();
                    activities = JsonConvert.DeserializeObject<List<Activity>>(responseString);
                    foreach(Activity activity in activities)
                    {
                        StravaViewModel vm = new StravaViewModel();
                        vm.username = username;
                        vm.activity = activity;
                        results.Add(vm);
                    }
                }
                i++;
            }
            results = CheckIfActivityTimeValid(results, time);
            results = CheckIfActivityLocationValid(results, lat1, lng1, lat2, lng2);
            results = results.OrderBy(a => a.activity.moving_time).ToList();
            return results;    
        }



        private List<StravaViewModel> CheckIfActivityTimeValid(List<StravaViewModel> results,  DateTime time)
        {
            TimeSpan eventTime = time.TimeOfDay;
            TimeSpan duration = new TimeSpan(0, 30, 0);
            TimeSpan beforeEvent = eventTime.Subtract(duration);
            TimeSpan afterEvent = eventTime.Add(duration);
            foreach (StravaViewModel vm in results)
            {
                if (beforeEvent >= vm.activity.start_date_local.TimeOfDay && afterEvent <= vm.activity.start_date_local.TimeOfDay)
                {
                    results.Remove(vm);
                }
            }
            return results;
        }

        private List<StravaViewModel> CheckIfActivityLocationValid(List<StravaViewModel> results, string lat1, string lng1, string lat2, string lng2)
        {
            foreach (StravaViewModel vm in results)
            {
                if (Math.Abs(vm.activity.start_latlng[0] - decimal.Parse(lat1)) < Convert.ToDecimal(0.01) && Math.Abs(vm.activity.start_latlng[1] - decimal.Parse(lng1)) < Convert.ToDecimal(0.01))
                {
                    continue;
                }
                else if (Math.Abs(vm.activity.end_latlng[0] - decimal.Parse(lat1)) < Convert.ToDecimal(0.01) && Math.Abs(vm.activity.end_latlng[1] - decimal.Parse(lng1)) < Convert.ToDecimal(0.01))
                {
                    continue;
                }
                else if (lat2 != null)
                {
                    if (Math.Abs(vm.activity.start_latlng[0] - decimal.Parse(lat2)) < Convert.ToDecimal(0.01) && Math.Abs(vm.activity.start_latlng[1] - decimal.Parse(lng2)) < Convert.ToDecimal(0.01))
                    {
                        continue;
                    }
                    else if (Math.Abs(vm.activity.end_latlng[0] - decimal.Parse(lat2)) < Convert.ToDecimal(0.01) && Math.Abs(vm.activity.end_latlng[2] - decimal.Parse(lng2)) < Convert.ToDecimal(0.01))
                    {
                        continue;
                    }

                }
                else
                {
                    results.Remove(vm);
                }
                
            }

            return results;
        }

        // POST: api/Events
        [HttpPost("[action]")]
        public IActionResult CreateNewEvent([FromBody] InitialEventVM data)
        {
            AddNewEventToDb(data);
            int ventId = _context.Events.OrderByDescending(a => a.Id).FirstOrDefault(a => a.Name == data.name).Id;
            foreach(GroupSnapshotVM group in data.groups)
            {
                var members = _context.GroupMembers.Where(a => a.GroupId == group.Id).Join(_context.Users, a => a.UserId, b => b.Id, (a,b) => new { a,b}).Select(c => c.b.Id).Distinct().ToList();
                foreach(int memberId in members)
                {
                    CreateNewInvite(memberId, ventId);
                }
               
                _context.SaveChanges();
            }
           
            EventSnapshotVM result = new EventSnapshotVM();
            result.id = ventId;
            return Ok(result);
        }

        private void CreateNewInvite(int memberId, int ventId)
        {
            Invite invite = new Invite();
            invite.EventId = ventId;
            invite.UserId = memberId;
            _context.Invites.Add(invite);
        }

        private void AddNewEventToDb(InitialEventVM data)
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
        }

        private void CreateNewEventRoute(int routeId, int eventId, string routeDetails)
        {
            EventRoute route = new EventRoute();
            route.RouteId = routeId;
            route.EventId = eventId;
            route.Details = routeDetails;
            _context.EventRoutes.Add(route);
            _context.SaveChanges();
        }


        [HttpPost("[action]")]
        public IActionResult AddDetails([FromBody] EventSubmitVM data)
        {
            var vent = _context.Events.Find(data.eventId);
            CreateNewEventRoute(data.routeId1, vent.Id, data.routeDetails1); 
            if (data.routeId2 > 0)
            {
                CreateNewEventRoute(data.routeId2, vent.Id, data.routeDetails2);
            }
            if (data.addressCoords != null)
            {
                ReverseGeocodeStartingPoint(data.addressCoords, vent); 
            }
            else
            {
                vent.Address = data.address;
            }
            _context.Update(vent);
            _context.SaveChanges();
            return Ok();
        }

        private void ReverseGeocodeStartingPoint(RouteCoords addressCoords, Event vent)
        {
            string addressEst = Geocoder.FullAddressReverseGeocoder(addressCoords.lat, addressCoords.lng);
            vent.Address = addressEst;
            vent.LatitudeStart = addressCoords.lat;
            vent.LongitudeStart = addressCoords.lng;
        }


        [HttpPost("[action]")]
        public IActionResult Rsvp(int user, int vent)
        {
            var invite = _context.Invites.FirstOrDefault(a => a.UserId == user && a.EventId == vent);
            invite.Going = true;
            _context.Invites.Update(invite);
            _context.SaveChanges();
            return Ok();
        }

        private List<PointComment> getPointComments(int id)
        {
            var pointComments = _context.PointComments.Where(a => a.RouteId == id).ToList();
            return pointComments;
        }

        [HttpGet("[action]")]
        public ViewEventVM GetAllEventInfo(int id)
        {
            var vent = _context.Events.Find(id);
            ViewEventVM results = new ViewEventVM();
            results.address = vent.Address;
            results.description = vent.Description;
            var joinedPeopleInvites = _context.Invites.Join(_context.Users, a => a.UserId, b => b.Id, (a, b) => new { a, b }).Where(c => c.a.Going == true && c.a.EventId == id).ToList();
            List<string> firstNames = joinedPeopleInvites.Select(d => d.b.FirstName).ToList();
            List<string> lastNames = joinedPeopleInvites.Select(d => d.b.LastName).ToList();
            List<string> goingMembers = new List<string>();
            for (int i = 0; i < firstNames.Count(); i++)
            {
                goingMembers.Add($"{firstNames[i]} {lastNames[i]}");
            }
            results.goingNames = goingMembers;
            var routeId = _context.EventRoutes.Where(a => a.EventId == id).Select(a => a.RouteId).ToList();
            if (routeId.Count() > 0)
            {
                results.route1 = GetEventRoute(routeId[0]);
                results.route1Details = _context.EventRoutes.FirstOrDefault(a => a.RouteId == routeId[0]).Details;
            }
            if (routeId.Count() > 1)
            {
                results.route2 = GetEventRoute(routeId[1]);
                results.route2Details = _context.EventRoutes.FirstOrDefault(a => a.RouteId == routeId[1]).Details;
            }
            RouteCoords vm = new RouteCoords();
            vm.lat = vent.LatitudeStart;
            vm.lng = vent.LongitudeStart;
            results.startPoint = vm;
            return (results);
        }

        private RouteCoords[] CreateRouteCoordsArrayForClient(List<RouteCoordinate> points)
        {
            RouteCoords[] coords = new RouteCoords[points.Count()];
            for (int i = 0; i < coords.Length; i++)
            {
                RouteCoords routeCoord = new RouteCoords();
                routeCoord.lat = points[i].Latitude1;
                routeCoord.lng = points[i].Longitude1;
                coords[i] = routeCoord;
            }
            return coords;
        }
       private RouteCoords[] CreateRouteCoordsArrayForClient(List<PointComment> pointComments)
        {
            RouteCoords[] pointCoords = new RouteCoords[pointComments.Count()];
            for (int i = 0; i < pointCoords.Length; i++)
            {
                RouteCoords coord = new RouteCoords();
                coord.lat = pointComments[i].Latitude1;
                coord.lng = pointComments[i].Longitude1;
                pointCoords[i] = coord;
            }
            return pointCoords;
        }

        private List<RouteCoords[]> CreateRouteCoordsArrayForClient(List<PathComment> pathComments)
        {
            List<RouteCoords[]> pathCoords = new List<RouteCoords[]>(pathComments.Count());
            foreach (PathComment comment in pathComments)
            {
                RouteCoords[] arr = new RouteCoords[2];
                RouteCoords coord1 = new RouteCoords();
                coord1.lat = comment.Latitude1;
                coord1.lng = comment.Longitude1;
                RouteCoords coord2 = new RouteCoords();
                coord2.lat = comment.Latitude2;
                coord2.lng = comment.Longitude2;
                arr[0] = coord1;
                arr[1] = coord2;
                pathCoords.Add(arr);
            }
            return pathCoords;
        }

        public EditRouteVM GetEventRoute(int id)
        {
            var route = _context.Routes.Find(id);
            EditRouteVM data = new EditRouteVM();
            data.city = route.City;
            data.state = route.State;
            data.name = route.Name;
            data.description = route.Description;
            data.totalDistance = route.TotalDistance;
            data.totalElevationGain = route.TotalElevationGain;
            data.totalElevationLoss = route.TotalElevationLoss;
            var owner = _context.Users.Find(route.UserId);
            data.ownerName = $"{owner.FirstName} {owner.LastName}";
            var points = _context.RouteCoordinates.Where(a => a.RouteId == id).OrderBy(a => a.SortOrder).ToList();
            data.coordinates = CreateRouteCoordsArrayForClient(points);
            List<PointComment> pointComments = getPointComments(id);
            data.pointCommentAuthors = pointComments.Select(a => a.Writer).ToList();
            data.pointComments = pointComments.Select(a => a.Note).ToList();
            data.pointCoordinates = CreateRouteCoordsArrayForClient(pointComments);
            List<PathComment> pathComments = _context.PathComments.Where(a => a.RouteId == id).ToList();
            data.pathCommentAuthors = pathComments.Select(a => a.Writer).ToList();
            data.pathComments = pathComments.Select(a => a.Note).ToList();
            data.pathCoordinates = CreateRouteCoordsArrayForClient(pathComments);
            return data;
        }

    }
}
