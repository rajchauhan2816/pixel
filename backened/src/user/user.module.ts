import { DynamooseModule } from 'nestjs-dynamoose';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSchema } from './entities/user.schema';

@Module({
    imports: [
        DynamooseModule.forFeature([
            {
                name: 'user',
                schema: UserSchema,
            },
        ]),
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
