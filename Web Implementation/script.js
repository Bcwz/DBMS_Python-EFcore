//@ts-check
"use-strict";

// Change these 2 for the endpoints of backend
const EndPointBaseASP = "http://192.168.1.10:5000"
const EndPointBaseFlask = "http://192.168.1.11:5000"

const EndPointAll = [EndPointBaseASP, EndPointBaseFlask]

/**
* @type {User[]}
*/
const users = []

const forms = {
    addUser: {
        userName: "New User",
        enabled: false,
    },
    addDevice: {
        deviceName: "New Device",
        enabled: false,
    },
    addDisk: {
        diskCapacity: {},
        enabled: {},
    },
    addFile: {
        fileName: "New File.txt",
        fileSize: toCommaSeperatedNumber(1048576),
        copies: 1,
        owner: null,
        enabled: false,
    }
}

/** @type {StorageContext} */
const context = {
    forms: forms,
    users: users,
    devices: [],
    files: [],
    fileChunks: [],
    logs: []
}

class DBVueApp extends Vue
{
    constructor()
    {
        super({
            el: "#vue-app",
            data: context,
            watch: {
                "forms.addDisk.diskCapacity": {
                    handler(newValue)
                    {
                        for (const key in newValue)
                        {
                            if (newValue.hasOwnProperty(key))
                            {
                                const oldInput = newValue[key];
                                const newInput = toCommaSeperatedNumber(oldInput)

                                if (oldInput !== newInput)
                                {
                                    Vue.nextTick(() => newValue[key] = toCommaSeperatedNumber(oldInput))
                                }
                            }
                        }
                    },
                    deep: true
                },
                "forms.addFile.fileSize": function (newValue)
                {
                    const result = toCommaSeperatedNumber(newValue)
                    Vue.nextTick(() => forms.addFile.fileSize = result.length == 0 ? "0" : result);
                },
            },
            filters: {
                commaNumber: function (value)
                {
                    return toCommaSeperatedNumber(value)
                }
            }
        })

        this.stubClient = new DBClientStub()
        this.efClient = new DBClientReal(EndPointBaseASP, "ORM")
        this.sqlClient = new DBClientReal(EndPointBaseFlask, "SQL")
        this.mainClient = this.efClient
        // this.sqlClient = this.stubClient
        this.loadAll()
    }

    get sqlEndpoint()
    {
        return EndPointBaseFlask
    }

    get ormEndpoint()
    {
        return EndPointBaseASP
    }

    get sortedUsers()
    {
        return context.users.slice().sort((a, b) => a.name.localeCompare(b.name))
    }

    /**
     * @param {string} description
     * @param {number} sqlTime
     * @param {number} ormTime
     */
    addLog(description, sqlTime, ormTime)
    {
        const time = new Date()
        context.logs.push({
            time: time,
            description: description,
            sqlTime: sqlTime,
            ormTime: ormTime
        })
    }

    /**
     * @param {string} description
     */
    _flushLogs(description)
    {
        try
        {
            const sql = TempLogs.find(x => x.clientType == "SQL")
            const orm = TempLogs.find(x => x.clientType == "ORM")
            this.addLog(description, sql != undefined ? sql.elapsed : -1, orm != undefined ? orm.elapsed : -1)
        }
        catch (error)
        {
            console.error("Logs error: " + error.message)
        }
        finally
        {
            TempLogs.splice(0)
        }
    }

    async loadAll()
    {
        this.setFormLoads(false)
        const users = await this.mainClient.getAllUsers()
        await this.sqlClient.getAllUsers()
        this._flushLogs("Get All Users")

        context.users.push(...users)

        const devices = await this.mainClient.getAllDevices()
        await this.sqlClient.getAllDevices()
        this._flushLogs("Get All Devices")

        context.devices.push(...devices)
        devices.forEach(x =>
        {
            Vue.set(forms.addDisk.diskCapacity, x.id, Math.pow(2, 30))
            Vue.set(forms.addDisk.enabled, x.id, false)
        })

        const disks = await this.mainClient.getAllDisks()
        await this.sqlClient.getAllDisks()
        this._flushLogs("Get All Disks")


        for (const disk of disks)
        {
            context.devices.find(xx => xx.id == disk.deviceId).disks.push(disk);
            await this.getDiskSpaceRemaning(disk)
        }

        const files = await this.mainClient.getAllFiles()
        await this.sqlClient.getAllFiles()
        context.files.push(...files)
        this._flushLogs("Get All Files")


        files.forEach(async x =>
        {
            await this.mainClient.getFileFragments(x)
            await this.sqlClient.getFileFragments(x)
        })

        this.setFormLoads(true)
    }

