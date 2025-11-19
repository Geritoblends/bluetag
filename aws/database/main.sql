CREATE DATABASE bluetag;
USE bluetag;

CREATE TABLE Tags (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    mac_address VARCHAR(17) NOT NULL,
    last_distance VARCHAR(45),
    alias VARCHAR(45),
    icon VARCHAR(45),
    last_date DATETIME,
    PRIMARY KEY(id),
    CONSTRAINT fk_Users_Tags FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE Users (
    id INT NOT NULL AUTO_INCREMENT,
    name varchar(100),
    email varchar(255),
    bcrypt varchar(255),
    PRIMARY KEY(id),
    UNIQUE(email)
);

CREATE TABLE Updates (
    id INT NOT NULL AUTO_INCREMENT,
    tag_id INT NOT NULL,
    distance_to_router FLOAT,
    time DATE,
    PRIMARY KEY (id),
    UNIQUE (tag_id, time),
    CONSTRAINT fk_Tags_Updates FOREIGN KEY (tag_id) REFERENCES Tags(id)
);

