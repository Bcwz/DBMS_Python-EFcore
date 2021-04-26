import mysql.connector

def connect_database():
    database = mysql.connector.connect(
    #    host="localhost", user="root", password="password", database="ProjectTest")
        port=3306, user="admin", password="123454321", database="detentionBarracks")

    print("MySQL Database connected")
    cursor = database.cursor()
    return database, cursor


if __name__ == "__main__":
    database, cursor = connect_database()