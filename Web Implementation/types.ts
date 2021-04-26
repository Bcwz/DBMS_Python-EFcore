type StorageContext = {
    forms: {}
    users: User[],
    devices: Device[],
    files: StorageFile[]
    fileChunks: FileChunk[]
    logs: ResponseLog[]
}

type User = {
    id: string
    name: string
}

type Device = {
    id: string
    name: string
    status?: OperationStatus
    disks?: Disk[]
}

type Disk = {
    id: string
    deviceId?: string
    capacity: number
    status?: OperationStatus
}

type OperationStatus = "Online" | "Offline" | "Dead"

type StorageFile = {
    id: string
    name: string
    size: number
    copies: number
    owner: User
    users: User[]
}

type FileChunk = {
    fileId?: string
    chunkId: string
    diskId: string
    size: number
    fileIndex: number
    mirrorIndex: number
}

type ResponseLog = {
    time: Date
    description: string
    sqlTime?: number
    ormTime?: number
    clientType?: string
    elapsed?: number
}