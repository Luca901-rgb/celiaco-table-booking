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
      admins: {
        Row: {
          created_at: string
          email: string
          id: string
          password_hash: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          password_hash: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          password_hash?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          can_review: boolean
          created_at: string | null
          customer_id: string | null
          date: string
          has_arrived: boolean
          id: string
          number_of_guests: number
          qr_code: string | null
          restaurant_id: string | null
          special_requests: string | null
          status: string
          time: string
        }
        Insert: {
          can_review?: boolean
          created_at?: string | null
          customer_id?: string | null
          date: string
          has_arrived?: boolean
          id?: string
          number_of_guests: number
          qr_code?: string | null
          restaurant_id?: string | null
          special_requests?: string | null
          status: string
          time: string
        }
        Update: {
          can_review?: boolean
          created_at?: string | null
          customer_id?: string | null
          date?: string
          has_arrived?: boolean
          id?: string
          number_of_guests?: number
          qr_code?: string | null
          restaurant_id?: string | null
          special_requests?: string | null
          status?: string
          time?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_bookings_customer"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          id: string
          restaurant_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          restaurant_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          restaurant_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      menuitems: {
        Row: {
          allergens: string[] | null
          category: string | null
          description: string | null
          id: string
          image: string | null
          is_available: boolean | null
          is_gluten_free: boolean | null
          name: string
          price: number
          restaurant_id: string | null
        }
        Insert: {
          allergens?: string[] | null
          category?: string | null
          description?: string | null
          id?: string
          image?: string | null
          is_available?: boolean | null
          is_gluten_free?: boolean | null
          name: string
          price: number
          restaurant_id?: string | null
        }
        Update: {
          allergens?: string[] | null
          category?: string | null
          description?: string | null
          id?: string
          image?: string | null
          is_available?: boolean | null
          is_gluten_free?: boolean | null
          name?: string
          price?: number
          restaurant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menuitems_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string | null
          commission_amount: number
          created_at: string
          id: string
          payment_date: string | null
          payment_status: string
          restaurant_id: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          commission_amount?: number
          created_at?: string
          id?: string
          payment_date?: string | null
          payment_status?: string
          restaurant_id?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          commission_amount?: number
          created_at?: string
          id?: string
          payment_date?: string | null
          payment_status?: string
          restaurant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      push_tokens: {
        Row: {
          device_info: string | null
          id: string
          token: string
          user_id: string | null
        }
        Insert: {
          device_info?: string | null
          id?: string
          token: string
          user_id?: string | null
        }
        Update: {
          device_info?: string | null
          id?: string
          token?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "push_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      qr_code_logs: {
        Row: {
          booking_id: string | null
          id: string
          scanned_at: string | null
          status: string | null
        }
        Insert: {
          booking_id?: string | null
          id?: string
          scanned_at?: string | null
          status?: string | null
        }
        Update: {
          booking_id?: string | null
          id?: string
          scanned_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qr_code_logs_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          address: string | null
          average_rating: number | null
          category: string | null
          city: string | null
          cover_image: string | null
          description: string | null
          email: string | null
          id: string
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          owner_id: string | null
          phone: string | null
          total_reviews: number | null
          website: string | null
        }
        Insert: {
          address?: string | null
          average_rating?: number | null
          category?: string | null
          city?: string | null
          cover_image?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          owner_id?: string | null
          phone?: string | null
          total_reviews?: number | null
          website?: string | null
        }
        Update: {
          address?: string | null
          average_rating?: number | null
          category?: string | null
          city?: string | null
          cover_image?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          owner_id?: string | null
          phone?: string | null
          total_reviews?: number | null
          website?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string | null
          comment: string | null
          customer_id: string | null
          id: string
          is_verified: boolean | null
          rating: number
          restaurant_id: string | null
        }
        Insert: {
          booking_id?: string | null
          comment?: string | null
          customer_id?: string | null
          id?: string
          is_verified?: boolean | null
          rating: number
          restaurant_id?: string | null
        }
        Update: {
          booking_id?: string | null
          comment?: string | null
          customer_id?: string | null
          id?: string
          is_verified?: boolean | null
          rating?: number
          restaurant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_reviews_customer"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          address: string | null
          city: string | null
          date_of_birth: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          user_id: string | null
          user_type: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          date_of_birth?: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          phone?: string | null
          user_id?: string | null
          user_type: string
        }
        Update: {
          address?: string | null
          city?: string | null
          date_of_birth?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          user_id?: string | null
          user_type?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          firebase_uid: string | null
          id: string
          name: string
        }
        Insert: {
          firebase_uid?: string | null
          id?: string
          name: string
        }
        Update: {
          firebase_uid?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
