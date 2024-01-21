import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreatePaymentDto {

    @ApiProperty({required: true})
    @IsString()
    name: string;

    @ApiProperty({required: true})
    @IsString()
    code: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    readonly desc?: string;

    // @ApiProperty({ required: false, type: String })
    // @IsOptional()
    // @IsString()
    // readonly img: string;
}
