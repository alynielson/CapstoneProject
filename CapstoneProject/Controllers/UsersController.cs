using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CapstoneProject.ViewModels;
using CapstoneProject.Models;
using Microsoft.AspNetCore.Routing;
using CapstoneProject.Operations;
using IntegrationProject.Data;
using CapstoneProject.Helpers;

namespace CapstoneProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("[action]")]
        public IActionResult Login([FromBody] LogInAttempt data)
        {
            if (data.email != null && data.password != null)
            {
                try
                {
                    var user = _context.Users.FirstOrDefault(a => a.Email == data.email);
                    if (user != null)
                    {
                        string hashedPasswordAttempt = PasswordConverter.Encrypt(data.password);
                        var actualPassword = user.HashedPassword;
                        if (actualPassword == hashedPasswordAttempt)
                        {
                            LoggedInUserVM viewModel = GetUserInfoFromUser(user);
                            return Ok(viewModel);
                        }
                        else
                        {
                            return Unauthorized();
                        }
                    }
                    else
                    {
                        return NotFound();
                    }
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

        [HttpGet("[action]")]
        public IEnumerable<string> GetStatesList()
        {
            return States.states;
        }

        [HttpPost("[action]")]
        public IActionResult EnterLocation([FromBody] UserLocationVM data)
        {
            try
            {
                if (data != null)
                {
                    var user = _context.Users.Find(data.id);
                    user.City = data.city;
                    user.State = data.state;
                    string[] latLong = Geocoder.RunGeocoder(data.city, data.state);
                    user.Latitude = latLong[0];
                    user.Longitude = latLong[1];
                    _context.Users.Update(user);
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
                throw new System.Web.Http.HttpResponseException(System.Net.HttpStatusCode.InternalServerError);
            }
        }

        [HttpPost("[action]")]
        public IActionResult SendCodeToStrava([FromBody] StravaAuthCode code)
        {
            if (code.auth_code != null)
            {
                StravaAthlete stravaAthlete = Strava.GetAthleteDataFromAuthCode(code.auth_code);
                if (stravaAthlete != null)
                {
                    var user = _context.Users.Find(code.id);
                    user.StravaAccessTokenHashed = PasswordConverter.Encrypt(stravaAthlete.access_token);
                    _context.Users.Update(user);
                    _context.SaveChanges();
                }
                return Ok();
            }
            else
            {
                return NoContent();
            }
        }

       private LoggedInUserVM GetUserInfoFromUser(User user)
        {
            LoggedInUserVM viewModel = new LoggedInUserVM();
            viewModel.first_name = user.FirstName;
            viewModel.last_name = user.LastName;
            viewModel.id = user.Id;
            return viewModel;
        }

        private LoggedInUserVM GetUserInfoFromEmail(string email)
        {
            var user = _context.Users.FirstOrDefault(e => e.Email == email);
            return GetUserInfoFromUser(user);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Create([FromBody] UserVM data)
        {
           if (data != null)
           {
                 try   
                 {
                    if (_context.Users.FirstOrDefault(e => data.email == e.Email) != null)
                    {
                        return Conflict();
                    }
                    else
                    {
                        User user = new User();
                        user.FirstName = data.first_name.Trim();
                        user.LastName = data.last_name.Trim();
                        user.HashedPassword = PasswordConverter.Encrypt(data.password);
                        user.Email = data.email.Trim();
                        _context.Users.Add(user);
                        await _context.SaveChangesAsync();
                        LoggedInUserVM viewModel = GetUserInfoFromEmail(data.email);
                        return Ok(viewModel);
                    }
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

        private List<UserSearchVM> GetSearchMatches(IEnumerable<User> matches)
        {
            List<UserSearchVM> searchResults = new List<UserSearchVM> { };
            foreach (User match in matches)
            {
                UserSearchVM searchResult = new UserSearchVM();
                searchResult.name = $"{match.FirstName} {match.LastName}";
                searchResult.location = $"{match.City}, {match.State}";
                searchResult.id = match.Id;
                searchResults.Add(searchResult);
            }
            return searchResults;
        }

        [HttpGet("[action]")]
        public IEnumerable<UserSearchVM> UniversalUserSearch(string term1)
        {
            if (term1 == null)
            {
                return null;
            }
            string[] terms = term1.Split(' ');
            List<User> matches = new List<User> { };
            foreach (string item in terms)
            {
                var nameMatches = _context.Users.Where(a => 
                    $"{a.FirstName.ToLower()} {a.LastName.ToLower()}".Contains(item));
                matches.AddRange(nameMatches);
                var cityMatches = _context.Users.Where(a =>
                    a.City.Contains(item));
                matches.AddRange(cityMatches);
            }
            matches = matches.Distinct().ToList();
            return GetSearchMatches(matches);
        }

        [HttpGet("[action]")]
        public IMappableVM GetDefaultMapCoordinates(int userId)
        {
            var user = _context.Users.Find(userId);
            if (user.Latitude == null)
            {
                return null;
            }
            PointVM location = new PointVM();
            location.lat = user.Latitude;
            location.lng = user.Longitude;
            return location;
        }

    }
}
