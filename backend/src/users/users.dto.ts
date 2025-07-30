import { IsString, IsNotEmpty, MinLength, IsEnum } from 'class-validator';
import { UserRole } from './users.entity';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6) // Assuming a minimum password length
    password_hash: string;

    @IsEnum(['super_admin', 'kurikulum', 'kesiswaan', 'keuangan', 'tu_tas', 'bp_bk', 'admin_web', 'guru', 'siswa']) // Example roles
    @IsString()
    @IsNotEmpty()
    role: UserRole;
    // Add other fields as necessary, e.g., role, firstName, lastName, etc.
}