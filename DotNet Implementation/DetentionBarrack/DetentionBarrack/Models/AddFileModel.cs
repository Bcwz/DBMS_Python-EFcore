using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DetentionBarrack.Models
{
    public class AddFileModel
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public int Size { get; set; }
        [Required]
        public Guid Owner { get; set; }
        [Required]
        public List<Guid> Users { get; set; }
        [Required]
        public List<Chunk> Chunks { get; set; }

    }
    public class Chunk
    {
        [Required]
        public Guid ChunkId { get; set; }
        [Required]
        public Guid DiskId { get; set; }
        [Required]
        public int Size { get; set; }
        [Required]
        public int FileIndex { get; set; }
        [Required]
        public int MirrorIndex { get; set; }
    }
}
