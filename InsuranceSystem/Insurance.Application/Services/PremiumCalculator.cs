namespace Insurance.Application.Services
{
    /// <summary>
    /// Calculates insurance premiums based on coverage amount, product base rate,
    /// and event-specific risk factors (attendees, duration, outdoor, fireworks, etc.).
    /// 
    /// Formula: Premium = CoverageAmount × BaseRate × RiskMultiplier
    /// 
    /// Where BaseRate is stored as a decimal (e.g., 0.03 = 3%),
    /// and RiskMultiplier is computed from event characteristics.
    /// </summary>
    public static class PremiumCalculator
    {
        /// <summary>
        /// Calculates the premium based on coverage, base rate, and event risk factors.
        /// </summary>
        /// <param name="coverageAmount">The total coverage amount requested</param>
        /// <param name="baseRate">Base rate as a decimal, e.g., 0.03 means 3%</param>
        /// <param name="expectedAttendees">Number of attendees expected at the event</param>
        /// <param name="durationInHours">How long the event runs (hours)</param>
        /// <param name="isOutdoor">Whether the venue is outdoors (higher weather risk)</param>
        /// <param name="hasFireworks">Whether fireworks are planned (high risk)</param>
        /// <param name="hasVipPresence">Whether VIPs will attend (higher liability)</param>
        /// <param name="alcoholServed">Whether alcohol is served (higher liability)</param>
        /// <returns>Calculated premium amount, rounded to 2 decimal places</returns>
        public static decimal Calculate(
            decimal coverageAmount,
            decimal baseRate,
            int expectedAttendees = 100,
            int durationInHours = 4,
            bool isOutdoor = false,
            bool hasFireworks = false,
            bool hasVipPresence = false,
            bool alcoholServed = false)
        {
            // Step 1: Base premium = Coverage × BaseRate
            // BaseRate is stored as a proper decimal: 0.03 = 3%, 0.05 = 5%
            decimal basePremium = coverageAmount * baseRate;

            // Step 2: Compute risk multiplier from event factors
            decimal riskMultiplier = 1.0m;

            // Attendee risk tiers
            if (expectedAttendees > 5000)
                riskMultiplier += 0.30m;      // +30% for mega events
            else if (expectedAttendees > 1000)
                riskMultiplier += 0.20m;      // +20% for large events
            else if (expectedAttendees > 500)
                riskMultiplier += 0.10m;      // +10% for medium events
            // ≤ 500: no extra charge

            // Duration risk
            if (durationInHours > 12)
                riskMultiplier += 0.15m;      // +15% for full-day+ events
            else if (durationInHours > 6)
                riskMultiplier += 0.05m;      // +5% for longer events

            // Venue risk
            if (isOutdoor)
                riskMultiplier += 0.10m;      // +10% outdoor weather risk

            // High-risk add-ons
            if (hasFireworks)
                riskMultiplier += 0.25m;      // +25% fire/explosion risk

            if (hasVipPresence)
                riskMultiplier += 0.10m;      // +10% elevated security liability

            if (alcoholServed)
                riskMultiplier += 0.15m;      // +15% alcohol-related incidents

            // Step 3: Final premium
            decimal premium = basePremium * riskMultiplier;

            // Step 4: Enforce a minimum premium of $50
            premium = Math.Max(premium, 50m);

            return Math.Round(premium, 2);
        }
    }
}
