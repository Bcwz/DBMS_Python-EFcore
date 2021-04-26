# Add
def add_file(database, cursor, fileId, fileName, size, owner, users, copies):
    command_add_file = "INSERT INTO Files VALUES ('{0}', '{1}', '{2}', '{3}', '{4}')".format(fileId, fileName, size, copies, owner)
    cursor.execute(command_add_file)
    database.commit()
    print("FILES ADDED SUCCESSFULLY")


def add_file_version(database, cursor, fileId):
    """add file version table and returns version id"""
    command_add_file_version = "INSERT INTO FileVersion VALUES(uuid(), '{0}', NOW())".format(fileId)
    cursor.execute(command_add_file_version)
    database.commit()
    # Get the file version
    command_get_file_version = "SELECT FileVersionId FROM FileVersion WHERE FileId = ('{0}')".format(fileId)
    cursor.execute(command_get_file_version)
    versionId = cursor.fetchall()
    database.commit()
    return versionId[0][0]


def add_file_chunk(database, cursor, fileChunkId, fileChunkSize, fileVersionId, diskId,fileIndex, mirrorIndex):
    command_add_file_chunk = "INSERT INTO FileChunk VALUES('{0}', '{1}', '{2}', '{3}', '{4}', '{5}')".format(
        fileChunkId,fileChunkSize,fileVersionId, diskId, fileIndex, mirrorIndex)
    print(command_add_file_chunk)
    cursor.execute(command_add_file_chunk)
    database.commit()
    print("FILE CHUNK ADDED SUCCESSFULLY")


# Remove
def delete_file (database,cursor,fileId):
    command_delete_file = "DELETE FROM Files WHERE FileId = '{0}'".format(fileId)
    cursor.execute(command_delete_file)
    database.commit()
    print("FILE DELETED SUCCESSFULLY")

# Query
def get_files(cursor): #Success
    command_query = "SELECT * FROM Files"
    cursor.execute(command_query)
    return cursor.fetchall()

def show_all_file_chunk(cursor): #Success
    command_show_all_file_chunk = "SELECT * FROM FileChunk"
    cursor.execute(command_show_all_file_chunk)
    displayallfilechunk = cursor.fetchall()
    print(displayallfilechunk)

def show_all_file_version(cursor): #Success
    command_show_all_file_version = "SELECT * FROM FileVersion"
    cursor.execute(command_show_all_file_version)
    displayallfileversion = cursor.fetchall()
    print(displayallfileversion)


def get_file_fragmentation(cursor, fileId): #Success
    command_query = "SELECT * FROM FileVersion WHERE FileId = {0}".format(fileId)
    cursor.execute(command_query)
    fileVersionId = cursor.fetchall()[0][0]
    command_query_FileChunk = "SELECT * FROM FileChunk WHERE FileVersionId = '{0}'".format(fileVersionId)
    cursor.execute(command_query_FileChunk)
    return cursor.fetchall()

