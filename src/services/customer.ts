import { Token } from "../models/token";
import { validationErrorHandler } from "../helpers/errorHandler";
import { hash } from "../helpers/security";
import { Customer } from "../models/customer";
import { Country, OrderStatus, PaymentStatus } from "../models/enumerated";
import * as nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import { OrderItem } from "../models/orderItem";
import { Listing } from "../models/listing";
import { CustomerOrder } from "../models/customerOrder";
import { Payment } from "../models/payment";
const { Sequelize } = require("sequelize");
import { conn } from "../db";
import QRCode from "react-qr-code";

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
        html: `<a href="http://localhost:5174/signup/${token}">Verify Email</a>`,
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
  address: string,
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
        address: address,
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
  let result = await Customer.findOne({
    where: { email: email },
  });
  if (result) {
    return result;
  }
  throw { message: "Invalid email!" };
}

//might have an error for param type, might be CreationOptional<number>
export async function findCustomerByCustomerId(customerId: number) {
  let result = await Customer.findOne({
    where: { customerId: customerId },
  });
  if (result) {
    return result;
  }
  throw { message: "Invalid email!" };
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
  address: string,
  nationality: Country,
) {
  let updatedCustomer = {
    customerId: customerId,
    firstName: firstName,
    lastName: lastName,
    email: email,
    contactNo: contactNo,
    birthday: birthday,
    address: address,
    nationality: nationality,
  } as any;

  console.log(updatedCustomer);

  try {
    let customer = await Customer.update(updatedCustomer, {
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

      return custOrder;
    });
  } catch (error) {
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
          console.log("does it go here again?");

          if (queriedListing) {
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

export async function completePaymentForCustomer(
  customerOrderId: number,
  payment: any,
) {
  try {
    let result = await CustomerOrder.findOne({
      where: { customerOrderId: customerOrderId },
    });

    if (result) {
      let pay = await Payment.create(payment);
      pay.setCustomerOrder(result);
      result.addPayment(pay);
      result.setCompleted();
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

      const generateHTMLContent = async () => {
        let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Zoo Admission Tickets</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                    }
                    .ticket {
                        border: 1px solid #000;
                        padding: 10px;
                        margin: 10px;
                        width: 300px;
                        text-align: center;
                    }
                    .ticket h2 {
                        margin: 0;
                        font-size: 18px;
                    }
                    .ticket p {
                        margin: 5px 0;
                    }
                    .booking-reference {
                      margin-top: 20px;
                      font-weight: bold;
                  }
                </style>
            </head>
            <body>
        `;

        html += `
        <div class="booking-reference">
            <p><strong>Booking Reference:</strong> ${result?.bookingReference}</p>
            
        </div>
        <div>
          <p><strong>Visitor Name:</strong> ${result?.customerFirstName} ${result?.customerLastName}</p>
          <p><strong>Date of Visit:</strong> ${result?.entryDate}</p>
        </div>
    `;

        let orderItems = result?.orderItems;

        if (orderItems) {
          // Generate a ticket section for each ticket in the data
          for (const orderItem of orderItems) {
            const listing: Listing = await orderItem.getListing();
            html += `
                <div class="ticket">
                    <h2>Ticket</h2>
                    <p><strong>Ticket Verification Code: </strong>${orderItem.verificationCode}</p>
                    <p><strong>Ticket Price:</strong> $${listing.price}</p>
                    <p><strong>Ticket Type: </strong> ${listing.listingType}</p>
                </div>
            `;
          }
        }

        html += `
        <div class="total-price">
            <p><strong>Total Price:</strong> $${result?.totalAmount}</p>
        </div>
    `;

        // Close the HTML document
        html += `
            </body>
            </html>
        `;

        return html;
      };

      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: result.customerEmail,
        subject: "Ticket Purchase Order",
        text: "Here is your customer order",
        html: await generateHTMLContent(),
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
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
    await conn.transaction(async (t: any) => {
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
          console.log("does it go here again?");

          if (queriedListing) {
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
    throw error;
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
