import {
    BaseEntity,
    Column,
    CreateDateColumn, 
    Entity,
    ObjectIdColumn,
    UpdateDateColumn,
} from 'typeorm';
@Entity('ip-history')

export class IpEntity extends BaseEntity {
    @ObjectIdColumn()
    _id: string;

    @Column()
    ip: string;

    @Column()
    route: string;

    @Column()
    job: string;

    @CreateDateColumn({ update: false })
    created_at: Date;

    @UpdateDateColumn({ nullable: true })
    updated_at: Date;

}