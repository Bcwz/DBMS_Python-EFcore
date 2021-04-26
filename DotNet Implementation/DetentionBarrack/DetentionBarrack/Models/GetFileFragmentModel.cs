using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DetentionBarrack.Models
{
    public class GetFileFragmentModel
    {
        public List<FileFragmentModel> FileChunks { get; set; }
        public double SecondsElapsed { get; set; }
    }

    public class FileFragmentModel
    {
        public Guid FileChunkId { get; set; }
        public long FileChunkSize { get; set; }
        public Guid FileVersionId { get; set; }
        public Guid DiskId { get; set; }
        public int FileIndex { get; set; }
        public int MirrorIndex { get; set; }
    }
}
