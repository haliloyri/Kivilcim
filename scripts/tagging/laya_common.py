"""Shared by run-laya.py and finetune-laya.py so training and inference see the same input text."""
import re

SCORE_KEYS = ["fit_45s", "hook", "visual"]
MAX_SECONDARY = 2

MARKUP = re.compile(r"\[\[[a-z]+\]\]|##|\$\$|&&|~~|%%context:[a-z]+ \| ")


def to_state(story):
    """Story title + plain text, app markup removed."""
    text = MARKUP.sub("", story["content"]).replace(" :: ", " — ")
    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    return f"{story['title']}\n\n{text}"
