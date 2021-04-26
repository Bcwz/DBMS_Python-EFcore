using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DetentionBarrackSetup.Data
{
    public class AccessLog
    {
        [Key]
        public Guid LogId { get; set; }
        [Required]
        public DateTime LastAccess { get; set; }
        [Required]
        public File File { get; set; }
        [Required]
        public User User { get; set; }
        


    }
}
