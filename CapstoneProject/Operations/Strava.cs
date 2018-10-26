using CapstoneProject.ViewModels;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace CapstoneProject.Operations
{
    public static class Strava
    {
        public static StravaAthlete GetAthleteDataFromAuthCode(string code)
        {
            string url = $"https://www.strava.com/oauth/token?client_id={Credentials.StravaClientId.ToString()}&client_secret={Credentials.StravaClientSecret}&code={code}";
            System.Net.HttpWebRequest request = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(url);
            request.Method = "POST";
            System.Net.WebResponse response = request.GetResponse();
            try
            {
                Stream stream = response.GetResponseStream();
                StreamReader streamReader = new StreamReader(stream);
                string responseString = streamReader.ReadToEnd();
                StravaAthlete stravaAthlete = JsonConvert.DeserializeObject<StravaAthlete>(responseString);
                return stravaAthlete;
            }
            catch
            {
                return null;
            }
        }
    }
}
