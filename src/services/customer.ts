import { Token } from "../models/token";
import { validationErrorHandler } from "../helpers/errorHandler";
import { hash } from "../helpers/security";
import { Customer } from "../models/customer";
import { Country } from "../models/enumerated";
import * as nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import { OrderItem } from "../models/orderItem";
import { Listing } from "../models/listing";
import { CustomerOrder } from "../models/customerOrder";
import { Payment } from "../models/payment";
const { Sequelize } = require("sequelize");
import { conn } from "../db";

export async function createNewCustomer(
  customerPassword: string,
  firstName: string,
  lastName: string,
  email: string,
  contactNo: string,
  birthday: Date,
  address: string,
  nationality: Country,
) {
  // console.log("Customer service triggered");
  // hash the customer password with random salt
  const randomSalt = (Math.random() + 1).toString(36).substring(7);
  // const birthday = new Date(birthdayJSON);

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
        html: `<a href="http://localhost:5174/resetPasswordNew/${token}">Reset Password</a>`,
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
