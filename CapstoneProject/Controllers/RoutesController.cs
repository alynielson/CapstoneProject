using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CapstoneProject.Helpers;
using CapstoneProject.Models;
using CapstoneProject.Operations;
using CapstoneProject.ViewModels;
using IntegrationProject.Data;
using Microsoft.AspNetCore.Mvc;


namespace CapstoneProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoutesController : ControllerBase 
    { private readonly ApplicationDbContext _context;
        public RoutesController (ApplicationDbContext context)
        {
            _context = context;
        }

        private string GetOwnerName(Route route)
        {
            User user = _context.Users.Find(route.UserId);
            return $"{user.FirstName} {user.LastName}";
        }

        private PointVM[] GetRouteCoordinates(int routeId)
        {
            var points = _context.RouteCoordinates.Where(a => a.RouteId == routeId).OrderBy(a => a.SortOrder).Cast<IMappable>().ToList();
            return Mapper.GetPoints(points);
        }


        [HttpGet("[action]")]
        public EditRouteVM GetRoute(int id)
        {
            var route = _context.Routes.Find(id);
            EditRouteVM data = new EditRouteVM()
            {
                city = route.City,
                state = route.State,
                name = route.Name,
                description = route.Description,
                totalDistance = route.TotalDistance,
                totalElevationGain = route.TotalElevationGain,
                totalElevationLoss = route.TotalElevationLoss
            };
            data.ownerName = GetOwnerName(route);
            data.coordinates = GetRouteCoordinates(id);
            List<PointComment> pointComments = GetPointComments(id);
            data.pointCommentAuthors = pointComments.Select(a => a.Writer).ToList();
            data.pointComments = pointComments.Select(a => a.Note).ToList();
            data.pointCoordinates = Mapper.GetPoints(pointComments.Cast<IMappable>().ToList());
            List<PathComment> pathComments = _context.PathComments.Where(a => a.RouteId == id).ToList();
            data.pathCommentAuthors = pathComments.Select(a => a.Writer).ToList();
            data.pathComments = pathComments.Select(a => a.Note).ToList();
            data.pathCoordinates = GetPathCommentsCoordinates(pathComments);
            return data;
        }

        private List<PointVM[]> GetPathCommentsCoordinates(List<PathComment> pathComments)
        {
            List<PointVM[]> pathCoords = new List<PointVM[]> { };
            foreach (PathComment comment in pathComments)
            {
                PointVM[] arr = new PointVM[2];
                PointVM coord1 = Mapper.CreatePointVM(comment.Latitude1, comment.Longitude1);
                PointVM coord2 = Mapper.CreatePointVM(comment.Latitude2, comment.Longitude2);
                arr[0] = coord1;
                arr[1] = coord2;
                pathCoords.Add(arr);
            }
            return pathCoords;
        }

        private List<PointComment> GetPointComments(int id)
        {
            var pointComments = _context.PointComments.Where(a => a.RouteId == id).ToList();
            return pointComments;
        }
   
        [HttpPost("[action]")]
        public async Task<IActionResult> Create([FromBody] CreateRouteVM data)
        {
            if (data != null)
            {
                try
                {
                    Route route = new Route()
                    {
                        Name = data.name,
                        Description = data.description,
                        TotalDistance = data.totalDistance,
                        TotalElevationGain = data.totalElevationGain,
                        TotalElevationLoss = data.totalElevationLoss
                    };
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
                    RouteVM routeVM = new RouteVM()
                    {
                        id = routeId
                    };
                    return Ok(routeVM);
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

        private void CreateCoordinatesRows(PointVM[] coordinates, int id)
        {
            for (int i = 0; i < coordinates.Length; i++)
            {
                RouteCoordinate coord = new RouteCoordinate()
                {
                    Latitude1 = coordinates[i].lat,
                    Longitude1 = coordinates[i].lng,
                    RouteId = id,
                    SortOrder = i
                };
                _context.Add(coord);
            }
            _context.SaveChanges();
        }

        private void CreateDistancesRows(string[] distances, int id)
        {
            for (int i = 0; i < distances.Length; i++)
            {
                RouteDistance routeDistance = new RouteDistance()
                {
                    Distance = distances[i],
                    RouteId = id,
                    SortOrder = i
                };
                _context.Add(routeDistance);
            }
            _context.SaveChanges();
        }

        private void CreateElevationsRows(ElevationVals[] elevations, int id)
        {
            for (int i = 0; i < elevations.Length; i++)
            {
                RouteElevation routeElevation = new RouteElevation()
                {
                    Up = elevations[i].up,
                    Down = elevations[i].down,
                    RouteId = id,
                    SortOrder = i
                };
                _context.Add(routeElevation);
            }
            _context.SaveChanges();
        }

        private string[] ReverseGeocodeCoordinates(PointVM latLngVals)
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
                RouteListVM vm = new RouteListVM()
                {
                    name = match.Name,
                    description = match.Description,
                    id = match.Id
                };
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
                    comment = (PointComment)SaveCommentDetails(comment, data);
                    comment.Latitude1 = data.pointCoordinates.lat;
                    comment.Longitude1 = data.pointCoordinates.lng;
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

        private Comment SaveCommentDetails(Comment comment, CommentVM data)
        {
            comment.Note = data.notes;
            comment.Writer = data.author;
            comment.RouteId = data.routeId;
            comment.UserId = data.userId;
            return comment;
        }

        [HttpPost("[action]")]
        public IActionResult SavePathComment([FromBody] PathCommentVM data)
        {
            try
            {
                if (data != null)
                {
                    PathComment comment = new PathComment();
                    comment = (PathComment)SaveCommentDetails(comment, data);
                    comment.Latitude1 = data.pathCoordinates[0].lat;
                    comment.Latitude2 = data.pathCoordinates[1].lat;
                    comment.Longitude1 = data.pathCoordinates[0].lng;
                    comment.Longitude2 = data.pathCoordinates[1].lng;
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
