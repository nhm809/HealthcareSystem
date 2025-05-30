<<<<<<< HEAD
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs
{
    public class LoginDTO
    {
        [Required]
        public string? Email { get; set; }

        [Required]
        public string? Password { get; set; }
    }
}
=======
public class loginDTO
{
	[Required]
	public string email { get; set; }

	[Required]
	public string Password { get; set; }


}
>>>>>>> parent of 451843a (Update CreateDatabase.sql and InsertDB.sql)
