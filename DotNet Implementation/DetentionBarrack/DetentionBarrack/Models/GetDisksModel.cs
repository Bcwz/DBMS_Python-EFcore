using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DetentionBarrack.Models
{
    public class GetDisksModel
    {
        public List<DiskModel> Disks { get; set; }
        public double SecondsElapsed { get; set; }
    }

    public class DiskModel
    {
        public Guid DiskId { get; set; }
        public long DiskSize { get; set; }
        public Guid DeviceId { get; set; }
        public string OperationState { get; set; }
    }
}
