using DetentionBarrack.Models;
using DetentionBarrack.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DetentionBarrack.Controllers
{
    [ApiController]
    [Route("api/")]
    public class MainController : ControllerBase
    {
        private IMainService userService;

        public MainController(IMainService userService)
        {
            this.userService = userService;
        }

        [HttpPost("adduser")]
        public IActionResult AddUser([FromBody] AddUserModel model)
        {
            double timing = userService.AddUser(model);

            if (timing == 0)
                return BadRequest(new { Message = "Something went wrong." });

            return Ok(new { SecondsElapsed = timing });
        }

        [HttpPost("adddisk")]
        public IActionResult AddDisk([FromBody] AddDiskModel model)
        {
            var timing = userService.AddDisk(model);

            if (timing == 0)
                return BadRequest(new { Message = "Something went wrong." });

            return Ok(new { SecondsElapsed = timing });
        }

        [HttpPost("adddevice")]
        public IActionResult AddDevice([FromBody] AddDeviceModel model)
        {
            var timing = userService.AddDevice(model);

            if (timing == 0)
                return BadRequest(new { Message = "Something went wrong." });

            return Ok(new { SecondsElapsed = timing });
        }

        [HttpGet("users")]
        public IActionResult GetAllUsers()
        {
            var res = userService.GetUsers();
            if (res == null)
                return NoContent();
            return Ok(res);
        }

        [HttpGet("files")]
        public IActionResult GetAllFiles()
        {
            var res = userService.GetFiles();
            if (res == null)
                return NoContent();
            return Ok(res);
        }

        [HttpGet("disks")]
        public IActionResult GetAllDisks()
        {
            var res = userService.GetDisks();
            if (res == null)
                return NoContent();
            return Ok(res);
        }

        [HttpGet("devices")]
        public IActionResult GetAllDevices()
        {
            var res = userService.GetDevices();
            if (res == null)
                return NoContent();
            return Ok(res);
        }

        [HttpGet("filefragment")]
        public IActionResult GetAllFileFragment(Guid fileId)
        {
            var res = userService.GetFileFragment(fileId);
            if (res == null)
                return NoContent();
            return Ok(res);
        }

        [HttpGet("remainingstorage")]
        public IActionResult GetRemainingStorage(Guid diskId)
        {
            var res = userService.GetRemainingStorage(diskId);
            if (res == null)
                return NoContent();
            return Ok(res);
        }


        [HttpPost("addfile")]
        public IActionResult AddFile([FromBody] AddFileModel model)
        {
            var timing = userService.AddFile(model);

            if (timing == 0)
                return BadRequest(new { Message = "Something went wrong." });
            return Ok(new { SecondsElapsed = timing });
        }

        [HttpPost("addpermission")]
        public IActionResult AddPermission([FromBody] AddPermissionModel model)
        {
            var timing = userService.AddPermission(model);
            
            if(timing == 0)
                return BadRequest(new { Message = "Something went wrong." });
            return Ok(new { SecondsElapsed = timing });
        }

        [HttpDelete("deleteuser")]
        public IActionResult DeleteUser(Guid id)
        {
            var timing = userService.DeleteUser(id);

            return Ok(new { SecondsElapsed = timing});
        }
        
        [HttpDelete("deletepermission")]
        public IActionResult DeleteUser(Guid userId, Guid fileId)
        {
            var timing = userService.DeletePermission(userId, fileId);

            return Ok(new { SecondsElapsed = timing });
        }

        [HttpDelete("deletefile")]
        public IActionResult DeleteFile(Guid fileId)
        {
            var timing = userService.DeleteFile(fileId);
            return Ok(new {SecondsElapsed = timing });
        }

        [HttpDelete("deletefilechunk")]
        public IActionResult DeleteFileChunk(Guid fileChunkId)
        {
            var timing = userService.DeleteFileChunk(fileChunkId);
            return Ok(new {SecondsElapsed = timing});
        }

        [HttpPut("updatedevice")]
        public IActionResult UpdateDeviceState(Guid deviceId, string state)
        {
            var timing = userService.UpdateDeviceState(deviceId, state);
            
            return Ok(new {SecondsElapsed = timing});
        }
        
        [HttpPut("updatedisk")]
        public IActionResult UpdateDiskState(Guid diskId, string state)
        {
            var timing = userService.UpdateDiskState(diskId, state);
            
            return Ok(new {SecondsElapsed = timing});
        }
        
    }
}
