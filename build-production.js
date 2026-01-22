/**
 * Script de build pour la production
 * Copie et optimise les fichiers pour le déploiement
 */

const fs = require('fs-extra');
const path = require('path');

const SOURCE_DIR = '.';
const BUILD_DIR = 'public';

// Fichiers à copier
const FILES_TO_COPY = [
    'index.html',
    'styles.css',
    'app.js',
    'GUIDE_DEMARRAGE.md',
    'GUIDE_MINI-JEUX.md',
    'GUIDE_CARTE_AVANCEE.md',
    'GUIDE_ITINERAIRE.md'
];

// Dossiers à copier
const FOLDERS_TO_COPY = [
    // Ajoutez ici des dossiers si nécessaire (images, etc.)
];

async function buildProduction() {
    console.log('🚀 Démarrage du build de production...\n');

    try {
        // Créer le dossier public s'il n'existe pas
        await fs.ensureDir(BUILD_DIR);
        console.log(`✅ Dossier ${BUILD_DIR} créé/vérifié`);

        // Copier les fichiers
        for (const file of FILES_TO_COPY) {
            const sourcePath = path.join(SOURCE_DIR, file);
            const destPath = path.join(BUILD_DIR, file);

            if (await fs.pathExists(sourcePath)) {
                await fs.copy(sourcePath, destPath);
                console.log(`✅ Copié: ${file}`);
            } else {
                console.log(`⚠️  Fichier non trouvé: ${file}`);
            }
        }

        // Copier les dossiers
        for (const folder of FOLDERS_TO_COPY) {
            const sourcePath = path.join(SOURCE_DIR, folder);
            const destPath = path.join(BUILD_DIR, folder);

            if (await fs.pathExists(sourcePath)) {
                await fs.copy(sourcePath, destPath);
                console.log(`✅ Dossier copié: ${folder}`);
            }
        }

        // Optimiser index.html (remplacer les chemins)
        const indexPath = path.join(BUILD_DIR, 'index.html');
        if (await fs.pathExists(indexPath)) {
            let indexContent = await fs.readFile(indexPath, 'utf8');

            // Remplacer les chemins CSS/JS non minifiés par les versions minifiées
            indexContent = indexContent.replace('styles.css', 'styles.min.css');
            indexContent = indexContent.replace('app.js', 'app.min.js');

            await fs.writeFile(indexPath, indexContent);
            console.log('✅ index.html optimisé');
        }

        console.log('\n🎉 Build de production terminé avec succès !');
        console.log(`📁 Les fichiers sont dans le dossier: ${BUILD_DIR}\n`);

    } catch (error) {
        console.error('❌ Erreur durant le build:', error);
        process.exit(1);
    }
}

// Lancer le build
buildProduction();

