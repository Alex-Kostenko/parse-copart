import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { MakeEntity } from 'src/makes/entities/make.entity';

@Entity('models')
export class ModelEntity {
  @PrimaryColumn({ type: String })
  model: string;

  @ManyToOne(() => MakeEntity, (makes) => makes.model)
  makes: MakeEntity[];
}
