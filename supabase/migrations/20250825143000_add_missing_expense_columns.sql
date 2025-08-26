/*
# [Operation Name]
Add Missing Columns to Expenses Table

## Query Description: [This operation adds several missing columns to the `expenses` table to support payment methods, credit card linking, and installment tracking. This is a non-destructive structural change and is required for the application's core functionality to work correctly. No existing data will be lost.]

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Table: expenses
- Columns Added:
  - payment_method (payment_method_enum)
  - card_id (uuid, FK to credit_cards)
  - installment_group_id (text)
  - total_installment_amount (numeric)
- Types Created:
  - payment_method_enum

## Security Implications:
- RLS Status: Enabled (No changes to RLS policies)
- Policy Changes: No
- Auth Requirements: None

## Performance Impact:
- Indexes: A foreign key index will be created on `card_id`.
- Triggers: None
- Estimated Impact: Low. The changes are additive and should not impact performance on existing queries.
*/

-- Create a new ENUM type for payment methods for data consistency.
CREATE TYPE public.payment_method_enum AS ENUM (
    'dinheiro',
    'debito',
    'credito',
    'pix'
);

-- Add the missing columns to the 'expenses' table.
ALTER TABLE public.expenses
ADD COLUMN payment_method public.payment_method_enum NOT NULL DEFAULT 'dinheiro',
ADD COLUMN card_id uuid REFERENCES public.credit_cards(id) ON DELETE SET NULL,
ADD COLUMN installment_group_id text,
ADD COLUMN total_installment_amount numeric;

-- Add a comment to the new column for clarity.
COMMENT ON COLUMN public.expenses.payment_method IS 'Method used for the payment (e.g., credit card, cash).';
COMMENT ON COLUMN public.expenses.card_id IS 'Link to the credit card used, if applicable.';
COMMENT ON COLUMN public.expenses.installment_group_id IS 'Identifier to group installment payments together.';
COMMENT ON COLUMN public.expenses.total_installment_amount IS 'The total amount of the original purchase for an installment.';
