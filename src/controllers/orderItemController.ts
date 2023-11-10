import { Request, Response } from "express";
import * as OrderItemService from "../services/orderItemService";

export async function getDateOrderCount(req: Request, res: Response) {
  try {
    const result = await OrderItemService.getDateOrderCount();
    return res.status(200).json({ result: result });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function getOrderByVerificationCode(
  req: Request,
  res: Response,
) {
  try {
    const verificationCode = req.params;
    console.log(verificationCode.verificationCode);

    const result = await OrderItemService.getOrderByVerificationCode(
      verificationCode.verificationCode,
    );

    console.log(result);
    return res.status(200).json({ result: result });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}
