import sqlite3
import datetime

# this is the database file for the app
db_file = "../graphicalGPS.db"

def connect_db():

    con = sqlite3.connect(db_file)
    cursor = con.cursor()

    return con, cursor

def create_db() -> None:
    """
    This function will create the database for the gps application.
    This database will have a table to store the distances traveled and the times they were recorded
    """

    con, cursor = connect_db()

    try:

        cursor.execute("""CREATE TABLE distances(
                    distance_id_pk INTEGER PRIMARY KEY AUTOINCREMENT,
                    distance REAL NOT NULL,
                    time TEXT NOT NULL
        )""")

        con.commit()

        con.close()
    except sqlite3.OperationalError:
        print("db and table exist already")
        con.close()


def insert_into_db(distance: float) -> None:
    """
    This function will insert data into the distances table
    """

    conn, cursor = connect_db()

    try:    
        cursor.execute(f"""
        INSERT INTO distances(distance, time)
        VALUES ({distance}, '{datetime.datetime.now()}')
        """)

        conn.commit()
        conn.close()
    except:
        print("Could not insert data into database")
        conn.close()

def get_db_data() -> tuple:
    """
    This function will get the data from the database
    """

    conn, cursor = connect_db()

    try:
        cursor.execute(
                """
                SELECT distance, time FROM distances
                """)
            
        for row in cursor.fetchall():
            print(row)

        conn.close()
    except:
        print("could not get data from database")
        conn.close()


def main() -> None:
    ...

if __name__ == "__main__":
    get_db_data()
