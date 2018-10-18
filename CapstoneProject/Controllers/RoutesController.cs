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
using Microsoft.EntityFrameworkCore;

namespace CapstoneProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoutesController : ControllerBase
    { private readonly ApplicationDbContext _context;
        public RoutesController(ApplicationDbContext context)
        {
            _context = context;
        }

        private string GetOwnerName(Route route)
        {
            var ownerId = route.UserId;
            User user = _context.Users.Find(ownerId);
            return $"{user.FirstName} {user.LastName}";
        }

        private RouteCoords[] GetRouteCoordinates(int routeId)
        {
            var points = _context.RouteCoordinates.Where(a => a.RouteId == routeId).OrderBy(a => a.SortOrder).ToList();
            RouteCoords[] coords = new RouteCoords[points.Count()];
            for (int i = 0; i < coords.Length; i++)
            {
                RouteCoords routeCoord = new RouteCoords();
                routeCoord.lat = points[i].Latitude;
                routeCoord.lng = points[i].Longitude;
                coords[i] = routeCoord;
            }
            return coords;
        }

       

        private RouteCoords[] GetCoordinatesOfPointComments(List<PointComment> pointComments)
        {
            RouteCoords[] pointCoords = new RouteCoords[pointComments.Count()];
            for(int i=0; i< pointCoords.Length; i++)
            {
                RouteCoords coord = new RouteCoords();
                coord.lat = pointComments[i].Latitude;
                coord.lng = pointComments[i].Longitude;
                pointCoords[i] = coord;
            }
            return pointCoords;
        }

        [HttpGet("[action]")]
        public EditRouteVM GetRoute(int id)
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
            data.ownerName = GetOwnerName(route);
            data.coordinates = GetRouteCoordinates(id);
            List<PointComment> pointComments = getPointComments(id);
            data.pointCommentAuthors = pointComments.Select(a => a.Writer).ToList();
            data.pointComments = pointComments.Select(a => a.Note).ToList();
            data.pointCoordinates = GetCoordinatesOfPointComments(pointComments);
            List<PathComment> pathComments = _context.PathComments.Where(a => a.RouteId == id).ToList();
            data.pathCommentAuthors = pathComments.Select(a => a.Writer).ToList();
            data.pathComments = pathComments.Select(a => a.Note).ToList();
            data.pathCoordinates = GetPathCommentsCoordinates(pathComments);
            return data;
        }

        private List<RouteCoords[]> GetPathCommentsCoordinates(List<PathComment> pathComments)
        {
            List<RouteCoords[]> pathCoords = new List<RouteCoords[]> { };
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

        private List<PointComment> getPointComments(int id)
        {
            var pointComments = _context.PointComments.Where(a => a.RouteId == id).ToList();
            return pointComments;
        }

        
      
        // POST: api/Routes
        [HttpPost("[action]")]
        public async Task<IActionResult> Create([FromBody] CreateRouteVM data)
        {
            if (data != null)
            {
                try
                {
                    Route route = new Route();
                    route.Name = data.name;
                    route.Description = data.description;
                    route.TotalDistance = data.totalDistance;
                    route.TotalElevationGain = data.totalElevationGain;
                    route.TotalElevationLoss = data.totalElevationLoss;
                    string[] cityState = ReverseGeocodeCoordinates(data.coordinates[0]);
                    route.City = cityState[0];
                    route.State = cityState[1];
                    route.UserId = int.Parse(data.userId);
                    _context.Routes.Add(route);
                    await _context.SaveChangesAsync();
                    int routeId = FindRouteId(route.Name);
                    CreateCoordinatesRows(data.coordinates, routeId);
                    CreateDistancesRows(data.distances, routeId);
                    CreateElevationsRows(data.elevations, routeId);
                    RouteVM routeVM = new RouteVM();
                    routeVM.id = routeId;
                    return Ok(routeVM
                    );
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

        private int FindRouteId(string name)
        {
            int routeId;
            var routesFound = _context.Routes.Where(a => name == a.Name).ToList();
            
                if (routesFound.Count() > 1)
                {
                    var routesOrdered = _context.Routes.OrderByDescending(a => a.Id).ToList();
                    return routeId = routesOrdered[0].Id;
                }
                else 
                {
                    return routesFound[0].Id;
                }
           
        }

        private void CreateCoordinatesRows(RouteCoords[] coordinates, int id)
        {
            for (int i = 0; i < coordinates.Length; i++)
            {
                RouteCoordinate coord = new RouteCoordinate();
                coord.Latitude = coordinates[i].lat;
                coord.Longitude = coordinates[i].lng;
                coord.RouteId = id;
                coord.SortOrder = i;
                _context.Add(coord);
            }
            _context.SaveChanges();
        }

        private void CreateDistancesRows(string[] distances, int id)
        {
            for (int i = 0; i < distances.Length; i++)
            {
                RouteDistance routeDistance = new RouteDistance();
                routeDistance.Distance = distances[i];
                routeDistance.RouteId = id;
                routeDistance.SortOrder = i;
                _context.Add(routeDistance);
            }
            _context.SaveChanges();
        }

        private void CreateElevationsRows(ElevationVals[] elevations, int id)
        {
            for (int i = 0; i < elevations.Length; i++)
            {
                RouteElevation routeElevation = new RouteElevation();
                routeElevation.Up = elevations[i].up;
                routeElevation.Down = elevations[i].down;
                routeElevation.RouteId = id;
                routeElevation.SortOrder = i;
                _context.Add(routeElevation);

            }
            _context.SaveChanges();
        }

        private string[] ReverseGeocodeCoordinates(RouteCoords latLngVals)
        {
            string lat = latLngVals.lat;
            string lng = latLngVals.lng;
            string[] cityState = Geocoder.ReverseGeocoder(lat, lng);
            return cityState;
        }


        [HttpGet("[action]")]
        public IEnumerable<RouteListVM> RouteSearch(string term1, string distanceFilter = null, string hills = null)
        {
            if (term1 == null)
            {
                return null;
            }
            string[] terms = term1.Split(' ');
            var locationMatches = _context.Routes.Where(a => a.City.ToLower().Contains(terms[0])).ToList();
            locationMatches = GetRouteMatchesByState(terms[0], locationMatches);
            if (terms.Length > 1)
            {
                locationMatches = GetRouteMatchesByState(terms[1], locationMatches);
            }
            var allLocationMatches = locationMatches.Distinct().ToList();
            if (distanceFilter != null)
            {
                allLocationMatches = FilterByDistance(allLocationMatches, distanceFilter);
            }
            if (hills != null)
            {
                allLocationMatches = FilterByHills(allLocationMatches, hills);
            }
            return CreateVMForClientFromSearchMatches(allLocationMatches);
        }

        private List<RouteListVM> CreateVMForClientFromSearchMatches(List<Route> allLocationMatches)
        {
            List<RouteListVM> results = new List<RouteListVM>();
            foreach (Route match in allLocationMatches)
            {
                RouteListVM vm = new RouteListVM();
                vm.name = match.Name;
                vm.description = match.Description;
                vm.id = match.Id;
                results.Add(vm);
            }
            return results;
        }

        private List<Route> GetRouteMatchesByState(string searchTerm, List<Route> existingMatches)
        {
            var possibleStateMatches = _context.Routes.Where(a => a.State.ToLower().Contains(searchTerm)).ToList();
            existingMatches.AddRange(possibleStateMatches);
            return existingMatches;
        }

        private List<Route> FilterByDistance(List<Route> matches, string distanceFilter)
        {
            if (distanceFilter == "75+")
            {
                var distanceMatches = matches.Where(a => decimal.Parse(a.TotalDistance) >= 75).ToList();
                return distanceMatches;
            }
            else
            {
                List<int> filter = distanceFilter.Split('-').Select(a => int.Parse(a)).ToList();
                var distanceMatches = matches.Where(a => decimal.Parse(a.TotalDistance) >= filter[0] && decimal.Parse(a.TotalDistance) <= filter[1]).ToList();
                return distanceMatches;
            }
           
        }

        private List<Route> FilterByHills(List<Route> matches, string hillFilter)
        {
            if (hillFilter =="more downhill than uphill")
            {
                var hillMatches = matches.Where(a => decimal.Parse(a.TotalElevationLoss) > decimal.Parse(a.TotalElevationGain)).ToList();
                return hillMatches;
            }
            if (hillFilter == "200 or less")
            {
                var hillMatches = matches.Where(a => decimal.Parse(a.TotalElevationGain) <= 200).ToList();
                return hillMatches;
            }
            if (hillFilter == "2000+")
            {
                var hillMatches = matches.Where(a => decimal.Parse(a.TotalElevationGain) >= 2000).ToList();
                return hillMatches;
            }
            else
            {
                List<int> hillVals = hillFilter.Split('-').Select(a => int.Parse(a)).ToList();
                var hillMatches = matches.Where(a => decimal.Parse(a.TotalElevationGain) >= hillVals[0] && decimal.Parse(a.TotalElevationLoss) <= hillVals[1]).ToList();
                return hillMatches;
            }
        }


        [HttpPost("[action]")]
        public IActionResult SavePointComment([FromBody] PointCommentVM data)
        {
            try
            {
                if (data == null)
                {
                    return NoContent();
                }
                else
                {
                    PointComment comment = new PointComment();
                    comment.Note = data.notes;
                    comment.Latitude = data.pointCoordinates.lat;
                    comment.Longitude = data.pointCoordinates.lng;
                    comment.Writer = data.author;
                    comment.RouteId = data.routeId;
                    comment.UserId = data.userId;
                    _context.PointComments.Add(comment);
                    _context.SaveChanges();
                    return Ok();
                }
            }
            catch
            {
                throw new Exception("Unable to save to database");
            }
        }


        [HttpPost("[action]")]
        public IActionResult SavePathComment([FromBody] PathCommentVM data)
        {
            try
            {
                if (data != null)
                {
                    PathComment comment = new PathComment();
                    comment.Note = data.notes;
                    comment.Latitude1 = data.pathCoordinates[0].lat;
                    comment.Latitude2 = data.pathCoordinates[1].lat;
                    comment.Longitude1 = data.pathCoordinates[0].lng;
                    comment.Longitude2 = data.pathCoordinates[1].lng;
                    comment.Writer = data.author;
                    comment.RouteId = data.routeId;
                    comment.UserId = data.userId;
                    _context.PathComments.Add(comment);
                    _context.SaveChanges();
                    return Ok();
                }
                else
                {

                    return NoContent();
                }
            }
            catch
            {
                throw new Exception("Unable to save to database");
            }
        }
    }
}
