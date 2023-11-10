import { Request, Response } from "express";
import { CustomerOrder } from "../models/CustomerOrder";
import * as CustomerOrderService from "../services/customerOrderService";

export async function getAllCustomerOrders(req: Request, res: Response) {
  const { includes = "" } = req.body;

  const _includes: string[] = [];
  for (const role of ["customer", "payment", "orderItems", "promotion"]) {
    if (includes.includes(role)) _includes.push(role);
  }

  try {
    const allCustomerOrders =
      await CustomerOrderService.getAllCustomerOrders(_includes);
    return res.status(200).json(allCustomerOrders);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getCustomerOrderByCustomerOrderId(
  req: Request,
  res: Response,
) {
  const { customerOrderId } = req.params;
  const { includes = "" } = req.body;

  const _includes: string[] = [];
  for (const role of ["customer", "payment", "orderItems", "promotion"]) {
    if (includes.includes(role)) _includes.push(role);
  }

  if (customerOrderId == undefined) {
    console.log("Missing field(s): ", {
      customerOrderId,
    });
    return res.status(400).json({ error: "Missing customer order ID!" });
  }

  try {
    const customerOrderIdInt = parseInt(customerOrderId);
    if (!isNaN(customerOrderIdInt)) {
      const customerOrder =
        await CustomerOrderService.getCustomerOrderByCustomerOrderId(
          customerOrderIdInt,
          _includes,
        );
      return res.status(200).json(customerOrder);
    } else {
      return res.status(400).json({ error: "Invalid customer order ID!" });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getCustomerOrderByBookingReference(
  req: Request,
  res: Response,
) {
  const { bookingReference } = req.params;
  const { includes = "" } = req.body;

  const _includes: string[] = [];
  for (const role of ["customer", "payment", "orderItems", "promotion"]) {
    if (includes.includes(role)) _includes.push(role);
  }

  if (bookingReference == undefined) {
    console.log("Missing field(s): ", {
      bookingReference,
    });
    return res.status(400).json({ error: "Missing booking reference!" });
  }

  try {
    const customerOrder =
      await CustomerOrderService.getCustomerOrderByBookingReference(
        bookingReference,
        _includes,
      );
    return res.status(200).json(customerOrder);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllUpcomingCustomerOrderByCustomer(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const results =
      await CustomerOrderService.getAllUpcomingCustomerOrderByCustomer(email);
    return res
      .status(200)
      .json({ result: results.map((x: CustomerOrder) => x.toJSON()) });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getPastCustomerOrderByCustomer(
  req: Request,
  res: Response,
) {
  try {
    const { email } = (req as any).locals.jwtPayload;
    const results =
      await CustomerOrderService.getPastCustomerOrderByCustomer(email);
    return res
      .status(200)
      .json({ result: results.map((x: CustomerOrder) => x.toJSON()) });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
export async function getTotalCustomerOrder(req: Request, res: Response) {
  const { startDate, endDate, groupBy } = req.body;

  if (!startDate || !endDate || !groupBy) {
    console.log("Missing field(s): ", {
      startDate,
      endDate,
      groupBy,
    });
    return res.status(400).json({ error: "Missing required fields!" });
  }

  try {
    const result = await CustomerOrderService.getTotalCustomerOrder(
      startDate,
      endDate,
      groupBy,
    ); // Replace with the actual function
    return res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getRevenueByDay(req: Request, res: Response) {
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    console.log("Missing field(s): ", {
      startDate,
      endDate,
    });
    return res.status(400).json({ error: "Missing required fields!" });
  }

  try {
    const result = await CustomerOrderService.getRevenueByDay(
      startDate,
      endDate,
    ); // Replace with the actual function
    return res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getRevenueByMonth(req: Request, res: Response) {
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    console.log("Missing field(s): ", {
      startDate,
      endDate,
    });
    return res.status(400).json({ error: "Missing required fields!" });
  }

  try {
    const result = await CustomerOrderService.getTotalRevenueByMonth(
      startDate,
      endDate,
    ); // Replace with the actual function
    return res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getNumberOfOrdersPerMonth(req: Request, res: Response) {
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    console.log("Missing field(s): ", {
      startDate,
      endDate,
    });
    return res.status(400).json({ error: "Missing required fields!" });
  }

  try {
    const result = await CustomerOrderService.getNumberOfOrdersPerMonth(
      startDate,
      endDate,
    ); // Replace with the actual function
    return res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getNumberOfOrdersPerDay(req: Request, res: Response) {
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    console.log("Missing field(s): ", {
      startDate,
      endDate,
    });
    return res.status(400).json({ error: "Missing required fields!" });
  }

  try {
    const result = await CustomerOrderService.getNumberOfOrdersPerDay(
      startDate,
      endDate,
    ); // Replace with the actual function
    return res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
