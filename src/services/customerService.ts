import fs from "fs";
import * as nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import { conn } from "../db";
import { validationErrorHandler } from "../helpers/errorHandler";
import { hash } from "../helpers/security";
import { Customer } from "../models/Customer";
import { CustomerOrder } from "../models/CustomerOrder";
import { Country, PaymentStatus } from "../models/Enumerated";
import { Listing } from "../models/Listing";
import { OrderItem } from "../models/OrderItem";
import { Payment } from "../models/Payment";
import { Token } from "../models/Token";
const { Sequelize } = require("sequelize");
const { Op } = Sequelize;

export async function sendEmailVerification(email: string) {
  let customer = await Customer.findOne({
    where: { email: email },
  });

  if (!customer) {
    const token = uuidv4();

    const verificationTokens: any = {
      token: token,
      email: email,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000, //expires in 1 hour
    };

    try {
      await Token.create(verificationTokens);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: "ZooVanna Email Verification",
        text: "Click the link below to verify your email: ",
        html: `<a href="http://${process.env.LOCALHOST_ADDRESS}:5174/signup/${token}">Verify Email</a>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
    } catch (error: any) {
      throw validationErrorHandler(error);
    }
  } else {
    throw { message: "Email is already registered. Please log in instead." };
  }
}

export async function createNewCustomer(
  customerPassword: string,
  firstName: string,
  lastName: string,
  contactNo: string,
  birthday: Date,
  nationality: Country,
  token: string,
) {
  let realToken = await Token.findOne({
    where: { token: token },
  });

  if (realToken) {
    if (realToken.expiresAt.getTime() > Date.now()) {
      realToken.destroy();
      let email = realToken.email;
      const randomSalt = (Math.random() + 1).toString(36).substring(7);

      const customer_details: any = {
        passwordHash: hash(customerPassword + randomSalt),
        salt: randomSalt,
        firstName: firstName,
        lastName: lastName,
        email: email,
        contactNo: contactNo,
        birthday: birthday,
        nationality: nationality,
      };
      try {
        let newCustomer = await Customer.create(customer_details);
        return [newCustomer.toJSON()];
      } catch (error: any) {
        throw validationErrorHandler(error);
      }
    } else {
      realToken.destroy();
      throw {
        message: "Token has expired. Please try to verify your email again.",
      };
    }
  } else {
    throw { message: "Invalid token!" };
  }
}

export async function findCustomerByEmail(email: string) {
  console.log("by email");
  console.log(email);
  let result = await Customer.findOne({
    where: { email: email },
    include: ["itineraries"],
  });

  if (result) {
    return result;
  } else {
    throw { message: "Invalid email!" };
  }
}

//might have an error for param type, might be CreationOptional<number>
export async function findCustomerByCustomerId(customerId: number) {
  console.log("by id");
  console.log(customerId);
  let result = await Customer.findOne({
    where: { customerId: customerId },
  });
  if (result) {
    return result;
  }
  throw { message: "Invalid customer ID!" };
}

export async function customerLogin(
  email: string,
  password: string,
): Promise<boolean> {
  return !!(await Customer.findOne({ where: { email: email } }))?.testPassword(
    password,
  );
}

//might need to disable instead of delete customer later when coding Order onwards
export async function deleteCustomer(customerId: number) {
  let result = await Customer.destroy({
    where: { customerId: customerId },
  });
  if (result) {
    return result;
  }
  throw { message: "Customer not found!" };
}

//update customer
//update password not included here
//further improvement: can try using customer id to update instead of email
export async function updateCustomer(
  customerId: number,
  firstName: string,
  lastName: string,
  email: string,
  contactNo: string,
  birthday: Date,
  nationality: Country,
) {
  let updatedCustomer = {
    customerId: customerId,
    firstName: firstName,
    lastName: lastName,
    email: email,
    contactNo: contactNo,
    birthday: birthday,
    nationality: nationality,
  } as any;

  console.log(updatedCustomer);

  try {
    return await Customer.update(updatedCustomer, {
      where: { customerId: customerId },
    });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function updatePassword(
  customerId: number,
  oldPassword: string,
  newPassword: string,
) {
  let customer = await Customer.findOne({
    where: { customerId: customerId },
  });
  if (!customer) {
    throw { message: "No customer found" };
  }

  if (hash(oldPassword + customer.salt) !== customer.passwordHash) {
    throw { message: "Old password is incorrect" };
  }

  //generate new salt for added security
  const newSalt = (Math.random() + 1).toString(36).substring(7);

  let updatedCustomer = {
    customerId: customerId,
    salt: newSalt,
    passwordHash: hash(newPassword + newSalt),
  } as any;

  try {
    await Customer.update(updatedCustomer, {
      where: { customerId: customerId }, //might have error here
    });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAllCustomers(includes: any) {
  try {
    const allCustomers = await Customer.findAll({ include: includes });
    return allCustomers;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function resetPassword(token: string, password: string) {
  let realToken = await Token.findOne({
    where: { token: token },
  });
  console.log(realToken);

  if (realToken) {
    let customer = await Customer.findOne({
      where: { email: realToken.email },
    });
    console.log("customer", customer);

    if (customer) {
      if (realToken.expiresAt.getTime() > Date.now()) {
        realToken.destroy();
        console.log("customer update");
        return customer.updatePasswordWithToken(password);
      }
      realToken.destroy();
      throw { message: "Token has expired" };
    }

    realToken.destroy();
    throw { message: "Customer does not exist" };
  }
  throw { message: "Invalid Token!" };
}

export async function sendResetPasswordLink(customerId: number) {
  let result = await Customer.findOne({
    where: { customerId: customerId },
  });

  if (result) {
    const token = uuidv4();

    const resetTokens: any = {
      token: token,
      email: result.email,
      createdAt: Date.now(),
      expiresAt: Date.now() + 600000, //expires in 10 minutes
    };

    try {
      await Token.create(resetTokens);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: result.email,
        subject: "Reset Password",
        text: "Click the link below to reset your password: ",
        html: `<a href="http://${process.env.LOCALHOST_ADDRESS}:5174/resetPasswordNew/${token}">Reset Password</a>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
    } catch (error: any) {
      throw validationErrorHandler(error);
    }
  } else {
    throw { message: "Customer does not exist" };
  }
}

