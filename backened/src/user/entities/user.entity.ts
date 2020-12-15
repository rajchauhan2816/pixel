import { UserRole } from './user.enum';
import { CreateUserDto } from '../dto/create-user.dto';

export type UserKey = {
    username: string;
};

export class User extends CreateUserDto {
    role: UserRole;

    createAt: string;
}
