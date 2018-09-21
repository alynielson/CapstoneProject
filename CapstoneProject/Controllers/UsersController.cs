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
        // GET: api/Users
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Users/5
        [HttpGet("{id}", Name = "Get")]
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Users
        [HttpPost("[action]")]
        
        public IActionResult Create([FromBody] UserVM data)
        {
           if (data != null)
            {
             try   
                {
                    User user = new User();
                    user.FirstName = data.first_name;
                    user.LastName = data.last_name;
                    user.HashedPassword = PasswordConverter.Encrypt(data.password);
                    user.Email = data.email;
                    _context.Users.Add(user);
                    _context.SaveChangesAsync();
                
                    return Ok();
                }
                catch
                {
                    throw new System.Web.Http.HttpResponseException(System.Net.HttpStatusCode.InternalServerError);
                }
              
            }
            else
            {
                throw new System.Web.Http.HttpResponseException(System.Net.HttpStatusCode.NoContent);
            }
            
            
                


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
