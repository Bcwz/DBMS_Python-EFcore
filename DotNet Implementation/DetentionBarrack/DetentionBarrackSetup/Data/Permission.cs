using System;
using System.ComponentModel.DataAnnotations;

namespace DetentionBarrackSetup.Data
{
    public class Permission
    {
        [Key]
        public Guid PermissionId { get; set; }
        [Required]
        public User User { get; set; }
        [Required]
        public File File { get; set; }
    }
}
