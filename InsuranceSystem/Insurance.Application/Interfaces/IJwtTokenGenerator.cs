using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Insurance.Domain.Entities;

namespace Insurance.Application.Interfaces
{
    public interface IJwtTokenGenerator
    {
        (string token, DateTime expiresAtUtc) GenerateToken(User user, string roleName);
    }
}
