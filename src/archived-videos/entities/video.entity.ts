import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  BaseEntity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Channel } from 'src/archived-channels/entities/channel.entity';

@Entity('archived-videos')
export class Video extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  videoId: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  path: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  duration: number;

  @Column()
  uploaded: string; // date

  @Column('json', { nullable: true })
  tags: string[];

  @Column({ nullable: true })
  width: number;

  @Column({ nullable: true })
  height: number;

  @Column()
  storageUrl: string;

  @Column()
  directory: string;

  @Column({ nullable: true })
  provider: string;

  @Column({ nullable: true })
  removed: boolean;

  @ManyToOne(
    type => Channel,
    channel => channel.videos,
  )
  channel: Channel;
}
