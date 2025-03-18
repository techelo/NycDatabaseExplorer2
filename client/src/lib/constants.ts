// NYC boroughs
export const BOROUGHS = [
  { id: "manhattan", name: "Manhattan" },
  { id: "bronx", name: "Bronx" },
  { id: "brooklyn", name: "Brooklyn" },
  { id: "queens", name: "Queens" },
  { id: "staten_island", name: "Staten Island" },
];

// NYCDB datasets with metadata
export const DATASETS = [
  {
    id: "dob_violations",
    name: "DOB Violations",
    description: "NYC Department of Buildings violations data",
    icon: "building",
    iconBg: "primary",
    tags: ["buildings", "violations", "safety"],
    lastUpdated: "June 2023",
    recordCount: "12.5M",
    sourceUrl: "https://data.cityofnewyork.us/Housing-Development/DOB-Violations/3h2n-5cm9",
  },
  {
    id: "hpd_complaints",
    name: "HPD Complaints",
    description: "Housing Preservation & Development complaints",
    icon: "home",
    iconBg: "secondary",
    tags: ["housing", "complaints", "tenants"],
    lastUpdated: "July 2023",
    recordCount: "8.7M",
    sourceUrl: "https://data.cityofnewyork.us/Housing-Development/Housing-Maintenance-Code-Complaints/uwyv-629c",
  },
  {
    id: "pluto",
    name: "PLUTO Data",
    description: "Property Land Use Tax Lot Output data",
    icon: "chart-line",
    iconBg: "accent",
    tags: ["property", "land use", "tax lots"],
    lastUpdated: "May 2023",
    recordCount: "1.1M",
    sourceUrl: "https://data.cityofnewyork.us/City-Government/Primary-Land-Use-Tax-Lot-Output-PLUTO-/64uk-42ks",
  },
  {
    id: "dob_complaints",
    name: "DOB Complaints",
    description: "NYC Department of Buildings complaints",
    icon: "exclamation-circle",
    iconBg: "primary",
    tags: ["buildings", "complaints", "safety"],
    lastUpdated: "June 2023",
    recordCount: "3.2M",
    sourceUrl: "https://data.cityofnewyork.us/Housing-Development/DOB-Complaints/eabe-havv",
  },
  {
    id: "hpd_violations",
    name: "HPD Violations",
    description: "Housing Preservation & Development violations",
    icon: "gavel",
    iconBg: "secondary",
    tags: ["housing", "violations", "tenants"],
    lastUpdated: "July 2023",
    recordCount: "6.3M",
    sourceUrl: "https://data.cityofnewyork.us/Housing-Development/Housing-Maintenance-Code-Violations/wvxf-dwi5",
  },
  {
    id: "dof_sales",
    name: "Rolling Sales",
    description: "NYC Department of Finance property sales data",
    icon: "hand-holding-dollar",
    iconBg: "accent",
    tags: ["property", "sales", "finance"],
    lastUpdated: "April 2023",
    recordCount: "2.4M",
    sourceUrl: "https://www.nyc.gov/site/finance/taxes/property-rolling-sales-data.page",
  }
];

// Sample recent insights
export const RECENT_INSIGHTS = [
  {
    id: "hpd_violations_trends",
    title: "HPD Violations Trends in Manhattan",
    description: "Analysis of heating and hot water complaints during winter months shows a 15% increase over the past 3 years.",
    icon: "robot",
    iconBg: "primary",
    date: "July 12, 2023",
  },
  {
    id: "affordable_housing_distribution",
    title: "Affordable Housing Distribution in NYC",
    description: "Analysis of affordable housing units shows uneven distribution across boroughs with the Bronx leading in new developments.",
    icon: "chart-pie",
    iconBg: "secondary",
    date: "July 5, 2023",
  }
];

// Sample AI analysis suggestions
export const AI_SUGGESTIONS = [
  "Which areas in Queens have the most HPD violations?",
  "Are there buildings in the Bronx with signs of illegal renovations?",
  "What are common violations in Manhattan high-rises?",
  "Show buildings with both DOB and HPD violations in 2023"
];

// Mapbox configuration
export const MAPBOX_CONFIG = {
  style: "mapbox://styles/mapbox/light-v11",
  center: [-73.9857, 40.7484], // NYC center
  zoom: 10,
};
