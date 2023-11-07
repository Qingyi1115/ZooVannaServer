import { validationErrorHandler } from "../helpers/errorHandler";
import { EnrichmentItem } from "../models/EnrichmentItem";

export async function createNewEnrichmentItem(
  enrichmentItemName: string,
  enrichmentItemImageUrl: string,
) {
  let newEnrichmentItem = {
    enrichmentItemName: enrichmentItemName,
    enrichmentItemImageUrl: enrichmentItemImageUrl,
  } as any;

  console.log(newEnrichmentItem);

  try {
    return EnrichmentItem.create(newEnrichmentItem);
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getAllEnrichmentItem(includes: string[] = []) {
  try {
    const allEnrichmentItem = await EnrichmentItem.findAll({
      include: includes,
    });
    return allEnrichmentItem;
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function getEnrichmentItemById(enrichmentItemId: number) {
  let result = await EnrichmentItem.findOne({
    where: { enrichmentItemId: enrichmentItemId },
  });
  if (result) {
    return result;
  }
  throw { message: "Invalid enrichment item id!" };
}

export async function deleteEnrichmentItemByName(enrichmentItemName: string) {
  let result = await EnrichmentItem.destroy({
    where: { enrichmentItemName: enrichmentItemName },
  });
  if (result) {
    return result;
  }
  throw { message: "Invalid enrichment item name!" };
}

export async function updateEnrichmentItemImage(
  enrichmentItemId: number,
  enrichmentItemName: string,
  enrichmentItemImageUrl: string,
) {
  let updatedEnrichmentItem = {
    enrichmentItemImageUrl: enrichmentItemImageUrl,
  } as any;

  console.log(updatedEnrichmentItem);

  try {
    let enrichmentItem = await EnrichmentItem.update(updatedEnrichmentItem, {
      where: { enrichmentItemId: enrichmentItemId },
    });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}

export async function updateEnrichmentItem(
  enrichmentItemId: number,
  enrichmentItemName: string,
) {
  let updatedEnrichmentItem = {
    enrichmentItemName: enrichmentItemName,
  } as any;

  console.log(updatedEnrichmentItem);

  try {
    let enrichmentItem = await EnrichmentItem.update(updatedEnrichmentItem, {
      where: { enrichmentItemId: enrichmentItemId },
    });
  } catch (error: any) {
    throw validationErrorHandler(error);
  }
}
