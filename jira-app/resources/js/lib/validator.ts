import * as z from "zod";

export const TicketValidator = z.object({
    title: z.string(),
    description: z.string().max(500).nullable(),
    severity: z.string(),
    due_date: z.date()
});
