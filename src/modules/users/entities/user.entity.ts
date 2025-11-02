import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  full_name: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'text', nullable: true })
  refresh_token: string | null;

  @Column({ type: 'text', nullable: true })
  reset_token: string | null;

  @Column({ type: 'timestamp', nullable: true })
  reset_token_expires_at: Date | null;

  @Column({ type: 'text', nullable: true })
  reset_otp: string | null;

  @Column({ type: 'timestamp', nullable: true })
  reset_otp_expires_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date | null;
}
