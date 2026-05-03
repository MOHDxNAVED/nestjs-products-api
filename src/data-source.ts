 
 import * as dotenv from 'dotenv'
import { DataSource } from 'typeorm'
 
 dotenv.config()
 // 👆 Kyun? — Yeh file NestJS ke bahar chalti hai
// NestJS ka ConfigModule yahan kaam nahi karta
// Isliye directly dotenv use karte hain .env padhne ke liye


export const AppDataSource=new DataSource({
    type:'postgres',
    host:process.env.DB_HOST,
    port:Number(process.env.DB_PORT),
    username:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,

    entities:[__dirname + '/**/*.entity{.ts,.js}'],
    // 👆 Saari entity files dhundo — TypeORM ko pata hoga tables kaisi hain

    migrations:[__dirname + '/migrations/*{.ts,.js}'],
    // 👆 Migration files yahan hongi — src/migrations/ folder mein
  // Jab migration:run chalayenge — yahan se files padhi jaayengi

    synchronize:false
    // 👆 Yahan bhi false — data-source se bhi auto-sync band
})