CREATE TABLE Device (
DeviceId BINARY(36) NOT NULL UNIQUE,
DeviceName VarChar(255),
OperationState integer,
PRIMARY KEY (DeviceId)
);

CREATE TABLE OperationState (
OperationStateId integer,
DisplayValue Char(10),
PRIMARY KEY (OperationStateId)
);

CREATE TABLE Disks(
DiskId BINARY(36) NOT NULL UNIQUE,
DiskSize Long,
DeviceId BINARY(36) NOT NULL,
OperationState integer
);

CREATE TABLE FileChunk (
FileChunkId BINARY(36) NOT NULL UNIQUE,
FileChunkSize Long,
FileVersionId BINARY(36) NOT NULL,
DiskId BINARY(36) NOT NULL,
FileIndex integer,
MirrorIndex integer,
PRIMARY KEY (FileChunkId)
);

CREATE TABLE FileVersion (
FileVersionId BINARY(36) NOT NULL UNIQUE,
FileId BINARY(36) NOT NULL,
FileDateTime DateTime,
PRIMARY KEY (FileVersionId)
);

CREATE TABLE Files(
FileId BINARY(36) NOT NULL UNIQUE,
FileName VarChar(255),
Size Long,
Copies integer,
OwnerUserId BINARY(36) NOT NULL,
PRIMARY KEY (FileId)
);

CREATE TABLE AccessLog (
LogId BINARY(36) NOT NULL UNIQUE,
LastAccess DateTime,
FileId BINARY(36) NOT NULL,
UserId BINARY(36) NOT NULL,
PRIMARY KEY (LogId)
);

CREATE TABLE Users (
UserId BINARY(36) NOT NULL UNIQUE,
UserName Char(255),
PRIMARY KEY (UserId)
);

CREATE TABLE Permission (
PermissionId BINARY(36) NOT NULL UNIQUE,
UserId BINARY(36) NOT NULL,
FileId  BINARY(36) NOT NULL,
PRIMARY KEY (PermissionId)
);

-- FOREIGN KEY FOR Device TABLE
ALTER table Device ADD FOREIGN KEY (OperationState) REFERENCES OperationState (OperationStateId);

-- FOREIGN KEY FOR Disks TABLE
ALTER table Disks ADD FOREIGN KEY (DeviceId) REFERENCES Device (DeviceId);
ALTER table Disks ADD FOREIGN KEY (OperationState) REFERENCES OperationState (OperationStateId);


-- FOREIGN KEY FOR FileChunk TABLE
ALTER table FileChunk ADD FOREIGN KEY (FileVersionId) REFERENCES FileVersion (FileVersionId) ON DELETE CASCADE;
ALTER table FileChunk ADD FOREIGN KEY (DiskId) REFERENCES Disks (DiskId);

-- FOREIGN KEY FOR FileVersion TABLE
ALTER table FileVersion ADD FOREIGN KEY (FileId) REFERENCES Files (FileId) ON DELETE CASCADE;

-- FOREIGN KEY FOR FILES TABLE
ALTER table Files ADD FOREIGN KEY (OwnerUserId) REFERENCES Users (UserId) ON DELETE CASCADE;

-- FOREIGN KEY FOR PERMISSION TABLE
ALTER table Permission ADD FOREIGN KEY (UserId) REFERENCES Users (UserId) ON DELETE CASCADE;
ALTER table Permission ADD FOREIGN KEY (FileId) REFERENCES Files (FileId) ON DELETE CASCADE;

-- FOREIGN KEY FOR AccessLog TABLE
ALTER table AccessLog ADD FOREIGN KEY (FileId) REFERENCES Files (FileId) ON DELETE CASCADE;
ALTER table AccessLog ADD FOREIGN KEY (UserId) REFERENCES Users (UserId) ON DELETE CASCADE;

-- SEED OPERATION STATE TABLE
INSERT INTO OperationState VALUES (1, 'Online');
INSERT INTO OperationState VALUES (0, 'Offline');
INSERT INTO OperationState VALUES (-1, 'Dead');