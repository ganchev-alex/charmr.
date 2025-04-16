using Server.Models;

namespace Server.Utility
{
    public static class UserExtensions
    {
        public static bool MatchesOrientation(this User user, User userCandidate)
        {
            if (user.Details == null || userCandidate.Details == null)
            {
                return false;
            }

            string userGender = user.Details.Gender;
            string userOrientation = user.Details.Sexuality;
            string candidateGender = userCandidate.Details.Gender;
            string candidateOrientation = userCandidate.Details.Sexuality;

            if (userOrientation == "heterosexual")
            {
                return (userGender == "male" && candidateGender == "female" && (candidateOrientation == "heterosexual" || candidateOrientation == "bisexual" || candidateOrientation == "without_preference")) ||
                       (userGender == "female" && candidateGender == "male" && (candidateOrientation == "heterosexual" || candidateOrientation == "bisexual" || candidateOrientation == "without_preference"));
            }
            else if (userOrientation == "homosexual")
            {
                return (userGender == candidateGender) && (candidateOrientation == "homosexual" || candidateOrientation == "bisexual" || candidateOrientation == "without_preference");
            }
            else if (userOrientation == "bisexual" || userOrientation == "without_preference")
            {
                return (userGender == "male" && (candidateGender == "female" && (candidateOrientation == "heterosexual" || candidateOrientation == "bisexual" || candidateOrientation == "without_preference") ||
                                                 candidateGender == "male" && (candidateOrientation == "homosexual" || candidateOrientation == "bisexual" || candidateOrientation == "without_preference"))) ||
                       (userGender == "female" && (candidateGender == "male" && (candidateOrientation == "heterosexual" || candidateOrientation == "bisexual" || candidateOrientation == "without_preference") ||
                                                   candidateGender == "female" && (candidateOrientation == "homosexual" || candidateOrientation == "bisexual" || candidateOrientation == "without_preference")));
            }

            return false;
        }

        private static double DegreesToRadians(double degree) => degree * (Math.PI / 180);

        public static double GetDistance(this User user, User userCanditate)
        {
            if (user.Details == null || userCanditate.Details == null)
            {
                return double.MaxValue; 
            }

            double lat1 = user.Details.Latitude;
            double lon1 = user.Details.Longitude;
            double lat2 = userCanditate.Details.Latitude;
            double lon2 = userCanditate.Details.Longitude;

            const double EarthRadiusKm = 6371.0;

            double dLat = DegreesToRadians(lat2 - lat1);
            double dLon = DegreesToRadians(lon2 - lon1);

            double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                       Math.Cos(DegreesToRadians(lat1)) * Math.Cos(DegreesToRadians(lat2)) *
                       Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return EarthRadiusKm * c;
        }

        public static int CalculateAge(this User user)
        {
            return DateTime.Today.Year - user.Details.BirthYear;
        }
    }
}
