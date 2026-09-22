export type Ticket = {
    id: number;
    title: string;
    description: string | null;
    severity: "low" | "medium" | "high";
    status: string;
    due_date: string;
    created_at: string;
    updated_at: string;
};
