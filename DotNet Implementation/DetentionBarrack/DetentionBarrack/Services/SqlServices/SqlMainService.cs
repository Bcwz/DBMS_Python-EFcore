using DetentionBarrackSetup.Data;
using DetentionBarrack.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Diagnostics;
using DetentionBarrack.Models;
using Microsoft.EntityFrameworkCore;

namespace DetentionBarrack.Services.SqlServices
{
    public class SqlMainService : IMainService
    {
        private readonly MyDbContext context;
        public SqlMainService(MyDbContext context)
        {
            this.context = context;
        }
        public double AddUser(AddUserModel model)
        {
            Stopwatch stopWatch = new Stopwatch();

            stopWatch.Start();
            User newUser = new User
            {
                UserId = model.Id,
                Username = model.Name
            };
            context.Users.Add(newUser);
            context.SaveChanges();
            stopWatch.Stop();

            return stopWatch.Elapsed.TotalSeconds;
        }

        public double AddDevice(AddDeviceModel model)
        {
            Stopwatch stopWatch = new Stopwatch();

            stopWatch.Start();

            Device newDevice = new Device
            {
                DeviceId = model.Id,
                DeviceName = model.Name,
                OperationState = context.OperationStates.First(opState => opState.DisplayValue == "Online")
            };
            context.Devices.Add(newDevice);
            context.SaveChanges();
            stopWatch.Stop();

            return stopWatch.Elapsed.TotalSeconds;

        }

        public double AddDisk(AddDiskModel model)
        {
            Stopwatch stopWatch = new Stopwatch();

            stopWatch.Start();
            Disk newDisk = new Disk
            {
                DiskId = model.Id,
                DiskSize = model.Capacity,
                Device = context.Devices.First(device => device.DeviceId == model.Device),
                OperationState = context.OperationStates.First(opState => opState.DisplayValue == "Online")
            };
            context.Disks.Add(newDisk);
            context.SaveChanges();
            stopWatch.Stop();

            return stopWatch.Elapsed.TotalSeconds;

        }


        public GetUsersModel GetUsers()
        {
            Stopwatch stopWatch = new Stopwatch();

            stopWatch.Start();

            GetUsersModel result = new GetUsersModel
            {
                Users = context.Users.ToList().Select(user =>
                {
                    return new UserModel
                    {
                        UserId = user.UserId,
                        UserName = user.Username
                    };
                }).ToList(),
            };
            stopWatch.Stop();
            result.SecondsElapsed = stopWatch.Elapsed.TotalSeconds;

            return result;
        }

        public GetFilesModel GetFiles()
        {
            Stopwatch stopWatch = new Stopwatch();

            stopWatch.Start();
            var files = context.Files.Include(file => file.OwnerUser).ToList();
            GetFilesModel result = new GetFilesModel
            {
                Files = files.Select(file => new FileModel
                {
                    FileId = file.FileId,
                    FileName = file.FileName,
                    Size = file.Size,
                    Copies =  file.Copies,
                    OwnerUserId = file.OwnerUser.UserId
                }).ToList(),
            };
            stopWatch.Stop();
            result.SecondsElapsed = stopWatch.Elapsed.TotalSeconds;

            return result;
        }

        public GetDisksModel GetDisks()
        {
            Stopwatch stopWatch = new Stopwatch();

            stopWatch.Start();

            var data = context.Disks.Include(disk => disk.OperationState)
                                    .Include(disk => disk.Device)
                                    .ToList();

            GetDisksModel result = new GetDisksModel
            {

                Disks = data.Select(disk =>
                {
                    return new DiskModel
                    {
                        DiskId = disk.DiskId,
                        DiskSize = disk.DiskSize,
                        DeviceId = disk.Device.DeviceId,
                        OperationState = disk.OperationState.DisplayValue
                    };
                }).ToList()
            };
            stopWatch.Stop();
            result.SecondsElapsed = stopWatch.Elapsed.TotalSeconds;

            return result;
        }

