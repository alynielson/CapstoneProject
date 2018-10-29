using CapstoneProject.Models;
using CapstoneProject.ViewModels;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
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

        public static List<Activity> ConvertStravaResponseToAthleteActivity(string before, string after, string accessToken)
        {
            string token = PasswordConverter.Decrypt(accessToken);
            string url = $"https://www.strava.com/api/v3/athlete/activities?access_token={token}&before={before}&after={after}&page=1&per_page=1";
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "GET";
            WebResponse response = request.GetResponse();
            string responseString = null;
            Stream stream = response.GetResponseStream();
            StreamReader streamReader = new StreamReader(stream);
            responseString = streamReader.ReadToEnd();
            List<Activity> activities = JsonConvert.DeserializeObject<List<Activity>>(responseString);
            return activities;
        }

        public static double DateTimeToUnixTimestamp(DateTime dateTime)
        {
            DateTime unixStart = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
            long unixTimeStampInTicks = (dateTime.ToUniversalTime() - unixStart).Ticks;
            return (double)unixTimeStampInTicks / TimeSpan.TicksPerSecond;
        }
    }
}
