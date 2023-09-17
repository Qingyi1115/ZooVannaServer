import { Request } from "express";
import { validationErrorHandler } from "../helpers/errorHandler";
import { EnrichmentItem } from "../models/enrichmentItem";

export async function createNewEnrichmentItem(
    enrichmentItemName: string,
    enrichmentItemImageUrl: string) {

    let newEnrichmentItem = {
        enrichmentItemName: enrichmentItemName,
        enrichmentItemImageUrl: enrichmentItemImageUrl
    } as any;

    console.log(newEnrichmentItem)

    try {
        return EnrichmentItem.create(newEnrichmentItem)
    } catch (error: any) {
        throw validationErrorHandler(error);
    }
}

export async function getAllEnrichmentItem() { 
    try {
        const allEnrichmentItem = await EnrichmentItem.findAll();
        return allEnrichmentItem;
    } catch (error: any) {
        throw validationErrorHandler(error);
    }
}

export async function getEnrichmentItemByName(enrichmentItemName: string) { 
    let result = await EnrichmentItem.findOne({
        where: { enrichmentItemName: enrichmentItemName },
    });
    if (result) {
        return result;
    }
    throw { error: "Invalid enrichment item name!" };
}

export async function deleteEnrichmentItemByName(enrichmentItemName: string) { 
    let result = await EnrichmentItem.destroy({
        where: { enrichmentItemName: enrichmentItemName },
    });
    if (result) {
        return result;
    }
    throw { error: "Invalid enrichment item name!" };
}

export async function updateEnrichmentItem(
    enrichmentItemName: string,
    enrichmentItemImageUrl: string) {

        let updatedEnrichmentItem = {
            enrichmentItemName: enrichmentItemName,
            enrichmentItemImageUrl: enrichmentItemImageUrl
        } as any;

    console.log(updatedEnrichmentItem)

    try {
        let enrichmentItem = await EnrichmentItem.update(updatedEnrichmentItem, {
            where: { enrichmentItemName: enrichmentItemName },
        });
    } catch (error: any) {
        throw validationErrorHandler(error);
    }
}