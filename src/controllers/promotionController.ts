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

export async function getAllPromotions(req: Request, res: Response) {
  const { includes = "" } = req.body;

  const _includes: string[] = [];
  for (const role of ["customerOrder"]) {
    if (includes.includes(role)) _includes.push(role);
  }

  try {
    const allPromotions = await PromotionService.getAllPromotions(_includes);
    return res.status(200).json(allPromotions);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getPromotionByPromotionId(req: Request, res: Response) {
  const { promotionId } = req.params;
  const { includes = "" } = req.body;

  const _includes: string[] = [];
  for (const role of ["customerOrder"]) {
    if (includes.includes(role)) _includes.push(role);
  }

  if (promotionId == undefined) {
    console.log("Missing field(s): ", {
      promotionId,
    });
    return res.status(400).json({ error: "Missing promotion id!" });
  }

  try {
    const promotionIdInt = parseInt(promotionId);
    if (!isNaN(promotionIdInt)) {
      const promotion = await PromotionService.getPromotionByPromotionId(
        promotionIdInt,
        _includes,
      );
      return res.status(200).json(promotion);
      return res.status(400).json({ error: "Invalid promotion ID!" });
    } else {
      return res.status(400).json({ error: "Invalid customer ID!" });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
