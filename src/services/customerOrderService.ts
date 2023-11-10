import { Op, Sequelize } from "Sequelize";
import { validationErrorHandler } from "../helpers/errorHandler";
import { CustomerOrder } from "../models/CustomerOrder";
import { Listing } from "../models/Listing";
import { OrderItem } from "../models/OrderItem";

export async function getAllCustomerOrders(includes: string[]) {
  try {
    const allOrders = await CustomerOrder.findAll({ include: includes });
    return allOrders;
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

export async function getRevenueByMonth(startDate: Date, endDate: Date) {
  try {
    const revenueByMonth = await CustomerOrder.findAll({
      attributes: [
        [
          Sequelize.fn("DATE_FORMAT", Sequelize.col("entryDate"), "%Y-%m"),
          "month",
        ],
        [Sequelize.fn("SUM", Sequelize.col("totalAmount")), "totalRevenue"],
      ],
      where: {
        entryDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: ["month"],
    });

    return revenueByMonth;
  } catch (error) {
    // Handle any errors here
    console.error(error);
    throw error;
  }
}
export async function getRevenueByDay(startDate: Date, endDate: Date) {
  try {
    const revenueByDay = await CustomerOrder.findAll({
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("entryDate")), "day"],
        [Sequelize.fn("SUM", Sequelize.col("totalAmount")), "totalRevenue"],
      ],
      where: {
        entryDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: ["day"],
    });

    return revenueByDay;
  } catch (error) {
    // Handle any errors here
    console.error(error);
    throw error;
  }
}

export async function getNumberOfOrdersPerMonth(
  startDate: Date,
  endDate: Date,
) {
  try {
    const orderCountsByMonth = await CustomerOrder.findAll({
      attributes: [
        [
          Sequelize.fn("DATE_FORMAT", Sequelize.col("entryDate"), "%Y-%m"),
          "month",
        ],
        [Sequelize.fn("COUNT", Sequelize.col("customerOrderId")), "orderCount"],
      ],
      where: {
        entryDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: ["month"],
    });

    console.log(orderCountsByMonth);
    return orderCountsByMonth;

    // const transformedData = orderCountsByMonth.reduce((result, order) => {
    //   const month = order.month; // "YYYY-MM" format
    //   const orderCount = order.orderCount;

    //   // Assign the "YYYY-MM" as the key and orderCount as the value in the new object
    //   result[month] = orderCount;

    //   return result;
    // }, {});

    return orderCountsByMonth;
  } catch (error) {
    // Handle any errors here
    console.error(error);
    throw error;
  }
}

export async function getNumberOfOrdersPerDay(startDate: Date, endDate: Date) {
  try {
    const orderCountsByDay = await CustomerOrder.findAll({
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("entryDate")), "day"],
        [Sequelize.fn("COUNT", Sequelize.col("customerOrderId")), "orderCount"],
      ],
      where: {
        entryDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: ["day"],
    });

    return orderCountsByDay;
  } catch (error) {
    // Handle any errors here
    console.error(error);
    throw error;
  }
}

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
    // console.log("---------valid order items-----------");
    // console.log(orderItems);

    if (groupBy.length === 0) {
      return orderItems.length;
    }

    const groupedData = groupData(orderItems, groupBy);
    // console.log("---------group data-----------");
    // console.log(groupedData);

    const subgroupedData = groupByCriteria(orderItems, groupBy);
    // console.log("---------group and subgroup data-----------");
    // console.log(subgroupedData);

    // // Calculate the total order items for each group.
    const result = calculateSizes(subgroupedData, groupBy);
    // console.log("---------aggregate-----------");
    // console.log(result);

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

const compareDates = (a: Date, b: Date): number => {
  if (a < b) return -1;
  if (a > b) return +1;

  return 0; // dates are equal
};

export async function getTotalRevenueByMonth(startDate: Date, endDate: Date) {
  // // const currentDate = new Date();
  // // const lastMonth = new Date(currentDate);
  // // lastMonth.setMonth(currentDate.getMonth() - 1);
  // // lastMonth.setDate(0);
  // // console.log(compareDates(currentDate, lastMonth));

  // // // Create a map to store the total revenue by month
  // // console.log(compareDates(new Date(), new Date()));
  // console.log(startDate);
  // console.log(endDate);
  // const currentDate = new Date(startDate);
  // const ed = new Date(endDate);
  // console.log(compareDates(currentDate, ed));

  const revenueByMonth: Map<Date, number> = new Map();

  const months: Date[] = [];
  let currentDate = new Date(startDate);
  currentDate.setDate(1);
  const ed = new Date(endDate);
  ed.setDate(1);
  // console.log(currentDate);

  while (compareDates(currentDate, ed) <= 0) {
    console.log(compareDates(currentDate, ed));
    const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
    const year = currentDate.getFullYear();
    months.push(new Date(currentDate));
    console.log(currentDate);

    // Move to the next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Initialize the map with 0 for all months
  months.forEach((monthYear) => {
    revenueByMonth.set(monthYear, 0);
  });

  // Query the database for orders and calculate the total revenue for each month
  for (const monthYear of months) {
    const lastDate = new Date(monthYear);
    lastDate.setMonth(lastDate.getMonth() + 1, 1);
    lastDate.setDate(lastDate.getDate() - 1);
    console.log(monthYear);
    console.log(lastDate);
    // Get orders for the current month and year
    const orders = await CustomerOrder.findAll({
      where: {
        entryDate: {
          [Op.between]: [monthYear, lastDate],
        },
      },
    });

    // Calculate the total revenue for the current month
    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0,
    );
    // Store the total revenue in the map
    revenueByMonth.set(monthYear, totalRevenue);
  }

  console.log("----map----");
  console.log(revenueByMonth);

  let result: { [key: string]: number } = {};

  revenueByMonth.forEach((value, key) => {
    const formattedKey = new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "2-digit",
    }).format(key);
    result[formattedKey] = value;
  });

  console.log(result);

  return result;
}

// // Function to calculate the total amount for each listing ID and month
// export async function calculateTotalAmountByListingAndMonth(
//   startDate: Date,
//   endDate: Date,
//   groupBy: string[],
// ) {
//   try {
//     const customerOrders = await CustomerOrder.findAll({
//       include: [
//         {
//           model: OrderItem,
//           required: true,
//           include: [
//             {
//               model: Listing,
//               required: true,
//             },
//           ],
//         },
//       ],
//       where: {
//         entryDate: {
//           [Op.between]: [startDate, endDate],
//         },
//       },
//     });

//     console.log("---------valid customer orders-----------");
//     console.log(customerOrders);

//     return customerOrders;

//     // if (groupBy.length === 0) {
//     // return calculateTotalAmount(customerOrders);
//     // }

//     // const groupedData = groupByCriteria(customerOrders, groupBy);
//     // console.log("---------group and subgroup data-----------");
//     // console.log(groupedData);

//     // // Calculate the total amount for each group.
//     // const result = calculateTotalAmount(groupedData);
//     // console.log("---------aggregate-----------");
//     // console.log(result);

//     // return result;
//   } catch (error) {
//     throw { message: "Error grouping data" };
//   }
// }

// function calculateTotalAmount(data: any): number {
//   if (data.length === undefined) {
//     let totalAmount = 0;

//     for (const key in data) {
//       totalAmount += calculateTotalAmount(data[key]);
//     }

//     return totalAmount;
//   } else {
//     return data.reduce(
//       (total: number, item: any) => total + item.totalAmount,
//       0,
//     );
//   }
// }
//   }
