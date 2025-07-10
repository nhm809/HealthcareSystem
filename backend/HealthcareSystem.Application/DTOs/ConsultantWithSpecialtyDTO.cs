namespace Application.DTOs
{
    public class ConsultantWithSpecialtyDTO
    {
        public string? Avatar { get; set; }
        public int ConsultantId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public List<SpecialtyDTO> Specialties { get; set; }
        public List<FreeSlotDTO> FreeSlots { get; set; } = new();
    }
}
