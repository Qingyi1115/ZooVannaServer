import { Request, Response } from "express";
import { createToken } from "../helpers/security";
import {
  createNewCustomer,
  findCustomerByEmail,
  customerLogin,
  // customerLoginWithUsername
} from "../services/customer";

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const customer = await findCustomerByEmail(email);

    const {
      customerUsername,
      customerFirstName,
      customerLastName,
      customerEmail,
      customerContactNo,
      customerBirthday,
      customerAddress,
      customerNationality,
    } = req.body;
    if (
      [
        customerUsername,
        customerFirstName,
        customerLastName,
        customerEmail,
        customerContactNo,
        customerBirthday,
        customerAddress,
        customerNationality,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        customerUsername,
        customerFirstName,
        customerLastName,
        customerEmail,
        customerContactNo,
        customerBirthday,
        customerAddress,
        customerNationality,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let generatedOneTimePassword,
      newCustomer = await createNewCustomer(
        customerUsername,
        customerFirstName,
        customerLastName,
        customerEmail,
        customerContactNo,
        customerBirthday,
        customerAddress,
        customerNationality
      );

    return res
      .status(200)
      .json({ password: generatedOneTimePassword, created: newCustomer });
  } catch (error: any) {
    console.log(error.message);
    return res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      if (!(await customerLogin(email, password))) {
        return res.status(403).json({ error: "Invalid credentials!" });
      }
      const token = createToken(email);
      res.status(200).json({ email, token });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// export const loginWithUsername = async (req: Request, res: Response) => {
//   try {
//     const { username, password } = req.body;
//     if (username && password) {
//       if (!(await customerLoginWithUsername(username, password))) {
//         return res.status(403).json({ error: "Invalid credentials!" });
//       }
//       const token = createToken(username);
//       res.status(200).json({ username, token });
//     }
//   } catch (error: any) {
//     res.status(400).json({ error: error.message });
//   }
// };

export const retrieveCustomerAccountDetails = async (
  req: Request,
  res: Response,
) => { };
export const updateCustomerAccount = async (req: Request, res: Response) => { };
export const retrieveAllCustomerDetails = async (
  req: Request,
  res: Response,
) => { };
