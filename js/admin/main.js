import { AdminDataService } from './services/AdminDataService.js';
import { AdminState } from './state/AdminState.js';
import { AdminView } from './views/AdminView.js';
import { AdminController } from './controllers/AdminController.js';

document.addEventListener('DOMContentLoaded', () => {
    const dataService = new AdminDataService();
    const state = new AdminState();
    const view = new AdminView();
    const controller = new AdminController(dataService, state, view);

    controller.init();
});
