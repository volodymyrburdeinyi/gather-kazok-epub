import sqlite3 from 'sqlite3';

export default class PagesStorage {
    #db;

    constructor() {
        this.#db = new sqlite3.Database(
            './db.sqlite3',
            (error) => {
                if (error) {
                    return console.error(error.message);
                }
            }
        );
    }

    async init() {
        await this.createTablePages();
    }

    async createTablePages() {
        this.#db.exec(`
            CREATE TABLE if not exists pages
            (
                id
                INTEGER
                PRIMARY
                KEY
                AUTOINCREMENT,
                url
                TEXT
                UNIQUE
                not
                null,
                title
                TEXT,
                author
                TEXT,
                date_added
                TEXT,
                content
                TEXT,
                category_l0
                TEXT,
                category_l1
                TEXT,
                category_l2
                TEXT,
                category_l3
                TEXT
            )
        `);
    }

    async createPage(url, title, author, dateAdded, content, categoryL0, categoryL1, categoryL2, categoryL3) {
        const stmt = this.#db.prepare(`
            INSERT INTO pages (url,
                               title,
                               author,
                               date_added,
                               content,
                               category_l0,
                               category_l1,
                               category_l2,
                               category_l3)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(url, title, author, dateAdded, content, categoryL0, categoryL1, categoryL2, categoryL3);
        stmt.finalize();
    }

    async getPageByUrl(url) {
        return new Promise((resolve, reject) => {
            const stmt = this.#db.prepare(`
                SELECT *
                FROM pages
                WHERE url = ?
            `);

            stmt.get(url, (err, row) => {
                // console.log(row)
                if (err) {
                    reject(err);
                }
                return resolve(row);
            });
        });
    }

    async getAllPages(category_l2) {
        return new Promise((resolve, reject) => {
            const stmt = this.#db.prepare(`
                SELECT *
                from pages
                WHERE category_l2 = ?
            `);
            stmt.all(
                category_l2, (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    return resolve(rows);
                }
            );
        });
    }
}