using Insurance.Application.DTOs.Notifications;
using Insurance.Application.Interfaces;

namespace Insurance.Application.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _repo;

        public NotificationService(INotificationRepository repo)
        {
            _repo = repo;
        }

        public Task CreateAsync(int userId, string title, string message, string type)
            => _repo.CreateAsync(userId, title, message, type);

        public Task<List<NotificationDto>> GetMyAsync(int userId)
            => _repo.GetMyAsync(userId);

        public Task MarkReadAsync(int userId, int notificationId)
            => _repo.MarkReadAsync(userId, notificationId);

        public Task MarkAllReadAsync(int userId)
            => _repo.MarkAllReadAsync(userId);
    }
}