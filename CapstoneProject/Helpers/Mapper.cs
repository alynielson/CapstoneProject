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


        public static PointVM[] GetPoints(List<IMappable> coordinateList)
        {
            PointVM[] coords = new PointVM[coordinateList.Count()];
            for (int i = 0; i < coords.Length; i++)
            {
                coords[i] = Mapper.CreatePointVM(coordinateList[i].Latitude1, coordinateList[i].Longitude1);
            }
            return coords;
        }
    }
}
