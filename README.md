# csc2008-DBMS-technologies comparision
Technologies comparision between MySQL-Python and Entity Framework core 5.0.

API calls are used to compared between the different implementation for efficiency.

Backend: MySQL-Python vs EF core 5.0
Frontend: Flask vs c#

**System Architecture and Requirements**

As the implementation is designed to support most multimedia files and documents, common dataset of file types which users store in their devices such as .txt, .mp4 and .csv will be used for implementation and testing. The timing for CRUD operations will be recorded for comparison between MySQL and Entity Framework Core 5.0.

![image](https://user-images.githubusercontent.com/57914467/116096750-1fb67800-a6dc-11eb-979a-aa6c7c6feb3d.png)


Fig. 1: Implementation Overall System Architecture


Relational Database Implementation

This storage system will contain a relational database for management and keeping the necessary information about the storage location, ownership, access log and distribution of the files within the distributed storage system.

![image](https://user-images.githubusercontent.com/57914467/116097011-54c2ca80-a6dc-11eb-88e7-f10d18b2c342.png)
Fig. 2 : Overview of Entity Relationship diagram for distributed database system
