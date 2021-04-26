using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DetentionBarrackSetup.Data
{
    public class FileVersion
    {
        [Key]
        public Guid FileVersionId { get; set; }
        [Required]
        public File File { get; set; }
        [Required]
        public DateTime FileDateTime { get; set; }
        public ICollection<FileChunk> FileChunks { get; set; }

    }
}
