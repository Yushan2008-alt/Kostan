import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateBookingDto {
  @IsNumber({}, { message: 'Room ID harus berupa angka' })
  @IsPositive({ message: 'Room ID harus positif' })
  @IsNotEmpty({ message: 'Room ID tidak boleh kosong' })
  roomId: number;
}
