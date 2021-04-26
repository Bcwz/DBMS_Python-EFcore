//@ts-check

const JsonHeader = {
    "Content-Type": "application/json"
}

/**
 * @type {TimeoutRequestInt}
 */
const FetchOptionBase = {
    mode: "cors",
    timeout: 5000
}

/**
 * @type {TimeoutRequestInt}
 */
const FetchOptionPOST = {
    method: 'POST',
    ...FetchOptionBase,
    headers: {
        ...JsonHeader
    }
}

/**
 * @type {TimeoutRequestInt}
 */
const FetchOptionGET = {
    method: 'GET',
    ...FetchOptionBase,
    headers: {
        ...JsonHeader
    }
}

/**
 * @type {TimeoutRequestInt}
 */
const FetchOptionsDELETE = {
    method: 'DELETE',
    ...FetchOptionBase,
}

/**
 * @type {TimeoutRequestInt}
 */
const FetchOptionsPUT = {
    method: 'PUT',
    ...FetchOptionBase,
}

/**
 * @type {ResponseLog[]}
 */
const TempLogs = []

class DBClientReal extends DBClientStub
{
    /**
     * @param {string} baseEndpoint
     * @param {string} clientType
     */
    constructor(baseEndpoint, clientType)
    {
        super(baseEndpoint, clientType)
    }

    /**
     * @param {any[]} args
     */
    log(...args)
    {
        super.log(args)

        const seconds = parseFloat(args[0].secondsElapsed)

        if (!isNaN(seconds))
        {
            TempLogs.push({
                time: new Date(),
                description: args[1],
                clientType: this.clientType,
                elapsed: seconds
            })
        }
    }

    /**
     * @returns {Promise<User[]>}
     */
    async getAllUsers()
    {
        try
        {
            const response = await fetchWithTimeout(this.baseEndpoint + "/api/users", {
                ...FetchOptionGET
            })

            /**
             * @type {{ users: { userId: string; userName: string; }[]}}
             */
            const result = await response.json()

            this.log(result)

            return result.users
                .map(x => ({ id: x.userId, name: x.userName }))
        }
        catch (error)
        {
            this.error(error)
            return []
        }
    }

    /**
     * @returns {Promise<Device[]>}
     */
    async getAllDevices()
    {
        try
        {
            const response = await fetchWithTimeout(this.baseEndpoint + "/api/devices", {
                ...FetchOptionGET
            })

            const result = await response.json()

            this.log(result)

            return result.devices.map(x => ({
                id: x.deviceId,
                name: x.deviceName,
                status: x.operationStatus,
                disks: []
            }))
        }
        catch (error)
        {
            this.error(error)
            return []
        }
    }

    /**
     * @returns {Promise<Disk[]>}
     */
    async getAllDisks()
    {
        try
        {
            const response = await fetchWithTimeout(this.baseEndpoint + "/api/disks", {
                ...FetchOptionGET
            })

            const result = await response.json()

            this.log(result)

            return result.disks.map(x => ({
                id: x.diskId,
                deviceId: x.deviceId,
                capacity: x.diskSize,
                status: x.operationState
            }))
        }
        catch (error)
        {
            this.error(error)
            return []
        }
    }

    /**
     * @returns {Promise<StorageFile[]>}
     */
    async getAllFiles()
    {
        try
        {
            const response = await fetchWithTimeout(this.baseEndpoint + "/api/files", {
                ...FetchOptionGET
            })

            const result = await response.json()

            this.log(result)

            return result.files.map(x =>
            {
                return {
                    id: x.fileId,
                    name: x.fileName,
                    size: x.size,
                    copies: x.copies,
                    owner: context.users.find(xx => xx.id == x.ownerUserId),
                    users: [context.users.find(xx => xx.id == x.ownerUserId)]
                }
            })
        }
        catch (error)
        {
            this.error(error)
            return []
        }
    }

    async getAllFileChunks()
    {
        return []
    }

    /**
     * 
     * @param {StorageFile} file 
     */
    async getFileFragments(file)
    {
        try
        {
            const response = await fetchWithTimeout(this.baseEndpoint + "/api/filefragment?fileId=" + file.id, {
                ...FetchOptionGET
            })

            const result = await response.json()

            this.log(result)
            // console.log("File fragments: " + file.name, JSON.stringify(result, undefined, 2))
        }
        catch (error)
        {
            this.error(error)
        }
    }

    /**
     * 
     * @param {User} user
     * @return {Promise}  
     */
    async addUser(user)
    {
        try
        {
            const response = await fetchWithTimeout(this.baseEndpoint + "/api/adduser", {
                ...FetchOptionPOST,
                body: JSON.stringify(user),
            })
            const result = await response.json()
            this.log(result)
            return result
        }
        catch (error)
        {
            this.error(error)
        }
    }

    /**
     * @param {Device} device
     * @returns {Promise}
     */
    async addDevice(device)
    {
        try
        {
            const response = await fetchWithTimeout(this.baseEndpoint + "/api/adddevice", {
                ...FetchOptionPOST,
                body: JSON.stringify(device),
            })
            const result = await response.json()
            this.log(result)
            return result
        }
        catch (error)
        {
            this.error(error)
        }
    }

    /**
     * 
     * @param {Disk} disk 
     * @returns {Promise}
     */
    async addDisk(disk)
    {
        try
        {
            const response = await fetchWithTimeout(this.baseEndpoint + "/api/adddisk", {
                ...FetchOptionPOST,
                body: JSON.stringify(disk),
            })
            const result = await response.json()
            this.log(result)
            return result
        }
        catch (error)
        {
            this.error(error)
        }
    }

    async addFile(file)
    {
        try
        {
            const response = await fetchWithTimeout(this.baseEndpoint + "/api/addfile", {
                ...FetchOptionPOST,
                body: JSON.stringify(file),
            })
            const result = await response.json()
            this.log(result)
            return result
        }
        catch (error)
        {
            this.error(error)
        }
    }

    /**
     * 
     * @param {User} user 
     */
    async deleteUser(user)
    {
        try
        {
            const response = await fetchWithTimeout(this.baseEndpoint + "/api/deleteuser?id=" + user.id, FetchOptionsDELETE)
            const result = await response.json()
            this.log(result)
            return result
        }
        catch (error)
        {
            this.error(error)
        }
    }

    /**
     * 
     * @param {StorageFile} file 
     * @returns 
     */
    async deleteFile(file)
    {
        try
        {
            const response = await fetchWithTimeout(this.baseEndpoint + "/api/deletefile?fileId=" + file.id, FetchOptionsDELETE)
            const result = await response.json()
            this.log(result)
            return result
        }
        catch (error)
        {
            this.error(error)
        }
    }

    /**
     * 
     * @param {Disk} disk 
     */
    async getDiskSpaceRemaining(disk)
    {
        try
        {
            const response = await fetchWithTimeout(this.baseEndpoint + "/api/remainingstorage?diskId=" + disk.id, {
                ...FetchOptionGET
            })

            const result = await response.json()

            this.log(result)
        }
        catch (error)
        {
            this.error(error)
        }
    }

    /**
     * 
     * @param {Disk} disk 
     */
    async putDiskStatus(disk)
    {
        try
        {
            const response = await fetchWithTimeout(this.baseEndpoint + "/api/updatediskstate?diskId=" + disk.id + "&state=" + disk.status , {
                ...FetchOptionsPUT
            })

            const result = await response.json()

            this.log(result)
        }
        catch (error)
        {
            this.error(error)
        }
    }
}