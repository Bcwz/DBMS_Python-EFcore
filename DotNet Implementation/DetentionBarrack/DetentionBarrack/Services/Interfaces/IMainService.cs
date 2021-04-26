using DetentionBarrack.Models;
using DetentionBarrackSetup.Data;
using System;
using System.Collections.Generic;

namespace DetentionBarrack.Services.Interfaces
{
    public interface IMainService
    {
        public double AddUser(AddUserModel model);
        public GetUsersModel GetUsers();
        public GetFilesModel GetFiles();
        public GetDisksModel GetDisks();

        public GetDevicesModel GetDevices();
        public GetFileFragmentModel GetFileFragment(Guid fileId);
        public GetRemainingStorageModel GetRemainingStorage(Guid diskId);
        public double AddFile(AddFileModel model);
        public double AddDevice(AddDeviceModel model);
        public double AddDisk(AddDiskModel model);
        public double AddPermission(AddPermissionModel model);
        public double DeleteUser(Guid id);
        public double DeletePermission(Guid userId, Guid fileId);
        public double DeleteFile(Guid fileId);
        public double DeleteFileChunk(Guid fileChunkId);
        public double UpdateDeviceState(Guid deviceId, string state);
        public double UpdateDiskState(Guid diskId, string state);
    }
}
