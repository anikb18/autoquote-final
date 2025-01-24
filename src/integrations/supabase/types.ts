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
      affiliate_referrals: {
        Row: {
          commission_earned: number | null
          converted_at: string | null
          created_at: string | null
          id: string
          referred_user_id: string
          referrer_id: string
          status: string | null
        }
        Insert: {
          commission_earned?: number | null
          converted_at?: string | null
          created_at?: string | null
          id?: string
          referred_user_id: string
          referrer_id: string
          status?: string | null
        }
        Update: {
          commission_earned?: number | null
          converted_at?: string | null
          created_at?: string | null
          id?: string
          referred_user_id?: string
          referrer_id?: string
          status?: string | null
        }
        Relationships: []
      }
      affiliate_settings: {
        Row: {
          commission_rate: number
          created_at: string | null
          id: string
          paid_earnings: number | null
          pending_earnings: number | null
          referral_code: string
          total_earnings: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          commission_rate?: number
          created_at?: string | null
          id?: string
          paid_earnings?: number | null
          pending_earnings?: number | null
          referral_code: string
          total_earnings?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          commission_rate?: number
          created_at?: string | null
          id?: string
          paid_earnings?: number | null
          pending_earnings?: number | null
          referral_code?: string
          total_earnings?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
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
      blog_posts: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          image_alt: string | null
          image_metadata: Json | null
          published_at: string | null
          status: Database["public"]["Enums"]["blog_post_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          image_alt?: string | null
          image_metadata?: Json | null
          published_at?: string | null
          status?: Database["public"]["Enums"]["blog_post_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          image_alt?: string | null
          image_metadata?: Json | null
          published_at?: string | null
          status?: Database["public"]["Enums"]["blog_post_status"] | null
          title?: string
          updated_at?: string | null
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
      coupons: {
        Row: {
          active: boolean | null
          code: string
          conditions: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          discount_type: Database["public"]["Enums"]["coupon_discount_type"]
          discount_value: number
          expires_at: string | null
          id: string
          name: string
          usage_count: number | null
          usage_limit: number | null
        }
        Insert: {
          active?: boolean | null
          code: string
          conditions?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          discount_type: Database["public"]["Enums"]["coupon_discount_type"]
          discount_value: number
          expires_at?: string | null
          id?: string
          name: string
          usage_count?: number | null
          usage_limit?: number | null
        }
        Update: {
          active?: boolean | null
          code?: string
          conditions?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          discount_type?: Database["public"]["Enums"]["coupon_discount_type"]
          discount_value?: number
          expires_at?: string | null
          id?: string
          name?: string
          usage_count?: number | null
          usage_limit?: number | null
        }
        Relationships: []
      }
      dashboard_data: {
        Row: {
          active_quotes: number | null
          completed_quotes: number | null
          created_at: string | null
          id: string
          metrics_data: Json | null
          total_quotes: number | null
          total_revenue: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          active_quotes?: number | null
          completed_quotes?: number | null
          created_at?: string | null
          id?: string
          metrics_data?: Json | null
          total_quotes?: number | null
          total_revenue?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          active_quotes?: number | null
          completed_quotes?: number | null
          created_at?: string | null
          id?: string
          metrics_data?: Json | null
          total_quotes?: number | null
          total_revenue?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
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
      dealer_analytics: {
        Row: {
          conversion_rate: number | null
          created_at: string | null
          date_range_end: string | null
          date_range_start: string | null
          dealer_id: string | null
          drill_down_data: Json | null
          id: string
          metric_type: string
          period_end: string
          period_start: string
          profit_margin: number | null
          quote_response_time: unknown | null
          total_revenue: number | null
          value: number
        }
        Insert: {
          conversion_rate?: number | null
          created_at?: string | null
          date_range_end?: string | null
          date_range_start?: string | null
          dealer_id?: string | null
          drill_down_data?: Json | null
          id?: string
          metric_type: string
          period_end: string
          period_start: string
          profit_margin?: number | null
          quote_response_time?: unknown | null
          total_revenue?: number | null
          value: number
        }
        Update: {
          conversion_rate?: number | null
          created_at?: string | null
          date_range_end?: string | null
          date_range_start?: string | null
          dealer_id?: string | null
          drill_down_data?: Json | null
          id?: string
          metric_type?: string
          period_end?: string
          period_start?: string
          profit_margin?: number | null
          quote_response_time?: unknown | null
          total_revenue?: number | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "dealer_analytics_dealer_profiles_fk"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dealer_bids: {
        Row: {
          amount: number
          created_at: string | null
          dealer_id: string | null
          id: string
          quote_id: string | null
          status: string | null
          updated_at: string | null
          visibility: Database["public"]["Enums"]["bid_visibility"] | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          dealer_id?: string | null
          id?: string
          quote_id?: string | null
          status?: string | null
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["bid_visibility"] | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          dealer_id?: string | null
          id?: string
          quote_id?: string | null
          status?: string | null
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["bid_visibility"] | null
        }
        Relationships: [
          {
            foreignKeyName: "dealer_bids_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      dealer_leads: {
        Row: {
          brands: string
          created_at: string | null
          dealership_name: string
          email: string
          id: string
          location: string
          notes: string | null
          phone: string
          preferred_contact: string
          source: string
          status: Database["public"]["Enums"]["dealer_lead_status"] | null
          updated_at: string | null
          volume: string
        }
        Insert: {
          brands: string
          created_at?: string | null
          dealership_name: string
          email: string
          id?: string
          location: string
          notes?: string | null
          phone: string
          preferred_contact: string
          source: string
          status?: Database["public"]["Enums"]["dealer_lead_status"] | null
          updated_at?: string | null
          volume: string
        }
        Update: {
          brands?: string
          created_at?: string | null
          dealership_name?: string
          email?: string
          id?: string
          location?: string
          notes?: string | null
          phone?: string
          preferred_contact?: string
          source?: string
          status?: Database["public"]["Enums"]["dealer_lead_status"] | null
          updated_at?: string | null
          volume?: string
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
          first_name: string | null
          id: string
          last_name: string | null
          subscription_type:
            | Database["public"]["Enums"]["subscription_level"]
            | null
        }
        Insert: {
          active?: boolean | null
          dealer_name: string
          first_name?: string | null
          id: string
          last_name?: string | null
          subscription_type?:
            | Database["public"]["Enums"]["subscription_level"]
            | null
        }
        Update: {
          active?: boolean | null
          dealer_name?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          subscription_type?:
            | Database["public"]["Enums"]["subscription_level"]
            | null
        }
        Relationships: []
      }
      dealer_quotes: {
        Row: {
          alternative_options: Json | null
          created_at: string | null
          dealer_id: string | null
          id: string
          is_accepted: boolean | null
          quote_id: string | null
          response_date: string | null
          response_notes: string | null
          response_status: string | null
          status: string | null
        }
        Insert: {
          alternative_options?: Json | null
          created_at?: string | null
          dealer_id?: string | null
          id?: string
          is_accepted?: boolean | null
          quote_id?: string | null
          response_date?: string | null
          response_notes?: string | null
          response_status?: string | null
          status?: string | null
        }
        Update: {
          alternative_options?: Json | null
          created_at?: string | null
          dealer_id?: string | null
          id?: string
          is_accepted?: boolean | null
          quote_id?: string | null
          response_date?: string | null
          response_notes?: string | null
          response_status?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dealer_quotes_dealer_profiles_fk"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealer_profiles"
            referencedColumns: ["id"]
          },
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
      financing_calculations: {
        Row: {
          created_at: string | null
          down_payment: number | null
          id: string
          interest_rate: number
          loan_amount: number
          monthly_payment: number
          province: string | null
          quote_id: string | null
          tax_rate: number
          term_months: number
          total_with_tax: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          down_payment?: number | null
          id?: string
          interest_rate: number
          loan_amount: number
          monthly_payment: number
          province?: string | null
          quote_id?: string | null
          tax_rate: number
          term_months: number
          total_with_tax: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          down_payment?: number | null
          id?: string
          interest_rate?: number
          loan_amount?: number
          monthly_payment?: number
          province?: string | null
          quote_id?: string | null
          tax_rate?: number
          term_months?: number
          total_with_tax?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financing_calculations_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_quotes: {
        Row: {
          annual_premium: number
          coverage_type: string
          created_at: string | null
          deductible: number
          id: string
          provider: string | null
          quote_id: string | null
          updated_at: string | null
        }
        Insert: {
          annual_premium: number
          coverage_type: string
          created_at?: string | null
          deductible: number
          id?: string
          provider?: string | null
          quote_id?: string | null
          updated_at?: string | null
        }
        Update: {
          annual_premium?: number
          coverage_type?: string
          created_at?: string | null
          deductible?: number
          id?: string
          provider?: string | null
          quote_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_quotes_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_pre_approvals: {
        Row: {
          annual_income: number | null
          approved_amount: number | null
          created_at: string | null
          credit_score: number | null
          id: string
          interest_rate: number | null
          monthly_obligations: number | null
          quote_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          annual_income?: number | null
          approved_amount?: number | null
          created_at?: string | null
          credit_score?: number | null
          id?: string
          interest_rate?: number | null
          monthly_obligations?: number | null
          quote_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          annual_income?: number | null
          approved_amount?: number | null
          created_at?: string | null
          credit_score?: number | null
          id?: string
          interest_rate?: number | null
          monthly_obligations?: number | null
          quote_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loan_pre_approvals_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_sends: {
        Row: {
          error_message: string | null
          id: string
          metadata: Json | null
          newsletter_id: string | null
          sent_at: string | null
          status: string | null
          subscriber_id: string | null
        }
        Insert: {
          error_message?: string | null
          id?: string
          metadata?: Json | null
          newsletter_id?: string | null
          sent_at?: string | null
          status?: string | null
          subscriber_id?: string | null
        }
        Update: {
          error_message?: string | null
          id?: string
          metadata?: Json | null
          newsletter_id?: string | null
          sent_at?: string | null
          status?: string | null
          subscriber_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_sends_newsletter_id_fkey"
            columns: ["newsletter_id"]
            isOneToOne: false
            referencedRelation: "newsletters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "newsletter_sends_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "newsletter_subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          status: string | null
          subscribed_at: string | null
          subscribed_from: string | null
          user_id: string | null
        }
        Insert: {
          email: string
          id?: string
          status?: string | null
          subscribed_at?: string | null
          subscribed_from?: string | null
          user_id?: string | null
        }
        Update: {
          email?: string
          id?: string
          status?: string | null
          subscribed_at?: string | null
          subscribed_from?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      newsletters: {
        Row: {
          content: string
          created_at: string | null
          filter_criteria: Json | null
          id: string
          metadata: Json | null
          scheduled_for: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["newsletter_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          filter_criteria?: Json | null
          id?: string
          metadata?: Json | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["newsletter_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          filter_criteria?: Json | null
          id?: string
          metadata?: Json | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["newsletter_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
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
      pages: {
        Row: {
          created_at: string | null
          description: string
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          title?: string
          updated_at?: string | null
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
      plaid_accounts: {
        Row: {
          account_mask: string | null
          account_subtype: string | null
          account_type: string | null
          created_at: string | null
          id: string
          institution_id: string | null
          institution_name: string | null
          plaid_access_token: string | null
          plaid_item_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_mask?: string | null
          account_subtype?: string | null
          account_type?: string | null
          created_at?: string | null
          id?: string
          institution_id?: string | null
          institution_name?: string | null
          plaid_access_token?: string | null
          plaid_item_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_mask?: string | null
          account_subtype?: string | null
          account_type?: string | null
          created_at?: string | null
          id?: string
          institution_id?: string | null
          institution_name?: string | null
          plaid_access_token?: string | null
          plaid_item_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      plaid_transactions: {
        Row: {
          amount: number | null
          category: string[] | null
          created_at: string | null
          date: string | null
          id: string
          merchant_name: string | null
          pending: boolean | null
          plaid_account_id: string
          transaction_id: string | null
        }
        Insert: {
          amount?: number | null
          category?: string[] | null
          created_at?: string | null
          date?: string | null
          id?: string
          merchant_name?: string | null
          pending?: boolean | null
          plaid_account_id: string
          transaction_id?: string | null
        }
        Update: {
          amount?: number | null
          category?: string[] | null
          created_at?: string | null
          date?: string | null
          id?: string
          merchant_name?: string | null
          pending?: boolean | null
          plaid_account_id?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plaid_transactions_plaid_account_id_fkey"
            columns: ["plaid_account_id"]
            isOneToOne: false
            referencedRelation: "plaid_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_plans: {
        Row: {
          annual_price: number | null
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          is_featured: boolean | null
          metadata: Json | null
          monthly_price: number | null
          name: string | null
          stripe_price_id: string | null
          stripe_product_id: string | null
        }
        Insert: {
          annual_price?: number | null
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_featured?: boolean | null
          metadata?: Json | null
          monthly_price?: number | null
          name?: string | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
        }
        Update: {
          annual_price?: number | null
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_featured?: boolean | null
          metadata?: Json | null
          monthly_price?: number | null
          name?: string | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
        }
        Relationships: []
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
      quote_responses: {
        Row: {
          created_at: string | null
          dealer_quote_id: string | null
          id: string
          notes: string | null
          quote_id: string | null
          response_date: string | null
          response_type: string
        }
        Insert: {
          created_at?: string | null
          dealer_quote_id?: string | null
          id?: string
          notes?: string | null
          quote_id?: string | null
          response_date?: string | null
          response_type: string
        }
        Update: {
          created_at?: string | null
          dealer_quote_id?: string | null
          id?: string
          notes?: string | null
          quote_id?: string | null
          response_date?: string | null
          response_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_responses_dealer_quote_id_fkey"
            columns: ["dealer_quote_id"]
            isOneToOne: false
            referencedRelation: "dealer_quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_responses_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          annual_kilometers: number | null
          car_details: Json | null
          created_at: string | null
          desired_vehicle_details: Json | null
          financing_preference: string | null
          has_trade_in: boolean | null
          id: string
          interested_in_alternatives: boolean | null
          lease_term: number | null
          price_paid: number | null
          pricing_option: string | null
          selected_colors: string[] | null
          status: string | null
          trade_in_details: Json | null
          trade_in_visibility_days: number | null
          trade_in_visibility_start: string | null
          user_id: string
        }
        Insert: {
          annual_kilometers?: number | null
          car_details?: Json | null
          created_at?: string | null
          desired_vehicle_details?: Json | null
          financing_preference?: string | null
          has_trade_in?: boolean | null
          id?: string
          interested_in_alternatives?: boolean | null
          lease_term?: number | null
          price_paid?: number | null
          pricing_option?: string | null
          selected_colors?: string[] | null
          status?: string | null
          trade_in_details?: Json | null
          trade_in_visibility_days?: number | null
          trade_in_visibility_start?: string | null
          user_id: string
        }
        Update: {
          annual_kilometers?: number | null
          car_details?: Json | null
          created_at?: string | null
          desired_vehicle_details?: Json | null
          financing_preference?: string | null
          has_trade_in?: boolean | null
          id?: string
          interested_in_alternatives?: boolean | null
          lease_term?: number | null
          price_paid?: number | null
          pricing_option?: string | null
          selected_colors?: string[] | null
          status?: string | null
          trade_in_details?: Json | null
          trade_in_visibility_days?: number | null
          trade_in_visibility_start?: string | null
          user_id?: string
        }
        Relationships: []
      }
      role_change_history: {
        Row: {
          changed_by: string
          created_at: string | null
          id: string
          new_role: Database["public"]["Enums"]["user_role_type"]
          old_role: Database["public"]["Enums"]["user_role_type"] | null
          user_id: string
        }
        Insert: {
          changed_by: string
          created_at?: string | null
          id?: string
          new_role: Database["public"]["Enums"]["user_role_type"]
          old_role?: Database["public"]["Enums"]["user_role_type"] | null
          user_id: string
        }
        Update: {
          changed_by?: string
          created_at?: string | null
          id?: string
          new_role?: Database["public"]["Enums"]["user_role_type"]
          old_role?: Database["public"]["Enums"]["user_role_type"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_change_history_changed_by_fkey1"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_change_history_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_transactions: {
        Row: {
          created_at: string | null
          dealer_id: string | null
          gross_profit_percentage: number | null
          id: string
          invoice_price: number
          quote_id: string | null
          selling_price: number
          status: string | null
          transaction_date: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dealer_id?: string | null
          gross_profit_percentage?: number | null
          id?: string
          invoice_price: number
          quote_id?: string | null
          selling_price: number
          status?: string | null
          transaction_date?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dealer_id?: string | null
          gross_profit_percentage?: number | null
          id?: string
          invoice_price?: number
          quote_id?: string | null
          selling_price?: number
          status?: string | null
          transaction_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_transactions_dealer_id_fkey"
            columns: ["dealer_id"]
            isOneToOne: false
            referencedRelation: "dealer_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_transactions_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_emails: {
        Row: {
          created_at: string | null
          error_message: string | null
          html_content: string
          id: string
          scheduled_for: string
          sent_at: string | null
          status: Database["public"]["Enums"]["email_status"] | null
          subject: string
          to_addresses: string[]
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          html_content: string
          id?: string
          scheduled_for: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["email_status"] | null
          subject: string
          to_addresses: string[]
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          html_content?: string
          id?: string
          scheduled_for?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["email_status"] | null
          subject?: string
          to_addresses?: string[]
        }
        Relationships: []
      }
      seo_settings: {
        Row: {
          created_at: string | null
          id: string
          meta_description: string | null
          meta_keywords: string[] | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          page_identifier: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          meta_description?: string | null
          meta_keywords?: string[] | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_identifier: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          meta_description?: string | null
          meta_keywords?: string[] | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_identifier?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          category: string
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value?: Json | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json | null
        }
        Relationships: []
      }
      support_responses: {
        Row: {
          created_at: string | null
          id: string
          is_admin_response: boolean | null
          responder_id: string
          response: string
          ticket_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_admin_response?: boolean | null
          responder_id: string
          response: string
          ticket_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_admin_response?: boolean | null
          responder_id?: string
          response?: string
          ticket_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_responses_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          category: string
          created_at: string | null
          id: string
          message: string
          status: string | null
          subject: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          message: string
          status?: string | null
          subject: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          message?: string
          status?: string | null
          subject?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      trade_in_requests: {
        Row: {
          accident_history: boolean | null
          condition_report: Json
          created_at: string | null
          estimated_value: number | null
          id: string
          location: string
          mileage: number
          ownership_duration: string | null
          payment_amount: number | null
          payment_status: string | null
          photo_urls: string[] | null
          service_history: boolean | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          vehicle_info: Json
        }
        Insert: {
          accident_history?: boolean | null
          condition_report: Json
          created_at?: string | null
          estimated_value?: number | null
          id?: string
          location: string
          mileage: number
          ownership_duration?: string | null
          payment_amount?: number | null
          payment_status?: string | null
          photo_urls?: string[] | null
          service_history?: boolean | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_info: Json
        }
        Update: {
          accident_history?: boolean | null
          condition_report?: Json
          created_at?: string | null
          estimated_value?: number | null
          id?: string
          location?: string
          mileage?: number
          ownership_duration?: string | null
          payment_amount?: number | null
          payment_status?: string | null
          photo_urls?: string[] | null
          service_history?: boolean | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_info?: Json
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
          role: Database["public"]["Enums"]["user_role_type"]
        }
        Insert: {
          created_at?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role_type"]
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role_type"]
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_profile_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      vehicle_photos: {
        Row: {
          created_at: string | null
          id: string
          photo_url: string
          quote_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          photo_url: string
          quote_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          photo_url?: string
          quote_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_photos_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
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
          trim_level: string | null
        }
        Insert: {
          body_style?: string | null
          created_at?: string | null
          engine_type?: string | null
          id: string
          model_id?: string | null
          name: string
          trim_level?: string | null
        }
        Update: {
          body_style?: string | null
          created_at?: string | null
          engine_type?: string | null
          id?: string
          model_id?: string | null
          name?: string
          trim_level?: string | null
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
      wrappers_fdw_stats: {
        Row: {
          bytes_in: number | null
          bytes_out: number | null
          create_times: number | null
          created_at: string
          fdw_name: string
          metadata: Json | null
          rows_in: number | null
          rows_out: number | null
          updated_at: string
        }
        Insert: {
          bytes_in?: number | null
          bytes_out?: number | null
          create_times?: number | null
          created_at?: string
          fdw_name: string
          metadata?: Json | null
          rows_in?: number | null
          rows_out?: number | null
          updated_at?: string
        }
        Update: {
          bytes_in?: number | null
          bytes_out?: number | null
          create_times?: number | null
          created_at?: string
          fdw_name?: string
          metadata?: Json | null
          rows_in?: number | null
          rows_out?: number | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_coupon: {
        Args: {
          coupon_code: string
          coupon_name: string
          coupon_description: string
          discount_type: string
          discount_value: number
          usage_limit: number
          expires_at: string
        }
        Returns: undefined
      }
      airtable_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      airtable_fdw_meta: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          version: string
          author: string
          website: string
        }[]
      }
      airtable_fdw_validator: {
        Args: {
          options: string[]
          catalog: unknown
        }
        Returns: undefined
      }
      auth0_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      auth0_fdw_meta: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          version: string
          author: string
          website: string
        }[]
      }
      auth0_fdw_validator: {
        Args: {
          options: string[]
          catalog: unknown
        }
        Returns: undefined
      }
      big_query_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      big_query_fdw_meta: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          version: string
          author: string
          website: string
        }[]
      }
      big_query_fdw_validator: {
        Args: {
          options: string[]
          catalog: unknown
        }
        Returns: undefined
      }
      calculate_dealer_metrics: {
        Args: {
          dealer_id: string
          start_date: string
        }
        Returns: {
          total_bids: number
          won_bids: number
          total_revenue: number
          average_response_time: unknown
        }[]
      }
      click_house_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      click_house_fdw_meta: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          version: string
          author: string
          website: string
        }[]
      }
      click_house_fdw_validator: {
        Args: {
          options: string[]
          catalog: unknown
        }
        Returns: undefined
      }
      cognito_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      cognito_fdw_meta: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          version: string
          author: string
          website: string
        }[]
      }
      cognito_fdw_validator: {
        Args: {
          options: string[]
          catalog: unknown
        }
        Returns: undefined
      }
      create_admin_user: {
        Args: {
          email: string
          password: string
          full_name: string
        }
        Returns: string
      }
      delete_seo_setting: {
        Args: {
          p_page_identifier: string
        }
        Returns: undefined
      }
      firebase_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      firebase_fdw_meta: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          version: string
          author: string
          website: string
        }[]
      }
      firebase_fdw_validator: {
        Args: {
          options: string[]
          catalog: unknown
        }
        Returns: undefined
      }
      get_admin_metrics: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["CompositeTypes"]["admin_metrics_result"]
      }
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
      get_seo_setting: {
        Args: {
          p_page_identifier: string
        }
        Returns: {
          id: number
          page_identifier: string
          title: string
          meta_description: string
          meta_keywords: string[]
          og_title: string
          og_description: string
          og_image: string
          created_at: string
          updated_at: string
        }[]
      }
      hello_world_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      hello_world_fdw_meta: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          version: string
          author: string
          website: string
        }[]
      }
      hello_world_fdw_validator: {
        Args: {
          options: string[]
          catalog: unknown
        }
        Returns: undefined
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      logflare_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      logflare_fdw_meta: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          version: string
          author: string
          website: string
        }[]
      }
      logflare_fdw_validator: {
        Args: {
          options: string[]
          catalog: unknown
        }
        Returns: undefined
      }
      mssql_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      mssql_fdw_meta: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          version: string
          author: string
          website: string
        }[]
      }
      mssql_fdw_validator: {
        Args: {
          options: string[]
          catalog: unknown
        }
        Returns: undefined
      }
      redis_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      redis_fdw_meta: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          version: string
          author: string
          website: string
        }[]
      }
      redis_fdw_validator: {
        Args: {
          options: string[]
          catalog: unknown
        }
        Returns: undefined
      }
      s3_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      s3_fdw_meta: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          version: string
          author: string
          website: string
        }[]
      }
      s3_fdw_validator: {
        Args: {
          options: string[]
          catalog: unknown
        }
        Returns: undefined
      }
      set_claim: {
        Args: {
          user_id: string
          claim_key: string
          claim_value: string
        }
        Returns: undefined
      }
      stripe_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      stripe_fdw_meta: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          version: string
          author: string
          website: string
        }[]
      }
      stripe_fdw_validator: {
        Args: {
          options: string[]
          catalog: unknown
        }
        Returns: undefined
      }
      update_pricing_plan: {
        Args: {
          plan_id: string
          plan_name: string
          plan_description: string
          monthly_price: number
          annual_price: number
          is_featured: boolean
        }
        Returns: undefined
      }
      upsert_seo_setting: {
        Args: {
          p_page_identifier: string
          p_title: string
          p_meta_description: string
          p_meta_keywords: string[]
          p_og_title: string
          p_og_description: string
          p_og_image: string
        }
        Returns: undefined
      }
      wasm_fdw_handler: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      wasm_fdw_meta: {
        Args: Record<PropertyKey, never>
        Returns: {
          name: string
          version: string
          author: string
          website: string
        }[]
      }
      wasm_fdw_validator: {
        Args: {
          options: string[]
          catalog: unknown
        }
        Returns: undefined
      }
    }
    Enums: {
      bid_visibility: "private" | "public"
      blog_post_status: "draft" | "published" | "archived"
      coupon_condition_type:
        | "subscription_type"
        | "time_limited"
        | "first_time_user"
        | "specific_user"
      coupon_discount_type: "percentage" | "fixed"
      dealer_lead_status:
        | "new"
        | "contacted"
        | "qualified"
        | "converted"
        | "lost"
      email_status: "pending" | "sent" | "failed"
      newsletter_status: "draft" | "scheduled" | "sent"
      subscription_level: "basic" | "premium"
      user_role: "admin" | "dealer" | "user"
      user_role_type: "super_admin" | "admin" | "dealer" | "user"
    }
    CompositeTypes: {
      admin_metrics_result: {
        total_sales: number | null
        active_dealers: number | null
        total_users: number | null
        conversion_rate: number | null
      }
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
