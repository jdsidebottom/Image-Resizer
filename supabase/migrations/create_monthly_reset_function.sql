/*
  # Create monthly usage reset function

  1. New Function
    - `reset_monthly_usage()`
      - Resets the monthly_usage to 0 for all users
  2. Trigger
    - Automatically runs on the first day of each month
*/

CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS void AS $$
BEGIN
  UPDATE user_profiles SET monthly_usage = 0;
END;
$$ LANGUAGE plpgsql;

-- Create a cron job to run the function on the first day of each month
-- Note: This requires the pg_cron extension to be enabled
-- In a real production environment, you would need to ensure this extension is available
-- or implement this reset through an external scheduled task
-- 
-- Example of how to set up the cron job if pg_cron is available:
-- SELECT cron.schedule('0 0 1 * *', 'SELECT reset_monthly_usage()');
