import { gameDashbord } from "./dashbord.js";
import { setupThemeSelector } from "./theme.js";

document.addEventListener("DOMContentLoaded", ()=>{
    setupThemeSelector();
    new gameDashbord();
});
