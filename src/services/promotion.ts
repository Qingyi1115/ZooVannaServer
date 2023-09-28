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
  let newPromotion = {
    description: description,
    startDate: startDate,
    endDate: endDate,
    percentage: percentage,
    minimumSpending: minimumSpending,
    promotionCode: promotionCode,
    maxRedeemNum: maxRedeemNum,
    imageUrl: imageUrl,
  } as any;

  // console.log(newSpecies);

  try {
    return await Promotion.create(newPromotion);
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAllPromotion(includes: string[]) {
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
