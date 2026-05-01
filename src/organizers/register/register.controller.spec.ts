import { Test, TestingModule } from '@nestjs/testing';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { CreateRegisterDto } from './dto/create-register.dto';
import { MetodoPagamentoEnum } from 'src/core/enum/metodo-pagamento.enum';

describe('RegisterController', () => {
  let controller: RegisterController;
  let service: jest.Mocked<Pick<RegisterService, 'createRegister'>>;

  beforeEach(async () => {
    service = {
      createRegister: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegisterController],
      providers: [{ provide: RegisterService, useValue: service }],
    }).compile();

    controller = module.get<RegisterController>(RegisterController);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const eventoId = '11111111-1111-1111-1111-111111111111';
    const dto: CreateRegisterDto = {
      nome: 'Modalidade Premium',
      gratuito: false,
      preco: 150,
      vagas: 100,
      dataInicioVenda: new Date('2026-06-01'),
      dataFimVenda: new Date('2026-06-30'),
      metodosPagamento: [MetodoPagamentoEnum.Pix],
    };

    it('delega para o service e devolve o resultado', async () => {
      const expected = { data: { id: 'abc', nome: dto.nome } };
      service.createRegister.mockResolvedValue(expected as never);

      const result = await controller.create(eventoId, dto);

      expect(service.createRegister).toHaveBeenCalledTimes(1);
      expect(service.createRegister).toHaveBeenCalledWith(eventoId, dto);
      expect(result).toBe(expected);
    });

    it('propaga erros lançados pelo service', async () => {
      service.createRegister.mockRejectedValue(new Error('boom'));

      await expect(controller.create(eventoId, dto)).rejects.toThrow('boom');
    });
  });
});
