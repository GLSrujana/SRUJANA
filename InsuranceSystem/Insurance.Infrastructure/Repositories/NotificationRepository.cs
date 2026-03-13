using Insurance.Application.DTOs.Notifications;
using Insurance.Application.Interfaces;
using Insurance.Domain.Entities;
using Insurance.Domain.Enums;
using Insurance.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Insurance.Infrastructure.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly InsuranceDbContext _db;

        public NotificationRepository(InsuranceDbContext db)
        {
            _db = db;
        }

        public async Task CreateAsync(int userId, string title, string message, string type)
        {
            var enumType = Enum.TryParse<NotificationType>(type, out var parsed)
                ? parsed
                : NotificationType.General;

            _db.Notifications.Add(new Notification
            {
                UserId = userId,
                Title = title,
                Message = message,
                Type = enumType,
                IsRead = false,
                CreatedAtUtc = DateTime.UtcNow
            });

            await _db.SaveChangesAsync();
        }

        public async Task<List<NotificationDto>> GetMyAsync(int userId)
        {
            var list = await _db.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.Id)
                .ToListAsync();

            return list.Select(n => new NotificationDto
            {
                Id = n.Id,
                Type = n.Type.ToString(),
                Title = n.Title,
                Message = n.Message,
                IsRead = n.IsRead,
                CreatedAtUtc = n.CreatedAtUtc
            }).ToList();
        }

        public async Task MarkReadAsync(int userId, int notificationId)
        {
            var n = await _db.Notifications
                .FirstOrDefaultAsync(x => x.Id == notificationId && x.UserId == userId);

            if (n == null)
                throw new Exception("Notification not found.");

            n.IsRead = true;
            await _db.SaveChangesAsync();
        }

        public async Task MarkAllReadAsync(int userId)
        {
            var list = await _db.Notifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .ToListAsync();

            foreach (var n in list)
            {
                n.IsRead = true;
            }

            await _db.SaveChangesAsync();
        }
    }
}