import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Products {
  constructor(products?: Partial<Products>) {
    this.id = products?.id;
    this.name = products?.name;
    this.description = products?.description;
    this.image = products?.image;
    this.price = products?.price;
    this.texture = products?.texture;
    this.weight = products?.weight;
    this.size = products?.size;
  }

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
