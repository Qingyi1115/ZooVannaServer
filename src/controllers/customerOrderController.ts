import { Request, Response } from "express";
import * as CustomerOrderService from "../services/customerOrder";
import { handleFileUpload } from "../helpers/multerProcessFile";
import { cpuUsage } from "process";

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
