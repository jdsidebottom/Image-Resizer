import { useAuthStore } from '../../stores/authStore'

export default function UsageIndicator() {
  const { userData } = useAuthStore()
  
  if (!userData) return null
  
  const { monthly_usage, monthly_limit, subscription_tier } = userData
  const percentage = Math.min((monthly_usage / monthly_limit) * 100, 100)
  const isNearLimit = percentage >= 80
  const isAtLimit = percentage >= 100
  
  return (
    <div className="w-full max-w-xs">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Monthly Usage
        </span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {monthly_usage}/{monthly_limit} images
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${
            isAtLimit
              ? 'bg-red-600 dark:bg-red-500'
              : isNearLimit
              ? 'bg-yellow-400 dark:bg-yellow-500'
              : 'bg-primary-600 dark:bg-primary-500'
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {subscription_tier === 'free' && (
        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          {isAtLimit ? (
            <span className="text-red-600 dark:text-red-400">
              You've reached your monthly limit. Upgrade to Pro for unlimited images.
            </span>
          ) : isNearLimit ? (
            <span className="text-yellow-600 dark:text-yellow-400">
              You're approaching your monthly limit. Consider upgrading to Pro.
            </span>
          ) : (
            <span>Free tier: {monthly_limit} images per month</span>
          )}
        </div>
      )}
    </div>
  )
}
