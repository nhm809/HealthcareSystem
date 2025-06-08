using Domain.Entities;

namespace HealthcareSystem.Domain.Entities
{
    public class UserSpecialty
    {
        public int UserId { get; set; }
        public int SpecialtyId { get; set; }

        public User? User { get; set; }
        public Specialty? Specialty { get; set; }
    }
//    dotnet ef migrations add Fix_UserSpecialty_Table
//dotnet ef database update


}


