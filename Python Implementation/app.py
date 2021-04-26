from flask import Flask, render_template, Response, request, jsonify
from flask_cors import CORS
import time
import SQLFiles.mainSetUp
import SQLFiles.user
import SQLFiles.file
import SQLFiles.hardware
from SQLFiles.mainSetUp import connect_database

# Flask Stuff
app = Flask(__name__)
CORS(app)

db, cursor = connect_database()


# Host app first
@app.route('/') # Tested
def index():
    return render_template('index.html')


##############################################
############## DELETE METHODS ################
##############################################
@app.route('/api/deleteuser', methods=["DELETE"]) #ISSUE 13 need retest 
def delete_user():
    start = time.time()
    data = request.args.get('id')
    SQLFiles.user.delete_user(db, cursor, data)
    return jsonify(secondsElapsed=time.time() - start)


@app.route('/api/deletepermission', methods=["DELETE"])
def delete_permission():
    start = time.time()
    userId = request.args.get('userId')
    fileId = request.args.get('fileId')
    SQLFiles.user.delete_user_permission(db, cursor, userId, fileId)
    return jsonify(secondsElapsed=time.time() - start)
    
@app.route('/api/deletefile', methods=["DELETE"])
def delete_file():
    start = time.time()
    fileId = request.args.get('fileId')
    ##Deleting entries as stated in issue #13
    SQLFiles.file.delete_file(db, cursor, fileId)
    #############################################
    return jsonify(secondsElapsed=time.time() - start)


##############################################
############### PUT METHODS ##################
##############################################
@app.route('/api/updatedevicestate', methods=["PUT"]) #Success
def update_device_state():
    start = time.time()
    deviceId = request.args.get('deviceId')
    state = request.args.get('state')
    SQLFiles.hardware.update_device_state(db, cursor, deviceId, state)
    return jsonify(secondsElapsed=time.time() - start)


@app.route('/api/updatediskstate', methods=["PUT"]) #Success
def update_disk_state():
    start = time.time()
    diskId = request.args.get('diskId')
    state = request.args.get('state')
    SQLFiles.hardware.update_disk_state(db, cursor, diskId, state)
    return jsonify(secondsElapsed=time.time() - start)


##############################################
############### POST METHODS #################
##############################################

@app.route('/api/addfile', methods=["POST"]) #Success
def add_file():
    start = time.time()
    data = request.json

    SQLFiles.file.add_file(db, cursor, data["id"], data["name"], data["size"], data["owner"], data["users"], data["copies"])
    # Add user permission
    SQLFiles.user.add_permission(db, cursor, data["owner"], data["id"])
    # Add access log
    SQLFiles.user.add_access_log(db, cursor, data["owner"], data["id"])
    # Add user version
    fileVersionId = SQLFiles.file.add_file_version(db,cursor,data["id"])

    for chunk in data["chunks"]: #logic for POST /addfile
        SQLFiles.file.add_file_chunk(db, cursor, chunk["chunkId"], chunk["size"], fileVersionId, chunk["diskId"], chunk["fileIndex"], chunk["mirrorIndex"])

    return jsonify(secondsElapsed=time.time() - start)


@app.route('/api/adduser', methods=["POST"]) #Success
def add_user():
    start = time.time()
    data = request.json
    print(data["id"], data["name"])
    SQLFiles.user.add_user(db, cursor, data["id"], data["name"])
    return jsonify(secondsElapsed=time.time() - start)


@app.route('/api/adddevice', methods=["POST"]) #Success
def add_device():
    start = time.time()
    data = request.json
    print(data["id"], data["name"])
    SQLFiles.hardware.add_device(db, cursor, data["id"], data["name"])
    return jsonify(secondsElapsed=time.time() - start)


@app.route('/api/adddisk', methods=["POST"]) #Success
def add_disk():
    start = time.time()
    data = request.json
    print(data["id"], data["device"], data["capacity"])
    SQLFiles.hardware.add_disk(db, cursor, data["id"], data["device"], data["capacity"])
    return jsonify(secondsElapsed=time.time() - start)


##############################################
################ GET METHODS #################
##############################################
@app.route('/api/users', methods=["GET"]) #Success
def get_users():
    start = time.time()
    # No need for data input for view all users
    results = SQLFiles.user.get(cursor)
    resultsarr = []
    for result in results:
        vals = {}
        vals['userId'] = result[0]
        vals['userName'] = result[1]
        resultsarr.append(vals)
    return jsonify(users = resultsarr, secondsElapsed=time.time() - start)


@app.route('/api/devices', methods=["GET"])#Success
def get_devices():
    start = time.time()
    results = SQLFiles.hardware.get_devices(cursor)
    return jsonify(devices = results, secondsElapsed=time.time() - start)
    
@app.route('/api/disks', methods=["GET"])#Success
def get_disks():
    start = time.time()
    results = SQLFiles.hardware.get_disks(cursor)
    return jsonify(disks = results, secondsElapsed=time.time() - start)
  
@app.route('/api/files', methods=["GET"])#Success
def get_files():
    start = time.time()
    results = SQLFiles.file.get_files(cursor)
    return jsonify(files = results, secondsElapsed=time.time() - start)


@app.route('/api/remainingstorage', methods=["GET"]) # SUCCESS
def get_remaining_storage():
    start = time.time()
    #Change from request.json to request.args.get('diskId')
    data = request.args.get('diskId')
    results = SQLFiles.hardware.get_remaining_storage(cursor, data)
    return jsonify(remaining = results, secondsElapsed=time.time() - start)
  
@app.route('/api/filefragment', methods=["GET"]) #SUCCESS
def get_file_fragments():
    start = time.time()
    #Change from request.json to request.args.get('fileId')
    data = request.args.get('fileId')
    results = SQLFiles.file.get_file_fragmentation(cursor, data)
    return jsonify(fileChunks = results, secondsElapsed=time.time() - start)


@app.route('/api/showalloperationstate', methods=["GET"]) #Success
def show_all_operation_state():
    start = time.time()
    results = SQLFiles.hardware.show_all_operation_state(db, cursor)
    return jsonify(SecondsElapsed=time.time() - start, OperationStates=results)


if __name__ == "__main__":
    app.run(host='0.0.0.0')
