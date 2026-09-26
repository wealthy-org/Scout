export interface ExampleDeployer {
  archetype: "fresh" | "repeat" | "serial";
  address: string;
  name: string;
  score: number;
  label: "fresh" | "repeat" | "serial";
  band: "green" | "yellow" | "red";
  totalLaunches: number;
  graduatedCount: number;
  description: string;
}

export const EXAMPLE_DEPLOYERS: ExampleDeployer[] = [
  {
    archetype: "fresh",
    address: "0x1111111111111111111111111111111111111111",
    name: "Fresh Creator (First Deployment)",
    score: 50,
    label: "fresh",
    band: "yellow",
    totalLaunches: 1,
    graduatedCount: 0,
    description:
      "A new origin address with 1 ungraduated launch. Neutral 50 score governed by Laplace prior.",
  },
  {
    archetype: "repeat",
    address: "0x2222222222222222222222222222222222222222",
    name: "Trusted Repeat Builder",
    score: 84,
    label: "repeat",
    band: "green",
    totalLaunches: 14,
    graduatedCount: 11,
    description:
      "Consistent builder with 11 of 14 tokens successfully graduated to DEX liquidity pools.",
  },
  {
    archetype: "serial",
    address: "0x3333333333333333333333333333333333333333",
    name: "Serial Rugger (Penalized)",
    score: 16,
    label: "serial",
    band: "red",
    totalLaunches: 38,
    graduatedCount: 0,
    description:
      "38 consecutive genesis launches with 0 graduations. Penalized by hard mathematical cap.",
  },
];

export function getExampleDeployerByArchetype(
  archetype: "fresh" | "repeat" | "serial"
): ExampleDeployer | null {
  return EXAMPLE_DEPLOYERS.find((d) => d.archetype === archetype) || null;
}
