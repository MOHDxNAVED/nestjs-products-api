import { Category } from "src/category/category.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    name:string;

    @Column()
    description:string;

    @Column('decimal')
    price:number

    @Column({default:true})
    isAvailable:boolean;

    @Column({type:"varchar",nullable:true})
    image:string | null
    // 👆 Image ka path store hoga
  // nullable: true — image optional hai
  // Value hogi → "uploads/product-123456.jpg"

    @Column()
    categoryId: string;  // 👈 Foreign key column

    

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: 'categoryId' })  // 👈 Foreign key define karo
    category: Category;  // 👈 Ek product sirf ek category ka



}