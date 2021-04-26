using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DetentionBarrack.Models
{
    public class GetDevicesModel
    {
        public List<DeviceModel> Devices { get; set; }
        public double SecondsElapsed { get; set; }
    }

    public class DeviceModel
    {
        public Guid DeviceId { get; set; }
        public string DeviceName { get; set; }
        public string OperationState { get; set; }
    }
}
