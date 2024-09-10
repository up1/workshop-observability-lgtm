\c demo;

DROP TABLE IF EXISTS articles;

CREATE TABLE articles
(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    publishedDate TIMESTAMP
);