    setFormLoads(enabled = true)
    {
        [
            forms.addUser,
            forms.addDevice,
            forms.addFile
        ]
            .forEach(x => x.enabled = enabled)

        context.devices.forEach(x =>
        {
            forms.addDisk.enabled[x] = enabled
        })
    }

    get hasDisk()
    {
        return context.devices.some(x => x.disks.filter(x => x.status === "Online").length > 0)
    }

    get maxCopies()
    {
        return 
    }

    get canAddFile()
    {
        const output = users.length > 0 && this.hasDisk
        if (output && !users.some(x => x.id == forms.addFile.owner))
        {
            forms.addFile.owner = users[0].id
        }
        return output
    }

    /**
     *
     * @param {Device} device
     */
    getDeviceCapacity(device)
    {
        return device.disks.reduce((a, b) => a + b.capacity, 0)
    }

    /**
     * 
     * @param {Disk} disk 
     */
    getDiskFreeSpace(disk)
    {
        return getDiskFreeSpace(disk)
    }

    async addUser()
    {
        forms.addUser.enabled = false

        const newUser = {
            id: uuidv4(),
            name: appendRename(context.users, x => x.name, forms.addUser.userName),
        }

        await this.mainClient.addUser(newUser)
        await this.sqlClient.addUser(newUser)
        this._flushLogs("Add User: " + newUser.name)

        context.users.push(newUser)
        forms.addUser.enabled = true
    }

    async addDevice()
    {
        forms.addDevice.enabled = false
        const newDevice = {
            id: uuidv4(),
            name: appendRename(context.devices, x => x.name, forms.addDevice.deviceName),
        }

        await this.mainClient.addDevice(newDevice)
        await this.sqlClient.addDevice(newDevice)
        this._flushLogs("Add Device: " + newDevice.name)

        context.devices.push({
            ...newDevice,
            status: "Online",
            disks: []
        })

        forms.addDevice.enabled = true

        Vue.set(forms.addDisk.diskCapacity, newDevice.id, Math.pow(2, 30))
        Vue.set(forms.addDisk.enabled, newDevice.id, true)
    }

    /**
     * 
     * @param {Device} device  
     */
    async addDisk(device)
    {
        forms.addDisk.enabled[device.id] = false
        const newDisk = {
            deviceId: device.id,
            device: device.id,
            id: uuidv4(),
            capacity: fromCommaSeperatedNumber(forms.addDisk.diskCapacity[device.id])
        }

        await this.mainClient.addDisk(newDisk)
        await this.sqlClient.addDisk(newDisk)
        this._flushLogs("Add Disk for device: " + device.name)

        device.disks.push({
            ...newDisk,
            status: "Online"
        })

        forms.addDisk.enabled[device.id] = true
    }

    /**
     * 
     * @param {SubmitEvent} event
     * @returns 
     */
    async addFile(event)
    {
        event.submitter.setAttribute("disabled", "disabled")
        const fileId = uuidv4()
        const fileSize = fromCommaSeperatedNumber(forms.addFile.fileSize)

        const group = groupDevice(forms.addFile.copies, forms.addFile.fileSize)
        const chunks = splitFileChunks(fileSize, forms.addFile.copies, context.devices.filter(x => x.disks[0].status === "Online"), group)
        const disks = this.getAllDisks()

        for (const chunk of chunks)
        {
            chunk.fileId = fileId
            if (isNaN(chunk.size) || chunk.size === 0 || this.getDiskFreeSpace(disks.find(x => x.id == chunk.diskId)) < chunk.size)
            {
                alert(`Disk ${chunk.diskId} has not enough space for this file`)
                return
            }
        }

        // Prevent decimal bytes
        const mirrors = Array(Math.max(...chunks.map(x => x.mirrorIndex + 1)))
        for (let index = 0; index < mirrors.length; index++)
        {
            const mirror = mirrors[index] = chunks.filter(x => x.mirrorIndex == index)
            const ceiledValue = mirror.reduce((a, b) => a + Math.ceil(b.size), 0)

            if (ceiledValue > fileSize)
            {
                mirror.forEach(x => x.size = Math.floor(x.size))
                mirror.find(x => x.fileIndex === 0).size += (ceiledValue - fileSize)
            }
        }

        const filePayload = {
            id: fileId,
            name: appendRename(context.files, x => x.name, forms.addFile.fileName),
            size: fileSize,
            copies: forms.addFile.copies,
            owner: forms.addFile.owner,
            users: [forms.addFile.owner],
            chunks: chunks
        }

        console.log(JSON.stringify(filePayload, undefined, 2))

        await this.mainClient.addFile(filePayload)
        await this.sqlClient.addFile(filePayload)
        this._flushLogs("Add File: " + filePayload.name)

        context.files.push({
            id: filePayload.id,
            name: filePayload.name,
            size: filePayload.size,
            copies: filePayload.copies,
            owner: context.users.find(x => x.id === filePayload.owner),
            users: context.users.filter(x => filePayload.users.some(y => y == x.id))
        })

        context.fileChunks.push(...chunks)

        event.submitter.removeAttribute("disabled")
    }

