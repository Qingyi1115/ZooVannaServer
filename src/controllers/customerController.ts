import { Request, Response } from "express";
import { createToken } from "../helpers/security";
import * as CustomerService from "../services/customer";

//verify customer email

// export const verifyEmail = async (
//   req: Request,
//   res: Response,
// ) => {
//   try {
//     const { token, password } = req.body;

//     let result = await CustomerService.resetPassword(token, password);
//     return res.status(200).json({ customer: result });
//   } catch (error: any) {
//     return res.status(400).json({ error: error.message });
//   }
// };

export const sendEmailVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    await CustomerService.sendEmailVerification(email);
    console.log("success");
    return res
      .status(200)
      .json({ message: "Email for verification has been sent successfully" });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

//customer sign up
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

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
        token,
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
        token,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    let newCustomer = await CustomerService.createNewCustomer(
      customerPassword,
      firstName,
      lastName,
      contactNo,
      birthday,
      address,
      nationality,
      token,
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
      const customer = await CustomerService.findCustomerByEmail(email);
      const customerId = customer.customerId;
      res.status(200).json({ customerId, email, token });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export async function getCustomerByEmail(req: Request, res: Response) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    console.log("here");
    if (email) {
      const customer = await CustomerService.findCustomerByEmail(email);
      if (!customer)
        return res.status(400).json({ message: "Customer not found!" });
      return res.status(200).json(customer);
    } else {
      return res.status(400).json({ message: "Email not found" });
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function getCustomerByCustomerId(req: Request, res: Response) {
  try {
    const { customerId } = req.params;

    if (customerId == undefined) {
      console.log("Missing field(s): ", {
        customerId,
      });
      return res.status(400).json({ error: "Missing information!" });
    }
    const customerIdInt = parseInt(customerId);
    if (!isNaN(customerIdInt)) {
      let customer =
        await CustomerService.findCustomerByCustomerId(customerIdInt);
      return res.status(200).json({ customer });
    } else {
      return res.status(400).json({ error: "Invalid customer ID!" });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteCustomer(req: Request, res: Response) {
  try {
    const { customerId } = req.params;

    if (customerId == undefined) {
      console.log("Missing field(s): ", {
        customerId,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

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
  const { customerId } = req.params;

  if (customerId == undefined) {
    console.log("Missing field(s): ", {
      customerId,
    });
    return res.status(400).json({ error: "Missing customer ID!" });
  }

  try {
    const customerIdInt = parseInt(customerId);
    if (!isNaN(customerIdInt)) {
      const {
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
        customerIdInt,
        firstName,
        lastName,
        email,
        contactNo,
        birthday,
        address,
        nationality,
      );

      return res.status(200).json({ customer });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

//update customer PASSWORD

export async function updatePassword(req: Request, res: Response) {
  const { customerId } = req.params;

  if (customerId == undefined) {
    console.log("Missing field(s): ", {
      customerId,
    });
    console.log("missing customer id");
    return res.status(400).json({ error: "Missing customer ID!" });
  }

  try {
    const customerIdInt = parseInt(customerId);
    if (!isNaN(customerIdInt)) {
      const { oldPassword, newPassword } = req.body;

      if ([oldPassword, newPassword].includes(undefined)) {
        console.log("Missing field(s): ", {
          oldPassword,
          newPassword,
        });
        console.log("password is empty");
        return res.status(400).json({ error: "Please enter password!" });
      }

      let customer = await CustomerService.updatePassword(
        customerIdInt,
        oldPassword,
        newPassword,
      );
      console.log("update success");
      return res.status(200).json({ customer });
    }
  } catch (error: any) {
    console.log("last error");
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
}

export const resetForgottenPasswordController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { token, password } = req.body;

    let result = await CustomerService.resetPassword(token, password);
    return res.status(200).json({ customer: result });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const sendForgetPasswordLink = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    // console.log("email" + email);
    let customer = await CustomerService.findCustomerByEmail(email);
    // console.log(customer);

    if (!customer) {
      console.log("Customer not found");
      return res.status(400).json({ error: "Cannot find your account" });
    }

    if (customer != null) {
      await CustomerService.sendResetPasswordLink(Number(customer.customerId));
      console.log("success");
      return res
        .status(200)
        .json({ message: "Email for reset password has been sent" });
    }
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

export async function deleteCustomerByEmail(req: Request, res: Response) {
  const { customerCode } = req.params;

  if (customerCode == undefined) {
    console.log("Missing field(s): ", {
      customerCode,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const customer = await CustomerService.deleteCustomerByEmail(customerCode);
    return res.status(200).json(customer);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function createCustomerOrderForCustomerController(
  req: Request,
  res: Response,
) {
  const { email } = (req as any).locals.jwtPayload;
  const { listings, customerOrder } = req.body;

  const customer = await CustomerService.findCustomerByEmail(email);

  try {
    const result = await CustomerService.createCustomerOrderForCustomer(
      customer.customerId,
      listings,
      customerOrder,
    );

    console.log(result);
    return res.status(200).json({ result: result });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function createCustomerOrderForGuestController(
  req: Request,
  res: Response,
) {
  const { listings, customerOrder } = req.body;

  try {
    const result = await CustomerService.createCustomerOrderForGuest(
      listings,
      customerOrder,
    );
    console.log(result);
    return res.status(200).json({ result: result });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function completePaymentForCustomerController(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const { customerOrderId } = req.params;

    if (!customerOrderId) {
      return res.status(400).json({ error: "Missing Customer Order ID!" });
    }

    if (!email) {
      return res.status(400).json({ error: "Customer not logged in!" });
    }

    const { payment } = req.body;
    const result = await CustomerService.completePaymentForCustomer(
      Number(customerOrderId),
      payment,
    );
    return res.status(200).json({ result: result });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function completePaymentForGuestController(
  req: Request,
  res: Response,
) {
  const { customerOrderId } = req.params;

  if (!customerOrderId) {
    return res.status(400).json({ error: "Missing Customer Order ID!" });
  }

  const { payment } = req.body;
  console.log(payment);
  try {
    const result = await CustomerService.completePaymentForGuest(
      Number(customerOrderId),
      payment,
    );
    return res.status(200).json({ result: result });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function purchaseTicketController(req: Request, res: Response) {
  console.log("here");
  const { customerId } = req.params;
  console.log(customerId);
  if (!customerId) {
    console.log("missing customer id");
    return res.status(400).json({ error: "Missing customer ID!" });
  }
  const { listings, customerOrder, payment } = req.body;

  try {
    const result = await CustomerService.purchaseTicket(
      Number(customerId),
      listings,
      customerOrder,
      payment,
    );

    return res.status(200).json({ result: result });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}
