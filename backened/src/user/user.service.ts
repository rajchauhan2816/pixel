import { User, UserKey } from '../user/entities/user.entity';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { UserRole } from './entities/user.enum';
import { hashPassword } from 'src/utils/hashpassword';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('user')
        private readonly model: Model<User, UserKey>,
    ) {}
    async create(createUserDto: CreateUserDto) {
        const user = await this.findOne({ username: createUserDto.username });
        if (user) throw new BadRequestException();

        return this.model.create({
            ...createUserDto,
            role: UserRole.Normal,
            createAt: new Date().toISOString(),
            password: hashPassword(createUserDto.password),
        });
    }

    findAll() {
        // Dangerous Opeartion
        return this.model.scan().exec();
    }

    findOne(key: UserKey) {
        return this.model.get(key);
    }

    update(key: UserKey, updateUserDto: UpdateUserDto) {
        return this.model.update(key, { password: updateUserDto.newPassword });
    }

    remove(key: UserKey) {
        return this.model.delete(key);
    }
}
