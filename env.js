import "dotenv/config";
import { z } from "zod";

export const _envSchema = z
    .object({
        TESTRAIL_HOST: z.string().url().default("https://toolshop.testrail.io"),
        TESTRAIL_USER: z.string().min(1),
        TESTRAIL_PASSWORD: z.string().min(1),
        TESTRAIL_PROJECT_ID: z.string().min(1),
        TESTRAIL_SUITE_ID: z.string().min(1),
        TESTRAIL_RUN_NAME: z.string().default("Demo Toolshop Automation Test Run"),
        BSTACK_USERNAME: z.string().min(1),
        BSTACK_ACCESS_KEY: z.string().min(1),
        SLACK_WEBHOOK_URL: z.string().url(),
        RALLY_SLACK_WEBHOOK_URL: z.string().url(),
        ENABLE_TESTRAIL_INTEGRATION: z
            .string()
            .regex(/^true|false$/i)
            .transform((s) => /true/i.test(s))
            .default("false")
    })
    .passthrough();

export const env = _envSchema.parse(process.env);
