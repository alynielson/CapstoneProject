using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CapstoneProject.ViewModels;
using Newtonsoft.Json;
using CapstoneProject.Models;
using Microsoft.AspNetCore.Routing;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Protocols;
using CapstoneProject.Operations;
using IntegrationProject.Data;
using System.IO;

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
                string url = $"https://www.strava.com/oauth/token?client_id={Credentials.StravaClientId.ToString()}&client_secret={Credentials.StravaClientSecret}&code={code.auth_code}";
                System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(url);
                request.Method = "POST";
                System.Net.WebResponse response = request.GetResponse();
               
                    try
                    {
                        Stream stream = response.GetResponseStream();
                        StreamReader streamReader = new StreamReader(stream);
                        string responseString = streamReader.ReadToEnd();
                        StravaAthlete stravaAthlete = JsonConvert.DeserializeObject<StravaAthlete>(responseString);
                        var user = _context.Users.Find(code.id);
                        user.StravaAccessTokenHashed = PasswordConverter.Encrypt(code.auth_code);
                        _context.Users.Update(user);
                        _context.SaveChanges();
                        return Ok();
                    }
                    catch
                    {
                        return BadRequest();
                    }
                
                
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


        // POST: api/Users
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

        private IEnumerable<User> SearchByName(string first_name = null, string last_name = null)
        {
            IEnumerable<User> firstNameMatches;

            IEnumerable<User> matches;
            

            if (first_name != null)
            {
                firstNameMatches = _context.Users.Where(a => a.FirstName.ToLower().Trim() == first_name.ToLower().Trim());
                if (last_name != null)
                {
                    matches = firstNameMatches.Where(a => a.LastName.ToLower().Trim() == last_name.ToLower().Trim());
                }
                else
                {
                    matches = firstNameMatches;
                }
            }
            else if (last_name != null)
            {
                matches = _context.Users.Where(a => a.LastName.ToLower().Trim() == last_name.ToLower().Trim());
            }
            else
            {
                return null;
            }
            return matches;
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
        public IEnumerable<UserSearchVM> SearchUsersByName(string first_name = null, string last_name = null)
        {
            IEnumerable<User> matches = SearchByName(first_name, last_name);
            return GetSearchMatches(matches);
        }

        [HttpGet("[action]")]
        public IEnumerable<UserSearchVM> SearchUsersByLocation(string city, string state)
        {
           
            var matches = _context.Users.Where(a => a.City == city && a.State == state);
            return GetSearchMatches(matches);
            
        }

        [HttpGet("[action]")]
        public IEnumerable<UserSearchVM> SearchUsersByAll(string city, string state, string first_name = null, string last_name = null)
        {
            IEnumerable<User> nameMatches = SearchByName(first_name, last_name);
            IEnumerable<User> matches = nameMatches.Where(a => a.City == city && a.State == state);
            return GetSearchMatches(matches);
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
            foreach (String item in terms)
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

// PUT: api/Users/5
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
