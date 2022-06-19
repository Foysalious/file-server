import { EntityRepository, Repository } from "typeorm";
import { IpEntity } from "./entities/ip.entity";

@EntityRepository(IpEntity)
export class IpRepository extends Repository<IpEntity> { }