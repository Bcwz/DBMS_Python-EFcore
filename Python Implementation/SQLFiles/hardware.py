#Tested
# Add
def add_device(database,cursor, id, deviceName):
    # 1 operation state because device WILL be online when created
    command = "INSERT INTO Device VALUES('{0}', '{1}', {2})".format(
        id, deviceName, 1)
    cursor.execute(command)
    database.commit()
    print("SUCCESS")


def add_disk(database,cursor, diskId, deviceId, diskSize):
    command = "INSERT INTO Disks VALUES('{0}', {1}, '{2}', '{3}')".format(
        diskId, diskSize, deviceId, 1)
    cursor.execute(command)
    database.commit()
    print("SUCCESS ADD DISK")


# Make online
def update_device_state(database, cursor, deviceId, state):
    stateId = 0
    if(state == "Dead"):
        stateId = -1
    elif( state == "Online"):
        stateId = 1
    elif( state == "Offline"):
        stateId = 0
    command = "UPDATE Device SET OperationState = {0} WHERE DeviceId = '{1}'".format(stateId, deviceId)
    print(command)
    cursor.execute(command)
    database.commit()
    print("SUCCESS UPDATE DEVICE STATE")

def update_disk_state(database, cursor, diskId, state):
    stateId = 0
    if( state == "Dead"):
        stateId = -1
    elif( state == "Online"):
        stateId = 1
    elif( state == "Offline"):
        stateId = 0
    command = "UPDATE Disk SET OperationState = {0} WHERE DiskId = '{1}'".format(stateId, diskId)
    print(command)
    cursor.execute(command)
    database.commit()
    print("SUCCESS UPDATE DISK STATE")


# Query
def get_devices(cursor):#Success
    command_query = "SELECT * FROM Device"
    cursor.execute(command_query)
    return cursor.fetchall()


def show_all_operation_state(database, cursor):
    cursor.execute('SELECT * FROM OperationState')
    results = cursor.fetchall()
    print(results)
    print("SHOW ALL STATE SUCCESS")
    return results


def get_disks(cursor):# Success
    command_query = "SELECT * FROM Disks"
    cursor.execute(command_query)
    return cursor.fetchall()


def get_remaining_storage(cursor, diskId): #Success
    command_query = "SELECT * FROM Disks WHERE DiskId = '{0}'".format(diskId)
    cursor.execute(command_query)
    diskSize = int(cursor.fetchall()[0][1])
    command_query = "SELECT * FROM FileChunk WHERE DiskId = '{0}'".format(diskId)
    cursor.execute(command_query)
    fileChunks = cursor.fetchall()
    
    for file in fileChunks:
        diskSize -= int(file[1])
    return diskSize