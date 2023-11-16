import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Products {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'text', nullable: false })
  image: string;

  @Column({ type: 'numeric', nullable: false })
  price: number;

  @Column({ type: 'text', nullable: false })
  texture: string;

  @Column({ type: 'text', nullable: false })
  weight: string;

  @Column({ type: 'text', nullable: false })
  size: string;
}
