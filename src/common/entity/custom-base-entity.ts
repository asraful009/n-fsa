import {
  BeforeInsert,
  BeforeSoftRemove,
  Column,
  DeleteDateColumn,
  Index,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  VersionColumn,
} from "typeorm";

export class CustomBaseEntity {
  //@PrimaryGeneratedColumn("uuid")
  @PrimaryColumn("uuid")
  id: string;

  @VersionColumn()
  version: number;

  @Column({ type: "timestamp" })
  @Index()
  createdAt: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  @Index()
  deletedAt: Date;

  @BeforeInsert()
  setCreateDate() {
    if (this.createdAt === undefined || this.createdAt === null) {
      this.createdAt = new Date();
    }
  }
}
