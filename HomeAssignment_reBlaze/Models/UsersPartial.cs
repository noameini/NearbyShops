using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;

namespace HomeAssignment_reBlaze.Models
{
    public partial class Users
    {
        public static string GenerateRandomSalt()
        {
            RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();
            var bytes = new Byte[16];
            rng.GetBytes(bytes);
            return Convert.ToBase64String(bytes);
        }

        public static string doHash(string passwordPlain, string salt)
        {
            System.Security.Cryptography.SHA1 sha = System.Security.Cryptography.SHA1.Create();
            byte[] preHash = System.Text.Encoding.UTF32.GetBytes(passwordPlain + salt);
            byte[] hash = sha.ComputeHash(preHash);
            string password = System.Convert.ToBase64String(hash, 0, hash.Length);
            return password;
        }
    }
}