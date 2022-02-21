import * as PDFDocument from 'pdfkit';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InvoiceService {
  generateHeader(doc) {
    doc
      .image('assets/logo.jpeg', 50, 20, { width: 100 })
      .fontSize(10)
      .text('MKC Company Ltd.', 200, 50, { align: 'right' })
      .text(
        'G/F Unit 3 & 4 Juliana Building, Lopez Ave., Brgy. San Isidro',
        200,
        65,
        { align: 'right' },
      )
      .text('Parañaque City', 200, 80, { align: 'right' })
      .moveDown();
  }

  generate(code: string, res: Response) {
    const doc = new PDFDocument();

    this.generateHeader(doc);

    doc.end();
    doc.pipe(res);

    return res;
  }
}
