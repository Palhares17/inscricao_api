import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClienteOrganizadores } from 'src/core/entities/cliente/cliente-organizadores.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClienteOrganizadores)
    private readonly clienteOrganizadoresRepository: Repository<ClienteOrganizadores>,
  ) {}

  async findOrganizadorById(id: string): Promise<ClienteOrganizadores | null> {
    return this.clienteOrganizadoresRepository
      .createQueryBuilder('cliente_organizadores')
      .innerJoinAndSelect(
        'cliente_organizadores.role',
        'cliente_organizadores_roles',
      )
      .where('cliente_organizadores.id = :id', { id })
      .andWhere('cliente_organizadores.deletedAt IS NULL')
      .andWhere('cliente_organizadores.ativo IS TRUE')
      .getOne();
  }
}
