import { execFile } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

const execFileAsync = promisify(execFile);

export async function buildGraphAndCluster(
    rawNodes: Array<{ id: string; name: string; connections: any[] }>
): Promise<{ nodes: any[]; analytics: any }> {
    const start = Date.now();

    try {
        const tempInputPath = path.join(__dirname, '../../scripts/input.json');

        // Сохраняем временный файл
        await writeFile(tempInputPath, JSON.stringify(rawNodes));

        // Запускаем скрипт с аргументом-путём к файлу
        const scriptPath = path.resolve(__dirname, '../../scripts/louvain_cluster.py');
        const { stdout } = await execFileAsync('python', [scriptPath, tempInputPath]);

        // Удаляем временный файл
        await unlink(tempInputPath);

        const result = JSON.parse(stdout);

        const clusters = result.clusters;

        // Дальше твой код построения дерева и аналитики — всё окей
        const rootId = 'root';
        const nodes: any[] = [];

        nodes.push({
            id: rootId,
            name: 'Root Node',
            parentId: '',
            children: [],
        });

        Object.entries(clusters).forEach(([clusterId, memberIds], index) => {
            const clusterNodeId = `cluster_${clusterId}`;
            const clusterName = `Кластер ${index + 1}`;

            nodes.push({
                id: clusterNodeId,
                name: clusterName,
                parentId: rootId,
                children: [...(memberIds as string[])],
            });

            const rootIndex = nodes.findIndex((n) => n.id === rootId);
            if (rootIndex !== -1) {
                nodes[rootIndex].children.push(clusterNodeId);
            }

            (memberIds as string[]).forEach((id) => {
                const rawNode = rawNodes.find((n) => n.id === id);
                if (rawNode) {
                    nodes.push({
                        id: rawNode.id,
                        name: rawNode.name,
                        parentId: clusterNodeId,
                        children: [],
                    });
                }
            });
        });

        const analytics = {
            totalNodes: rawNodes.length,
            totalClusters: Object.keys(clusters).length,
            clustersSummary: Object.entries(clusters).map(([id, members]) => ({
                clusterId: id,
                nodeCount: (members as string[]).length,
            })),
            executionTimeMs: Date.now() - start,
        };

        return { nodes, analytics };
    } catch (error) {
        console.error('Ошибка выполнения Louvain:', error);
        throw new Error('Error executing Louvain algorithm');
    }
}