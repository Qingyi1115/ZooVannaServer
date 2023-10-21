import { Request } from "express";
import { Op } from "Sequelize";
import { validationErrorHandler } from "../helpers/errorHandler";
import { CustomerOrder } from "../models/customerOrder";
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

//for chart
export async function getTotalCustomerOrder(
  startDate: Date,
  endDate: Date,
  groupBy: string[],
) {
  try {
    // console.log(startDate);
    // console.log(endDate);
    // console.log(groupBy);

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
    console.log("---------order items-----------");
    console.log(orderItems);

    // Group the data based on the 'groupBy' options.
    const groupedData = groupData(orderItems, groupBy);
    console.log("---------valid data-----------");
    console.log(groupedData);

    const subgroupedData = groupByCriteria(orderItems, groupBy);
    console.log("---------grouped data-----------");
    console.log(subgroupedData);

    // // Calculate the total order items for each group.
    const result = calculateSubgroupSizes(subgroupedData);
    console.log("---------result-----------");
    console.log(result);

    return result;
  } catch (error) {
    throw { message: "Invalid Booking Reference!" };
  }
}

// // Function to group data based on specified criteria
// function groupData(orderItems: OrderItem[], groupBy: string[]) {
//   return orderItems.reduce((groupedData, item) => {
//     let currentGroup = groupedData;
//     for (const groupByOption of groupBy) {
//       const groupValue = getGroupValue(item, groupByOption);
//       if (!currentGroup[groupByOption]) {
//         currentGroup[groupByOption] = {};
//       }
//       currentGroup = currentGroup[groupByOption];

//       if (!currentGroup[groupValue]) {
//         currentGroup[groupValue] = [];
//       }
//       currentGroup = currentGroup[groupValue];
//     }
//     currentGroup.push(item);
//     return groupedData;
//   }, {});
// }

function groupData(orderItems: OrderItem[], groupBy: string[]): any {
  // Initialize the groupedData as an empty object
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

// Initialize a function to perform nested grouping
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

function calculateSubgroupSizes(data: any): any {
  const result: any = {};

  for (const month in data) {
    result[month] = {};
    const monthData = data[month];

    for (const listingId in monthData) {
      result[month][listingId] = monthData[listingId].length;
    }
  }

  return result;
}
// Helper function to get the value of a grouping option
function getGroupValue(item: OrderItem, groupByOption: string) {
  if (groupByOption === "month" && item.customerOrder != null) {
    // Extract the month from the 'timeRedeemed' field
    return item.customerOrder.entryDate.getMonth();
  } else if (groupByOption === "listingType" && item.listing != null) {
    return item.listing.listingType;
  } else if (groupByOption === "listingId" && item.listing != null) {
    return item.listing.listingId;
  }
  // Add more cases as needed for other groupBy options (e.g., listing name)

  return "-1";
}
