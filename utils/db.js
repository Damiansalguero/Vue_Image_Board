//SETUP for Database

// spicedPg setup
const spicedPg = require("spiced-pg");

//DB Auth
const dbUrl =
    process.env.DATABASE_URL ||
    `postgres:postgres:postgres@localhost:5432/salt-image`;
var db = spicedPg(dbUrl);

module.exports.getImage = function getImages() {
    return db.query(
        `SELECT *, (
       SELECT id FROM images
       ORDER BY id ASC
       LIMIT 1)
       AS lowest_id FROM images ORDER BY id DESC LIMIT 10;`
    );
};

// neues Modul (INSERT)

module.exports.insertImage = function insertImage(
    description,
    username,
    title,
    url
) {
    return db.query(
        `
    INSERT INTO images (description, username, title, url)
    VALUES ($1, $2, $3, $4)
    RETURNING id
    `,
        [description, username, title, url]
    );
};

module.exports.getModal = function getModal(id) {
    return db.query(
        `
        SELECT * FROM images
        WHERE id=$1;
        `,
        [id]
    );
};

module.exports.insertComment = function insertComment(
    comment,
    username,
    img_id
) {
    return db.query(
        `
    INSERT INTO comments (comment, username, img_id)
    VALUES ($1, $2, $3)
    RETURNING id, created_at
    `,
        [comment, username, img_id]
    );
};

module.exports.getComment = function getComment(id) {
    return db.query(
        `
        SELECT * FROM comments
        WHERE img_id=$1
        `,
        [id]
    );
};

exports.getMoreImages = function getMoreImages(id) {
    return db.query(
        `SELECT *, (
       SELECT id FROM images
       ORDER BY id ASC
       LIMIT 1)
       AS lowest_id FROM images
       WHERE id < $1
       ORDER BY id DESC
       LIMIT 5;`,
        [id]
    );
};
