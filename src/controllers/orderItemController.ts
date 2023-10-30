import { Request, Response } from "express";
import {
  getDateOrderCount,
  getOrderByVerificationCode,
} from "../services/orderItem";

export async function getDateOrderCountController(req: Request, res: Response) {
  try {
    const result = await getDateOrderCount();
    return res.status(200).json({ result: result });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function getOrderByVerificationCodeController(
  req: Request,
  res: Response,
) {
  try {
    const verificationCode = req.params;
    console.log(verificationCode.verificationCode);

    const result = await getOrderByVerificationCode(
      verificationCode.verificationCode,
    );

    console.log(result);
    return res.status(200).json({ result: result });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}
