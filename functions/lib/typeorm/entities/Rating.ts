import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Criterion } from "./Criterion"

@Entity()
export class Rating {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Criterion, (c) => c.ratings, {onDelete: 'CASCADE'})
    criterion: Criterion

    @Column()
    value: number
}