export async function deleteCustomerByEmail(customerEmail: string) {
  let result = await Customer.destroy({
    where: { email: customerEmail },
  });
  if (result) {
    return result;
  }
  throw { message: "Invalid Customer Email!" };
}

export async function createCustomerOrderForGuest(
  listings: any,
  customerOrder: any,
) {
  try {
    return await conn.transaction(async (t: any) => {
      let sum = 0;
      let custOrder = await CustomerOrder.create(customerOrder, {
        transaction: t,
      });

      for (const listing of listings) {
        let queriedListing = await Listing.findOne({
          where: { listingId: listing.listingId },
          transaction: t,
        });
        console.log("does it go here again?");

        if (queriedListing) {
          if (listing.orderItems) {
            sum += listing.orderItems.length;
          }
          for (const orderItem of listing.orderItems) {
            console.log("hmmmmmm");
            console.log(orderItem);
            console.log(queriedListing);
            console.log(listing);
            try {
              let newOrderItem = await OrderItem.create(orderItem, {
                transaction: t,
              });
              console.log(newOrderItem.toJSON());

              console.log("is it okay here?");
              queriedListing.addOrderItem(newOrderItem);
              console.log("here");
              newOrderItem.setListing(queriedListing);
              console.log("yes here");
              custOrder.addOrderItem(newOrderItem);
              console.log("hereeeeee");
              newOrderItem.setCustomerOrder(custOrder);
              console.log("hmm??");
            } catch (error: any) {
              console.log("yes");
              console.log(error);
              throw error;
            }
          }
        } else {
          throw { message: "Invalid listing" };
        }
      }

      sum =
        (await OrderItem.count({
          where: {
            "$customerOrder.entryDate$": custOrder.entryDate, // Assumes the Order model has a createdAt field
            "$customerOrder.paymentStatus$": PaymentStatus.COMPLETED,
          },
          transaction: t,
          include: [
            {
              model: CustomerOrder,
              attributes: [],
            },
          ],
        })) + sum;

      console.log("sum is " + sum);

      if (sum > 25) {
        throw { message: "Ticket is already sold out on that date" };
      }

      return custOrder;
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createCustomerOrderForSeeding(
  listings: Listing[],
  custOrder: CustomerOrder,
) {
  try {
    for (const listing of listings) {
      let queriedListing = await Listing.findOne({
        where: { listingId: listing.listingId },
      });

      if (queriedListing !== null && queriedListing !== undefined) {
        let newOrderItem = await OrderItem.create({
          isRedeemed: 0,
          verificationCode: uuidv4(),
          timeRedeemed: null,
        });

        queriedListing.addOrderItem(newOrderItem);
        newOrderItem.setListing(queriedListing);
        custOrder.addOrderItem(newOrderItem);
        newOrderItem.setCustomerOrder(custOrder);
      }
    }
  } catch (error: any) {
    console.log("yes");
    console.log(error);
    throw error;
  }
}

export async function createCustomerOrderForCustomer(
  customerId: number,
  listings: any,
  customerOrder: any,
) {
  try {
    return await conn.transaction(async (t: any) => {
      let sum = 0;
      let result = await Customer.findOne({
        where: { customerId: customerId },
      });

      if (result) {
        let custOrder = await CustomerOrder.create(customerOrder, {
          transaction: t,
        });

        for (const listing of listings) {
          let queriedListing = await Listing.findOne({
            where: { listingId: listing.listingId },
            transaction: t,
          });

          if (queriedListing) {
            if (listing.orderItems) {
              sum += listing.orderItems.length;
            }

            for (const orderItem of listing.orderItems) {
              try {
                let newOrderItem = await OrderItem.create(orderItem, {
                  transaction: t,
                });

                queriedListing.addOrderItem(newOrderItem);
                newOrderItem.setListing(queriedListing);
                custOrder.addOrderItem(newOrderItem);
                newOrderItem.setCustomerOrder(custOrder);
              } catch (error: any) {
                console.log(error);
                throw error;
              }
            }
          } else {
            throw { message: "Invalid listing" };
          }
        }

        sum =
          (await OrderItem.count({
            where: {
              "$customerOrder.entryDate$": custOrder.entryDate, // Assumes the Order model has a createdAt field
              "$customerOrder.paymentStatus$": PaymentStatus.COMPLETED, //need to make sure the orderItem is already paid for
            },
            transaction: t,
            include: [
              {
                model: CustomerOrder,
                attributes: [],
              },
            ],
          })) + sum;

        console.log("sum is " + sum);

        if (sum > 25) {
          throw { message: "Ticket is already sold out on that date" };
        }

        result.addCustomerOrder(custOrder);
        custOrder.setCustomer(result);
        return custOrder;
      } else {
        throw { message: "Invalid customer Id" };
      }
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function generateQRCode(verificationCode: string): Promise<void> {
  return new Promise((resolve, reject) => {
    QRCode.toFile(
      `img/qr-code/${verificationCode}.png`,
      `${verificationCode}`,
      {
        errorCorrectionLevel: "H",
        type: "png",
        margin: 2,
      },
      (err) => {
        if (err) {
          reject(err);
        } else {
          console.log("QR code created!");
          resolve();
        }
      },
    );
  });
}

async function generatePDF(custOrder: CustomerOrder) {
  const doc = new PDFDocument();
  const name: string = "ZooVannaTicket-" + custOrder.bookingReference + ".pdf";

  doc.pipe(fs.createWriteStream(`pdf/${name}`));
  const orderItems = custOrder.orderItems;

  if (orderItems) {
    for (const orderItem of orderItems) {
      await generateQRCode(orderItem.verificationCode);

      doc.image("img/logos/black-elephant-only.png", 25, 30, {
        fit: [80, 50],
      });

      console.log("after elephant");

      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor("black")
        .text("ZooVanna", 25, 100);
      doc
        .fontSize(12)
        .text(
          `Customer: ${custOrder.customerFirstName} ${custOrder.customerLastName}`,
          320,
          100,
        );
      doc.fontSize(12).text(`Order #: ${custOrder.bookingReference}`, 320, 115);
      doc.fontSize(12).text("Admission Ticket", 25, 115);

      doc
        .fontSize(12)
        .text(`VALID ON ${new Date(custOrder.entryDate).toDateString()}`);
      doc.moveDown();

      doc
        .fontSize(12)
        .text("Valid on the specifed date above. VALID FOR ONE GUEST ONLY");

      doc.rect(25, 180, 560, 115).fillColor("darkgreen").fill();
      doc
        .fontSize(14)
        .fillColor("white")
        .text("THIS IS YOUR E-TICKET.", 230, 195);
      doc.moveDown();

      let scan = 0;

      (await orderItem.getListing()).listingType == "FOREIGNER"
        ? (scan = 250)
        : (scan = 265);

      doc.text(
        `${(await orderItem.getListing()).listingType} ${
          (await orderItem.getListing()).name
        }`,
        scan,
      );

      doc.moveDown();

      doc
        .fontSize(10)
        .text("PLEASE APPROACH THE STAFF TO SCAN THE QR CODE.", 165);

      doc
        .fontSize(10)
        .text(
          "THE TICKET IS NON-TRANSFERABLE, NON-REFUNDABLE AND VOID IF ALTERED",
          105,
        );

      console.log("before qr code");

      //add image here
      doc.image(`img/qr-code/${orderItem.verificationCode}.png`, 260, 307.5, {
        fit: [100, 200],
        align: "center",
      });
      console.log("after qr code");

      doc
        .font("Helvetica")
        .fillColor("black")
        .text("HOW TO USE THIS E-TICKET:", 25, 420);
      doc.moveDown();

      doc
        .font("Helvetica-Bold")
        .text("1. SCAN THIS ORIGINAL E-TICKET AT THE ZOOVANNA ENTRANCE");
      doc
        .text("2. PHOTO ID VERIFICATION")
        .font("Helvetica")
        .text("- May be required for verification.", 158, 454.5);
      doc
        .font("Helvetica-Bold")
        .text(
          "3. BAG CHECK WILL BE CONDUCTED ON ALL PERSONAL AND/OR HAND CARRY BAGGAGE FOR SAFETY",
          25,
        )
        .text("& SECURITY PURPOSES.", 35);
      doc.text(
        "4. THIS TICKET IS ONLY APPLICABLE DURING REGULAR OPERATING HOURS ",
        25,
      );

      doc.text(
        "____________________________________________________________________________________________",
      );

      doc.moveDown();

      doc.font("Helvetica").text("TERMS AND CONDITIONS:");
      doc.moveDown();
      doc
        .fontSize(9)
        .font("Helvetica-Bold")
        .text(
          "VALID FOR ONE (1) GUEST ONLY • TICKETS UTILISED ARE NON-TRANSFERABLE • NOT FOR SALE OR EXCHANGE • NO REVALIDATION, NON-CANCELLABLE, NON-REFUNDABLE, EVEN IN CASES OF INCLEMENT WEATHER • VOID IF ALTERED • STRICTLY NO OUTSIDE FOOD OR BEVERAGES PERMITTED • HAND STAMP AND TICKET REQUIRED FOR SAME DAY RE-ENTRY • NOT VALID DURING SPECIAL EVENTS • NOT TO BE USED FOR PROMOTIONAL PURPOSES UNLESS APPROVED IN WRITING BY ZOOVANNA • NOT INCLUSIVE OF ALL SEPARATE TICKETED EXPERIENCE DURING THE EVENT • NO COSTUMES, FULL FACE MAKE UP OR FULL FACE MASKS ALLOWED AT THIS EVENT • EVENT OPERATING HOURS ARE SUBJECT TO CHANGE WITHOUT PRIOR NOTICE, GUEST MAY VISIT ZOOVANNA WEBSITE FOR UPDATES PRIOR TO VISIT • ONLY PROGRAMMES AND/OR SERVICES AUTHORIZED BY ZOOVANNA ARE PERMITTED IN ZOOVANNA • ZOOVANNA RESERVES THE RIGHT TO VARY OR AMEND ANY TERMS AND CONDITIONS WITHOUT PRIOR NOTICE",
        );

      doc.moveDown();
      doc
        .fontSize(8)
        .text(
          "Any resale of tickets/vouchers is strictly prohibited unless authorized in writing by ZOOVANNA. ZOOVANNA reserves the right to invalidate tickets/vouchers in connection with any fraudulent/unauthorized resale transaction, without refund or other compensation. Tickets/Vouchers allow for a one (1) - time use only. If it is determined by ZOOVANNA that there are multiple copies/usages of the ticket, usage of the ticket will be denied. In the event of any dispute, a final decision shall be made based on our electronic record.",
        );

      if (orderItem != orderItems[orderItems.length - 1]) {
        doc.addPage();
      }
    }
    // end and display the document in the iframe to the right
    doc.end();
  }
}

export async function completePaymentForCustomer(
  customerOrderId: number,
  payment: any,
) {
  try {
    let result = await CustomerOrder.findOne({
      where: { customerOrderId: customerOrderId },
      include: ["orderItems"],
    });

    if (result && (await result.getPayments()).length === 0) {
      let pay = await Payment.create(payment);
      pay.setCustomerOrder(result);
      result.addPayment(pay);
      result.setCompleted();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      let orderItems = result?.orderItems;
      let totalAmount = 0;

      if (orderItems) {
        for (const orderItem of orderItems) {
          totalAmount += Number((await orderItem.getListing()).price);
          console.log((await orderItem.getListing()).listingId);
        }
      }

      console.log(totalAmount);

      const generateHTMLContent = async () => {
        try {
          let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Zoo Admission Tickets</title>
                <style>
                    html {
                      background-color: gray;
                    }
                    body {
                        font-family: Arial, sans-serif;
                        min-width: fit-content;
                        margin: 0 auto;
                        
                    }
                    .ticket {
                        border: 1px solid #000;
                        padding: 10px;
                        margin: 10px;
                        width: 300px;
                        text-align: center;
                        justify-content:center;
                    }
                    .ticket h2 {
                        margin: 0;
                        font-size: 18px;
                    }
                    .ticket p {
                        margin: 5px 0;
                    }
                    .booking-reference {
                      justify-content: space-between;
                      display: flex;
                      margin-top: 4px;
                      min-width: 100px;
                  }
                </style>
            </head>
            <body>
        `;

          html += `
          <div>
              <div style="display:flex; justify-content:center; padding:5px; margin:0 auto">
                  <table style="border: 0px; border-collapse: collapse; width:800px;">
                  <tr>
                    <td>Booking Reference</td>
                    <td style="text-align:right">${result?.bookingReference}</td>
                  </tr>
                  <tr>
                    <td>Activity date</td>
                    <td style="text-align:right">${new Date(
                      result ? result.entryDate : "",
                    ).toDateString()}</td>
                  </tr>
                  <tr>
                    <td>Payment type</td>
                    <td style="text-align:right">${pay.paymentType}</td>
                  </tr>
                  <tr>
                    <td>Order total</td>
                    <td style="text-align:right">SGD ${totalAmount}</td>
                  </tr>
                  <tr>
                    <td>Discount</td>
                    <td style="text-align:right">${
                      result
                        ? "SGD " +
                          (Number(totalAmount) - Number(result.totalAmount))
                        : "SGD " + totalAmount
                    }</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold">Total amount</td>
                    <td style="text-align:right; font-weight:bold ">SGD ${result?.totalAmount}</td>
                  </tr>
                </table>
              </div>  
              <hr style="border-top: 3px solid #bbb; width:800px margin-top:2px"/>
        </div>
       
        `;

          {
            /*if (orderItems) {
            // Generate a ticket section for each ticket in the data
            for (const orderItem of orderItems) {
              const listing: Listing = await orderItem.getListing();
              html += `
            <div style="width:800px; display:flex; justify-content:center">
                <div class="ticket">
                    <h2>Ticket</h2>
                    <p><strong>Ticket Verification Code: </strong>${orderItem.verificationCode}</p>
                    <p><strong>Ticket Price:</strong> $${listing.price}</p>
                    <p><strong>Ticket Type: </strong> ${listing.listingType} ${listing.name}</p>
                </div>
            </div>
            `;
            }
          }*/
          }

          const localhost_address = process.env.LOCALHOST_ADDRESS;

          html += `
            <a href="http://${localhost_address}:5174/tickets/purchasedTickets" target="_blank" style="display:flex">
              <button style="border:none; border-radius: 2px; background-color:#3FD136; cursor: pointer; width: 800px; height:30px; font-size:15px; text-decoration: none">
                View Bookings
              </button>
            </a>
            

            <script>
              function myFunction() {
                window.open('http://${localhost_address}:5174/tickets/purchasedTickets', '_blank');
              }
            </script>
          `;

          // Close the HTML document
          html += `
            </body>
            </html>
        `;

          return html;
        } catch (error: any) {
          throw { message: "Error " + error };
        }
      };

      await generatePDF(result);
      console.log("before attachment");

      const name: string = "ZooVannaTicket-" + result.bookingReference + ".pdf";

      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: result.customerEmail,
        subject: "Ticket Purchase Order",
        text: "Here is your customer order",
        html: await generateHTMLContent(),
        attachments: [
          {
            fileName: name,
            path: `pdf/${name}`,
          },
        ],
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
      result.setPdfUrl(name);
      return pay;
    } else {
      throw { message: "Customer Order Id does not exist" };
    }
  } catch (error: any) {
    throw { message: "Payment Completion Unsuccessful: " + error };
  }
}

export async function completePaymentForGuest(
  customerOrderId: number,
  payment: any,
) {
  try {
    let result = await CustomerOrder.findOne({
      where: { customerOrderId: customerOrderId },
      include: ["orderItems"],
    });

    console.log(result);

    if (result && (await result.getPayments()).length === 0) {
      let pay = await Payment.create(payment);
      pay.setCustomerOrder(result);
      result.addPayment(pay);
      result.setCompleted();

      console.log(pay);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      let orderItems = result?.orderItems;
      let totalAmount = 0;

      if (orderItems) {
        for (const orderItem of orderItems) {
          totalAmount += Number((await orderItem.getListing()).price);
        }
      }

      const generateHTMLContent = async () => {
        try {
          let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Zoo Admission Tickets</title>
                <style>
                    html {
                      background-color: gray;
                    }
                    body {
                        font-family: Arial, sans-serif;
                        min-width: fit-content;
                        justify-content: center;
                        margin: 0 auto;
                        
                    }
                    .ticket {
                        border: 1px solid #000;
                        padding: 10px;
                        margin: 10px;
                        width: 300px;
                        text-align: center;
                        justify-content:center;
                    }
                    .ticket h2 {
                        margin: 0;
                        font-size: 18px;
                    }
                    .ticket p {
                        margin: 5px 0;
                    }
                    .booking-reference {
                      justify-content: space-between;
                      display: flex;
                      margin-top: 4px;
                      min-width: 100px;
                  }
                </style>
            </head>
            <body>
        `;

          html += `
          <div>
              <div style="display:flex; justify-content:center; padding:5px; margin:0 auto">
                  <table style="border: 0px; border-collapse: collapse; width:800px">
                  <tr>
                    <td>Booking Reference</td>
                    <td style="text-align:right; font-weight:bold">${result?.bookingReference}</td>
                  </tr>
                  <tr>
                    <td>Activity date</td>
                    <td style="text-align:right; font-weight:bold">${new Date(
                      result ? result.entryDate : "",
                    ).toDateString()}</td>
                  </tr>
                  <tr>
                    <td>Payment type</td>
                    <td style="text-align:right">${pay.paymentType}</td>
                  </tr>
                  <tr>
                    <td>Order total</td>
                    <td style="text-align:right">SGD ${totalAmount}</td>
                  </tr>
                  <tr>
                    <td>Discount</td>
                    <td style="text-align:right">${
                      result
                        ? "SGD " +
                          (Number(totalAmount) - Number(result.totalAmount))
                        : "SGD " + totalAmount
                    }</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold">Total amount</td>
                    <td style="text-align:right; font-weight:bold ">SGD ${result?.totalAmount}</td>
                  </tr>
                </table>
              </div>  
              <hr style="border-top: 3px solid #bbb; width:800px margin-top:2px"/>
        </div>
       
        `;

          // Close the HTML document
          html += `
            </body>
            </html>
        `;

          return html;
        } catch (error: any) {
          throw { message: "Error " + error };
        }
      };

      await generatePDF(result);

      const name: string = "ZooVannaTicket-" + result.bookingReference + ".pdf";

      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: result.customerEmail,
        subject: "Ticket Purchase Order",
        text: "Here is your customer order",
        html: await generateHTMLContent(),
        attachments: [
          {
            fileName: name,
            path: `pdf/${name}`,
          },
        ],
      };

      console.log("here");

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
      result.setPdfUrl(name);
      return pay;
    } else {
      throw { message: "Customer Order Id does not exist" };
    }
  } catch (error: any) {
    throw { message: "Payment Completion Unsuccessful: " + error };
  }
}

export async function purchaseTicket(
  customerId: number,
  listings: any,
  customerOrder: any,
  payment: any,
) {
  try {
    return await conn.transaction(async (t: any) => {
      let result = await Customer.findOne({
        where: { customerId: customerId },
      });

      if (result) {
        let custOrder = await CustomerOrder.create(customerOrder, {
          transaction: t,
        });

        for (const listing of listings) {
          let queriedListing = await Listing.findOne({
            where: { listingId: listing.listingId },
            transaction: t,
          });

          if (queriedListing) {
            for (const orderItem of listing.orderItems) {
              try {
                let newOrderItem = await OrderItem.create(orderItem, {
                  transaction: t,
                });
                queriedListing.addOrderItem(newOrderItem);
                newOrderItem.setListing(queriedListing);
                custOrder.addOrderItem(newOrderItem);
                newOrderItem.setCustomerOrder(custOrder);
              } catch (error: any) {
                console.log(error);
                throw error;
              }
            }
          } else {
            throw { message: "Invalid listing" };
          }
        }
        result.addCustomerOrder(custOrder);
        custOrder.setCustomer(result);

        let pay = await Payment.create(payment, { transaction: t });
        pay.setCustomerOrder(custOrder);
        custOrder.addPayment(pay);
        return custOrder;
      } else {
        throw { message: "Invalid customer Id" };
      }
    });
  } catch (error) {
    console.log(error);
    throw validationErrorHandler(error);
  }
}

export async function verifyToken(token: string) {
  let result = await Token.findOne({
    where: { token: token },
  });

  if (result) {
    if (result.expiresAt.getTime() > Date.now()) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

{
  /*export async function purchaseTicket(
  customerId: number,
  listings: any,
  customerOrder: any,
  payment: any,
) {
  try {
    console.log("is it heree?");
    console.log("hereeee??");
    let result = await Customer.findOne({
      where: { customerId: customerId },
    });
    console.log("customer " + result);

    if (result) {
      let custOrder = await CustomerOrder.create(customerOrder);

      console.log("custOrder " + custOrder);

      for (const listing of listings) {
        let queriedListing = await Listing.findOne({
          where: { listingId: listing.listingId },
        });

        console.log("listing " + queriedListing);

        if (queriedListing) {
          for (const orderItem of listing.orderItems) {
            let newOrderItem = await OrderItem.create(orderItem);
            queriedListing.addOrderItem(newOrderItem);
            newOrderItem.setListing(queriedListing);
            custOrder.addOrderItem(newOrderItem);
            newOrderItem.setCustomerOrder(custOrder);
          }
        } else {
          throw { message: "Invalid listing" };
        }
      }
      result.addCustomerOrder(custOrder);
      console.log("result add");
      custOrder.setCustomer(result);
      console.log("result set customer");

      let pay = await Payment.create(payment);
      pay.setCustomerOrder(custOrder);
      custOrder.addPayment(pay);
      return custOrder;
    } else {
      throw { message: "Invalid customer Id" };
    }
  } catch (error: any) {
    throw { message: "The transaction failed" };
  }
}*/
}
