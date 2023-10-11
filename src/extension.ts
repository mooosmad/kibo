import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "Kibo" activée');

    let disposable = vscode.commands.registerCommand('KibotAssistant.generateCommit', () => {
		// Vérifier si l'extension Git est installée
        const gitExtension = vscode.extensions.getExtension('vscode.git');
        if (!gitExtension) {
            vscode.window.showErrorMessage('L\'extension Git n\'est pas installée.');
            return;
        }

        gitExtension.activate().then(() => {
            const git = gitExtension.exports;
            const api = git.getAPI(1);
            const repository = api.repositories[0]; // Prend le premier dépôt Git

            if (!repository) {
                vscode.window.showWarningMessage('Aucun dépôt Git actif trouvé.');
                return;
            }

            const stagedChanges = repository.state.indexChanges;
            if (stagedChanges.length === 0) {
                vscode.window.showInformationMessage('Aucun changement en attente de commit.');
                return;
            }

            const commitMessage = generateCommitMessage(stagedChanges);
            repository.inputBox.value = commitMessage;

            // Ouvrir automatiquement la vue Source Control
            vscode.commands.executeCommand('workbench.view.scm');
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
    console.log('Extension "Kibo" désactivée');
}

function generateCommitMessage(stagedChanges: any[]): string {
    // On prend les changements en attente de commit
    return 'Commit automatique : modifications dans les fichiers en attente de commit.';
}
