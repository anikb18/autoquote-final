export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      auctions: {
        Row: {
          created_at: string | null
          current_price: number | null
          enddate: string
          id: string
          photos: string[] | null
          start_price: number
          status: string | null
          updated_at: string | null
          user_id: string | null
          vehicle_details: Json
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_price?: number | null
          enddate: string
          id?: string
          photos?: string[] | null
          start_price: number
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_details: Json
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_price?: number | null
          enddate?: string
          id?: string
          photos?: string[] | null
          start_price?: number
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_details?: Json
          vehicle_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          quote_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          quote_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          quote_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      deadline: {
        Row: {
          created_at: string
          id: string
        }
        Insert: {
          created_at?: string
          id: string
        }
        Update: {
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      dealer_notifications: {
        Row: {
          created_at: string | null
          dealer_id: string | null
          id: string
          quote_id: string | null
          read: boolean | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          dealer_id?: string | null
          id?: string
          quote_id?: string | null
          read?: boolean | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          dealer_id?: string | null
          id?: string
          quote_id?: string | null
          read?: boolean | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dealer_notifications_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealer_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dealer_notifications_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      dealer_profiles: {
        Row: {
          active: boolean | null
          dealer_name: string
          id: string
          subscription_type:
            | Database["public"]["Enums"]["subscription_level"]
            | null
        }
        Insert: {
          active?: boolean | null
          dealer_name: string
          id: string
          subscription_type?:
            | Database["public"]["Enums"]["subscription_level"]
            | null
        }
        Update: {
          active?: boolean | null
          dealer_name?: string
          id?: string
          subscription_type?:
            | Database["public"]["Enums"]["subscription_level"]
            | null
        }
        Relationships: []
      }
      dealer_quotes: {
        Row: {
          created_at: string | null
          dealer_id: string | null
          id: string
          is_accepted: boolean | null
          quote_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          dealer_id?: string | null
          id?: string
          is_accepted?: boolean | null
          quote_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          dealer_id?: string | null
          id?: string
          is_accepted?: boolean | null
          quote_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dealer_quotes_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string | null
          file_path: string | null
          id: string
          quote_id: string | null
          status: string | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          file_path?: string | null
          id: string
          quote_id?: string | null
          status?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          file_path?: string | null
          id?: string
          quote_id?: string | null
          status?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          read: boolean | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id: string
          read?: boolean | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          read?: boolean | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number | null
          created_at: string | null
          id: string
          payment_method: string | null
          quote_id: string | null
          status: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          id: string
          payment_method?: string | null
          quote_id?: string | null
          status?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          id?: string
          payment_method?: string | null
          quote_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          stripe_customer_id: string | null
          subscription_id: string | null
          subscription_status: string | null
          subscription_type:
            | Database["public"]["Enums"]["subscription_level"]
            | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          stripe_customer_id?: string | null
          subscription_id?: string | null
          subscription_status?: string | null
          subscription_type?:
            | Database["public"]["Enums"]["subscription_level"]
            | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          stripe_customer_id?: string | null
          subscription_id?: string | null
          subscription_status?: string | null
          subscription_type?:
            | Database["public"]["Enums"]["subscription_level"]
            | null
        }
        Relationships: []
      }
      quote_alerts: {
        Row: {
          admin_notified: boolean | null
          created_at: string | null
          extended_until: string | null
          extension_applied: boolean | null
          id: string
          quote_id: string | null
          status: string | null
        }
        Insert: {
          admin_notified?: boolean | null
          created_at?: string | null
          extended_until?: string | null
          extension_applied?: boolean | null
          id?: string
          quote_id?: string | null
          status?: string | null
        }
        Update: {
          admin_notified?: boolean | null
          created_at?: string | null
          extended_until?: string | null
          extension_applied?: boolean | null
          id?: string
          quote_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_alerts_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          car_details: Json | null
          created_at: string | null
          has_trade_in: boolean | null
          id: string
          price_paid: number | null
          pricing_option: string | null
          status: string | null
          trade_in_visibility_days: number | null
          trade_in_visibility_start: string | null
          user_id: string
        }
        Insert: {
          car_details?: Json | null
          created_at?: string | null
          has_trade_in?: boolean | null
          id?: string
          price_paid?: number | null
          pricing_option?: string | null
          status?: string | null
          trade_in_visibility_days?: number | null
          trade_in_visibility_start?: string | null
          user_id: string
        }
        Update: {
          car_details?: Json | null
          created_at?: string | null
          has_trade_in?: boolean | null
          id?: string
          price_paid?: number | null
          pricing_option?: string | null
          status?: string | null
          trade_in_visibility_days?: number | null
          trade_in_visibility_start?: string | null
          user_id?: string
        }
        Relationships: []
      }
      trade_in_valuations: {
        Row: {
          created_at: string | null
          estimated_value: number | null
          id: string
          quote_id: string | null
          vehicle_details: Json | null
        }
        Insert: {
          created_at?: string | null
          estimated_value?: number | null
          id: string
          quote_id?: string | null
          vehicle_details?: Json | null
        }
        Update: {
          created_at?: string | null
          estimated_value?: number | null
          id?: string
          quote_id?: string | null
          vehicle_details?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "trade_in_valuations_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          action_type: string | null
          created_at: string | null
          details: Json | null
          id: string
          user_id: string | null
        }
        Insert: {
          action_type?: string | null
          created_at?: string | null
          details?: Json | null
          id: string
          user_id?: string | null
        }
        Update: {
          action_type?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
        }
        Insert: {
          created_at?: string | null
          id: string
          role: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
        }
        Relationships: []
      }
      vehicle_makes: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      vehicle_models: {
        Row: {
          created_at: string | null
          id: string
          make_id: string | null
          name: string
          year: number
        }
        Insert: {
          created_at?: string | null
          id: string
          make_id?: string | null
          name: string
          year: number
        }
        Update: {
          created_at?: string | null
          id?: string
          make_id?: string | null
          name?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_models_make_id_fkey"
            columns: ["make_id"]
            isOneToOne: false
            referencedRelation: "vehicle_makes"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_trims: {
        Row: {
          body_style: string | null
          created_at: string | null
          engine_type: string | null
          id: string
          model_id: string | null
          name: string
        }
        Insert: {
          body_style?: string | null
          created_at?: string | null
          engine_type?: string | null
          id: string
          model_id?: string | null
          name: string
        }
        Update: {
          body_style?: string | null
          created_at?: string | null
          engine_type?: string | null
          id?: string
          model_id?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_trims_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "vehicle_models"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_dealer_stats:
        | {
            Args: Record<PropertyKey, never>
            Returns: {
              dealer_id: string
              total_sales: number
            }[]
          }
        | {
            Args: {
              p_dealer_id: string
              p_subscription_type: string
            }
            Returns: {
              active_quotes_count: number
              quote_change: number
              recent_quotes: Json[]
              won_bids_count: number
              total_revenue: number
            }[]
          }
      set_claim: {
        Args: {
          user_id: string
          claim_key: string
          claim_value: string
        }
        Returns: undefined
      }
    }
    Enums: {
      subscription_level: "basic" | "premium"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
