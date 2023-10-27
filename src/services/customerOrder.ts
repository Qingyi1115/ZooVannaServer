import { Request } from "express";
import { Op, Sequelize } from "Sequelize";
import { validationErrorHandler } from "../helpers/errorHandler";
import { CustomerOrder } from "../models/customerOrder";
import { Customer } from "../models/customer";
import { OrderItem } from "../models/orderItem";
import { Listing } from "../models/listing";

export async function getAllCustomerOrders(includes: string[]) {
  try {
    const allPromo = await CustomerOrder.findAll({ include: includes });
    return allPromo;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAllUpcomingCustomerOrderByCustomer(
  customerEmail: string,
) {
  try {
    const today = new Date(Date.now());
    today.setHours(0, 0, 0);
    let result = await CustomerOrder.findAll({
      where: { entryDate: { [Op.gte]: today }, customerEmail: customerEmail },
      include: ["orderItems", "payments"],
      order: [["entryDate", "ASC"]],
    });

    for (let i in result) {
      result[i].getOrderItems();
      console.log(result[i]);
    }

    return result;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getPastCustomerOrderByCustomer(customerEmail: string) {
  try {
    const today = new Date(Date.now());
    today.setHours(0, 0, 0);
    let result = await CustomerOrder.findAll({
      where: { entryDate: { [Op.lt]: today }, customerEmail: customerEmail },
      include: ["orderItems", "payments"],
      order: [["entryDate", "ASC"]],
    });

    for (let i in result) {
      result[i].getOrderItems();
      console.log(result[i]);
    }

    return result;
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

// export async function getRevenueByMonth(startDate: Date, endDate: Date) {
//   try {
//     const revenueByMonth = await CustomerOrder.findAll({
//       attributes: [
//         [
//           Sequelize.fn("DATE_FORMAT", Sequelize.col("entryDate"), "%Y-%m"),
//           "month",
//         ],
//         [Sequelize.fn("SUM", Sequelize.col("totalAmount")), "totalRevenue"],
//       ],
//       where: {
//         entryDate: {
//           [Op.between]: [startDate, endDate],
//         },
//       },
//       group: ["month"],
//     });

//     return revenueByMonth;
//   } catch (error) {
//     // Handle any errors here
//     console.error(error);
//     throw error;
//   }
// }
// export async function getRevenueByDay(startDate: Date, endDate: Date) {
//   try {
//     const revenueByDay = await CustomerOrder.findAll({
//       attributes: [
//         [Sequelize.fn("DATE", Sequelize.col("entryDate")), "day"],
//         [Sequelize.fn("SUM", Sequelize.col("totalAmount")), "totalRevenue"],
//       ],
//       where: {
//         entryDate: {
//           [Op.between]: [startDate, endDate],
//         },
//       },
//       group: ["day"],
//     });

//     return revenueByDay;
//   } catch (error) {
//     // Handle any errors here
//     console.error(error);
//     throw error;
//   }
// }

// export async function getNumberOfOrdersPerMonth(
//   startDate: Date,
//   endDate: Date,
// ) {
//   try {
//     const orderCountsByMonth = await CustomerOrder.findAll({
//       attributes: [
//         [
//           Sequelize.fn("DATE_FORMAT", Sequelize.col("entryDate"), "%Y-%m"),
//           "month",
//         ],
//         [Sequelize.fn("COUNT", Sequelize.col("id")), "orderCount"],
//       ],
//       where: {
//         entryDate: {
//           [Op.between]: [startDate, endDate],
//         },
//       },
//       group: ["month"],
//     });

//     return orderCountsByMonth;
//   } catch (error) {
//     // Handle any errors here
//     console.error(error);
//     throw error;
//   }
// }

// export async function getNumberOfOrdersPerDay(startDate: Date, endDate: Date) {
//   try {
//     const orderCountsByDay = await CustomerOrder.findAll({
//       attributes: [
//         [Sequelize.fn("DATE", Sequelize.col("entryDate")), "day"],
//         [Sequelize.fn("COUNT", Sequelize.col("id")), "orderCount"],
//       ],
//       where: {
//         entryDate: {
//           [Op.between]: [startDate, endDate],
//         },
//       },
//       group: ["day"],
//     });

//     return orderCountsByDay;
//   } catch (error) {
//     // Handle any errors here
//     console.error(error);
//     throw error;
//   }
// }

//for chart
export async function getTotalCustomerOrder(
  startDate: Date,
  endDate: Date,
  groupBy: string[],
) {
  try {
    const orderItems = await OrderItem.findAll({
      include: [
        {
          model: Listing,
          required: true, // Include only if there's an associated Listing
        },
        {
          model: CustomerOrder,
          required: true, // Include only if there's an associated CustomerOrder
          where: {
            entryDate: {
              [Op.between]: [startDate, endDate],
            },
          },
        },
      ],
    });
    console.log("---------valid order items-----------");
    console.log(orderItems);

    if (groupBy.length === 0) {
      return orderItems.length;
    }

    const groupedData = groupData(orderItems, groupBy);
    console.log("---------group data-----------");
    console.log(groupedData);

    const subgroupedData = groupByCriteria(orderItems, groupBy);
    console.log("---------group and subgroup data-----------");
    console.log(subgroupedData);

    // // Calculate the total order items for each group.
    const result = calculateSizes(subgroupedData, groupBy);
    console.log("---------aggregate-----------");
    console.log(result);

    return result;
  } catch (error) {
    throw { message: "Error grouping data" };
  }
}

function groupData(orderItems: OrderItem[], groupBy: string[]): any {
  const groupedData: Record<string, any> = {};

  orderItems.forEach((item) => {
    let currentGroup: Record<string, any> = groupedData; // Type assertion

    groupBy.forEach((groupByOption) => {
      const groupValue = getGroupValue(item, groupByOption);

      if (groupValue !== null && groupValue !== undefined) {
        if (!currentGroup[groupByOption]) {
          currentGroup[groupByOption] = {};
        }
        currentGroup = currentGroup[groupByOption];

        if (!currentGroup[groupValue]) {
          currentGroup[groupValue] = [];
        }
        currentGroup = currentGroup[groupValue];
      }
    });

    currentGroup.push(item);
  });

  return groupedData;
}

//perform nested grouping
function groupByCriteria(data: any[], criteria: string[]): any {
  if (criteria.length === 0) {
    return data;
  }

  const currentCriteria = criteria[0];
  const remainingCriteria = criteria.slice(1);

  const grouped = data.reduce((result, item) => {
    const key = getGroupValue(item, currentCriteria);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
    return result;
  }, {});

  for (const key in grouped) {
    grouped[key] = groupByCriteria(grouped[key], remainingCriteria);
  }

  return grouped;
}

function calculateSizes(data: any, groupBy: string[]): any {
  if (groupBy.length === 0) {
    return data.length;
  }

  const currentGroupBy = groupBy[0];
  const remainingGroupBy = groupBy.slice(1);
  const result: any = {};

  for (const key in data) {
    const subgroup = data[key];
    if (remainingGroupBy.length > 0) {
      result[key] = calculateSizes(subgroup, remainingGroupBy);
    } else {
      result[key] = subgroup.length;
    }
  }

  return result;
}

// function to get the value of a grouping option
function getGroupValue(item: OrderItem, groupByOption: string) {
  if (groupByOption === "month" && item.customerOrder != null) {
    return item.customerOrder.entryDate.getMonth();
  } else if (groupByOption === "listingType" && item.listing != null) {
    return item.listing.listingType;
  } else if (groupByOption === "listingId" && item.listing != null) {
    return item.listing.listingId;
  }
  // Add more cases as needed for other groupBy options (e.g., listing name)

  return "-1";
}

// Function to calculate the total amount for each listing ID and month
export async function calculateTotalAmountByListingAndMonth(
  startDate: Date,
  endDate: Date,
  groupBy: string[],
) {
  try {
    const customerOrders = await CustomerOrder.findAll({
      include: [
        {
          model: OrderItem,
          required: true,
          include: [
            {
              model: Listing,
              required: true,
            },
          ],
        },
      ],
      where: {
        entryDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    console.log("---------valid customer orders-----------");
    console.log(customerOrders);

    if (groupBy.length === 0) {
      return calculateTotalAmount(customerOrders);
    }

    const groupedData = groupByCriteria(customerOrders, groupBy);
    console.log("---------group and subgroup data-----------");
    console.log(groupedData);

    // Calculate the total amount for each group.
    const result = calculateTotalAmount(groupedData);
    console.log("---------aggregate-----------");
    console.log(result);

    return result;
  } catch (error) {
    throw { message: "Error grouping data" };
  }
}

function calculateTotalAmount(data: any): number {
  if (data.length === undefined) {
    let totalAmount = 0;

    for (const key in data) {
      totalAmount += calculateTotalAmount(data[key]);
    }

    return totalAmount;
  } else {
    return data.reduce(
      (total: number, item: any) => total + item.totalAmount,
      0,
    );
  }
}
