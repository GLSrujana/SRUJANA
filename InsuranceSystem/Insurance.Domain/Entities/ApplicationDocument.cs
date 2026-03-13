using Insurance.Domain.Common;

namespace Insurance.Domain.Entities
{
    public class ApplicationDocument : BaseEntity
    {
        public int PolicyApplicationId { get; set; }
        public PolicyApplication PolicyApplication { get; set; } = null!;

        public string DocumentType { get; set; } = string.Empty; // ID proof, event booking, etc.
        public string FileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;     // later: blob/local path
        public DateTime UploadedAtUtc { get; set; } = DateTime.UtcNow;

        public int UploadedByUserId { get; set; }
        public User UploadedByUser { get; set; } = null!;
    }
}