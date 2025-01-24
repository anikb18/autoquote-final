import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyQuotesEmptyState = () => {
  const navigate = useNavigate();

  return (
    <Card className="p-6 text-center">
      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-lg font-semibold mb-2">No Active Quotes</h3>
      <p className="text-muted-foreground mb-4">
        You don't have any active quotes yet. Start by creating a new quote request.
      </p>
      <Button onClick={() => navigate("/new-quote")}>
        Create New Quote
      </Button>
    </Card>
  );
};

export default MyQuotesEmptyState;