import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import  Criterion  from "./Criterion"

@Entity()
class Rating {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Criterion, (c) => c.ratings, {onDelete: 'CASCADE', nullable: false})
    criterion: Criterion

    @Column()
    value: number
}

export default Rating