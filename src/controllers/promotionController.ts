import { Request, Response } from "express";
import * as PromotionService from "../services/promotion";
import { handleFileUpload } from "../helpers/multerProcessFile";

export async function createPromotion(req: Request, res: Response) {
  try {
    console.log("in create promotion controller");
    const imageUrl = await handleFileUpload(
      req,
      process.env.IMG_URL_ROOT! + "promotion", //"D:/capstoneUploads/promotion",
    );
    const {
      description,
      startDate,
      endDate,
      percentage,
      minimumSpending,
      promotionCode,
      maxRedeemNum,
    } = req.body;

    if (
      [
        description,
        startDate,
        endDate,
        percentage,
        minimumSpending,
        promotionCode,
        maxRedeemNum,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        description,
        startDate,
        endDate,
        percentage,
        minimumSpending,
        promotionCode,
        maxRedeemNum,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    // have to pass in req for image uploading
    let promotion = await PromotionService.createNewPromotion(
      description,
      startDate,
      endDate,
      percentage,
      minimumSpending,
      promotionCode,
      maxRedeemNum,
      imageUrl,
    );

    return res.status(200).json({ promotion });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
