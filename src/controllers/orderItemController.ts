import { Request, Response } from "express";
import { getDateOrderCount } from "../services/orderItem";

export async function getDateOrderCountController(req: Request, res: Response) {
  try {
    const result = await getDateOrderCount();
    console.log("here is " + result);
    return res.status(200).json({ result: result });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}
