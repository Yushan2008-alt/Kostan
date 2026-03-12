import { Injectable } from '@nestjs/common';
import { CreateKoDto } from './dto/create-ko.dto';
import { UpdateKoDto } from './dto/update-ko.dto';

@Injectable()
export class KosService {
  create(createKoDto: CreateKoDto) {
    return 'This action adds a new ko';
  }

  findAll() {
    return `This action returns all kos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ko`;
  }

  update(id: number, updateKoDto: UpdateKoDto) {
    return `This action updates a #${id} ko`;
  }

  remove(id: number) {
    return `This action removes a #${id} ko`;
  }
}
