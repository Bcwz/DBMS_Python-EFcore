#Tested

#Commands for adding users and deleting users
#Method to add new user account
def add_user(database, cursor, userId, userName):
    #SQL statement to insert into users table
    command_query = "INSERT INTO Users VALUES ('{0}', '{1}')".format(userId, userName)
    print(command_query)
    #Execute add user SQL statement
    cursor.execute(command_query)
    database.commit()
    print("UserId: ", userId, "UserName: ", userName, "created successfully")

def add_permission(database, cursor, userId, fileId):
    #SQL statement to insert into permissions table
    command = "INSERT INTO Permission VALUES (uuid(), '{0}', '{1}')".format(userId, fileId)
    print(command)
    cursor.execute(command)
    database.commit()
    print("UserId: {0} FileName: {1} permission created successfully".format(userId, fileId))

def add_access_log(database, cursor, userId, fileId):
    command = "INSERT INTO AccessLog VALUES (uuid(), NOW(), '{0}', '{1}')".format(fileId, userId)
    print(command)
    cursor.execute(command)
    database.commit()
    print("UserId: {0} FileName: {1} access log created successfully".format(userId, fileId))

#Method to delete user files and user account
def delete_user(database,cursor, userId):
    #SQL statement to deleting user account
    command_delete_user = "DELETE FROM Users WHERE UserId = '{0}'".format(userId)
    cursor.execute(command_delete_user)
    database.commit()
    print("User deleted successfully")

def delete_user_permission(database,cursor,userId, fileId):
    #SQL statement to delete user permission
    command_delete_user_permission = "DELETE FROM Permission WHERE UserId = '{0}' AND FileId = {1}".format(userId, fileId)
    #Execute delete permission
    cursor.execute(command_delete_user_permission)
    database.commit()
    print("User permission deleted successfully")

################################################
#########^^^ NEED RETEST FOR ISSUE #13 ^^^######
################################################

def get_all_files_of_user(database, cursor, userId):
    command_query = "SELECT * FROM Files WHERE OwnerUserId = {0}".format(userId)
    files = cursor.execute(command_query)
    return files.fetchall()

def get(cursor):#Success
    command_query = "SELECT * FROM Users"
    cursor.execute(command_query)
    return cursor.fetchall()