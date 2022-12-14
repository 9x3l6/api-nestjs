module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'videos',
  password: 'videos-dev-33',
  database: 'videos',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
  cli: {
    migrationsDir: 'src/database/migrations',
  },
};