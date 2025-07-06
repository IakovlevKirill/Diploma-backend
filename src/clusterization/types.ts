export type ClusterResult = {
    tree: TreeStructure;
    analytics: Analytics;
};

export type TreeStructure = {
    id: string;
    name: string;
    children: TreeElement[];
};

export type TreeElement = {
    id: string;
    name: string;
    type?: string;
    elements?: { id: string; name: string }[];
};

export type Analytics = {
    totalNodes: number;
    totalClusters: number;
    clustersSummary: Array<{
        clusterId: string;
        nodeCount: number;
    }>;
    executionTimeMs?: number;
};