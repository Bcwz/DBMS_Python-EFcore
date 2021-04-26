using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DetentionBarrackSetup.Data
{
    public class User
    {
        [Key]
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public string Username { get; set; }

        public ICollection<File> Files { get; set; }
        public ICollection<Permission> Permissions { get; set; }
        public ICollection<AccessLog> AccessLogs { get; set; }

    }
}
