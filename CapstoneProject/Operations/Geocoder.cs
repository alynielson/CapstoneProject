using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace CapstoneProject.Operations
{
    public static class Geocoder
    {
        public static string[] RunGeocoder(string city, string state)
        {
            city = city.Trim().Replace(" ", "+");
            state = state.Trim();
            string apiKey = Credentials.GoogleMapsApiKey;
            string url = $"https://maps.googleapis.com/maps/api/geocode/json?components=route:{city}|administrative_area:{state}|country:USA&key={apiKey}";
            WebResponse response = null;
            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                request.Method = "GET";
                response = request.GetResponse();
                string custLat = "43.0362012";
                string custLong = "-87.98582829999999";
                if (response != null)
                {
                    string responseString = null;
                    Stream stream = response.GetResponseStream();
                    StreamReader streamReader = new StreamReader(stream);
                    responseString = streamReader.ReadToEnd();
                    GeoResponse geoResponse = JsonConvert.DeserializeObject<GeoResponse>(responseString);

                    if (geoResponse.status == "OK")
                    {
                        custLat = geoResponse.results[0].geometry.location.lat.ToString();
                        custLong = geoResponse.results[0].geometry.location.lng.ToString();
                    }
                    return new string[] { custLat, custLong };
                }
                return new string[] { custLat, custLong };
            }
            catch
            {
                throw new Exception("Google maps was unable to find address");
            }
        }



        public static string[] ReverseGeocoder(string lat, string lng)
        {
            string apiKey = Credentials.GoogleMapsApiKey;
            string url = $"https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{lng}&key={apiKey}";
            WebResponse response = null;
            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                request.Method = "GET";
                response = request.GetResponse();
                if (response != null)
                {
                    string responseString = null;
                    Stream stream = response.GetResponseStream();
                    StreamReader streamReader = new StreamReader(stream);
                    responseString = streamReader.ReadToEnd();
                    GeoResponse geoResponse = JsonConvert.DeserializeObject<GeoResponse>(responseString);
                    if (geoResponse.status == "OK")
                    {
                        string[] relevantAddress = geoResponse.results[0].formatted_address.Split(',');
                        string city = relevantAddress[1].Trim();
                        string state = relevantAddress[2].Trim().Remove(2);
                        return new string[] { city, state };
                    }
                    return new string[] {"",""};
                }
                return new string[] { "", "" };
            }
            catch
            {
                throw new Exception("Google maps was unable to find address");
            }
        
    }
}

    public class Location
    {
        public decimal lat { get; set; }
        public decimal lng { get; set; }
    }

    public class AddressComponent
    {
        public string long_name { get; set; }
        public string short_name { get; set; }
        public string[] types { get; set; }
    }

    public class Geometry
    {
        public Bounds bounds { get; set; }
        public Location location { get; set; }
        public string location_type { get; set; }
        public Bounds viewport { get; set; }
    }

    public class Bounds
    {
        public Location northeast { get; set; }
        public Location southwest { get; set; }

    }





    public class Result
    {
        public AddressComponent[] address_components { get; set; }
        public string formatted_address { get; set; }
        public Geometry geometry { get; set; }
        public string place_id { get; set; }
        public string[] types { get; set; }


    }

    public class GeoResponse
    {
        public string status { get; set; }
        public Result[] results { get; set; }
    }
}
