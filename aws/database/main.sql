CREATE DATABASE bluetag;
USE bluetag;

CREATE TABLE Tags (
    id INT NOT NULL AUTO_INCREMENT,
    mac_address INT,
    last_distance VARCHAR(45),
    last_date DATE,
    PRIMARY KEY(id)
);

CREATE TABLE Users (
    id INT NOT NULL AUTO_INCREMENT,
    name varchar(100),
    bcrypt varchar(255),
    PRIMARY KEY(id)
);

CREATE TABLE UserTag (
    user_id INT NOT NULL,
    alias VARCHAR(45),
    icon VARCHAR(45),
    tag_id INT NOT NULL,
    CONSTRAINT fk_Users_UserTag
    FOREIGN KEY(user_id) references Users(id),
    CONSTRAINT fk_Tags_UserTag
    FOREIGN KEY(tag_id) references Tags(id)
);

/* CREATE TABLE RefreshTokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(512) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_used TIMESTAMP NULL,
  device_info VARCHAR(255),  
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  UNIQUE KEY (token)
); */

