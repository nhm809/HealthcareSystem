<<<<<<< HEAD
﻿using System.ComponentModel.DataAnnotations;

namespace Application.DTOs
=======
﻿public class RegisterDTO
>>>>>>> parent of 451843a (Update CreateDatabase.sql and InsertDB.sql)
{
    public class RegisterDTO
    {
        [Required, EmailAddress]
        public string? Email { get; set; }

        [Required, Phone]
        public string? PhoneNumber { get; set; }

        [Required]
        public string? Password { get; set; }
    }
}