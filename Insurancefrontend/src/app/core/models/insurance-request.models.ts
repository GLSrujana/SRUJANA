export interface CreateInsuranceRequestDto {
    requestedCoverageAmount: number;
    preferredCoverageNotes?: string;
    eventType: string;
    eventDate: string; // ISO date string
    durationInHours: number;
    location: string;
    expectedAttendees: number;
    eventBudget: number;
    isOutdoorVenue: boolean;
    hasFireworks: boolean;
    hasVipPresence: boolean;
    alcoholServed: boolean;
    specialNotes?: string;
    documentType?: string;
    documentData?: string;
}

export interface InsuranceRequestDto {
    requestId: number;
    customerId: number;
    customerName: string;

    assignedAgentId?: number;
    assignedAgentName?: string;
    assignedClaimsOfficerName?: string;

    requestedCoverageAmount: number;
    preferredCoverageNotes?: string;

    eventType?: string;
    eventDate?: string; // ISO date string
    location: string;
    expectedAttendees: number;
    eventBudget: number;
    durationInHours: number;
    isOutdoorVenue: boolean;
    hasFireworks: boolean;
    hasVipPresence: boolean;
    alcoholServed: boolean;
    specialNotes?: string;
    documentType?: string;
    documentData?: string;

    status: number;
    submittedAtUtc: string;
    riskFactors?: string;
    otherRiskFactor?: string;
}
