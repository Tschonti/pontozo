import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import {AppDataSource} from "../config"
import { Rating } from "./Rating"

@Entity()
export class Criterion {
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

    @OneToMany(() => Rating, (r) => r.criterion)
    ratings: Rating[]
}

export const criterionRepository = AppDataSource.getRepository(Criterion)