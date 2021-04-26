using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DetentionBarrackSetup.Data
{
    public class FileChunkDevice
    {
        [Key]
        public Guid FileChunkDeviceId { get; set; }
        [Required]
        public Device Device { get; set; }
        [Required]
        public DateTime UploadDateTime { get; set; }
    }
}
