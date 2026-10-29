-- Agent (A2) stories 1426-1428 -> SON55 collection.
-- Run by hand after the new tr text is applied (AGENTS.md: agents never write albor.db).
UPDATE stories SET version = 'SON55' WHERE id IN (1426, 1427, 1428) AND version = 'A2';