    getAllDisks()
    {
        return context.devices.flatMap(x => x.disks)
    }

    /**
     * 
     * @param {Disk} disk 
     */
    getDiskStatusButtonText(disk)
    {
        switch (disk.status)
        {
            case "Online":
                return "Offline"
            case "Offline":
                return "Online"
            case "Dead":
                return "Device Dead"
            default:
                return disk.status + " State"
        }
    }

    /**
     * 
     * @param {User} user 
     */
    getUserFiles(user)
    {
        return context.files.filter(x => x.owner.id == user.id)
    }

    /**
     * 
     * @param {User} user 
     */
    getUserFileUsage(user)
    {
        return this.getUserFiles(user).reduce((a, b) => a + b.size, 0)
    }

    /**
     * 
     * @param {User} user 
     * @returns 
     */
    getUserTotalUsage(user)
    {
        const userFileIds = this.getUserFiles(user).map(x => x.id)
        return context.fileChunks
            .filter(x => userFileIds.some(xx => xx == x.fileId))
            .reduce((a, b) => a + b.size, 0)
    }

    /**
     * 
     * @param {User} user 
     * @param {ButtonEvent} event
     */
    async deleteUser(user, event)
    {
        const userFiles = this.getUserFiles(user)

        console.log("delete files from user", user.name)
        userFiles.forEach(x => this._deleteFileCascade(x))

        context.users.splice(context.users.indexOf(user), 1)

        await this.mainClient.deleteUser(user)
        await this.sqlClient.deleteUser(user)
        this._flushLogs("Delete User: " + user.name)
    }

    async _deleteFileCascade(file)
    {
        console.log("Deleting file", file.name)
        const chunks = context.fileChunks.filter(x => file.id == x.fileId)
        chunks.forEach(x => context.fileChunks.splice(chunks.indexOf(x), 1))
        context.files.splice(context.files.indexOf(file), 1)
    }

    /**
     * 
     * @param {StorageFile} file
     * @param {ButtonEvent} event 
     */
    async deleteFile(file, event)
    {
        event.target.setAttribute("disabled", "disabled")
        await this.mainClient.deleteFile(file)
        await this.sqlClient.deleteFile(file)
        this._flushLogs("Delete File: " + file.name)
        event.target.removeAttribute("disabled")
        this._deleteFileCascade(file)
    }

    /**
     * @param {Disk} disk
     */
    async getDiskSpaceRemaning(disk)
    {
        await this.mainClient.getDiskSpaceRemaining(disk)
        await this.sqlClient.getDiskSpaceRemaining(disk)
        this._flushLogs("Get Disk Free Space: " + disk.id)
    }

    /**
     * 
     * @param {StorageFile} file 
     */
    async viewFileDetail(file)
    {
        await this.mainClient.getFileFragments(file)
        await this.sqlClient.getFileFragments(file)

        this._flushLogs("Get file fragment: "+ file.id)

        const chunks = context.fileChunks.filter(x => x.fileId == file.id)
        const disks = context.devices.flatMap(x => x.disks).filter(x => chunks.some(y => y.diskId == x.id))

        console.log(disks)
        
        alert(`
        File Name: ${file.name} \n
        File Fragments: \n\n${chunks.map(x => `${x.diskId.substring(0, 8)} Mirror: ${x.mirrorIndex} File Index: ${x.fileIndex} Size: ${x.size} `).join("\n")}
        File Damaged: ${disks.filter(x => x.status === "Dead").length >= file.copies ? "Yes" : "No"}
        `)
    }

    /**
     * 
     * @param {Disk} disk 
     */
    async offonDisk(disk)
    {
        disk.status = disk.status === "Online" ? "Offline" : "Online"

        await this.mainClient.putDiskStatus(disk)
        await this.sqlClient.putDiskStatus(disk)

        this._flushLogs("Update disk status: " + disk.id)
    }

    /**
     * 
     * @param {Disk} disk 
     */
    async killDisk(disk)
    {
        disk.status = "Dead"

        await this.mainClient.putDiskStatus(disk)
        await this.sqlClient.putDiskStatus(disk)

        this._flushLogs("Update disk status: " + disk.id + " " + disk.status)
    }
}

const app = new DBVueApp()

