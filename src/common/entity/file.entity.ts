import { Entity, Index } from "typeorm";
import { CustomBaseEntity } from "./custom-base-entity";

@Entity("FileEntity")
@Index(["createdAt", "isDeleted"])
export class FileEntity extends CustomBaseEntity {}
