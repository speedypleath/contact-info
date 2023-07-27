import { ApiProperty } from '@nestjs/swagger';

export class Website {
  @ApiProperty()
  domain: string;
  @ApiProperty()
  companyComercialName?: string;
  @ApiProperty({ required: false })
  companyLegalName?: string;
  @ApiProperty()
  companyAllAvailableNames?: string;
}
