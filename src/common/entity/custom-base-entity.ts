import {
  BeforeInsert,
  BeforeSoftRemove,
  Column,
  Index,
  PrimaryGeneratedColumn,
  VersionColumn,
} from "typeorm";

export class CustomBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @VersionColumn()
  version: number;

  @Column({ type: "timestamp" })
  @Index()
  createdAt: Date;

  @Column({ type: "boolean", default: false })
  @Index()
  isDeleted: boolean = false;

  @Column({ type: "timestamp", nullable: true })
  @Index()
  deletedAt: Date;

  @BeforeInsert()
  setCreateDate() {
    this.createdAt = new Date();
  }

  @BeforeSoftRemove()
  setDeletedDate() {
    this.deletedAt = new Date();
    this.isDeleted = true;
  }
}
