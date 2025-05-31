/*
  # Create profile trigger

  1. Trigger Function
    - Create a trigger function to automatically create a profile when a new user signs up
    - The function will insert a new row in the profiles table with the user's id and email
  2. Trigger
    - Create a trigger that fires after a new user is inserted in auth.users
    - The trigger will call the function to create a profile
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
