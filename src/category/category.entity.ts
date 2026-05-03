import { Product } from "src/product/product.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category{
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column()
    name:string

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}