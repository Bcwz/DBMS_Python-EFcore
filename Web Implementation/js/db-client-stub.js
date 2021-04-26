//@ts-check


class DBClientStub
{
    constructor(baseEndpoint = "http://localhost:5000", clientType = "stub")
    {
        this.baseEndpoint = baseEndpoint
        this.clientType = clientType
    }

    /**
     * @param {any[]} args
     */
    log(...args)
    {
        console.log(this.baseEndpoint, ...args)
    }

    /**
     * @param {any[]} args
     */
    error(...args)
    {
        console.error(this.baseEndpoint, ...args)
    }

    /**
     * @param {any} timeMs
     */
    async _stubDelay(timeMs)
    {
        console.warn(`Stub fake API delay ${timeMs}`)
        await delay(timeMs)
    }

    /**
     * @returns {Promise<User[]>}
     */
    async getAllUsers()
    {
        await this._stubDelay(100)
        return []
    }

    /**
     * @returns {Promise<Device[]>}
     */
    async getAllDevices()
    {
        await this._stubDelay(100)
        return []
    }

    /**
     * @returns {Promise<Disk[]>}
     */
    async getAllDisks()
    {
        await this._stubDelay(100)
        return []
    }

    /**
     * @returns {Promise<StorageFile[]>}
     */
    async getAllFiles()
    {
        await this._stubDelay(100)
        return []
    }

    /**
     * 
     * @returns {Promise<FileChunk[]>}
     */
    async getAllFileChunks()
    {
        await this._stubDelay(100)
        return []
    }

    /**
     * 
     * @param {User} user
     * @return {Promise}  
     */
    async addUser(user)
    {
        await this._stubDelay(100)
    }

    /**
     * @param {Device} device
     * @returns {Promise}
     */
    async addDevice(device)
    {
        await this._stubDelay(100)
    }

    /**
     * 
     * @param {Disk} disk 
     * @returns {Promise}
     */
    async addDisk(disk)
    {
        await this._stubDelay(100)
    }

    async addFile(file)
    {
        await this._stubDelay(100)
    }

    /**
     * 
     * @param {User} user 
     */
    async deleteUser(user)
    {
        await this._stubDelay(100)
    }

    /**
     * 
     * @param {Disk} disk 
     */
    async getDiskSpaceRemaining(disk)
    {
        await this._stubDelay(100)
    }

    async getFileFragments(file)
    {
        await this._stubDelay(100)
    }

    /**
     * 
     * @param {Disk} disk 
     */
    async putDiskStatus(disk)
    {
        await this._stubDelay(100)
    }
}
