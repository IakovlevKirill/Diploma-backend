import { execFile } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Функция генерации позиций внутри кластера
function generatePositions(count: number, radius: number = 120) {
    const positions = [];
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * 2 * Math.PI;
        positions.push({
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
        });
    }
    return positions;
}

const execFileAsync = promisify(execFile);

export async function buildGraphAndCluster(
    rawNodes: Array<{ id: string; name: string; connections: any[] }>
): Promise<{ nodes: any[]; analytics: any }> {
    const start = Date.now();

    try {
        const tempInputPath = path.join(__dirname, '../../scripts/input.json');

        // Сохраняем временный файл
        await writeFile(tempInputPath, JSON.stringify(rawNodes));

        // Запускаем скрипт с путём к файлу
        const scriptPath = path.resolve(__dirname, '../../scripts/louvain_cluster.py');
        const { stdout } = await execFileAsync('python', [scriptPath, tempInputPath]);

        // Удаляем временный файл
        await unlink(tempInputPath);

        const result = JSON.parse(stdout);
        const clusters = result.clusters;

        const nodes: any[] = [];

        const rootId = uuidv4(); // Генерируем уникальный ID для root

        // Корневой узел
        nodes.push({
            id: rootId,
            name: 'Root Node',
            parentId: 'root', // корень не имеет родителя
            children: [],
            type: 'untyped',
            position: { x: 0, y: 0 },
            size: { width: 200, height: 200 },
            color: '#2C3E50',
            pointColor: '#1ABC9C'
        });

        // Позиции кластеров относительно корня
        const clusterPositions = generatePositions(Object.keys(clusters).length, 300);

        Object.entries(clusters).forEach(([clusterId, memberIds], index) => {
            const clusterNodeId = uuidv4(); // UUID для кластера
            const { x, y } = clusterPositions[index];

            // Кластер — это просто узел типа 'cluster'
            nodes.push({
                id: clusterNodeId,
                name: `Кластер ${index + 1}`,
                parentId: rootId,
                children: [...(memberIds as string[])],
                type: 'cluster',
                position: { x, y },
                size: { width: 200, height: 200 },
                color: '#34495E',
                pointColor: '#E67E22'
            });

            // Добавляем кластер как ребёнка корню
            const rootNode = nodes.find((n) => n.id === rootId);
            if (rootNode) {
                rootNode.children.push(clusterNodeId);
            }

            // Позиции элементов внутри кластера
            const elementPositions = generatePositions((memberIds as string[]).length, 120);

            // Добавляем элементы
            (memberIds as string[]).forEach((id, elemIndex) => {
                const rawNode = rawNodes.find((n) => n.id === id);
                if (rawNode) {

                    const { x: ex, y: ey } = elementPositions[elemIndex];

                    nodes.push({
                        id: uuidv4(), // UUID для каждого элемента
                        name: rawNode.name,
                        parentId: clusterNodeId,
                        children: [],
                        type: 'quest',
                        position: { x: ex, y: ey },
                        size: { width: 100, height: 100 },
                        color: '#2980B9',
                        pointColor: '#3498DB'
                    });
                }
            });
        });

        // Возвращаем результат
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