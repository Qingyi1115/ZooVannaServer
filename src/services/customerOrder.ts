import { Request } from "express";
import { Op } from "Sequelize";
import { validationErrorHandler } from "../helpers/errorHandler";
import { CustomerOrder } from "../models/customerOrder";


export async function getAllCustomerOrders(includes: string[]) {
  try {
    const allPromo = await CustomerOrder.findAll({ include: includes });
    return allPromo;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getCustomerOrderByCustomerOrderId(
  customerOrderId: number,
  includes: string[],
) {
  let result = await CustomerOrder.findOne({
    where: { customerOrderId: customerOrderId },
    include: includes,
  });
  if (result) {
    return result;
  }
  throw { message: "Invalid Customer Order ID!" };
}

export async function getCustomerOrderByBookingReference(
  bookingReference: string,
  includes: string[],
) {
  let result = await CustomerOrder.findOne({
    where: { bookingReference: bookingReference },
    include: includes,
  });
  if (result) {
    return result;
  }
  throw { message: "Invalid Booking Reference!" };
}

// export async function updateCustomerOrder(
//   customerOrderId: number,
//   title: string,
//   description: string,
//   publishDate: Date,
//   startDate: Date,
//   endDate: Date,
//   percentage: number,
//   minimumSpending: number,
//   customerOrderCode: string,
//   maxRedeemNum: number,
//   imageUrl: string,
//   currentRedeemNum: number,
// ) {
//   let updatedCustomerOrder = {
//     customerOrderId: customerOrderId,
//     title: title,
//     description: description,
//     publishDate: publishDate,
//     startDate: startDate,
//     endDate: endDate,
//     percentage: percentage,
//     minimumSpending: minimumSpending,
//     customerOrderCode: customerOrderCode,
//     maxRedeemNum: maxRedeemNum,
//     imageUrl: imageUrl,
//     currentRedeemNum: currentRedeemNum,
//   } as any;

//   try {
//     let customerOrder = await CustomerOrder.update(updatedCustomerOrder, {
//       where: { customerOrderId: customerOrderId },
//     });
//   } catch (error: any) {
//     throw validationErrorHandler(error);
//   }
// }


