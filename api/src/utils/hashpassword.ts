import { pbkdf2Sync } from 'crypto';
export function hashPassword(password: string) {
    return pbkdf2Sync(password, 'salt', 1, 32, 'sha512').toString('base64');
}
