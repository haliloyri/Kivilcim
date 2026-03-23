import sqlite3
c = sqlite3.connect('assets/kivilcim.db')
q = """
    SELECT 
      c.id,
      COALESCE(ct.translation, ct_tr.translation, c.category_name) AS name,
      c.category_name AS raw_name,
      COUNT(DISTINCT b.id) as count
    FROM categories c
    LEFT JOIN categories_translations ct ON ct.category_id = c.id AND ct.language = 'tr'
    LEFT JOIN categories_translations ct_tr ON ct_tr.category_id = c.id AND ct_tr.language = 'tr'
    LEFT JOIN subcategories sub ON sub.categori_id = c.id
    LEFT JOIN books b ON b.category_id = sub.id
    GROUP BY c.id
    ORDER BY c.[order] ASC
"""
try:
    print(c.execute(q).fetchall())
except Exception as e:
    print("ERROR:", e)
