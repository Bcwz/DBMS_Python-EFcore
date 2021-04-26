using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DetentionBarrack.Models
{
    public class AddDiskModel
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        public Guid Device { get; set; }
        [Required]
        public int Capacity { get; set;  }
    }
}