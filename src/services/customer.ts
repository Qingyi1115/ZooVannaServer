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
  throw { error: "Invalid email!" };
}

//might have an error for param type, might be CreationOptional<number>
export async function findCustomerByCustomerId(customerId: number) {
  let result = await Customer.findOne({
    where: { customerId: customerId },
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

export async function deleteCustomer(customerId: number) {
  let result = await Customer.destroy({
    where: { customerId: customerId },
  });
  if (result) {
    return result;
  }
  throw { error: "Customer not found!" };
}

//update customer
//update password not included here
//further improvement: can try using customer id to update instead of email
export async function updateCustomer(
  firstName: string,
  lastName: string,
  email: string,
  contactNo: string,
  birthday: Date,
  address: string,
  nationality: Country,
) {
  let updatedCustomer = {
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
      where: { email: email },
    });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function updatePassword(
  email: string,
  oldPassword: string,
  newPassword: string,
) {
  let customer = await Customer.findOne({
    where: { email: email },
  });
  if (!customer) {
    throw { error: "No customer found" };
  }

  if (hash(oldPassword + customer.salt) !== customer.passwordHash) {
    throw { error: "Old password is incorrect" };
  }

  //generate new salt for added security
  const newSalt = (Math.random() + 1).toString(36).substring(7);
  customer.salt = newSalt;
  customer.passwordHash = hash(newPassword + newSalt);

  try {
    await Customer.update(customer, {
      where: { customerId: customer.customerId }, //might have error here
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
