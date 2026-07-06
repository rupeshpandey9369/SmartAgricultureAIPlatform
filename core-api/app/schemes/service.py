"""
Government schemes recommender for Indian farmers.
Rule-based engine matching farmer profile to eligible schemes.
"""

SCHEMES = [
    {
        "id": "pm_kisan",
        "name": "PM-KISAN",
        "full_name": "Pradhan Mantri Kisan Samman Nidhi",
        "description": "Direct income support of ₹6,000 per year to small and marginal farmers in three equal installments.",
        "benefit": "₹6,000/year direct bank transfer",
        "eligibility": ["small_farmer", "marginal_farmer", "any_farmer"],
        "min_land": 0,
        "max_land": 999,
        "category": "income_support",
        "apply_url": "https://pmkisan.gov.in",
        "documents": ["Aadhaar Card", "Land Records", "Bank Account"],
        "emoji": "💰"
    },
    {
        "id": "pm_fasal_bima",
        "name": "PM Fasal Bima Yojana",
        "full_name": "Pradhan Mantri Fasal Bima Yojana",
        "description": "Crop insurance scheme providing financial support to farmers suffering crop loss due to natural calamities, pests and diseases.",
        "benefit": "Crop insurance coverage at low premium (2% for Kharif, 1.5% for Rabi)",
        "eligibility": ["any_farmer"],
        "min_land": 0,
        "max_land": 999,
        "category": "insurance",
        "apply_url": "https://pmfby.gov.in",
        "documents": ["Aadhaar Card", "Land Records", "Bank Account", "Sowing Certificate"],
        "emoji": "🛡️"
    },
    {
        "id": "kcc",
        "name": "Kisan Credit Card",
        "full_name": "Kisan Credit Card Scheme",
        "description": "Provides farmers with affordable credit for their agricultural needs including crop cultivation, post-harvest expenses and maintenance.",
        "benefit": "Credit up to ₹3 lakh at 4% interest rate",
        "eligibility": ["any_farmer"],
        "min_land": 0,
        "max_land": 999,
        "category": "credit",
        "apply_url": "https://www.nabard.org/content1.aspx?id=572",
        "documents": ["Aadhaar Card", "Land Records", "Passport Photo", "Bank Account"],
        "emoji": "💳"
    },
    {
        "id": "soil_health_card",
        "name": "Soil Health Card Scheme",
        "full_name": "Soil Health Card Scheme",
        "description": "Free soil testing and health cards to help farmers understand soil nutrients and get fertilizer recommendations.",
        "benefit": "Free soil testing + fertilizer recommendations",
        "eligibility": ["any_farmer"],
        "min_land": 0,
        "max_land": 999,
        "category": "soil",
        "apply_url": "https://soilhealth.dac.gov.in",
        "documents": ["Aadhaar Card", "Land Location Details"],
        "emoji": "🌱"
    },
    {
        "id": "pm_krishi_sinchai",
        "name": "PM Krishi Sinchai Yojana",
        "full_name": "Pradhan Mantri Krishi Sinchayee Yojana",
        "description": "Provides subsidies for micro-irrigation systems (drip and sprinkler) to improve water use efficiency.",
        "benefit": "55% subsidy for small farmers, 45% for others on drip/sprinkler systems",
        "eligibility": ["any_farmer"],
        "min_land": 0.5,
        "max_land": 999,
        "category": "irrigation",
        "apply_url": "https://pmksy.gov.in",
        "documents": ["Aadhaar Card", "Land Records", "Bank Account", "Farm Photo"],
        "emoji": "💧"
    },
    {
        "id": "e_nam",
        "name": "e-NAM",
        "full_name": "National Agriculture Market",
        "description": "Online trading platform for agricultural commodities enabling farmers to sell directly to buyers across India for better prices.",
        "benefit": "Access to national market, better price discovery, reduced middlemen",
        "eligibility": ["any_farmer"],
        "min_land": 0,
        "max_land": 999,
        "category": "market",
        "apply_url": "https://enam.gov.in",
        "documents": ["Aadhaar Card", "Bank Account", "Mobile Number"],
        "emoji": "🛒"
    },
    {
        "id": "agri_infra_fund",
        "name": "Agriculture Infrastructure Fund",
        "full_name": "Agriculture Infrastructure Fund",
        "description": "Provides medium-long term debt financing for investment in post-harvest management and community farming assets.",
        "benefit": "Loans up to ₹2 crore with 3% interest subvention",
        "eligibility": ["any_farmer"],
        "min_land": 1,
        "max_land": 999,
        "category": "infrastructure",
        "apply_url": "https://agriinfra.dac.gov.in",
        "documents": ["Aadhaar Card", "Land Records", "Project Report", "Bank Account"],
        "emoji": "🏗️"
    },
    {
        "id": "nfsm",
        "name": "NFSM",
        "full_name": "National Food Security Mission",
        "description": "Provides free seeds, subsidized fertilizers and training to increase production of rice, wheat, pulses and coarse cereals.",
        "benefit": "Free seeds + subsidized inputs + training",
        "eligibility": ["any_farmer"],
        "min_land": 0,
        "max_land": 999,
        "category": "seeds_inputs",
        "apply_url": "https://nfsm.gov.in",
        "documents": ["Aadhaar Card", "Land Records"],
        "emoji": "🌾"
    },
]

CATEGORY_LABELS = {
    "income_support": "Income Support",
    "insurance": "Crop Insurance",
    "credit": "Credit & Loans",
    "soil": "Soil Health",
    "irrigation": "Irrigation",
    "market": "Market Access",
    "infrastructure": "Infrastructure",
    "seeds_inputs": "Seeds & Inputs",
}


def get_schemes(area_acres: float = None, crop: str = None) -> dict:
    """Return all schemes, filtered and sorted by relevance."""
    eligible = []

    for scheme in SCHEMES:
        # Check land eligibility
        if area_acres is not None:
            if area_acres < scheme["min_land"] or area_acres > scheme["max_land"]:
                continue

        eligible.append({
            **scheme,
            "category_label": CATEGORY_LABELS.get(scheme["category"], scheme["category"]),
        })

    return {
        "total": len(eligible),
        "schemes": eligible,
        "note": "Eligibility shown is indicative. Visit the official portal for complete and current eligibility criteria."
    }
