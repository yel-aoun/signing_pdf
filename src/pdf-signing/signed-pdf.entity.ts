import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
// import { Blob } from 'buffer';


@Entity()
export class SignedPdf {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  filename: string;

  @Column({ type: 'bytea' })
  pdf_data: Blob;

  @CreateDateColumn()
  created_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async convertBlobToBuffer() {
    if (this.pdf_data instanceof Blob) {
      const arrayBuffer = await this.pdf_data.arrayBuffer();
      this.pdf_data = Buffer.from(arrayBuffer) as any;
    }
  }
}
