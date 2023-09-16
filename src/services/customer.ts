import { Country } from "models/enumerated";
import { validationErrorHandler } from "../helpers/errorHandler";
import { hash } from "../helpers/security";
import { Customer } from "../models/customer";

export async function createNewCustomer(
  customerUsername: string,
  customerFirstName: string,
  customerLastName: string,
  customerEmail: string,
  customerContactNo: string,
  customerBirthday: Date,
  customerAddress: string,
  customerNationality: Country
) {
  const randomPassword =
    (Math.random() + 1).toString(36).substring(7) +
    (Math.random() + 1).toString(36).substring(7);
  const randomSalt = (Math.random() + 1).toString(36).substring(7);

  const customer_details: any = {
    customerUsername: customerUsername,
    customerFirstName: customerFirstName,
    customerLastName: customerLastName,
    customerEmail: customerEmail,
    customerContactNo: customerContactNo,
    customerBirthday: customerBirthday,
    customerAddress: customerAddress,
    customerNationality: customerNationality,
    customerPasswordHash: hash(randomPassword + randomSalt),
    customerSalt: randomSalt,
  };
  try {
    let newCustomer = await Customer.create(customer_details);
    return [randomPassword, newCustomer.toJSON()];
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function findCustomerByEmail(customerEmail: string) {
  let result = await Customer.findOne({
    where: { customerEmail: customerEmail },
  });
  if (result) {
    return result;
  }
  throw { error: "Invalid email!" };
}

export async function customerLogin(
  customerEmail: string,
  password: string,
): Promise<boolean> {
  return !!(
    await Customer.findOne({ where: { customerEmail: customerEmail } })
  )?.testPassword(password);
}

export async function customerLoginWithUsername(
  customerUsername: string,
  password: string,
): Promise<boolean> {
  return !!(
    await Customer.findOne({ where: { customerUsername: customerUsername } })
  )?.testPassword(password);
}