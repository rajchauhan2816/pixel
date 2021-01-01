import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DynamooseModule } from 'nestjs-dynamoose';
import { NotificationModule } from './notification/notification.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ImageModule } from './image/image.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        DynamooseModule.forRoot({
            local: process.env.IS_DDB_LOCAL === 'true',
            aws: { region: process.env.REGION },
            model: {
                create: false,
                prefix: `${process.env.SERVICE}-${process.env.STAGE}-`,
                suffix: '-table',
            },
        }),
        NotificationModule,
        UserModule,
        AuthModule,
        ImageModule,
    ],
})
export class AppModule {}
