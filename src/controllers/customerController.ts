import { Request, Response } from "express";
import { createToken } from "../helpers/security";
import * as CustomerService from "../services/customer";

//customer sign up
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const {
      customerPassword,
      firstName,
      lastName,
      email,
      contactNo,
      birthday,
      address,
      nationality,
    } = req.body;
    if (
      [
        customerPassword,
        firstName,
        lastName,
        email,
        contactNo,
        birthday,
        address,
        nationality,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        customerPassword,
        firstName,
        lastName,
        email,
        contactNo,
        birthday,
        address,
        nationality,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let newCustomer = await CustomerService.createNewCustomer(
      customerPassword,
      firstName,
      lastName,
      email,
      contactNo,
      birthday,
      address,
      nationality,
    );

    return res.status(200).json({ created: newCustomer });
  } catch (error: any) {
    console.log(error.message);
    return res.status(400).json({ error: error.message });
  }
};

//customer login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      if (!(await CustomerService.customerLogin(email, password))) {
        return res.status(403).json({ error: "Invalid credentials!" });
      }
      const token = createToken(email);
      res.status(200).json({ email, token });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export async function getCustomer(req: Request, res: Response) {
  const { customerId } = req.params;

  if (customerId == undefined) {
    console.log("Missing field(s): ", {
      customerId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const customerIdInt = parseInt(customerId);
    if (!isNaN(customerIdInt)) {
      const customer =
        await CustomerService.findCustomerByCustomerId(customerIdInt);
      if (customer) {
        // console.log("Customer valid" + customer);
        return res.status(200).json(customer);
      } else {
        // console.log("Customer invalid" + customer);
        return res
          .status(400)
          .json({ error: `Customer with id ${customerId} not found` });
      }
    } else {
      // console.log("Customer invalid 1");
      return res.status(400).json({ error: "Invalid customer ID!" });
    }
  } catch (error: any) {
    // console.log("Customer invalid 2");
    res.status(400).json({ error: `Customer with id ${customerId} not found` });
  }
}

export async function deleteCustomer(req: Request, res: Response) {
  const { customerId } = req.params;

  if (customerId == undefined) {
    console.log("Missing field(s): ", {
      customerId,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const customerIdInt = parseInt(customerId);
    if (!isNaN(customerIdInt)) {
      await CustomerService.deleteCustomer(customerIdInt);
      return res
        .status(200)
        .json(`Customer ${customerIdInt} has been successfully deleted!`);
    } else {
      return res.status(400).json({ error: "Invalid customer ID!" });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

//update customer
export async function updateCustomer(req: Request, res: Response) {
  try {
    const {
      customerId,
      firstName,
      lastName,
      email,
      contactNo,
      birthday,
      address,
      nationality,
    } = req.body;

    if (
      [
        customerId,
        firstName,
        lastName,
        email,
        contactNo,
        birthday,
        address,
        nationality,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        customerId,
        firstName,
        lastName,
        email,
        contactNo,
        birthday,
        address,
        nationality,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let customer = await CustomerService.updateCustomer(
      customerId,
      firstName,
      lastName,
      email,
      contactNo,
      birthday,
      address,
      nationality,
    );

    return res.status(200).json({ customer });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export const retrieveCustomerAccountDetails = async (
  req: Request,
  res: Response,
) => {};
export const updateCustomerAccount = async (req: Request, res: Response) => {};
export const retrieveAllCustomerDetails = async (
  req: Request,
  res: Response,
) => {};
