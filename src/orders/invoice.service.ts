import * as PDFDocument from 'pdfkit';
import { Injectable } from '@nestjs/common';
import { Order } from './schemas/order.schema';

@Injectable()
export class InvoiceService {
  private invoiceTableEnd: number;

  generateHr = (doc, y) => {
    doc
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  };

  formatCurrency(value) {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      currencyDisplay: 'code',
    }).format(value);
  }

  formatDate(date) {
    return new Date(date).toLocaleString('en', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

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

  generateOrderInformation(doc, order) {
    doc
      .fillColor('#444444')
      .fontSize(16)
      .font('Helvetica')
      .text('Order Information', 50, 130);

    this.generateHr(doc, 152);

    const orderInformationTop = 160;

    doc
      .fontSize(10)

      .font('Helvetica')
      .text('Order #:', 50, orderInformationTop)
      .font('Helvetica-Bold')
      .text(order.code, 150, orderInformationTop)

      .font('Helvetica')
      .text('Order Date:', 50, orderInformationTop + 15)
      .font('Helvetica-Bold')
      .text(this.formatDate(order.createdAt), 150, orderInformationTop + 15)

      .font('Helvetica')
      .text('Total:', 50, orderInformationTop + 30)
      .font('Helvetica-Bold')
      .text(this.formatCurrency(order.total), 150, orderInformationTop + 30)

      .font('Helvetica')
      .text('For Delivery:', 375, orderInformationTop)
      .font('Helvetica-Bold')
      .text(order.forDelivery ? 'Yes' : 'No', 450, orderInformationTop);

    if (order.forDelivery) {
      doc
        .font('Helvetica')
        .text('Delivery Date:', 375, orderInformationTop + 15)
        .font('Helvetica-Bold')
        .text(
          this.formatDate(order.deliveryDate),
          450,
          orderInformationTop + 15,
        );
    }

    doc.moveDown();

    this.generateHr(doc, 205);
  }

  generateCustomerInformation(doc, order) {
    doc
      .fillColor('#444444')
      .fontSize(16)
      .font('Helvetica')
      .text('Customer Information', 50, 230);

    this.generateHr(doc, 252);

    const orderInformationTop = 260;

    doc
      .fontSize(10)

      .font('Helvetica')
      .text('Name:', 50, orderInformationTop)
      .font('Helvetica-Bold')
      .text(order.customerName, 150, orderInformationTop)

      .font('Helvetica')
      .text('Email:', 50, orderInformationTop + 15)
      .font('Helvetica-Bold')
      .text(
        order.customerEmail ? order.customerEmail : 'n/a',
        150,
        orderInformationTop + 15,
      )

      .font('Helvetica')
      .text('Contact:', 50, orderInformationTop + 30)
      .font('Helvetica-Bold')
      .text(
        order.customerContact ? order.customerContact : 'n/a',
        150,
        orderInformationTop + 30,
      )

      .font('Helvetica')
      .text('Address:', 375, orderInformationTop)
      .font('Helvetica-Bold')
      .text(
        order.customerAddress ? order.customerAddress : 'n/a',
        425,
        orderInformationTop,
      )
      .moveDown();

    this.generateHr(doc, 305);
  }

  generateTableRow(doc, y, code, name, price, quantity, total) {
    doc
      .fontSize(10)
      .text(code, 50, y)
      .text(name, 150, y)
      .text(price, 280, y, { width: 90, align: 'right' })
      .text(quantity, 370, y, { width: 90, align: 'right' })
      .text(total, 0, y, { align: 'right' });
  }

  generateInvoiceTable(doc, order) {
    let i;
    const invoiceTableTop = 350;

    doc.font('Helvetica-Bold');
    this.generateTableRow(
      doc,
      invoiceTableTop,
      'Item Code',
      'Item Name',
      'Price',
      'Quantity',
      'Total',
    );
    this.generateHr(doc, invoiceTableTop + 20);
    doc.font('Helvetica');

    for (i = 0; i < order.productOrders.length; i++) {
      const item = order.productOrders[i];
      const position = invoiceTableTop + (i + 1) * 30;
      this.generateTableRow(
        doc,
        position,
        item.code,
        item.name,
        this.formatCurrency(item.price),
        item.quantity,
        this.formatCurrency(item.total),
      );

      this.generateHr(doc, position + 20);
    }

    const duePosition = invoiceTableTop + (i + 1) * 30;
    doc.font('Helvetica-Bold');
    this.generateTableRow(
      doc,
      duePosition,
      '',
      '',
      'Total Due',
      '',
      this.formatCurrency(order.total),
    );
    doc.font('Helvetica');

    this.invoiceTableEnd = duePosition;
  }

  generateSignaturesSection(doc) {
    const checkedByY = this.invoiceTableEnd + 50;
    const checkedByLineY = checkedByY + 10;
    const checkedBySignatureDateText = checkedByY + 15;

    const approvedByY = checkedByY + 50;
    const approvedByLineY = approvedByY + 10;
    const approvedByYSignatureDateText = approvedByY + 15;

    doc
      .text('Checked by:', 50, checkedByY)
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(110, checkedByLineY)
      .lineTo(275, checkedByLineY)
      .stroke()
      .text(
        'Signature over printed name / Date',
        115,
        checkedBySignatureDateText,
      )

      .text('Approved by:', 50, approvedByY)
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(110, approvedByLineY)
      .lineTo(275, approvedByLineY)
      .stroke()
      .text(
        'Signature over printed name / Date',
        115,
        approvedByYSignatureDateText,
      )

      .text('Received by:', 315, approvedByY)
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(375, approvedByLineY)
      .lineTo(540, approvedByLineY)
      .stroke()
      .text(
        'Signature over printed name / Date',
        380,
        approvedByYSignatureDateText,
      );
  }

  generate(order: Order, res: Response) {
    const doc = new PDFDocument();

    this.generateHeader(doc);
    this.generateOrderInformation(doc, order);
    this.generateCustomerInformation(doc, order);
    this.generateInvoiceTable(doc, order);
    this.generateSignaturesSection(doc);

    doc.end();
    doc.pipe(res);

    return res;
  }
}
