import { EntityRepository, Repository } from "typeorm";
import { LocalFileEntity } from "./entities/file-server.entity";

@EntityRepository(LocalFileEntity)
export class LocalFileServerRepository extends Repository<LocalFileEntity> { }