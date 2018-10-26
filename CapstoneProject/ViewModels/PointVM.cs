using CapstoneProject.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CapstoneProject.ViewModels
{
    public class PointVM : IMappableVM
    {
        public string lat { get; set; }
        public string lng { get; set; }
    }
}
