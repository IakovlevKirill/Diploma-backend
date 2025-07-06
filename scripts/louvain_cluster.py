# louvain_cluster.py
import sys
import json
import networkx as nx
import community

def main():
    try:
        # Читаем данные из stdin
        input_file = sys.argv[1]
        with open(input_file, 'r') as f:
            nodes_data = json.load(f)

        # Создаём граф
        G = nx.Graph()

        # Добавляем рёбра с весами
        for node in nodes_data:
            for connection in node.get("connections", []):
                target = connection["target"]
                weight = connection.get("weight", 1.0)
                G.add_edge(node["id"], target, weight=weight)

        # Выполняем кластеризацию
        partition = community.best_partition(G)

        # Группируем по кластерам: cluster_id -> [node_ids]
        clusters = {}
        for node_id, cluster_id in partition.items():
            if cluster_id not in clusters:
                clusters[cluster_id] = []
            clusters[cluster_id].append(node_id)

        # Выводим результат в stdout
        print(json.dumps({"clusters": clusters}))

    except Exception as e:
        # В случае ошибки выводим сообщение в stderr и выходим с кодом 1
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()