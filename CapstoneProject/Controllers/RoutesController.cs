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
    public class RoutesController : ControllerBase
    { private readonly ApplicationDbContext _context;
        public RoutesController(ApplicationDbContext context)
        {
            _context = context;
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
            _context.SaveChangesAsync();
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
            _context.SaveChangesAsync();
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
            _context.SaveChangesAsync();
        }

        private string[] ReverseGeocodeCoordinates(RouteCoords latLngVals)
        {
            string lat = latLngVals.lat;
            string lng = latLngVals.lng;
            string[] cityState = Geocoder.ReverseGeocoder(lat, lng);
            return cityState;
        }

        // PUT: api/Routes/5
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
