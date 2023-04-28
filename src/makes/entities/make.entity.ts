import { Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { ModelEntity } from 'src/models/entities/model.entity';

@Entity('makes')
export class MakeEntity {
  @PrimaryColumn({ type: String })
  make: string;

  @OneToMany(() => ModelEntity, (model) => model.makes)
  model: ModelEntity;
}
