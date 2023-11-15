import { conn } from "../db";
import { CustomerOrder } from "../models/CustomerOrder";
import { PaymentStatus } from "../models/Enumerated";
import { OrderItem } from "../models/OrderItem";
const Sequelize = require("sequelize");
const { Op } = Sequelize;

export async function getDateOrderCount() {
  try {
    const now = new Date();
    now.setHours(0, 0, 0);
    const oneMonthLater = new Date();
    oneMonthLater.setHours(0, 0, 0);
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

    const result = OrderItem.findAll({
      attributes: [
        [conn.fn("COUNT", conn.col("*")), "count"],
        [conn.col("customerOrder.entryDate"), "entryDate"],
      ],
      include: [
        {
          model: CustomerOrder,
          attributes: [],
        },
      ],
      where: {
        "$customerOrder.entryDate$": {
          [Op.between]: [now, oneMonthLater],
        },
        "$customerOrder.paymentStatus$": PaymentStatus.COMPLETED,
      },
      group: ["customerOrder.entryDate"],
      raw: true,
    }).then((results) => {
      console.log("results are " + results);
      console.log(results == null);
      console.log("here " + results == undefined);
      const dateItemCounts: any = {};

      results.forEach((result: any) => {
        const orderDate = result.entryDate.getTime();
        const itemCount = result.count;
        dateItemCounts[orderDate] = itemCount;
      });
      console.log(dateItemCounts);
      return dateItemCounts;
    });

    return result;
  } catch (error: any) {
    throw { message: error.message };
  }
}

export async function getOrderByVerificationCode(verificationCode: string) {
  try {
    const now = new Date();
    now.setHours(0, 0, 0);

    const result = await OrderItem.findOne({
      where: {
        verificationCode: verificationCode,
      },
      include: ["listing", "customerOrder"],
    });

    result?.addIsRedeemed();

    return result;
  } catch (error: any) {
    throw { message: error.message };
  }
}
