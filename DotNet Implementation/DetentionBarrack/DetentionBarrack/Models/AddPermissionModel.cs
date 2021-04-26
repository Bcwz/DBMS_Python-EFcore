using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DetentionBarrack.Models
{
    public class AddPermissionModel
    {
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public Guid FileId { get; set; }
    }
}
