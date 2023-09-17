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

export const retrieveCustomerAccountDetails = async (
  req: Request,
  res: Response,
) => {};
export const updateCustomerAccount = async (req: Request, res: Response) => {};
export const retrieveAllCustomerDetails = async (
  req: Request,
  res: Response,
) => {};
