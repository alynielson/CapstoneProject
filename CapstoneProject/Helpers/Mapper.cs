using CapstoneProject.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CapstoneProject.Helpers
{
    public static class Mapper
    {
        public static PointVM CreatePointVM(string latitude, string longitude)
        {
            PointVM vm = new PointVM();
            vm.lat = latitude;
            vm.lng = longitude;
            return vm;
        }
    }
}
