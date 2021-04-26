using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DetentionBarrackSetup.Data
{
    public class File
    {
        [Key]
        public Guid FileId { get; set; }
        [Required]
        public string FileName {get; set;}
        [Required]
        public long Size { get; set; }
        [Required]
        public int Copies { get; set; }

        [Required]
        public User OwnerUser { get; set; }

        public ICollection<Permission> Permissions { get; set; }
        public ICollection<AccessLog> AccessLogs { get; set; }
        public ICollection<FileVersion> FileVersions { get; set; }

    }
}
