using Insurance.Application.DTOs.Notifications;

namespace Insurance.Application.Interfaces
{
    public interface INotificationService
    {
        Task<List<NotificationDto>> GetMyAsync(int userId);
        Task MarkReadAsync(int userId, int notificationId);
        Task MarkAllReadAsync(int userId);
        Task CreateAsync(int userId, string title, string message, string type);
    }
}