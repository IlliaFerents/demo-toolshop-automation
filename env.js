import "dotenv/config";
import { z } from "zod";

export const _envSchema = z
    .object({
        TESTRAIL_HOST: z.string().url().default("https://toolshop.testrail.io"),
        TESTRAIL_USER: z.string().optional(),
        TESTRAIL_PASSWORD: z.string().optional(),
        TESTRAIL_PROJECT_ID: z.string().optional(),
        TESTRAIL_SUITE_ID: z.string().optional(),
        TESTRAIL_RUN_NAME: z.string().default("Demo Toolshop Automation Test Run"),
        BSTACK_USERNAME: z.string().optional(),
        BSTACK_ACCESS_KEY: z.string().optional(),
        SLACK_WEBHOOK_URL: z
            .string()
            .url()
            .optional()
            .or(z.literal(""))
            .transform((val) => (val === "" ? undefined : val)),
        RALLY_SLACK_WEBHOOK_URL: z
            .string()
            .url()
            .optional()
            .or(z.literal(""))
            .transform((val) => (val === "" ? undefined : val)),
        BASE_URL: z.string().url().default("https://practicesoftwaretesting.com/"),
        ENABLE_TESTRAIL_INTEGRATION: z
            .string()
            .regex(/^true|false$/i)
            .transform((s) => /true/i.test(s))
            .default("false")
    })
    .passthrough();

export const env = _envSchema.parse(process.env);
