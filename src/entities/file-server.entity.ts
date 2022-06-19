import {
    BaseEntity,
    Column,
    CreateDateColumn, 
    Entity,
    ObjectIdColumn,
    UpdateDateColumn,
} from 'typeorm';
@Entity('local_file')

export class LocalFileEntity extends BaseEntity {
    @ObjectIdColumn()
    _id: string;

    @Column()
    public_id: number;


    @Column()
    path: string;

    @Column()
    client: string;

    @CreateDateColumn({ update: false })
    created_at: Date;

    @UpdateDateColumn({ nullable: true })
    updated_at: Date;

}