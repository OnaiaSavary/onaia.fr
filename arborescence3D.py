import os
import networkx as nx
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import matplotlib.animation as animation
import numpy as np

class Fichier:
    def __init__(self, chemin, nom_fichier, type_fichier, repertoire, profondeur_totale):
        self.chemin = chemin
        self.nom_fichier = nom_fichier
        self.type_fichier = type_fichier
        self.repertoire = repertoire
        self.profondeur_totale = profondeur_totale

class Repertoire:
    def __init__(self, chemin, nom_repertoire, parent=None, profondeur_totale=0):
        self.chemin = chemin
        self.nom_repertoire = nom_repertoire
        self.parent = parent
        self.enfants = []
        self.profondeur_totale = profondeur_totale

    def ajouter_enfant(self, enfant):
        self.enfants.append(enfant)

class ParcoursRepertoire:
    def __init__(self, repertoire):
        self.repertoire = repertoire

    def get_type_fichier(self, extension):
        types = {
            '.py': 'Python',
            '.sh': 'Bash',
            '.pdf': 'PDF',
            '.png': 'PNG',
            '.jpg': 'JPG',
            '.jpeg': 'JPG',
            '.csv': 'CSV',
            '.xlsx': 'Excel',
        }
        return types.get(extension.lower(), 'Inconnu')

    def calculer_profondeur_totale(self, chemin_fichier):
        chemin_relatif = os.path.relpath(chemin_fichier, self.repertoire)
        return chemin_relatif.count(os.sep)

    def parcourir(self):
        fichiers_trouves = []
        repertoires_trouves = []

        for racine, sous_repertoires, fichiers in os.walk(self.repertoire):
            if not racine.startswith(self.repertoire):
                continue

            profondeur_totale_repertoire = racine.count(os.sep) - self.repertoire.count(os.sep)
            parent_repertoire = os.path.basename(racine)
            parent_obj = Repertoire(racine, parent_repertoire, profondeur_totale=profondeur_totale_repertoire)
            repertoires_trouves.append(parent_obj)

            for fichier in fichiers:
                chemin_complet = os.path.join(racine, fichier)
                extension = os.path.splitext(fichier)[1]
                type_fichier = self.get_type_fichier(extension)
                
                profondeur_totale_fichier = self.calculer_profondeur_totale(chemin_complet)
                
                fichier_obj = Fichier(chemin_complet, fichier, type_fichier, racine, profondeur_totale_fichier)
                fichiers_trouves.append(fichier_obj)
                parent_obj.ajouter_enfant(fichier_obj)

            for sous_repertoire in sous_repertoires:
                chemin_sous_repertoire = os.path.join(racine, sous_repertoire)
                sous_repertoire_obj = Repertoire(chemin_sous_repertoire, sous_repertoire, parent_obj, profondeur_totale_repertoire)
                parent_obj.ajouter_enfant(sous_repertoire_obj)

        return repertoires_trouves, fichiers_trouves

def creer_graphe(repertoires, fichiers):
    G = nx.DiGraph()

    couleurs = {
        'Python': 'cyan',
        'Bash': 'lime',
        'PDF': 'orange',
        'PNG': 'lightcoral',
        'JPG': 'gold',
        'CSV': 'lightpink',
        'Excel': 'lightseagreen',
        'Inconnu': 'lightgray'
    }

    for rep in repertoires:
        G.add_node(rep.chemin, label='', type="repertoire", profondeur=rep.profondeur_totale, color='white')

    for fichier in fichiers:
        color = couleurs.get(fichier.type_fichier, 'white')
        G.add_node(fichier.chemin, label='', type="fichier", profondeur=fichier.profondeur_totale, color=color)
        G.add_edge(fichier.repertoire, fichier.chemin)

    for rep in repertoires:
        if rep.parent:
            G.add_edge(rep.parent.chemin, rep.chemin)

        for enfant in rep.enfants:
            G.add_edge(rep.chemin, enfant.chemin)

    return G



def visualiser_graphe(G):
    pos = nx.spring_layout(G, dim=3)

    # Calculer la distance euclidienne au centre pour chaque nœud
    center = np.array([0, 0, 0])
    threshold = 0.5  # Seuil de distance à partir duquel on réduit l'amplitude
    reduction_factor = 2  # Facteur de réduction
    L = []
    for key in pos:
        node_pos = np.array(pos[key])
        distance = np.linalg.norm(node_pos)  # Calculer la distance au centre
        # Si la distance dépasse le seuil, réduire la position
        if distance < threshold:
            pos[key] = node_pos/np.sqrt(distance)
    # Créer une figure plein écran
    fig = plt.figure(figsize = (40,40))
    ax = fig.add_subplot(111, projection='3d')
    ax.set_facecolor('black')

    # Dessiner les arêtes
    for edge in G.edges:
        x = [pos[edge[0]][0], pos[edge[1]][0]]
        y = [pos[edge[0]][1], pos[edge[1]][1]]
        z = [pos[edge[0]][2], pos[edge[1]][2]]
        ax.plot(x, y, z, color='white', alpha=0.2, linewidth=0.1)

    # Dessiner les nœuds
    ax.scatter(*zip(*pos.values()), c='white', s=0.2)

    plt.axis('off')  # Cacher les axes

    # Fonction d'animation
    def update(frame):
        ax.view_init(elev=20, azim=frame * 0.5)
        return fig,
    
    # Créer l'animation
    ani = animation.FuncAnimation(fig, update, frames=range(0, 720), interval=33)

    # Enregistrer l'animation
    ani.save('C:/Users/Onaia_Savary/Desktop/graphe_rot_scolar3.mp4', writer='ffmpeg')

    plt.show()

def main():
    repertoire = input("Entrez le chemin du répertoire à parcourir : ")
    
    parcours = ParcoursRepertoire(repertoire)
    repertoires, fichiers = parcours.parcourir()
    
    G = creer_graphe(repertoires, fichiers)
    
    visualiser_graphe(G)
    
    
if __name__ == "__main__":
    main()