        public GetDevicesModel GetDevices()
        {
            Stopwatch stopWatch = new Stopwatch();

            stopWatch.Start();

            var data = context.Devices.Include(device => device.OperationState)
                                        .ToList();

            GetDevicesModel result = new GetDevicesModel
            {

                Devices = data.Select(device =>
                {
                    return new DeviceModel
                    {
                        DeviceId = device.DeviceId,
                        DeviceName = device.DeviceName,
                        OperationState = device.OperationState.DisplayValue
                    };
                }).ToList()
            };

            stopWatch.Stop();
            result.SecondsElapsed = stopWatch.Elapsed.TotalSeconds;

            return result;
        }

        public GetFileFragmentModel GetFileFragment(Guid fileId)
        {
            Stopwatch stopWatch = new Stopwatch();

            stopWatch.Start();

            var data = context.Files.Where(file => file.FileId == fileId)
                                    .Include(file => file.FileVersions)
                                    .ThenInclude(fileVersion => fileVersion.FileChunks)
                                    .ThenInclude(fileChunk => fileChunk.Disk)
                                    .ToList();


            GetFileFragmentModel result = new GetFileFragmentModel
            {

                FileChunks = data.Count < 1 ? null : data.First().FileVersions.First().FileChunks.Select(fileChunk =>
                {
                    return new FileFragmentModel
                    {
                        FileChunkId = fileChunk.FileChunkId,
                        FileChunkSize = fileChunk.FileChunkSize,
                        FileVersionId = fileChunk.FileVersion.FileVersionId,
                        DiskId = fileChunk.Disk.DiskId,
                        FileIndex = fileChunk.FileIndex,
                        MirrorIndex = fileChunk.MirrorIndex
                    };
                }).ToList()
            };

            stopWatch.Stop();
            result.SecondsElapsed = stopWatch.Elapsed.TotalSeconds;

            return result;
        }

        public GetRemainingStorageModel GetRemainingStorage(Guid diskId)
        {
            Stopwatch stopWatch = new Stopwatch();

            stopWatch.Start();

            var data = context.Disks.Where(disk => disk.DiskId == diskId)
                                    .Include(disk => disk.FileChunks)
                                    .ToList();


            GetRemainingStorageModel result = new GetRemainingStorageModel
            {

                Remaining = data.Count > 0 ? data.First().DiskSize - data.First().FileChunks.Sum(fileChunk => fileChunk.FileChunkSize) : 0 
            };

            stopWatch.Stop();
            result.SecondsElapsed = stopWatch.Elapsed.TotalSeconds;

            return result;
        }

        public double AddFile(AddFileModel model)
        {
            Stopwatch stopWatch = new Stopwatch();
            stopWatch.Start();

            User ownerUser = context.Users.First(user => user.UserId == model.Owner);
            File file = new File
            {
                FileId = model.Id,
                FileName = model.Name,
                Size = model.Size,
                Copies = model.Chunks.Max(chunk => chunk.MirrorIndex),
                OwnerUser = ownerUser
            };

            context.Files.Add(file);
            context.SaveChanges();

            File insertedFile = context.Files.First(_file => _file.FileId == file.FileId);

            model.Users.ForEach(user =>
            {
                Permission permission = new Permission
                {
                    PermissionId = Guid.NewGuid(),
                    User = context.Users.First(_user => _user.UserId == user),
                    File = insertedFile
                };

                context.Permissions.Add(permission);
                context.SaveChanges();
            });


            AccessLog accessLog = new AccessLog
            {
                LogId = Guid.NewGuid(),
                LastAccess = DateTime.Now,
                File = insertedFile,
                User = context.Users.First(user => user.UserId == model.Owner)
            };

            context.AccessLogs.Add(accessLog);
            context.SaveChanges();

            FileVersion fileVersion = new FileVersion
            {
                FileVersionId = Guid.NewGuid(),
                File = insertedFile,
                FileDateTime = DateTime.Now
            };

            context.FileVersions.Add(fileVersion);
            context.SaveChanges();

            FileVersion insertedFileVersion = context.FileVersions.First(_fileVersion => _fileVersion.FileVersionId == fileVersion.FileVersionId);

            model.Chunks.ForEach(chunk =>
            {
                Disk disk = context.Disks.First(disk => disk.DiskId == chunk.DiskId);
                FileChunk fileChunk = new FileChunk
                {
                    FileChunkId = chunk.ChunkId,
                    FileChunkSize = chunk.Size,
                    FileVersion = insertedFileVersion,
                    Disk = disk,
                    FileIndex = chunk.FileIndex,
                    MirrorIndex = chunk.MirrorIndex
                };

                context.FileChunks.Add(fileChunk);
                context.SaveChanges();
            });

            stopWatch.Stop();
            return stopWatch.Elapsed.TotalSeconds;
        }

