using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DetentionBarrackSetup.Data
{
    public class OperationState
    {
        [Key]
        public int OperationStateId { get; set; }
        [Required]
        public string DisplayValue { get; set; }
        public ICollection<Device> Devices { get; set; }
        public ICollection<Disk> Disks { get; set; }

    }
}
