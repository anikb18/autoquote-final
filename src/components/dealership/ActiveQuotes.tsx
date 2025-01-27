import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DealerQuotesTable } from "../dashboard/DealerQuotesTable";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

export const ActiveQuotes = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Active Quotes</h1>
        <Button
          onClick={() => navigate("/new-quote")}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Quote
        </Button>
      </div>
      <DealerQuotesTable />
    </div>
  );
};