        public double DeleteUser(Guid id)
        {
            Stopwatch stopWatch = new Stopwatch();
            stopWatch.Start();
            var user = context.Users.OrderBy(user => user.UserId == id).Include(user => user.Permissions)
                                                                        .Include(user => user.AccessLogs)
                                                                        .Include(user => user.Files)
                                                                            .ThenInclude(file => file.FileVersions)
                                                                            .ThenInclude(fileVersion => fileVersion.FileChunks).First();
            context.Remove(user);
            context.SaveChanges();
            stopWatch.Stop();
            return stopWatch.Elapsed.TotalSeconds;
        }

        public double DeletePermission(Guid userId, Guid fileId)
        {
            Stopwatch stopWatch = new Stopwatch();
            stopWatch.Start();
            var user = context.Users.FirstOrDefault(_user => _user.UserId == userId);
            var file = context.Files.FirstOrDefault(_file => _file.FileId == fileId);
            var permission = context.Permissions
                                                    .OrderBy(_permission => _permission.User == user 
                                                    && _permission.File == file);

            context.Remove(permission);
            context.SaveChanges();
            stopWatch.Stop();
            return stopWatch.Elapsed.TotalSeconds;

        }

        public double AddPermission(AddPermissionModel model)
        {
            Stopwatch stopWatch = new Stopwatch();
            stopWatch.Start();

            User user = context.Users.First(_user => _user.UserId == model.UserId);
            File file = context.Files.First(_file => _file.FileId == model.FileId);
            Permission permission = new Permission
            {
                PermissionId = Guid.NewGuid(),
                User = user,
                File = file,
            };

            context.Permissions.Add(permission);
            context.SaveChanges();

            stopWatch.Stop();
            return stopWatch.Elapsed.TotalSeconds;

        }

        public double DeleteFile(Guid fileId)
        {
            Stopwatch stopWatch = new Stopwatch();
            stopWatch.Start();
            var file = context.Files.OrderBy(_file => _file.FileId == fileId)
                .Include(_file => _file.Permissions)
                .Include(_file => _file.AccessLogs)                                   
                .Include(_file => _file.FileVersions)
                    .ThenInclude(fileVersion => fileVersion.FileChunks).First();
            context.Remove(file);
            context.SaveChanges();
            stopWatch.Stop();
            return stopWatch.Elapsed.TotalSeconds;
        }

        public double DeleteFileChunk(Guid fileChunkId)
        {
            Stopwatch stopWatch = new Stopwatch();
            stopWatch.Start();
            var fileChunk = context.FileChunks.OrderBy(_fileChunk => _fileChunk.FileChunkId == fileChunkId).First();
            context.Remove(fileChunk);
            context.SaveChanges();
            stopWatch.Stop();
            return stopWatch.Elapsed.TotalSeconds;
        }

        public double UpdateDeviceState(Guid deviceId, string state)
        {
            Stopwatch stopWatch = new Stopwatch();
            stopWatch.Start();
            OperationState opState = context.OperationStates.First(_opState => _opState.DisplayValue == state);
            Device device = context.Devices.First(_device => _device.DeviceId == deviceId);
            device.OperationState = opState;
            context.SaveChanges();
            stopWatch.Stop();
            return stopWatch.Elapsed.TotalSeconds;
        }
        
        public double UpdateDiskState(Guid diskId, string state)
        {
            Stopwatch stopWatch = new Stopwatch();
            stopWatch.Start();
            OperationState opState = context.OperationStates.First(_opState => _opState.DisplayValue == state);
            Disk disk = context.Disks.First(_device => _device.DiskId == diskId);
            disk.OperationState = opState;
            context.SaveChanges();
            stopWatch.Stop();
            return stopWatch.Elapsed.TotalSeconds;
        }
    }
}
