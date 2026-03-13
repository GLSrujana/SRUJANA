export interface PolicySuggestionResponseDto {
    id: number;
    insuranceRequestId: number;
    policyProductId: number;
    policyProductName: string;
    eventTypeSupported: string;
    baseRate: number;
    minCoverageAmount: number;
    maxCoverageAmount: number;
    suggestionRemarks?: string;
    premiumMonthly: number;
    premium6Months: number;
    premiumYearly: number;
    suggestedByAgentId: number;
    suggestedAtUtc: string;
}

export interface SelectPolicyDto {
    insuranceRequestId: number;
    policyProductId: number;
    coverageAmount: number;
    paymentOption?: string;
}

export interface PolicyApplicationResponseDto {
    id: number;
    insuranceRequestId: number;
    policyProductId: number;
    coverageAmount: number;
    status: number; // enum (0: Pending, 1: Approved, etc.)
}
