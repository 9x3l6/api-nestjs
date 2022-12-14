import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  Index,
  BaseEntity,
} from 'typeorm';
import * as crypto from 'crypto';
// import { Video } from 'src/archived-videos/entities/video.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  first: string;

  @Column()
  last: string;

  @Index()
  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  public provider: string;

  @Column()
  resetPasswordToken: string;

  @Column()
  emailConfirmationToken: string;

  @Column()
  phoneConfirmationToken: string;

  @Column()
  emailConfirmed: boolean;

  @Column()
  phoneConfirmed: boolean;

  @Column()
  blocked: boolean;

  public static async authenticateUser(user: {username: string, password: string}): Promise<User> {
    let u: User;
    console.log(user, 'us')
    u = await User.findOne({
      // select: ['id', 'username', 'password'],
      where: [
        { email: user.username},
        { phone: user.username},
        { username: user.username}
      ]
    });
    const passHash = crypto.createHmac('sha256', user.password).digest('hex');
    if (u && u.password === passHash) {
      delete u.password;
      return  u;
    }
  }
}
