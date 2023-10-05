import { Request } from "express";
import { Op } from "Sequelize";
import { validationErrorHandler } from "../helpers/errorHandler";
import { Promotion } from "../models/promotion";

export async function createNewPromotion(
  title: string,
  description: string,
  publishDate: Date,
  startDate: Date,
  endDate: Date,
  percentage: number,
  minimumSpending: number,
  promotionCode: string,
  maxRedeemNum: number,
  imageUrl: string,
) {
  const currentRedeemNum = 0;
  let newPromotion = {
    title: title,
    description: description,
    publishDate: publishDate,
    startDate: startDate,
    endDate: endDate,
    percentage: percentage,
    minimumSpending: minimumSpending,
    promotionCode: promotionCode,
    maxRedeemNum: maxRedeemNum,
    imageUrl: imageUrl,
    currentRedeemNum: currentRedeemNum,
  } as any;

  try {
    return await Promotion.create(newPromotion);
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAllPromotions(includes: string[]) {
  try {
    const allPromo = await Promotion.findAll({ include: includes });
    return allPromo;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getPromotionByPromotionId(
  promotionId: number,
  includes: string[],
) {
  let result = await Promotion.findOne({
    where: { promotionId: promotionId },
    include: includes,
  });
  if (result) {
    return result;
  }
  throw { message: "Invalid promotion ID!" };
}

export async function deletePromotion(promotionId: number) {
  let result = await Promotion.destroy({
    where: { promotionId: promotionId },
  });
  if (result) {
    return result;
  }
  throw new Error("Invalid Promotion ID!");
}

export async function updatePromotion(
  promotionId: number,
  title: string,
  description: string,
  publishDate: Date,
  startDate: Date,
  endDate: Date,
  percentage: number,
  minimumSpending: number,
  promotionCode: string,
  maxRedeemNum: number,
  imageUrl: string,
  currentRedeemNum: number,
) {
  let updatedPromotion = {
    promotionId: promotionId,
    title: title,
    description: description,
    publishDate: publishDate,
    startDate: startDate,
    endDate: endDate,
    percentage: percentage,
    minimumSpending: minimumSpending,
    promotionCode: promotionCode,
    maxRedeemNum: maxRedeemNum,
    imageUrl: imageUrl,
    currentRedeemNum: currentRedeemNum,
  } as any;

  try {
    let promotion = await Promotion.update(updatedPromotion, {
      where: { promotionId: promotionId },
    });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function verifyPromotionCode(
  promotionCode: string,
  currentSpending: number,
) {
  try {
    const promotion = await Promotion.findOne({
      where: { promotionCode: promotionCode },
    });

    const currentDate = new Date(new Date().toUTCString());

    if (!promotion) {
      throw { message: "Invalid promotion code!" };
    }

    if (promotion.startDate > currentDate || promotion.endDate < currentDate) {
      throw { message: "Promotion is not applicable for today!" };
    }

    if (promotion.currentRedeemNum >= promotion.maxRedeemNum) {
      throw { message: "Promotion is fully redeemed!" };
    }

    if (currentSpending < promotion.minimumSpending) {
      throw {
        message: `This promotion is only applicable for a minimum purchase of $${promotion.minimumSpending}`,
      };
    }

    return promotion;
  } catch (error) {
    throw error; // Re-throw the error for higher-level handling
  }
}

export async function usePromotionCode(
  promotionCode: string,
  currentSpending: number,
) {
  const promotion = await verifyPromotionCode(promotionCode, currentSpending);
  if (promotion) {
    // need to link promotion w customer order in the future if the promotion criteria gets more complex
    promotion.incrementCurrentRedeemNum();
  }
  //success
  return true;
}

export async function cancelUsePromotionCode(promotionCode: string) {
  try {
    const promotion = await Promotion.findOne({
      where: { promotionCode: promotionCode },
    });

    if (!promotion) {
      throw { message: "Invalid promotion code!" };
    }

    promotion.decrementCurrentRedeemNum();
    return true;
    
  } catch (error) {
    throw error;
  }
}
