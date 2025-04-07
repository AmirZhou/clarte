
SELECT *
FROM dictionary_entries
WHERE length >= 5
  AND id IN (
    SELECT id
    FROM dictionary_entries
    WHERE length >= 5
    ORDER BY RANDOM()
    LIMIT 100
);