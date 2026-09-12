// Feature data for the comparison table.
//
// Each group becomes its own <tbody> with a heading row, which lets screen
// reader users and sighted users both scan the table in logical sections
// instead of one long undifferentiated list of 16 rows.
//
// `type` is either:
//   "bool" -> basic/pro/premium are true/false, rendered as included/not included
//   "text" -> basic/pro/premium are display strings, rendered as-is
//
// `note` is optional extra detail shown under the value (kept short).

export const featureGroups = [
  {
    category: "Storage & files",
    items: [
      {
        id: "storage-space",
        name: "Storage space",
        type: "text",
        basic: "50 GB",
        pro: "500 GB",
        premium: "2 TB",
      },
      {
        id: "upload-size",
        name: "Max file upload size",
        type: "text",
        basic: "2 GB",
        pro: "10 GB",
        premium: "50 GB",
      },
      {
        id: "version-history",
        name: "File version history",
        type: "text",
        basic: "7 days",
        pro: "30 days",
        premium: "180 days",
      },
    ],
  },
  {
    category: "Collaboration",
    items: [
      {
        id: "team-members",
        name: "Team members",
        type: "text",
        basic: "Up to 3",
        pro: "Up to 20",
        premium: "Unlimited",
      },
      {
        id: "shared-workspaces",
        name: "Shared workspaces",
        type: "bool",
        basic: false,
        pro: true,
        premium: true,
      },
      {
        id: "co-editing",
        name: "Real-time co-editing",
        type: "bool",
        basic: false,
        pro: true,
        premium: true,
      },
      {
        id: "guest-links",
        name: "Guest access links",
        type: "bool",
        basic: true,
        pro: true,
        premium: true,
      },
    ],
  },
  {
    category: "Security",
    items: [
      {
        id: "two-factor",
        name: "Two-factor authentication",
        type: "bool",
        basic: true,
        pro: true,
        premium: true,
      },
      {
        id: "sso",
        name: "Single sign-on (SSO)",
        type: "bool",
        basic: false,
        pro: false,
        premium: true,
      },
      {
        id: "audit-logs",
        name: "Advanced audit logs",
        type: "bool",
        basic: false,
        pro: true,
        premium: true,
      },
      {
        id: "retention-policy",
        name: "Custom data retention policy",
        type: "bool",
        basic: false,
        pro: false,
        premium: true,
      },
    ],
  },
  {
    category: "Support",
    items: [
      {
        id: "support-channels",
        name: "Support channels",
        type: "text",
        basic: "Email",
        pro: "Email & chat",
        premium: "Priority phone & chat",
      },
      {
        id: "response-time",
        name: "Average response time",
        type: "text",
        basic: "48 hours",
        pro: "12 hours",
        premium: "2 hours",
      },
      {
        id: "account-manager",
        name: "Dedicated account manager",
        type: "bool",
        basic: false,
        pro: false,
        premium: true,
      },
    ],
  },
  {
    category: "Advanced",
    items: [
      {
        id: "api-access",
        name: "API access",
        type: "bool",
        basic: false,
        pro: true,
        premium: true,
      },
      {
        id: "custom-integrations",
        name: "Custom integrations",
        type: "bool",
        basic: false,
        pro: false,
        premium: true,
      },
    ],
  },
];
