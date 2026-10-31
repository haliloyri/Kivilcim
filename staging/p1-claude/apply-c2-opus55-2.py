#!/usr/bin/env python3
# C2 stories 1799-1808: new tr P1 text + variants, version -> Opus55-2.
# Run from repo root: python3 staging/p1-claude/apply-c1-opus55-2.py
# Backs up assets/albor.db to assets/_db_backups/ first.
import json, re, shutil, sqlite3, time

DB = 'assets/albor.db'
IDS = (1799, 1800, 1801, 1802, 1803, 1804, 1805, 1806, 1807, 1808)

shutil.copyfile(DB, f'assets/_db_backups/albor.db.pre-c2-opus55-2-{time.strftime("%Y%m%d%H%M%S")}')
db = sqlite3.connect(DB)
for i in IDS:
    text = open(f'staging/p1-claude/tr/{i}.md', encoding='utf8').read().strip()
    v = json.load(open(f'staging/p1-claude/tr/{i}.variants.json', encoding='utf8'))
    words = len(re.sub(r'\[\[\w+\]\]|\$\$|%%|@@|&&|##|\*\*', '', text).split())
    minutes = max(1, round(words / 200))
    db.execute("UPDATE story_translations SET content = ? WHERE story_id = ? AND lang_code = 'tr'", (text, i))
    db.execute(
        "UPDATE stories SET version = 'Opus55-2', current_read_minutes = ?, possible_read_minutes = ?, target_word_count = ? WHERE id = ?",
        (minutes, minutes, words, i),
    )
    db.execute(
        """INSERT INTO story_conversation_variants (story_id, lang_code, punchline, thirty_sec, question, key_contrast)
           VALUES (?, 'tr', ?, ?, ?, ?)
           ON CONFLICT(story_id, lang_code) DO UPDATE SET
             punchline = excluded.punchline, thirty_sec = excluded.thirty_sec,
             question = excluded.question, key_contrast = excluded.key_contrast""",
        (i, v['punchline'], v['thirty_sec'], v['question'], v['key_contrast']),
    )
    print(f'OK {i}: {words} words, ~{minutes} min')
db.commit()
print(db.execute("SELECT version, COUNT(*) FROM stories WHERE version IN ('C1', 'Opus55-2') GROUP BY 1").fetchall())
