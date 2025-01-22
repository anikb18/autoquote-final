-- Enable RLS for pricing_plans table
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Admins can manage pricing plans" ON pricing_plans
FOR ALL USING (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create policy for public read access
CREATE POLICY "Public can view pricing plans" ON pricing_plans
FOR SELECT USING (true);
