import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { Video } from 'src/archived-videos/entities/video.entity';

@Entity('archived-channels')
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  name: string;

  @Column()
  storageUrl: string;

  @Column()
  provider: string;

  @Column()
  directory: string;

  @Column()
  url: string;

  @Column()
  size: string;

  @Column()
  videosCount: number;

  @Column()
  terminated: boolean;

  @Column()
  featured: boolean;

  @Column()
  critical: boolean;

  @Column()
  profile: boolean;

  @Column()
  banner: boolean;

  @Column({ default: 0 })
  recommendations: number;

  @JoinTable()
  @OneToMany(
    type => Video,
    video => video.channel,
    {
      cascade: true,
    }
  )
  videos: string[];
}
