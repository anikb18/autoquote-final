import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const planSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  features: z.array(z.string().min(5, "Feature must be at least 5 characters")).min(1),
  monthly_price: z.number().min(1, "Monthly price must be at least $1"),
  annual_price: z.number().min(1, "Annual price must be at least $1"),
  is_featured: z.boolean(),
});

type PricingPlan = z.infer<typeof planSchema>;

type PricingPlanDB = {
  id: string;
  name: string;
  description: string;
  features: string[];
  monthly_price: number;
  annual_price: number;
  is_featured: boolean;
  created_at: string;
};

export const PricingManagement = () => {
  const { data: plans, error, refetch } = useQuery({
    queryKey: ['pricingPlans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from<PricingPlanDB>('pricing_plans')
        .select('*')
        .order('created_at', { ascending: true });

      console.log('Fetched plans from Supabase:', data);

      if (error) {
        console.error('Error fetching pricing plans:', error);
        throw error;
      }
      return data;
    }
  });

  const [editingPlan, setEditingPlan] = useState<PricingPlanDB | null>(null as PricingPlanDB | null); // Explicitly cast null
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const { register, handleSubmit, control, formState: { errors }, reset, setValue } = useForm<PricingPlan>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: "",
      description: "",
      features: [""],
      is_featured: false,
      monthly_price: 0,
      annual_price: 0,
    },
  });

  const { fields, append, move, remove } = useFieldArray({
    control,
    name: "features",
  });

  const syncWithStripe = useMutation({
    mutationFn: async (plan: PricingPlan) => {
      const response = await fetch("/api/pricing-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plan),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Plan saved successfully",
        description: "Pricing plan has been synced with Stripe",
      });
      setEditingPlan(null);
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: "Sync failed",
        description: error.message,
        variant: "destructive",
      });
      setEditingPlan(null);
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = (event: any) => setActiveId(event.active.id);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over?.id);
      move(oldIndex, newIndex);
    }
    setActiveId(null);
  };

  const FeatureItem = ({
    id,
    index,
    value,
  }: {
    id: string;
    index: number;
    value: string;
  }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="flex items-center gap-2 p-2 border rounded cursor-grab active:cursor-grabbing"
      >
        <div className="h-4 w-4 rounded bg-primary/20" />
        <Input
          value={value}
          onChange={(e) => {
            setValue(`features.${index}`, e.target.value, {
              shouldValidate: true,
            });
          }}
          disabled={isSubmitting}
        />
        <button
          type="button"
          onClick={() => remove(index)}
          className="text-red-500 hover:text-red-700 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    );
  };

  const onSubmit = async (data: PricingPlan) => {
    setIsSubmitting(true);
    const updatedPlan = {
      ...data,
      features: data.features.filter((feature) => feature.trim() !== ""),
    };
    await syncWithStripe.mutateAsync(updatedPlan);
    setIsSubmitting(false);
  };

  const handleEditPlan = (plan: PricingPlanDB) => {
    setEditingPlan(plan);
    reset({
      name: plan.name,
      description: plan.description,
      features: plan.features,
      monthly_price: plan.monthly_price,
      annual_price: plan.annual_price,
      is_featured: plan.is_featured,
    });
  };

  const handleAddFeature = () => {
    append("");
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Manage Pricing Plans</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {error && (
            <p className="text-red-500">
              Error loading plans: {error.message}
            </p>
          )}
          {plans?.length === 0 && <p>No pricing plans available.</p>}
          {plans &&
            plans.map((plan) => (
              <div
                key={plan.id}
                className="border rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-gray-500">{plan.description}</p>
                <Button variant="outline" onClick={() => handleEditPlan(plan)}>
                  Edit Plan
                </Button>
              </div>
            ))}
        </CardContent>
      </Card>

      {editingPlan && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingPlan ? "Edit" : "Create New"} Pricing Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 md:grid-cols-2">
                <Input placeholder="Plan Name" {...register("name")} />
                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  placeholder="Description"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-red-500">{errors.description.message}</p>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  placeholder="Monthly Price"
                  type="number"
                  {...register("monthly_price", { valueAsNumber: true })}
                />
                {errors.monthly_price && (
                  <p className="text-red-500">
                    {errors.monthly_price.message}
                  </p>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  placeholder="Annual Price"
                  type="number"
                  {...register("annual_price", { valueAsNumber: true })}
                />
                {errors.annual_price && (
                  <p className="text-red-500">{errors.annual_price.message}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  {...register("is_featured")}
                />
                <label htmlFor="is_featured">Featured</label>
              </div>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={fields.map((field) => field.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {fields.map((field, index) => (
                      <FeatureItem
                        key={field.id}
                        id={field.id}
                        index={index}
                        value={field.value || ""}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
              <Button type="button" onClick={handleAddFeature}>
                Add Feature
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                Save & Sync with Stripe
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
