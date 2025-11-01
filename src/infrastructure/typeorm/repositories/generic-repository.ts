import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

export abstract class GenericRepository<T extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<T>) {}

  findAll(options?: FindManyOptions<T>) {
    return this.repository.find(options);
  }

  findOne(options: FindOneOptions<T>) {
    return this.repository.findOne(options);
  }

  findAndCount(options?: FindManyOptions<T>) {
    return this.repository.findAndCount(options);
  }

  create(payload: DeepPartial<T>): Promise<T>;
  create(payload: DeepPartial<T>[]): Promise<T[]>;
  create(payload: DeepPartial<T> | DeepPartial<T>[]): Promise<T | T[]> {
    if (Array.isArray(payload)) {
      const instances = this.repository.create(payload);
      return this.repository.save(instances);
    } else {
      const instance = this.repository.create(payload);
      return this.repository.save(instance);
    }
  }

  update(where: FindOptionsWhere<T>, payload: QueryDeepPartialEntity<T>) {
    return this.repository.update(where, payload);
  }

  save(payload: DeepPartial<T> | DeepPartial<T[]>): Promise<T | T[]> {
    if (Array.isArray(payload)) {
      return this.repository.save(payload as DeepPartial<T>[]);
    } else {
      return this.repository.save(payload as DeepPartial<T>);
    }
  }

  delete(where: FindOptionsWhere<T>) {
    return this.repository.delete(where);
  }

  softDelete(where: FindOptionsWhere<T>) {
    return this.repository.softDelete(where);
  }

  count(options?: FindManyOptions<T>) {
    return this.repository.count(options);
  }

  createQueryBuilder(alias?: string) {
    return this.repository.createQueryBuilder(alias);
  }
}
