using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DetentionBarrack.Models
{
    public class GetFilesModel
    {
        public List<FileModel> Files;
        public double SecondsElapsed;
    }

    public class FileModel
    {
        public Guid FileId { get; set; }
        public string FileName { get; set; }
        public long Size { get; set; }
        public int Copies { get; set; }
        public Guid OwnerUserId { get; set; }
    }
}
