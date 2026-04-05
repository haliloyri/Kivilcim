import sqlite3

try:
    db = sqlite3.connect('assets/kivilcim.db')
    cursor = db.execute("SELECT sql FROM sqlite_master WHERE type='table' AND sql NOT NULL")
    tables = [row[0] for row in cursor.fetchall()]
    with open('schema_utf8.txt', 'w', encoding='utf-8') as f:
        f.write('\n\n'.join(tables))
    print("Schema written to schema_utf8.txt")
except Exception as e:
    print("Error:", e)
