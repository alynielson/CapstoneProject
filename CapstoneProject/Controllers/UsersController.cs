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


namespace CapstoneProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
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
           
                User user = new User();
                user.FirstName = data.first_name;
                user.LastName = data.last_name;
                user.Password = data.password;
                user.Email = data.email;
                
            
            return Ok();


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