/**
 * 
 * @param {Disk} disk 
 */
function getDiskFreeSpace(disk)
{
    const chunks = context.fileChunks.filter(x => x.diskId == disk.id)
    const usage = chunks.reduce((a, b) => a + b.size, 0)

    return disk.capacity - usage
}

/**
 * Split files into mirrors and chunks
 * @param {number} fileSize 
 * @param {number} copies 
 * @param {Device[]} devices
 * @returns {FileChunk[]} file chunks
 */
function splitFileChunks(fileSize, copies, devices, group)
{
    // For now we only assume one device has one disk
    //const disks = devices
    //    .filter(x => x.status === "Online")
    //    .map(x => x.disks[0])
    /** @type {any[][]} */
    let chunkCapacity = []
    let chunkTotalCapacity = []
    /** @type {any[][]} */
    let chunkWeight = []
    let fileChunkItem = []

    for (var i = 0; i < group.length; i++)
    {
        chunkCapacity[i] = []
        chunkTotalCapacity[i] = 0
        for (var j = 0; j < group[i].length; j++)
        {
            const freeSpace = getDiskFreeSpace(devices.find(d => d.id == group[i][j]).disks[0])
            chunkCapacity[i].push(freeSpace)
            chunkTotalCapacity[i] += freeSpace
        }

    }
    // console.log(chunkCapacity)
    // console.log(chunkTotalCapacity)
    for (var i = 0; i < chunkTotalCapacity.length; i++)
    {
        chunkWeight[i] = []
        for (var j = 0; j < chunkCapacity[i].length; j++)
        {
            chunkWeight[i].push(chunkCapacity[i][j] / chunkTotalCapacity[i])
        }
    }
    // console.log(chunkWeight)
    for (var i = 0; i < group.length; i++)
    {
        for (var j = 0; j < group[i].length; j++)
        {
            let chunkId = uuidv4()
            let chunkSize = fileSize * chunkWeight[i][j]
            // console.log(chunkSize)
            let chunkDetail = { "chunkId": chunkId, "diskId": devices.find(d => d.id == group[i][j]).disks[0].id, "size": chunkSize, "fileIndex": j, "mirrorIndex": i }
            //console.log(chunkDetail)
            fileChunkItem.push(chunkDetail)
            // console.log(fileChunkItem)
        }
    }

    return fileChunkItem
}

function groupDevice(noOfCopies, filesize)
{
    let devices = context['devices'].filter(x => x.disks[0].status === "Online")
    let deviceCapacity = {}
    deviceCapacity = getCapacityArray(devices)
    let totalCap = getTotalCapacity(devices)

    deviceCapacity = sort_object(deviceCapacity)
    if (noOfCopies == 1)
    {
        let singleGroup = []
        singleGroup[0] = []
        for (var key in deviceCapacity)
        {
            singleGroup[0].push(key)
        }
        // console.log(singleGroup)
        //return
        return singleGroup
    }
    let group = new Array(noOfCopies)
    let groupCapacity = new Array(noOfCopies)
    let smallest = 0
    let smallestVal = 0
    groupCapacity[0] = 0
    group[0] = []
    let first = true
    for (var key in deviceCapacity)
    {
        smallest = 0
        smallestVal = groupCapacity[0]
        for (var g = 1; g < noOfCopies; g++)
        {
            if (first)
            {
                groupCapacity[g] = 0
                group[g] = []

            }
            if (groupCapacity[g] < smallestVal)
            {
                smallestVal = groupCapacity[g]
                smallest = g
            }

        }
        first = false
        groupCapacity[smallest] += deviceCapacity[key]
        group[smallest].push(key)
    }
    //console.log(groupCapacity)
    //console.log(group)
    return group
}

function sort_object(obj)
{
    let items = Object.keys(obj).map(function (key)
    {
        return [key, obj[key]];
    });
    items.sort(function (first, second)
    {
        return second[1] - first[1];
    });
    let sorted_obj = {}
    for (var key in items)
    {
        let use_key = items[key][0]
        let use_value = items[key][1]
        sorted_obj[use_key] = use_value
    }
    return (sorted_obj)
}

function getCapacityArray(array)
{
    let arrayCapacity = {}
    array.forEach(element =>
    {
        let sum = 0
        element.disks.forEach(disk =>
        {
            sum += disk.capacity
        })
        arrayCapacity[element.id] = sum
    })
    return arrayCapacity
}

function getTotalCapacity(array)
{
    let totalCap = 0
    array.forEach(element =>
    {
        let sum = 0
        element.disks.forEach(disk =>
        {
            sum += disk.capacity
            totalCap += sum
        })
    })
    return totalCap
}
