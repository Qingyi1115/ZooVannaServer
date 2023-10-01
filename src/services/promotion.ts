import { Request } from "express";
import { Op } from "Sequelize";
import { validationErrorHandler } from "../helpers/errorHandler";
import { Promotion } from "../models/promotion";

export async function createNewPromotion(
  description: string,
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
    description: description,
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
  description: string,
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
    description: description,
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