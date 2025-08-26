/*
          # Initial Schema Setup
          This script sets up the complete database schema for the financial control application.
          It creates tables for users, salaries, credit cards, expenses, budgets, and debts,
          and establishes relationships between them. Crucially, it enables Row Level Security
          on all data tables to ensure users can only access their own information.

          ## Query Description: 
          This is a foundational script. It does not alter existing data but creates the necessary
          structure for the application to function. It is safe to run on a new Supabase project.
          If you have existing tables with the same names, this script will fail. Ensure your
          database is clean before applying this migration.

          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "High"
          - Requires-Backup: false
          - Reversible: false

          ## Structure Details:
          - **profiles**: Stores user-specific data, linked one-to-one with `auth.users`.
          - **salaries**: Stores user income records.
          - **credit_cards**: Manages user credit cards, including limits and colors.
          - **expenses**: The core table for all user expenses, linked to credit cards.
          - **budgets**: Stores monthly spending limits per category for each user.
          - **debts**: Tracks user loans and other debts.

          ## Security Implications:
          - RLS Status: Enabled on all data tables.
          - Policy Changes: Yes, policies are created to restrict data access to the owner.
          - Auth Requirements: All tables are linked to `auth.users` via a `user_id`.

          ## Performance Impact:
          - Indexes: Primary keys and foreign keys are indexed by default.
          - Triggers: A trigger is added to automatically create a user profile upon signup.
          - Estimated Impact: Low impact on a new database.
          */

-- Create Profiles Table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ,

  PRIMARY KEY (id)
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Function to create a profile for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- Create Salaries Table
CREATE TABLE public.salaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.salaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own salaries" ON public.salaries FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


-- Create Credit Cards Table
CREATE TABLE public.credit_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  "limit" NUMERIC(10, 2) NOT NULL,
  current_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  color VARCHAR(7) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.credit_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own credit cards" ON public.credit_cards FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


-- Create Expenses Table
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  card_id UUID REFERENCES public.credit_cards(id) ON DELETE SET NULL,
  installment_group_id TEXT,
  total_installment_amount NUMERIC(10, 2),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own expenses" ON public.expenses FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


-- Create Budgets Table
CREATE TABLE public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, category)
);

ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own budgets" ON public.budgets FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


-- Create Debts Table
CREATE TABLE public.debts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  remaining_amount NUMERIC(10, 2) NOT NULL,
  monthly_payment NUMERIC(10, 2) NOT NULL,
  due_date INT NOT NULL,
  paid_installments INT NOT NULL DEFAULT 0,
  total_installments INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own debts" ON public.debts FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
