import sqlite3
from datetime import datetime, timedelta
import json

# this is the database file for the app
db_file = "../graphicalGPS.db"

def connect_db():

    con = sqlite3.connect(db_file)
    cursor = con.cursor()

    return con, cursor

def create_distances_table() -> None:
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
        print("Distances table exist already.")
        con.close()

def create_locations_table() -> None:
    """
    This function will create the table for storing locations
    These stored locations will be saved to the GPS application so you can select them from a dropdown menu
    """

    con, cursor = connect_db()

    try:

        cursor.execute("""CREATE TABLE locations(
                       location_id_pk INTEGER PRIMARY KEY AUTOINCREMENT,
                       location_name TEXT NOT NULL,
                       latitude REAL NOT NULL,
                       longitude REAL NOT NULL
        )""")

        con.commit()
        con.close()
    except sqlite3.OperationalError:
        print("Locations table exists already.")
        con.close()

def insert_into_distance_table(distance: float) -> None:
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
        print("Could not insert data into the distances table")
        conn.close()

def insert_into_locations_table(location_name: str, latitude: float, longitude: float) -> None:
    """
    This function will insert data into the locations stable
    """
    
    conn, cursor = connect_db()

    try:
        cursor.execute(f"""
        INSERT INTO locations(location_name, latitude, longitude)
        VALUES ('{location_name}', {latitude}, {longitude})           
        """)
        
        conn.commit()
        conn.close()
    except:
        print("Could not insert data into the locations table")
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

    except Exception as err:
        print(err)
        conn.close()

        return {"msg": "Failed to get data"}

def get_locations_data() -> tuple:
    """
    This function will get a list of all the locations stored in the database.
    """

    conn, cursor = connect_db()

    try:

        cursor.execute(
            """
            SELECT * FROM locations
            """)
        
        locations = []

        for row in cursor.fetchall():
            location_name = row[1]
            lat = row[2]
            lng = row[3]
            locations.append({"Name": location_name, "Latitude": lat, "Longitude": lng})

        conn.close()
        return locations
    
    except Exception as err:
        print(err)
        conn.close()

        return {"msg": "Failed to get data"}

def reset_db():
    """
    This function will reset the table
    """

    conn, cursor = connect_db()

    try:
        cursor.execute("DELETE FROM distances")
        cursor.execute("DELETE FROM locations")

        print("everything is deleted")

        conn.commit()
        conn.close()
    except Exception as err:
        print(err)
        conn.close()


if __name__ == "__main__":
    print(get_locations_data())

