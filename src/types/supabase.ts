export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      processing_history: {
        Row: {
          created_at: string
          id: string
          image_count: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_count: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "processing_history_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          monthly_limit: number
          monthly_usage: number
          subscription_tier: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          monthly_limit?: number
          monthly_usage?: number
          subscription_tier?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          monthly_limit?: number
          monthly_usage?: number
          subscription_tier?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
