import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useThemeStore } from '../../stores/themeStore'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()
  
  return (
    <button
      type="button"
      className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <SunIcon className="h-5 w-5" aria-hidden="true" />
      ) : (
        <MoonIcon className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  )
}
