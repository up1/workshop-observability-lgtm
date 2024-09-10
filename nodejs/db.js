const { Client } = require('pg')

const getData = async () => {
    try {
        const client = new Client({
            host: 'db',
            port: 5432,
            database: 'demo',
            user: 'user',
            password: 'pass',
        })
        await client.connect()

        const res = await client.query('SELECT * from articles')
        console.log(res.rows[0].title)
        await client.end()
    } catch (err) {
        console.error(err);
    }
}

module.exports = getData