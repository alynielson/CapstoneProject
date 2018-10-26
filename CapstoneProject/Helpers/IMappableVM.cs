using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CapstoneProject.Helpers
{
    public interface IMappableVM
    {
        string lat { get; set; }

        string lng { get; set; }
    }
}
