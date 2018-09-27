using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CapstoneProject.Models;
using CapstoneProject.Operations;
using CapstoneProject.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CapstoneProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoutesController : ControllerBase
    {
        // GET: api/Routes
      
        // POST: api/Routes
        [HttpPost("[action]")]
        public IActionResult Create([FromBody] CreateRouteVM data)
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
