using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace HomeAssignment_reBlaze.Models
{
    public class Register
    {
        [Required]
        [Display(Name = "Username")]
        public string username { get; set; }

        [Required]
        [Display(Name = "FirstName")]
        public string firstname { get; set; }

        [Required]
        [Display(Name = "LastName")]
        public string lastname { get; set; }

        [Required]
        [Display(Name = "Password")]
        public string password { get; set; }

        [Required]
        [Display(Name = "ConfirmPassword")]
        [Compare("password", ErrorMessage = "Wrong password. Please try again.")]
        public string Confirmpassword { get; set; }

    }
}