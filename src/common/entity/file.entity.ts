import { Column, Entity, Index } from "typeorm";
import { CustomBaseEntity } from "./custom-base-entity";

@Entity("FileEntity")
@Index(["createdAt", "isDeleted"])
export class FileEntity extends CustomBaseEntity {
  @Column({ type: "varchar", length: 512, nullable: false })
  @Index()
  fileName: string;

  @Column({ type: "varchar", length: 2048, nullable: false })
  fileLocation: string;

  @Column({ type: "varchar", length: 512, nullable: false })
  @Index()
  privateToken: string;

  @Column({ type: "varchar", length: 512, nullable: false })
  @Index()
  publicToken: string;

  @Column({ type: "varchar", length: 128, nullable: false })
  fileExtension: string;

  @Column({ type: "varchar", length: 128, nullable: false })
  fileMime: string;
}
