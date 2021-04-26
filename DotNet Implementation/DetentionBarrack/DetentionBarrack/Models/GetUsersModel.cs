using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DetentionBarrack.Models
{
    public class GetUsersModel
    {
        public List<UserModel> Users;
        public double SecondsElapsed;
    }

    public class UserModel
    {
        public Guid UserId;
        public string UserName;
    }
}
