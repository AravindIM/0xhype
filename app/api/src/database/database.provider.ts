import { Provider } from "@nestjs/common";
import { DataSource } from "typeorm";

export const databaseProviders: Provider[] = [
    {
        provide: 'POSTGRES',
        useFactory: async () => {
            const dataSouce = new DataSource({
                type: 'postgres',
                host: process.env.POSTGRES_HOST,
                port: Number(process.env.POSTGRES_PORT),
                username: process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
                database: process.env.POSTGRES_DB,
                entities: [
                    __dirname + '/../**/*.entity{.ts,.js}',
                ],
                synchronize: true,
            });
            return dataSouce.initialize();
        }
    }
]