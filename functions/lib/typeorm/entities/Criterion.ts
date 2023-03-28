import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import  Rating  from "./Rating"

@Entity()
class Criterion {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @Column()
    minValue: number

    @Column()
    maxValue: number

    @Column()
    weight: number

    @OneToMany(() => Rating, (r) => r.criterion, {eager: true})
    ratings: Rating[]
}

export default Criterion