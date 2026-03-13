using Insurance.Application.DTOs.Notifications;

namespace Insurance.Application.Interfaces
{
    public interface INotificationRepository
    {
        Task CreateAsync(int userId, string title, string message, string type);
        Task<List<NotificationDto>> GetMyAsync(int userId);
        Task MarkReadAsync(int userId, int notificationId);
        Task MarkAllReadAsync(int userId);
    }
}