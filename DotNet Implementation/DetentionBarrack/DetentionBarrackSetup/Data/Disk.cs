using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DetentionBarrackSetup.Data
{
    public class Disk
    {
        [Key]
        public Guid DiskId { get; set; }
        [Required]
        public long DiskSize { get; set; }
        [Required]
        public Device Device { get; set; }
        [Required]
        public OperationState OperationState { get; set; }
        
        public ICollection<FileChunk> FileChunks { get; set; }

    }
}


