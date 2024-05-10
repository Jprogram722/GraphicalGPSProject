import sqlite3
from datetime import datetime, timedelta

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
        VALUES ({distance}, '{datetime.now()}')
        """)

        conn.commit()
        conn.close()
    except:
        print("Could not insert data into database")
        conn.close()

def get_distance_data() -> tuple:
    """
    This function will get the total distance traveled over 12 weeks or 84 days
    """

    conn, cursor = connect_db()

    try:

        format_string = "%Y-%m-%d %H:%M:%S.%f"

        cursor.execute(
                """
                SELECT distance, time FROM distances
                """)
        
        total_distance = 0

        for row in cursor.fetchall():
            timestamp = datetime.strptime(row[1], format_string)
            if datetime.now() - timestamp < timedelta(weeks = 12):
                total_distance += row[0]
        
        avg_distance = total_distance / 84

        conn.close()

        return {"totalDistance": total_distance, "avgDistance": avg_distance}

    except:
        print("could not get data from database")
        conn.close()

        return {"msg": "Failed to get data"}

if __name__ == "__main__":
    get_distance_data()
