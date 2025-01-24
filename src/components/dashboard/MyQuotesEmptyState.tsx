import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const MyQuotesEmptyState = () => {
  return (
    <Card className="p-6 text-center">
      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-lg font-semibold mb-2">No Quotes Yet</h3>
      <p className="text-muted-foreground mb-4">
        Start by creating a new quote request to receive dealer offers.
      </p>
      <Button asChild>
        <Link to="/new-quote">Create New Quote</Link>
      </Button>
    </Card>
  );
};

export default MyQuotesEmptyState;