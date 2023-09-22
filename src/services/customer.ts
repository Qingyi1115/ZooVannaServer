import { validationErrorHandler } from "../helpers/errorHandler";
import { hash } from "../helpers/security";
import { Customer } from "../models/customer";
import { Country } from "../models/enumerated";

export async function createNewCustomer(
  customerPassword: string,
  firstName: string,
  lastName: string,
  email: string,
  contactNo: string,
  birthday: Date,
  address: string,
  nationality: Country,
  profileUrl?: string,
) {
  // hash the customer password with random salt
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
    profileUrl: profileUrl,
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
  throw { error: "Invalid email!" };
}

export async function customerLogin(
  email: string,
  password: string,
): Promise<boolean> {
  return !!(await Customer.findOne({ where: { email: email } }))?.testPassword(
    password,
  );
}

export async function deleteCustomerByEmail(customerEmail: string) {
  let result = await Customer.destroy({
      where: { email: customerEmail },
  });
  if (result) {
      return result;
  }
  throw { error: "Invalid Customer Email!" };
}
