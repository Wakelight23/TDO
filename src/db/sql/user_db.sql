CREATE TABLE IF NOT EXISTS USER
(
    user_id    VARCHAR(36)  PRIMARY KEY,
    email      VARCHAR(255) UNIQUE NOT NULL,
    password   VARCHAR(255),
    highscore  INT          DEFAULT 0,
    last_login TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE IF NOT EXISTS TDO_USER_DB
-- (
--     id         VARCHAR(36) PRIMARY KEY,
--     user_id    VARCHAR(36) NOT NULL,
--     start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     end_time   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     highscore  INT       DEFAULT 0, /* 이 이름이 맞나? */
--     FOREIGN KEY (user_id) REFERENCES user (id)
-- );