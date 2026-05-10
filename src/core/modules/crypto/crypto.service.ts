import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  private readonly ALGORITMO_UMA_VIA = process.env.CRYPTO_SHA_ALGORITHM!;
  private readonly ALGORITMO_MAO_DUPLA = process.env.CRYPTO_AES_ALGORITHM!;
  private readonly CHAVE = Buffer.from(process.env.CRYPTO_AES_KEY!);
  private readonly IV = Buffer.from(process.env.CRYPTO_AES_IV!);

  criptografaMaoUnica(texto: string): string {
    const hash = crypto.createHash(this.ALGORITMO_UMA_VIA);
    hash.update(texto);
    return hash.digest('hex');
  }

  criptografaMaoDupla(texto: string): string {
    let cipher = crypto.createCipheriv(
      this.ALGORITMO_MAO_DUPLA,
      this.CHAVE,
      this.IV,
    );
    let encrypted = cipher.update(texto, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  descriptografaMaoDupla(textoEncriptado: string): string {
    let decipher = crypto.createDecipheriv(
      this.ALGORITMO_MAO_DUPLA,
      this.CHAVE,
      this.IV,
    );
    let decrypted = decipher.update(textoEncriptado, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  generateRandomUUIID(): crypto.UUID {
    return crypto.randomUUID();
  }
}
