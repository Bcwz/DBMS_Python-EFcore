using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DetentionBarrackSetup.Data
{
    public class Device
    {
        [Key]
        public Guid DeviceId { get; set; }
        [Required]
        public string DeviceName { get; set; }
        [Required]
        public OperationState OperationState { get; set; }
        public ICollection<Disk> Disks { get; set; }
    }
}
