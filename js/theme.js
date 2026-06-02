const THEME_STORAGE_KEY = 'snakeLadderTheme';
const DEFAULT_THEME = 'light';

export function setupThemeSelector() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME;
    applyTheme(savedTheme);

    const themeSelector = document.querySelector('.themeSelector');
    const themeToggleBtn = document.getElementById('themeToggleBtn');

    themeToggleBtn?.addEventListener('click', () => {
        const isCollapsed = themeSelector?.classList.toggle('collapsed') ?? true;
        themeToggleBtn.setAttribute('aria-expanded', String(!isCollapsed));
    });

    document.querySelectorAll('[data-theme-value]').forEach((button) => {
        button.addEventListener('click', () => {
            const theme = button.dataset.themeValue || DEFAULT_THEME;
            localStorage.setItem(THEME_STORAGE_KEY, theme);
            applyTheme(theme);
        });
    });
}

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const currentThemeLabel = document.getElementById('currentThemeLabel');
    if (currentThemeLabel) currentThemeLabel.innerText = formatThemeName(theme);

    document.querySelectorAll('[data-theme-value]').forEach((button) => {
        const isActive = button.dataset.themeValue === theme;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });
}

function formatThemeName(theme) {
    return theme
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
