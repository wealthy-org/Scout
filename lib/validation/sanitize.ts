import { z } from "zod";

const ETH_ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/;

export function validateEthAddress(addr: string): boolean {
  if (typeof addr !== "string") return false;
  return ETH_ADDRESS_REGEX.test(addr);
}

export function sanitizeString(input: string, maxLength?: number): string {
  if (typeof input !== "string") return "";

  const trimmed = input.trim();
  const escaped = trimmed
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");

  if (typeof maxLength === "number" && maxLength > 0) {
    return escaped.slice(0, maxLength);
  }

  return escaped;
}

export const ethAddressSchema = z
  .string()
  .regex(ETH_ADDRESS_REGEX, "Invalid Ethereum address format");

export const dossierItemStrictSchema = z
  .object({
    id: z.string().uuid().optional(),
    kind: z.enum(["pro", "con", "checked", "source"]),
    text: z.string().min(1).max(500),
    position: z.number().int().optional(),
  })
  .strict();

export const dossierItemsArraySchema = z
  .array(dossierItemStrictSchema)
  .max(50, "Maximum 50 items allowed");

export const dossierQuestionStrictSchema = z
  .object({
    id: z.string().uuid().optional(),
    text: z.string().min(1).max(500),
    done: z.boolean().optional(),
    position: z.number().int().optional(),
  })
  .strict();

export const dossierQuestionsArraySchema = z
  .array(dossierQuestionStrictSchema)
  .max(50, "Maximum 50 questions allowed");

export const dossierPutStrictSchema = z
  .object({
    symbol: z.string().max(20).optional(),
    name: z.string().max(100).optional(),
    status: z.enum(["Watching", "Researching", "In position", "Passed"]).optional(),
    reason: z.string().max(4000).optional().nullable(),
    thesis: z.string().max(4000).optional().nullable(),
    notes: z.string().max(20000).optional().nullable(),
    decisionReason: z.string().max(4000).optional().nullable(),
    decision_reason: z.string().max(4000).optional().nullable(),
    items: dossierItemsArraySchema.optional(),
    questions: dossierQuestionsArraySchema.optional(),
  })
  .strict();

export const publishBodyStrictSchema = z
  .object({
    handle: z
      .string()
      .regex(/^[a-zA-Z0-9_]{1,30}$/, "Invalid handle format")
      .optional(),
    include_notes: z.boolean().optional(),
  })
  .strict();

export const importLibraryItemStrictSchema = z
  .object({
    chainId: z.number().int().optional(),
    chain_id: z.number().int().optional(),
    contractAddress: ethAddressSchema.optional(),
    contract_address: ethAddressSchema.optional(),
    symbol: z.string().max(20).optional(),
    name: z.string().max(100).optional(),
    status: z.enum(["Watching", "Researching", "In position", "Passed"]).optional(),
    reason: z.string().max(4000).optional().nullable(),
    thesis: z.string().max(4000).optional().nullable(),
    notes: z.string().max(20000).optional().nullable(),
    decisionReason: z.string().max(4000).optional().nullable(),
    decision_reason: z.string().max(4000).optional().nullable(),
    items: dossierItemsArraySchema.optional(),
    questions: dossierQuestionsArraySchema.optional(),
    originAuthor: z.string().max(100).optional().nullable(),
    origin_author: z.string().max(100).optional().nullable(),
  })
  .strict();

export const importLibraryStrictSchema = z
  .object({
    version: z.number().int().optional(),
    exportedAt: z.string().optional(),
    exported_at: z.string().optional(),
    dossiers: z.array(importLibraryItemStrictSchema).max(1000),
  })
  .strict();
