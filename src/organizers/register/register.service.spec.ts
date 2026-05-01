import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RegisterService } from './register.service';
import { CreateRegisterDto } from './dto/create-register.dto';
import { InscricaoModalidade } from 'src/core/entities/inscricao/inscricao-modalidade.entity';
import { Evento } from 'src/core/entities/evento/evento.entity';
import { MetodoPagamentoEnum } from 'src/core/enum/metodo-pagamento.enum';

type MockRepo<T extends object> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const buildBaseDto = (
  overrides: Partial<CreateRegisterDto> = {},
): CreateRegisterDto => ({
  nome: 'Modalidade Premium',
  descricao: 'Acesso completo',
  gratuito: false,
  preco: 150,
  vagas: 100,
  dataInicioVenda: new Date('2026-06-01'),
  dataFimVenda: new Date('2026-06-30'),
  documentosExigidos: null,
  metodosPagamento: [MetodoPagamentoEnum.Pix],
  ...overrides,
});

describe('RegisterService', () => {
  let service: RegisterService;
  let registerRepo: MockRepo<InscricaoModalidade>;
  let eventoRepo: MockRepo<Evento>;

  const eventoId = '11111111-1111-1111-1111-111111111111';

  beforeEach(async () => {
    registerRepo = {
      create: jest.fn((data) => data),
      save: jest.fn(),
    };
    eventoRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterService,
        {
          provide: getRepositoryToken(InscricaoModalidade),
          useValue: registerRepo,
        },
        { provide: getRepositoryToken(Evento), useValue: eventoRepo },
      ],
    }).compile();

    service = module.get<RegisterService>(RegisterService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('createRegister', () => {
    it('lança NotFoundException quando o evento não existe', async () => {
      eventoRepo.findOne!.mockResolvedValue(null);

      await expect(
        service.createRegister(eventoId, buildBaseDto()),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(registerRepo.save).not.toHaveBeenCalled();
    });

    it('lança BadRequestException quando dataInicioVenda >= dataFimVenda', async () => {
      eventoRepo.findOne!.mockResolvedValue({ id: eventoId });
      const dto = buildBaseDto({
        dataInicioVenda: new Date('2026-07-01'),
        dataFimVenda: new Date('2026-06-30'),
      });

      await expect(service.createRegister(eventoId, dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    describe('modalidade paga', () => {
      beforeEach(() => {
        eventoRepo.findOne!.mockResolvedValue({ id: eventoId });
      });

      it('exige preco maior que 0', async () => {
        const dto = buildBaseDto({ gratuito: false, preco: 0 });
        await expect(service.createRegister(eventoId, dto)).rejects.toThrow(
          /preco maior que 0/,
        );
      });

      it('exige ao menos um método de pagamento', async () => {
        const dto = buildBaseDto({ gratuito: false, metodosPagamento: [] });
        await expect(service.createRegister(eventoId, dto)).rejects.toThrow(
          /método de pagamento/,
        );
      });

      it('persiste e retorna o payload formatado', async () => {
        const dto = buildBaseDto();
        registerRepo.save!.mockImplementation(async (m) => ({
          id: 'gen-id',
          vagasUtilizadas: 0,
          ...m,
        }));

        const result = await service.createRegister(eventoId, dto);

        expect(registerRepo.create).toHaveBeenCalledWith(
          expect.objectContaining({
            eventoId,
            nome: dto.nome,
            gratuito: false,
            preco: dto.preco,
            metodosPagamento: dto.metodosPagamento,
          }),
        );
        expect(registerRepo.save).toHaveBeenCalledTimes(1);
        expect(result).toEqual({
          data: expect.objectContaining({
            id: 'gen-id',
            nome: dto.nome,
            gratuito: false,
            preco: dto.preco,
            vagasUtilizadas: 0,
          }),
        });
      });
    });

    describe('modalidade gratuita', () => {
      beforeEach(() => {
        eventoRepo.findOne!.mockResolvedValue({ id: eventoId });
      });

      it('rejeita preço maior que 0', async () => {
        const dto = buildBaseDto({
          gratuito: true,
          preco: 50,
          metodosPagamento: null,
        });
        await expect(service.createRegister(eventoId, dto)).rejects.toThrow(
          /gratuita não pode ter preço/,
        );
      });

      it('rejeita métodos de pagamento', async () => {
        const dto = buildBaseDto({
          gratuito: true,
          preco: null,
          metodosPagamento: [MetodoPagamentoEnum.Pix],
        });
        await expect(service.createRegister(eventoId, dto)).rejects.toThrow(
          /gratuita não deve ter métodos/,
        );
      });

      it('zera preco e metodosPagamento ao salvar', async () => {
        const dto = buildBaseDto({
          gratuito: true,
          preco: null,
          metodosPagamento: null,
        });
        registerRepo.save!.mockImplementation(async (m) => ({
          id: 'gen-id',
          vagasUtilizadas: 0,
          ...m,
        }));

        await service.createRegister(eventoId, dto);

        expect(registerRepo.create).toHaveBeenCalledWith(
          expect.objectContaining({
            gratuito: true,
            preco: null,
            metodosPagamento: null,
          }),
        );
      });
    });
  });
});
