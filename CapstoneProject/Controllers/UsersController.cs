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
