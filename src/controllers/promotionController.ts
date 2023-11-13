import { Request, Response } from "express";
import * as PromotionService from "../services/promotionService";
import { handleFileUpload } from "../helpers/multerProcessFile";

export async function createPromotion(req: Request, res: Response) {
  try {
    console.log(req);
    const imageUrl = await handleFileUpload(
      req,
      process.env.IMG_URL_ROOT! + "promotion", //"D:/capstoneUploads/promotion",
    );
    const {
      title,
      description,
      publishDate,
      startDate,
      endDate,
      percentage,
      minimumSpending,
      promotionCode,
      maxRedeemNum,
    } = req.body;

    if (
      [
        title,
        description,
        publishDate,
        startDate,
        endDate,
        percentage,
        minimumSpending,
        promotionCode,
        maxRedeemNum,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        title,
        description,
        publishDate,
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
      title,
      description,
      publishDate,
      startDate,
      endDate,
      percentage,
      minimumSpending,
      promotionCode,
      maxRedeemNum,
      imageUrl,
    );
    // console.log("publishDate: " + publishDate);
    // console.log("startDate: " + startDate);
    // console.log("endDate:" + endDate);

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

export async function getAllPublishedPromotions(req: Request, res: Response) {
  const { includes = "" } = req.body;

  const _includes: string[] = [];
  for (const role of ["customerOrder"]) {
    if (includes.includes(role)) _includes.push(role);
  }

  try {
    const publishedPromotions =
      await PromotionService.getAllPublishedPromotions(_includes);
    return res.status(200).json(publishedPromotions);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllActivePromotions(req: Request, res: Response) {
  const { includes = "" } = req.body;

  const _includes: string[] = [];
  for (const role of ["customerOrder"]) {
    if (includes.includes(role)) _includes.push(role);
  }

  try {
    const activePromotions =
      await PromotionService.getAllActivePromotions(_includes);
    return res.status(200).json(activePromotions);
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
    } else {
      return res.status(400).json({ error: "Invalid promotion ID!" });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deletePromotion(req: Request, res: Response) {
  const { promotionId } = req.params;

  if (promotionId == undefined) {
    console.log("Missing field(s): ", {
      promotionId,
    });
    return res.status(400).json({ error: "Missing promotion ID!" });
  }

  try {
    const promotionIdInt = parseInt(promotionId);
    if (!isNaN(promotionIdInt)) {
      const promotion = await PromotionService.deletePromotion(promotionIdInt);
      return res.status(200).json(promotion);
    } else {
      return res.status(400).json({ error: "Invalid promotion ID!" });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updatePromotion(req: Request, res: Response) {
  try {
    const { promotionId } = req.params;
    let imageUrl;
    if (
      req.headers["content-type"] &&
      req.headers["content-type"].includes("multipart/form-data")
    ) {
      imageUrl = await handleFileUpload(
        req,
        process.env.IMG_URL_ROOT! + "promotion", //"D:/capstoneUploads/promotion",
      );
    } else {
      imageUrl = req.body.imageUrl;
    }
    const {
      title,
      description,
      publishDate,
      startDate,
      endDate,
      percentage,
      minimumSpending,
      promotionCode,
      maxRedeemNum,
      currentRedeemNum,
    } = req.body;

    if (
      [
        title,
        promotionId,
        description,
        publishDate,
        startDate,
        endDate,
        percentage,
        minimumSpending,
        promotionCode,
        maxRedeemNum,
        imageUrl,
        currentRedeemNum,
      ].includes(undefined)
    ) {
      console.log("Missing field(s): ", {
        title,
        promotionId,
        description,
        publishDate,
        startDate,
        endDate,
        percentage,
        minimumSpending,
        promotionCode,
        maxRedeemNum,
        imageUrl,
        currentRedeemNum,
      });
      return res.status(400).json({ error: "Missing information!" });
    }

    const promotionIdInt = parseInt(promotionId);
    if (!isNaN(promotionIdInt)) {
      let promotion = await PromotionService.updatePromotion(
        promotionIdInt,
        title,
        description,
        publishDate,
        startDate,
        endDate,
        percentage,
        minimumSpending,
        promotionCode,
        maxRedeemNum,
        imageUrl,
        currentRedeemNum,
      );

      // console.log("publishDate: " + publishDate);
      // console.log("startDate: " + startDate);
      // console.log("endDate:" + endDate);

      return res.status(200).json({ promotion });
    } else {
      return res.status(400).json({ error: "Invalid promotion ID!" });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function verifyPromotionCode(req: Request, res: Response) {
  const { promotionCode } = req.params;
  const { currentSpending } = req.body;

  if ([promotionCode, currentSpending].includes(undefined)) {
    console.log("Missing field(s): ", {
      promotionCode,
      currentSpending,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const promotion = await PromotionService.verifyPromotionCode(
      promotionCode,
      currentSpending,
    );
    return res.status(200).json(promotion);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

// export async function usePromotionCode(req: Request, res: Response) {
//   const { promotionCode } = req.params;
//   const { currentSpending } = req.body;

//   if (promotionCode == undefined) {
//     console.log("Missing field(s): ", {
//       promotionCode,
//       currentSpending,
//     });
//     return res.status(400).json({ error: "Missing information!" });
//   }

//   try {
//     const isSuccessful = await PromotionService.usePromotionCode(
//       promotionCode,
//       currentSpending,
//     );
//     return res.status(200).json(isSuccessful);
//   } catch (error: any) {
//     res.status(400).json({ error: error.message });
//   }
// }

export async function cancelUsePromotionCode(req: Request, res: Response) {
  const { promotionCode } = req.params;
  const { currentSpending } = req.body;

  if (promotionCode == undefined) {
    console.log("Missing field(s): ", {
      promotionCode,
      currentSpending,
    });
    return res.status(400).json({ error: "Missing information!" });
  }

  try {
    const isSuccessful =
      await PromotionService.cancelUsePromotionCode(promotionCode);
    return res.status(200).json(isSuccessful);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
