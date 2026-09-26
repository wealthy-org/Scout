export type ConnectionType = "confirmed" | "hypothesis";

export type ConnectionReason =
  | "same_deployer"
  | "same_fee_recipient"
  | "deployer_receives_fees"
  | "same_github_repo"
  | "note_mention";

export interface DossierSourceItem {
  id?: string;
  kind?: string;
  url: string;
}

export interface DossierWithSources {
  id?: string;
  contractAddress: string;
  symbol: string;
  name?: string;
  deployerAddress?: string;
  feeRecipientAddress?: string;
  thesis?: string;
  notes?: string;
  sources?: (string | DossierSourceItem)[];
}

export interface ConnectionLink {
  sourceAddress: string;
  targetAddress: string;
  type: ConnectionType;
  reason: ConnectionReason;
  metadata?: {
    matchedValue?: string;
    deployerAddress?: string;
    feeRecipientAddress?: string;
    repoUrl?: string;
    mention?: string;
  };
}

function normalizeAddress(addr?: string): string {
  if (!addr) return "";
  return addr.trim().toLowerCase();
}

function extractGithubRepoKey(rawUrl: string): string | null {
  try {
    const parsed = new URL(rawUrl);
    if (!parsed.hostname.toLowerCase().includes("github.com")) {
      return null;
    }
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0].toLowerCase()}/${parts[1].toLowerCase().replace(/\.git$/, "")}`;
    }
    return null;
  } catch {
    const match = rawUrl.match(/github\.com\/([^/]+)\/([^/#?]+)/i);
    if (match) {
      return `${match[1].toLowerCase()}/${match[2].toLowerCase().replace(/\.git$/, "")}`;
    }
    return null;
  }
}

function extractGithubRepos(sources?: (string | DossierSourceItem)[]): Set<string> {
  const result = new Set<string>();
  if (!sources || !Array.isArray(sources)) return result;

  for (const s of sources) {
    const url = typeof s === "string" ? s : s?.url;
    if (url) {
      const key = extractGithubRepoKey(url);
      if (key) {
        result.add(key);
      }
    }
  }
  return result;
}

function hasMention(
  sourceDossier: DossierWithSources,
  targetCA: string,
  targetSymbol: string
): boolean {
  const combinedText = `${sourceDossier.thesis || ""} ${sourceDossier.notes || ""}`.toLowerCase();
  if (!combinedText.trim()) return false;

  const cleanCA = targetCA.toLowerCase();
  if (cleanCA && combinedText.includes(cleanCA)) {
    return true;
  }

  const cleanSymbol = targetSymbol.trim().toLowerCase();
  if (cleanSymbol) {
    const symbolDollar = `$${cleanSymbol}`;
    const symbolBracket = `[[${cleanSymbol}]]`;
    if (combinedText.includes(symbolDollar) || combinedText.includes(symbolBracket)) {
      return true;
    }
  }

  return false;
}

export function detectConnections(dossiers: DossierWithSources[] = []): ConnectionLink[] {
  if (!dossiers || dossiers.length < 2) {
    return [];
  }

  const links: ConnectionLink[] = [];
  const linkKeySet = new Set<string>();

  for (let i = 0; i < dossiers.length; i++) {
    for (let j = i + 1; j < dossiers.length; j++) {
      const docA = dossiers[i];
      const docB = dossiers[j];

      const caA = normalizeAddress(docA.contractAddress);
      const caB = normalizeAddress(docB.contractAddress);

      if (!caA || !caB || caA === caB) continue;

      const depA = normalizeAddress(docA.deployerAddress);
      const depB = normalizeAddress(docB.deployerAddress);
      const feeA = normalizeAddress(docA.feeRecipientAddress);
      const feeB = normalizeAddress(docB.feeRecipientAddress);

      const addLink = (type: ConnectionType, reason: ConnectionReason, matchedValue?: string) => {
        const canonicalKey = [caA, caB].sort().join("::") + `::${reason}`;
        if (linkKeySet.has(canonicalKey)) return;
        linkKeySet.add(canonicalKey);

        links.push({
          sourceAddress: docA.contractAddress,
          targetAddress: docB.contractAddress,
          type,
          reason,
          metadata: {
            matchedValue,
            deployerAddress: depA || depB,
            feeRecipientAddress: feeA || feeB,
          },
        });
      };

      if (depA && depB && depA === depB) {
        addLink("confirmed", "same_deployer", depA);
      }

      if (feeA && feeB && feeA === feeB) {
        addLink("confirmed", "same_fee_recipient", feeA);
      }

      if ((depA && feeB && depA === feeB) || (depB && feeA && depB === feeA)) {
        addLink("confirmed", "deployer_receives_fees", depA === feeB ? depA : depB);
      }

      const reposA = extractGithubRepos(docA.sources);
      const reposB = extractGithubRepos(docB.sources);
      for (const repo of reposA) {
        if (reposB.has(repo)) {
          addLink("confirmed", "same_github_repo", repo);
          break;
        }
      }

      const aMentionsB = hasMention(docA, docB.contractAddress, docB.symbol);
      const bMentionsA = hasMention(docB, docA.contractAddress, docA.symbol);
      if (aMentionsB || bMentionsA) {
        addLink("hypothesis", "note_mention", aMentionsB ? docB.symbol : docA.symbol);
      }
    }
  }

  return links;
}
