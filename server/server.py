from flask import Flask
from flask import g
import sqlite3

DATABASE = 'puzzles.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

app = Flask(__name__)


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


@app.route('/server/puzzle')
def get_puzzle():
    cur = get_db().cursor()
    while True:
        cur.execute("SELECT * FROM puzzles ORDER BY RANDOM() LIMIT 1")
        data = cur.fetchone()
        if data[1] == 1:
            continue
        return string_to_list(data[0])


def string_to_list(string):
    counter = 0
    outer = []
    inner = []
    for i in string:
        num = int(i)
        if counter == 9:
            outer.append(inner)
            inner = []
            counter = 0
        inner.append(num)
        counter += 1
    outer.append(inner)
    return {'puzzle': outer}
