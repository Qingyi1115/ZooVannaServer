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

export async function getEnrichmentItem() { }
export async function setEnrichmentItem() { }
export async function deleteEnrichmentItem() { }