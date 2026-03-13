export interface CommissionDto {
    id: number;
    agentId: number;
    activePolicyId: number;
    paymentId: number;
    commissionRate: number;
    commissionAmount: number;
    isPaid: boolean;
    generatedAtUtc: string;
    paidAtUtc?: string;
}
