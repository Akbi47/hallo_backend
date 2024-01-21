import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateAddressShippingDto {
    @ApiProperty({
        required: false,
      })
      @IsOptional()
      @IsString()
      name: string;
    
      @ApiProperty({
        required: false,
      })
      @IsOptional()
      @IsString()
      phone: string;

      @ApiProperty({
        required: false,
      })
      @IsOptional()
      @IsString()
      address: string;
    
      @ApiProperty({ required: false })
      @IsOptional()
      default?: boolean;
}
