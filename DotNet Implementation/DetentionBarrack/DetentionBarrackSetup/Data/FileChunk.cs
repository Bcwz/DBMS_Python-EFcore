using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DetentionBarrackSetup.Data
{
    public class FileChunk
    {
        [Key]
        public Guid FileChunkId { get; set; }
        [Required]
        public long FileChunkSize { get; set; }
        [Required]
        public int FileIndex { get; set;}
        [Required]
        public int MirrorIndex {get; set;}
        [Required]
        public FileVersion FileVersion { get; set; }
        [Required]
        public Disk Disk { get; set; }

    }
}
